'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Eye, Copy, Check, Search, Filter,
  Lock, ChevronLeft, Users, AlertTriangle, Send,
  ArrowRight, HeartPulse, BarChart3
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
} from '@/lib/types';
import { checkupQuestions } from '@/lib/checkup-questions';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-teal-600" />
            <h1 className="text-lg font-bold text-gray-900">Painel Admin - CME Inteligente</h1>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <Lock className="w-4 h-4 mr-1" />
            Sair
          </Button>
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

  // Calculate category data
  const categoryData = CATEGORIES.map(cat => {
    const catQuestions = checkupQuestions.filter(q => q.category === cat.key);
    let score = 0;
    let maxScore = 0;
    catQuestions.forEach(q => {
      const answer = responses[q.id];
      if (answer !== undefined && answer > 0) {
        score += answer * q.weight;
        maxScore += 4 * q.weight;
      }
    });
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return { ...cat, score, maxScore, percentage };
  });

  const classification = getClassification(assessment.totalScore);

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
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleRelease = async () => {
    setReleaseLoading(true);
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
          status: 'released',
        }),
      });
      onBack(); // Refresh
    } catch (err) {
      console.error(err);
    }
    setReleaseLoading(false);
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/resultado/${assessment.id}`;
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
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Registration & Responses */}
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

            {/* Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  Pontuação por Categoria
                </CardTitle>
                <CardDescription>
                  Classificação geral: <span className={`font-bold ${getClassificationColor(classification)}`}>{classification}</span> ({Math.round(assessment.totalScore)}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {categoryData.map(cat => {
                    const catClass = getClassification(cat.percentage);
                    return (
                      <div key={cat.key} className="p-4 rounded-xl border" style={{ borderColor: cat.color + '40' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="font-medium text-sm">{cat.label}</span>
                          </div>
                          <span className={`text-sm font-bold ${getClassificationColor(catClass)}`}>
                            {Math.round(cat.percentage)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${getClassificationColor(catClass)}`}>{catClass}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Respostas do Questionário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {checkupQuestions.map((q, idx) => {
                    const answer = responses[q.id];
                    const catInfo = CATEGORIES.find(c => c.key === q.category);
                    return (
                      <div key={q.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: catInfo?.color ?? '#666' }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{q.question}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {answer !== undefined ? getAnswerLabel(q.id, answer) : 'Não respondida'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
                      placeholder="Ex: Alto, Médio, Baixo"
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
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
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
        onBack={() => { setSelectedId(null); fetchAssessments(); }}
      />
    );
  }

  return (
    <Dashboard
      assessments={assessments}
      onViewDetail={setSelectedId}
      onLogout={() => setIsLoggedIn(false)}
    />
  );
}
