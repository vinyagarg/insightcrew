'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InsightCrewLogo, InsightCrewLogoIcon } from '@/components/InsightCrewLogo'
import { Search, Globe, Zap, Shield, ArrowRight } from 'lucide-react'

interface WelcomeCardProps {
  onContinue: (name: string) => void
}

export default function WelcomeCard({ onContinue }: WelcomeCardProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    if (name.trim()) {
      setIsLoading(true)
      setTimeout(() => {
        onContinue(name.trim())
      }, 300)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim() && !isLoading) {
      handleContinue()
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" x="40" y="40" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#116466" />
              <line x1="10" y1="10" x2="70" y2="10" stroke="#116466" strokeWidth="0.5" opacity="0.3" />
              <line x1="10" y1="10" x2="10" y2="70" stroke="#116466" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="1200" height="800" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-10 px-6 sm:px-8 py-4 flex items-center justify-between"
      >
        <InsightCrewLogo size="md" showText />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 sm:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl w-full items-center">
          {/* Left Column - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-10 px-4 sm:px-0"
          >
            {/* Welcome Label */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-accent to-transparent" />
                <span className="text-xs font-semibold tracking-widest text-accent uppercase">Welcome</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                Deep research <br /> powered by <span className="text-accent">AI.</span>
              </h1>

              {/* Description */}
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                InsightCrew helps you explore complex topics, discover insights, and stay ahead with AI-powered research.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              {[
                { icon: Search, label: 'Deep\nResearch' },
                { icon: Globe, label: 'AI\nPowered' },
                { icon: Zap, label: 'Fast &\nAccurate' },
                { icon: Shield, label: 'Private &\nSecure' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-lg border border-accent/20 hover:border-accent/40 transition-all group"
                >
                  <feature.icon className="w-5 h-5 text-accent group-hover:text-accent-light transition-colors" />
                  <span className="text-xs font-medium text-center whitespace-pre-line text-muted-foreground leading-tight">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Login Card */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative px-4 sm:px-0"
          >
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-accent/10 to-transparent rounded-2xl blur-2xl opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-peach/20 to-transparent rounded-2xl blur-xl opacity-40" />

            {/* Card */}
            <div className="relative bg-card/80 backdrop-blur-xl border border-accent/40 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-accent/10">
            {/* Card Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <InsightCrewLogoIcon />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">InsightCrew</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Deep research powered by AI. Enter your name to get started.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground block">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    autoFocus
                    className="border-accent/30 bg-background/40 backdrop-blur-sm focus:border-accent/60 focus:ring-accent/20 text-base placeholder:text-muted-foreground/60"
                  />
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  disabled={!name.trim() || isLoading}
                  className="w-full h-12 bg-accent hover:bg-accent/90 border-accent text-foreground font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Starting...' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-6 border-t border-accent/20 flex items-start gap-3">
                <Shield className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your research history will be saved locally and stays private.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
