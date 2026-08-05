const pool = require('../config/db');

const getSavedTools = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM saves WHERE user_id = ? AND expires_at IS NOT NULL AND expires_at < NOW()',
      [req.user.id]
    );

    const [rows] = await pool.query(
      `SELECT s.id as save_id, s.note, s.created_at as saved_at, s.expires_at,
              DATEDIFF(s.expires_at, NOW()) as expires_in_days,
              t.id, t.name, t.description, t.url, t.image_url, t.category,
              t.pricing, t.best_for, t.beginner_friendly
       FROM saves s
       JOIN tools t ON s.tool_id = t.id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    res.json({
      data: rows.map(r => ({ ...r, beginner_friendly: !!r.beginner_friendly, expires_in_days: Number(r.expires_in_days) }))
    });
  } catch (err) {
    console.error('Error fetching saved tools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const saveTool = async (req, res) => {
  try {
    const { toolId, note } = req.body;
    if (!toolId) {
      return res.status(400).json({ error: 'toolId is required' });
    }

    const [tool] = await pool.query('SELECT id FROM tools WHERE id = ?', [toolId]);
    if (tool.length === 0) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    await pool.query(
      'INSERT INTO saves (user_id, tool_id, note, folder, expires_at) VALUES (?, ?, ?, ?, NOW() + INTERVAL 7 DAY) ON DUPLICATE KEY UPDATE note = VALUES(note), folder = VALUES(folder), expires_at = NOW() + INTERVAL 7 DAY',
      [req.user.id, toolId, note || null, 'Unsorted']
    );

    res.status(201).json({ message: 'Tool saved', expires_in_days: 7 });
  } catch (err) {
    console.error('Error saving tool:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const unsaveTool = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM saves WHERE user_id = ? AND tool_id = ?',
      [req.user.id, req.params.toolId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Save not found' });
    }
    res.json({ message: 'Tool removed from saved' });
  } catch (err) {
    console.error('Error removing saved tool:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSavedTools, saveTool, unsaveTool };
