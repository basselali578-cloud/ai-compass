const serverless = require('serverless-http');
const app = require('../src/app');
const { ensureSchema } = require('../src/bootstrap');

const init = ensureSchema().catch((err) => {
  console.error('Bootstrap failed:', err.message);
});

const handler = serverless(app);

module.exports = async (req, res) => {
  await init;
  return handler(req, res);
};
