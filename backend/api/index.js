const serverless = require('serverless-http');
const app = require('../src/app');

const handler = serverless(app);

module.exports = (req, res) => {
  const allUrls = [
    req.url,
    req.originalUrl,
    req.headers['x-matched-path'] || '',
    req.headers['x-forwarded-url'] || ''
  ].join('');

  if (allUrls.includes('health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', version: 'deploy-v2', timestamp: new Date().toISOString() }));
    return;
  }

  return handler(req, res);
};
