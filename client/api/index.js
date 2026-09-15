const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');
const authRoutes = require('./auth');
const userRoutes = require('./users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB initialization on request for serverless env
let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady) {
    try {
      await initDatabase();
      dbReady = true;
    } catch (e) {
      console.error('Serverless DB init error:', e);
    }
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'API endpoint does not exist' });
});

app.use((err, req, res, next) => {
  console.error('API Error:', err.stack || err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An error occurred.'
  });
});

module.exports = app;
