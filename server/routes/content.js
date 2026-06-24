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
router.get('/lessons', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const users = (await db.execute({sql: 'SELECT subscription_status FROM users WHERE id = ?', args: [req.userId]})).rows;
    const user = users[0];
    const isPremium = user && user.subscription_status === 'active';

    let rows;
    if (isPremium) {
      rows = (await db.execute('SELECT id, slug, title, category, description, estimated_minutes, is_premium, order_index FROM lessons ORDER BY order_index')).rows;
    } else {
      rows = (await db.execute('SELECT id, slug, title, category, description, estimated_minutes, is_premium, order_index FROM lessons WHERE is_premium = 0 ORDER BY order_index')).rows;
    }

    // Get user progress
    const progressRows = (await db.execute({sql: 'SELECT lesson_id, completed, completed_at FROM lesson_progress WHERE user_id = ?', args: [req.userId]})).rows;
    const progressMap = {};
    for (const p of progressRows) {
      progressMap[p.lesson_id] = { completed: p.completed, completed_at: p.completed_at };
    }

    const lessonsWithProgress = rows.map(l => ({
      ...l,
      is_premium: !!l.is_premium,
      progress: progressMap[l.id] || { completed: 0, completed_at: null }
    }))

    res.json({ lessons: lessonsWithProgress });
  } catch (err) {
    console.error('Lessons error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single lesson
router.get('/lessons/:slug', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const lessons = (await db.execute({sql: 'SELECT * FROM lessons WHERE slug = ?', args: [req.params.slug]})).rows;
    const lesson = lessons[0];
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Check premium access
    if (lesson.is_premium) {
      const users = (await db.execute({sql: 'SELECT subscription_status FROM users WHERE id = ?', args: [req.userId]})).rows;
      const user = users[0];
      if (!user || user.subscription_status !== 'active') {
        return res.status(403).json({ error: 'Premium subscription required', is_premium: true });
      }
    }

    res.json({ lesson });
  } catch (err) {
    console.error('Lesson error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark lesson as complete
router.post('/lessons/:slug/complete', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const lessons = (await db.execute({sql: 'SELECT id FROM lessons WHERE slug = ?', args: [req.params.slug]})).rows;
    const lesson = lessons[0];
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    await db.execute({
      sql: `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, completed_at)
            VALUES (?, ?, ?, 1, datetime('now'))
            ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed = 1, completed_at = datetime('now')`,
      args: [uuidv4(), req.userId, lesson.id]
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Complete lesson error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get daily challenge for today
router.get('/daily-challenge', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];

    let challenges = (await db.execute({sql: 'SELECT * FROM daily_challenges WHERE date = ?', args: [today]})).rows;
    let challenge = challenges[0];

    if (!challenge) {
      challenges = (await db.execute('SELECT * FROM daily_challenges ORDER BY date DESC LIMIT 1')).rows;
      challenge = challenges[0];
    }

    if (!challenge) {
      return res.json({ challenge: null });
    }

    // Check premium
    if (challenge.is_premium) {
      const users = (await db.execute({sql: 'SELECT subscription_status FROM users WHERE id = ?', args: [req.userId]})).rows;
      const user = users[0];
      if (!user || user.subscription_status !== 'active') {
        return res.json({ challenge: { ...challenge, is_premium: true, locked: true } });
      }
    }

    // Get completion status
    const completions = (await db.execute(
      'SELECT * FROM challenge_completions WHERE user_id = ? AND challenge_id = ?',
      [req.userId, challenge.id]
    )).rows;
    const completion = completions[0];

    res.json({
      challenge: {
        ...challenge,
        is_premium: !!challenge.is_premium,
        completed: !!completion,
        reflection: completion?.reflection || null
      }
    });
  } catch (err) {
    console.error('Daily challenge error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete daily challenge
router.post('/daily-challenge/:id/complete', authMiddleware, async (req, res) => {
  try {
    const { reflection } = req.body;
    const db = getDb();
    const challenges = (await db.execute({sql: 'SELECT id FROM daily_challenges WHERE id = ?', args: [req.params.id]})).rows;
    const challenge = challenges[0];
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await db.execute({
      sql: `INSERT INTO challenge_completions (id, user_id, challenge_id, reflection)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id, challenge_id) DO UPDATE SET reflection = ?, completed_at = datetime('now')`,
      args: [uuidv4(), req.userId, challenge.id, reflection || null, reflection || null]
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Complete challenge error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Load curriculum from Markdown files
router.post('/seed', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    let count = 0;

    if (!fs.existsSync(CURRICULUM_DIR)) {
      return res.status(404).json({ error: 'Curriculum directory not found: ' + CURRICULUM_DIR });
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
          await db.execute({
            sql: `INSERT OR REPLACE INTO lessons (id, slug, title, category, description, content, is_premium, order_index)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [uuidv4(), slug, title, category.name, description, content, isPremium ? 1 : 0, count]
          });
          count++;
        } catch (err) {
          console.error(`Error seeding lesson ${slug}:`, err.message);
        }
      }
    }

    res.json({ success: true, lessons_seeded: count });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;