import React from 'react'
import useStore from '../store/useStore'

const tabs = [
  { id: 'dashboard', label: 'Home', icon: '⌂' },
  { id: 'actions', label: 'Actions', icon: '✓' },
  { id: 'world', label: 'World', icon: '🌍' },
  { id: 'leaderboard', label: 'Team', icon: '🏆' },
  { id: 'advisor', label: 'AI', icon: '✦' },
]

export default function Navigation() {
  const { currentPage, setPage } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-t border-white/50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] pb-safe md:top-0 md:bottom-auto md:h-screen md:w-64 md:border-r md:border-t-0 md:pb-0" aria-label="Main navigation">
      <div className="max-w-md mx-auto grid grid-cols-5 md:flex md:flex-col md:h-full md:max-w-none md:p-4 md:gap-2 md:mt-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            aria-current={currentPage === tab.id ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-1 py-3 px-1 text-xs font-medium transition-colors duration-150 md:flex-row md:justify-start md:px-4 md:py-3 md:rounded-lg ${
              currentPage === tab.id
                ? 'text-forest-700 md:bg-forest-50 md:text-forest-800'
                : 'text-gray-400 hover:text-gray-600 md:hover:bg-gray-50 md:hover:text-gray-800'
            }`}
          >
            <span className="text-xl leading-none md:w-8 md:text-2xl" aria-hidden="true">{tab.icon}</span>
            <span className="text-[10px] md:text-sm md:font-semibold">{tab.label}</span>
            {currentPage === tab.id && (
              <span className="absolute bottom-0 w-8 h-1 bg-forest-600 rounded-t-full md:hidden" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
