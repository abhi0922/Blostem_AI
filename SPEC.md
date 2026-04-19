# Blostem AI Engine - Technical Specification

## Project Overview
- **Project Name**: Blostem AI Engine
- **Type**: B2B Marketing Intelligence Platform
- **Core Functionality**: AI-powered lead identification, automated outreach, compliance validation, and sales intelligence
- **Target Users**: B2B sales teams, marketing professionals, enterprise SDRs

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Recharts
- **Backend**: Node.js + Express + MongoDB Atlas
- **AI**: OpenAI API (GPT-4) for content generation
- **Auth**: JWT-based authentication
- **Email**: Nodemailer (mock/simulated)
- **Deployment**: Vercel (frontend) + Render (backend)

---

## UI/UX Specification

### Color Palette
- **Primary**: `#0F172A` (slate-900 - dark navy)
- **Secondary**: `#1E293B` (slate-800)
- **Accent**: `#F59E0B` (amber-500 - warm gold)
- **Success**: `#10B981` (emerald-500)
- **Warning**: `#F97316` (orange-500)
- **Danger**: `#EF4444` (red-500)
- **Background**: `#F8FAFC` (slate-50)
- **Card Background**: `#FFFFFF`
- **Text Primary**: `#0F172A`
- **Text Secondary**: `#64748B` (slate-500)
- **Border**: `#E2E8F0` (slate-200)

### Typography
- **Font Family**: "Inter" (Google Fonts)
- **Headings**: 700 weight, tracking-tight
- **Body**: 400 weight, normal
- **Sizes**:
  - h1: 2.5rem (40px)
  - h2: 2rem (32px)
  - h3: 1.5rem (24px)
  - h4: 1.25rem (20px)
  - body: 1rem (16px)
  - small: 0.875rem (14px)
  - xs: 0.75rem (12px)

### Layout Structure
- **Sidebar**: 280px fixed width, collapsible on mobile
- **Main Content**: Fluid, max-width 1400px centered
- **Spacing System**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- **Border Radius**: 8px (cards), 6px (buttons), 4px (inputs)
- **Shadows**: `0 1px 3px rgba(0,0,0,0.1)` (subtle), `0 10px 15px rgba(0,0,0,0.1)` (elevated)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Components

#### Navigation Sidebar
- Logo at top
- Nav items with icons
- Active state: amber accent left border
- Hover: slate-800 background
- User profile at bottom

#### Cards
- White background
- 1px border slate-200
- 8px border radius
- 24px padding
- Subtle shadow on hover

#### Buttons
- Primary: amber-500 bg, white text
- Secondary: slate-700 bg, white text
- Outline: transparent bg, slate-700 border
- Disabled: 50% opacity

#### Data Tables
- Striped rows (alternating slate-50)
- Sortable headers
- Row hover highlight
- Pagination controls

#### Charts (Recharts)
- Area charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Consistent amber/slate color scheme

---

## Page Specifications

### 1. Dashboard Page (`/dashboard`)
- **Hero Section**: Welcome message with key metrics
- **Stats Cards Row**: 4 cards showing:
  - Total Leads (count)
  - Active Campaigns (count)
  - Compliance Score (percentage)
  - Revenue Pipeline (simulated value)
- **Lead Score Distribution Chart**: Area chart showing score breakdown
- **Recent Leads Table**: Last 5 leads with score, company, action
- **Quick Actions**: Buttons for common tasks

### 2. Leads Page (`/leads`)
- **Header**: Title + "Generate Leads" button
- **Filters**: Industry, Score Range, Status dropdowns
- **Lead Cards Grid**: 3 columns of lead cards showing:
  - Company name and logo (placeholder)
  - Industry tag
  - Lead score with color indicator (green >80, amber 60-80, red <60)
  - Key signals list
  - "View Details" link

### 3. Lead Details Page (`/leads/[id]`)
- **Header**: Company name + overall score
- **Two Column Layout**:
  - Left: Company info, signals, AI reasoning
  - Right: Contact personas (CTO, Product Head, Compliance)
- **Contact Cards**: Name, role, email, generated persona profile
- **Actions**: Generate Outreach, Check Compliance

### 4. Campaign Builder (`/campaigns`)
- **Campaign List**: Table of saved campaigns
- **New Campaign Form**:
  - Campaign name input
  - Lead selection (multi-select)
  - Email sequence builder:
    - Step 1: Intro email template
    - Step 2: Follow-up 1 template
    - Step 3: Follow-up 2 template
  - Variables: {{company}}, {{role}}, {{name}}
- **Preview Panel**: Live preview of email

### 5. Compliance Checker (`/compliance`)
- **Text Input Area**: Paste email content
- **Check Button**: Triggers compliance analysis
- **Results Panel**:
  - Pass/Fail status
  - Flagged issues list
  - Risk score (0-100)
  - Suggestions for fixes

### 6. Analytics Page (`/analytics`)
- **Date Range Selector**: Last 7/30/90 days
- **Metric Cards**: Emails Sent, Opens, Clicks, Replies
- **Engagement Funnel Chart**: Bar chart showing conversion
- **Campaign Performance Table**: Sorted by ROI
- **Top Performing Templates**: List with open rates

---

## Functionality Specification

### 1. Lead Intelligence Engine
- **Input Processing**: Accept market signals data
- **AI Scoring Algorithm**:
  - Hiring growth: 30% weight
  - Funding stage: 25% weight
  - Fintech keywords: 25% weight
  - Job posting volume: 20% weight
- **Output**: Leads ranked by composite score

### 2. Multi-Stakeholder Mapping
- For each company, identify:
  - CTO (technical decision maker)
  - Product Head (product strategy)
  - Compliance Officer (regulatory)
- Generate AI persona profiles with:
  - Background assumptions
  - Pain points
  - Messaging tone

### 3. Outreach Automation
- **Email Generation**: AI-powered personalized emails
- **Sequence Management**: 3-step sequence
- **Variable Substitution**: Dynamic placeholders
- **Template Storage**: Save/load templates

### 4. Compliance Engine
- **Rule Categories**:
  - Misleading claims detection
  - Financial promises check
  - Sensitive language flag
  - Regulatory compliance (GDPR, CAN-SPAM)
- **Output**: Pass/Fail with specific issues

### 5. Sales Intelligence
- **Lead Scoring**: 0-100 scale
- **Engagement Probability**: Based on signals
- **Best Contact Time**: Algorithm-based
- **Recommended Actions**: Call, Email, Nurture

---

## API Specifications

### POST /api/leads/generate
- **Input**: `{ industry?: string, count?: number }`
- **Output**: Generated leads array

### GET /api/leads
- **Query**: `?page=1&limit=10&industry=&minScore=`
- **Output**: Paginated leads

### GET /api/leads/:id
- **Output**: Single lead with contacts

### POST /api/outreach/generate
- **Input**: `{ leadId, contactId, templateType }`
- **Output**: Generated email content

### POST /api/compliance/check
- **Input**: `{ content }`
- **Output**: Compliance result object

### GET /api/analytics
- **Query**: `?range=30`
- **Output**: Analytics data object

---

## Data Models

### Lead
```json
{
  "id": "string",
  "company": "string",
  "industry": "string",
  "funding": "string",
  "hiringTrend": "High|Medium|Low",
  "score": "number",
  "signals": ["string"],
  "createdAt": "date",
  "status": "Active|Contacted|Nurture|Closed"
}
```

### Contact
```json
{
  "id": "string",
  "name": "string",
  "role": "string",
  "company": "string",
  "email": "string",
  "persona": "string"
}
```

### Campaign
```json
{
  "id": "string",
  "name": "string",
  "leads": ["string"],
  "sequence": ["object"],
  "status": "Draft|Active|Completed"
}
```

---

## Acceptance Criteria

1. ✓ Dashboard displays real-time metrics and charts
2. ✓ Leads can be generated with AI scoring
3. ✓ Lead details show multi-stakeholder mapping
4. ✓ Campaign builder creates email sequences
5. ✓ Compliance checker validates content
6. ✓ Analytics shows engagement metrics
7. ✓ Responsive on all screen sizes
8. ✓ API endpoints return correct data
9. ✓ Mock data populates all views
10. ✓ Build completes without errors