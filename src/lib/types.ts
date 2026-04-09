export type CategoryKey = 'gestao' | 'processo' | 'tecnologia' | 'financeiro' | 'lgpd';

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
  description: string;
}

export interface Question {
  id: number;
  category: CategoryKey;
  text: string;
  options: QuestionOption[];
}

export type ScreenType = 'intro' | 'register1' | 'register2' | 'assessment' | 'results';

export interface RegistrationData {
  fullName: string;
  position: string;
  establishmentType: string;
}

export interface AssessmentResponse {
  questionId: number;
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
  classification: 'Excelente' | 'Bom' | 'Regular' | 'Precisa Melhorar';
  categoryScores: CategoryScore[];
  responses: AssessmentResponse[];
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'gestao', label: 'Gestão', icon: '👔', questionCount: 10, color: '#0D9488' },
  { key: 'processo', label: 'Processo', icon: '⚙️', questionCount: 13, color: '#059669' },
  { key: 'tecnologia', label: 'Tecnologia', icon: '💻', questionCount: 15, color: '#0891B2' },
  { key: 'financeiro', label: 'Financeiro', icon: '💰', questionCount: 10, color: '#D97706' },
  { key: 'lgpd', label: 'LGPD', icon: '🔒', questionCount: 11, color: '#7C3AED' },
];

export const ESTABLISHMENT_TYPES = [
  { id: 'hospital_geral', label: 'Hospital Geral', icon: '🏥' },
  { id: 'hospital_especializado', label: 'Hospital Especializado', icon: '🩺' },
  { id: 'clinica_centro_cirurgico', label: 'Clínica/Centro Cirúrgico', icon: '🏥' },
  { id: 'consultorio_odontologico', label: 'Consultório Odontológico', icon: '🦷' },
  { id: 'laboratorio_analises', label: 'Laboratório de Análises Clínicas', icon: '🔬' },
  { id: 'centro_diagnostico', label: 'Centro de Diagnóstico por Imagem', icon: '📷' },
  { id: 'ubs', label: 'Unidade de Atenção Básica (UBS)', icon: '🏘️' },
  { id: 'home_care', label: 'Home Care', icon: '🏠' },
];

export const TOTAL_QUESTIONS = 59;

export function getClassification(percentage: number): AssessmentResult['classification'] {
  if (percentage >= 80) return 'Excelente';
  if (percentage >= 60) return 'Bom';
  if (percentage >= 40) return 'Regular';
  return 'Precisa Melhorar';
}

export function getClassificationColor(classification: AssessmentResult['classification']): string {
  switch (classification) {
    case 'Excelente': return 'text-emerald-600';
    case 'Bom': return 'text-teal-600';
    case 'Regular': return 'text-amber-600';
    case 'Precisa Melhorar': return 'text-red-600';
  }
}

export function getClassificationBg(classification: AssessmentResult['classification']): string {
  switch (classification) {
    case 'Excelente': return 'bg-emerald-50 border-emerald-200';
    case 'Bom': return 'bg-teal-50 border-teal-200';
    case 'Regular': return 'bg-amber-50 border-amber-200';
    case 'Precisa Melhorar': return 'bg-red-50 border-red-200';
  }
}
