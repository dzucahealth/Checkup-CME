'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield, FileText, Target, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle, Download, BarChart3,
  RotateCcw, HeartPulse, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CATEGORIES, ESTABLISHMENT_TYPES, BED_COUNT_OPTIONS,
  CME_PROFESSIONALS_OPTIONS, REGIONS, CategoryKey,
  getClassification, getClassificationColor, getClassificationBg,
} from '@/lib/types';
import { checkupQuestions } from '@/lib/checkup-questions';
import { useParams } from 'next/navigation';

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
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.93 0.025 165)"
            strokeWidth={strokeWidth}
          />
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
            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{Math.round(percentage)}%</span>
          {label && <span className="text-xs text-muted-foreground mt-1">{label}</span>}
        </div>
      </div>
    </div>
  );
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

function ResultsView({ data }: { data: AssessmentData }) {
  const classification = getClassification(data.totalScore);
  const classColor = getClassificationColor(classification);
  const classBg = getClassificationBg(classification);

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

  const stateLabel = (() => {
    for (const r of REGIONS) {
      const s = r.states.find(st => st.id === data.state);
      if (s) return `${r.label} - ${s.label}`;
    }
    return data.state;
  })();

  const handleDownload = () => {
    const categoryLines = categoryScores.map(cs =>
      `  • ${cs.label}: ${cs.percentage.toFixed(1)}%`
    ).join('\n');

    const recommendationLines = weakestCategories.map(cs =>
      `\n📌 ${cs.label} (prioridade):\n${recommendations[cs.category]}`
    ).join('\n');

    const adminNote = data.adminObservation ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOBSERVAÇÃO DO ESPECIALISTA\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.adminObservation}\n` : '';

    const financialNote = (data.economyMinEdited || data.economyMaxEdited || data.financialRiskLevelEdited || data.financialLossEdited)
      ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDADOS FINANCEIROS (Ajustados pelo especialista)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.economyMinEdited ? `Economia mínima estimada: ${data.economyMinEdited}%\n` : ''}${data.economyMaxEdited ? `Economia máxima estimada: ${data.economyMaxEdited}%\n` : ''}${data.financialRiskLevelEdited ? `Nível de risco financeiro: ${data.financialRiskLevelEdited}\n` : ''}${data.financialLossEdited ? `Prejuízo estimado: ${data.financialLossEdited}\n` : ''}`
      : '';

    const report = `
═══════════════════════════════════════════════════════════
           CHECKUP CME INTELIGENTE - RELATÓRIO
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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMENDAÇÕES PRIORITÁRIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Resultado do Checkup</h1>
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

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 -mt-6 relative z-10 pb-16">
        {/* Overall Score */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="pt-8 pb-8 flex flex-col items-center">
            <CircularProgress percentage={data.totalScore} size={200} strokeWidth={14} label="Nota Geral" />
            <div className={`mt-4 px-6 py-2 rounded-full border-2 font-bold text-lg ${classBg} ${classColor}`}>
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

        {/* Category Scores */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Pontuação por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {categoryScores.map((cs) => {
              const catInfo = CATEGORIES.find(c => c.key === cs.category)!;
              const barColor = cs.percentage >= 80 ? 'bg-emerald-500' : cs.percentage >= 60 ? 'bg-teal-500' : cs.percentage >= 40 ? 'bg-amber-500' : 'bg-red-500';

              return (
                <div key={cs.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{catInfo.icon}</span>
                      <span className="font-medium text-sm">{cs.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${
                      cs.percentage >= 80 ? 'text-emerald-600' : cs.percentage >= 60 ? 'text-teal-600' : cs.percentage >= 40 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {cs.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                      style={{ width: `${cs.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Admin Observation */}
        {data.adminObservation && (
          <Card className="border-0 shadow-lg mb-6 bg-teal-50/50 border-teal-200">
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

        {/* Admin-edited Financial Data */}
        {(data.economyMinEdited || data.economyMaxEdited || data.financialRiskLevelEdited || data.financialLossEdited) && (
          <Card className="border-0 shadow-lg mb-6 bg-amber-50/50 border-amber-200">
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

        {/* Recommendations */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Recomendações Prioritárias
            </CardTitle>
            <CardDescription>
              Ações sugeridas com base nos pontos mais críticos identificados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakestCategories.map((cs) => {
              const catInfo = CATEGORIES.find(c => c.key === cs.category)!;
              return (
                <div key={cs.category} className="flex gap-3 p-4 rounded-xl border bg-gray-50/50">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: catInfo.color + '20' }}
                  >
                    {catInfo.icon}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{catInfo.label}</p>
                      <Badge variant="secondary" className="text-xs">{cs.percentage.toFixed(1)}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {recommendations[cs.category]}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Visibility Gaps */}
        {visibilityGaps.length > 0 && (
          <Card className="border-0 shadow-lg mb-6 border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                Lacunas de Visibilidade
              </CardTitle>
              <CardDescription>
                Questões onde não há informação disponível — indicam necessidade de indicadores e controles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {visibilityGaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Download Button */}
        <div className="text-center mb-6">
          <Button onClick={handleDownload} size="lg" className="bg-teal-600 hover:bg-teal-700">
            <Download className="w-4 h-4 mr-2" />
            Baixar Relatório em Texto
          </Button>
        </div>

        {/* CTA */}
        <Card className="border-0 shadow-lg mb-6 bg-gradient-to-r from-teal-50 to-emerald-50">
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
