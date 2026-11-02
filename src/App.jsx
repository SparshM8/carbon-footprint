import React from 'react'
import useStore from './store/useStore'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import ActionCenter from './pages/ActionCenter'
import WorldView from './pages/WorldView'
import LeaderBoard from './pages/LeaderBoard'
import AIAdvisor from './pages/AIAdvisor'
import Navigation from './components/Navigation'

export default function App() {
  const { onboardingComplete, currentPage } = useStore()

  if (!onboardingComplete) {
    return <Onboarding />
  }

  const pages = {
    dashboard: <Dashboard />,
    actions: <ActionCenter />,
    world: <WorldView />,
    leaderboard: <LeaderBoard />,
    advisor: <AIAdvisor />,
  }

  return (
    <div className="min-h-screen bg-transparent">\n      <Navigation />\n      <div className="min-h-screen">\n        <main className="mx-auto max-w-7xl px-4 pb-10 md:px-8">\n          <div className="h-full">
            {pages[currentPage] || <Dashboard />}
          </div>
        </main>
      </div>
    </div>
  )
}
