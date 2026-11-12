const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * @route POST /api/upload
 * Accepts base64 encoded image or URL, writes to local uploads dir, returns persistent URL
 */
router.post('/', async (req, res) => {
  try {
    const { image, filename = 'image.jpg' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // If already a hosted URL, return as-is
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/uploads/'))) {
      return res.json({ url: image, filename });
    }

    // Match base64 data URL pattern: data:image/(png|jpeg|jpg|webp|gif);base64,...
    const matches = typeof image === 'string' && image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches) {
      // Check if it's raw base64
      try {
        const ext = path.extname(filename).replace('.', '') || 'jpg';
        const buffer = Buffer.from(image, 'base64');
        const randomId = crypto.randomBytes(6).toString('hex');
        const safeName = `img_${Date.now()}_${randomId}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, safeName);

        fs.writeFileSync(filePath, buffer);
        return res.json({
          url: `/uploads/${safeName}`,
          filename: safeName,
          size: buffer.length,
        });
      } catch (err) {
        return res.status(400).json({ error: 'Invalid image format or encoding' });
      }
    }

    const mimeExt = matches[1].toLowerCase().replace('jpeg', 'jpg');
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const randomId = crypto.randomBytes(6).toString('hex');
    const safeName = `img_${Date.now()}_${randomId}.${mimeExt}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);

    return res.json({
      url: `/uploads/${safeName}`,
      filename: safeName,
      size: buffer.length,
    });
  } catch (err) {
    console.error('Server upload error:', err);
    return res.status(500).json({ error: 'Failed to process and store image' });
  }
});

module.exports = router;
