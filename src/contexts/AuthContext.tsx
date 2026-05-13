'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'cme_auth_token'
const USER_KEY = 'cme_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    let mounted = true
    
    const init = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        const storedUser = localStorage.getItem(USER_KEY)
  
        if (storedToken && storedUser && mounted) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setToken(storedToken)
        }
      } catch {
        // ignore parse errors
      }
      
      if (mounted) {
        setIsLoading(false)
      }
    }
    
    init()
    
    return () => {
      mounted = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login')
    }

    const { user: userData, token: authToken } = data

    localStorage.setItem(TOKEN_KEY, authToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))

    setUser(userData)
    setToken(authToken)
  }, [])

  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        // ignore error on logout
      }
    }

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    setUser(null)
    setToken(null)
  }, [token])

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
  }), [user, token, isLoading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}