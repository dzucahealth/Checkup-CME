'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, Eye, Download, Send, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Assessment {
  id: string
  name: string
  email: string
  establishmentType: string
  totalScore: number | null
  status: string
  createdAt: string
  userName: string | null
  userEmail: string | null
}

const ESTABLISHMENT_LABELS: Record<string, string> = {
  hospital: 'Hospital',
  hospital_geral: 'Hospital Geral',
  clinica: 'Clínica',
  clinica_geral: 'Clínica Geral',
  unidade: 'Unidade de Saúde',
  unidade_basica: 'UBS',
  laboratorio: 'Laboratório',
  outro: 'Outro',
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pendente</Badge>
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>
    case 'completed':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Concluído</Badge>
    case 'released':
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Liberado</Badge>
    case 'sent':
      return <Badge className="bg-teal-100 text-teal-800 border-teal-200">Enviado</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AssessmentList() {
  const router = useRouter()
  const { token } = useAuth()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const url = statusFilter !== 'all' 
        ? `/api/assessments?status=${statusFilter}` 
        : '/api/assessments'
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (res.ok) {
        const data = await res.json()
        setAssessments(data)
      }
    } catch (error) {
      console.error('Error fetching assessments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [statusFilter, token])

  const handleRelease = async (assessmentId: string) => {
    try {
      const res = await fetch(`/api/assessment/${assessmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'released' }),
      })
      
      if (res.ok) {
        fetchAssessments()
      }
    } catch (error) {
      console.error('Error releasing assessment:', error)
    }
  }

  const handleView = async (assessmentId: string) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/assessment/${assessmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const current = assessments.find(a => a.id === assessmentId)
        if (current) {
          setSelectedAssessment({ ...current, ...data } as Assessment)
        }
      }
    } catch (error) {
      console.error('Error fetching assessment details:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'in_progress', 'completed', 'released', 'sent'].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={statusFilter === s ? 'bg-teal-600' : ''}
            >
              {s === 'all' ? 'Todos' : s === 'pending' ? 'Pendente' : s === 'in_progress' ? 'Em Andamento' : s === 'completed' ? 'Concluído' : s === 'released' ? 'Liberado' : 'Enviado'}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Score</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma avaliação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssessments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div>
                        <button
                          onClick={() => router.push(`/admin/assessment/${a.id}`)}
                          className="font-medium text-sm text-teal-700 hover:text-teal-900 hover:underline text-left"
                        >
                          {a.name || 'Avaliação'}
                        </button>
                        {a.userName && (
                          <p className="text-xs text-muted-foreground">Usuário: {a.userName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{a.email}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {ESTABLISHMENT_LABELS[a.establishmentType] || a.establishmentType}
                    </TableCell>
                    <TableCell>{getStatusBadge(a.status)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm font-medium">
                      {a.totalScore ? `${Math.round(a.totalScore)}%` : '-'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(a.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" title="Visualizar" onClick={() => handleView(a.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {a.status === 'completed' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Liberar resultado"
                            onClick={() => handleRelease(a.id)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Avaliação</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : selectedAssessment ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-sm">{selectedAssessment.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{selectedAssessment.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cargo</p>
                  <p className="text-sm">{selectedAssessment.position || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Estabelecimento</p>
                  <p className="text-sm">{ESTABLISHMENT_LABELS[selectedAssessment.establishmentType] || selectedAssessment.establishmentType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-sm">{selectedAssessment.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedAssessment.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score Total</p>
                  <p className="text-sm font-medium">{selectedAssessment.totalScore ? `${Math.round(selectedAssessment.totalScore)}%` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                  <p className="text-sm">{formatDate(selectedAssessment.createdAt)}</p>
                </div>
              </div>
              
              {(selectedAssessment as any).scores && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Scores por Categoria</p>
                  <div className="grid grid-cols-4 gap-2">
                    {((selectedAssessment as any).scores as Array<{category: string, percentage: number}>).map((score: any) => (
                      <div key={score.category} className="bg-muted p-2 rounded text-center">
                        <p className="text-xs text-muted-foreground capitalize">{score.category}</p>
                        <p className="text-sm font-bold">{Math.round(score.percentage)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}