'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { checkupQuestions } from '@/lib/checkup-questions'

interface AssessmentData {
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
  totalScore: number | null
  status: string
  scores: Array<{ category: string; percentage: number }>
  responses: Array<{ questionId: string; answer: number }>
  result: any
}

const ESTABLISHMENT_LABELS: Record<string, string> = {
  hospital: 'Hospital', hospital_geral: 'Hospital Geral',
  clinica: 'Clínica', clinica_geral: 'Clínica Geral',
  unidade: 'Unidade de Saúde', unidade_basica: 'UBS',
  laboratorio: 'Laboratório', outro: 'Outro',
}
const BED_COUNT_LABELS: Record<string, string> = {
  sem_leitos: 'Sem leitos de internação', ate_20: 'Até 20 leitos',
  '21_a_50': '21 a 50 leitos', '51_a_100': '51 a 100 leitos',
  '101_a_150': '101 a 150 leitos', '151_a_300': '151 a 300 leitos', acima_300: 'Acima de 300 leitos',
}
const CME_PROFESSIONALS_LABELS: Record<string, string> = {
  '1_a_3': '1 a 3 profissionais', '4_a_6': '4 a 6 profissionais',
  '7_a_10': '7 a 10 profissionais', '11_a_20': '11 a 20 profissionais',
  '21_a_30': '21 a 30 profissionais', acima_30: 'Acima de 30 profissionais',
}
const REGION_LABELS: Record<string, string> = { norte: 'Norte', nordeste: 'Nordeste', centro_oeste: 'Centro-Oeste', sudeste: 'Sudeste', sul: 'Sul' }
const STATE_LABELS: Record<string, string> = {
  AC: 'Acre', AM: 'Amazonas', AP: 'Amapá', PA: 'Pará', RO: 'Rondônia', RR: 'Roraima', TO: 'Tocantins',
  AL: 'Alagoas', BA: 'Bahia', CE: 'Ceará', MA: 'Maranhão', PB: 'Paraíba', PE: 'Pernambuco', PI: 'Piauí', RN: 'Rio Grande do Norte', SE: 'Sergipe',
  DF: 'Distrito Federal', GO: 'Goiás', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  ES: 'Espírito Santo', MG: 'Minas Gerais', RJ: 'Rio de Janeiro', SP: 'São Paulo',
  PR: 'Paraná', RS: 'Rio Grande do Sul', SC: 'Santa Catarina',
}

const getClassification = (p: number) => p >= 80 ? 'Avançado' : p >= 60 ? 'Moderado' : p >= 40 ? 'Atenção' : 'Crítico'
const getColor = (c: string) => c === 'Avançado' ? '#059669' : c === 'Moderado' ? '#D97706' : c === 'Atenção' ? '#EA580C' : '#DC2626'

const recommendations: Record<string, string> = {
  gestao: 'Fortaleça a liderança com capacitação gerencial, implemente reuniões periódicas de acompanhamento de KPIs, e estruture um programa formal de gestão de riscos e planejamento estratégico para o CME.',
  processo: 'Revise e atualize POPs, fortaleça o programa de monitoramento com Indicador Biológico (IB) e Indicador Químico (IQ),implemente auditorias internas sistemáticas, e padronize o fluxo de rastreabilidade de materiais.',
  tecnologia: 'Invista em sistemas de gestão informatizados, implemente monitoramento digital em tempo real, estabeleça programa de manutenção preventiva calibrada, e avalie oportunidades de automação.',
  financeiro: 'Implemente controle detalhado de custos por categoria, realize análises de ROI antes de investimentos, otimize contratos com fornecedores, e crie um plano de redução de desperdícios.',
}
const categoryLabels: Record<string, string> = { gestao: 'Gestão', processo: 'Processo', tecnologia: 'Tecnologia', financeiro: 'Financeiro' }

export default function PDFTemplatePage() {
  const params = useParams()
  const [data, setData] = useState<AssessmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const id = params.id as string

  useEffect(() => {
    fetch(`/api/assessment/${id}`).then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: '40px' }}><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
  if (!data) return <div style={{ padding: '40px' }}>Dados não encontrados</div>

  const responsesMap: Record<string, number> = {}
  if (data.responses) data.responses.forEach((r: any) => { responsesMap[r.questionId] = r.answer })

  const totalQuestions = checkupQuestions.length
  const totalAnswered = Object.keys(responsesMap).filter(k => responsesMap[k] > 0).length
  const totalNoInfo = Object.keys(responsesMap).filter(k => responsesMap[k] === 0).length
  const completeness = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0

  const categoryScores = (data.scores || []).map(s => ({ ...s, label: categoryLabels[s.category] || s.category }))
  const sortedCategories = [...categoryScores].sort((a, b) => a.percentage - b.percentage)
  const strongest = sortedCategories[sortedCategories.length - 1]
  const weakest = sortedCategories[0]

  const worstQuestions = checkupQuestions.map(q => {
    const a = responsesMap[q.id]
    if (!a || a === 0) return null
    return { q, answer: a, score: (a * q.weight) / (4 * q.weight) }
  }).filter(Boolean).sort((a: any, b: any) => a.score - b.score).slice(0, 5)

  const classification = getClassification(data.totalScore || 0)
  const classColor = getColor(classification)

  // Parse visible sections from resultJson
  const resultJson = data.result?.resultJson ? JSON.parse(data.result.resultJson) : null
  const visibleSections = resultJson?.visibleSections || {
    overall: true, categories: true, recommendations: true, economy: true, financialRisk: true
  }

  // Admin edited values
  const economyMinEdited = data.result?.economyMinEdited ?? null
  const economyMaxEdited = data.result?.economyMaxEdited ?? null
  const riskLevelEdited = data.result?.financialRiskLevelEdited ?? null
  const lossEdited = data.result?.financialLossEdited ?? null

  // Calculate waste estimate if no edited values
  let wasteMin = 0, wasteMax = 0
  if (economyMinEdited === null) {
    const maint = responsesMap['financeiro_6']
    if (maint === 1) { wasteMin += 10000; wasteMax += 15000 }
    else if (maint === 2) { wasteMin += 5000; wasteMax += 10000 }
    else if (maint === 3) { wasteMin += 1000; wasteMax += 5000 }
    else if (maint === 4) { wasteMin += 0; wasteMax += 1000 }
    const waste = responsesMap['financeiro_10']
    if (waste === 1) { wasteMin += 5000; wasteMax += 10000 }
    else if (waste === 2) { wasteMin += 2000; wasteMax += 5000 }
    else if (waste === 3) { wasteMin += 500; wasteMax += 2000 }
    else if (waste === 4) { wasteMin += 0; wasteMax += 500 }
  }
  const displayEconomyMin = economyMinEdited !== null ? economyMinEdited : wasteMin
  const displayEconomyMax = economyMaxEdited !== null ? economyMaxEdited : wasteMax

  const riskLabel = riskLevelEdited === 'baixo' ? 'Baixo' : riskLevelEdited === 'medio' ? 'Médio' : riskLevelEdited === 'alto' ? 'Alto' : riskLevelEdited === 'critico' ? 'Crítico' : null
  const riskColor = riskLevelEdited === 'baixo' ? '#059669' : riskLevelEdited === 'medio' ? '#D97706' : riskLevelEdited === 'alto' ? '#EA580C' : riskLevelEdited === 'critico' ? '#DC2626' : null

  return (
    <html>
    <head>
      <style>{`
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; font-size: 11px; line-height: 1.4; }
        .header { display: flex; align-items: center; gap: 16px; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 2px solid #059669; }
        .logo { height: 48px; }
        .title-block { }
        .title { font-size: 20px; font-weight: bold; color: #0D9488; }
        .subtitle { font-size: 12px; color: #6B7280; }
        .result-box { text-align: center; margin: 0 0 24px 0; }
        .score { font-size: 48px; font-weight: bold; color: #0D9488; }
        .label { font-size: 14px; color: #6B7280; }
        .badge { display: inline-block; padding: 6px 16px; border-radius: 16px; color: white; font-weight: bold; margin-top: 8px; }
        .desc { font-size: 12px; color: #6B7280; margin-top: 12px; max-width: 600px; margin-left: auto; margin-right: auto; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 14px; font-weight: bold; color: #1F2937; padding-bottom: 8px; margin-bottom: 12px; border-bottom: 1px solid #E5E7EB; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .box { background: #FFFFFF; padding: 12px; border: 1px solid #E5E7EB; border-radius: 6px; text-align: center; }
        .box-title { font-size: 11px; color: #6B7280; }
        .box-value { font-size: 20px; font-weight: bold; color: #1F2937; }
        .box-value.green { color: #059669; }
        .box-value.yellow { color: #D97706; }
        .box-value.red { color: #DC2626; }
        .point-box { padding: 12px; border-radius: 6px; }
        .point-green { background: #ECFDF5; border: 1px solid #A7F3D0; }
        .point-red { background: #FEF2F2; border: 1px solid #FECACA; }
        .point-label { font-size: 13px; font-weight: bold; }
        .point-sub { font-size: 11px; margin-top: 4px; }
        .green-text { color: #059669; }
        .red-text { color: #DC2626; }
        .item-row { display: flex; justify-content: space-between; font-size: 11px; padding: 6px 0; border-bottom: 1px solid #F3F4F6; }
        .item-label { color: #6B7280; }
        .item-value { color: #1F2937; }
        .rec-box { background: #FFFFFF; padding: 12px; border: 1px solid #E5E7EB; border-radius: 6px; margin-bottom: 8px; }
        .rec-title { font-weight: bold; color: #1F2937; margin-bottom: 6px; }
        .rec-text { font-size: 11px; color: #6B7280; }
        .alert-box { background: #FEF3C7; padding: 10px; border-radius: 6px; margin-bottom: 8px; }
        .alert-title { font-size: 12px; font-weight: bold; color: #92400E; }
        .alert-text { font-size: 11px; color: #B45309; }
        .footer { padding-top: 16px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 10px; color: #9CA3AF; }
      `}</style>
    </head>
    <body>
      {/* Header */}
      <div className="header">
        <img src="/logo-cme-inteligente.png" alt="CME Inteligente" className="logo" />
        <div className="title-block">
          <div className="title">Check-up CME Inteligente</div>
          <div className="subtitle">Diagnóstico de Gestão, Processo e Tecnologia</div>
        </div>
      </div>

      {/* Resultado Geral */}
      {visibleSections.overall !== false && (
      <div className="result-box">
        <div className="score">{Math.round(data.totalScore || 0)}%</div>
        <div className="label">Nota Geral</div>
        <div className="badge" style={{ backgroundColor: classColor }}>{classification}</div>
        <p className="desc">
          {classification === 'Avançado' && 'Sua CME apresenta um bom nível de maturidade, porém sempre existem oportunidades de otimização.'}
          {classification === 'Moderado' && 'Sua CME necessita de melhorias em diversas áreas. Recomendamos um plano de ação prioritário com foco em economia e segurança.'}
          {classification === 'Atenção' && 'Sua CME apresenta deficiências significativas que necessitam de atenção imediata.'}
          {classification === 'Crítico' && 'Sua CME apresenta deficiências críticas que exigem intervenção urgente.'}
        </p>
      </div>
      )}

      {/* Scores por Categoria */}
      {visibleSections.categories !== false && (
      <div className="section">
        <div className="section-title">Classificação por Categoria</div>
        <div className="grid-4">
          {categoryScores.map((c, i) => (
            <div key={i} className="box">
              <div className="box-title">{c.label}</div>
              <div className="box-value" style={{ color: c.percentage >= 60 ? '#059669' : c.percentage >= 40 ? '#D97706' : '#DC2626' }}>{Math.round(c.percentage)}%</div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Pontos Forte e Crítico - always show */}
      <div className="section">
        <div className="grid-2">
          <div className="point-box point-green">
            <div className="point-label green-text">✓ Ponto Forte: {strongest?.label}</div>
            <div className="point-sub" style={{ color: '#047857' }}>{Math.round(strongest?.percentage)}% — {getClassification(strongest?.percentage)}</div>
          </div>
          <div className="point-box point-red">
            <div className="point-label red-text">⚠ Ponto Crítico: {weakest?.label}</div>
            <div className="point-sub" style={{ color: '#B91C1C' }}>{Math.round(weakest?.percentage)}% — {getClassification(weakest?.percentage)}</div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="section">
        <div className="section-title">Estatísticas da Avaliação</div>
        <div className="grid-4">
          <div className="box"><div className="box-value">{totalAnswered}</div><div className="box-title">Respondidas</div></div>
          <div className="box"><div className="box-value yellow">{totalNoInfo}</div><div className="box-title">Sem Informação</div></div>
          <div className="box"><div className="box-value">{totalQuestions}</div><div className="box-title">Total</div></div>
          <div className="box"><div className="box-value green">{completeness}%</div><div className="box-title">Completude</div></div>
        </div>
      </div>

      {/* 5 Pontos de Atenção */}
      {worstQuestions.length > 0 && (
        <div className="section">
          <div className="section-title">5 Pontos de Atenção</div>
          {worstQuestions.map((item: any, i: number) => (
            <div key={i} className="alert-box">
              <div className="alert-title">{i + 1}. {item.q.question.slice(0, 70)}...</div>
              <div className="alert-text">Categoria: {categoryLabels[item.q.category] || item.q.category} | Resposta: {item.answer}/4</div>
            </div>
          ))}
        </div>
      )}

      {/* Dados do Avaliador */}
      <div className="section">
        <div className="section-title">Dados do Avaliador</div>
        <div className="grid-2">
          <div className="item-row"><span className="item-label">Nome:</span><span className="item-value">{data.name || '-'}</span></div>
          <div className="item-row"><span className="item-label">Cargo:</span><span className="item-value">{data.position || '-'}</span></div>
          <div className="item-row"><span className="item-label">Email:</span><span className="item-value">{data.email || '-'}</span></div>
          <div className="item-row"><span className="item-label">Telefone:</span><span className="item-value">{data.phone || '-'}</span></div>
          <div className="item-row"><span className="item-label">Estabelecimento:</span><span className="item-value">{ESTABLISHMENT_LABELS[data.establishmentType] || data.establishmentType || '-'}</span></div>
          <div className="item-row"><span className="item-label">Leitos:</span><span className="item-value">{BED_COUNT_LABELS[data.bedCount] || data.bedCount || '-'}</span></div>
          <div className="item-row"><span className="item-label">Profissionais CME:</span><span className="item-value">{CME_PROFESSIONALS_LABELS[data.cmeProfessionals] || data.cmeProfessionals || '-'}</span></div>
          <div className="item-row"><span className="item-label">Região:</span><span className="item-value">{REGION_LABELS[data.region] || data.region || '-'} / {STATE_LABELS[data.state] || data.state || '-'}</span></div>
        </div>
      </div>

      {/* Recomendações */}
      {visibleSections.recommendations !== false && (
      <div className="section">
        <div className="section-title">Recomendações Prioritárias</div>
        {sortedCategories.slice(0, 2).map((cat, i) => (
          <div key={i} className="rec-box">
            <div className="rec-title">🔹 {cat.label} ({Math.round(cat.percentage)}%)</div>
            <div className="rec-text">{recommendations[cat.category]}</div>
          </div>
        ))}
      </div>
      )}

      {/* Economia Estimada */}
      {visibleSections.economy !== false && displayEconomyMax > 0 && (
      <div className="section">
        <div className="section-title">Economia Estimada</div>
        <div className="grid-2">
          <div className="box">
            <div className="box-value green">R$ {displayEconomyMin.toLocaleString()} - R$ {displayEconomyMax.toLocaleString()}</div>
            <div className="box-title">Economia Anual Estimada</div>
          </div>
        </div>
      </div>
      )}

      {/* Risco Financeiro */}
      {visibleSections.financialRisk !== false && riskLabel && (
      <div className="section">
        <div className="section-title">Nível de Risco</div>
        <div className="grid-2">
          <div className="box">
            <div className="box-value" style={{ color: riskColor }}>{riskLabel}</div>
            <div className="box-title">Classificação de Risco</div>
          </div>
          {lossEdited !== null && (
            <div className="box">
              <div className="box-value red">R$ {lossEdited.toLocaleString()}</div>
              <div className="box-title">Perda Anual Estimada</div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Observação do Especialista */}
      {data.result?.adminObservation && (
        <div className="section">
          <div className="section-title">Observação do Especialista</div>
          <div className="rec-text">{data.result.adminObservation}</div>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <p>Material exclusivo e de propriedade da CME INTELIGENTE.</p>
        <p>Metodologia desenvolvida por Klever Oliveira Lopes.</p>
      </div>
    </body>
    </html>
  )
}