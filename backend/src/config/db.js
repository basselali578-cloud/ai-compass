const mysql = require('mysql2/promise');
require('dotenv').config();

function getDbConfig() {
  const url = process.env.MYSQL_URL;
  if (url) {
    try {
      const parsed = new URL(url);
      return {
        host: parsed.hostname,
        port: parsed.port || 3306,
        user: parsed.username,
        password: parsed.password,
        database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : undefined
      };
    } catch (err) {
      console.error('Failed to parse MYSQL_URL, falling back to individual vars:', err.message);
    }
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_compass'
  };
}

const pool = mysql.createPool(getDbConfig());

module.exports = pool;
module.exports.getDbConfig = getDbConfig;
