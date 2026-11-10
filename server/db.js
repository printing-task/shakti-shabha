const { MongoClient } = require('mongodb');
require('dotenv').config();

const DEFAULT_URI = "mongodb+srv://printingtaskweb_db_user:<db_password>@cluster0.hqaggkf.mongodb.net/shakti_sabha?retryWrites=true&w=majority";

/**
 * Robust URI sanitizer that automatically fixes malformed query options,
 * strips problematic compressor flags, and corrects truncated retryWri.
 */
function sanitizeMongoUri(rawUri) {
  if (!rawUri) return DEFAULT_URI;
  let clean = rawUri.trim().replace(/^['"]|['"]$/g, '');

  // Strip compressors=zlib as it can cause TLS/compression stream issues on Node 22+
  clean = clean.replace(/([?&])compressors=[^&]*/g, '');

  // Fix query parameters if malformed
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
      } else {
        // Parameter with no value (e.g. truncated "retryWri")
        if (pair.toLowerCase().startsWith('retrywri')) {
          validParams.push('retryWrites=true');
        }
      }
    }

    // Ensure retryWrites=true is included
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

/**
 * Connect to MongoDB Atlas
 */
async function connectToMongoDB() {
  if (db && isConnected) {
    return { client, db };
  }

  // Validate that user replaced <db_password> placeholder
  if (uri.includes('<db_password>')) {
    console.warn('⚠️ Warning: MONGODB_URI still contains <db_password> placeholder. Please set your real MongoDB password in Render Environment Variables.');
  }

  // Safely display masked URI in logs for easy debugging
  const maskedUri = uri.replace(/:([^@/]+)@/, ':****@');
  console.log(`🔌 Attempting connection to MongoDB Atlas: ${maskedUri}`);

  try {
    client = new MongoClient(uri, {
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    await client.connect();
    
    // Default to 'shakti_sabha' database unless specified in URI
    db = client.db('shakti_sabha');
    isConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas!');
    return { client, db };
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    isConnected = false;
    throw err;
  }
}

/**
 * Get active MongoDB Database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Please call connectToMongoDB() first.');
  }
  return db;
}

/**
 * Get a specific collection helper
 */
function getCollection(collectionName) {
  return getDb().collection(collectionName);
}

/**
 * Check if DB is currently connected
 */
function isDbConnected() {
  return isConnected;
}

/**
 * Gracefully disconnect from MongoDB (call on application termination)
 */
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
