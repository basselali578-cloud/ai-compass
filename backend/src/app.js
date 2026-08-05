const express = require('express');
const cors = require('cors');
require('dotenv').config();

const modelsRoutes = require('./routes/models');
const toolsRoutes = require('./routes/tools');
const authRoutes = require('./routes/auth');
const useCasesRoutes = require('./routes/useCases');
const savesRoutes = require('./routes/saves');
const collectionsRoutes = require('./routes/collections');
const workflowsRoutes = require('./routes/workflows');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/models', modelsRoutes);
app.use('/api/v1/tools', toolsRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/use-cases', useCasesRoutes);
app.use('/api/v1/saves', savesRoutes);
app.use('/api/v1/collections', collectionsRoutes);
app.use('/api/v1/workflows', workflowsRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
