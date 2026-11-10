const express = require('express');
const router = express.Router();
const { getCollection } = require('../db');
const { ObjectId } = require('mongodb');

// Helper to query by either ObjectId or custom string id
function buildIdQuery(id) {
  if (ObjectId.isValid(id) && id.length === 24) {
    return { $or: [{ _id: new ObjectId(id) }, { id: id }] };
  }
  return { id: id };
}

/**
 * @route GET /api/articles
 */
router.get('/', async (req, res) => {
  try {
    const col = getCollection('articles');
    const { published, category, limit = 50 } = req.query;

    const query = {};
    if (published === 'true') query.published = true;
    if (category) query.category = category;

    const articles = await col.find(query).sort({ created_at: -1 }).limit(Number(limit)).toArray();
    // Normalize IDs for frontend compatibility
    const normalized = articles.map(a => ({
      ...a,
      id: a.id || a._id.toString(),
    }));

    res.json(normalized);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

/**
 * @route GET /api/articles/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const col = getCollection('articles');
    const article = await col.findOne(buildIdQuery(req.params.id));
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ ...article, id: article.id || article._id.toString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

/**
 * @route POST /api/articles
 */
router.post('/', async (req, res) => {
  try {
    const col = getCollection('articles');
    const payload = req.body;
    const now = new Date().toISOString();

    const newDoc = {
      ...payload,
      id: payload.id || `art_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      created_at: payload.created_at || now,
      updated_at: now,
      published: payload.published !== undefined ? payload.published : false,
      tags: Array.isArray(payload.tags) ? payload.tags : [],
    };

    const result = await col.insertOne(newDoc);
    res.status(201).json({ ...newDoc, _id: result.insertedId });
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

/**
 * @route PUT /api/articles/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const col = getCollection('articles');
    const payload = { ...req.body, updated_at: new Date().toISOString() };
    delete payload._id; // Prevent updating immutable _id

    const result = await col.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: payload },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Article not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

/**
 * @route DELETE /api/articles/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const col = getCollection('articles');
    const result = await col.deleteOne(buildIdQuery(req.params.id));
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router;
