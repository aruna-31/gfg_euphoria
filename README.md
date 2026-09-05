# GFG Euphoria — Hackathon Management & Evaluation Platform

A centralized, production-quality **Hackathon Management & Evaluation Platform** inspired by the visual language, developer aesthetic, and layout quality of **GFG KARE** (`https://gfgkare.in/`).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (Custom GFG dark emerald design system)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Visualizations**: Recharts
- **Audio Engine**: Web Audio API (procedural ambient synthesizer & harmonic SFX)
- **Effects**: Canvas Confetti

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Production Build & Typecheck
npm run build
```

The application will be accessible at `http://localhost:5173/`.

---

## 👥 Three Core Portals & Workflows

### 1. Participant / Team Leader Portal (`/team/*`)
- **Single-Identity Authentication**: Only registered team leaders log in. Individual team members access information through their team dashboard.
- **Problem Statement Selection**: 20+ challenge tracks across AI/ML, Web3, FinTech, Healthcare, IoT, and EdTech. Features modal specification views and selection lock.
- **Squad Photo Verification**: Drag-and-drop uploader with file validation (<5MB), avatar fallbacks, and CDN simulation.
- **Live Leaderboard**: Animated top-3 podium (Gold 🥇, Silver 🥈, Bronze 🥉), round filtering, and live rank trend shifts.
- **Round Timeline**: Milestone progression with scoring rubric criteria and qualitative evaluator remarks.

### 2. Evaluator Portal (`/evaluator/*`)
- **Jury Docket**: Workload KPI cards (Assigned, Pending, Completed, Average Score).
- **Multi-Criteria Scoring Engine**: 6 rubric dimensions (Innovation, Technical Architecture, Problem Understanding, Feasibility, Presentation, Impact) with real-time score summation out of 100 and qualitative feedback textareas.
- **Audit Logs**: Review past submitted evaluations with edit capabilities.

### 3. Admin Command Center (`/admin/*`)
- **Operations Telemetry**: Active round monitoring, Recharts track distribution chart, and real-time live activity stream.
- **Teams & Participants Roster**: Searchable data tables with inspection drawers.
- **5-Step CSV Ingestion Pipeline (`/admin/import`)**:
  1. Upload CSV (with 100% valid & error-heavy demo presets)
  2. Column Header Mapping
  3. Real-time In-Depth Validation (detects duplicate IDs, invalid emails, missing required fields)
  4. Table Preview with error row filters
  5. Commit Ingestion
- **Official Reports**: 1-click CSV exports for Marksheet, Teams Roster, and Participant Directory.

---

## 🎧 Interactive Sound Engine

A pure client-side Web Audio synthesizer generates:
- Ambient cyber background music with animated navbar visualizer bars.
- Sound effects for button clicks, selection locks, photo verification chimes, evaluation submissions, and alert notifications.
- Autoplay-safe: activates only on explicit user interaction; volume/mute persisted in `localStorage`.
