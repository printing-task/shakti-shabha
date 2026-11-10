const express = require('express');
const router = express.Router();
const { getCollection } = require('../db');
const { ObjectId } = require('mongodb');

function buildIdQuery(id) {
  if (ObjectId.isValid(id) && id.length === 24) {
    return { $or: [{ _id: new ObjectId(id) }, { id: id }] };
  }
  return { id: id };
}

// ----------------- PHOTOS -----------------

/**
 * @route GET /api/gallery/photos
 */
router.get('/photos', async (req, res) => {
  try {
    const col = getCollection('gallery_photos');
    const { category_id } = req.query;

    const query = {};
    if (category_id) query.category_id = category_id;

    const photos = await col.find(query).sort({ created_at: -1 }).toArray();
    const normalized = photos.map(p => ({
      ...p,
      id: p.id || p._id.toString(),
    }));

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery photos' });
  }
});

/**
 * @route POST /api/gallery/photos
 */
router.post('/photos', async (req, res) => {
  try {
    const col = getCollection('gallery_photos');
    const { url, caption = '', category_id } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const newPhoto = {
      id: req.body.id || `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      url,
      caption,
      category_id: category_id || 'general',
      created_at: new Date().toISOString(),
    };

    const result = await col.insertOne(newPhoto);
    res.status(201).json({ ...newPhoto, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save photo' });
  }
});

/**
 * @route DELETE /api/gallery/photos/:id
 */
router.delete('/photos/:id', async (req, res) => {
  try {
    const col = getCollection('gallery_photos');
    const result = await col.deleteOne(buildIdQuery(req.params.id));
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Photo not found' });
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// ----------------- CATEGORIES -----------------

/**
 * @route GET /api/gallery/categories
 */
router.get('/categories', async (req, res) => {
  try {
    const col = getCollection('gallery_categories');
    const categories = await col.find({}).sort({ created_at: 1 }).toArray();
    const normalized = categories.map(c => ({
      ...c,
      id: c.id || c._id.toString(),
    }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * @route POST /api/gallery/categories
 */
router.post('/categories', async (req, res) => {
  try {
    const col = getCollection('gallery_categories');
    const { name, description = '', cover_url = '' } = req.body;

    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const newCat = {
      id: req.body.id || `cat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      description,
      cover_url,
      created_at: new Date().toISOString(),
    };

    const result = await col.insertOne(newCat);
    res.status(201).json({ ...newCat, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

module.exports = router;
