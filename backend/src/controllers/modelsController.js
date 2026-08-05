const pool = require('../config/db');

const getAllModels = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', provider = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM ai_models';
    let countQuery = 'SELECT COUNT(*) as total FROM ai_models';
    const params = [];
    const countParams = [];
    const conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
      countParams.push(searchParam, searchParam);
    }
    if (provider) {
      conditions.push('provider LIKE ?');
      const providerParam = `%${provider}%`;
      params.push(providerParam);
      countParams.push(providerParam);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY downloads DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    const data = rows.map(r => ({
      ...r,
      runs_locally: !!r.runs_locally,
      requires_gpu: !!r.requires_gpu,
      is_free: !!r.is_free,
      has_api: !!r.has_api,
      on_openrouter: !!r.on_openrouter,
      alternatives: r.alternatives ? JSON.parse(r.alternatives) : []
    }));

    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching models:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getModelById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ai_models WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }
    const r = rows[0];
    res.json({
      ...r,
      runs_locally: !!r.runs_locally,
      requires_gpu: !!r.requires_gpu,
      is_free: !!r.is_free,
      has_api: !!r.has_api,
      on_openrouter: !!r.on_openrouter,
      alternatives: r.alternatives ? JSON.parse(r.alternatives) : []
    });
  } catch (err) {
    console.error('Error fetching model:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createModel = async (req, res) => {
  try {
    const { name, provider, description, url, image_url, framework, license, parameters } = req.body;
    const [result] = await pool.query(
      'INSERT INTO ai_models (name, provider, description, url, image_url, framework, license, parameters) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, provider, description, url, image_url, framework, license, parameters]
    );
    const [newModel] = await pool.query('SELECT * FROM ai_models WHERE id = ?', [result.insertId]);
    res.status(201).json(newModel[0]);
  } catch (err) {
    console.error('Error creating model:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllModels, getModelById, createModel };
