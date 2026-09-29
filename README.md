# GFG Euphoria — Hackathon Management & Evaluation Platform

> Full-stack hackathon operations platform covering team workflows, problem-statement selection, evaluation, administration, and reporting.

## Problem

Hackathon organizers need one place to manage participants, problem statements, evaluator workloads, scoring, imports, and operational reporting. GFG Euphoria brings these workflows into role-specific portals.

## Core workflows

### Participant / Team
- Registered team-leader authentication
- Problem-statement discovery and selection
- Selection locking
- Team/photo verification
- Leaderboard and round progression

### Evaluator
- Jury docket and workload metrics
- Multi-criteria scoring
- Qualitative feedback
- Evaluation history and audit information

### Admin
- Live operations dashboard
- Team and participant management
- CSV ingestion with validation
- Duplicate/invalid-record detection
- Official CSV report exports

## Architecture

The application is organized as a modern React frontend with role-specific routes, client-side data workflows, interactive visualizations, and reusable UI components.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Recharts
- Lucide React
- Web Audio API

## Run locally

```bash
npm install
npm run dev
```

Production build and typecheck:

```bash
npm run build
```

## Engineering focus

The project emphasizes workflow correctness as much as UI: capacity enforcement, selection locking, validation, evaluator scoring, and administrative visibility are treated as application-level concerns.

## Author

**Lavanuru Aruna** · https://github.com/aruna-31
