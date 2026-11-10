#!/usr/bin/env node

/**
 * Fallback runner for Render if Start Command is set to "dev start" or "dev"
 */
console.log('🚀 Launching Shakti Sabha Backend Server via dev wrapper...');
require('../server/index.js');
