require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectToMongoDB, disconnectFromMongoDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration allowing localhost and production domains
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'https://shakti-shabha.vercel.app,http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5-minute keep-alive health check for Render
app.use('/health', require('./routes/health'));
app.use('/api/health', require('./routes/health'));

// REST API Endpoints
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/counselling', require('./routes/counselling'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/stats', require('./routes/stats'));

// Serve Static Frontend from dist (Full-Stack single deployment)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log(`📦 Serving static frontend website from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for React Router
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback API info when dist is not built
  app.get('/', (req, res) => {
    res.json({
      service: 'Shakti Sabha Full-Stack Server',
      status: 'online',
      database: 'MongoDB Atlas',
      healthCheck: '/health',
      endpoints: {
        articles: '/api/articles',
        courses: '/api/courses',
        counselling: '/api/counselling',
        galleryPhotos: '/api/gallery/photos',
        galleryCategories: '/api/gallery/categories',
        testimonials: '/api/testimonials',
        auth: '/api/auth/login',
        stats: '/api/stats',
      },
    });
  });
}

// Self-ping keep alive mechanism (if RENDER_EXTERNAL_URL is configured)
const renderUrl = process.env.RENDER_EXTERNAL_URL;
const pingInterval = Number(process.env.SELF_PING_INTERVAL_MS) || 300000; // 5 minutes

if (renderUrl) {
  console.log(`⏱️ Setting up 5-minute self-ping for Render keep-alive: ${renderUrl}/health`);
  setInterval(async () => {
    try {
      const https = renderUrl.startsWith('https') ? require('https') : require('http');
      https.get(`${renderUrl}/health`, (res) => {
        console.log(`[Keep-Alive Ping] Render health check status: ${res.statusCode} at ${new Date().toLocaleTimeString()}`);
      }).on('error', (err) => {
        console.warn(`[Keep-Alive Ping Warning] ${err.message}`);
      });
    } catch (e) {
      console.warn(`[Keep-Alive Ping Error] ${e.message}`);
    }
  }, pingInterval);
}

// Start server and connect to MongoDB Atlas
async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`🚀 Shakti Sabha Full-Stack Server running on port ${PORT}`);
      console.log(`🏥 5-minute Keep-Alive Health check available at http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('Server started in degraded mode (MongoDB disconnected):', err.message);
    app.listen(PORT, () => {
      console.warn(`⚠️ Server listening on port ${PORT} with database disconnected.`);
    });
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  await disconnectFromMongoDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  await disconnectFromMongoDB();
  process.exit(0);
});

startServer();
