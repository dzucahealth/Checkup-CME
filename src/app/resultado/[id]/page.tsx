'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield, FileText, Target, Download, BarChart3,
  HeartPulse, AlertTriangle, TrendingDown, TrendingUp,
  AlertCircle, DollarSign, ArrowDownRight, ArrowUpRight,
  ShieldAlert, Activity, Minus, Lock, MinusCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CATEGORIES, ESTABLISHMENT_TYPES, BED_COUNT_OPTIONS,
  CME_PROFESSIONALS_OPTIONS, REGIONS, CategoryKey,
  getClassification, getClassificationColor, getClassificationBg,
} from '@/lib/types';
import { checkupQuestions } from '@/lib/checkup-questions';
import { useParams } from 'next/navigation';

// ============================
// Default visible sections
// ============================
const DEFAULT_SECTIONS = {
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

type SectionKey = keyof typeof DEFAULT_SECTIONS;

// ============================
// Circular Progress Component
// ============================
function CircularProgress({ percentage, size = 180, strokeWidth = 12, label }: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 80 ? '#059669' : percentage >= 60 ? '#0D9488' : percentage >= 40 ? '#D97706' : '#DC2626';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="circular-progress" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="oklch(0.93 0.025 165)" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{Math.round(percentage)}%</span>
          {label && <span className="text-xs text-muted-foreground mt-1">{label}</span>}
        </div>
      </div>
    </div>
  );
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

// ============================
// Not Available Screen
// ============================
function NotAvailableScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Resultado ainda não disponível</h1>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Seu resultado está sendo analisado por nosso especialista. Você receberá um link por email assim que estiver disponível.
        </p>
        <div className="bg-white rounded-xl p-6 border shadow-sm space-y-3">
          <p className="text-sm font-semibold text-gray-900">Dúvidas? Entre em contato:</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📧 CMEINTELIGENTE@GMAIL.COM</p>
            <p>📱 (11) 9.99661-0399</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================
// Loading Screen
// ============================
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full" />
      <p className="text-muted-foreground mt-4">Carregando resultado...</p>
    </div>
  );
}

// ============================
// Results Screen (from DB data)
// ============================
interface AssessmentData {
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

// Financial question cost mapping
const FINANCIAL_COSTS: Record<string, Record<number, string>> = {
  financeiro_2: { 1: 'R$ 80.000 - R$ 200.000/ano', 2: 'R$ 40.000 - R$ 80.000/ano', 3: 'R$ 5.000 - R$ 40.000/ano', 4: 'Sem custo identificado' },
  financeiro_3: { 1: 'R$ 15.000 - R$ 50.000/ano', 2: 'R$ 8.000 - R$ 15.000/ano', 3: 'R$ 2.000 - R$ 8.000/ano', 4: 'Abaixo de R$ 2.000/ano' },
  financeiro_4: { 1: 'R$ 30.000 - R$ 100.000/ano', 2: 'R$ 12.000 - R$ 30.000/ano', 3: 'R$ 3.000 - R$ 12.000/ano', 4: 'Abaixo de R$ 3.000/ano' },
  financeiro_6: { 1: 'Acima de R$ 10.000/mês', 2: 'R$ 5.000 - R$ 10.000/mês', 3: 'R$ 1.000 - R$ 5.000/mês', 4: 'Abaixo de R$ 1.000/mês' },
  financeiro_8: { 1: 'Risco alto: perda de cirurgiões', 2: 'Risco moderado', 3: 'Risco baixo', 4: 'Sem risco identificado' },
  financeiro_10: { 1: 'Acima de R$ 5.000/mês', 2: 'R$ 2.000 - R$ 5.000/mês', 3: 'R$ 500 - R$ 2.000/mês', 4: 'Abaixo de R$ 500/mês' },
};

const FINANCIAL_LABELS: Record<string, string> = {
  financeiro_2: 'Cancelamentos de Cirurgia',
  financeiro_3: 'Reprocessamentos',
  financeiro_4: 'Perdas de Instrumentais',
  financeiro_6: 'Manutenção Corretiva',
  financeiro_8: 'Reclamações de Cirurgiões',
  financeiro_10: 'Desperdício de Insumos',
};

function ResultsView({ data }: { data: AssessmentData }) {
  const classification = getClassification(data.totalScore);
  const classColor = getClassificationColor(classification);
  const classBg = getClassificationBg(classification);

  // Parse visible sections from resultJson
  const sections: Record<SectionKey, boolean> = useMemo(() => {
    try {
      if (data.resultJson) {
        const parsed = JSON.parse(data.resultJson);
        if (parsed.visibleSections) return { ...DEFAULT_SECTIONS, ...parsed.visibleSections };
      }
    } catch {}
    return DEFAULT_SECTIONS;
  }, [data.resultJson]);

  // Parse responses
  const responses: Record<string, number> = {};
  try { Object.assign(responses, JSON.parse(data.responses)); } catch {}

  // Category data
  const categoryScores = [
    { category: 'gestao' as CategoryKey, label: 'Gestão', percentage: data.managementScore ?? 0 },
    { category: 'processo' as CategoryKey, label: 'Processo', percentage: data.processScore ?? 0 },
    { category: 'tecnologia' as CategoryKey, label: 'Tecnologia', percentage: data.technologyScore ?? 0 },
    { category: 'financeiro' as CategoryKey, label: 'Financeiro e Riscos', percentage: data.financialScore ?? 0 },
  ];

  const sortedCategories = [...categoryScores].sort((a, b) => a.percentage - b.percentage);
  const weakestCategories = sortedCategories.slice(0, 2);
  const weakestCategory = sortedCategories[0];
  const strongestCategory = sortedCategories[sortedCategories.length - 1];

  // Recommendations
  const recommendations: Record<CategoryKey, string> = {
    gestao: 'Fortaleça a liderança com capacitação gerencial, implemente reuniões periódicas de acompanhamento de KPIs, e estruture um programa formal de gestão de riscos e planejamento estratégico para o CME.',
    processo: 'Revise e atualize POPs, fortaleça o programa de monitoramento com Indicador Biológico (IB) e Indicador Químico (IQ), implante auditorias internas sistemáticas, e padronize o fluxo de rastreabilidade de materiais em todas as etapas.',
    tecnologia: 'Invista em sistemas de gestão informatizados, implemente monitoramento digital em tempo real, estabeleça programa de manutenção preventiva calibrada, e avalie oportunidades de automação de processos repetitivos.',
    financeiro: 'Implemente controle detalhado de custos por categoria, realize análises de ROI antes de investimentos, otimize contratos com fornecedores, e crie um plano de redução de desperdícios com metas mensuráveis.',
  };

  // Visibility gaps
  const visibilityGaps: string[] = [];
  Object.entries(responses).forEach(([qId, val]) => {
    if (val === 0) {
      const q = checkupQuestions.find(q => q.id === qId);
      if (q) visibilityGaps.push(q.question);
    }
  });

  // Stats
  const totalQuestions = checkupQuestions.length;
  const totalAnswered = Object.keys(responses).filter(k => responses[k] > 0).length;
  const totalNoInfo = Object.keys(responses).filter(k => responses[k] === 0).length;

  // Worst 5 questions
  const worstQuestions = useMemo(() => {
    return checkupQuestions
      .map(q => {
        const answer = responses[q.id];
        if (answer === undefined || answer === 0) return null;
        return { question: q, answer, relativeScore: answer / 4 };
      })
      .filter(Boolean)
      .sort((a, b) => (a?.relativeScore ?? 0) - (b?.relativeScore ?? 0))
      .slice(0, 5) as { question: typeof checkupQuestions[0]; answer: number; relativeScore: number }[];
  }, [responses]);

  // Financial analysis items
  const financialItems = useMemo(() => {
    const items: { label: string; answerLabel: string; impactText: string; costRange: string; answerValue: number }[] = [];
    Object.entries(FINANCIAL_LABELS).forEach(([qId, label]) => {
      const answer = responses[qId];
      if (answer === undefined || answer === 0) return;
      const q = checkupQuestions.find(q => q.id === qId);
      if (!q) return;
      const opt = q.options.find(o => o.value === answer);
      items.push({
        label,
        answerLabel: opt?.label ?? `Valor: ${answer}`,
        impactText: opt?.impact ?? '',
        costRange: FINANCIAL_COSTS[qId]?.[answer] ?? 'N/A',
        answerValue: answer,
      });
    });
    return items;
  }, [responses]);

  // Waste estimate
  const wasteEstimate = useMemo(() => {
    let minMonthly = 0; let maxMonthly = 0;
    const maint = responses['financeiro_6'];
    if (maint === 1) { minMonthly += 10000; maxMonthly += 15000; }
    else if (maint === 2) { minMonthly += 5000; maxMonthly += 10000; }
    else if (maint === 3) { minMonthly += 1000; maxMonthly += 5000; }
    else if (maint === 4) { maxMonthly += 1000; }
    const waste = responses['financeiro_10'];
    if (waste === 1) { minMonthly += 5000; maxMonthly += 10000; }
    else if (waste === 2) { minMonthly += 2000; maxMonthly += 5000; }
    else if (waste === 3) { minMonthly += 500; maxMonthly += 2000; }
    else if (waste === 4) { maxMonthly += 500; }
    const reproc = responses['financeiro_3'];
    if (reproc === 1) { minMonthly += 1250; maxMonthly += 4167; }
    else if (reproc === 2) { minMonthly += 667; maxMonthly += 1250; }
    else if (reproc === 3) { minMonthly += 167; maxMonthly += 667; }
    else if (reproc === 4) { maxMonthly += 167; }
    const lost = responses['financeiro_4'];
    if (lost === 1) { minMonthly += 2500; maxMonthly += 8333; }
    else if (lost === 2) { minMonthly += 1000; maxMonthly += 2500; }
    else if (lost === 3) { minMonthly += 250; maxMonthly += 1000; }
    else if (lost === 4) { maxMonthly += 250; }
    return { minMonthly, maxMonthly, minAnnual: minMonthly * 12, maxAnnual: maxMonthly * 12 };
  }, [responses]);

  const stateLabel = (() => {
    for (const r of REGIONS) {
      const s = r.states.find(st => st.id === data.state);
      if (s) return `${r.label} - ${s.label}`;
    }
    return data.state;
  })();

  const handleDownload = () => {
    const categoryLines = categoryScores.map(cs => `  • ${cs.label}: ${cs.percentage.toFixed(1)}%`).join('\n');
    const recommendationLines = weakestCategories.map(cs => `\n📌 ${cs.label} (prioridade):\n${recommendations[cs.category]}`).join('\n');
    const adminNote = (sections.adminObservation && data.adminObservation) ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOBSERVAÇÃO DO ESPECIALISTA\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.adminObservation}\n` : '';
    const financialNote = (sections.adjustedFinancials && (data.economyMinEdited || data.economyMaxEdited || data.financialRiskLevelEdited || data.financialLossEdited))
      ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDADOS FINANCEIROS (Ajustados pelo especialista)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.economyMinEdited ? `Economia mínima estimada: ${data.economyMinEdited}%\n` : ''}${data.economyMaxEdited ? `Economia máxima estimada: ${data.economyMaxEdited}%\n` : ''}${data.financialRiskLevelEdited ? `Nível de risco financeiro: ${data.financialRiskLevelEdited}\n` : ''}${data.financialLossEdited ? `Prejuízo estimado: ${data.financialLossEdited}\n` : ''}`
      : '';

    const report = `
═══════════════════════════════════════════════════════════
           CHECKUP CME INTELIGENTE - DIAGNÓSTICO
═══════════════════════════════════════════════════════════

Data: ${new Date().toLocaleDateString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DO AVALIADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nome: ${data.name}
Cargo: ${data.position}
Telefone: ${data.phone}
Email: ${data.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DA INSTITUIÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tipo: ${ESTABLISHMENT_TYPES.find(t => t.id === data.establishmentType)?.label || data.establishmentType}
Leitos: ${BED_COUNT_OPTIONS.find(b => b.id === data.bedCount)?.label || data.bedCount}
Profissionais CME: ${CME_PROFESSIONALS_OPTIONS.find(p => p.id === data.cmeProfessionals)?.label || data.cmeProfessionals}
Localização: ${stateLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO GERAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pontuação Total: ${data.totalScore.toFixed(1)}%
Classificação: ${classification}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PONTUAÇÃO POR CATEGORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${categoryLines}
${recommendationLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LACUNAS DE VISIBILIDADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${visibilityGaps.length > 0 ? visibilityGaps.map((g, i) => `  ${i + 1}. ${g}`).join('\n') : '  Nenhuma lacuna de visibilidade identificada.'}
${adminNote}${financialNote}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este relatório é de caráter exclusivamente diagnóstico e orientativo.
Não substitui auditorias regulatórias oficiais.

═══════════════════════════════════════════════════════════
          Checkup CME Inteligente © ${new Date().getFullYear()}
═══════════════════════════════════════════════════════════
`.trim();

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checkup-cme-${data.establishmentType}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="medical-gradient text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Diagnóstico do Checkup</h1>
          <p className="text-white/80">
            {data.name}
            {data.position && <span> — {data.position}</span>}
          </p>
          <p className="text-white/60 text-sm mt-1">
            {ESTABLISHMENT_TYPES.find(t => t.id === data.establishmentType)?.label}
            {' — '}
            {stateLabel}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 -mt-6 relative z-10 pb-16 space-y-6">

        {/* ===== PERSONALIZED INTRO MESSAGE ===== */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-cme-inteligente.png" alt="CME Inteligente" className="h-10 sm:h-12 object-contain brightness-0 invert" />
              <span className="text-white/80 text-sm font-medium hidden sm:block">Check-up CME Inteligente</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-semibold">Klever Oliveira Lopes</p>
                <p className="text-white/70 text-xs">Especialista em CME</p>
              </div>
              <img src="/klever-lopes-2.jpg" alt="Klever Oliveira Lopes" className="w-12 h-12 rounded-full border-2 border-white/30 object-cover shadow-md" />
            </div>
          </div>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Foto grande do Klever */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <img
                  src="/klever-lopes-2.jpg"
                  alt="Klever Oliveira Lopes"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-teal-100 object-cover shadow-lg"
                />
                <p className="text-xs font-semibold text-teal-700 text-center">Klever Oliveira Lopes</p>
                <p className="text-[10px] text-muted-foreground text-center">Especialista em CME</p>
              </div>
              {/* Texto da mensagem */}
              <div className="flex-1 space-y-4 text-gray-700 leading-relaxed">
                <p className="text-base font-medium text-gray-900">
                  Foi muito importante ter você comigo nesta jornada do Check-up CME INTELIGENTE.
                </p>
                <p className="text-sm">
                  Espero que essa experiência tenha ajudado você a olhar para a sua CME com mais clareza, mais atenção e mais senso estratégico. A partir das respostas que você compartilhou, foi possível identificar percepções relevantes sobre a sua operação e sinalizar pontos que merecem atenção, fortalecimento e evolução.
                </p>
                <p className="text-sm">
                  Esta devolutiva representa uma leitura inicial do seu cenário, construída com base nas informações apresentadas ao longo do check-up. Ela não substitui uma análise técnica aprofundada, mas oferece um ponto de partida importante para apoiar suas reflexões, decisões e próximos passos.
                </p>
                <p className="text-sm">
                  Muitas vezes, identificar oportunidades de melhoria já é um grande avanço. Mas transformar essa percepção em um plano de ação mais consistente, em um diagnóstico mais robusto ou em uma proposta estruturada para apresentação à diretoria exige aprofundamento técnico e direcionamento estratégico.
                </p>
                <p className="text-sm">
                  Se você quiser avançar nessa próxima etapa, agende uma conversa comigo.
                  <br />
                  <span className="font-semibold text-teal-700">Terei prazer em ajudar você a aprofundar essa análise, esclarecer os pontos identificados no check-up e construir uma visão ainda mais completa da sua CME.</span>
                </p>
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground text-center sm:text-left font-medium">
                    Logo abaixo, você poderá visualizar o seu relatório.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score — ALWAYS VISIBLE */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-8 pb-8 flex flex-col items-center">
            <CircularProgress percentage={data.totalScore} size={200} strokeWidth={14} label="Nota Geral" />
            <div className={`mt-4 px-6 py-2 rounded-full border-2 font-bold text-lg flex items-center gap-2 ${classBg} ${classColor}`}>
              {getClassificationIcon(classification)}
              {classification}
            </div>
            <p className="text-sm text-muted-foreground mt-3 text-center max-w-md">
              {classification === 'Avançado' && 'Sua CME apresenta um bom nível de maturidade, porém sempre existem oportunidades de otimização. Custo baixo nem sempre significa eficiência — pode indicar subinvestimento em monitoramento, manutenção, rastreabilidade e qualidade.'}
              {classification === 'Moderado' && 'Sua CME necessita de melhorias em diversas áreas. Recomendamos um plano de ação prioritário com foco em economia e segurança.'}
              {classification === 'Atenção' && 'Sua CME apresenta deficiências significativas que necessitam de atenção imediata. Riscos financeiros e operacionais identificados.'}
              {classification === 'Crítico' && 'Sua CME apresenta deficiências críticas que exigem intervenção urgente. Recomendamos suporte especializado imediato.'}
            </p>
          </CardContent>
        </Card>

        {/* ===== CATEGORY CLASSIFICATION ===== */}
        {sections.categoryClassification && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                Classificação por Categoria
              </CardTitle>
              <CardDescription>Desempenho detalhado por área de avaliação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryScores.map((cs) => {
                const catInfo = CATEGORIES.find(c => c.key === cs.category)!;
                const catClass = getClassification(cs.percentage);
                const barColor = cs.percentage >= 80 ? 'bg-emerald-500' : cs.percentage >= 60 ? 'bg-teal-500' : cs.percentage >= 40 ? 'bg-amber-500' : 'bg-red-500';
                return (
                  <div key={cs.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{catInfo.icon}</span>
                        <span className="font-medium text-sm">{cs.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${getClassificationColor(catClass)}`}>{cs.percentage.toFixed(1)}%</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getClassificationBg(catClass)} ${getClassificationColor(catClass)}`}>
                          {getClassificationIcon(catClass)}
                          {catClass}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${cs.percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* ===== STRONG & WEAK POINTS ===== */}
        {sections.strongWeakPoints && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold">Ponto Forte: {strongestCategory.label}</span>
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                {Math.round(strongestCategory.percentage)}% — {getClassification(strongestCategory.percentage)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-bold">Ponto Crítico: {weakestCategory.label}</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                {Math.round(weakestCategory.percentage)}% — {getClassification(weakestCategory.percentage)}
              </p>
            </div>
          </div>
        )}

        {/* ===== STATISTICS ===== */}
        {sections.statistics && (
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs text-center text-muted-foreground mb-3 font-medium">ESTATÍSTICAS DA AVALIAÇÃO</p>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalAnswered}</p>
                  <p className="text-xs text-muted-foreground">Respondidas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{totalNoInfo}</p>
                  <p className="text-xs text-muted-foreground">Sem Informação</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">{Math.round(totalAnswered / totalQuestions * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Completude</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== FINANCIAL ANALYSIS ===== */}
        {sections.financialAnalysis && financialItems.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-amber-800">
                <DollarSign className="w-5 h-5" />
                Análise Financeira
              </CardTitle>
              <CardDescription>Impactos financeiros identificados com base nas suas respostas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-bold text-red-800">Estimativa de Desperdício</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-muted-foreground">Mínimo/mês</p>
                    <p className="text-lg font-bold text-red-600">R$ {wasteEstimate.minMonthly.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-muted-foreground">Máximo/mês</p>
                    <p className="text-lg font-bold text-red-700">R$ {wasteEstimate.maxMonthly.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-muted-foreground">Mínimo/ano</p>
                    <p className="text-lg font-bold text-red-800">R$ {wasteEstimate.minAnnual.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-muted-foreground">Máximo/ano</p>
                    <p className="text-lg font-bold text-red-900">R$ {wasteEstimate.maxAnnual.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {financialItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{item.label}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getScoreColor(item.answerValue * 25)}`}>{item.answerValue}/4</span>
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== TOP 5 WORST ===== */}
        {sections.top5Worst && worstQuestions.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-red-800">
                <ArrowDownRight className="w-5 h-5" />
                Top 5 Pontos Críticos
              </CardTitle>
              <CardDescription>Áreas prioritárias que necessitam de atenção imediata</CardDescription>
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
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${getScoreColor(pct)}`}>{pct}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Resposta: <span className="font-medium text-gray-700">{opt?.label ?? `Valor: ${item.answer}`}</span></p>
                          {opt?.impact && <p className="text-sm text-red-600 mt-1 font-medium">{opt.impact}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== ADMIN OBSERVATION ===== */}
        {sections.adminObservation && data.adminObservation && (
          <Card className="border-0 shadow-lg bg-teal-50/50 border-teal-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-teal-800">
                <HeartPulse className="w-5 h-5" />
                Observação do Especialista
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-teal-900 leading-relaxed whitespace-pre-wrap">{data.adminObservation}</p>
            </CardContent>
          </Card>
        )}

        {/* ===== ADJUSTED FINANCIALS ===== */}
        {sections.adjustedFinancials && (data.economyMinEdited || data.economyMaxEdited || data.financialRiskLevelEdited || data.financialLossEdited) && (
          <Card className="border-0 shadow-lg bg-amber-50/50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-amber-800">
                <FileText className="w-5 h-5" />
                Análise Financeira Ajustada
              </CardTitle>
              <CardDescription>Valores revisados pelo especialista Klever Oliveira Lopes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.economyMinEdited && (
                  <div className="p-4 bg-white rounded-xl border">
                    <p className="text-xs text-muted-foreground">Economia Mínima Estimada</p>
                    <p className="text-xl font-bold text-emerald-600">{data.economyMinEdited}%</p>
                  </div>
                )}
                {data.economyMaxEdited && (
                  <div className="p-4 bg-white rounded-xl border">
                    <p className="text-xs text-muted-foreground">Economia Máxima Estimada</p>
                    <p className="text-xl font-bold text-emerald-600">{data.economyMaxEdited}%</p>
                  </div>
                )}
                {data.financialRiskLevelEdited && (
                  <div className="p-4 bg-white rounded-xl border">
                    <p className="text-xs text-muted-foreground">Nível de Risco Financeiro</p>
                    <p className="text-lg font-bold text-amber-600">{data.financialRiskLevelEdited}</p>
                  </div>
                )}
                {data.financialLossEdited && (
                  <div className="p-4 bg-white rounded-xl border">
                    <p className="text-xs text-muted-foreground">Prejuízo Estimado</p>
                    <p className="text-lg font-bold text-red-600">{data.financialLossEdited}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== RECOMMENDATIONS ===== */}
        {sections.recommendations && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-600" />
                Recomendações Prioritárias
              </CardTitle>
              <CardDescription>Ações sugeridas com base nos pontos mais críticos identificados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weakestCategories.map((cs) => {
                const catInfo = CATEGORIES.find(c => c.key === cs.category)!;
                return (
                  <div key={cs.category} className="flex gap-3 p-4 rounded-xl border bg-gray-50/50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: catInfo.color + '20' }}>
                      {catInfo.icon}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{catInfo.label}</p>
                        <Badge variant="secondary" className="text-xs">{cs.percentage.toFixed(1)}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{recommendations[cs.category]}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* ===== VISIBILITY GAPS ===== */}
        {sections.visibilityGaps && visibilityGaps.length > 0 && (
          <Card className="border-0 shadow-lg border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                Lacunas de Visibilidade ({visibilityGaps.length})
              </CardTitle>
              <CardDescription>Questões onde não há informação disponível — indicam necessidade de indicadores e controles</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {visibilityGaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Download Button */}
        <div className="text-center">
          <Button onClick={handleDownload} size="lg" className="bg-teal-600 hover:bg-teal-700">
            <Download className="w-4 h-4 mr-2" />
            Baixar Relatório em Texto
          </Button>
        </div>

        {/* CTA */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-50 to-emerald-50">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="font-semibold text-gray-900 mb-2">
              Se essa jornada foi proveitosa e você deseja iniciar um processo de assessoria e tecnologia para sua CME, entre em contato:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">📧</span>
                <span className="font-medium">CMEINTELIGENTE@GMAIL.COM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">📱</span>
                <span className="font-medium">(11) 9.99661-0399</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Copyright */}
        <p className="text-[10px] text-gray-400 text-center leading-relaxed max-w-lg mx-auto mb-6">
          Material exclusivo e de propriedade da CME INTELIGENTE. Metodologia, lógica de dados, estrutura técnica e perguntas desenvolvidas por Klever Oliveira Lopes. Proibida a reprodução total ou parcial, replicação, adaptação, distribuição ou utilização sem autorização expressa.
        </p>
      </div>
    </div>
  );
}

// ============================
// Main Page
// ============================
export default function ResultadoPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/assessment/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (error || !data) return <NotAvailableScreen />;
  if (data.status !== 'released' && data.status !== 'sent') return <NotAvailableScreen />;
  return <ResultsView data={data} />;
}
