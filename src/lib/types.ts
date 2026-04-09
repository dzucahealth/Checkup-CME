export type CategoryKey = 'gestao' | 'processo' | 'tecnologia' | 'financeiro';

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  icon: string;
  questionCount: number;
  color: string;
}

export interface QuestionOption {
  value: number;
  label: string;
  impact: string;
}

export interface Question {
  id: string;
  category: CategoryKey;
  question: string;
  description?: string;
  options: QuestionOption[];
  weight: number;
}

export type ScreenType = 'intro' | 'register1' | 'register2' | 'consent' | 'assessment' | 'results';

export interface RegistrationData {
  name: string;
  position: string;
  phone: string;
  email: string;
  establishmentType: string;
  bedCount: string;
  cmeProfessionals: string;
  region: string;
  state: string;
}

export interface AssessmentResponse {
  questionId: string;
  answer: number;
}

export interface CategoryScore {
  category: CategoryKey;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface AssessmentResult {
  totalScore: number;
  totalPercentage: number;
  classification: 'Crítico' | 'Atenção' | 'Moderado' | 'Avançado';
  categoryScores: CategoryScore[];
  responses: AssessmentResponse[];
  visibilityGaps: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'gestao', label: 'Gestão', icon: '👔', questionCount: 11, color: '#0D9488' },
  { key: 'processo', label: 'Processo', icon: '⚙️', questionCount: 18, color: '#059669' },
  { key: 'tecnologia', label: 'Tecnologia', icon: '💻', questionCount: 14, color: '#0891B2' },
  { key: 'financeiro', label: 'Financeiro e Riscos', icon: '💰', questionCount: 10, color: '#D97706' },
];

export const ESTABLISHMENT_TYPES = [
  { id: 'hospital_geral', label: 'Hospital Geral', icon: '🏥' },
  { id: 'hospital_maternidade', label: 'Hospital Maternidade', icon: '👶' },
  { id: 'hospital_oftalmologico', label: 'Hospital Oftalmológico', icon: '👁️' },
  { id: 'hospital_especialidades', label: 'Hospital de Especialidades', icon: '🩺' },
  { id: 'hospital_dia', label: 'Hospital Dia', icon: '🏨' },
  { id: 'day_clinic', label: 'Day Clinic', icon: '📋' },
  { id: 'centro_especialidades', label: 'Centro de Especialidades', icon: '🏛️' },
  { id: 'unidade_gestao_terceirizada', label: 'Unidade de Gestão Terceirizada', icon: '🤝' },
];

export const BED_COUNT_OPTIONS = [
  { id: 'sem_leitos', label: 'Sem leitos de internação' },
  { id: 'ate_20', label: 'Até 20 leitos' },
  { id: '21_a_50', label: '21 a 50 leitos' },
  { id: '51_a_100', label: '51 a 100 leitos' },
  { id: '101_a_150', label: '101 a 150 leitos' },
  { id: '151_a_300', label: '151 a 300 leitos' },
  { id: 'acima_300', label: 'Acima de 300 leitos' },
];

export const CME_PROFESSIONALS_OPTIONS = [
  { id: '1_a_3', label: '1 a 3 profissionais' },
  { id: '4_a_6', label: '4 a 6 profissionais' },
  { id: '7_a_10', label: '7 a 10 profissionais' },
  { id: '11_a_20', label: '11 a 20 profissionais' },
  { id: '21_a_30', label: '21 a 30 profissionais' },
  { id: 'acima_30', label: 'Acima de 30 profissionais' },
];

export const REGIONS = [
  {
    id: 'norte',
    label: 'Norte',
    states: [
      { id: 'AC', label: 'Acre' },
      { id: 'AM', label: 'Amazonas' },
      { id: 'AP', label: 'Amapá' },
      { id: 'PA', label: 'Pará' },
      { id: 'RO', label: 'Rondônia' },
      { id: 'RR', label: 'Roraima' },
      { id: 'TO', label: 'Tocantins' },
    ],
  },
  {
    id: 'nordeste',
    label: 'Nordeste',
    states: [
      { id: 'AL', label: 'Alagoas' },
      { id: 'BA', label: 'Bahia' },
      { id: 'CE', label: 'Ceará' },
      { id: 'MA', label: 'Maranhão' },
      { id: 'PB', label: 'Paraíba' },
      { id: 'PE', label: 'Pernambuco' },
      { id: 'PI', label: 'Piauí' },
      { id: 'RN', label: 'Rio Grande do Norte' },
      { id: 'SE', label: 'Sergipe' },
    ],
  },
  {
    id: 'centro_oeste',
    label: 'Centro-Oeste',
    states: [
      { id: 'DF', label: 'Distrito Federal' },
      { id: 'GO', label: 'Goiás' },
      { id: 'MS', label: 'Mato Grosso do Sul' },
      { id: 'MT', label: 'Mato Grosso' },
    ],
  },
  {
    id: 'sudeste',
    label: 'Sudeste',
    states: [
      { id: 'ES', label: 'Espírito Santo' },
      { id: 'MG', label: 'Minas Gerais' },
      { id: 'RJ', label: 'Rio de Janeiro' },
      { id: 'SP', label: 'São Paulo' },
    ],
  },
  {
    id: 'sul',
    label: 'Sul',
    states: [
      { id: 'PR', label: 'Paraná' },
      { id: 'RS', label: 'Rio Grande do Sul' },
      { id: 'SC', label: 'Santa Catarina' },
    ],
  },
];

export function getClassification(percentage: number): AssessmentResult['classification'] {
  if (percentage >= 70) return 'Avançado';
  if (percentage >= 50) return 'Moderado';
  if (percentage >= 30) return 'Atenção';
  return 'Crítico';
}

export function getClassificationColor(classification: AssessmentResult['classification']): string {
  switch (classification) {
    case 'Avançado': return 'text-teal-600';
    case 'Moderado': return 'text-amber-600';
    case 'Atenção': return 'text-orange-600';
    case 'Crítico': return 'text-red-600';
  }
}

export function getClassificationBg(classification: AssessmentResult['classification']): string {
  switch (classification) {
    case 'Avançado': return 'bg-teal-50 border-teal-200';
    case 'Moderado': return 'bg-amber-50 border-amber-200';
    case 'Atenção': return 'bg-orange-50 border-orange-200';
    case 'Crítico': return 'bg-red-50 border-red-200';
  }
}
