'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import ExampleChips from '@/components/ExampleChips'
import ResearchHistory from '@/components/ResearchHistory'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const router = useRouter()
  const { userName, isLoading, logout } = useAuth()
  const [selectedQuery, setSelectedQuery] = useState('')

  useEffect(() => {
    if (!isLoading && !userName) {
      router.push('/welcome')
    }
  }, [userName, isLoading, router])

  const handleExampleSelect = (query: string) => {
    setSelectedQuery(query)
  }

  if (isLoading || !userName) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Header userName={userName} onLogout={logout} />
      <main className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            <div className="space-y-4 text-center">
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground">
                Deep Research,{' '}
                <span className="text-accent">Instantly</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                Ask any question and watch as our multi-agent AI conducts thorough research, analyzing sources and synthesizing insights.
              </p>
            </div>

            <div className="space-y-6">
              <SearchBar externalQuery={selectedQuery} />
              <ExampleChips onSelect={handleExampleSelect} />
            </div>

            <ResearchHistory />
          </motion.div>
        </div>
      </main>
    </>
  )
}
