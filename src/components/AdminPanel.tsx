'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Shield, Eye, Copy, Check, Search, Filter,
  Lock, ChevronLeft, Users, AlertTriangle, Send,
  ArrowRight, HeartPulse, BarChart3, TrendingDown,
  TrendingUp, AlertCircle, DollarSign, Zap, Download,
  ArrowDownRight, ArrowUpRight, Minus, FileWarning,
  ShieldAlert, Activity, Target, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  CATEGORIES, ESTABLISHMENT_TYPES, BED_COUNT_OPTIONS,
  CME_PROFESSIONALS_OPTIONS, REGIONS,
  getClassification, getClassificationColor, getClassificationBg,
  CategoryKey,
} from '@/lib/types';
import { checkupQuestions } from '@/lib/checkup-questions';
import { getZipFile } from '@/app/actions';

interface AssessmentRow {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  establishmentType: string;
  bedCount: string;
  cmeProfessionals: string;
  region: string;
  state: string;
  totalScore: number;
  managementScore: number | null;
  processScore: number | null;
  technologyScore: number | null;
  financialScore: number | null;
  createdAt: string;
  status: string;
  adminObservation: string | null;
  economyMinEdited: number | null;
  economyMaxEdited: number | null;
  financialRiskLevelEdited: string | null;
  financialLossEdited: string | null;
  releasedAt: string | null;
  responses: string;
  resultJson: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getEstablishmentLabel(id: string) {
  return ESTABLISHMENT_TYPES.find(t => t.id === id)?.label ?? id;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Pendente</Badge>;
    case 'released':
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">Liberado</Badge>;
    case 'sent':
      return <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100">Enviado</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getClassificationIcon(classification: string) {
  switch (classification) {
    case 'Avançado': return <TrendingUp className="w-3.5 h-3.5" />;
    case 'Moderado': return <Minus className="w-3.5 h-3.5" />;
    case 'Atenção': return <AlertTriangle className="w-3.5 h-3.5" />;
    case 'Crítico': return <ShieldAlert className="w-3.5 h-3.5" />;
    default: return null;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50';
  if (score >= 60) return 'text-teal-600 bg-teal-50';
  if (score >= 40) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
}

// Financial question IDs and their cost mapping
const FINANCIAL_QUESTIONS_COSTS: Record<string, { label: string; costMap: Record<number, string>; unit: string }> = {
  financeiro_2: {
    label: 'Cancelamentos de Cirurgia',
    costMap: {
      1: 'R$ 80.000 - R$ 200.000/ano',
      2: 'R$ 40.000 - R$ 80.000/ano',
      3: 'R$ 5.000 - R$ 40.000/ano',
      4: 'Sem custo identificado',
    },
    unit: '/ano',
  },
  financeiro_3: {
    label: 'Reprocessamentos',
    costMap: {
      1: 'R$ 15.000 - R$ 50.000/ano',
      2: 'R$ 8.000 - R$ 15.000/ano',
      3: 'R$ 2.000 - R$ 8.000/ano',
      4: 'Abaixo de R$ 2.000/ano',
    },
    unit: '/ano',
  },
  financeiro_4: {
    label: 'Perdas de Instrumentais',
    costMap: {
      1: 'R$ 30.000 - R$ 100.000/ano',
      2: 'R$ 12.000 - R$ 30.000/ano',
      3: 'R$ 3.000 - R$ 12.000/ano',
      4: 'Abaixo de R$ 3.000/ano',
    },
    unit: '/ano',
  },
  financeiro_6: {
    label: 'Manutenção Corretiva',
    costMap: {
      1: 'Acima de R$ 10.000/mês (R$ 120.000/ano)',
      2: 'R$ 5.000 - R$ 10.000/mês (R$ 60.000 - R$ 120.000/ano)',
      3: 'R$ 1.000 - R$ 5.000/mês (R$ 12.000 - R$ 60.000/ano)',
      4: 'Abaixo de R$ 1.000/mês (R$ 12.000/ano)',
    },
    unit: '/mês',
  },
  financeiro_10: {
    label: 'Desperdício de Insumos',
    costMap: {
      1: 'Acima de R$ 5.000/mês (R$ 60.000/ano)',
      2: 'R$ 2.000 - R$ 5.000/mês (R$ 24.000 - R$ 60.000/ano)',
      3: 'R$ 500 - R$ 2.000/mês (R$ 6.000 - R$ 24.000/ano)',
      4: 'Abaixo de R$ 500/mês (R$ 6.000/ano)',
    },
    unit: '/mês',
  },
};

// ============================
// Login Screen
// ============================
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'cme@2024') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-teal-600" />
          </div>
          <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
          <CardDescription>CME Inteligente - Acesso restrito</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha de acesso</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={error ? 'border-destructive' : ''}
              />
              {error && <p className="text-xs text-destructive">Senha incorreta</p>}
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================
// Dashboard (List view)
// ============================
function Dashboard({ assessments, onViewDetail, onLogout }: {
  assessments: AssessmentRow[];
  onViewDetail: (id: string) => void;
  onLogout: () => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [downloading, setDownloading] = useState(false);

  const filtered = assessments.filter(a => {
    const matchesSearch = search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: assessments.length,
    pending: assessments.filter(a => a.status === 'pending').length,
    released: assessments.filter(a => a.status === 'released').length,
    sent: assessments.filter(a => a.status === 'sent').length,
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const result = await getZipFile();
      if (!result.success) {
        alert('Erro: ' + result.error);
        setDownloading(false);
        return;
      }
      // Convert base64 to blob
      const binaryString = atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'checkupcme.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao gerar download. Tente novamente.');
      console.error(err);
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-teal-600" />
            <h1 className="text-lg font-bold text-gray-900">Painel Admin - CME Inteligente</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadZip} disabled={downloading} className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100">
              <Download className="w-4 h-4 mr-1" />
              {downloading ? 'Gerando...' : 'Baixar Sistema ZIP'}
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <Lock className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Pendentes</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Liberados</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{stats.released}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 pb-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Send className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-muted-foreground">Enviados</span>
              </div>
              <p className="text-2xl font-bold text-teal-600">{stats.sent}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'released', 'sent'].map(s => (
                  <Button
                    key={s}
                    variant={statusFilter === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(s)}
                    className={statusFilter === s ? 'bg-teal-600 hover:bg-teal-700' : ''}
                  >
                    {s === 'all' ? 'Todos' : s === 'pending' ? 'Pendentes' : s === 'released' ? 'Liberados' : 'Enviados'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6 px-0 sm:px-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Nome</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Pontuação</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhuma avaliação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(a => (
                      <TableRow key={a.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onViewDetail(a.id)}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{a.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{a.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{a.email}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{getEstablishmentLabel(a.establishmentType)}</TableCell>
                        <TableCell>{getStatusBadge(a.status)}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm font-medium">{Math.round(a.totalScore)}%</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================
// Detail View
// ============================
function DetailView({ assessment, onBack }: {
  assessment: AssessmentRow;
  onBack: () => void;
}) {
  const [observation, setObservation] = useState(assessment.adminObservation ?? '');
  const [economyMin, setEconomyMin] = useState(assessment.economyMinEdited?.toString() ?? '');
  const [economyMax, setEconomyMax] = useState(assessment.economyMaxEdited?.toString() ?? '');
  const [riskLevel, setRiskLevel] = useState(assessment.financialRiskLevelEdited ?? '');
  const [estimatedLoss, setEstimatedLoss] = useState(assessment.financialLossEdited ?? '');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Toggle states for sections to show/hide in user result
  const defaultSections = {
    categoryClassification: true,
    strongWeakPoints: true,
    statistics: true,
    financialAnalysis: true,
    top5Worst: true,
    adminObservation: true,
    adjustedFinancials: true,
    recommendations: true,
    visibilityGaps: true,
  };

  const savedSections = useMemo(() => {
    try {
      if (assessment.resultJson) {
        const parsed = JSON.parse(assessment.resultJson);
        if (parsed.visibleSections) return { ...defaultSections, ...parsed.visibleSections };
      }
    } catch {}
    return defaultSections;
  }, [assessment.resultJson]);

  const [visibleSections, setVisibleSections] = useState(savedSections);

  const toggleSection = (key: keyof typeof defaultSections) => {
    setVisibleSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sectionLabels: Record<keyof typeof defaultSections, { label: string; icon: React.ReactNode; desc: string }> = {
    categoryClassification: { label: 'Classificação por Categoria', icon: <BarChart3 className="w-4 h-4" />, desc: 'Badge individual (Avançado/Moderado/Atenção/Crítico) por categoria' },
    strongWeakPoints: { label: 'Ponto Forte & Ponto Crítico', icon: <TrendingUp className="w-4 h-4" />, desc: 'Categoria com melhor e pior desempenho' },
    statistics: { label: 'Estatísticas da Avaliação', icon: <Activity className="w-4 h-4" />, desc: 'Respondidas, sem informação, total, completude' },
    financialAnalysis: { label: 'Análise Financeira', icon: <DollarSign className="w-4 h-4" />, desc: 'Estimativa de desperdício e custos por item' },
    top5Worst: { label: 'Top 5 Pontos Críticos', icon: <ArrowDownRight className="w-4 h-4" />, desc: 'Piores perguntas com impacto e categoria' },
    adminObservation: { label: 'Observação do Especialista', icon: <HeartPulse className="w-4 h-4" />, desc: 'Texto personalizado escrito por você' },
    adjustedFinancials: { label: 'Dados Financeiros Ajustados', icon: <FileWarning className="w-4 h-4" />, desc: 'Economia, risco e prejuízo editados por você' },
    recommendations: { label: 'Recomendações Prioritárias', icon: <Target className="w-4 h-4" />, desc: 'Sugestões para as 2 categorias mais fracas' },
    visibilityGaps: { label: 'Lacunas de Visibilidade', icon: <AlertTriangle className="w-4 h-4" />, desc: 'Perguntas "Não possuo esta informação"' },
  };

  // Parse responses
  const responses: Record<string, number> = {};
  try {
    Object.assign(responses, JSON.parse(assessment.responses));
  } catch {}

  // Get label for answers
  const getAnswerLabel = (questionId: string, value: number) => {
    const q = checkupQuestions.find(q => q.id === questionId);
    if (!q) return `Valor: ${value}`;
    const opt = q.options.find(o => o.value === value);
    return opt ? opt.label : `Valor: ${value}`;
  };

  // Get impact text for a question+answer
  const getImpactText = (questionId: string, value: number) => {
    const q = checkupQuestions.find(q => q.id === questionId);
    if (!q) return null;
    const opt = q.options.find(o => o.value === value);
    return opt?.impact ?? null;
  };

  // Calculate category data with detailed info
  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catQuestions = checkupQuestions.filter(q => q.category === cat.key);
      let score = 0;
      let maxScore = 0;
      let answered = 0;
      let noInfo = 0;
      catQuestions.forEach(q => {
        const answer = responses[q.id];
        if (answer !== undefined) {
          if (answer > 0) {
            score += answer * q.weight;
            maxScore += 4 * q.weight;
            answered++;
          } else {
            noInfo++;
          }
        }
      });
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      return { ...cat, score, maxScore, percentage, answered, noInfo, totalQuestions: catQuestions.length };
    });
  }, [responses]);

  // Sort categories
  const sortedCategories = [...categoryData].sort((a, b) => a.percentage - b.percentage);
  const weakestCategory = sortedCategories[0];
  const strongestCategory = sortedCategories[sortedCategories.length - 1];

  // Classification
  const classification = getClassification(assessment.totalScore);

  // Response statistics
  const totalQuestions = checkupQuestions.length;
  const totalAnswered = Object.keys(responses).filter(k => responses[k] > 0).length;
  const totalNoInfo = Object.keys(responses).filter(k => responses[k] === 0).length;
  const totalNotAnswered = totalQuestions - totalAnswered - totalNoInfo;

  // Worst 5 questions (lowest score relative to max)
  const worstQuestions = useMemo(() => {
    return checkupQuestions
      .map(q => {
        const answer = responses[q.id];
        if (answer === undefined || answer === 0) return null; // skip no-info and unanswered
        const relativeScore = (answer * q.weight) / (4 * q.weight); // 0-1
        return { question: q, answer, relativeScore };
      })
      .filter(Boolean)
      .sort((a, b) => (a?.relativeScore ?? 0) - (b?.relativeScore ?? 0))
      .slice(0, 5) as { question: typeof checkupQuestions[0]; answer: number; relativeScore: number }[];
  }, [responses]);

  // Financial analysis from specific answers
  const financialAnalysis = useMemo(() => {
    const items: { questionId: string; questionLabel: string; answerLabel: string; impactText: string; costRange: string; answerValue: number }[] = [];

    Object.entries(FINANCIAL_QUESTIONS_COSTS).forEach(([qId, info]) => {
      const answer = responses[qId];
      if (answer === undefined || answer === 0) return;
      const q = checkupQuestions.find(q => q.id === qId);
      if (!q) return;
      const opt = q.options.find(o => o.value === answer);
      items.push({
        questionId: qId,
        questionLabel: info.label,
        answerLabel: opt?.label ?? `Valor: ${answer}`,
        impactText: opt?.impact ?? '',
        costRange: info.costMap[answer] ?? 'N/A',
        answerValue: answer,
      });
    });

    return items;
  }, [responses]);

  // Monthly waste estimate (conservative)
  const wasteEstimate = useMemo(() => {
    let minMonthly = 0;
    let maxMonthly = 0;

    // financeiro_6: Maintenance
    const maint = responses['financeiro_6'];
    if (maint === 1) { minMonthly += 10000; maxMonthly += 15000; }
    else if (maint === 2) { minMonthly += 5000; maxMonthly += 10000; }
    else if (maint === 3) { minMonthly += 1000; maxMonthly += 5000; }
    else if (maint === 4) { minMonthly += 0; maxMonthly += 1000; }

    // financeiro_10: Waste
    const waste = responses['financeiro_10'];
    if (waste === 1) { minMonthly += 5000; maxMonthly += 10000; }
    else if (waste === 2) { minMonthly += 2000; maxMonthly += 5000; }
    else if (waste === 3) { minMonthly += 500; maxMonthly += 2000; }
    else if (waste === 4) { minMonthly += 0; maxMonthly += 500; }

    // financeiro_3: Reprocessing (annual / 12)
    const reproc = responses['financeiro_3'];
    if (reproc === 1) { minMonthly += 1250; maxMonthly += 4167; }
    else if (reproc === 2) { minMonthly += 667; maxMonthly += 1250; }
    else if (reproc === 3) { minMonthly += 167; maxMonthly += 667; }
    else if (reproc === 4) { minMonthly += 0; maxMonthly += 167; }

    // financeiro_4: Lost instruments (annual / 12)
    const lost = responses['financeiro_4'];
    if (lost === 1) { minMonthly += 2500; maxMonthly += 8333; }
    else if (lost === 2) { minMonthly += 1000; maxMonthly += 2500; }
    else if (lost === 3) { minMonthly += 250; maxMonthly += 1000; }
    else if (lost === 4) { minMonthly += 0; maxMonthly += 250; }

    return { minMonthly, maxMonthly, minAnnual: minMonthly * 12, maxAnnual: maxMonthly * 12 };
  }, [responses]);

  // Visibility gaps (answers = 0)
  const visibilityGaps = useMemo(() => {
    const gaps: { questionId: string; question: string; category: string; categoryLabel: string }[] = [];
    Object.entries(responses).forEach(([qId, val]) => {
      if (val === 0) {
        const q = checkupQuestions.find(q => q.id === qId);
        if (q) {
          const catInfo = CATEGORIES.find(c => c.key === q.category);
          gaps.push({
            questionId: qId,
            question: q.question,
            category: q.category,
            categoryLabel: catInfo?.label ?? q.category,
          });
        }
      }
    });
    return gaps;
  }, [responses]);

  // All answers with impacts
  const allAnswersWithImpact = useMemo(() => {
    return checkupQuestions.map(q => {
      const answer = responses[q.id];
      if (answer === undefined) return null;
      const opt = q.options.find(o => o.value === answer);
      const catInfo = CATEGORIES.find(c => c.key === q.category);
      return {
        question: q,
        answer,
        label: opt?.label ?? `Valor: ${answer}`,
        impact: opt?.impact ?? '',
        categoryLabel: catInfo?.label ?? '',
        categoryColor: catInfo?.color ?? '#666',
        noInfo: answer === 0,
      };
    }).filter(Boolean);
  }, [responses]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/assessment/${assessment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminObservation: observation,
          economyMinEdited: economyMin ? parseFloat(economyMin) : null,
          economyMaxEdited: economyMax ? parseFloat(economyMax) : null,
          financialRiskLevelEdited: riskLevel || null,
          financialLossEdited: estimatedLoss || null,
          visibleSections,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const [releaseError, setReleaseError] = useState('');

  const handleRelease = async () => {
    setReleaseLoading(true);
    setReleaseError('');
    try {
      const res = await fetch(`/api/assessment/${assessment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminObservation: observation,
          economyMinEdited: economyMin ? parseFloat(economyMin) : null,
          economyMaxEdited: economyMax ? parseFloat(economyMax) : null,
          financialRiskLevelEdited: riskLevel || null,
          financialLossEdited: estimatedLoss || null,
          status: 'released',
          visibleSections,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setReleaseError(errData.error || 'Erro ao liberar resultado');
        setReleaseLoading(false);
        return;
      }

      // Small delay to ensure DB is updated before refresh
      await new Promise(r => setTimeout(r, 500));
      onBack(); // Refresh
    } catch (err) {
      console.error(err);
      setReleaseError('Erro de conexão ao liberar resultado');
    }
    setReleaseLoading(false);
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/#${assessment.id}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stateLabel = (() => {
    for (const r of REGIONS) {
      const s = r.states.find(st => st.id === assessment.state);
      if (s) return `${r.label} - ${s.label}`;
    }
    return assessment.state;
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{assessment.name}</h1>
            <p className="text-sm text-muted-foreground">{assessment.email} • {formatDate(assessment.createdAt)}</p>
          </div>
          {getStatusBadge(assessment.status)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ===== OVERVIEW: Classification + Stats ===== */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Overall Score Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 pb-6 flex flex-col items-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={classification === 'Avançado' ? '#059669' : classification === 'Moderado' ? '#D97706' : classification === 'Atenção' ? '#EA580C' : '#DC2626'}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(assessment.totalScore / 100) * 314} 314`}
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{Math.round(assessment.totalScore)}%</span>
                  <span className="text-xs text-muted-foreground">Nota Geral</span>
                </div>
              </div>
              <div className={`mt-3 px-4 py-1.5 rounded-full border-2 font-bold text-sm flex items-center gap-1.5 ${getClassificationBg(classification)} ${getClassificationColor(classification)}`}>
                {getClassificationIcon(classification)}
                {classification}
              </div>
            </CardContent>
          </Card>

          {/* Category Classification Cards */}
          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                Classificação por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {categoryData.map(cat => {
                  const catClass = getClassification(cat.percentage);
                  return (
                    <div key={cat.key} className="p-4 rounded-xl border bg-white" style={{ borderColor: cat.color + '30' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cat.icon}</span>
                          <span className="font-semibold text-sm">{cat.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-700">{Math.round(cat.percentage)}%</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getClassificationBg(catClass)} ${getClassificationColor(catClass)}`}>
                            {getClassificationIcon(catClass)}
                            {catClass}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                        />
                      </div>
                      <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                        <span>{cat.answered} respondidas</span>
                        <span>{cat.noInfo > 0 ? `${cat.noInfo} sem informação` : ''}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strongest & Weakest */}
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">Ponto Forte: {strongestCategory.label}</span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">
                    {Math.round(strongestCategory.percentage)}% — {getClassification(strongestCategory.percentage)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 text-red-700">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-bold">Ponto Crítico: {weakestCategory.label}</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    {Math.round(weakestCategory.percentage)}% — {getClassification(weakestCategory.percentage)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== STATISTICS BAR ===== */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-5 pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalAnswered}</p>
                <p className="text-xs text-muted-foreground">Respondidas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{totalNoInfo}</p>
                <p className="text-xs text-muted-foreground">Sem Informação</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{totalNotAnswered}</p>
                <p className="text-xs text-muted-foreground">Não Respondidas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Total de Perguntas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== FINANCIAL ANALYSIS ===== */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
              <DollarSign className="w-5 h-5" />
              Análise Financeira Detalhada
            </CardTitle>
            <CardDescription>Impactos financeiros identificados com base nas respostas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Waste Estimate */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-bold text-red-800">Estimativa de Desperdício Mensal</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground">Mínimo/mês</p>
                  <p className="text-lg font-bold text-red-600">
                    R$ {wasteEstimate.minMonthly.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground">Máximo/mês</p>
                  <p className="text-lg font-bold text-red-700">
                    R$ {wasteEstimate.maxMonthly.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground">Mínimo/ano</p>
                  <p className="text-lg font-bold text-red-800">
                    R$ {wasteEstimate.minAnnual.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground">Máximo/ano</p>
                  <p className="text-lg font-bold text-red-900">
                    R$ {wasteEstimate.maxAnnual.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Items Detail */}
            <div className="space-y-3">
              {financialAnalysis.map(item => (
                <div key={item.questionId} className="p-4 rounded-xl border bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">{item.questionLabel}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getScoreColor(item.answerValue * 25)}`}>
                          {item.answerValue}/4
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Resposta: <span className="font-medium text-gray-700">{item.answerLabel}</span></p>
                      <p className="text-sm text-red-600 mt-1 font-medium">{item.impactText}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground mb-1">Custo Estimado</p>
                      <p className="text-sm font-bold text-red-700">{item.costRange}</p>
                    </div>
                  </div>
                </div>
              ))}

              {financialAnalysis.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma resposta financeira disponível para análise.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ===== WORST 5 QUESTIONS ===== */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-800">
              <ArrowDownRight className="w-5 h-5" />
              Top 5 Piores Perguntas
            </CardTitle>
            <CardDescription>Perguntas com menor pontuação relativa — oportunidades prioritárias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {worstQuestions.map((item, idx) => {
                const opt = item.question.options.find(o => o.value === item.answer);
                const catInfo = CATEGORIES.find(c => c.key === item.question.category);
                const pct = Math.round(item.relativeScore * 100);
                return (
                  <div key={item.question.id} className="p-4 rounded-xl border bg-white">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${idx < 2 ? 'bg-red-500' : idx < 4 ? 'bg-amber-500' : 'bg-orange-400'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.question.question}</p>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mt-1" style={{ backgroundColor: (catInfo?.color ?? '#666') + '15', color: catInfo?.color }}>
                              {catInfo?.icon} {catInfo?.label}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${getScoreColor(pct)}`}>
                            {pct}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Resposta: <span className="font-medium text-gray-700">{opt?.label ?? `Valor: ${item.answer}`}</span>
                        </p>
                        {opt?.impact && (
                          <p className="text-sm text-red-600 mt-1 font-medium">{opt.impact}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ===== TOP 5 BEST QUESTIONS ===== */}
        {(() => {
          const bestQuestions = checkupQuestions
            .map(q => {
              const answer = responses[q.id];
              if (answer === undefined || answer === 0) return null;
              const relativeScore = (answer * q.weight) / (4 * q.weight);
              return { question: q, answer, relativeScore };
            })
            .filter(Boolean)
            .sort((a, b) => (b?.relativeScore ?? 0) - (a?.relativeScore ?? 0))
            .slice(0, 5) as { question: typeof checkupQuestions[0]; answer: number; relativeScore: number }[];

          return (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
                  <ArrowUpRight className="w-5 h-5" />
                  Top 5 Melhores Perguntas
                </CardTitle>
                <CardDescription>Pontos de excelência — confirmar com o cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bestQuestions.map((item, idx) => {
                    const opt = item.question.options.find(o => o.value === item.answer);
                    const catInfo = CATEGORIES.find(c => c.key === item.question.category);
                    const pct = Math.round(item.relativeScore * 100);
                    return (
                      <div key={item.question.id} className="p-4 rounded-xl border bg-white">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${idx < 2 ? 'bg-emerald-500' : 'bg-teal-500'}`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{item.question.question}</p>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mt-1" style={{ backgroundColor: (catInfo?.color ?? '#666') + '15', color: catInfo?.color }}>
                                  {catInfo?.icon} {catInfo?.label}
                                </span>
                              </div>
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${getScoreColor(pct)}`}>
                                {pct}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Resposta: <span className="font-medium text-gray-700">{opt?.label ?? `Valor: ${item.answer}`}</span>
                            </p>
                            {opt?.impact && (
                              <p className="text-sm text-emerald-600 mt-1 font-medium">{opt.impact}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* ===== VISIBILITY GAPS ===== */}
        {visibilityGaps.length > 0 && (
          <Card className="border-0 shadow-lg border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                <FileWarning className="w-5 h-5" />
                Lacunas de Visibilidade ({visibilityGaps.length})
              </CardTitle>
              <CardDescription>Perguntas marcadas como &quot;Não possuo esta informação&quot; — gaps críticos de governança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {visibilityGaps.map((gap, i) => {
                  const catInfo = CATEGORIES.find(c => c.key === gap.category);
                  return (
                    <div key={gap.questionId} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100">
                      <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 text-amber-800">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{gap.question}</p>
                        <span className="text-xs text-muted-foreground">{catInfo?.icon} {gap.categoryLabel}</span>
                      </div>
                      <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 shrink-0">Sem Info</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== ALL RESPONSES WITH IMPACTS ===== */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Todas as Respostas com Impacto
            </CardTitle>
            <CardDescription>Visualização completa de todas as {totalQuestions} perguntas com os impactos de cada resposta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {allAnswersWithImpact.map((item, idx) => {
                if (!item) return null;
                return (
                  <div key={item.question.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: item.categoryColor }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">{item.question.question}</p>
                        {item.noInfo && (
                          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 shrink-0">Sem Info</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.label}
                      </p>
                      {item.impact && (
                        <p className={`text-xs mt-1 font-medium ${item.noInfo ? 'text-amber-600' : item.answer >= 3 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {item.noInfo && '⚠️ '}{item.impact}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ===== REGISTRATION + ADMIN CONTROLS ===== */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Registration Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Cadastro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nome</p>
                    <p className="font-medium">{assessment.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cargo</p>
                    <p className="font-medium">{assessment.position}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefone</p>
                    <p className="font-medium">{assessment.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{assessment.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tipo de Estabelecimento</p>
                    <p className="font-medium">{getEstablishmentLabel(assessment.establishmentType)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Leitos</p>
                    <p className="font-medium">{BED_COUNT_OPTIONS.find(o => o.id === assessment.bedCount)?.label ?? assessment.bedCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profissionais CME</p>
                    <p className="font-medium">{CME_PROFESSIONALS_OPTIONS.find(o => o.id === assessment.cmeProfessionals)?.label ?? assessment.cmeProfessionals}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Localização</p>
                    <p className="font-medium">{stateLabel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Admin Controls */}
          <div className="space-y-6">
            {/* Admin Observation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observação do Admin</CardTitle>
                <CardDescription>Nota interna (será enviada ao usuário junto com o resultado)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Adicione suas observações sobre esta avaliação..."
                  rows={4}
                />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Valores Editáveis (sobrescrevem o cálculo)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Economia Mín. (%)</Label>
                      <Input
                        type="number"
                        value={economyMin}
                        onChange={(e) => setEconomyMin(e.target.value)}
                        placeholder="Ex: 15"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Economia Máx. (%)</Label>
                      <Input
                        type="number"
                        value={economyMax}
                        onChange={(e) => setEconomyMax(e.target.value)}
                        placeholder="Ex: 30"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Nível de Risco Financeiro</Label>
                    <Input
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(e.target.value)}
                      placeholder="Ex: Alto, Moderado, Crítico"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Prejuízo Estimado</Label>
                    <Input
                      value={estimatedLoss}
                      onChange={(e) => setEstimatedLoss(e.target.value)}
                      placeholder="Ex: R$ 50.000 - R$ 150.000/ano"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} variant="outline" className="w-full" disabled={saving}>
                  {saved ? <><Check className="w-4 h-4 mr-1" /> Salvo!</> : 'Salvar alterações'}
                </Button>
              </CardContent>
            </Card>

            {/* ===== SEÇÃO: O QUE LIBERAR PARA O CLIENTE ===== */}
            <Card className="border-indigo-200 bg-indigo-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-800">
                  <Shield className="w-5 h-5" />
                  O que liberar para o cliente
                </CardTitle>
                <CardDescription>
                  Ative ou desative cada seção. Somente as marcadas serão visíveis no resultado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(sectionLabels).map(([key, info]) => {
                  const k = key as keyof typeof defaultSections;
                  const isOn = visibleSections[k];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleSection(k)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isOn ? 'bg-white border-indigo-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOn ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-400'}`}>
                        {info.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isOn ? 'text-gray-900' : 'text-gray-500'}`}>{info.label}</p>
                        <p className="text-xs text-muted-foreground">{info.desc}</p>
                      </div>
                      <div className={`w-10 h-6 rounded-full transition-colors shrink-0 relative ${isOn ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${isOn ? 'left-5' : 'left-1'}`} />
                      </div>
                    </button>
                  );
                })}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setVisibleSections(Object.keys(defaultSections).reduce((acc, k) => ({ ...acc, [k]: true }), {} as typeof defaultSections))}
                  >
                    Ativar Todas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setVisibleSections(Object.keys(defaultSections).reduce((acc, k) => ({ ...acc, [k]: false }), {} as typeof defaultSections))}
                  >
                    Desativar Todas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Release Actions */}
            <Card className="border-teal-200 bg-teal-50/50">
              <CardHeader>
                <CardTitle className="text-lg text-teal-800">Liberar Resultado</CardTitle>
                <CardDescription>
                  Ao liberar, o usuário poderá acessar o resultado pelo link único abaixo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assessment.status === 'released' || assessment.status === 'sent' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                      <input
                        readOnly
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/resultado/${assessment.id}`}
                        className="flex-1 bg-transparent text-sm outline-none min-w-0"
                      />
                      <Button variant="outline" size="sm" onClick={copyLink}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    {assessment.releasedAt && (
                      <p className="text-xs text-muted-foreground">
                        Liberado em: {formatDate(assessment.releasedAt)}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={handleRelease}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                      disabled={releaseLoading}
                    >
                      {releaseLoading ? 'Liberando...' : 'LIBERAR RESULTADO'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {releaseError && (
                      <p className="text-xs text-red-600 text-center mt-2 font-medium">{releaseError}</p>
                    )}
                    <p className="text-xs text-muted-foreground text-center">
                      Ao liberar, um link único será gerado para o usuário acessar o resultado.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================
// Main Admin Page
// ============================
export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    try {
      const res = await fetch('/api/assessments');
      const data = await res.json();
      setAssessments(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/assessments');
        const data = await res.json();
        if (!cancelled) setAssessments(data);
      } catch (err) {
        console.error(err);
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  if (loading || refreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{refreshing ? 'Atualizando...' : 'Carregando...'}</p>
      </div>
    );
  }

  if (selectedId) {
    const assessment = assessments.find(a => a.id === selectedId);
    if (!assessment) {
      setSelectedId(null);
      return null;
    }
    return (
      <DetailView
        assessment={assessment}
        onBack={async () => {
          setRefreshing(true);
          await fetchAssessments();
          setSelectedId(null);
          setRefreshing(false);
        }}
      />
    );
  }

  return (
    <Dashboard
      assessments={assessments}
      onViewDetail={setSelectedId}
      onLogout={() => { setIsLoggedIn(false); onBack(); }}
    />
  );
}
