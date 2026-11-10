require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToMongoDB, disconnectFromMongoDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration allowing Vercel production + localhost development
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'https://shakti-shabha.vercel.app,http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server, health pings)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // Allow vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for production webhooks and preview branches
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Keep-alive health check endpoints (essential for Render 5-minute health check)
app.use('/health', require('./routes/health'));
app.use('/api/health', require('./routes/health'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/counselling', require('./routes/counselling'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/stats', require('./routes/stats'));

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Shakti Sabha Backend API',
    status: 'running',
    database: 'MongoDB Atlas',
    healthCheck: '/health',
    documentation: 'All REST endpoints available under /api/*',
  });
});

// Self-ping keep alive mechanism (if RENDER_EXTERNAL_URL is configured)
const renderUrl = process.env.RENDER_EXTERNAL_URL;
const pingInterval = Number(process.env.SELF_PING_INTERVAL_MS) || 300000; // 5 minutes (300,000ms)

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
      console.log(`🚀 Shakti Sabha Server running on port ${PORT}`);
      console.log(`🏥 5-minute Keep-Alive Health check available at http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('Server failed to start due to MongoDB connection failure:', err.message);
    // Still start Express so Render health check can report status and diagnostics
    app.listen(PORT, () => {
      console.warn(`⚠️ Server started on port ${PORT} in degraded mode (MongoDB disconnected). Check your credentials.`);
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
