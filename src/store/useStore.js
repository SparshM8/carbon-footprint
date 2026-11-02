import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateWeeklyData } from '../data/mockData'

const useStore = create(
  persist(
    (set, get) => ({
      // User profile
      user: {
        name: 'Alex',
        location: 'Bengaluru',
        avatar: '🌱',
        level: 3,
        xp: 740,
        xpToNext: 1000,
        streak: 7,
        lastActiveDate: new Date().toDateString(),
        joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Monthly carbon budget in kg CO2e
      monthlyBudget: 150,

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
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        },
        {
          id: 'log-2',
          title: 'Plant-based lunch (Lentils & Rice)',
          category: 'food',
          impact: 0.4,
          unit: '1 meal',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'log-3',
          title: 'AC run in bedroom',
          category: 'energy',
          impact: 1.4,
          unit: '3 hours',
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'log-4',
          title: 'Bought second-hand book',
          category: 'shopping',
          impact: 0.3,
          unit: '1 item',
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        },
      ],

      // Active nudges
      nudges: [
        {
          id: 'n1',
          type: 'food',
          title: 'Meatless Monday savings',
          message: 'Skipping meat today saves 2.5 kg CO₂ — like planting 3 trees.',
          icon: '🥗',
          urgency: 'medium',
          timestamp: new Date().toISOString(),
          dismissed: false,
        },
        {
          id: 'n2',
          type: 'transport',
          title: 'Commute tip',
          message: 'Your usual drive today emits 1.8 kg CO₂. The bus cuts that by 70%.',
          icon: '🚌',
          urgency: 'high',
          timestamp: new Date().toISOString(),
          dismissed: false,
        },
      ],

      // Dismissed nudge IDs (including dynamic nudges)
      dismissedNudgeIds: [],

      // Team/social data
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

      // Achievements
      achievements: [
        { id: 'a1', title: 'First Step', desc: 'Logged your first activity', icon: '👣', earned: true, date: '2024-01-15' },
        { id: 'a2', title: '7-Day Streak', desc: 'Tracked for 7 days in a row', icon: '🔥', earned: true, date: '2024-01-22' },
        { id: 'a3', title: 'Tree Planter', desc: 'Offset 50 kg CO₂ this month', icon: '🌳', earned: true, date: '2024-01-28' },
        { id: 'a4', title: 'Carbon Cutter', desc: 'Reduce footprint by 20%', icon: '✂️', earned: false },
        { id: 'a5', title: 'Green Commuter', desc: 'Use public transit for 2 weeks', icon: '🚌', earned: false },
        { id: 'a6', title: 'Plant Pioneer', desc: 'Eat plant-based for 30 days', icon: '🥦', earned: false },
      ],

      // Actions (challenges)
      actions: [
        {
          id: 'act1', category: 'transport', title: 'Take public transit today',
          impact: 2.1, unit: 'kg CO₂', xp: 50, difficulty: 'easy',
          icon: '🚌', desc: 'Skip the car for one commute trip',
          completed: false, recurring: true
        },
        {
          id: 'act2', category: 'food', title: 'Eat plant-based meal',
          impact: 1.5, unit: 'kg CO₂', xp: 40, difficulty: 'easy',
          icon: '🥗', desc: 'Replace one meat meal with vegetables',
          completed: false, recurring: true
        },
        {
          id: 'act3', category: 'energy', title: 'Reduce AC by 2°C',
          impact: 0.8, unit: 'kg CO₂', xp: 30, difficulty: 'easy',
          icon: '🌡️', desc: 'Set your thermostat 2 degrees higher',
          completed: false, recurring: true
        },
        {
          id: 'act4', category: 'shopping', title: 'Buy second-hand item',
          impact: 3.2, unit: 'kg CO₂', xp: 80, difficulty: 'medium',
          icon: '♻️', desc: 'Instead of buying new, find it second-hand',
          completed: false, recurring: false
        },
        {
          id: 'act5', category: 'digital', title: 'Digital detox for 2 hours',
          impact: 0.2, unit: 'kg CO₂', xp: 20, difficulty: 'easy',
          icon: '📵', desc: 'Unplug devices and take a break from screens',
          completed: false, recurring: true
        },
        {
          id: 'act6', category: 'transport', title: 'Cycle or walk instead',
          impact: 2.8, unit: 'kg CO₂', xp: 70, difficulty: 'medium',
          icon: '🚲', desc: 'For trips under 3km, skip the motor',
          completed: false, recurring: true
        },
      ],

      // Onboarding state
      onboardingComplete: false,
      currentPage: 'dashboard',

      // AI chat messages
      chatMessages: [],

      // Actions
      setPage: (page) => set({ currentPage: page }),

      setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),

      completeAction: (actionId) => {
        const state = get()
        const action = state.actions.find(a => a.id === actionId)
        if (!action) return

        const todayStr = new Date().toDateString()
        const lastActive = state.user?.lastActiveDate
        const newStreak = lastActive === todayStr ? (state.user?.streak || 1) : ((state.user?.streak || 0) + 1)
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
          title: `Completed: ${action.title}`,
          category: action.category,
          impact: -action.impact,
          unit: 'challenge',
          timestamp: new Date().toISOString(),
        }

        const updatedAchievements = (state.achievements || []).map(ach => {
          if (ach.earned) return ach
          let earned = false
          if (ach.id === 'a1' && newCompleted.length >= 1) earned = true
          if (ach.id === 'a2' && newStreak >= 7) earned = true
          if (ach.id === 'a4' && action.category === 'transport') earned = true
          if (ach.id === 'a5' && action.category === 'transport') earned = true
          if (ach.id === 'a6' && action.category === 'food') earned = true
          return earned ? { ...ach, earned: true, date: new Date().toISOString().split('T')[0] } : ach
        })

        set({
          completedActions: newCompleted,
          activityLogs: [newLog, ...(state.activityLogs || [])],
          actions: state.actions.map(a => a.id === actionId ? { ...a, completed: true } : a),
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

      logDailyActivity: ({ category, impact, label, unit, receiptScan = false }) => {
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

        const newLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: label,
          category,
          impact,
          unit: unit || 'units',
          receiptScan: !!receiptScan,
          timestamp: new Date().toISOString(),
        }

        set({
          footprint: newFootprint,
          activityLogs: [newLog, ...(state.activityLogs || [])],
          user: {
            ...state.user,
            xp: newXp,
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
        onboardingComplete: state.onboardingComplete,
        weeklyData: state.weeklyData,
        achievements: state.achievements,
        dismissedNudgeIds: state.dismissedNudgeIds,
      })
    }
  )
)

export default useStore
