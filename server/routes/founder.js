const express = require('express');
const router = express.Router();
const { getCollection } = require('../db');

/**
 * @route GET /api/founder
 * Get live founder profile and civilizational dossier data
 */
router.get('/', async (req, res) => {
  try {
    const col = getCollection('founder_profile');
    const profile = await col.findOne({ type: 'founder_profile' }) || await col.findOne({});

    if (!profile) {
      return res.json({ found: false, data: null });
    }

    const { _id, ...cleanProfile } = profile;
    return res.json({
      found: true,
      data: cleanProfile,
    });
  } catch (err) {
    console.error('Fetch founder profile error:', err);
    return res.status(500).json({ error: 'Failed to retrieve founder profile' });
  }
});

/**
 * @route PUT /api/founder
 * Update or initialize founder profile and civilizational dossier
 */
router.put('/', async (req, res) => {
  try {
    const col = getCollection('founder_profile');
    const updates = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Payload must be an object' });
    }

    const now = new Date().toISOString();
    const docToSave = {
      ...updates,
      type: 'founder_profile',
      updated_at: now,
    };

    await col.updateOne(
      { type: 'founder_profile' },
      { $set: docToSave },
      { upsert: true }
    );

    const saved = await col.findOne({ type: 'founder_profile' });
    const { _id, ...cleanSaved } = saved || docToSave;

    return res.json({
      message: 'Founder profile updated successfully',
      data: cleanSaved,
    });
  } catch (err) {
    console.error('Update founder profile error:', err);
    return res.status(500).json({ error: 'Failed to save founder profile' });
  }
});

module.exports = router;
