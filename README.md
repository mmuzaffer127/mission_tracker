# MISSION OS
> **Personal Growth, Mission Management & Achievement Tracking Operating System**  
> *"Turn Your Ambitions Into Missions. Track Your Achievements. Become 1% Better Every Day."*

---

## 🌌 Overview

**Mission OS** is a premier, dark-mode-first personal growth operating system. Built with an obsessive focus on craft, high-performance typography, and responsive micro-interactions, it integrates:

- **Mission Operations HQ**: Priority-tagged tactical missions with atomic subtask tracking, inline progress recalculations, and Kanban / Table views.
- **Master Goal Architecture**: Hierarchical goals with multi-year timeframes and sequential milestones that roll up progress automatically.
- **Habit Mastery & Streak Engine**: Unbreakable streak trackers with a 14-day commit heatmap matrix, daily check-ins, and zero loss of historical records.
- **Monthly Achievement Wall of Fame**: Permanent monthly achievement archives, historical month navigation, and proof-of-work evidence attachments (GitHub, URLs, certificates).
- **8-Quadrant Life Balance Telemetry**: Recharts radar visualization across Career, Education, Health, Relationships, Financial Growth, Personal Dev, Creativity, and Spiritual Values.
- **Hyperfocus Command Center**: Integrated Pomodoro / Deep Work timer with ambient haptic tones and session logs.
- **Gemini 2.5 AI Growth Architect**: Server-side roadmap generator and monthly retrospective synthesiser using `@google/genai`.
- **Journal & Future Me Vault**: Daily mental clarity reflections and time-locked letters that remain sealed until the designated horizon date arrives.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, Framer Motion |
| **Backend** | Node.js 20 LTS, Express.js, TypeScript, Helmet, CORS, Morgan |
| **Database & Auth** | Supabase PostgreSQL (20 Tables DDL + Row Level Security), Supabase Auth |
| **AI Copilot** | Google Gemini 2.5 Flash via official `@google/genai` SDK |
| **Audio Synthesizer** | Web Audio API (Zero asset dependencies, instant harmonic chimes) |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+ (Node v20 or v24 recommended)
- **npm**: v9+

### 2. Install Dependencies
```bash
# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

### 3. Launch Development Servers
Run the backend and frontend simultaneously:
```bash
# Terminal 1: Backend Express Server (Port 5000)
npm run dev:server

# Terminal 2: Frontend Vite Client (Port 5173)
npm run dev:client
```

Open your browser to: **[http://localhost:5173](http://localhost:5173)**.

*Note: Mission OS includes a resilient local sandbox mode with pre-seeded missions, habits, goals, and achievements. It runs 100% interactively out-of-the-box even before cloud credentials are provided.*

---

## 🗄️ Supabase Cloud Configuration (Optional for Cloud Sync)

To connect your own live Supabase instance:
1. Open your Supabase project dashboard.
2. Go to the **SQL Editor** and paste the entire script from `supabase/schema.sql`.
3. Create `server/.env`:
   ```env
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GEMINI_API_KEY=your-gemini-api-key
   ```
4. Create `client/.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 📐 Project Structure

```text
mission_tracker/
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI primitives, Modals, Nav, Badges
│   │   ├── contexts/        # AuthContext, SoundContext
│   │   ├── layouts/         # AppLayout with collapsible sidebar
│   │   ├── lib/             # api.ts, supabase.ts
│   │   ├── pages/           # Dashboard, Missions, Goals, Habits, Analytics...
│   │   ├── types/           # TypeScript domain definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── config/          # env.ts, gemini.ts, supabase.ts
│   │   ├── controllers/     # Mission, Goal, Habit, Achievement, AI controllers
│   │   ├── middleware/      # Auth, Validation, Error Handling
│   │   ├── routes/          # Typed Express route routers
│   │   ├── schemas/         # Zod schemas for input validation
│   │   ├── services/        # MemoryStore with DB sync & streak math
│   │   ├── utils/           # Deterministic progress & streak formulas
│   │   └── index.ts
│   └── tsconfig.json
├── supabase/
│   └── schema.sql           # Complete 20-table DDL, Indexes, RLS Policies & Badges
└── package.json
```

---

## 🛡️ Enterprise Security & Data Isolation
- **Row Level Security**: Every table enforces multi-tenant row isolation via `auth.uid() = user_id`.
- **Server-Side AI**: Zero client-side API keys. All Gemini prompts execute through backend services with strict validation.
- **Defensive Timezones**: Streak calculations adapt to midnight roll-overs without mutating historic records.
