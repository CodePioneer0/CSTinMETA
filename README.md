# SugarSense — AI-Powered Sugar Tracking & Wellness Platform

**Team: CSTinMETA**

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Tech Stack](#2-tech-stack)
- [3. System Architecture](#3-system-architecture)
- [4. Setup & Installation](#4-setup--installation)
- [5. APIs Used](#5-apis-used)
- [6. Machine Learning Models](#6-machine-learning-models)
- [7. Running the Project](#7-running-the-project)
- [8. Deployment](#8-deployment)
- [9. Evaluation & Judging Notes](#9-evaluation--judging-notes)
- [10. Future Improvements](#10-future-improvements)

---

## 1. Project Overview

### Problem Statement

Young adults consume sugar throughout the day — in chai, coffee, cold drinks, packaged snacks — without understanding the cumulative health impact. Existing health apps focus on calorie counting or meal logging, which are tedious and rarely sustained. There is no lightweight tool that specifically tracks sugar intake, predicts its short-term health effects (energy crashes, sleep disruption, weight gain risk), and motivates users to act on those insights.

### Solution

**SugarSense** is a full-stack health-tech web application that lets users log their daily sugar intake with a single tap, then instantly delivers AI-powered risk predictions and personalized actionable insights. A gamification layer (XP, levels, streaks, badges) keeps users engaged and builds long-term healthy habits.

### Key Features & Innovations

- **One-Tap Sugar Logging** —  Select an item type (Chai, Coffee, Sweets, etc.) and quantity; the system handles everything else automatically.
- **Image-Based Sugar Logging** — Snap a photo of your food/drink; Cloudinary stores the image and IMAGGA's image-recognition API auto-detects the item type, removing the need for manual selection.
- **Real-Time ML Risk Prediction** — A scikit-learn regression model predicts a 0–1 risk score based on BMI, daily steps, sleep, and sugar history.
- **LLM-Generated Personalized Insights** — Groq Cloud API (LLaMA 3.1-8B) produces friendly, concise insight text and action explanations tailored to the user's context.
- **Rule-Based Risk Tags & Actions** — Combines ML output with deterministic rules to classify risks (e.g., `ENERGY_CRASH`, `SLEEP_DISRUPTION`) and suggest specific actions (e.g., `10_MIN_WALK`, `DRINK_WATER`).
- **Gamification Engine** — XP points with variable rewards, level progression (every 100 XP), daily streaks, and unlockable badges (`FIRST_LOG`, `DAY_7_STREAK`, `QUICK_FIXER`).
- **Anonymous-First Authentication** — Users start instantly without signup; they can optionally upgrade to email/password to persist data across devices.
- **Health Data Integration** — Steps, sleep, and heart rate data feed into ML predictions for higher accuracy.
- **Visual Analytics Dashboard** — Sugar score ring, stats grid, XP progress bar, badge collection, and interactive bar charts for historical trends.
- **Responsive Multi-Device UI** — Core pages, navigation, dashboards, forms, and auth screens now adapt across mobile, tablet, and desktop breakpoints.
- **Graceful Fallbacks** — If the ML service or LLM is unavailable, hardcoded fallback insights and actions are returned so the user experience is never broken.

---

## 2. Tech Stack

### Frontend

| Technology       | Version | Purpose                          |
| ---------------- | ------- | -------------------------------- |
| React            | 18.3    | UI library                       |
| Vite             | 5.3     | Build tool & dev server          |
| Tailwind CSS     | 3.4     | Utility-first styling            |
| Framer Motion    | 11.3    | Page transitions & animations    |
| Recharts         | 2.12    | Data visualization (bar charts)  |
| Lucide React     | 0.400   | Icon library                     |
| React Router     | 6.24    | Client-side routing              |
| Axios            | 1.7     | HTTP client                      |
| React Hot Toast  | 2.4     | Toast notifications              |

### Backend

| Technology        | Version | Purpose                              |
| ----------------- | ------- | ------------------------------------ |
| Node.js + Express | 5.2     | REST API framework                   |
| Mongoose          | 9.2     | MongoDB ODM                          |
| JSON Web Tokens   | 9.0     | Authentication                       |
| bcrypt            | 6.0     | Password hashing                     |
| express-validator | 7.3     | Request validation                   |
| Axios             | 1.13    | Internal HTTP calls to ML service    |
| uuid              | 13.0    | Anonymous user ID generation         |
| dotenv            | 17.2    | Environment variable management      |
| Cloudinary        | 1.41    | Cloud image storage for food photos  |
| Multer            | 2.0     | Multipart file upload middleware     |
| multer-storage-cloudinary | 4.0 | Cloudinary storage engine for Multer |

### Database / Storage

| Technology | Purpose                              |
| ---------- | ------------------------------------ |
| MongoDB    | Primary data store (7 collections)   |
| Cloudinary | Cloud image storage for sugar log photos |

### Machine Learning

| Technology                  | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| FastAPI                     | ML microservice REST framework           |
| scikit-learn                | Regression model for risk prediction     |
| joblib                      | Model & encoder serialization            |
| pandas                      | Feature preprocessing                    |
| Groq Cloud API (LLaMA 3.1) | LLM-generated insight text & explanations |

### Image Recognition

| Technology | Purpose                                            |
| ---------- | -------------------------------------------------- |
| IMAGGA API | Image tagging — detects food/drink type from photos |

### Deployment / Infrastructure

| Tool    | Purpose                                     |
| ------- | ------------------------------------------- |
| Vercel  | Frontend static hosting (configured)        |
| Render  | Backend and ML service hosting              |

---

## 3. System Architecture

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│                  │       │                  │       │                  │
│  React Frontend  │──────▶│  Express Backend  │──────▶│  FastAPI ML Svc  │
│  (Vite + TW)     │  API  │  (Node.js)       │ HTTP  │  (Python)        │
│  Port 3000       │       │  Port 5000       │       │  Port 8000       │
│                  │       │                  │       │                  │
└──────────────────┘       └────────┬─────────┘       └────────┬─────────┘
                                    │                          │
                           ┌────────┼─────────┐                ▼
                           │        │         │       ┌──────────────────┐
                           ▼        ▼         ▼       │  Groq Cloud API  │
                  ┌────────────┐ ┌────────┐ ┌───────┐ │  (LLaMA 3.1 8B) │
                  │ Cloudinary │ │MongoDB │ │IMAGGA │ └──────────────────┘
                  │ (Images)   │ │(Data)  │ │(Tags) │
                  └────────────┘ └────────┘ └───────┘
```

### Component Responsibilities

| Component           | Role                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------- |
| **React Frontend**  | SPA with routing, auth context, API layer (Axios), dashboard visualizations, and page views    |
| **Express Backend** | REST API handling authentication, sugar logging, gamification logic, health data, and history   |
| **FastAPI ML Svc**  | Loads pre-trained scikit-learn model, applies rule-based classification, calls Groq LLM         |
| **MongoDB**         | Stores users, sugar events, gamification, insights, actions, health data, and reward logs        |
| **Cloudinary**      | Stores uploaded food/drink images and returns a public URL saved with the sugar event             |
| **IMAGGA API**      | Analyses uploaded images and returns tags used to auto-detect the sugar item type                 |
| **Groq Cloud API**  | Generates natural-language insight text and action explanations from structured context           |

### Data Flow (Sugar Log — Manual)

1. User selects a sugar item and quantity on the frontend.
2. Frontend sends `POST /api/sugar/log` with `itemType`, `quantity`, and `timestamp`.
3. Backend saves the `SugarEvent`, updates `Gamification` (XP, streak, badges), and creates a `RewardLog`.
4. Backend gathers ML features: user BMI, today's steps/sleep from `HealthDaily`, sugar counts (today + week), time of day, and estimated sugar grams.
5. Backend calls `POST http://<ML_SERVICE_URL>/predict` with these features.
6. ML service runs the scikit-learn model to produce a risk score (0–1), applies rule-based logic for risk tag and suggested action, then calls Groq LLM for natural-language insight text.
7. ML service returns `risk_tag`, `risk_score`, `insight_text`, `suggested_action`, and `explanation`.
8. Backend saves an `Insight` and a pending `Action`, then returns the full response (sugar event + gamification data + insight + action) to the frontend.
9. Frontend displays the InsightResult page with risk score, insight text, and a button to complete the suggested action.

### Data Flow (Sugar Log — Image)

1. User uploads a photo of their food/drink on the frontend.
2. Frontend sends `POST /api/sugar/log-image` with the image file (multipart/form-data), optional `quantity`, and `timestamp`.
3. **Multer** middleware uploads the image to **Cloudinary** (`sugar_logs` folder) and returns a public URL.
4. Backend calls the **IMAGGA API** with the Cloudinary image URL to get image tags (e.g., "coffee", "cake", "soda").
5. The `detectFoodItem()` function maps IMAGGA tags to a valid `itemType` (e.g., tags containing "coffee" or "espresso" → `COFFEE`). If no match is found, it defaults to `OTHER`.
6. Backend saves the `SugarEvent` (including the `imageUrl` field) and follows the same gamification → ML prediction → insight pipeline as the manual flow.
7. The response includes the auto-detected `detectedItemType` so the frontend can display what was recognized.

---

## 4. Setup & Installation

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.9
- **MongoDB** (local instance or MongoDB Atlas cloud)
- **Groq API Key** — free at [console.groq.com](https://console.groq.com)

### Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd CSTinMETA

# 2. Install backend dependencies
cd Backend
npm install

# 3. Install ML service dependencies
cd ../ml_service
pip install -r requirements.txt

# 4. Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

#### Backend — `Backend/.env`

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key_here
ML_SERVICE_URL=http://localhost:8000
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
IMAGGA_API_KEY=your_imagga_api_key
IMAGGA_API_SECRET=your_imagga_api_secret
```

#### ML Service — `ml_service/.env`

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

#### Frontend — `frontend/.env`

```env
VITE_APP_URL=http://localhost:5000
```

> The frontend uses Vite's dev proxy (`/api` → backend URL) so no separate API base URL is needed in code.

---

## 5. APIs Used

### Internal REST API (Express Backend)

| Name           | Purpose                                                      | Auth Method           |
| -------------- | ------------------------------------------------------------ | --------------------- |
| User & Session | Anonymous session creation, onboarding profile               | JWT via `authToken` header |
| Auth           | Email/password signup (upgrades anonymous user) and login     | JWT via `authToken` header |
| Sugar          | Log sugar events, complete suggested actions                  | JWT via `authToken` header |
| Dashboard      | Aggregated dashboard data (score, XP, streak, today's logs)  | JWT via `authToken` header |
| Health         | Store/retrieve health permissions and daily health sync       | JWT via `authToken` header |
| History        | Sugar event history, insight history, badge list              | JWT via `authToken` header |

#### Key Endpoints

| Method | Endpoint                      | Description                                              |
| ------ | ----------------------------- | -------------------------------------------------------- |
| POST   | `/api/users/session/start`    | Creates anonymous user + gamification record, returns JWT |
| PUT    | `/api/users/onboarding`       | Saves DOB, gender, height, weight; calculates BMI         |
| POST   | `/api/auth/signup`            | Upgrades anonymous user with email/password               |
| POST   | `/api/auth/login`             | Email/password login; returns JWT (30-day expiry)         |
| POST   | `/api/sugar/log`              | Logs sugar event → gamification → ML prediction → insight |
| POST   | `/api/sugar/log-image`        | Upload food image → auto-detect item type → log sugar event |
| POST   | `/api/sugar/action/complete`  | Marks action as completed; awards XP                      |
| GET    | `/api/dashboard`              | Returns sugar score, XP, level, streak, today's logs      |
| GET    | `/api/health/permissions`     | Returns current health permission flags                   |
| PUT    | `/api/health/connect`         | Save health permission flags (steps, sleep, heartRate)    |
| POST   | `/api/health/sync`            | Submit daily health data (steps, sleep, heart rate)       |
| GET    | `/api/sugar/history?days=7`   | Sugar events for last N days                              |
| GET    | `/api/insights/history?days=7`| AI insights for last N days                               |
| GET    | `/api/badges`                 | All earned badges                                         |

### ML Microservice (FastAPI)

| Method | Endpoint   | Purpose                                                   |
| ------ | ---------- | --------------------------------------------------------- |
| POST   | `/predict` | Accepts health features, returns risk score + insight + action |

### External API — Groq Cloud

| Name     | Purpose                                                 | Endpoint                                          | Auth Method             |
| -------- | ------------------------------------------------------- | ------------------------------------------------- | ----------------------- |
| Groq API | Generate natural-language insight text and explanations  | `https://api.groq.com/openai/v1/chat/completions` | Bearer token (`GROQ_API_KEY`) |

### External API — IMAGGA

| Name      | Purpose                                                  | Endpoint                             | Auth Method                         |
| --------- | -------------------------------------------------------- | ------------------------------------ | ----------------------------------- |
| IMAGGA API | Image tagging — detects food/drink type from uploaded photos | `https://api.imagga.com/v2/tags`    | Basic auth (`IMAGGA_API_KEY:IMAGGA_API_SECRET`) |

The IMAGGA API is called from the backend when a user uploads a food image via `/api/sugar/log-image`. The returned tags are matched against known sugar item types (CHAI, COFFEE, SWEETS, etc.) using keyword heuristics. If no recognizable food item is found, the type defaults to `OTHER`.

### External Service — Cloudinary

| Name       | Purpose                                            | Auth Method                                    |
| ---------- | -------------------------------------------------- | ---------------------------------------------- |
| Cloudinary | Cloud image upload & storage for food/drink photos | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

Images are uploaded to the `sugar_logs` folder on Cloudinary. The returned public URL is stored in the `SugarEvent.imageUrl` field and also passed to IMAGGA for tag detection.

The Groq API is called from the ML service using the **LLaMA 3.1-8B Instant** model. It receives structured context (BMI, steps, sleep, risk score, risk tag, suggested action) and returns JSON with `insight_text` (<=20 words) and `explanation` (<=25 words).

---

## 6. Machine Learning Models

### Risk Prediction Model

| Property       | Value                                              |
| -------------- | -------------------------------------------------- |
| **Type**       | scikit-learn regression model                      |
| **File**       | `ml_service/risk_model.pkl`                        |
| **Output**     | Risk score (0.0 – 1.0), clamped                   |
| **Encoders**   | `time_encoder.pkl` (LabelEncoder), `sugar_encoder.pkl` (LabelEncoder) |
| **Framework**  | scikit-learn, loaded via joblib                    |

### Input Features

| Feature             | Type    | Source                                       |
| ------------------- | ------- | -------------------------------------------- |
| `bmi`               | float   | Calculated during onboarding (weight/height²) |
| `steps_today`       | int     | From HealthDaily record                       |
| `sleep_hours`       | float   | Derived from `sleep_minutes / 60`             |
| `sugar_count_today` | int     | Count of SugarEvent documents for today       |
| `sugar_count_week`  | int     | Count of SugarEvent documents for last 7 days |
| `time_of_day`       | encoded | Label-encoded: MORNING, AFTERNOON, EVENING, NIGHT |
| `sugar_type`        | encoded | Label-encoded: CHAI, COFFEE, SWEETS, COLD_DRINK, PACKAGED_SNACK, ICE_CREAM, CHOCOLATE, JUICE, OTHER |

### Dataset & Training

The model is pre-trained and serialized as `risk_model.pkl`. The training dataset and training script are not included in this repository. The model accepts the 7 features above and outputs a continuous risk score.

### Risk Tags (Rule-Based Post-Processing)

After the ML model predicts a risk score, rule-based logic assigns a classification:

| Priority | Condition                              | Risk Tag            |
| -------- | -------------------------------------- | ------------------- |
| 1        | `sugar_count_week >= 10`               | `HIGH_SUGAR_HABIT`  |
| 2        | `sleep_hours < 6` AND `risk > 0.5`    | `SLEEP_DISRUPTION`  |
| 3        | `steps_today < 3000`                   | `WEIGHT_GAIN_RISK`  |
| 4        | `risk > 0.7`                           | `ENERGY_CRASH`      |
| 5        | Fallback                               | `DEHYDRATION_RISK`  |

### Suggested Actions (Rule-Based)

| Priority | Condition                  | Action            |
| -------- | -------------------------- | ----------------- |
| 1        | `sugar_count_today >= 3`   | `STOP_MORE_SUGAR` |
| 2        | `steps_today < 5000`       | `10_MIN_WALK`     |
| 3        | `sleep_hours < 6`          | `DRINK_WATER`     |
| 4        | `risk > 0.6`               | `PROTEIN_SWAP`    |
| 5        | Fallback                   | `EAT_FRUIT`       |

### LLM Integration

After classification, the ML service calls **Groq Cloud API** with the full user context to generate:
- `insight_text` — a cause-effect insight (<=20 words)
- `explanation` — why the suggested action was chosen (<=25 words)

If the Groq API call fails or `GROQ_API_KEY` is not set, hardcoded fallback text is used for each risk tag and action type, ensuring the system always returns a complete response.

### System Integration

The Express backend calls the ML service via `POST http://<ML_SERVICE_URL>/predict` during every sugar log. If the ML service is unreachable, the backend uses a hardcoded fallback response so user experience is never interrupted.

---

## 7. Running the Project

Start all three services in separate terminals:

### Terminal 1 — Backend (Express)

```bash
cd Backend
node server.js
```

Server starts on `http://localhost:5000`.

### Terminal 2 — ML Service (FastAPI)

```bash
cd ml_service
python -m uvicorn app:app --reload --port 8000
```

ML API starts on `http://localhost:8000`.

### Terminal 3 — Frontend (Vite)

```bash
cd frontend
npm run dev
```

Frontend starts on `http://localhost:3000`.

Open **http://localhost:3000** in your browser.

### Sample Workflow

1. **Landing Page** → Click "Get Started" (creates anonymous session automatically).
2. **Onboarding** → Enter DOB, gender, height, weight → BMI is calculated.
3. **Health Sync** → Optionally grant permissions and submit steps/sleep data.
4. **Log Sugar** → Select item type (e.g., `CHAI`), set quantity, submit.
5. **Insight Result** → View risk score (0–1), risk tag, AI-generated insight, and suggested action. Click to complete the action for bonus XP.
6. **Dashboard** → View sugar score ring, XP bar, streak count, today's logs, and badges.
7. **History** → View bar charts of sugar intake and scroll through past insights.

### Sample Request / Response

**Log Sugar:**

```bash
curl -X POST http://localhost:5000/api/sugar/log \
  -H "Content-Type: application/json" \
  -H "authToken: <your_jwt_token>" \
  -d '{
    "itemType": "CHAI",
    "quantity": 2,
    "timestamp": "2026-02-13T10:30:00.000Z"
  }'
```

**Response:**

```json
{
  "message": "Sugar event logged successfully",
  "sugarEvent": {
    "itemType": "CHAI",
    "quantity": 2,
    "date": "2026-02-13",
    "timeOfDay": "MORNING"
  },
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

**Log Sugar via Image:**

```bash
curl -X POST http://localhost:5000/api/sugar/log-image \
  -H "authToken: <your_jwt_token>" \
  -F "image=@/path/to/coffee.jpg" \
  -F "quantity=1" \
  -F "timestamp=2026-02-13T10:30:00.000Z"
```

**Response:**

```json
{
  "message": "Sugar event logged successfully",
  "detectedItemType": "COFFEE",
  "sugarEvent": {
    "itemType": "COFFEE",
    "quantity": 1,
    "date": "2026-02-13",
    "timeOfDay": "MORNING",
    "imageUrl": "https://res.cloudinary.com/<cloud>/image/upload/v.../sugar_logs/abc123.jpg"
  },
  "pointsAwarded": 8,
  "basePoints": 5,
  "bonusPoints": 3,
  "surpriseReward": false,
  "streakCount": 3,
  "xp": 166,
  "level": 2,
  "insight": {
    "riskTag": "ENERGY_CRASH",
    "riskScore": 0.68,
    "insightText": "Your coffee adds to today's sugar load, risking an energy dip.",
    "suggestedAction": "DRINK_WATER",
    "explanation": "Water helps offset caffeine-induced dehydration."
  }
}
```

**ML Predict (direct):**

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "bmi": 24.5,
    "steps_today": 6000,
    "sleep_minutes": 420,
    "sugar_count_today": 2,
    "sugar_count_week": 8,
    "time_of_day": "AFTERNOON",
    "sugar_type": "CHAI",
    "estimated_sugar_grams": 24
  }'
```

**Response:**

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

## 8. Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
```

- Output directory: `frontend/dist/`
- A `vercel.json` is included with SPA rewrites configured.
- Deploy to **Vercel** via CLI (`vercel --prod`) or GitHub integration.
- Set `VITE_APP_URL` to your production backend URL during build.

### Backend (Node.js Host)

Deploy to **Railway**, **Render**, **AWS EC2**, or **Heroku**:

```bash
cd Backend
node server.js
```

Required environment variables:

| Variable         | Description                                   |
| ---------------- | --------------------------------------------- |
| `MONGO_URI`      | MongoDB connection string                     |
| `JWT_SECRET`     | Secret key for JWT signing                    |
| `ML_SERVICE_URL` | URL of the deployed ML service                |
| `PORT`           | Server port (default: 5000)                   |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                  |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                     |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                  |
| `IMAGGA_API_KEY`        | IMAGGA API key for image tagging       |
| `IMAGGA_API_SECRET`     | IMAGGA API secret                      |

### ML Service (Python Host)

Deploy to **Railway**, **Render**, or **AWS EC2**:

```bash
cd ml_service
uvicorn app:app --host 0.0.0.0 --port 8000
```

Required environment variables:

| Variable       | Description          |
| -------------- | -------------------- |
| `GROQ_API_KEY` | Groq Cloud API key   |

Required files (must be included in deployment):
- `risk_model.pkl`
- `time_encoder.pkl`
- `sugar_encoder.pkl`

### Cross-Service Configuration

| Connection              | Dev Value                              | Production Action                              |
| ----------------------- | -------------------------------------- | ---------------------------------------------- |
| Frontend → Backend      | Vite proxy `/api` → `localhost:5000`   | Set `VITE_APP_URL` to production backend URL   |
| Backend → ML Service    | `ML_SERVICE_URL=http://localhost:8000` | Set to deployed ML service URL                 |
| Backend → MongoDB       | `MONGO_URI` in `.env`                  | Use production MongoDB Atlas connection string |
| ML Service → Groq       | `GROQ_API_KEY` in `.env`              | Same key works in production                   |
| Backend → Cloudinary    | `CLOUDINARY_*` vars in `.env`         | Same credentials work in production            |
| Backend → IMAGGA        | `IMAGGA_*` vars in `.env`             | Same credentials work in production            |

### Production CORS

The backend allows these origins by default:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://sugarsense-ten.vercel.app`

Add your production frontend URL to the `allowedOrigins` array in `Backend/server.js`.

---

## 9. Evaluation & Judging Notes

### How to Test Core Features

1. **Start all 3 services** (backend, ML, frontend) as described in Section 7.
2. **Open http://localhost:3000** — you should see the Welcome page with feature cards.
3. **Click "Get Started"** → Complete onboarding with sample data (e.g., DOB: 2000-01-15, Gender: MALE, Height: 175, Weight: 70).
4. **Navigate to Health Sync** → Submit sample health data (e.g., steps: 5000, sleepMinutes: 420).
5. **Log a sugar item** → Select "CHAI", quantity 1. Observe the InsightResult page showing risk score, AI-generated insight, risk tag, and suggested action.
5b. **Log via image** → Upload a photo of a food/drink. Verify the system auto-detects the item type (e.g., a coffee photo → `COFFEE`) and produces the same insight flow.
6. **Complete the action** → Click the action completion button. Verify XP is awarded (7 XP if within 30 min, 3 XP otherwise).
7. **Log multiple items** → Log 3+ items in one day to see risk tags change (e.g., `STOP_MORE_SUGAR` action triggers).
8. **Check Dashboard** → Verify sugar score ring decreases with more logs (100 minus 20 per log), XP bar fills, streak updates.
9. **Check History** → View bar charts showing sugar events by day and scroll through insight cards.
10. **Sign up** → Navigate to Profile → Sign up with email/password. Log out and log back in to verify data persistence with a 30-day token.

### Performance Considerations

- **ML Prediction Latency** — The scikit-learn model prediction is near-instant (<10ms). The Groq LLM call adds ~500ms–2s depending on network conditions.
- **Fallback System** — If the ML service or Groq API is down, the system returns hardcoded fallback insights within milliseconds so the user experience is unaffected.
- **Database Indexing** — Compound indexes on `{userId, timestamp}`, `{userId, date}`, and `{userId, sugarEventId}` ensure efficient queries at scale.

### Known Limitations & Assumptions

- The ML model (`risk_model.pkl`) is pre-trained; training data and training scripts are not included in the repository.
- Health data (steps, sleep) is manually synced by the user; there is no direct Google Fit / Apple Health API integration yet.
- The UI is responsive across modern phones, tablets, and desktops, but very small screens may still have tighter content density on data-heavy views.
- Anonymous session tokens expire after 1 hour; users must sign up for long-term data persistence.
- Sugar gram estimation uses a static lookup table per item type (e.g., CHAI = 12g, COLD_DRINK = 35g).
- The Groq LLM prompt explicitly avoids medical/diagnostic language; insights are wellness-oriented, not medical advice.
- The `estimatedSugarGrams` field in the ML request is computed server-side and not user-editable.
- Image-based logging relies on IMAGGA's general-purpose image tagging; accuracy varies for ambiguous or uncommon food items (defaults to `OTHER` when unrecognized).

---

## 10. Future Improvements

### Scalability

- **Containerization** — Dockerize each service and deploy behind a load balancer for horizontal scaling.
- **Caching** — Add Redis caching for dashboard aggregations and ML predictions for repeated feature sets.
- **Async ML calls** — Decouple the ML service call from the sugar log endpoint using a message queue (e.g., RabbitMQ, BullMQ) to reduce response latency.
- **Database sharding** — Shard MongoDB by `userId` for horizontal data scaling.

### Feature Enhancements

- **Native health API integration** — Direct Google Fit and Apple HealthKit APIs for automatic step/sleep/heart rate syncing.
- **Responsive UX polish** — Further optimize micro-interactions and chart readability for very small screens.
- **Social features** — Leaderboards, friend challenges, and shared streaks.
- **Improved image detection** — Fine-tune IMAGGA tag mapping or integrate a custom food-classification model for higher accuracy.
- **Custom sugar items** — Let users define custom food items with their own sugar gram estimates.
- **Push notifications** — Remind users to log sugar, complete actions, and maintain streaks.
- **Weekly/monthly reports** — Trend analysis, sugar breakdown by item type, and comparative metrics over time.
- **Action expiry** — Automatically expire pending actions after a configurable time window.

### Technical Improvements

- **Model retraining pipeline** — Periodic retraining with accumulated user data and A/B testing of model versions.
- **Rate limiting** — Add API rate limiting (e.g., express-rate-limit) to prevent abuse.
- **Comprehensive testing** — Unit tests for backend routes, integration tests for the ML pipeline, and E2E tests with Cypress or Playwright.
- **CI/CD pipeline** — Automated testing, building, and deployment via GitHub Actions.
- **Observability** — Structured logging, error tracking (Sentry), and application performance monitoring.
- **Token refresh** — Implement refresh token rotation instead of issuing long-lived JWTs.
- **Input sanitization** — Add additional server-side sanitization beyond express-validator.
