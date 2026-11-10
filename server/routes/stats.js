const express = require('express');
const router = express.Router();
const { getCollection } = require('../db');

/**
 * @route GET /api/stats
 * @desc Get counts for all modules for Admin Dashboard
 */
router.get('/', async (req, res) => {
  try {
    const [articlesCount, coursesCount, counsellingCount, photosCount] = await Promise.all([
      getCollection('articles').countDocuments(),
      getCollection('courses').countDocuments(),
      getCollection('counselling_requests').countDocuments(),
      getCollection('gallery_photos').countDocuments(),
    ]);

    res.json({
      articles: articlesCount,
      courses: coursesCount,
      counselling: counsellingCount,
      gallery: photosCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
