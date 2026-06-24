import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { hashPassword, verifyPassword, generateToken, authMiddleware } from '../auth.js';

const router = Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();
    const existing = (await db.execute({sql: 'SELECT id FROM users WHERE email = ?', args: [email]})).rows[0];
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const id = uuidv4();
    const passwordHash = hashPassword(password);

    await db.execute({
      sql: 'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
      args: [id, email, passwordHash, name || '']
    });

    const token = generateToken(id);

    res.status(201).json({
      user: { id, email, name: name || '', subscription_status: 'free' },
      token
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();
    const users = (await db.execute({sql: 'SELECT * FROM users WHERE email = ?', args: [email]})).rows;
    const user = users[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription_status: user.subscription_status,
        subscription_tier: user.subscription_tier
      },
      token
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const users = (await db.execute({sql: 'SELECT * FROM users WHERE id = ?', args: [req.userId]})).rows;
    const user = users[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription_status: user.subscription_status,
        subscription_tier: user.subscription_tier,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const db = getDb();
    await db.execute({ sql: 'UPDATE users SET name = ? WHERE id = ?', args: [name, req.userId] });
    res.json({ success: true });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;