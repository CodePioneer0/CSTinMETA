# SugarSense — AI-Powered Sugar Tracking & Wellness Platform

**Team: CSTinMETA**

SugarSense is a full-stack health-tech application that helps users track their daily sugar intake, receive real-time AI-powered risk predictions, and build healthier habits through gamification. It combines a scikit-learn ML model with a Groq-hosted LLM to deliver personalized insights after every sugar log.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [ML Model Details](#ml-model-details)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Key Features](#key-features)

---

## Architecture Overview

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│                  │       │                  │       │                  │
│  React Frontend  │──────▶│  Express Backend  │──────▶│  FastAPI ML Svc  │
│  (Vite + TW)     │  API  │  (Node.js)       │ HTTP  │  (Python)        │
│  Port 3000       │       │  Port 5000       │       │  Port 8000       │
│                  │       │                  │       │                  │
└──────────────────┘       └────────┬─────────┘       └────────┬─────────┘
                                    │                          │
                                    ▼                          ▼
                           ┌──────────────────┐       ┌──────────────────┐
                           │    MongoDB        │       │  Groq Cloud API  │
                           │    (Mongoose)     │       │  (LLaMA 3.1 8B) │
                           └──────────────────┘       └──────────────────┘
```

**Flow:** User logs sugar → Backend saves event + computes gamification → Backend calls ML service with health features → ML predicts risk score → Groq LLM generates personalized insight text → Response returned to frontend with risk, insight, action, XP.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI library |
| Vite | 5.3 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11.3 | Animations & transitions |
| Recharts | 2.12 | Data visualization (bar charts) |
| Lucide React | 0.400 | Icon library |
| React Router | 6.24 | Client-side routing |
| Axios | 1.7 | HTTP client |
| React Hot Toast | 2.4 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Express | 5.2 | REST API framework |
| Mongoose | 9.2 | MongoDB ODM |
| JSON Web Tokens | 9.0 | Authentication |
| bcrypt | 6.0 | Password hashing |
| express-validator | 7.3 | Request validation |
| Axios | 1.13 | Internal HTTP calls to ML service |
| uuid | 13.0 | Anonymous user ID generation |
| morgan | 1.10 | Request logging |
| dotenv | 17.2 | Environment variable management |

### ML Service
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| scikit-learn | ML model (risk prediction) |
| joblib | Model serialization/loading |
| pandas | Data preprocessing |
| Groq API (LLaMA 3.1-8B) | LLM-generated insight text |
| python-dotenv | Environment variable management |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | Primary data store (7 collections) |

---

## Project Structure

```
CSTinMETA/
├── README.md
├── Backend/                    # Express.js REST API
│   ├── server.js               # App entry point (port 5000)
│   ├── db.js                   # MongoDB connection
│   ├── package.json
│   ├── .env                    # MONGO_URI, JWT_SECRET
│   ├── middleware/
│   │   └── auth.js             # JWT auth middleware (reads authToken header)
│   ├── models/                 # Mongoose schemas (7 models)
│   │   ├── User.js
│   │   ├── SugarEvent.js
│   │   ├── Gamification.js
│   │   ├── Insight.js
│   │   ├── Action.js
│   │   ├── HealthDaily.js
│   │   └── RewardLog.js
│   └── routes/                 # API route handlers
│       ├── users.js            # /api/users — session start, onboarding
│       ├── auth.js             # /api/auth — signup, login
│       ├── sugar.js            # /api/sugar — log sugar, complete action
│       ├── dashboard.js        # /api/dashboard — aggregated dashboard data
│       ├── health.js           # /api/health — health permissions & sync
│       └── history.js          # /api — sugar history, insights, badges
├── ml_service/                 # FastAPI ML microservice
│   ├── app.py                  # Predict endpoint + Groq LLM integration
│   ├── requirements.txt
│   ├── risk_model.pkl          # Trained scikit-learn model
│   ├── time_encoder.pkl        # LabelEncoder for time_of_day
│   ├── sugar_encoder.pkl       # LabelEncoder for sugar_type
│   └── .env                    # GROQ_API_KEY
└── frontend/                   # React SPA (Vite)
    ├── package.json
    ├── vite.config.js          # Dev proxy → localhost:5000
    ├── tailwind.config.js      # Custom dark theme + colors
    ├── index.html
    └── src/
        ├── main.jsx            # React entry
        ├── App.jsx             # Routes + auth guards
        ├── index.css           # Glass morphism + orb styling
        ├── context/
        │   └── AuthContext.jsx  # Auth state + token management
        ├── api/                # Axios API layer
        │   ├── axios.js        # Base instance with auth interceptor
        │   ├── auth.js
        │   ├── dashboard.js
        │   ├── sugar.js
        │   ├── health.js
        │   └── history.js
        ├── components/
        │   ├── common/         # Button, Card, AnimatedPage, LoadingSpinner
        │   ├── layout/         # AppLayout, Sidebar, Navbar
        │   └── dashboard/      # SugarScoreRing, StatsGrid, XPBar, BadgeGrid, TodayLogs
        └── pages/
            ├── Welcome.jsx     # Landing / hero page
            ├── Login.jsx       # Email/password login
            ├── Signup.jsx      # Account creation
            ├── Onboarding.jsx  # DOB, gender, height, weight
            ├── Dashboard.jsx   # Main dashboard with score ring, stats, logs
            ├── LogSugar.jsx    # Sugar item picker + quantity
            ├── InsightResult.jsx # AI risk result, insight, action
            ├── History.jsx     # Charts + event list + insight history
            ├── HealthSync.jsx  # Health data permissions + manual sync
            └── Profile.jsx     # User info + navigation
```

---

## ML Model Details

### Risk Prediction Model

| Property | Value |
|---|---|
| **Type** | scikit-learn regression model |
| **File** | `ml_service/risk_model.pkl` |
| **Output** | Risk score (0.0 – 1.0) |
| **Encoders** | `time_encoder.pkl` (LabelEncoder for time_of_day), `sugar_encoder.pkl` (LabelEncoder for sugar_type) |

### Input Features

| Feature | Type | Source |
|---|---|---|
| `bmi` | float | Calculated during onboarding (weight/height²) |
| `steps_today` | int | From HealthDaily record |
| `sleep_hours` | float | Derived from sleep_minutes ÷ 60 |
| `sugar_count_today` | int | Count of SugarEvent documents for today |
| `sugar_count_week` | int | Count of SugarEvent documents for last 7 days |
| `time_of_day` | encoded | Label-encoded: MORNING, AFTERNOON, EVENING, NIGHT |
| `sugar_type` | encoded | Label-encoded: CHAI, COFFEE, SWEETS, etc. |

### Risk Tags (Rule-Based Logic)

The ML risk score is combined with rule-based logic to assign a classification:

| Condition | Risk Tag |
|---|---|
| `sugar_count_week >= 10` | `HIGH_SUGAR_HABIT` |
| `sleep_hours < 6` AND `risk > 0.5` | `SLEEP_DISRUPTION` |
| `steps_today < 3000` | `WEIGHT_GAIN_RISK` |
| `risk > 0.7` | `ENERGY_CRASH` |
| Fallback | `DEHYDRATION_RISK` |

### Suggested Actions (Rule-Based)

| Condition | Action |
|---|---|
| `sugar_count_today >= 3` | `STOP_MORE_SUGAR` |
| `steps_today < 5000` | `10_MIN_WALK` |
| `sleep_hours < 6` | `DRINK_WATER` |
| `risk > 0.6` | `PROTEIN_SWAP` |
| Fallback | `EAT_FRUIT` |

### Groq LLM Integration

After the ML model predicts, the system calls **Groq Cloud API** (`llama-3.1-8b-instant`) to generate human-friendly insight text and action explanations. The LLM receives full context (BMI, steps, sleep, risk score, risk tag, suggested action) and returns JSON with `insight_text` (≤20 words) and `explanation` (≤25 words). If the LLM call fails, hardcoded fallback text is used.

---

## API Reference

All authenticated endpoints require the `authToken` header containing a valid JWT.

### User & Session

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users/session/start` | No | Creates anonymous user + gamification record, returns JWT (1h expiry) |
| `PUT` | `/api/users/onboarding` | Yes | Saves DOB, gender, height, weight; calculates BMI; marks onboarding complete |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Yes | Upgrades anonymous user with email/password; returns new JWT (30d) |
| `POST` | `/api/auth/login` | No | Email/password login; returns JWT (30d) + anonymousId |

### Sugar Tracking (Core)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/sugar/log` | Yes | Logs sugar event → triggers gamification → calls ML service → saves insight & action → returns full result |
| `POST` | `/api/sugar/action/complete` | Yes | Marks suggested action as completed; awards 3 XP (or 7 XP if within 30 min) |

#### `POST /api/sugar/log` Request Body
```json
{
  "itemType": "CHAI",
  "quantity": 2,
  "timestamp": "2026-02-13T10:30:00.000Z"
}
```

**Item Types:** `CHAI`, `COFFEE`, `SWEETS`, `COLD_DRINK`, `PACKAGED_SNACK`, `ICE_CREAM`, `CHOCOLATE`, `JUICE`, `OTHER`

#### `POST /api/sugar/log` Response
```json
{
  "message": "Sugar event logged successfully",
  "sugarEvent": { ... },
  "pointsAwarded": 8,
  "basePoints": 5,
  "bonusPoints": 3,
  "surpriseReward": false,
  "streakCount": 3,
  "bestStreak": 7,
  "xp": 158,
  "level": 2,
  "insight": {
    "riskTag": "ENERGY_CRASH",
    "riskScore": 0.72,
    "insightText": "Your second chai today may cause an afternoon energy dip.",
    "suggestedAction": "DRINK_WATER",
    "explanation": "Water helps balance sugar levels and prevents dehydration."
  },
  "action": {
    "actionType": "DRINK_WATER",
    "status": "PENDING"
  }
}
```

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | Yes | Returns sugar score, XP, level, streak, today's logs, badges |

### Health Data

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `PUT` | `/api/health/connect` | Yes | Save health permission flags (steps, sleep, heartRate) |
| `POST` | `/api/health/sync` | Yes | Submit daily health data (steps, sleepMinutes, avgHeartRate, source) |

### History

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/sugar/history?days=7` | Yes | Sugar events for last N days |
| `GET` | `/api/insights/history?days=7` | Yes | AI insights for last N days |
| `GET` | `/api/badges` | Yes | All earned badges |

### ML Service

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `http://localhost:8000/predict` | Accepts health features, returns risk score + tag + insight + action |

#### ML `/predict` Request
```json
{
  "bmi": 24.5,
  "steps_today": 6000,
  "sleep_minutes": 420,
  "sugar_count_today": 2,
  "sugar_count_week": 8,
  "time_of_day": "AFTERNOON",
  "sugar_type": "CHAI",
  "estimated_sugar_grams": 24
}
```

#### ML `/predict` Response
```json
{
  "risk_tag": "ENERGY_CRASH",
  "risk_score": 0.72,
  "insight_text": "Your second chai today may cause an afternoon energy dip.",
  "suggested_action": "DRINK_WATER",
  "explanation": "Water helps balance sugar levels and prevents dehydration."
}
```

---

## Database Schema

7 MongoDB collections managed via Mongoose:

### User
Stores user profile, onboarding data, BMI, health permissions.
- `anonymousId` (unique), `email` (sparse unique), `passwordHash`, `isSignedUp`, `dob`, `age`, `gender` (MALE/FEMALE/OTHER), `heightCm`, `weightKg`, `bmi`, `onboardingCompleted`, `healthPermission` (steps/sleep/heartRate booleans)

### SugarEvent
Each sugar intake log.
- `userId`, `itemType` (9 enum values), `quantity`, `timestamp`, `date` (YYYY-MM-DD), `timeOfDay` (MORNING/AFTERNOON/EVENING/NIGHT)
- Indexed on `{ userId, timestamp }`

### Gamification
XP, leveling, streaks, and badges per user.
- `userId` (unique), `xp`, `level`, `streakCount`, `bestStreak`, `lastLogDate`, `badges[]`

### Insight
AI-generated insights linked to sugar events.
- `userId`, `sugarEventId` (unique), `riskTag`, `riskScore`, `insightText`, `suggestedAction`, `explanation`, `modelVersion`

### Action
Suggested actions for each sugar event.
- `userId`, `sugarEventId`, `actionType`, `status` (PENDING/COMPLETED/EXPIRED), `suggestedAt`, `completedAt`, `completedWithin30Min`

### HealthDaily
One health record per user per day.
- `userId`, `date`, `steps`, `sleepMinutes`, `avgHeartRate`, `source` (SIMULATED/GOOGLE_FIT/APPLE_HEALTH)
- Unique compound index on `{ userId, date }`

### RewardLog
Audit trail of all XP awards.
- `userId`, `eventType` (SUGAR_LOG/ACTION_COMPLETE), `referenceId`, `basePoints`, `bonusPoints`, `totalPoints`, `surpriseReward`

---

## Setup & Installation

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.9
- **MongoDB** (local or cloud — e.g., MongoDB Atlas)
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CSTinMETA
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install ML Service Dependencies

```bash
cd ../ml_service
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend (`Backend/.env`)

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### ML Service (`ml_service/.env`)

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

> **Note:** The frontend uses Vite's dev proxy (`/api` → `http://localhost:5000`) and does not need its own `.env` file.

---

## Running the Project

Start all three services in separate terminals:

### Terminal 1 — Backend (Express)

```bash
cd Backend
node server.js
```

Server starts on `http://localhost:5000`

### Terminal 2 — ML Service (FastAPI)

```bash
cd ml_service
python -m uvicorn app:app --reload --port 8000
```

ML API starts on `http://localhost:8000`

### Terminal 3 — Frontend (Vite)

```bash
cd frontend
npm run dev
```

Frontend starts on `http://localhost:3000`

Open **http://localhost:3000** in your browser.

---

## Deployment

### Frontend (Static Build)

```bash
cd frontend
npm run build
```

Output in `frontend/dist/` — deploy to Vercel, Netlify, or any static host. Set the API base URL via environment variable if the backend is hosted separately.

### Backend

Deploy to any Node.js host (Railway, Render, AWS EC2, Heroku):
- Set `MONGO_URI`, `JWT_SECRET`, and `PORT` environment variables
- Run `node server.js`

### ML Service

Deploy to any Python host (Railway, Render, AWS EC2):
- Set `GROQ_API_KEY` environment variable
- Run `uvicorn app:app --host 0.0.0.0 --port 8000`
- Ensure `risk_model.pkl`, `time_encoder.pkl`, `sugar_encoder.pkl` are included in deployment

### Cross-Service Configuration

- The backend calls the ML service at `http://localhost:8000/predict` (in `Backend/routes/sugar.js`). Update this URL for production deployment.
- The frontend proxies `/api` to `http://localhost:5000` in development. For production, configure the API base URL in the Axios instance.

---

## Key Features

### AI & ML Pipeline
- **scikit-learn risk model** predicts sugar crash risk (0–1 score) based on BMI, activity, sleep, and sugar habits
- **Groq LLM** (LLaMA 3.1-8B) generates personalized, friendly insight text and action explanations
- **Rule-based classification** assigns risk tags and action recommendations
- **Fallback system** ensures insights are always returned even if LLM/ML fails

### Gamification System
- **XP Points** — 5 base + up to 3 time bonus + random surprise bonus (2/5/10 XP)
- **Levels** — Level up every 100 XP
- **Streaks** — Consecutive daily logging tracked; best streak recorded
- **Badges** — FIRST_LOG, DAY_3_STREAK, DAY_7_STREAK, DAY_30_STREAK, QUICK_FIXER (action within 30 min)
- **Variable Rewards** — Random bonus XP creates engagement loop

### Authentication
- **Anonymous-first** — Users start without signup; a UUID-based anonymous session is created
- **Optional upgrade** — Users can add email/password to persist data across devices
- **JWT-based** — 1-hour tokens for anonymous sessions, 30-day tokens for signed-up users

### Health Integration
- Permission-based access to steps, sleep, and heart rate data
- Manual sync with daily health summaries
- Health data feeds into ML predictions for more accurate risk assessment

### Frontend UI
- **Desktop-first** widescreen layout optimized for 1080p+ monitors
- Dark glassmorphic theme with purple/orange gradient accents
- Fixed sidebar navigation with animated active states
- Multi-column dashboard with sugar score ring, stats grid, and today's logs
- Interactive bar charts for sugar history visualization
- Animated page transitions with Framer Motion
