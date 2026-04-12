# DMP OS — WSP Management Backend

A Node.js/Express backend that powers the WSP Management module of DMP OS, integrating with the FINRA API, Supabase (PostgreSQL), Storj document storage, and OpenAI for AI-powered gap analysis.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  React Frontend (Vite)          GitHub Pages (static)        │
│  localhost:3000 / wenge130.github.io/dmp-os/wsp             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/*  →  Vite dev proxy  →  Express (port 4000)  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
              ┌───────────┼───────────────┐
              ▼           ▼               ▼
        Supabase      FINRA API        OpenAI
       (PostgreSQL)  (OAuth 2.0)     (Gap Analysis)
                                         │
                                         ▼
                                       Storj
                                  (Document Storage)
```

## Quick Start

### 1. Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Run the Database Migration

Copy the contents of `server/src/db/migrations.sql` and run it in your **Supabase SQL Editor** (Project → SQL Editor → New Query).

### 5. Start the Backend Server

```bash
# Development (with hot reload)
pnpm run server:dev

# Production
pnpm run server:start
```

The backend will start on `http://localhost:4000`.

### 6. Start the Frontend Dev Server

In a separate terminal:

```bash
pnpm run dev
```

The frontend will start on `http://localhost:3000/dmp-os/` and automatically proxy all `/api/*` requests to the backend.

## API Endpoints

### WSP Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wsp/manuals` | List all WSP sub-manuals |
| `GET` | `/api/wsp/manuals/:id` | Get a specific sub-manual |
| `GET` | `/api/wsp/attestations` | List all attestations |
| `GET` | `/api/wsp/gaps` | List all gap findings |
| `GET` | `/api/wsp/alerts` | List all FINRA alerts |
| `POST` | `/api/wsp/gaps/analyze` | Run AI gap analysis for a WSP |
| `POST` | `/api/wsp/documents/upload` | Upload a WSP document to Storj |

### FINRA Integration

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/finra/health` | Check FINRA API connectivity |
| `POST` | `/api/finra/poll` | Manually trigger FINRA notification poll |
| `GET` | `/api/finra/rules/:ruleNumber` | Fetch FINRA rulebook text |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Backend health check |

## Gap Analysis Flow

1. Client calls `POST /api/wsp/gaps/analyze` with `{ wsp_id, rule_number }`
2. Server fetches the WSP document from Storj (or uses seeded text)
3. Server fetches the FINRA rule text (or uses built-in summaries if not entitled)
4. OpenAI analyzes the WSP against the rule and returns structured gap findings
5. Findings are persisted to Supabase `wsp_gap_findings` table
6. Results are returned to the client and displayed in the Gap Analysis view

## FINRA API Notes

- The `wengedmptech` account currently has access to **OTC Market data** datasets
- To enable Rulebook and Notification API access, request dataset permissions via FINRA Gateway → API Console → Manage API Access
- The backend gracefully falls back to built-in rule summaries when FINRA entitlements are not yet granted
- Use `FINRA_ENV=qa` to test against the FINRA QA environment (recommended for PoC)

## Project Structure

```
server/
├── src/
│   ├── db/
│   │   ├── supabase.ts          # Supabase client
│   │   └── migrations.sql       # Database schema
│   ├── services/
│   │   ├── finra.service.ts     # FINRA API OAuth + queries
│   │   ├── storj.service.ts     # Storj S3-compatible storage
│   │   ├── gapAnalysis.service.ts  # OpenAI gap analysis
│   │   └── pollScheduler.service.ts  # FINRA polling cron
│   ├── routes/
│   │   ├── wsp.routes.ts        # WSP CRUD + analysis endpoints
│   │   └── finra.routes.ts      # FINRA direct endpoints
│   └── index.ts                 # Express server entry point
└── README.md
```
