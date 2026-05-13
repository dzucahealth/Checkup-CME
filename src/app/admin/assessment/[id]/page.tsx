'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, ArrowLeft, ArrowRight, CheckCircle, Copy, ExternalLink, BarChart3, TrendingUp, Cpu, DollarSign, AlertTriangle, Star, Target, Shield, Activity, Building2, Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { checkupQuestions } from '@/lib/checkup-questions'

interface AssessmentResponse {
  questionId: string
  answer: number
}

interface AssessmentScore {
  category: string
  score: number
  maxScore: number
  percentage: number
}

interface AssessmentResult {
  id: string
  assessmentId: string
  managementScore: number | null
  processScore: number | null
  technologyScore: number | null
  financialScore: number | null
  resultJson: string | null
  adminObservation: string | null
  economyMinEdited: number | null
  economyMaxEdited: number | null
  financialRiskLevelEdited: string | null
  financialLossEdited: number | null
  releasedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

interface Assessment {
  id: string
  name: string
  position: string
  phone: string
  email: string
  establishmentType: string
  bedCount: string
  cmeProfessionals: string
  region: string
  state: string
  consentGiven: boolean
  status: string
  totalScore: number | null
  createdAt: string
  updatedAt: string
  userId: string
  user?: { name: string; email: string }
  scores: AssessmentScore[]
  result: AssessmentResult | null
}

const CATEGORIES = [
  { key: 'gestao', label: 'Gestão', icon: <Shield className="w-5 h-5" />, color: '#8B5CF6' },
  { key: 'processo', label: 'Processo', icon: <Activity className="w-5 h-5" />, color: '#0EA5E9' },
  { key: 'tecnologia', label: 'Tecnologia', icon: <Cpu className="w-5 h-5" />, color: '#10B981' },
  { key: 'financeiro', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" />, color: '#F59E0B' },
]

function getClassification(percentage: number): string {
  if (percentage >= 80) return 'Avançado'
  if (percentage >= 60) return 'Moderado'
  if (percentage >= 40) return 'Atenção'
  return 'Crítico'
}

function getClassificationColor(classification: string): string {
  switch (classification) {
    case 'Avançado': return 'text-emerald-600'
    case 'Moderado': return 'text-amber-600'
    case 'Atenção': return 'text-orange-600'
    case 'Crítico': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

function getClassificationHexColor(classification: string): string {
  switch (classification) {
    case 'Avançado': return '#059669'
    case 'Moderado': return '#D97706'
    case 'Atenção': return '#EA580C'
    case 'Crítico': return '#DC2626'
    default: return '#6B7280'
  }
}

function getClassificationBg(classification: string): string {
  switch (classification) {
    case 'Avançado': return 'bg-emerald-50 border-emerald-200'
    case 'Moderado': return 'bg-amber-50 border-amber-200'
    case 'Atenção': return 'bg-orange-50 border-orange-200'
    case 'Crítico': return 'bg-red-50 border-red-200'
    default: return 'bg-gray-50 border-gray-200'
  }
}

function getClassificationIcon(classification: string) {
  switch (classification) {
    case 'Avançado': return <Star className="w-5 h-5" />
    case 'Moderado': return <Target className="w-5 h-5" />
    case 'Atenção': return <AlertTriangle className="w-5 h-5" />
    case 'Crítico': return <AlertTriangle className="w-5 h-5" />
    default: return <Star className="w-5 h-5" />
  }
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

const BED_COUNT_LABELS: Record<string, string> = {
  sem_leitos: 'Sem leitos de internação',
  ate_20: 'Até 20 leitos',
  '21_a_50': '21 a 50 leitos',
  '51_a_100': '51 a 100 leitos',
  '101_a_150': '101 a 150 leitos',
  '151_a_300': '151 a 300 leitos',
  acima_300: 'Acima de 300 leitos',
}

const CME_PROFESSIONALS_LABELS: Record<string, string> = {
  '1_a_3': '1 a 3 profissionais',
  '4_a_6': '4 a 6 profissionais',
  '7_a_10': '7 a 10 profissionais',
  '11_a_20': '11 a 20 profissionais',
  '21_a_30': '21 a 30 profissionais',
  acima_30: 'Acima de 30 profissionais',
}

const REGION_LABELS: Record<string, string> = {
  norte: 'Norte',
  nordeste: 'Nordeste',
  centro_oeste: 'Centro-Oeste',
  sudeste: 'Sudeste',
  sul: 'Sul',
}

const STATE_LABELS: Record<string, string> = {
  AC: 'Acre', AM: 'Amazonas', AP: 'Amapá', PA: 'Pará', RO: 'Rondônia', RR: 'Roraima', TO: 'Tocantins',
  AL: 'Alagoas', BA: 'Bahia', CE: 'Ceará', MA: 'Maranhão', PB: 'Paraíba', PE: 'Pernambuco', PI: 'Piauí', RN: 'Rio Grande do Norte', SE: 'Sergipe',
  DF: 'Distrito Federal', GO: 'Goiás', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  ES: 'Espírito Santo', MG: 'Minas Gerais', RJ: 'Rio de Janeiro', SP: 'São Paulo',
  PR: 'Paraná', RS: 'Rio Grande do Sul', SC: 'Santa Catarina',
}

function CircularProgress({ percentage, size = 140, strokeWidth = 10, color }: {
  percentage: number
  size?: number
  strokeWidth?: number
  color: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

export default function AssessmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [releaseLoading, setReleaseLoading] = useState(false)
  const [releaseError, setReleaseError] = useState('')
  const [releaseSuccess, setReleaseSuccess] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [adminNote, setAdminNote] = useState('')
  const [copied, setCopied] = useState(false)
  const [economyMin, setEconomyMin] = useState('')
  const [economyMax, setEconomyMax] = useState('')
  const [riskLevel, setRiskLevel] = useState('')
  const [estimatedLoss, setEstimatedLoss] = useState<number | null>(null)
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    overall: true, categories: true, recommendations: true, economy: true, financialRisk: true
  })
  const [showAllAnswers, setShowAllAnswers] = useState(false)

  // Converter respostas para map
  const responsesMap = useMemo(() => {
    if (!assessment?.responses) return {}
    const map: Record<string, number> = {}
    assessment.responses.forEach((r: AssessmentResponse) => {
      map[r.questionId] = r.answer
    })
    return map
  }, [assessment?.responses])

  // Análise por categoria com contagem de respondidas/não sei
  const categoryAnalysis = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catQuestions = checkupQuestions.filter(q => q.category === cat.key)
      let score = 0, maxScore = 0, answered = 0, noInfo = 0
      catQuestions.forEach(q => {
        const ans = responsesMap[q.id]
        if (ans !== undefined) {
          if (ans > 0) {
            score += ans * q.weight
            maxScore += 4 * q.weight
            answered++
          } else {
            noInfo++
          }
        }
      })
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
      return { ...cat, score, maxScore, percentage, answered, noInfo, totalQuestions: catQuestions.length }
    })
  }, [responsesMap])

  // 5 piores questões
  const worstQuestions = useMemo(() => {
    return checkupQuestions
      .map(q => {
        const answer = responsesMap[q.id]
        if (answer === undefined || answer === 0) return null
        const relativeScore = (answer * q.weight) / (4 * q.weight)
        return { question: q, answer, relativeScore }
      })
      .filter(Boolean)
      .sort((a, b) => (a?.relativeScore ?? 0) - (b?.relativeScore ?? 0))
      .slice(0, 5)
  }, [responsesMap])

  // Estimativa de desperdício
  const wasteEstimate = useMemo(() => {
    let minMonthly = 0, maxMonthly = 0
    const maint = responsesMap['financeiro_6']
    if (maint === 1) { minMonthly += 10000; maxMonthly += 15000 }
    else if (maint === 2) { minMonthly += 5000; maxMonthly += 10000 }
    else if (maint === 3) { minMonthly += 1000; maxMonthly += 5000 }
    else if (maint === 4) { minMonthly += 0; maxMonthly += 1000 }
    const waste = responsesMap['financeiro_10']
    if (waste === 1) { minMonthly += 5000; maxMonthly += 10000 }
    else if (waste === 2) { minMonthly += 2000; maxMonthly += 5000 }
    else if (waste === 3) { minMonthly += 500; maxMonthly += 2000 }
    else if (waste === 4) { minMonthly += 0; maxMonthly += 500 }
    return { minMonthly, maxMonthly, minAnnual: minMonthly * 12, maxAnnual: maxMonthly * 12 }
  }, [responsesMap])

  // Gap de visibilidade (respostas = 0 = "não sei")
  const visibilityGaps = useMemo(() => {
    const gaps: { questionId: string; question: string; category: string; categoryLabel: string }[] = []
    Object.entries(responsesMap).forEach(([qId, val]) => {
      if (val === 0) {
        const q = checkupQuestions.find(q => q.id === qId)
        if (q) {
          const catInfo = CATEGORIES.find(c => c.key === q.category)
          gaps.push({ questionId: qId, question: q.question, category: q.category, categoryLabel: catInfo?.label ?? q.category })
        }
      }
    })
    return gaps
  }, [responsesMap])

  const assessmentId = params.id as string

  useEffect(() => {
    async function loadAssessment() {
      try {
        const res = await fetch(`/api/assessment/${assessmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          console.log('[Frontend] Dados recebidos:', JSON.stringify({
            id: data.id,
            hasResult: !!data.result,
            resultJson: data.result?.resultJson?.substring(0, 200),
            economyMinEdited: data.result?.economyMinEdited,
            economyMaxEdited: data.result?.economyMaxEdited,
            financialRiskLevelEdited: data.result?.financialRiskLevelEdited
          }, null, 2))
          setAssessment(data)
          setAdminNote(data.result?.adminObservation || '')
          
          // Load saved values
          const resultJson = data.result?.resultJson ? JSON.parse(data.result.resultJson) : null
          const savedSections = resultJson?.visibleSections || {
            overall: true, categories: true, recommendations: true, economy: true, financialRisk: true
          }
          setVisibleSections(savedSections)
          
          if (data.result?.economyMinEdited !== null && data.result?.economyMinEdited !== undefined) {
            setEconomyMin(data.result.economyMinEdited.toString())
          }
          if (data.result?.economyMaxEdited !== null && data.result?.economyMaxEdited !== undefined) {
            setEconomyMax(data.result.economyMaxEdited.toString())
          }
          if (data.result?.financialRiskLevelEdited) {
            setRiskLevel(data.result.financialRiskLevelEdited)
          }
          if (data.result?.financialLossEdited !== null && data.result?.financialLossEdited !== undefined) {
            setEstimatedLoss(data.result.financialLossEdited)
          }
        }
      } catch (err) {
        console.error('Error loading assessment:', err)
      } finally {
        setLoading(false)
      }
    }
    if (token) loadAssessment()
  }, [assessmentId, token])

  const handleRelease = async () => {
    setReleaseLoading(true)
    setReleaseError('')
    setReleaseSuccess(false)
    try {
      const res = await fetch(`/api/assessment/${assessmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'released' })
      })
      if (!res.ok) throw new Error('Erro ao liberar')
      setReleaseSuccess(true)
      setAssessment(prev => prev ? { ...prev, status: 'released' } : null)
    } catch (err) {
      setReleaseError('Erro ao liberar resultado')
    } finally {
      setReleaseLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    setSavingNote(true)
    const payload = {
      adminObservation: adminNote,
      economyMinEdited: economyMin ? parseFloat(economyMin) : null,
      economyMaxEdited: economyMax ? parseFloat(economyMax) : null,
      financialRiskLevelEdited: riskLevel || null,
      financialLossEdited: estimatedLoss,
      visibleSections
    }
    console.log('[Frontend] Enviando payload:', JSON.stringify(payload, null, 2))
    try {
      const res = await fetch(`/api/assessment/${assessmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      console.log('[Frontend] Resposta:', res.status, res.statusText)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving note:', err)
    } finally {
      setSavingNote(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/resultado/${assessmentId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Avaliação não encontrada</p>
        <Button onClick={() => router.push('/admin')}>Voltar ao Admin</Button>
      </div>
    )
  }

  const classification = getClassification(assessment.totalScore || 0)
  const classColor = getClassificationColor(classification)
  const classBg = getClassificationBg(classification)
  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/resultado/${assessmentId}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="font-bold text-lg">Avaliação #{assessment.id.slice(0, 8)}</h1>
              <p className="text-sm text-muted-foreground">
                {assessment.name || 'Usuário'} • {new Date(assessment.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <Badge className={assessment.status === 'released' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'}>
            {assessment.status === 'released' ? 'Liberado' : 'Concluído'}
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  Resultado Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <CircularProgress percentage={assessment.totalScore || 0} color={getClassificationHexColor(classification)} />
                  <div className="flex-1">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold ${classBg} ${classColor}`}>
                      {getClassificationIcon(classification)}
                      {classification}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      {classification === 'Avançado' && 'Sua CME apresenta um bom nível de maturidade, porém sempre existem oportunidades de otimização.'}
                      {classification === 'Moderado' && 'Sua CME necessita de melhorias em diversas áreas. Recomendamos um plano de ação prioritário.'}
                      {classification === 'Atenção' && 'Sua CME apresenta deficiências significativas que necessitam de atenção imediata.'}
                      {classification === 'Crítico' && 'Sua CME apresenta deficiências críticas que exigem intervenção urgente.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  Scores por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {CATEGORIES.map(cat => {
                    const score = assessment.scores?.find(s => s.category === cat.key)
                    const percentage = score?.percentage || 0
                    return (
                      <div key={cat.key} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                            {cat.icon}
                          </div>
                          <span className="font-semibold">{cat.label}</span>
                          <span className="text-sm text-muted-foreground ml-auto">{Math.round(percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: cat.color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  Análise por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryAnalysis.map(cat => (
                  <div key={cat.key} className="flex items-center gap-4">
                    <div className="w-32 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                          {cat.icon}
                        </div>
                        <span className="font-medium text-sm">{cat.label}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{Math.round(cat.percentage)}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex gap-3">
                        <span className="text-emerald-600">{cat.answered} respondidas</span>
                        <span className="text-amber-600">{cat.noInfo} não sei</span>
                        <span>{cat.totalQuestions} total</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {worstQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    5 Pontos de Atenção
                  </CardTitle>
                  <CardDescription className="text-xs">Questões com menor pontuação relativa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {worstQuestions.map((item, idx) => {
                    const catInfo = CATEGORIES.find(c => c.key === item?.question.category)
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item?.question.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{catInfo?.label}</Badge>
                            <span className="text-xs text-muted-foreground">Resposta: {item?.answer}/4</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {(wasteEstimate.minMonthly > 0 || wasteEstimate.maxMonthly > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    Estimativa de Desperdício
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-amber-700 mb-1">Mensal</p>
                      <p className="text-lg font-bold text-amber-800">
                        R$ {wasteEstimate.minMonthly.toLocaleString()} - R$ {wasteEstimate.maxMonthly.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-red-700 mb-1">Anual</p>
                      <p className="text-lg font-bold text-red-800">
                        R$ {wasteEstimate.minAnnual.toLocaleString()} - R$ {wasteEstimate.maxAnnual.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">*Estimativa baseada em respostas sobre manutenção, perdas e reprocessamento</p>
                </CardContent>
              </Card>
            )}

            {visibilityGaps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Gaps de Informação
                  </CardTitle>
                  <CardDescription className="text-xs">Perguntas respondidas como "não sei"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {visibilityGaps.map(gap => (
                      <Badge key={gap.questionId} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {gap.categoryLabel}: {gap.question.slice(0, 40)}...
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => setShowAllAnswers(!showAllAnswers)}
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Todas as Respostas ({checkupQuestions.length} perguntas)
                  </span>
                  {showAllAnswers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CardHeader>
              {showAllAnswers && (
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {checkupQuestions.map(q => {
                    const answer = responsesMap[q.id]
                    const catInfo = CATEGORIES.find(c => c.key === q.category)
                    const opt = q.options.find(o => o.value === answer)
                    if (answer === undefined) return null
                    return (
                      <div key={q.id} className={`p-2 rounded text-sm ${answer === 0 ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs shrink-0" style={{ backgroundColor: catInfo?.color + '20', borderColor: catInfo?.color }}>
                            {catInfo?.label}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs line-clamp-2">{q.question}</p>
                            <p className={`text-xs mt-1 ${answer === 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {answer === 0 ? 'Não sei' : `Resposta: ${opt?.label}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados do Respondente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><span className="text-muted-foreground">Nome:</span> {assessment.name || '-'}</div>
                <div><span className="text-muted-foreground">Email:</span> {assessment.email || '-'}</div>
                <div><span className="text-muted-foreground">Cargo:</span> {assessment.position || '-'}</div>
                <div><span className="text-muted-foreground">Telefone:</span> {assessment.phone || '-'}</div>
                <Separator />
                <div><span className="text-muted-foreground">Estabelecimento:</span> {ESTABLISHMENT_LABELS[assessment.establishmentType] || assessment.establishmentType}</div>
                <div><span className="text-muted-foreground">Leitos:</span> {BED_COUNT_LABELS[assessment.bedCount] || assessment.bedCount || '-'}</div>
                <div><span className="text-muted-foreground">Profissionais CME:</span> {CME_PROFESSIONALS_LABELS[assessment.cmeProfessionals] || assessment.cmeProfessionals || '-'}</div>
                <div><span className="text-muted-foreground">Região:</span> {REGION_LABELS[assessment.region] || assessment.region || '-'} / {STATE_LABELS[assessment.state] || assessment.state || '-'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações do Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Nota interna (não visível ao usuário)</Label>
                  <Textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Observações internas sobre esta avaliação..."
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Economia Estimada (R$/ano)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Mínimo</Label>
                      <Input
                        type="number"
                        value={economyMin}
                        onChange={(e) => setEconomyMin(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Máximo</Label>
                      <Input
                        type="number"
                        value={economyMax}
                        onChange={(e) => setEconomyMax(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nível de Risco</Label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="baixo">Baixo</option>
                    <option value="medio">Médio</option>
                    <option value="alto">Alto</option>
                    <option value="critico">Crítico</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Perda Estimada (R$/ano)</Label>
                  <Input
                    type="number"
                    value={estimatedLoss ?? ''}
                    onChange={(e) => setEstimatedLoss(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="0"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Seções Visíveis no Resultado</Label>
                  <div className="space-y-1">
                    {Object.entries(visibleSections).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Checkbox
                          id={key}
                          checked={val}
                          onCheckedChange={(checked) => setVisibleSections(prev => ({ ...prev, [key]: !!checked }))}
                        />
                        <Label htmlFor={key} className="text-sm cursor-pointer">
                          {key === 'overall' && 'Resultado Geral'}
                          {key === 'categories' && 'Scores por Categoria'}
                          {key === 'recommendations' && 'Recomendações'}
                          {key === 'economy' && 'Economia Estimada'}
                          {key === 'financialRisk' && 'Risco Financeiro'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={handleSaveConfig} disabled={savingNote}>
                  {savingNote ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Salvar Alterações
                </Button>
                {saveSuccess && <p className="text-sm text-emerald-600 text-center mt-1">Configurações salvas!</p>}

                <Separator />

                {assessment.status !== 'released' ? (
                  <div className="space-y-2">
                    <Button className="w-full" onClick={handleRelease} disabled={releaseLoading}>
                      {releaseLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                      Liberar Resultado
                    </Button>
                    {releaseError && <p className="text-sm text-red-600">{releaseError}</p>}
                    {releaseSuccess && <p className="text-sm text-emerald-600">Resultado liberado com sucesso!</p>}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm">Link para o usuário acessar</Label>
                    <div className="flex gap-2">
                      <Input value={shareLink} readOnly className="text-xs" />
                      <Button size="sm" variant="outline" onClick={copyLink}>
                        {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={shareLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}