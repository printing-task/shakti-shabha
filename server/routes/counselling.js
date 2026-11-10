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
 * @route POST /api/counselling
 * @desc Public route: Submit confidential counselling request
 */
router.post('/', async (req, res) => {
  try {
    const col = getCollection('counselling_requests');
    const { name, email, phone, city, concern, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const newRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: email ? email.trim() : '',
      phone: phone.trim(),
      city: city ? city.trim() : '',
      concern: concern || 'General Guidance',
      message: message || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const result = await col.insertOne(newRequest);
    res.status(201).json({
      message: 'Counselling request submitted successfully',
      data: { ...newRequest, _id: result.insertedId }
    });
  } catch (err) {
    console.error('Error submitting counselling request:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

/**
 * @route GET /api/counselling
 * @desc Admin route: List all counselling requests
 */
router.get('/', async (req, res) => {
  try {
    const col = getCollection('counselling_requests');
    const { status, limit = 100 } = req.query;

    const query = {};
    if (status) query.status = status;

    const requests = await col.find(query).sort({ created_at: -1 }).limit(Number(limit)).toArray();
    const normalized = requests.map(r => ({
      ...r,
      id: r.id || r._id.toString(),
    }));

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve counselling requests' });
  }
});

/**
 * @route PATCH /api/counselling/:id
 * @desc Update status of counselling request
 */
router.patch('/:id', async (req, res) => {
  try {
    const col = getCollection('counselling_requests');
    const { status } = req.body;

    if (!['pending', 'reviewed', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const result = await col.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: { status, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Request not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

/**
 * @route DELETE /api/counselling/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const col = getCollection('counselling_requests');
    const result = await col.deleteOne(buildIdQuery(req.params.id));
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

module.exports = router;
