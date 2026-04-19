# Blostem AI Engine - Deployment Guide

## Project Structure
```
Blostem/
├── SPEC.md                    # Technical specification
├── DEPLOYMENT.md              # This file
├── blostem-backend/           # Express.js backend (no database)
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── index.js           # Server entry point
│       ├── routes/            # API routes
│       ├── services/          # Business logic + Groq AI
│       └── data/              # Mock JSON data
└── blostem-frontend/          # Next.js frontend
    ├── package.json
    ├── .env.local
    └── src/
        ├── app/               # Next.js App Router pages
        ├── components/        # React components
        ├── lib/              # API client
        └── types/            # TypeScript types
```

---

## Backend Deployment (Render)

### Prerequisites
1. Create a Render account at https://render.com
2. Get a Groq API key from https://console.groq.com

### Steps

1. **Prepare Repository**
   ```bash
   cd blostem-backend
   git init
   git add .
   git commit -m "Initial commit: Blostem Backend"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub
   - Push your code: `git remote add origin <your-repo-url>`

3. **Create Render Service**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Configure:
     - Name: `blostem-backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: `Free`

4. **Set Environment Variables**
   In Render dashboard, add these env vars:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=https://your-frontend.vercel.app
   GROQ_API_KEY=your_groq_api_key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Your API will be available at `https://blostem-backend.onrender.com`

---

## Frontend Deployment (Vercel)

### Prerequisites
1. Create a Vercel account at https://vercel.com

### Steps

1. **Prepare Repository**
   ```bash
   cd blostem-frontend
   git init
   git add .
   git commit -m "Initial commit: Blostem Frontend"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin <your-frontend-repo-url>
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to Vercel Dashboard → Add New → Project
   - Import your GitHub repository
   - Configure:
     - Framework Preset: `Next.js`
     - Build Command: `next build`
     - Output Directory: `.next`
   - Add Environment Variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
     ```
   - Click "Deploy"

4. **Your frontend will be available at:** `https://your-project.vercel.app`

---

## Running Locally

### Backend
```bash
cd blostem-backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd blostem-frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login (demo@blostem.ai / demo123) |
| GET | `/api/leads/generate` | Generate new leads |
| GET | `/api/leads` | List all leads |
| GET | `/api/leads/:id` | Get lead details |
| POST | `/api/outreach/generate` | Generate email |
| POST | `/api/compliance/check` | Check compliance |
| GET | `/api/analytics` | Get analytics data |
| GET | `/api/campaigns` | List campaigns |
| POST | `/api/campaigns` | Create campaign |
| POST | `/api/ai/analyze-lead` | AI lead analysis |
| POST | `/api/ai/generate-email` | AI email generation |
| POST | `/api/ai/generate-persona` | AI persona generation |
| POST | `/api/ai/chat` | AI chat assistant |

---

## Demo Credentials
- **Email:** demo@blostem.ai
- **Password:** demo123

---

## Groq API Setup

1. Go to https://console.groq.com
2. Create an account or sign in
3. Generate a new API key
4. Add it to your `.env` file:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
   ```

---

## Features Implemented

### Lead Intelligence Engine
- AI-powered lead scoring using Groq LLM
- Multi-stakeholder mapping with AI-generated persona profiles
- "Why this lead?" AI reasoning for each lead
- Sales intelligence: engagement probability, best contact time, recommended action

### Outreach Automation
- Personalized email generation using Groq AI
- Multi-step email sequences (Intro, Follow-up 1, Follow-up 2)
- Dynamic variable substitution ({{company}}, {{name}}, {{role}})

### Compliance Engine
- Detection of misleading claims
- Financial promises check
- Spam trigger detection
- GDPR compliance validation
- Risk score calculation (0-100)

### Analytics Dashboard
- Email engagement metrics (sent, opened, clicked, replied)
- Conversion funnel visualization
- Lead score distribution
- Campaign performance tracking
- Trend analysis charts

### AI Features
- Lead analysis with Groq LLM
- Email generation with context awareness
- Persona generation for stakeholders
- Chat assistant for sales guidance

---

## Technology Stack

- **Frontend:** Next.js 14, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Node.js, Express (no database - uses mock JSON data)
- **AI:** Groq API (Llama 3.3 70B)
- **Authentication:** JWT
- **Deployment:** Vercel (frontend), Render (backend)