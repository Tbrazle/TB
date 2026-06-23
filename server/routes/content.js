import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { authMiddleware } from '../auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

const CURRICULUM_DIR = path.join(__dirname, '..', '..', 'curriculum');

// Get all lessons (with free/premium filtering)
router.get('/lessons', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT subscription_status FROM users WHERE id = ?').get(req.userId);
  const isPremium = user && user.subscription_status === 'active';

  let lessons;
  if (isPremium) {
    lessons = db.prepare('SELECT id, slug, title, category, description, estimated_minutes, is_premium, order_index FROM lessons ORDER BY order_index').all();
  } else {
    lessons = db.prepare('SELECT id, slug, title, category, description, estimated_minutes, is_premium, order_index FROM lessons WHERE is_premium = 0 ORDER BY order_index').all();
  }

  // Get user progress
  const progress = db.prepare('SELECT lesson_id, completed, completed_at FROM lesson_progress WHERE user_id = ?').all(req.userId);
  const progressMap = {};
  for (const p of progress) {
    progressMap[p.lesson_id] = { completed: p.completed, completed_at: p.completed_at };
  }

  const lessonsWithProgress = lessons.map(l => ({
    ...l,
    is_premium: !!l.is_premium,
    progress: progressMap[l.id] || { completed: 0, completed_at: null }
  }));

  res.json({ lessons: lessonsWithProgress });
});

// Get single lesson
router.get('/lessons/:slug', authMiddleware, (req, res) => {
  const db = getDb();
  const lesson = db.prepare('SELECT * FROM lessons WHERE slug = ?').get(req.params.slug);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  // Check premium access
  if (lesson.is_premium) {
    const user = db.prepare('SELECT subscription_status FROM users WHERE id = ?').get(req.userId);
    if (!user || user.subscription_status !== 'active') {
      return res.status(403).json({ error: 'Premium subscription required', is_premium: true });
    }
  }

  res.json({ lesson });
});

// Mark lesson as complete
router.post('/lessons/:slug/complete', authMiddleware, (req, res) => {
  const db = getDb();
  const lesson = db.prepare('SELECT id FROM lessons WHERE slug = ?').get(req.params.slug);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  db.prepare(
    `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, completed_at)
     VALUES (?, ?, ?, 1, datetime('now'))
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed = 1, completed_at = datetime('now')`
  ).run(uuidv4(), req.userId, lesson.id);

  res.json({ success: true });
});

// Get daily challenge for today
router.get('/daily-challenge', authMiddleware, (req, res) => {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  let challenge = db.prepare('SELECT * FROM daily_challenges WHERE date = ?').get(today);

  if (!challenge) {
    // Fallback: get the most recent challenge
    challenge = db.prepare('SELECT * FROM daily_challenges ORDER BY date DESC LIMIT 1').get();
  }

  if (!challenge) {
    return res.json({ challenge: null });
  }

  // Check premium
  if (challenge.is_premium) {
    const user = db.prepare('SELECT subscription_status FROM users WHERE id = ?').get(req.userId);
    if (!user || user.subscription_status !== 'active') {
      return res.json({ challenge: { ...challenge, is_premium: true, locked: true } });
    }
  }

  // Get completion status
  const completion = db.prepare(
    'SELECT * FROM challenge_completions WHERE user_id = ? AND challenge_id = ?'
  ).get(req.userId, challenge.id);

  res.json({
    challenge: {
      ...challenge,
      is_premium: !!challenge.is_premium,
      completed: !!completion,
      reflection: completion?.reflection || null
    }
  });
});

// Complete daily challenge
router.post('/daily-challenge/:id/complete', authMiddleware, (req, res) => {
  const { reflection } = req.body;
  const db = getDb();
  const challenge = db.prepare('SELECT id FROM daily_challenges WHERE id = ?').get(req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  db.prepare(
    `INSERT INTO challenge_completions (id, user_id, challenge_id, reflection)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, challenge_id) DO UPDATE SET reflection = ?, completed_at = datetime('now')`
  ).run(uuidv4(), req.userId, challenge.id, reflection || null, reflection || null);

  res.json({ success: true });
});

// Load curriculum from Markdown files
router.post('/seed', authMiddleware, (req, res) => {
  const db = getDb();
  let count = 0;

  if (!fs.existsSync(CURRICULUM_DIR)) {
    return res.status(404).json({ error: 'Curriculum directory not found' });
  }

  const categories = fs.readdirSync(CURRICULUM_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const category of categories) {
    const catDir = path.join(CURRICULUM_DIR, category.name);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const slug = file.replace('.md', '');
      const content = fs.readFileSync(path.join(catDir, file), 'utf-8');
      const lines = content.split('\n');
      const title = lines[0]?.replace(/^#\s*/, '') || slug;
      const description = lines.slice(1).find(l => l.trim())?.replace(/^##\s*/, '').trim() || lines[1]?.trim() || '';
      const isPremium = content.includes('<!-- premium -->');

      try {
        db.prepare(
          `INSERT OR REPLACE INTO lessons (id, slug, title, category, description, content, is_premium, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(uuidv4(), slug, title, category.name, description, content, isPremium ? 1 : 0, count);
        count++;
      } catch (err) {
        console.error(`Error seeding lesson ${slug}:`, err.message);
      }
    }
  }

  res.json({ success: true, lessons_seeded: count });
});

export default router;