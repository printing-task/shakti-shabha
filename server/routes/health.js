const express = require('express');
const router = express.Router();
const { isDbConnected } = require('../db');

/**
 * @route GET /health or /api/health
 * @desc Render 5-minute keep-alive health check endpoint
 */
router.get('/', (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;

  res.status(200).json({
    status: 'ok',
    service: 'shakti-sabha-api',
    timestamp: new Date().toISOString(),
    uptime: `${hours}h ${minutes}m ${seconds}s (${uptimeSeconds}s total)`,
    database: isDbConnected() ? 'connected' : 'disconnected',
    keepAlive: 'Active - responding to 5-minute health check pings'
  });
});

module.exports = router;
