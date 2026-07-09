import { useEffect, useState } from 'react'
import { STORAGE_KEYS } from '@/lib/constants'

export interface AuthState {
  userName: string | null
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    userName: null,
    isLoading: true,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME)
      setAuthState({
        userName: savedName,
        isLoading: false,
      })
    }
  }, [])

  const setUserName = (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, name)
      setAuthState({ userName: name, isLoading: false })
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER_NAME)
      localStorage.removeItem(STORAGE_KEYS.RESEARCH_HISTORY)
      setAuthState({ userName: null, isLoading: false })
    }
  }

  return {
    ...authState,
    setUserName,
    logout,
  }
}
