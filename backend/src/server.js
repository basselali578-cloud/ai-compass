const app = require('./app');
const { ensureSchema } = require('./bootstrap');
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await ensureSchema();
  } catch (err) {
    console.error('Bootstrap failed:', err.message);
  }
  app.listen(PORT, () => {
    console.log(`AI Compass API running on http://localhost:${PORT}`);
  });
}

start();
