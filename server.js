import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hostinger / Cloud Deploy: Auto-build frontend if dist does not exist
const distIndex = path.join(__dirname, 'dist', 'index.html');
if (!fs.existsSync(distIndex)) {
  console.log('⚡ [Production Deploy] dist/index.html not found. Building frontend...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ [Production Deploy] Frontend build completed.');
  } catch (err) {
    console.warn('⚠️ [Production Deploy] Auto-build failed, continuing to launch server:', err.message);
  }
}

// Start Express Full-Stack Application
require('./server/index.js');
