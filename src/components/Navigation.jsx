import React from 'react'
import useStore from '../store/useStore'
import { Bell, ChevronDown, Home, Search, Sparkles, Trophy, CircleCheck, Globe2, Leaf } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Overview', icon: Home },
  { id: 'actions', label: 'Activity', icon: CircleCheck },
  { id: 'world', label: 'Insights', icon: Sparkles },
  { id: 'leaderboard', label: 'Community', icon: Trophy },
  { id: 'advisor', label: 'Eco Advisor', icon: Globe2 },
]

export default function Navigation() {
  const { currentPage, setPage, user } = useStore()
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e8e4d8] bg-[#f8f6ef]/90 px-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6">
          <button onClick={() => setPage('dashboard')} className="flex items-center gap-3 text-xl font-semibold tracking-tight text-[#062b20]">
            <span className="grid size-10 place-items-center rounded-full bg-[#005a3c] text-white">
              <Leaf className="size-5" />
            </span>
            <span>carbonly</span>
          </button>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setPage(tab.id)}
                className={`text-sm transition ${currentPage === tab.id ? 'font-semibold text-[#005a3c] border-b-2 border-[#005a3c] pb-1' : 'text-[#75827c] hover:text-[#062b20]'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4 text-[#627169]">
            <button aria-label="Search"><Search className="size-5" /></button>
            <button aria-label="Notifications"><Bell className="size-5" /></button>
            <button className="flex items-center gap-2 rounded-full border border-[#e4dfd2] bg-[#fffdf8] px-2 py-1.5 shadow-sm">
              <span className="grid size-7 place-items-center rounded-full bg-[#d5f3df] text-xs font-semibold text-[#005a3c]">
                {(user?.name || 'Alex').slice(0, 2).toUpperCase()}
              </span>
              <span className="hidden text-sm text-[#263a31] sm:block">{user?.name || 'Alex'}</span>
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#e8e4d8] bg-[#f8f6ef]/95 py-2.5 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
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
