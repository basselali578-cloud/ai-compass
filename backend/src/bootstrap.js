const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { getDbConfig } = require('./config/db');

async function ensureSchema() {
  const conn = await mysql.createConnection({
    ...getDbConfig(),
    multipleStatements: true
  });
  try {
    const [tables] = await conn.query("SHOW TABLES LIKE 'tools'");
    if (tables.length === 0) {
      console.log('> Empty database detected; importing schema dump...');
      const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'dump.sql'), 'utf8');
      await conn.query(sql);
      console.log('> Schema dump imported.');
    } else {
      console.log('> Schema already present; skipping import.');
    }
  } finally {
    await conn.end();
  }
}

module.exports = { ensureSchema };
