import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

// Get user habits
router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const habits = db.prepare('SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);

  // Get today's logs
  const today = new Date().toISOString().split('T')[0];
  const habitsWithStatus = habits.map(h => {
    const log = db.prepare(
      'SELECT completed FROM habit_logs WHERE habit_id = ? AND date = ?'
    ).get(h.id, today);
    return {
      ...h,
      completed_today: log ? !!log.completed : false
    };
  });

  res.json({ habits: habitsWithStatus });
});

// Create habit
router.post('/', authMiddleware, (req, res) => {
  const { title, description, category } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const db = getDb();
  const id = uuidv4();
  db.prepare(
    'INSERT INTO habits (id, user_id, title, description, category) VALUES (?, ?, ?, ?, ?)'
  ).run(id, req.userId, title, description || '', category || 'general');

  res.status(201).json({ habit: { id, title, description, category, streak: 0, completed_today: false } });
});

// Log habit for today
router.post('/:id/log', authMiddleware, (req, res) => {
  const db = getDb();
  const habit = db.prepare('SELECT * FROM habits WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  const today = new Date().toISOString().split('T')[0];

  db.prepare(
    `INSERT INTO habit_logs (id, habit_id, date, completed)
     VALUES (?, ?, ?, 1)
     ON CONFLICT(habit_id, date) DO UPDATE SET completed = 1`
  ).run(uuidv4(), habit.id, today);

  // Recalculate streak
  const logs = db.prepare(
    'SELECT date FROM habit_logs WHERE habit_id = ? AND completed = 1 ORDER BY date DESC'
  ).all(habit.id);

  let streak = 0;
  const todayDate = new Date();
  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date + 'T00:00:00');
    const expected = new Date(todayDate);
    expected.setDate(expected.getDate() - i);
    if (logDate.toISOString().split('T')[0] === expected.toISOString().split('T')[0]) {
      streak++;
    } else {
      break;
    }
  }

  db.prepare('UPDATE habits SET streak = ? WHERE id = ?').run(streak, habit.id);

  res.json({ success: true, streak });
});

// Delete habit
router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM habits WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  db.prepare('DELETE FROM habit_logs WHERE habit_id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;