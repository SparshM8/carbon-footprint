import React, { useState, useRef, useEffect } from 'react'
import useStore from '../store/useStore'
import { getLevelInfo, getTotalKg } from '../utils/calculations'
import {
  Bell,
  ChevronDown,
  Home,
  Search,
  Sparkles,
  Trophy,
  CircleCheck,
  Globe2,
  Leaf,
  Flame,
  MapPin,
  RotateCcw,
  X,
  ArrowRight,
  Edit2,
  Check,
  CheckCircle2,
} from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Overview', icon: Home },
  { id: 'actions', label: 'Activity', icon: CircleCheck },
  { id: 'world', label: 'Insights', icon: Sparkles },
  { id: 'leaderboard', label: 'Community', icon: Trophy },
  { id: 'advisor', label: 'Eco Advisor', icon: Globe2 },
]

export default function Navigation() {
  const { currentPage, setPage, user, footprint, actions, updateUserProfile, restartOnboarding } = useStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState(user?.name || 'Alex')
  const [editLocation, setEditLocation] = useState(user?.location || 'Bengaluru')
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Commute Tip', message: 'Taking the bus cuts your travel emissions by 70%.', unread: true, time: '10m ago' },
    { id: 2, title: 'Plant-Based Lunch', message: 'Skipping meat today saves up to 2.5 kg CO₂.', unread: true, time: '1h ago' },
    { id: 3, title: 'Streak Milestone', message: '🔥 You have reached a 7-day streak! Keep it up.', unread: false, time: '1d ago' },
  ])

  const profileRef = useRef(null)
  const notificationsRef = useRef(null)
  const searchInputRef = useRef(null)

  const total = getTotalKg(footprint)
  const levelInfo = getLevelInfo(user?.xp || 0)
  const xpPct = Math.round((((user?.xp || 0) - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100)
  const unreadCount = notifications.filter(n => n.unread).length

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
        setIsEditingProfile(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isSearchOpen])

  // Handle saving edited profile
  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (!editName.trim()) return
    updateUserProfile({ name: editName.trim(), location: editLocation.trim() })
    setIsEditingProfile(false)
  }

  // Clear all notifications
  const handleClearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  // Filter searchable items
  const searchResults = searchQuery.trim()
    ? [
        ...actions.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(a => ({ type: 'challenge', title: a.title, detail: `${a.impact} kg CO₂ · ${a.category}`, action: () => { setPage('actions'); setIsSearchOpen(false) } })),
        ...tabs.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(t => ({ type: 'page', title: `Go to ${t.label}`, detail: 'Navigation tab', action: () => { setPage(t.id); setIsSearchOpen(false) } })),
        { type: 'ai', title: `Ask Gemini: "${searchQuery}"`, detail: 'Eco Advisor query', action: () => { setPage('advisor'); setIsSearchOpen(false) } },
      ]
    : []

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e8e4d8] bg-[#f8f6ef]/90 px-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6">
          {/* Logo */}
          <button
            onClick={() => setPage('dashboard')}
            className="flex items-center gap-3 text-xl font-semibold tracking-tight text-[#062b20]"
          >
            <span className="grid size-10 place-items-center rounded-full bg-[#005a3c] text-white shadow-sm">
              <Leaf className="size-5" />
            </span>
            <span>carbonly</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setPage(tab.id)}
                className={`text-sm transition ${
                  currentPage === tab.id
                    ? 'font-semibold text-[#005a3c] border-b-2 border-[#005a3c] pb-1'
                    : 'text-[#75827c] hover:text-[#062b20]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Header Controls (Right side) */}
          <div className="ml-auto flex items-center gap-3 text-[#627169]">
            {/* Search Button */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search activities and challenges"
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-black/5 active:scale-95 text-[#5e6d64]"
              >
                <Search className="size-5" />
              </button>
            </div>

            {/* Notifications Button & Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen)
                  setIsProfileOpen(false)
                }}
                aria-label="View notifications"
                className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-black/5 active:scale-95 text-[#5e6d64]"
              >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-[#e14f3d] ring-2 ring-[#f8f6ef]" />
                )}
              </button>

              {/* Notifications Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe0]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#062b20]">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-[#005a3c]/10 px-2 py-0.5 text-[10px] font-semibold text-[#005a3c]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleClearNotifications}
                        className="text-xs text-[#005a3c] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map(item => (
                      <div
                        key={item.id}
                        className={`rounded-xl p-2.5 transition text-left border ${
                          item.unread
                            ? 'bg-[#f4f8f4] border-[#d8edd9]'
                            : 'bg-white border-[#f0ece1]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-semibold text-[#18362b]">{item.title}</p>
                          <span className="text-[10px] text-[#93a097]">{item.time}</span>
                        </div>
                        <p className="text-xs text-[#63736a] mt-1 leading-relaxed">{item.message}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setPage('actions')
                      setIsNotificationsOpen(false)
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#005a3c] py-2 text-xs font-medium text-white transition hover:bg-[#00452f]"
                  >
                    View daily challenges <ArrowRight className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown Trigger */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen)
                  setIsNotificationsOpen(false)
                }}
                className={`flex items-center gap-2 rounded-full border border-[#e4dfd2] bg-[#fffdf8] px-2.5 py-1.5 shadow-xs transition-all hover:border-[#005a3c]/40 hover:shadow-sm active:scale-98 ${
                  isProfileOpen ? 'ring-2 ring-[#005a3c]/20 border-[#005a3c]' : ''
                }`}
                aria-expanded={isProfileOpen}
                aria-label="User profile menu"
              >
                <span className="grid size-7 place-items-center rounded-full bg-[#d5f3df] text-xs font-semibold text-[#005a3c]">
                  {(user?.name || 'Alex').slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-[#263a31]">
                  {user?.name || 'Alex'}
                </span>
                <ChevronDown className={`size-4 text-[#738078] transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-[#005a3c]' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50 text-[#062b20]">
                  {/* User Profile Card */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#f0ebe0]">
                    <div className="grid size-12 place-items-center rounded-full bg-[#d5f3df] text-base font-bold text-[#005a3c] ring-2 ring-[#005a3c]/20">
                      {(user?.name || 'Alex').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate text-[#082a20]">{user?.name || 'Alex'}</p>
                        <button
                          onClick={() => {
                            setEditName(user?.name || '')
                            setEditLocation(user?.location || 'Bengaluru')
                            setIsEditingProfile(!isEditingProfile)
                          }}
                          className="text-[11px] text-[#005a3c] hover:underline flex items-center gap-1 font-medium"
                          title="Edit Profile"
                        >
                          <Edit2 className="size-3" /> Edit
                        </button>
                      </div>
                      <p className="text-xs text-[#718079] flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 text-[#005a3c]" /> {user?.location || 'Bengaluru, India'}
                      </p>
                    </div>
                  </div>

                  {/* Inline Profile Editing */}
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="mt-3 p-3 bg-[#f8f6ef] rounded-xl space-y-2 border border-[#e8e4d8]">
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-gray-500 block mb-0.5">Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005a3c]"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-gray-500 block mb-0.5">City</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={e => setEditLocation(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005a3c]"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="flex-1 py-1 rounded-md text-xs text-gray-600 border border-gray-300 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-1 rounded-md text-xs font-semibold bg-[#005a3c] text-white hover:bg-[#00452f] flex items-center justify-center gap-1"
                        >
                          <Check className="size-3" /> Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* Gamification Stats */}
                      <div className="mt-3 rounded-xl bg-[#f8f6ef] p-3 border border-[#ede9dc]">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-[#005a3c]">Lv. {levelInfo.level} · {levelInfo.title}</span>
                          <span className="text-gray-500 font-medium">{user?.xp || 0} XP</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#e2ded2] overflow-hidden">
                          <div className="h-full rounded-full bg-[#005a3c] transition-all duration-500" style={{ width: `${xpPct}%` }} />
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-[#e8e4d8]/60">
                          <span className="flex items-center gap-1 font-medium text-[#c45e12]">
                            <Flame className="size-3.5 fill-[#c45e12]" /> {user?.streak || 7}-day streak
                          </span>
                          <span className="text-gray-600 font-medium">{total} kg CO₂ today</span>
                        </div>
                      </div>

                      {/* Navigation Shortcut Links */}
                      <div className="mt-3 space-y-1 text-sm font-medium">
                        <button
                          onClick={() => {
                            setPage('actions')
                            setIsProfileOpen(false)
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[#f3efe4] text-[#243a32] transition"
                        >
                          <span className="flex items-center gap-2">
                            <CircleCheck className="size-4 text-[#005a3c]" /> My Challenges & Activity
                          </span>
                          <span className="text-[10px] text-gray-400">View →</span>
                        </button>

                        <button
                          onClick={() => {
                            setPage('world')
                            setIsProfileOpen(false)
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[#f3efe4] text-[#243a32] transition"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="size-4 text-[#005a3c]" /> Living World & Achievements
                          </span>
                          <span className="text-[10px] text-gray-400">View →</span>
                        </button>

                        <button
                          onClick={() => {
                            setPage('leaderboard')
                            setIsProfileOpen(false)
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[#f3efe4] text-[#243a32] transition"
                        >
                          <span className="flex items-center gap-2">
                            <Trophy className="size-4 text-[#005a3c]" /> Team & Community Leaderboard
                          </span>
                          <span className="text-[10px] text-gray-400">View →</span>
                        </button>

                        <button
                          onClick={() => {
                            setPage('advisor')
                            setIsProfileOpen(false)
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[#f3efe4] text-[#243a32] transition"
                        >
                          <span className="flex items-center gap-2">
                            <Globe2 className="size-4 text-[#005a3c]" /> Gemini Flash AI Coach
                          </span>
                          <span className="text-[10px] text-gray-400">Chat →</span>
                        </button>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-3 pt-2 border-t border-[#f0ebe0]">
                        <button
                          onClick={() => {
                            restartOnboarding()
                            setIsProfileOpen(false)
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 transition font-medium"
                        >
                          <RotateCcw className="size-3.5 text-red-600" /> Restart Profile Onboarding
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#eee8da]">
              <Search className="size-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search challenges, categories, or ask Gemini..."
                className="flex-1 bg-transparent text-sm text-[#062b20] placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery('')
                }}
                className="text-gray-400 hover:text-gray-700 p-1"
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500">Try searching for &quot;Bus&quot;, &quot;Diet&quot;, &quot;Energy&quot;, or &quot;Plan&quot;</p>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                    {['Public transit', 'Plant-based meal', 'Reduce AC', '7-day plan'].map(chip => (
                      <button
                        key={chip}
                        onClick={() => setSearchQuery(chip)}
                        className="text-xs bg-[#f4efe4] hover:bg-[#eae2d3] text-[#2c4038] px-2.5 py-1 rounded-full transition"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f6f2e8] text-left transition"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#082a20]">{item.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{item.detail}</p>
                      </div>
                      <ArrowRight className="size-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="p-4 text-center text-xs text-gray-400">No matching activities or pages found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#e8e4d8] bg-[#f8f6ef]/95 py-2.5 backdrop-blur-xl md:hidden"
        aria-label="Mobile navigation"
      >
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = currentPage === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              className={`flex flex-col items-center gap-1 px-2 text-xs transition ${
                isActive ? 'font-semibold text-[#005a3c]' : 'text-[#75827c]'
              }`}
            >
              <Icon className="size-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
