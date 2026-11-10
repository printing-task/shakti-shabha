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
 * @route GET /api/courses
 */
router.get('/', async (req, res) => {
  try {
    const col = getCollection('courses');
    const { published, level } = req.query;

    const query = {};
    if (published === 'true') query.published = true;
    if (level) query.level = level;

    const courses = await col.find(query).sort({ created_at: -1 }).toArray();
    const normalized = courses.map(c => ({
      ...c,
      id: c.id || c._id.toString(),
    }));

    res.json(normalized);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

/**
 * @route GET /api/courses/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const col = getCollection('courses');
    const course = await col.findOne(buildIdQuery(req.params.id));
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ ...course, id: course.id || course._id.toString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

/**
 * @route POST /api/courses
 */
router.post('/', async (req, res) => {
  try {
    const col = getCollection('courses');
    const payload = req.body;
    const now = new Date().toISOString();

    const newDoc = {
      ...payload,
      id: payload.id || `course_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      syllabus: Array.isArray(payload.syllabus) ? payload.syllabus : [],
      published: payload.published !== undefined ? payload.published : true,
      created_at: payload.created_at || now,
      updated_at: now,
    };

    const result = await col.insertOne(newDoc);
    res.status(201).json({ ...newDoc, _id: result.insertedId });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

/**
 * @route PUT /api/courses/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const col = getCollection('courses');
    const payload = { ...req.body, updated_at: new Date().toISOString() };
    delete payload._id;

    const result = await col.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: payload },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Course not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

/**
 * @route DELETE /api/courses/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const col = getCollection('courses');
    const result = await col.deleteOne(buildIdQuery(req.params.id));
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
