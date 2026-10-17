# MedShift

> **Healthcare staffing, intelligently matched.**

MedShift is a high-performance healthcare workforce marketplace prototype that connects NHS and UK hospital trusts with qualified doctors, nurses, and pharmacists based on clinical specialty, geographic location, real-time rota availability, and verified credentials.

---

## 1. What MedShift Is

Hospitals experience acute staffing shortages and rota gaps every day. Traditional locum agencies impose high overheads, slow communication, and opaque fees. MedShift provides an intelligent, automated matching platform where:
- **Hospitals** quickly publish shift requirements via a 5-step wizard, specify clinical specialties and urgency levels, and discover algorithmically ranked candidates in their regional trust network.
- **Healthcare Professionals** maintain fine-grained weekly availability, review high-affinity clinical opportunities with transparent pay rates, and accept bookings directly with zero friction.

*Note: This is a frontend-only prototype built with realistic UK healthcare mock data, React 19 state, and `localStorage` persistence. No external backend or credentials are required.*

---

## 2. Core Product Workflow

```
HOSPITAL POSTS A SHIFT
        ↓
MEDSHIFT ANALYZES REQUIREMENTS
        ↓
MATCHING ENGINE (100-Point Scoring)
        ↓
BEST AVAILABLE PROFESSIONALS
        ↓
HOSPITAL CAN VIEW & INVITE THEM
        ↓
CLINICIAN ACCEPTS SHIFT (Instant Rota Confirmation)
```

### Seamless Demo Walkthrough:
1. **Hospital Mode**:
   - Go to **Dashboard** (`/hospital/dashboard`) and click **"Post a Shift"**.
   - Walk through the 5-step wizard:
     1. **Requirement**: Select Profession (*Doctor*, *Nurse*, or *Pharmacist*) & Specialty (*Cardiology*, *Dermatology*, *Neurology*, etc.).
     2. **Schedule**: Set Date (*Today*, *Tomorrow*, custom), Shift Times, and duration.
     3. **Location**: Select UK City (*London*, *Manchester*, *Birmingham*, etc.) and Hospital Facility.
     4. **Preferences**: Set Minimum Experience, Urgency (*Normal*, *High*, *Urgent*), and Hourly Rate.
     5. **Review**: Review complete summary card and click **"Publish Shift & Find Matches"**.
   - You are immediately routed to the **Matching Results Page** (`/hospital/matching-results?shiftId=...`) with ranked clinician cards.
   - Click **"View Profile"** to inspect qualifications, languages, verification credentials, and weekly availability visualization.
   - Click **"Invite to Shift"** to send an instant direct offer.
2. **Switch Role**:
   - In the Topbar, click **"Viewing as Hospital"** to toggle to **"Viewing as Professional"** (Dr. Sarah Mitchell).
3. **Professional Mode**:
   - Notice the **Direct Shift Invitation Received** alert banner on the dashboard and the red badge on the notifications bell!
   - Click **"View Shift Details"** (or open `/shifts/:id`).
   - Review the **"Why this shift matches you"** checklist (Specialty, Location, Experience, Availability).
   - Click **"Accept Shift"**.
   - The shift is booked and saved to `localStorage`, timesheets are generated, an animated success toast appears, and the status switches to **Booked**.

---

## 3. Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS v4 with bespoke SaaS design tokens
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` (persists created shifts, weekly availability, bookings, invitations, notifications, and favorites)
- **Feedback**: Animated floating Toast system (`ToastContext`)

---

## 4. Project Structure

```
├── index.html                   # HTML entry point with Plus Jakarta Sans & JetBrains Mono
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies and npm scripts
├── src/
│   ├── App.tsx                  # Main application router with route definitions
│   ├── main.tsx                 # React DOM root entry
│   ├── index.css                # Global styles, font definitions, and Tailwind CSS imports
│   ├── types/
│   │   └── index.ts             # Domain models (Shift, HealthcareProfessional, MatchResult, ScheduleSlot, etc.)
│   ├── utils/
│   │   ├── matching.ts          # 5-Pillar Algorithmic Matching Engine
│   │   └── matching.js          # Re-export wrapper
│   ├── data/
│   │   ├── hospitals.ts         # 8 UK hospital trusts (St Mary's, St Thomas', Manchester Royal, QE Birmingham, etc.)
│   │   ├── professionals.ts     # 16 Clinicians (Dr. Sarah Mitchell, Marcus Evans, Dr. Tariq Khan, etc.)
│   │   ├── shifts.ts            # 22 Clinical shifts across UK trusts
│   │   └── notifications.ts     # Actionable clinical alerts and rota notifications
│   ├── context/
│   │   ├── AppContext.tsx       # Global state management and localStorage sync
│   │   └── ToastContext.tsx     # Animated toast notification provider
│   ├── components/
│   │   ├── common/              # Button, Card, Badge, StatusBadge, Avatar, StatCard, PageHeader, EmptyState, Modal
│   │   ├── layout/              # AppShell, Sidebar, Topbar
│   │   ├── shifts/              # ShiftCard, ShiftDetailsModal, PostShiftModal
│   │   └── professionals/       # ProfessionalCard, ProfessionalDetailsModal
│   └── pages/
│       ├── LandingPage.tsx      # Marketing landing page with interactive match preview simulator
│       ├── RoleSelectionPage.tsx# Hospital vs Healthcare Professional onboarding selector
│       ├── hospital/
│       │   ├── HospitalDashboardPage.tsx      # Rota stats, urgent shift tables, and filters
│       │   ├── PostShiftWizardPage.tsx        # 5-step polished shift requirement publisher
│       │   ├── MatchingResultsPage.tsx        # Algorithmic best match results with score badges
│       │   ├── HospitalShiftsPage.tsx         # Open shift management (Open, Matching, Invited, Filled, Cancelled)
│       │   └── HospitalProfessionalsPage.tsx  # Verified clinician directory & shift dispatch
│       ├── professional/
│       │   ├── ProfessionalDashboardPage.tsx  # Dr. Sarah Mitchell's schedule & recommended shifts
│       │   ├── ProfessionalShiftsPage.tsx     # Marketplace with filters for specialty, city, date, profession, rate
│       │   └── ProfessionalAvailabilityPage.tsx # Interactive weekly availability scheduler
│       ├── professionals/
│       │   └── ProfessionalDetailPage.tsx     # Clinician profile, qualifications, languages, and activity timeline
│       ├── shifts/
│       │   └── ShiftDetailPage.tsx            # Shift breakdown with "Why this shift matches you" checklist
│       └── ProfilePage.tsx      # Hospital trust and clinician profile editor
└── README.md                    # Project documentation
```

---

## 5. Matching Engine (`src/utils/matching.ts`)

The matching engine computes a compatibility score out of 100 points across 5 clinical criteria:
- **Specialty (30 pts)**: Exact specialty match (+30), cross-disciplinary transferable match (+15), or mismatch (0).
- **Location (20 pts)**: Exact city trust radius (+20), regional transit corridor (+10), or distal (0).
- **Availability (30 pts)**: Day and time slot open (+30), partial/resting (+15-20), or clash (0).
- **Experience (15 pts)**: Meets/exceeds requirement (+15), within 1 year (+8), or insufficient (0).
- **Profession (5 pts)**: Direct profession match (+5) or mismatch (0).

### Score Ranges:
- **90 - 100%**: `BEST MATCH` (emerald badge)
- **75 - 89%**: `STRONG MATCH` (blue badge)
- **60 - 74%**: `POSSIBLE MATCH` (amber badge)
- **< 60%**: `WEAK MATCH` (slate badge)

Results are automatically sorted from highest to lowest score.

---

## 6. How to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

3. **Type check & build for production**:
   ```bash
   npm run lint
   npm run build
   ```
