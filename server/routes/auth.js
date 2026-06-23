import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { hashPassword, verifyPassword, generateToken, authMiddleware } from '../auth.js';

const router = Router();

// Sign up
router.post('/signup', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const id = uuidv4();
  const passwordHash = hashPassword(password);

  db.prepare(
    'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)'
  ).run(id, email, passwordHash, name || '');

  const token = generateToken(id);

  res.status(201).json({
    user: { id, email, name: name || '', subscription_status: 'free' },
    token
  });
});

// Sign in
router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
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
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
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
});

// Update profile
router.put('/profile', authMiddleware, (req, res) => {
  const { name } = req.body;
  const db = getDb();
  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.userId);
  res.json({ success: true });
});

export default router;