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
    <div className="min-h-screen md:flex bg-transparent">
      <Navigation />
      <div className="flex-1 min-h-screen flex flex-col relative md:ml-64">
        <main className="flex-1 pb-20 md:pb-0 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto h-full px-4 md:px-0">
            {pages[currentPage] || <Dashboard />}
          </div>
        </main>
      </div>
    </div>
  )
}
