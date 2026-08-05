const pool = require('../config/db');

const getCollections = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*,
        (SELECT COUNT(*) FROM collection_tools ct WHERE ct.collection_id = c.id) as tool_count
       FROM collections c
       ORDER BY c.title ASC`
    );
    res.json({ data: rows });
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCollectionBySlug = async (req, res) => {
  try {
    const [collectionRows] = await pool.query('SELECT * FROM collections WHERE slug = ?', [req.params.slug]);
    if (collectionRows.length === 0) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    const collection = collectionRows[0];

    const [tools] = await pool.query(
      `SELECT t.*, ct.sort_order,
        COALESCE(GROUP_CONCAT(uc.slug), '') as use_cases
       FROM collection_tools ct
       JOIN tools t ON ct.tool_id = t.id
       LEFT JOIN tool_use_cases tu ON t.id = tu.tool_id
       LEFT JOIN use_cases uc ON tu.use_case_id = uc.id
       WHERE ct.collection_id = ?
       GROUP BY t.id
       ORDER BY ct.sort_order ASC`,
      [collection.id]
    );

    res.json({
      ...collection,
      tools: tools.map(t => ({
        ...t,
        use_cases: t.use_cases ? t.use_cases.split(',') : [],
        beginner_friendly: !!t.beginner_friendly,
        pros: t.pros ? JSON.parse(t.pros) : [],
        cons: t.cons ? JSON.parse(t.cons) : [],
        alternatives: t.alternatives ? JSON.parse(t.alternatives) : []
      }))
    });
  } catch (err) {
    console.error('Error fetching collection:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getCollections, getCollectionBySlug };
