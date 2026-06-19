# 🌱 EcoSelf — Carbon Footprint Awareness Platform

> **PromptWars Virtual Challenge 3** · Vertical: Individual Behavioral Change

A mobile-first web app that makes your carbon footprint *feel personal and urgent* — not just a number on a dashboard. EcoSelf uses AI-powered insights, a living visual world, gamification, and team accountability to drive real behavioral change.

---

## 🎯 Chosen Vertical

**Individual + Social Behavioral Change**

Most carbon apps show you numbers. EcoSelf makes you *feel* those numbers through:
- A **living world** that visually degrades or thrives based on your choices
- **AI nudges** at the right moment (not random reminders)
- **Team leaderboards** that create friendly social accountability
- **Contextual equivalents** that translate abstract CO₂ into relatable comparisons

---

## 🧠 Approach & Logic

### The core insight: awareness ≠ numbers

Showing "9.3 kg CO₂" means nothing emotionally. Saying _"your drive today = charging 220 phones"_ makes it click. EcoSelf is built around this principle throughout.

### Five behavioral pillars

| Pillar | How EcoSelf implements it |
|--------|--------------------------|
| **Awareness** | Real-world equivalents for every emission figure |
| **Urgency** | Morning nudges tied to today's planned activities |
| **Progress** | XP system, streaks, and a living visual ecosystem |
| **Social proof** | Team leaderboard with collective weekly goals |
| **AI guidance** | Personalized Claude-powered advisor with context |

### The Living World mechanic

Inspired by games like Stardew Valley — your carbon choices directly alter a visual ecosystem. Good weeks = more trees, cleaner skies. High emissions = haze, wilting plants, dry rivers. This makes the invisible tangible without requiring any mental effort.

---

## 🏗️ How the Solution Works

### Architecture overview

```
src/
├── pages/
│   ├── Onboarding.jsx      # 3-step profile setup
│   ├── Dashboard.jsx       # Today's footprint + nudges
│   ├── ActionCenter.jsx    # Daily challenges with XP
│   ├── WorldView.jsx       # Living ecosystem + achievements
│   ├── LeaderBoard.jsx     # Team rankings + collective goals
│   └── AIAdvisor.jsx       # Claude-powered chat advisor
├── components/
│   ├── Navigation.jsx      # Bottom tab bar
│   ├── NudgeSystem.jsx     # Context-aware push nudges
│   ├── FootprintRing.jsx   # Animated donut chart
│   ├── WorldScene.jsx      # SVG ecosystem renderer
│   └── ActionCard.jsx      # Challenge card with completion
├── store/
│   └── useStore.js         # Zustand global state + persistence
├── data/
│   └── mockData.js         # Emission factors, equivalents, AI prompt
└── utils/
    └── calculations.js     # CO₂ math, XP logic, world health score
```

### Data flow

```
User logs activity → Zustand store updates footprint
→ Dashboard recalculates breakdown
→ World health score recomputed (0–100)
→ WorldScene re-renders ecosystem state
→ AI Advisor gets updated context for next conversation
→ Nudges filtered by relevance to current footprint pattern
```

### Emission calculation logic

Each category uses simplified emission factors (kg CO₂ per unit):

| Category | Factor | Source |
|----------|--------|--------|
| Transport (car) | 0.21 kg/km | DEFRA 2023 |
| Transport (bus) | 0.089 kg/km | DEFRA 2023 |
| Beef meal | 2.5 kg/meal | Poore & Nemecek 2018 |
| Plant-based meal | 0.5 kg/meal | Poore & Nemecek 2018 |
| Electricity (India grid) | 0.82 kg/kWh | CEA 2022 |
| Streaming HD | 0.036 kg/hour | IEA 2022 |

### AI Advisor (Claude integration)

The AI Advisor calls Claude's API with a system prompt that:
1. Knows the user's current footprint breakdown
2. Knows their 7-day history and trends
3. Knows their completed actions today
4. Is instructed to use analogies, not lectures
5. Provides 2–3 specific next steps, not generic advice

```javascript
// System prompt includes live context
const context = `
  Today's footprint: ${totalKg} kg CO₂
  Biggest source: ${biggestCategory} (${biggestKg} kg)
  7-day trend: ${trend}% vs last week
  Actions completed today: ${completedActions.join(', ')}
`
```

### Nudge logic

Nudges are not random. They trigger based on:
- **Time of day** — transport nudges at 8am, food nudges at 11am
- **Pattern detection** — if food emissions spike 3 days in a row, food nudge appears
- **Category over threshold** — any category exceeding its personal average triggers a nudge
- **Positive reinforcement** — streak milestones trigger celebration nudges

### XP & leveling system

```
Level 1: 0–200 XP      (Newcomer)
Level 2: 200–500 XP    (Aware)
Level 3: 500–1000 XP   (Reducing)
Level 4: 1000–2000 XP  (Eco Champion)
Level 5: 2000+ XP      (Earth Guardian)
```

Actions earn XP based on actual CO₂ impact: `XP = impact_kg × 20 + base_bonus`

### Living World health score

```
worldHealth = 100 − (totalKgToday / sustainableTarget × 50) + streakBonus
```

- **Green (75–100):** Lush forest, clear sky, flowing river
- **Yellow (50–74):** Sparse trees, light haze, calm river  
- **Orange (25–49):** Few trees, heavy smog, low river
- **Red (0–24):** Barren land, smoke, dried riverbed

---

## 🖥️ Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | React 18 + Vite | Fast dev, component-based UI |
| Styling | Tailwind CSS | Utility-first, consistent spacing |
| State | Zustand + persist | Simple global state with localStorage sync |
| Charts | Recharts | Lightweight, React-native charting |
| Animations | Framer Motion | Smooth, accessible transitions |
| AI | Anthropic Claude API | Personalized, contextual advice |
| Icons | Lucide React | Clean, consistent icon set |
| Date utils | date-fns | Lightweight date handling |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- An Anthropic API key (for AI Advisor feature)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/carbon-footprint-platform.git
cd carbon-footprint-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Anthropic API key to .env:
# VITE_ANTHROPIC_API_KEY=your_key_here

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## 📱 Features Walkthrough

### 1. Onboarding (3 steps)
- Set your name and location
- Log your typical transport mode, diet, and home type
- Get your baseline footprint calculated immediately

### 2. Dashboard
- Today's total CO₂ with animated breakdown bars
- Comparison vs. global average and 1.5°C target
- Active nudges based on your patterns
- XP progress and streak display

### 3. Action Center
- 6 daily challenges sorted by difficulty
- One-tap completion with XP reward
- Recurring vs. one-time actions labeled clearly
- Impact shown in kg CO₂ *and* real-world equivalents

### 4. Living World
- SVG ecosystem that reflects your week's footprint
- Tree count, sky clarity, and river level all change
- Unlockable achievements displayed
- World event log explaining *why* things changed

### 5. Team Leaderboard
- Weekly ranking within your group
- Collective team challenge with shared progress bar
- Badges awarded at the end of each week
- "Challenge a friend" invite flow

### 6. AI Advisor
- Conversational Claude-powered assistant
- Pre-loaded with your footprint context
- Quick prompt suggestions for common questions
- Remembers conversation within the session

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run with coverage report
npm run test:coverage
```

Test coverage includes:
- Emission calculation accuracy
- XP calculation logic  
- World health score formula
- Nudge trigger conditions
- Store state transitions

---

## ♿ Accessibility

- All interactive elements keyboard-navigable
- ARIA labels on icon-only buttons
- Color is never the sole indicator of state (text labels always accompany color)
- Respects `prefers-reduced-motion` for all animations
- Minimum 4.5:1 contrast ratio for all text
- Screen reader-compatible chart descriptions

---

## 🔒 Security

- API key stored in environment variables, never committed
- No user PII sent to external services
- All AI requests include only anonymized footprint data
- LocalStorage data is personal and device-scoped
- Input sanitization on all user text fields

---

## 📐 Assumptions

1. **Simplified emission factors** — real-world values vary by region, vehicle type, grid mix, etc. This uses standard averages as a starting point.
2. **Self-reported data** — the app trusts user input. A production version would integrate with fitness trackers, smart meters, and bank transaction APIs for automatic tracking.
3. **India context** — grid emission factor and benchmark comparisons are calibrated for Indian users but the app works globally.
4. **Team feature requires invite** — the social/leaderboard feature assumes users self-organize into teams. A production version would support workplace SSO for automatic team formation.
5. **AI responses** — the Claude advisor gives general guidance. It is not a substitute for professional environmental consulting.

---

## 🗺️ Roadmap (post-challenge)

- [ ] Integration with Google Maps for automatic commute tracking
- [ ] Bank API integration for shopping emission auto-detection
- [ ] Smart meter / electricity bill OCR for energy tracking
- [ ] Push notifications via service worker
- [ ] Offline support with background sync
- [ ] Organization-level dashboards for CSR reporting

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Data Sources

- DEFRA UK Greenhouse Gas Conversion Factors 2023
- Poore & Nemecek (2018), *Reducing food's environmental impacts through producers and consumers*, Science
- IEA (2022), *Data Centres and Data Transmission Networks*
- Central Electricity Authority, India CO₂ baseline (2022)
- Our World in Data — Per capita CO₂ emissions dataset
