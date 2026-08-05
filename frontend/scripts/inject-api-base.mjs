import { readFileSync, writeFileSync } from 'fs';

const base = process.env.NG_APP_API_BASE;
const file = 'dist/frontend/browser/index.html';

if (base) {
  const html = readFileSync(file, 'utf8');
  const tag = `<script>window.__API_BASE__=${JSON.stringify(base)};</script></head>`;
  if (html.includes('__API_BASE__')) {
    console.log('API base already injected; leaving as-is.');
  } else {
    writeFileSync(file, html.replace('</head>', tag));
    console.log(`Injected API base: ${base}`);
  }
} else {
  console.log('NG_APP_API_BASE not set; using dev fallback /api/v1.');
}
