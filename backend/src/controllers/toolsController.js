const pool = require('../config/db');
const SEARCH_INTENTS = require('../config/searchIntents');

const STOPWORDS = new Set(['i', 'me', 'my', 'we', 'our', 'you', 'your', 'an', 'a', 'the', 'to', 'for', 'of', 'and', 'that', 'with', 'have', 'has', 'is', 'are', 'in', 'on', 'at', 'it', 'this', 'that', 'get', 'need', 'wanna', 'want', 'some', 'really', 'help', 'best', 'good', 'tool', 'ai', 'an ai', 'please']);

const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const stem = (w) => w.length > 3 && w.endsWith('es') ? w.slice(0, -2) : w.length > 2 && w.endsWith('s') ? w.slice(0, -1) : w;

const tokenize = (str) => normalize(str).split(' ').filter(w => w.length > 1 && !STOPWORDS.has(w)).map(stem);

const matchIntent = (q, rows) => {
  const normalized = normalize(q);
  if (!normalized) return null;
  const byName = new Map(rows.map(t => [t.name.toLowerCase(), t]));
  let best = null;
  let bestScore = 0;
  for (const rule of SEARCH_INTENTS) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (normalized.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }
  if (!best || bestScore < 4) return null;
  const tools = best.toolNames.map(n => byName.get(n.toLowerCase())).filter(Boolean);
  return tools.length ? { key: best.key, label: best.label, tools } : null;
};

const searchTools = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ data: [], query: q });
    }

    const queryWords = new Set(tokenize(q));

    const [allKeywords] = await pool.query('SELECT tool_id, keyword FROM tool_keywords');
    const keywordScores = {};
    const matchedTools = new Set();
    for (const k of allKeywords) {
      const kwWords = tokenize(k.keyword);
      let overlap = 0;
      for (const w of kwWords) {
        if (queryWords.has(w)) overlap++;
      }
      const ratio = overlap / kwWords.length;
      if (ratio >= 0.6) {
        let score = Math.round(8 * ratio);
        if (kwWords.some(w => queryWords.has(w))) score += 4;
        keywordScores[k.tool_id] = Math.max(keywordScores[k.tool_id] || 0, score);
        matchedTools.add(k.tool_id);
      }
    }

    const [rows] = await pool.query(
      `SELECT t.*,
        COALESCE(GROUP_CONCAT(uc.slug), '') as use_cases
       FROM tools t
       LEFT JOIN tool_use_cases tu ON t.id = tu.tool_id
       LEFT JOIN use_cases uc ON tu.use_case_id = uc.id
       GROUP BY t.id`
    );

    const scored = [];
    for (const tool of rows) {
      let score = keywordScores[tool.id] || 0;
      const haystack = normalize([tool.name, tool.description, tool.best_for, tool.category].join(' '));
      let wordHits = 0;
      for (const word of queryWords) {
        if (haystack.includes(word)) wordHits++;
      }
      if (score > 0) score += wordHits;
      else if (wordHits >= Math.max(1, Math.ceil(queryWords.size * 0.5))) score = wordHits * 2;

      if (score > 0) {
        scored.push({
          ...tool,
          use_cases: tool.use_cases ? tool.use_cases.split(',') : [],
          beginner_friendly: !!tool.beginner_friendly,
          pros: tool.pros ? JSON.parse(tool.pros) : [],
          cons: tool.cons ? JSON.parse(tool.cons) : [],
          alternatives: tool.alternatives ? JSON.parse(tool.alternatives) : [],
          score
        });
      }
    }

    scored.sort((a, b) => (b.score * 10 + Number(b.rating)) - (a.score * 10 + Number(a.rating)));

    let intent = null;
    if (scored.length <= 1) {
      intent = matchIntent(q, rows);
    }

    let results = scored;
    if (intent) {
      const seen = new Set(scored.map(t => t.id));
      const extras = [];
      for (const tool of intent.tools) {
        if (seen.has(tool.id)) continue;
        seen.add(tool.id);
        extras.push({
          ...tool,
          use_cases: tool.use_cases ? tool.use_cases.split(',') : [],
          beginner_friendly: !!tool.beginner_friendly,
          pros: tool.pros ? JSON.parse(tool.pros) : [],
          cons: tool.cons ? JSON.parse(tool.cons) : [],
          alternatives: tool.alternatives ? JSON.parse(tool.alternatives) : [],
          score: 99,
          from_intent: true
        });
      }
      results = [...scored, ...extras];
    }

    const matched = [...matchedTools].slice(0, 5);

    res.json({
      query: q,
      data: results.slice(0, 12),
      total: results.length,
      matched,
      intent: intent ? { key: intent.key, label: intent.label } : null
    });
  } catch (err) {
    console.error('Error in tool search:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGemTools = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*,
        COALESCE(GROUP_CONCAT(uc.slug), '') as use_cases
       FROM tools t
       LEFT JOIN tool_use_cases tu ON t.id = tu.tool_id
       LEFT JOIN use_cases uc ON tu.use_case_id = uc.id
       WHERE t.is_gem = 1
       GROUP BY t.id
       ORDER BY t.rating DESC, t.name ASC`
    );
    res.json({
      data: rows.map(r => ({
        ...r,
        use_cases: r.use_cases ? r.use_cases.split(',') : [],
        beginner_friendly: !!r.beginner_friendly
      }))
    });
  } catch (err) {
    console.error('Error fetching gem tools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTrendingTools = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*,
        COALESCE(GROUP_CONCAT(uc.slug), '') as use_cases
       FROM tools t
       LEFT JOIN tool_use_cases tu ON t.id = tu.tool_id
       LEFT JOIN use_cases uc ON tu.use_case_id = uc.id
       WHERE t.trending_rank > 0 OR t.is_new = 1 OR t.is_gem = 1
       GROUP BY t.id
       ORDER BY ISNULL(t.trending_rank), t.trending_rank DESC, t.is_new DESC, t.is_gem DESC`
    );
    res.json({
      data: rows.map(r => ({
        ...r,
        use_cases: r.use_cases ? r.use_cases.split(',') : [],
        beginner_friendly: !!r.beginner_friendly
      }))
    });
  } catch (err) {
    console.error('Error fetching trending tools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllTools = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = '', useCase = '' } = req.query;
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    const countParams = [];

    if (search) {
      conditions.push('(t.name LIKE ? OR t.description LIKE ? OR t.best_for LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
      countParams.push(searchParam, searchParam, searchParam);
    }
    if (category) {
      conditions.push('t.category = ?');
      params.push(category);
      countParams.push(category);
    }
    if (useCase) {
      conditions.push(`t.id IN (
        SELECT tu.tool_id FROM tool_use_cases tu
        JOIN use_cases uc ON tu.use_case_id = uc.id
        WHERE uc.slug = ?
      )`);
      params.push(useCase);
      countParams.push(useCase);
    }

    const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

    const query = `
      SELECT t.*,
        COALESCE(GROUP_CONCAT(uc.slug), '') as use_cases
      FROM tools t
      LEFT JOIN tool_use_cases tu ON t.id = tu.tool_id
      LEFT JOIN use_cases uc ON tu.use_case_id = uc.id
      ${whereClause}
      GROUP BY t.id
      ORDER BY t.rating DESC
      LIMIT ? OFFSET ?
    `;
    const countQuery = `SELECT COUNT(DISTINCT t.id) as total FROM tools t ${whereClause}`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    const data = rows.map(row => ({
      ...row,
      use_cases: row.use_cases ? row.use_cases.split(',') : [],
      beginner_friendly: !!row.beginner_friendly,
      pros: row.pros ? JSON.parse(row.pros) : [],
      cons: row.cons ? JSON.parse(row.cons) : [],
      alternatives: row.alternatives ? JSON.parse(row.alternatives) : []
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
    console.error('Error fetching tools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getToolById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, COALESCE(GROUP_CONCAT(uc.slug), '') as use_cases
       FROM tools t
       LEFT JOIN tool_use_cases tu ON t.id = tu.tool_id
       LEFT JOIN use_cases uc ON tu.use_case_id = uc.id
       WHERE t.id = ?
       GROUP BY t.id`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    const tool = {
      ...rows[0],
      use_cases: rows[0].use_cases ? rows[0].use_cases.split(',') : [],
      beginner_friendly: !!rows[0].beginner_friendly,
      pros: rows[0].pros ? JSON.parse(rows[0].pros) : [],
      cons: rows[0].cons ? JSON.parse(rows[0].cons) : [],
      alternatives: rows[0].alternatives ? JSON.parse(rows[0].alternatives) : []
    };
    res.json(tool);
  } catch (err) {
    console.error('Error fetching tool:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getToolByName = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, COALESCE(GROUP_CONCAT(uc.slug), '') as use_cases
       FROM tools t
       LEFT JOIN tool_use_cases tu ON t.id = tu.tool_id
       LEFT JOIN use_cases uc ON tu.use_case_id = uc.id
       WHERE LOWER(t.name) = LOWER(?)
       GROUP BY t.id`,
      [req.params.name]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    const tool = {
      ...rows[0],
      use_cases: rows[0].use_cases ? rows[0].use_cases.split(',') : [],
      beginner_friendly: !!rows[0].beginner_friendly,
      pros: rows[0].pros ? JSON.parse(rows[0].pros) : [],
      cons: rows[0].cons ? JSON.parse(rows[0].cons) : [],
      alternatives: rows[0].alternatives ? JSON.parse(rows[0].alternatives) : []
    };
    res.json(tool);
  } catch (err) {
    console.error('Error fetching tool by name:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTool = async (req, res) => {
  try {
    const { name, description, url, image_url, category, pricing, rating, best_for, beginner_friendly } = req.body;
    const [result] = await pool.query(
      'INSERT INTO tools (name, description, url, image_url, category, pricing, rating, best_for, beginner_friendly) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, url, image_url, category, pricing, rating, best_for || null, beginner_friendly ? 1 : 0]
    );
    const [newTool] = await pool.query('SELECT * FROM tools WHERE id = ?', [result.insertId]);
    res.status(201).json(newTool[0]);
  } catch (err) {
    console.error('Error creating tool:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllTools, getToolById, getToolByName, createTool, searchTools, getTrendingTools, getGemTools };
