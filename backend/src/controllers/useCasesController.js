const pool = require('../config/db');

const getUseCases = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT uc.*,
        (SELECT COUNT(*) FROM tool_use_cases tu WHERE tu.use_case_id = uc.id) as tool_count
       FROM use_cases uc
       ORDER BY uc.sort_order ASC`
    );
    res.json({ data: rows });
  } catch (err) {
    console.error('Error fetching use cases:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getUseCases };
