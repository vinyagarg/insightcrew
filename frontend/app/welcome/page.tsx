'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WelcomeCard from '@/components/WelcomeCard'
import { useAuth } from '@/hooks/useAuth'

export default function WelcomePage() {
  const router = useRouter()
  const { userName, isLoading, setUserName } = useAuth()

  useEffect(() => {
    if (!isLoading && userName) {
      router.push('/')
    }
  }, [userName, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <WelcomeCard
      onContinue={(name) => {
        setUserName(name)
        router.push('/')
      }}
    />
  )
}
