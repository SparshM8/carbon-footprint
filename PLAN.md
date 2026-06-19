# EcoSelf — Full Implementation Plan

## Phase 0: Project scaffolding (already done)
- [x] Vite + React 18 project created
- [x] Tailwind CSS configured
- [x] Zustand store scaffolded
- [x] CSS design tokens defined
- [x] README written
- [x] mockData.js with emission factors

---

## Phase 1: Core pages (build order)

### 1.1 — src/main.jsx
Entry point. Imports App and index.css. Renders to #root.

### 1.2 — src/pages/Onboarding.jsx
3-step wizard:
- Step 1: Name + location (dropdown: India cities)
- Step 2: Transport mode (car/bus/walk/cycle/bike), km/day
- Step 3: Diet type (veg/non-veg/vegan), home type (apartment/house), AC usage
On complete → calls store.completeOnboarding(data) → sets onboardingComplete=true

### 1.3 — src/components/Navigation.jsx
Fixed bottom nav with 5 tabs.
Uses store.setPage() on click.
Shows active state with green color.

### 1.4 — src/pages/Dashboard.jsx
Sections (top to bottom):
a) Header bar: total kg CO₂ today, streak, XP bar
b) FootprintRing component (donut chart)
c) Breakdown bars (transport/food/energy/shopping/digital)
d) Active nudges from store.nudges (filtered: not dismissed)
e) Benchmark comparison cards (vs global avg + 1.5°C target)
f) Weekly mini trend (last 7 bars, recharts BarChart)

### 1.5 — src/components/FootprintRing.jsx
SVG donut ring (no recharts — pure SVG for performance).
5 segments, each sized proportionally to category kg.
Center text: total kg + "today".
Animated on mount (strokeDashoffset animation).

### 1.6 — src/pages/ActionCenter.jsx
Sections:
a) Header: XP earned today, actions completed (X of 6)
b) Filtered list: easy actions first, then medium
c) ActionCard per action with:
   - Icon, title, category tag
   - Impact in kg CO₂ + XP reward
   - Equivalent (e.g. "= 3 phone charges")
   - Checkmark button → calls store.completeAction(id)
   - Completed state shows green checkmark + XP flash

### 1.7 — src/pages/WorldView.jsx
Sections:
a) WorldScene SVG component (the ecosystem)
b) World event log (nudge-style cards explaining what changed)
c) Achievement grid (earned = full color, locked = 35% opacity)

### 1.8 — src/components/WorldScene.jsx
Pure SVG, 290×180px viewBox.
Layers (back to front):
- Sky (color shifts from blue → gray based on health)
- Clouds (count increases with high digital/energy)
- Sun (visible when health > 60)
- Mountains (static)
- Trees (count = Math.floor(health/10), vary in size/shade)
- River (width proportional to shopping reduction)
- Ground (color green → brown based on food choices)
Health score computed in utils/calculations.js.
Re-renders when store.footprint changes.

### 1.9 — src/pages/LeaderBoard.jsx
Sections:
a) Header: team name, weekly goal status
b) Ranked list of team members (store.team.members sorted by footprint)
c) "You" row highlighted
d) Collective team challenge card with progress bar
e) Last week's winner celebration card

### 1.10 — src/pages/AIAdvisor.jsx
Sections:
a) Header: EcoAI avatar, online indicator
b) Chat message thread (scrollable)
c) Quick prompt chips (3 suggestions)
d) Text input + send button
On send:
- Appends user message to store.chatMessages
- Calls Anthropic API with system prompt + conversation history + footprint context
- Streams response into chat bubble
- Appends AI response to store.chatMessages

---

## Phase 2: Smart features

### 2.1 — src/components/NudgeSystem.jsx
Renders above Dashboard (outside main scroll).
Logic:
- On app load, evaluate nudge triggers
- Trigger rules (in utils/nudgeTriggers.js):
  * hour >= 7 && hour <= 9 → show transport nudge
  * hour >= 11 && hour <= 12 → show food nudge
  * footprint.food > 3.5 for 3+ days → persistent food nudge
  * footprint.transport > 4 → urgent transport nudge
- Max 2 nudges visible at once
- Dismiss stores ID in localStorage so it doesn't re-show today

### 2.2 — src/utils/calculations.js
```javascript
export const getTotalKg = (footprint) =>
  Object.values(footprint).reduce((a, b) => a + b, 0)

export const getWorldHealth = (footprint, streak) => {
  const total = getTotalKg(footprint)
  const SUSTAINABLE = 4.0
  const base = Math.max(0, 100 - ((total / SUSTAINABLE) * 30))
  const streakBonus = Math.min(streak * 2, 20)
  return Math.min(100, Math.round(base + streakBonus))
}

export const getXpForAction = (impactKg) =>
  Math.round(impactKg * 20) + 10

export const getEquivalent = (kg) => {
  if (kg < 0.1) return `${Math.round(kg * 1000)}g — lighter than a can of soda`
  if (kg < 1) return `${kg.toFixed(1)} kg — like ${Math.round(kg / 0.005)} text messages`
  if (kg < 5) return `${kg.toFixed(1)} kg — like driving ${Math.round(kg / 0.21)} km`
  return `${kg.toFixed(1)} kg — like ${Math.round(kg / 2.5)} beef meals`
}

export const getCO2Level = (kg) => {
  if (kg <= 4) return { label: 'Sustainable', color: 'green' }
  if (kg <= 8) return { label: 'Moderate', color: 'amber' }
  if (kg <= 12) return { label: 'High', color: 'orange' }
  return { label: 'Critical', color: 'red' }
}
```

### 2.3 — AI integration (src/utils/aiAdvisor.js)
```javascript
export const callEcoAI = async (messages, footprint, completedActions) => {
  const contextBlock = buildContextBlock(footprint, completedActions)
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: AI_SYSTEM_PROMPT + '\n\n' + contextBlock,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  })
  const data = await response.json()
  return data.content[0].text
}
```

---

## Phase 3: Polish & accessibility

### 3.1 — Animations
- Framer Motion: page transitions (slide in from right)
- XP flash on action complete (number flies up and fades)
- World scene: trees sway subtly using CSS animation
- Nudge cards: slide in from top on appear
- Respects prefers-reduced-motion

### 3.2 — Responsive design
App is max-width 428px (mobile first).
On desktop: centered phone-frame layout (like the mockup).
No horizontal scroll at any breakpoint.

### 3.3 — Error states
- AI Advisor: show "EcoAI is thinking..." skeleton, then error card if API fails
- No footprint data: show onboarding prompt instead of empty dashboard
- Network offline: show cached data with "Offline" badge

### 3.4 — Empty states
- No actions completed: "Start your first action today" illustration
- New user world: small seedling with "Your world grows as you act"
- No team yet: "Invite a friend to start competing"

---

## Phase 4: Testing

### Unit tests (src/__tests__/)

```
calculations.test.js
  ✓ getTotalKg sums all categories correctly
  ✓ getWorldHealth returns 0–100
  ✓ getWorldHealth increases with streak
  ✓ getXpForAction is proportional to impact
  ✓ getEquivalent returns string for all ranges
  ✓ getCO2Level returns correct bucket

nudgeTriggers.test.js
  ✓ transport nudge fires between 7–9am
  ✓ food nudge fires at 11am–noon
  ✓ no nudge fires when footprint is low
  ✓ dismissed nudge does not re-appear

store.test.js
  ✓ completeAction updates footprint
  ✓ completeAction adds XP
  ✓ dismissNudge sets dismissed=true
  ✓ state persists across store re-creation
```

Run: `npm test`

---

## Phase 5: Deployment

### Option A: Vercel (recommended)
```bash
npm run build
# Push to GitHub → connect Vercel → auto-deploys on push
```
Add `VITE_ANTHROPIC_API_KEY` in Vercel environment variables.

### Option B: Netlify
```bash
npm run build
# Drag dist/ folder to Netlify dashboard
```

### Option C: GitHub Pages
```bash
# vite.config.js: set base: '/repo-name/'
npm run build
# Push dist/ to gh-pages branch
```

---

## File creation order (exact sequence)

1. `src/main.jsx`
2. `src/utils/calculations.js`
3. `src/utils/aiAdvisor.js`
4. `src/utils/nudgeTriggers.js`
5. `src/components/Navigation.jsx`
6. `src/components/FootprintRing.jsx`
7. `src/components/ActionCard.jsx`
8. `src/components/WorldScene.jsx`
9. `src/components/NudgeSystem.jsx`
10. `src/pages/Onboarding.jsx`
11. `src/pages/Dashboard.jsx`
12. `src/pages/ActionCenter.jsx`
13. `src/pages/WorldView.jsx`
14. `src/pages/LeaderBoard.jsx`
15. `src/pages/AIAdvisor.jsx`
16. `src/__tests__/calculations.test.js`
17. `src/__tests__/nudgeTriggers.test.js`
18. `src/__tests__/store.test.js`
19. `.env.example`
20. `LICENSE`

---

## Evaluation checklist

| Criteria | How addressed |
|----------|--------------|
| Code quality | Modular components, clear naming, JSDoc on utils |
| Security | API key in env var, no PII to external APIs |
| Efficiency | Zustand (tiny), lazy imports for pages, SVG not canvas |
| Testing | Unit tests for all calculation and trigger logic |
| Accessibility | ARIA labels, keyboard nav, reduced motion, contrast ≥4.5:1 |
| Behavioral change | Nudges, equivalents, living world, social accountability, AI advisor |
| Real-world usability | Onboarding, persistent state, offline-safe, mobile-first |
