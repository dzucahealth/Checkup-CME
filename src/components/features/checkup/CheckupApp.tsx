'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { LoginForm } from '@/components/features/auth'

interface CheckupAppProps {
  children: React.ReactNode
}

export default function CheckupApp({ children }: CheckupAppProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Simply mark as mounted, don't set state
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mounted || isLoading) return

    if (isAuthenticated && isAdmin) {
      router.replace('/admin')
    }
  }, [mounted, isLoading, isAuthenticated, isAdmin, router])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 w-full max-w-md border shadow-lg">
          <div className="flex flex-col items-center gap-4 p-6">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isAuthenticated && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 w-full max-w-md border shadow-lg">
          <div className="flex flex-col items-center gap-4 p-6">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            <p className="text-sm text-muted-foreground">Redirecionando para admin...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <>{children}</>
}