# AI Compass

> **AI Compass does not list AI tools. AI Compass helps people stop wasting time looking for the right one.**

A curated, hand-tested directory of AI tools plus the workflows that connect them. No sponsored listings, no scraped databases — every tool is reviewed by a human editor and refreshed weekly.

[![CI](https://github.com/basselali578-cloud/ai-compass/actions/workflows/ci.yml/badge.svg)](https://github.com/basselali578-cloud/ai-compass/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **Curated tools directory** — every listing human-reviewed, with pros/cons and alternatives
- **Intent search** — describe what you want to do ("edit reels", "study for exams") and get matched tools
- **Collections** — opinionated roundups like *Best AI for Students* or *Replace Photoshop*
- **Workflows** — multi-tool recipes connecting tools into pipelines
- **Use cases** — browse by what you're trying to do, not by tool category
- **Accounts** — save tools, build personal collections

## Stack

| Layer    | Tech                                        |
| -------- | ------------------------------------------- |
| Frontend | Angular 19 (standalone) + PrimeNG           |
| Backend  | Node.js / Express                           |
| Database | MySQL                                       |
| Auth     | JWT + bcrypt                                |
| Deploys  | Vercel (frontend + API) / Railway, optional |

## Project structure

```
ai-compass/
├── backend/
│   ├── api/index.js        # Serverless entry (Vercel)
│   ├── database/dump.sql   # Schema + seed data (auto-imported on empty DB)
│   └── src/                # Express app: routes, controllers, middleware
├── database/schema.sql     # Raw schema reference
└── frontend/               # Angular workspace
```

## Getting started

### Prerequisites

- Node.js ≥ 20
- MySQL ≥ 8 (local or hosted — [TiDB Cloud Serverless](https://www.pingcap.com/tidb-cloud/) has a free tier)

### 1. Configure the backend

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env`:

| Variable          | Required | Description                                                        |
| ----------------- | -------- | ------------------------------------------------------------------ |
| `PORT`            | no       | Defaults to `3000`                                                 |
| `MYSQL_URL`       | yes\*    | Full connection URL, e.g. `mysql://user:pass@host:3306/db?ssl=true` |
| `DB_HOST` … `DB_NAME` | yes\* | Individual vars — used only when `MYSQL_URL` is unset              |
| `JWT_SECRET`      | **yes**  | Long random string. The server refuses to start without it         |
| `ALLOWED_ORIGINS` | no       | Comma-separated CORS allowlist. Defaults to `http://localhost:4200` |

\* one of the two DB options.

### 2. Start the backend

```bash
npm run dev
```

On an empty database the server auto-imports `database/dump.sql` (schema + curated seed content — no user data). Verify at `http://localhost:3000/api/v1/health`.

### 3. Start the frontend

```bash
cd ../frontend
npm install
npm start
```

Open `http://localhost:4200`. In dev, API calls are proxied via `proxy.conf.json`.

## Deployment (100% free tier)

1. **Database** — create a free TiDB Cloud Serverless cluster, copy the connection string into `MYSQL_URL` (append `?ssl=true`).
2. **Backend** — import the repo into Vercel as a project with root = `backend/`. The included `vercel.json` routes `/api/v1/*` to the serverless entry (`api/index.js`). Set env vars: `MYSQL_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS`.
3. **Frontend** — second Vercel project with root = `frontend/`. Angular is auto-detected; set env var `NG_APP_API_BASE=https://<your-backend>.vercel.app/api/v1` (injected into `index.html` at build time by `scripts/inject-api-base.mjs`).
4. On first boot against the empty TiDB database, the backend imports the seed dump automatically.

Railway configs (`railway.json`) are also included if you prefer container deploys there.

## Security

- Passwords hashed with bcrypt; stateless JWT auth (7-day expiry)
- Helmet security headers on every response
- CORS restricted to configured origins
- Rate limiting: strict on `/auth`, general on everything else
- Parameterized SQL queries throughout
- Seed data contains **no user records** — never commit real user data

## Contributing

Tool suggestions and corrections welcome — open an issue describing the tool, what it does, and who it's for. Every submission goes through human review before listing.

## License

[MIT](LICENSE) © Bassel Ashraf
