<div align="center">

<!-- Hero Logo -->
<img src="artifacts/livesafe/public/favicon.svg" width="80" height="80" alt="LiveSafe Logo" style="border-radius: 20px;" />

<h1 align="center">
  <span style="color: #3b82f6;">LiveSafe</span> AI
</h1>

<p align="center">
  <strong>Secure Your Community with AI-Powered Crime Prediction</strong>
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/Model-GradientBoosting%20(scikit--learn)-3b82f6?style=for-the-badge&logo=python&logoColor=white" alt="ML Model" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Holdout%20R²-0.886-22c55e?style=for-the-badge" alt="Holdout R2" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Coverage-445%20Real%20Geocoded%20Districts-6366f1?style=for-the-badge" alt="Coverage" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Data%20Source-NCRB%20District--Year%202010--2024-0ea5e9?style=for-the-badge" alt="Data Source" />
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-routes">API</a> •
  <a href="#screenshots">Screenshots</a>
</p>

</div>

---

## 🎯 Overview

**LiveSafe AI** is a next-generation public safety platform for Indian cities that visualizes real crime-risk data from the **National Crime Records Bureau (NCRB)** and forecasts near-term trends with a transparently-evaluated statistical model — **445 districts are real, geocoded NCRB data** (39% of 1,326 reported districts; the rest lack a matchable city in the open geocoding dataset used and are intentionally omitted rather than given invented coordinates).

> 🔮 *Proactive safety through real data analysis. Anticipate risks before they happen.*

> **Data & model honesty note (read this):** earlier versions of this README and the shipped hotspot dataset described a "96.5% accuracy XGBoost+LightGBM+RandomForest ensemble" that never existed in this codebase — it was hand-authored demo data. That has been replaced with a real pipeline (see [`ml-pipeline/`](./ml-pipeline)) built from the NCRB district-year CSVs. The honest result: a GradientBoostingRegressor scores **R²=0.886** on a true 2023–2024 holdout, but a naive "next year = this year" baseline scores **R²=0.929** on the same holdout — district-level crime severity is highly persistent year-over-year, and the model does not yet decisively beat that baseline. See [`ml-pipeline/README.md`](./ml-pipeline/README.md) for full methodology, limitations, and how to reproduce or refresh these numbers.

<div align="center">

| Metric | Value |
|--------|-------|
| 🧠 **Holdout R² (severity forecast)** | 0.886 (naive persistence baseline: 0.929) |
| 🧠 **Risk-class accuracy (holdout)** | 77.7% (naive persistence baseline: 82.5%) |
| 🏙️ **Districts Covered (real, geocoded)** | 445 of 1,326 reported |
| 📊 **Data Years** | NCRB district-year data, 2010–2024 |
| ⚡ **Model Type** | GradientBoostingRegressor (scikit-learn) |
| 🔴 **Critical Zones** | 40 districts at "critical" real NCRB severity |

</div>

---

## ✨ Features

<div align="center">

<table>
  <tr>
    <td width="50%" valign="top">

### 🔮 Real-Data Crime Risk
A GradientBoostingRegressor trained on real NCRB district-year features (crime counts, state-percentile ranks, year-over-year growth) forecasts next-year severity, honestly evaluated against a naive persistence baseline. Risk scores shown on the map are the real observed NCRB severity, not the model's forecast.

</td>
    <td width="50%" valign="top">

### 🗺️ Interactive Hotspot Map
Leaflet-powered dark-themed map with color-coded risk zones:
- 🔴 **Critical** | 🟠 **High** | 🟡 **Medium** | 🟢 **Low**
- Geolocation support — find your nearest risk zone instantly
- Detailed popups with safety warnings & ML confidence scores

</td>
  </tr>
  <tr>
    <td width="50%" valign="top">

### 🚨 Real-time SOS Alerts
Emergency alert system with live location sharing:
- Auto-refresh every **4 seconds**
- Role-based response workflow (Police → Acknowledge → Resolve)
- Google Maps integration for instant navigation
- Live location tracking with "moved" detection

</td>
    <td width="50%" valign="top">

### 📊 Analytics Dashboard
Beautiful Recharts-powered visualizations:
- 30-day crime trend forecasting (Actual vs Predicted)
- Crime type distribution analysis
- Real-time hotspot statistics
- Model performance monitoring

</td>
  </tr>
  <tr>
    <td width="50%" valign="top">

### 📝 Incident Reporting
Citizen-facing incident report submission with:
- Location tagging & category classification
- Photo/video evidence upload
- Status tracking from report to resolution

</td>
    <td width="50%" valign="top">

### 🔐 Role-Based Access Control
Multi-tier authentication system:
| Role | Access |
|------|--------|
| 👤 **Citizen** | Map, Report Incidents, Settings |
| 👮 **Police** | SOS Alerts, Analytics |
| 🛡️ **Admin** | ML Dashboard, User Management |
| 👑 **Super Admin** | Access Requests, System Control |

</td>
  </tr>
</table>

</div>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

### Machine Learning
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![pandas](https://img.shields.io/badge/pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)

### DevOps & Tools
![PNPM](https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

</div>

---

## 🏗️ Architecture

```
📦 LiveSafe (PNPM Monorepo)
│
├── 🎨 artifacts/
│   ├── livesafe/          # React + Vite Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── new-ui/       # Main App Shell
│   │   │   │   │   ├── Dashboard.tsx
│   │   │   │   │   ├── LandingPage.tsx
│   │   │   │   │   ├── Reports.tsx
│   │   │   │   │   └── Simulation.tsx
│   │   │   │   ├── ui/           # shadcn/ui Components
│   │   │   │   ├── layout/
│   │   │   │   └── HotspotMapNew.tsx
│   │   │   ├── pages/            # Route Pages
│   │   │   │   ├── HotspotMapPage.tsx
│   │   │   │   ├── SOSAlertsPage.tsx
│   │   │   │   ├── AnalyticsPage.tsx
│   │   │   │   ├── MLDashboardPage.tsx
│   │   │   │   ├── ReportIncidentPage.tsx
│   │   │   │   ├── UserManagementPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── app/
│   │   │   │   ├── hooks/        # useAuth, useApi
│   │   │   │   └── services/     # API Client
│   │   │   └── lib/              # Utils, Supabase Client
│   │   └── public/
│   │       └── india_hotspots_v5.json
│   │
│   └── api-server/        # Express API Server
│       ├── src/
│       │   ├── routes/
│       │   │   ├── health.ts
│       │   │   ├── auth.ts
│       │   │   ├── sos.ts
│       │   │   ├── incidents.ts
│       │   │   ├── admin.ts
│       │   │   └── ml.ts
│       │   ├── lib/
│       │   │   ├── auth.ts
│       │   │   ├── logger.ts
│       │   │   ├── seed.ts
│       │   │   └── whatsapp.ts
│       │   └── middlewares/
│       └── build.mjs
│
├── 📚 lib/
│   ├── db/                # Drizzle ORM Schema
│   │   └── src/schema/
│   │       ├── users.ts
│   │       ├── incidents.ts
│   │       ├── sos_alerts.ts
│   │       ├── sessions.ts
│   │       └── access_requests.ts
│   ├── api-spec/          # OpenAPI Specification
│   ├── api-zod/           # Zod Validation Types
│   └── api-client-react/  # Generated React Query Client
│
└── ⚙️ scripts/            # Build & Utility Scripts
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** `>= 22`
- **PNPM** `>= 10`
- **PostgreSQL** database (or Supabase project)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env` file in `artifacts/api-server/`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/livesafe
SESSION_SECRET=your-super-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations

```bash
pnpm --filter @workspace/db migrate
```

### 4. Start Development Servers

**Frontend** (requires `PORT` and `BASE_PATH`):

```bash
# Windows (Git Bash / MSYS)
MSYS_NO_PATHCONV=1 PORT=5173 BASE_PATH=/ pnpm --filter @workspace/livesafe dev

# Linux / macOS
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/livesafe dev
```

**API Server**:

```bash
pnpm --filter @workspace/api-server dev
```

### 5. Open in Browser

- 🎨 **Frontend**: http://localhost:5173
- 🔌 **API**: http://localhost:3000 (default)

---

## 📡 API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | — | Server health check |
| `POST` | `/auth/register` | — | User registration |
| `POST` | `/auth/login` | — | User login (session-based) |
| `POST` | `/auth/logout` | ✅ | Logout & clear session |
| `GET` | `/auth/me` | ✅ | Get current user |
| `GET` | `/hotspots` | ✅ | ML-predicted crime hotspots |
| `POST` | `/sos` | ✅ | Trigger emergency SOS alert |
| `GET` | `/sos` | 👮 | List all SOS alerts |
| `POST` | `/sos/:id/acknowledge` | 👮 | Acknowledge SOS alert |
| `POST` | `/sos/:id/resolve` | 👮 | Mark SOS as resolved |
| `POST` | `/incidents` | 👤 | Report new incident |
| `GET` | `/incidents` | ✅ | List incidents |
| `GET` | `/analytics/dashboard` | 👮 | Dashboard statistics |
| `GET` | `/ml/stats` | 🛡️ | ML model performance metrics |
| `GET` | `/admin/users` | 🛡️ | User management |
| `POST` | `/admin/requests` | 👑 | Handle access requests |

---

## 📸 Screenshots

<div align="center">

| 🏠 Landing Page | 🗺️ Hotspot Map | 📊 Analytics Dashboard |
|:--:|:--:|:--:|
| *AI-powered hero section with live risk overview* | *Interactive Leaflet map with 117 Indian cities* | *Recharts trend analysis & crime distribution* |

| 🚨 SOS Alerts | 📝 Report Incident | ⚙️ Settings |
|:--:|:--:|:--:|
| *Real-time emergency alerts with live tracking* | *Citizen incident reporting form* | *User preferences & account management* |

</div>

---

## 📈 ML Model Details

The real pipeline (`ml-pipeline/`) is a straightforward, honestly-evaluated forecasting model — not a stacked ensemble:

```
┌─────────────────────────────────────────────────┐
│              ml-pipeline/ (real)                 │
├───────────────────────────────────────────────────┤
│  Input: ncrb_district_year_features.csv           │
│         (1,326 districts × years 2010-2024)       │
│           ↓                                       │
│  01_build_master.py                                │
│  • normalize district/state names                 │
│  • geocode against real open dataset               │
│    (445/1,326 districts matched → real lat/lon)    │
│  • merge real Census 2011 population                │
│           ↓                                       │
│  02_train_model.py                                 │
│  • GradientBoostingRegressor (scikit-learn)         │
│  • 65 features: crime counts, state-percentile      │
│    ranks, YoY growth, current severity              │
│  • temporal holdout: train ≤2022, test 2023-2024    │
│           ↓                                       │
│  03_export_hotspots.py                              │
│  Output: hotspots_real.json (445 real districts)    │
│          state_summary_real.json (all 39 states)    │
└─────────────────────────────────────────────────┘
```

**Honest performance (true 2023–2024 temporal holdout, n=1,895):**
- **Severity R² Score**: 0.886 (5-fold CV on train period: 0.876 ± 0.005)
- **Severity MAE**: 0.061
- **Risk-class accuracy / precision / recall / F1**: 0.777 / 0.797 / 0.777 / 0.772
- **Naive "next year = this year" baseline**: R²=0.929, accuracy=0.825 — the model does **not** decisively beat this baseline, which itself is a real, useful finding: district crime severity is highly persistent year-over-year.
- **Top features by importance**: current severity (0.84), children-crime state-percentile (0.03), year (0.03), IPC state-percentile (0.03), IPC growth rate (0.02)

There is no unemployment/poverty/chargesheet-rate data in the source CSVs, so earlier fabricated fields with those names have been removed rather than kept with fake numbers. Full methodology, limitations, and reproduction steps: [`ml-pipeline/README.md`](./ml-pipeline/README.md).

---

## 🧪 Scripts

```bash
# Type-check entire monorepo
pnpm run typecheck

# Build all packages
pnpm run build

# Type-check libraries only
pnpm run typecheck:libs

# Run frontend dev server
pnpm --filter @workspace/livesafe dev

# Run API server dev
pnpm --filter @workspace/api-server dev

# Build frontend for production
pnpm --filter @workspace/livesafe build

# Build API server
pnpm --filter @workspace/api-server build
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔃 Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on code style, testing, and PR procedures.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- 📊 **National Crime Records Bureau (NCRB)** — Crime in India datasets
- 🗺️ **OpenStreetMap & CARTO** — Map tiles
- 🤖 **scikit-learn & pandas** — Core ML/data pipeline libraries (see [`ml-pipeline/`](./ml-pipeline))
- 🗺️ **Vynex/indian-cities-geodata** — Open district/city geocoding dataset
- 📊 **Census of India 2011** — District population data
- 🎨 **shadcn/ui** — Beautiful UI components

---

<div align="center">

<p>
  <strong>Built with 💙 for safer communities</strong>
</p>

<p>
  <sub>
    LiveSafe AI • CodeNakshatra • 2025
  </sub>
</p>

<img src="https://img.shields.io/badge/Made%20with-React%20%26%20Node.js-3b82f6?style=flat-square" alt="Made with" />
<img src="https://img.shields.io/badge/Monorepo-PNPM-f69220?style=flat-square" alt="PNPM" />
<img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="License" />

</div>

