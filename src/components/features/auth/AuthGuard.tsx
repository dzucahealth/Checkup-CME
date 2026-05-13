'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import LoginForm from './LoginForm'

interface AuthGuardProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      if (pathname !== '/') {
        router.push('/')
      }
      return
    }

    if (adminOnly && !isAdmin) {
      router.push('/')
      return
    }

    if (!adminOnly && isAdmin && pathname === '/') {
      router.push('/admin')
    }
  }, [isLoading, isAuthenticated, isAdmin, adminOnly, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (adminOnly && !isAdmin) {
    return <LoginForm />
  }

  return <>{children}</>
}