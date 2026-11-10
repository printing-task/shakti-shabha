const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getCollection } = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

/**
 * @route POST /api/auth/register
 * @desc Register an admin or editor
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role = 'editor' } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Please provide email, password, and fullName' });
    }

    const users = getCollection('admin_users');
    const existing = await users.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      full_name: fullName,
      role: role === 'admin' ? 'admin' : 'editor',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await users.insertOne(newUser);
    const token = jwt.sign(
      { id: result.insertedId.toString(), email: newUser.email, role: newUser.role, full_name: newUser.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertedId.toString(),
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login with email & password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const users = getCollection('admin_users');
    const user = await users.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current admin profile
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const users = getCollection('admin_users');
    const { ObjectId } = require('mongodb');
    const user = await users.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

module.exports = router;
