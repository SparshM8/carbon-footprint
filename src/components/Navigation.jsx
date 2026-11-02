import React from 'react'
import useStore from '../store/useStore'
import { Home, CheckCircle2, Globe2, Trophy, Sparkles, Leaf } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Overview', icon: Home },
  { id: 'actions', label: 'Actions', icon: CheckCircle2 },
  { id: 'world', label: 'Living world', icon: Globe2 },
  { id: 'leaderboard', label: 'Community', icon: Trophy },
  { id: 'advisor', label: 'Eco advisor', icon: Sparkles },
]

export default function Navigation() {
  const { currentPage, setPage } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#123c32] border-t border-emerald-900/30 shadow-[0_-10px_30px_rgba(18,60,50,0.12)] pb-safe md:top-0 md:bottom-auto md:h-screen md:w-64 md:border-r md:border-t-0 md:pb-0" aria-label="Main navigation">
      <div className="max-w-md mx-auto grid grid-cols-5 md:flex md:flex-col md:h-full md:max-w-none md:p-5 md:gap-2"> 
        <div className="hidden md:flex items-center gap-3 px-3 pb-9 pt-2 text-white"><span className="grid size-9 place-items-center rounded-xl bg-emerald-400 text-[#123c32]"><Leaf /></span><span className="font-semibold tracking-tight">EcoSelf<span className="text-emerald-300">.</span></span></div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            aria-current={currentPage === tab.id ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-1 py-3 px-1 text-xs font-medium transition-all duration-200 md:flex-row md:justify-start md:px-3 md:py-3 md:rounded-xl ${
              currentPage === tab.id
                ? 'text-emerald-950 md:bg-emerald-300 md:text-[#123c32] md:shadow-lg md:shadow-emerald-950/20'
                : 'text-emerald-100/60 hover:text-white md:hover:bg-white/10 md:hover:text-white'
            }`}
          >
            <tab.icon className="size-5 md:size-[18px]" aria-hidden="true" />
            <span className="text-[10px] md:text-sm md:font-semibold">{tab.label}</span>
            {currentPage === tab.id && <span className="absolute bottom-0 size-1.5 rounded-full bg-emerald-300 md:hidden" />}
          </button>
        ))}
      </div>
    </nav>
  )
}
