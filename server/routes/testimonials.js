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

/**
 * @route GET /api/testimonials
 */
router.get('/', async (req, res) => {
  try {
    const col = getCollection('testimonials');
    const { published } = req.query;

    const query = {};
    if (published === 'true') query.published = true;

    const list = await col.find(query).sort({ created_at: -1 }).toArray();
    const normalized = list.map(t => ({
      ...t,
      id: t.id || t._id.toString(),
    }));

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

/**
 * @route POST /api/testimonials
 */
router.post('/', async (req, res) => {
  try {
    const col = getCollection('testimonials');
    const payload = req.body;
    const now = new Date().toISOString();

    const newDoc = {
      ...payload,
      id: payload.id || `testi_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      published: payload.published !== undefined ? payload.published : true,
      created_at: payload.created_at || now,
      updated_at: now,
    };

    const result = await col.insertOne(newDoc);
    res.status(201).json({ ...newDoc, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

/**
 * @route PUT /api/testimonials/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const col = getCollection('testimonials');
    const payload = { ...req.body, updated_at: new Date().toISOString() };
    delete payload._id;

    const result = await col.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: payload },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

/**
 * @route DELETE /api/testimonials/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const col = getCollection('testimonials');
    const result = await col.deleteOne(buildIdQuery(req.params.id));
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

module.exports = router;
