import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateWeeklyData } from '../data/mockData'

const useStore = create(
  persist(
    (set, get) => ({
      // Current active page
      currentPage: 'dashboard',

      // User profile & stats
      user: {
        name: 'Sparsh',
        email: 'sparsh@example.com',
        city: 'New Delhi',
        level: 4,
        xp: 420,
        xpToNext: 1000,
        streak: 7,
        lastActiveDate: new Date().toDateString(),
        joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Monthly carbon budget in kg CO2e
      monthlyBudget: 150,

      // Total pocket money saved in INR (Paisa Bachao)
      moneySaved: 2480,
      monthlySavingsGoal: 5000,

      // Current footprint data (kg CO2 per day)
      footprint: {
        transport: 3.2,
        food: 2.8,
        energy: 1.9,
        shopping: 1.1,
        digital: 0.3,
      },

      // Weekly history
      weeklyData: generateWeeklyData(),

      // Completed actions
      completedActions: [],

      // Dynamic activity logs
      activityLogs: [
        {
          id: 'log-1',
          title: 'Metro commute to work',
          category: 'transport',
          impact: 0.5,
          unit: '12 km',
          moneySaved: 240,
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        },
        {
          id: 'log-2',
          title: 'Plant-based lunch (Lentils & Rice)',
          category: 'food',
          impact: 0.4,
          unit: '1 meal',
          moneySaved: 120,
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'log-3',
          title: 'AC run in bedroom',
          category: 'energy',
          impact: 1.4,
          unit: '3 hours',
          moneySaved: 0,
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'log-4',
          title: 'Bought second-hand book',
          category: 'shopping',
          impact: 0.3,
          unit: '1 item',
          moneySaved: 350,
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        },
      ],

      // Active nudges
      nudges: [
        {
          id: 'n1',
          type: 'food',
          title: 'Meatless Monday savings',
          message: 'Skipping meat today saves 2.5 kg CO₂ — and ~₹150 on your food bill.',
          icon: '🥗',
          urgency: 'medium',
          timestamp: new Date().toISOString(),
          dismissed: false,
        },
        {
          id: 'n2',
          type: 'transport',
          title: 'Commute tip',
          message: 'Metro cuts travel emissions by 70% and saves ₹300+ vs solo cab rides.',
          icon: '🚌',
          urgency: 'high',
          timestamp: new Date().toISOString(),
          dismissed: false,
        },
      ],

      // Dismissed nudge IDs (including dynamic nudges)
      dismissedNudgeIds: [],

      // Team / Social leaderboard data
      team: {
        name: 'Green Office Warriors',
        members: [
          { id: 1, name: 'Alex (you)', avatar: '🌱', footprint: 9.3, rank: 1, badge: 'eco-champion', kudos: 5 },
          { id: 2, name: 'Priya', avatar: '🌿', footprint: 11.2, rank: 2, badge: 'green-starter', kudos: 3 },
          { id: 3, name: 'Rajan', avatar: '🍃', footprint: 12.8, rank: 3, badge: 'aware', kudos: 2 },
          { id: 4, name: 'Meera', avatar: '🌾', footprint: 10.1, rank: 4, badge: 'reducing', kudos: 4 },
          { id: 5, name: 'Arjun', avatar: '🌲', footprint: 14.5, rank: 5, badge: 'beginner', kudos: 1 },
        ],
        weeklyGoal: 10,
        thisWeekAvg: 11.6,
      },

      // Action challenges
      actions: [
        {
          id: 'act-1',
          title: 'Public Transit Day',
          category: 'transport',
          impact: 2.1,
          moneySaved: 220,
          difficulty: 'medium',
          duration: 'Today',
          xp: 50,
          co2Saved: '2.1 kg',
          why: 'Replacing 15km car drive with bus/metro cuts 80% transport emissions and saves cab fare.',
          completed: false,
        },
        {
          id: 'act-2',
          title: 'Plant-Based Lunch',
          category: 'food',
          impact: 1.8,
          moneySaved: 140,
          difficulty: 'easy',
          duration: 'Today',
          xp: 40,
          co2Saved: '1.8 kg',
          why: 'Plant meals produce 10x less greenhouse gases than red meat and cost less.',
          completed: false,
        },
        {
          id: 'act-3',
          title: 'Phantom Power Sweep',
          category: 'energy',
          impact: 0.8,
          moneySaved: 85,
          difficulty: 'easy',
          duration: '10 mins',
          xp: 30,
          co2Saved: '0.8 kg',
          why: 'Standby electronics consume up to 10% of household electricity.',
          completed: false,
        },
        {
          id: 'act-4',
          title: 'AC Set to 24°C',
          category: 'energy',
          impact: 1.2,
          moneySaved: 180,
          difficulty: 'easy',
          duration: 'Today',
          xp: 35,
          co2Saved: '1.2 kg',
          why: 'Every 1°C increase in AC saves 6% electricity and lowers monthly power bill.',
          completed: false,
        },
        {
          id: 'act-5',
          title: 'Bring Reusable Bag',
          category: 'shopping',
          impact: 0.3,
          moneySaved: 20,
          difficulty: 'easy',
          duration: 'Today',
          xp: 20,
          co2Saved: '0.3 kg',
          why: 'Plastic bags take 500 years to decompose and cost extra at checkouts.',
          completed: false,
        },
      ],

      // Achievements
      achievements: [
        { id: 'a1', title: 'First Step', desc: 'Completed your first eco-action', icon: '🌱', earned: true, date: '2026-05-15' },
        { id: 'a2', title: 'Streak Master', desc: 'Maintained a 7-day logging streak', icon: '🔥', earned: true, date: '2026-05-22' },
        { id: 'a3', title: 'Climate Hero', desc: 'Reduced footprint below 5 kg/day', icon: '⭐', earned: false },
        { id: 'a4', title: 'Team Player', desc: 'Helped your team reach weekly goal', icon: '👥', earned: false },
        { id: 'a5', title: 'Low Carbon Commuter', desc: 'Used public transit 5 days in a row', icon: '🚆', earned: false },
        { id: 'a6', title: 'Plant Powered', desc: 'Completed 10 plant-based meal swaps', icon: '🥗', earned: false },
      ],

      // EcoAI Chat messages
      chatMessages: [
        {
          id: 'm1',
          sender: 'ai',
          text: "Hi Sparsh! I'm EcoAI, powered by Gemini Flash 3.8. Your daily footprint is currently tracking at 9.3 kg CO₂ — that's 68% below the global average! You've also saved ₹2,480 so far this month. What part of your habits would you like to optimize today?",
          timestamp: new Date().toISOString(),
        }
      ],

      // Onboarding completed flag
      onboardingComplete: true,

      // Actions
      setPage: (page) => set({ currentPage: page }),

      setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),

      setMonthlySavingsGoal: (goal) => set({ monthlySavingsGoal: goal }),

      completeAction: (actionId) => {
        const state = get()
        const action = state.actions.find(a => a.id === actionId)
        if (!action || action.completed) return

        const todayStr = new Date().toDateString()
        const newStreak = state.user?.lastActiveDate === todayStr ? (state.user?.streak || 1) : ((state.user?.streak || 0) + 1)
        const newXp = (state.user?.xp || 0) + action.xp
        const currentCategoryVal = state.footprint[action.category] || 0
        const newCategoryVal = Math.max(0, parseFloat((currentCategoryVal - action.impact * 0.1).toFixed(1)))

        const newFootprint = {
          ...state.footprint,
          [action.category]: newCategoryVal
        }
        const newCompleted = [...state.completedActions, { ...action, completedAt: new Date().toISOString() }]

        const newLog = {
          id: `log-act-${Date.now()}`,
          title: `Challenge: ${action.title}`,
          category: action.category,
          impact: -action.impact,
          unit: 'challenge',
          moneySaved: action.moneySaved || 100,
          timestamp: new Date().toISOString(),
        }

        const updatedAchievements = (state.achievements || []).map(ach => {
          if (ach.earned) return ach
          let earned = false
          if (ach.id === 'a1' && newCompleted.length >= 1) earned = true
          if (ach.id === 'a2' && newStreak >= 7) earned = true
          if (ach.id === 'a5' && action.category === 'transport') earned = true
          if (ach.id === 'a6' && action.category === 'food') earned = true
          return earned ? { ...ach, earned: true, date: new Date().toISOString().split('T')[0] } : ach
        })

        set({
          completedActions: newCompleted,
          activityLogs: [newLog, ...(state.activityLogs || [])],
          actions: state.actions.map(a => a.id === actionId ? { ...a, completed: true } : a),
          moneySaved: (state.moneySaved || 0) + (action.moneySaved || 100),
          user: {
            ...state.user,
            xp: newXp,
            streak: newStreak,
            lastActiveDate: todayStr,
          },
          footprint: newFootprint,
          achievements: updatedAchievements,
        })
      },

      dismissNudge: (nudgeId) => {
        set(state => ({
          dismissedNudgeIds: [...(state.dismissedNudgeIds || []), nudgeId],
          nudges: state.nudges.map(n => n.id === nudgeId ? { ...n, dismissed: true } : n)
        }))
      },

      logDailyActivity: ({ category, impact, label, unit, receiptScan = false, moneySaved = 0 }) => {
        const state = get()
        const todayStr = new Date().toDateString()
        const currentVal = state.footprint[category] || 0
        const newFootprint = {
          ...state.footprint,
          [category]: Math.max(0, parseFloat((currentVal + impact).toFixed(1)))
        }
        const xpReward = Math.max(15, Math.round(Math.abs(impact) * 10))
        const newXp = (state.user?.xp || 0) + xpReward
        const newStreak = state.user?.lastActiveDate === todayStr ? (state.user?.streak || 1) : ((state.user?.streak || 0) + 1)

        const calculatedSavings = moneySaved > 0
          ? moneySaved
          : (category === 'transport' && impact <= 0.6 ? 180 : category === 'food' && impact <= 0.5 ? 90 : 0)

        const newLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: label,
          category,
          impact,
          unit: unit || 'units',
          moneySaved: calculatedSavings,
          receiptScan: !!receiptScan,
          timestamp: new Date().toISOString(),
        }

        set({
          footprint: newFootprint,
          activityLogs: [newLog, ...(state.activityLogs || [])],
          moneySaved: (state.moneySaved || 0) + calculatedSavings,
          user: {
            ...state.user,
            xp: newXp,
            streak: newStreak,
            lastActiveDate: todayStr,
          }
        })
        get().checkAchievements()
      },

      logBatchActivities: (items = []) => {
        if (!items || items.length === 0) return
        const state = get()
        const todayStr = new Date().toDateString()

        let updatedFootprint = { ...state.footprint }
        let totalXpGained = 0
        let totalMoneyGained = 0

        const newLogs = items.map((item, idx) => {
          const cat = item.category || 'transport'
          const impact = parseFloat(item.impact) || 0
          const savings = item.moneySaved || 0

          const cur = updatedFootprint[cat] || 0
          updatedFootprint[cat] = Math.max(0, parseFloat((cur + impact).toFixed(1)))

          totalXpGained += Math.max(15, Math.round(Math.abs(impact) * 10))
          totalMoneyGained += savings

          return {
            id: `log-batch-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 3)}`,
            title: item.title || item.label || 'Activity',
            category: cat,
            impact,
            unit: item.unit || 'units',
            moneySaved: savings,
            receiptScan: false,
            timestamp: new Date().toISOString(),
          }
        })

        const newStreak = state.user?.lastActiveDate === todayStr ? (state.user?.streak || 1) : ((state.user?.streak || 0) + 1)

        set({
          footprint: updatedFootprint,
          activityLogs: [...newLogs, ...(state.activityLogs || [])],
          moneySaved: (state.moneySaved || 0) + totalMoneyGained,
          user: {
            ...state.user,
            xp: (state.user?.xp || 0) + totalXpGained,
            streak: newStreak,
            lastActiveDate: todayStr,
          }
        })
        get().checkAchievements()
      },

      deleteActivityLog: (logId) => {
        const state = get()
        const target = (state.activityLogs || []).find(l => l.id === logId)
        if (!target) return
        const currentVal = state.footprint[target.category] || 0
        const newFootprint = {
          ...state.footprint,
          [target.category]: Math.max(0, parseFloat((currentVal - target.impact).toFixed(1)))
        }
        set({
          activityLogs: (state.activityLogs || []).filter(l => l.id !== logId),
          moneySaved: Math.max(0, (state.moneySaved || 0) - (target.moneySaved || 0)),
          footprint: newFootprint,
        })
      },

      sendTeamKudos: (memberId) => {
        const state = get()
        const updated = state.team.members.map(m =>
          m.id === memberId ? { ...m, kudos: (m.kudos || 0) + 1 } : m
        )
        set({ team: { ...state.team, members: updated } })
      },

      checkAchievements: () => {
        const state = get()
        const total = Object.values(state.footprint).reduce((a, b) => a + b, 0)
        const updatedAchievements = (state.achievements || []).map(ach => {
          if (ach.earned) return ach
          let earned = false
          if (ach.id === 'a1' && state.completedActions.length >= 1) earned = true
          if (ach.id === 'a2' && (state.user?.streak || 0) >= 7) earned = true
          if (ach.id === 'a3' && total <= 5.0) earned = true
          if (ach.id === 'a4' && total <= 6.0) earned = true
          if (ach.id === 'a5' && state.completedActions.some(a => a.category === 'transport')) earned = true
          if (ach.id === 'a6' && state.completedActions.some(a => a.category === 'food')) earned = true
          return earned ? { ...ach, earned: true, date: new Date().toISOString().split('T')[0] } : ach
        })
        set({ achievements: updatedAchievements })
      },

      completeOnboarding: (data) => {
        set({
          onboardingComplete: true,
          user: { ...get().user, ...data },
          footprint: data.footprint || get().footprint,
        })
      },

      addChatMessage: (message) => {
        set(state => ({
          chatMessages: [...state.chatMessages, message]
        }))
      },

      updateFootprint: (category, value) => {
        set(state => ({
          footprint: { ...state.footprint, [category]: value }
        }))
      },

      updateUserProfile: (updates) => {
        set(state => ({
          user: { ...state.user, ...updates }
        }))
      },

      restartOnboarding: () => {
        set({ onboardingComplete: false })
      },
    }),
    {
      name: 'ecoself-storage',
      partialize: (state) => ({
        user: state.user,
        footprint: state.footprint,
        completedActions: state.completedActions,
        activityLogs: state.activityLogs,
        monthlyBudget: state.monthlyBudget,
        moneySaved: state.moneySaved,
        monthlySavingsGoal: state.monthlySavingsGoal,
        onboardingComplete: state.onboardingComplete,
        weeklyData: state.weeklyData,
        achievements: state.achievements,
        dismissedNudgeIds: state.dismissedNudgeIds,
      })
    }
  )
)

export default useStore
