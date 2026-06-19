import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateWeeklyData } from '../data/mockData'

const useStore = create(
  persist(
    (set, get) => ({
      // User profile
      user: {
        name: 'Alex',
        avatar: '🌱',
        level: 3,
        xp: 740,
        xpToNext: 1000,
        streak: 7,
        joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },

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

      // Team/social data
      team: {
        name: 'Green Office Warriors',
        members: [
          { id: 1, name: 'Alex (you)', avatar: '🌱', footprint: 9.3, rank: 1, badge: 'eco-champion' },
          { id: 2, name: 'Priya', avatar: '🌿', footprint: 11.2, rank: 2, badge: 'green-starter' },
          { id: 3, name: 'Rajan', avatar: '🍃', footprint: 12.8, rank: 3, badge: 'aware' },
          { id: 4, name: 'Meera', avatar: '🌾', footprint: 10.1, rank: 4, badge: 'reducing' },
          { id: 5, name: 'Arjun', avatar: '🌲', footprint: 14.5, rank: 5, badge: 'beginner' },
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

      completeAction: (actionId) => {
        const state = get()
        const action = state.actions.find(a => a.id === actionId)
        if (!action) return

        set({
          completedActions: [...state.completedActions, { ...action, completedAt: new Date().toISOString() }],
          actions: state.actions.map(a => a.id === actionId ? { ...a, completed: true } : a),
          user: {
            ...state.user,
            xp: state.user.xp + action.xp,
            streak: state.user.streak,
          },
          footprint: {
            ...state.footprint,
            [action.category]: Math.max(0, (state.footprint[action.category] || 0) - action.impact * 0.1)
          }
        })
      },

      dismissNudge: (nudgeId) => {
        set(state => ({
          nudges: state.nudges.map(n => n.id === nudgeId ? { ...n, dismissed: true } : n)
        }))
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
    }),
    {
      name: 'ecoself-storage',
      partialize: (state) => ({
        user: state.user,
        footprint: state.footprint,
        completedActions: state.completedActions,
        onboardingComplete: state.onboardingComplete,
        weeklyData: state.weeklyData,
      })
    }
  )
)

export default useStore
