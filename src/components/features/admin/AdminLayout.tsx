'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, LogOut, Users, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import UserList from './UserList'
import AssessmentList from './AssessmentList'

type AdminTab = 'assessments' | 'users'

function HeartPulse({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
    </svg>
  )
}

export default function AdminLayout() {
  const { isAuthenticated, isAdmin, isLoading, user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTab>('assessments')

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.replace('/')
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-teal-600" />
            <h1 className="text-lg font-bold text-gray-900">Painel Admin - CME Inteligente</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'assessments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('assessments')}
            className={activeTab === 'assessments' ? 'bg-teal-600' : ''}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Avaliações
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'bg-teal-600' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            Usuários
          </Button>
        </div>

        {activeTab === 'users' ? (
          <UserList />
        ) : (
          <AssessmentList />
        )}
      </div>
    </div>
  )
}