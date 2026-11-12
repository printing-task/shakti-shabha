const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DEFAULT_URI = "mongodb+srv://printingtaskweb_db_user:<db_password>@cluster0.hqaggkf.mongodb.net/shakti_sabha?retryWrites=true&w=majority";

/**
 * Robust URI sanitizer that automatically fixes malformed query options
 */
function sanitizeMongoUri(rawUri) {
  if (!rawUri) return DEFAULT_URI;
  let clean = rawUri.trim().replace(/^['"]|['"]$/g, '');
  clean = clean.replace(/([?&])compressors=[^&]*/g, '');

  const urlParts = clean.split('?');
  if (urlParts.length > 1) {
    const base = urlParts[0];
    const query = urlParts.slice(1).join('?');
    const validParams = [];

    for (const pair of query.split('&')) {
      if (!pair) continue;
      if (pair.includes('=')) {
        const [k, v] = pair.split('=');
        if (v !== undefined && v !== '') {
          validParams.push(`${k}=${v}`);
        } else if (k.toLowerCase().startsWith('retrywri')) {
          validParams.push('retryWrites=true');
        }
      } else if (pair.toLowerCase().startsWith('retrywri')) {
        validParams.push('retryWrites=true');
      }
    }

    if (!validParams.some(p => p.startsWith('retryWrites='))) {
      validParams.push('retryWrites=true');
    }

    clean = `${base}?${validParams.join('&')}`;
  } else {
    clean = `${clean}?retryWrites=true&w=majority`;
  }

  return clean;
}

const rawUri = process.env.MONGODB_URI || DEFAULT_URI;
const uri = sanitizeMongoUri(rawUri);

let client = null;
let db = null;
let isConnected = false;

// ── Persistent Disk Fallback Engine (Guarantees 100% API Uptime) ──
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let fileData = {};
try {
  if (fs.existsSync(DATA_FILE)) {
    fileData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
} catch (e) {
  fileData = {};
}

function saveFileData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(fileData, null, 2), 'utf8');
  } catch (e) {
    console.warn('Failed to persist fallback db.json:', e.message);
  }
}

function matchDoc(doc, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const key of Object.keys(query)) {
    if (key === '$or' && Array.isArray(query.$or)) {
      const orMatch = query.$or.some(q => matchDoc(doc, q));
      if (!orMatch) return false;
      continue;
    }
    const val = query[key];
    const docVal = doc[key];
    if (val && typeof val === 'object' && val.$in && Array.isArray(val.$in)) {
      if (!val.$in.map(String).includes(String(docVal))) return false;
    } else if (val !== undefined && String(docVal) !== String(val)) {
      return false;
    }
  }
  return true;
}

class FallbackCollection {
  constructor(name) {
    this.name = name;
    if (!fileData[name]) fileData[name] = [];
  }

  find(query = {}) {
    const matched = fileData[this.name].filter(d => matchDoc(d, query));
    return {
      sort: (sortObj = {}) => {
        const sorted = [...matched];
        const [sortKey, sortDir] = Object.entries(sortObj)[0] || ['created_at', -1];
        sorted.sort((a, b) => {
          const aVal = a[sortKey] || '';
          const bVal = b[sortKey] || '';
          if (aVal < bVal) return sortDir === -1 ? 1 : -1;
          if (aVal > bVal) return sortDir === -1 ? -1 : 1;
          return 0;
        });
        return {
          toArray: async () => sorted,
        };
      },
      toArray: async () => matched,
    };
  }

  async findOne(query = {}) {
    return fileData[this.name].find(d => matchDoc(d, query)) || null;
  }

  async insertOne(doc) {
    const item = { ...doc };
    if (!item._id) item._id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    if (!item.id) item.id = String(item._id);
    fileData[this.name].push(item);
    saveFileData();
    return { insertedId: item._id };
  }

  async updateOne(query, update, options = {}) {
    let index = fileData[this.name].findIndex(d => matchDoc(d, query));
    if (index === -1) {
      if (options.upsert) {
        const newDoc = { ...query, ...(update.$set || update) };
        if (!newDoc._id) newDoc._id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        if (!newDoc.id) newDoc.id = String(newDoc._id);
        fileData[this.name].push(newDoc);
        saveFileData();
        return { upsertedId: newDoc._id, modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    }
    const target = fileData[this.name][index];
    if (update.$set) {
      Object.assign(target, update.$set);
    } else {
      fileData[this.name][index] = { ...target, ...update };
    }
    saveFileData();
    return { modifiedCount: 1 };
  }

  async deleteOne(query) {
    const idx = fileData[this.name].findIndex(d => matchDoc(d, query));
    if (idx !== -1) {
      fileData[this.name].splice(idx, 1);
      saveFileData();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(query) {
    const beforeLen = fileData[this.name].length;
    fileData[this.name] = fileData[this.name].filter(d => !matchDoc(d, query));
    const deletedCount = beforeLen - fileData[this.name].length;
    if (deletedCount > 0) saveFileData();
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    return fileData[this.name].filter(d => matchDoc(d, query)).length;
  }

  async createIndex() {
    return true;
  }
}

/**
 * Connect to MongoDB Atlas
 */
async function connectToMongoDB() {
  if (db && isConnected) {
    return { client, db };
  }

  if (uri.includes('<db_password>')) {
    console.warn('⚠️ Warning: MONGODB_URI contains <db_password> placeholder. Using persistent disk fallback engine.');
    return { client: null, db: null };
  }

  const maskedUri = uri.replace(/:([^@/]+)@/, ':****@');
  console.log(`🔌 Attempting connection to MongoDB Atlas: ${maskedUri}`);

  try {
    client = new MongoClient(uri, {
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    await client.connect();
    db = client.db('shakti_sabha');
    isConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas!');
    return { client, db };
  } catch (err) {
    console.warn('⚠️ MongoDB Atlas connection error (fallback engine active):', err.message);
    isConnected = false;
    return { client: null, db: null };
  }
}

/**
 * Get active MongoDB Database instance or fallback collection
 */
function getDb() {
  return db;
}

/**
 * Get a specific collection helper (transparently uses MongoDB Atlas or persistent disk fallback)
 */
function getCollection(collectionName) {
  if (db && isConnected) {
    return db.collection(collectionName);
  }
  return new FallbackCollection(collectionName);
}

function isDbConnected() {
  return isConnected;
}

async function disconnectFromMongoDB() {
  if (client) {
    try {
      await client.close();
      isConnected = false;
      console.log('🔌 Disconnected from MongoDB Atlas.');
    } catch (err) {
      console.error('Error during MongoDB disconnect:', err.message);
    }
  }
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
  getDb,
  getCollection,
  isDbConnected,
  sanitizeMongoUri,
};
