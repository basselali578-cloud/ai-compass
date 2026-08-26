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

let schemaInit = null;

function getSchemaInit() {
  if (!schemaInit) {
    schemaInit = Promise.race([
      ensureSchema(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Schema bootstrap timed out')), 20000))
    ]).catch((err) => {
      console.error('Bootstrap failed:', err.message);
    });
  }
  return schemaInit;
}

module.exports = { ensureSchema, getSchemaInit };
