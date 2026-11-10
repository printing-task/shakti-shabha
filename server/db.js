const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb+srv://printingtaskweb_db_user:<db_password>@cluster0.hqaggkf.mongodb.net/shakti_sabha?retryWrites=true&w=majority&compressors=zlib";

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
    console.warn('⚠️ Warning: MONGODB_URI still contains <db_password> placeholder. Please set your real MongoDB password in .env or Render Environment Variables.');
  }

  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
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
};
