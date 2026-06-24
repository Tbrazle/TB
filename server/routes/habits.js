import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

// Get user habits
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const habits = (await db.execute({sql: 'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC', args: [req.userId]})).rows;

    // Get today's logs
    const today = new Date().toISOString().split('T')[0];
    const habitsWithStatus = await Promise.all(habits.map(async (h) => {
      const logs = (await db.execute(
        'SELECT completed FROM habit_logs WHERE habit_id = ? AND date = ?',
        [h.id, today]
      )).rows;
      return {
        ...h,
        completed_today: logs.length > 0 && !!logs[0].completed
      };
    }))

    res.json({ habits: habitsWithStatus });
  } catch (err) {
    console.error('Habits error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create habit
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const db = getDb();
    const id = uuidv4();
    await db.execute({
      sql: 'INSERT INTO habits (id, user_id, title, description, category) VALUES (?, ?, ?, ?, ?)',
      args: [id, req.userId, title, description || '', category || 'general']
    });

    res.status(201).json({ habit: { id, title, description, category, streak: 0, completed_today: false } });
  } catch (err) {
    console.error('Create habit error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log habit for today
router.post('/:id/log', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const habits = (await db.execute({sql: 'SELECT * FROM habits WHERE id = ? AND user_id = ?', args: [req.params.id, req.userId]})).rows;
    const habit = habits[0];
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const today = new Date().toISOString().split('T')[0];

    await db.execute({
      sql: `INSERT INTO habit_logs (id, habit_id, date, completed)
            VALUES (?, ?, ?, 1)
            ON CONFLICT(habit_id, date) DO UPDATE SET completed = 1`,
      args: [uuidv4(), habit.id, today]
    });

    // Recalculate streak
    const logs = (await db.execute(
      'SELECT date FROM habit_logs WHERE habit_id = ? AND completed = 1 ORDER BY date DESC',
      [habit.id]
    )).rows;

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

    await db.execute({ sql: 'UPDATE habits SET streak = ? WHERE id = ?', args: [streak, habit.id] });

    res.json({ success: true, streak });
  } catch (err) {
    console.error('Log habit error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete habit
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    await db.execute({sql: 'DELETE FROM habits WHERE id = ? AND user_id = ?', args: [req.params.id, req.userId]});
    await db.execute({sql: 'DELETE FROM habit_logs WHERE habit_id = ?', args: [req.params.id]});
    res.json({ success: true });
  } catch (err) {
    console.error('Delete habit error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;