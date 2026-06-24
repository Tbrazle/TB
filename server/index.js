import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSchema } from './db.js';

import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscription.js';
import contentRoutes from './routes/content.js';
import habitsRoutes from './routes/habits.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/habits', habitsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() });
});

// Serve static frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});

// Initialize DB and schema
app.listen(PORT, '0.0.0.0', async () => {
  try {
    await initSchema();
    console.log(`Build Mode server running on http://0.0.0.0:${PORT}`);
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
});