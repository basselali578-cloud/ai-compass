const serverless = require('serverless-http');
const app = require('../src/app');
const { ensureSchema } = require('../src/bootstrap');

const init = Promise.race([
  ensureSchema(),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Schema bootstrap timed out')), 20000))
]).catch((err) => {
  console.error('Bootstrap failed:', err.message);
});

const handler = serverless(app);

module.exports = async (req, res) => {
  await init;
  return handler(req, res);
};
