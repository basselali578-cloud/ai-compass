const pool = require('../config/db');

const getWorkflows = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT w.*,
         (SELECT COUNT(*) FROM workflow_steps ws WHERE ws.workflow_id = w.id) as step_count,
         (SELECT COUNT(*) FROM workflow_steps ws WHERE ws.workflow_id = w.id AND ws.tool_id IS NOT NULL) as linked_count
       FROM workflows w
       ORDER BY w.sort_order ASC, w.id ASC`
    );

    const [steps] = await pool.query(
      `SELECT ws.workflow_id, t.id as tool_id, t.name as tool_name
       FROM workflow_steps ws
       JOIN tools t ON ws.tool_id = t.id
       ORDER BY ws.workflow_id, ws.sort_order`
    );
    const byWorkflow = {};
    steps.forEach(s => {
      if (!byWorkflow[s.workflow_id]) byWorkflow[s.workflow_id] = [];
      byWorkflow[s.workflow_id].push({ id: s.tool_id, name: s.tool_name });
    });

    res.json({
      data: rows.map(w => ({
        ...w,
        is_featured: !!w.is_featured,
        why: w.why ? JSON.parse(w.why) : [],
        alternative_stacks: w.alternative_stacks ? JSON.parse(w.alternative_stacks) : [],
        preview: (byWorkflow[w.id] || []).slice(0, 4)
      }))
    });
  } catch (err) {
    console.error('Error fetching workflows:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getWorkflowBySlug = async (req, res) => {
  try {
    const [workflowRows] = await pool.query('SELECT * FROM workflows WHERE slug = ?', [req.params.slug]);
    if (workflowRows.length === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    const workflow = workflowRows[0];

    const [steps] = await pool.query(
      `SELECT ws.id, ws.title, ws.note, ws.sort_order, ws.tool_id, ws.why, ws.alternative, ws.avoid_if,
         t.name as tool_name, t.image_url, t.category
       FROM workflow_steps ws
       LEFT JOIN tools t ON ws.tool_id = t.id
       WHERE ws.workflow_id = ?
       ORDER BY ws.sort_order ASC`,
      [workflow.id]
    );

    res.json({
      ...workflow,
      is_featured: !!workflow.is_featured,
      why: workflow.why ? JSON.parse(workflow.why) : [],
      alternative_stacks: workflow.alternative_stacks ? JSON.parse(workflow.alternative_stacks) : [],
      steps
    });
  } catch (err) {
    console.error('Error fetching workflow:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getWorkflows, getWorkflowBySlug };
