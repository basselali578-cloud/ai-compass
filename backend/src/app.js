const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required.');
  process.exit(1);
}

const modelsRoutes = require('./routes/models');
const toolsRoutes = require('./routes/tools');
const authRoutes = require('./routes/auth');
const useCasesRoutes = require('./routes/useCases');
const savesRoutes = require('./routes/saves');
const collectionsRoutes = require('./routes/collections');
const workflowsRoutes = require('./routes/workflows');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(null, false);
    }
  })
);

app.use(express.json({ limit: '10kb' }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later.' }
});

app.use(generalLimiter);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const { getSchemaInit } = require('./bootstrap');
app.use((req, res, next) => {
  getSchemaInit().then(() => next());
});

app.use('/api/v1/models', modelsRoutes);
app.use('/api/v1/tools', toolsRoutes);
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/use-cases', useCasesRoutes);
app.use('/api/v1/saves', savesRoutes);
app.use('/api/v1/collections', collectionsRoutes);
app.use('/api/v1/workflows', workflowsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
