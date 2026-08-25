const mysql = require('mysql2/promise');
require('dotenv').config();

function getDbConfig() {
  const url = process.env.MYSQL_URL;
  if (url) {
    try {
      const parsed = new URL(url);
      const useSsl = ['true', '1'].includes((parsed.searchParams.get('ssl') || '').toLowerCase());
      return {
        host: parsed.hostname,
        port: Number(parsed.port) || 3306,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : undefined,
        ...(useSsl ? { ssl: { minVersion: 'TLSv1.2' } } : {})
      };
    } catch (err) {
      console.error('Failed to parse MYSQL_URL, falling back to individual vars:', err.message);
    }
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_compass'
  };
}

const pool = mysql.createPool(getDbConfig());

module.exports = pool;
module.exports.getDbConfig = getDbConfig;
