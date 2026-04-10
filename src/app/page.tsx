'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Shield, FileText, DollarSign, Target, ArrowRight,
  ArrowLeft, CheckCircle2, AlertTriangle, Download,
  User, Building2, ChevronRight, ClipboardList,
  TrendingUp, Star, Award, BarChart3, RotateCcw,
  HeartPulse, Activity, Info, Leaf, Lock, BedDouble,
  Users, MapPin, Hospital
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { checkupQuestions } from '@/lib/checkup-questions';
import {
  CATEGORIES,
  ESTABLISHMENT_TYPES,
  BED_COUNT_OPTIONS,
  CME_PROFESSIONALS_OPTIONS,
  REGIONS,
  CategoryKey,
  ScreenType,
  RegistrationData,
  AssessmentResponse,
  AssessmentResult,
  CategoryScore,
  getClassification,
  getClassificationColor,
  getClassificationBg,
} from '@/lib/types';

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
// Screen 1: Introduction
// ============================
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in min-h-screen flex flex-col bg-white">
      {/* Top Section - Title & Subtitle */}
      <section className="pt-12 sm:pt-16 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-2 mb-6">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Diagnóstico de Gestão, Processo e Tecnologia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Checkup CME
            <span className="block text-teal-600">Inteligente</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Descubra o ranking da sua CME e receba um diagnóstico personalizado com recomendações
          </p>
        </div>
      </section>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pb-16">
        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center">
                <FileText className="w-7 h-7 text-sky-500" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Diagnóstico Personalizado</h3>
              <p className="text-sm text-gray-500">
                Receba um diagnóstico completo com pontos críticos e recomendações específicas para sua CME.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Economia Estimada</h3>
              <p className="text-sm text-gray-500">
                Saiba quanto sua CME pode economizar com melhorias em processos e tecnologia.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center">
                <Target className="w-7 h-7 text-violet-500" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Plano de Ação</h3>
              <p className="text-sm text-gray-500">
                Quick wins e próximos passos claros para transformar sua CME.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card className="mb-10 border border-gray-100 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              O Checkup Avalia 4 Dimensões
            </CardTitle>
            <CardDescription>
              {checkupQuestions.length} questões distribuídas em 4 categorias estratégicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-teal-200 hover:bg-teal-50/50 transition-colors cursor-default"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium text-sm text-gray-800">{cat.label}</span>
                  <Badge variant="secondary" className="text-xs bg-white border border-gray-200">
                    {cat.questionCount} questões
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Klever's Section - Photo + Message */}
        <Card className="mb-10 border border-gray-100 shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Photo */}
            <div className="md:w-80 shrink-0 bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-8">
              <div className="relative">
                <img
                  src="/klever-lopes-2.jpg"
                  alt="Klever Lopes - Especialista em CME"
                  className="w-52 h-52 sm:w-60 sm:h-60 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-md">
                  Especialista em CME
                </div>
              </div>
            </div>
            {/* Message */}
            <CardContent className="pt-8 pb-8 px-6 sm:px-8 flex flex-col justify-center">
              <h3 className="font-bold text-xl text-gray-900 mb-1">Klever Lopes</h3>
              <p className="text-sm text-teal-600 font-medium mb-5">Especialista em Esterilização e CME</p>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  Eu sou <strong className="text-gray-900">Klever Lopes</strong>, especialista em CME, e estou disponibilizando <strong className="text-gray-900">gratuitamente, por tempo limitado</strong>, este Check Up CME INTELIGENTE para ajudar você, gestor, a fazer uma leitura mais clara, estratégica e sincera da sua operação.
                </p>
                <p>
                  Para que o resultado tenha qualidade, preciso que suas respostas sejam francas e conscientes. Eu sei que o seu dia é corrido, mas reserve esse momento para se conectar com a realidade da sua CME. Essa pode ser uma experiência reveladora e muito valiosa para sua gestão.
                </p>
                <p>
                  Neste check-up, o nome da sua instituição <strong className="text-gray-900">não será solicitado</strong>. A proposta é permitir que você responda com mais liberdade, segurança e sinceridade. Acredito que você tenha as informações necessárias para realizar essa jornada com consciência, e você pode seguir com tranquilidade.
                </p>
                <p className="font-semibold text-gray-900">
                  Clique no botão abaixo e comece sua jornada do checkup CME Inteligente AGORA.
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 border-0 text-white shadow-lg px-10 py-6 text-base font-semibold rounded-xl h-auto"
          >
            Iniciar Checkup Gratuito
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-gray-400 mt-3">
            ⏱ Duração estimada: 15-20 minutos • 100% gratuito • Por tempo limitado
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================
// Screen 2: Registration Phase 1
// ============================
function RegisterScreen1({ data, onChange, onNext, onBack }: {
  data: RegistrationData;
  onChange: (data: RegistrationData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!data.position.trim()) newErrors.position = 'Cargo é obrigatório';
    if (!data.phone.trim()) newErrors.phone = 'Telefone/WhatsApp é obrigatório';
    if (!data.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!data.establishmentType) newErrors.establishmentType = 'Selecione o tipo de estabelecimento';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1 text-sm font-medium text-primary">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
            <span className="ml-1">Dados Pessoais</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">2</span>
            <span className="ml-1">Dados da Instituição</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">3</span>
            <span className="ml-1">Consentimento</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">4</span>
            <span className="ml-1">Avaliação</span>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <User className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Dados Pessoais</CardTitle>
            <CardDescription>
              Informe seus dados pessoais e o tipo de estabelecimento para personalizar o checkup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={data.name}
                onChange={(e) => onChange({ ...data, name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                placeholder="Ex: Enfermeiro Responsável, Gestor do CME"
                value={data.position}
                onChange={(e) => onChange({ ...data, position: e.target.value })}
                className={errors.position ? 'border-destructive' : ''}
              />
              {errors.position && <p className="text-xs text-destructive">{errors.position}</p>}
            </div>

            {/* Phone/WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Telefone (WhatsApp)
              </Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={data.phone}
                onChange={(e) => onChange({ ...data, phone: e.target.value })}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={data.email}
                onChange={(e) => onChange({ ...data, email: e.target.value })}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Establishment Type */}
            <div className="space-y-3">
              <Label>Tipo de Estabelecimento</Label>
              {errors.establishmentType && <p className="text-xs text-destructive">{errors.establishmentType}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ESTABLISHMENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => onChange({ ...data, establishmentType: type.id })}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${
                      data.establishmentType === type.id
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-card'
                    }`}
                  >
                    <span className="text-xl shrink-0">{type.icon}</span>
                    <span className="text-sm font-medium leading-tight">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onBack} variant="outline" size="lg" className="shrink-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={handleNext} className="w-full" size="lg">
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================
// Screen 3: Registration Phase 2 - Institutional Data
// ============================
function RegisterScreen2({ data, onChange, onNext, onBack }: {
  data: RegistrationData;
  onChange: (data: RegistrationData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedRegion = REGIONS.find(r => r.id === data.region);
  const availableStates = selectedRegion?.states || [];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.bedCount) newErrors.bedCount = 'Selecione a quantidade de leitos';
    if (!data.cmeProfessionals) newErrors.cmeProfessionals = 'Selecione a quantidade de profissionais';
    if (!data.region) newErrors.region = 'Selecione a região';
    if (!data.state) newErrors.state = 'Selecione o estado';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const handleRegionChange = (regionId: string) => {
    onChange({ ...data, region: regionId, state: '' });
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Dados Pessoais</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm font-medium text-primary">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
            <span className="ml-1">Dados da Instituição</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">3</span>
            <span className="ml-1">Consentimento</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">4</span>
            <span className="ml-1">Avaliação</span>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-2">
              <Hospital className="w-6 h-6 text-teal-600" />
            </div>
            <CardTitle className="text-2xl">Dados da Instituição</CardTitle>
            <CardDescription>
              Informe os dados operacionais e a localização da instituição
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bed Count */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-primary" />
                Quantidade de Leitos
              </Label>
              {errors.bedCount && <p className="text-xs text-destructive">{errors.bedCount}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BED_COUNT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange({ ...data, bedCount: option.id })}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${
                      data.bedCount === option.id
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-card'
                    }`}
                  >
                    <span className="text-lg shrink-0">🛏️</span>
                    <span className="text-sm font-medium leading-tight">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CME Professionals */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Quantidade de profissionais que atuam na CME
              </Label>
              {errors.cmeProfessionals && <p className="text-xs text-destructive">{errors.cmeProfessionals}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CME_PROFESSIONALS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange({ ...data, cmeProfessionals: option.id })}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${
                      data.cmeProfessionals === option.id
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-card'
                    }`}
                  >
                    <span className="text-lg shrink-0">👷</span>
                    <span className="text-sm font-medium leading-tight">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Região do Brasil onde está localizada a instituição
              </Label>
              {errors.region && <p className="text-xs text-destructive">{errors.region}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => handleRegionChange(region.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${
                      data.region === region.id
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-card'
                    }`}
                  >
                    <span className="text-lg shrink-0">📍</span>
                    <span className="text-sm font-medium leading-tight">{region.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* State - only show when region is selected */}
            {data.region && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Estado
                </Label>
                {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableStates.map((state) => (
                    <button
                      key={state.id}
                      type="button"
                      onClick={() => onChange({ ...data, state: state.id })}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${
                        data.state === state.id
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border bg-card'
                      }`}
                    >
                      <span className="text-sm font-medium leading-tight">{state.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={onBack} variant="outline" size="lg" className="shrink-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={handleNext} className="w-full" size="lg">
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================
// Screen 3b: Consent (LGPD)
// ============================
function ConsentScreen({ consent1, consent2, onConsentChange, onStart, onBack }: {
  consent1: boolean;
  consent2: boolean;
  onConsentChange: (c1: boolean, c2: boolean) => void;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Dados Pessoais</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Dados da Instituição</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm font-medium text-primary">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
            <span className="ml-1">Consentimento</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">4</span>
            <span className="ml-1">Avaliação</span>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-violet-600" />
            </div>
            <CardTitle className="text-2xl">Termos de Consentimento</CardTitle>
            <CardDescription>
              Leia atentamente e aceite os termos abaixo para iniciar a avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Consent Text */}
            <div className="bg-muted/50 rounded-xl p-5 space-y-4 text-sm text-muted-foreground leading-relaxed max-h-72 overflow-y-auto custom-scrollbar">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Política de Privacidade e Termos de Uso
              </p>
              <Separator />
              <p>
                <strong className="text-foreground">Finalidade:</strong> Os dados coletados serão utilizados exclusivamente para a geração do diagnóstico de avaliação do CME, identificação de oportunidades de melhoria e elaboração de recomendações personalizadas para o seu estabelecimento de saúde.
              </p>
              <p>
                <strong className="text-foreground">Base Legal:</strong> O tratamento dos dados é fundamentado no consentimento do titular (Art. 7º, I, Lei nº 13.709/2018 - LGPD) e no legítimo interesse do controlador para fins de melhoria contínua de serviços de saúde.
              </p>
              <p>
                <strong className="text-foreground">Compartilhamento:</strong> Ao realizar este checkup, você consente com a coleta e o tratamento dos dados informados, incluindo nome, cargo, telefone, email, tipo de estabelecimento, dados operacionais e as respostas fornecidas no questionário de avaliação. Os dados não serão compartilhados com terceiros sem o seu consentimento expresso, exceto quando necessário para o cumprimento de obrigação legal ou regulatória.
              </p>
              <p>
                <strong className="text-foreground">Retenção:</strong> Os dados serão mantidos pelo período necessário para cumprir as finalidades descritas, ou até que o titular solicite a exclusão pelo e-mail (contato@cmeinteligente.com.br), conforme previsto na LGPD.
              </p>
              <p>
                <strong className="text-foreground">Segurança:</strong> Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, perda, alteração ou destruição.
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent1"
                  checked={consent1}
                  onCheckedChange={(checked) => onConsentChange(!!checked, consent2)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent1" className="text-sm font-medium leading-tight cursor-pointer">
                  Li e aceito os Termos de Consentimento e a Política de Privacidade descritos acima.
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent2"
                  checked={consent2}
                  onCheckedChange={(checked) => onConsentChange(consent1, !!checked)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent2" className="text-sm font-medium leading-tight cursor-pointer">
                  Autorizo o uso dos dados fornecidos para fins de melhoria contínua dos processos do CME.
                </Label>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 leading-relaxed space-y-3">
                <p className="font-bold text-base text-amber-900">
                  Aviso sobre o caráter do check-up
                </p>
                <p className="font-semibold text-amber-900">
                  Importante sobre a natureza deste check-up
                </p>
                <p>
                  O CHECK UP CME INTELIGENTE possui caráter educacional, orientativo e de diagnóstico de gestão.
                </p>
                <p>
                  Seu objetivo é apoiar a reflexão sobre processos, rotinas, controles e nível de maturidade operacional da CME, oferecendo uma visão inicial sobre pontos de atenção e oportunidades de melhoria.
                </p>
                <p className="font-semibold">Este material não substitui:</p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li>avaliação técnica presencial;</li>
                  <li>assessoria especializada;</li>
                  <li>responsabilidade do gestor e da instituição;</li>
                  <li>exigências legais e sanitárias aplicáveis;</li>
                  <li>normas técnicas vigentes;</li>
                  <li>orientações de autoridades regulatórias;</li>
                  <li>determinações previstas em RDCs e demais legislações brasileiras aplicáveis.</li>
                </ul>
                <p>
                  Os resultados apresentados devem ser interpretados como instrumento de apoio à gestão, e não como diagnóstico, parecer conclusivo ou validação formal de conformidade regulatória.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onBack} variant="outline" size="lg" className="shrink-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={onStart}
                className="w-full"
                size="lg"
                disabled={!consent1 || !consent2}
              >
                Iniciar Avaliação
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================
// Screen 5: Thank You
// ============================
function ThankYouScreen() {
  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl">Obrigado por completar o Checkup CME Inteligente!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground leading-relaxed">
              Suas respostas foram registradas com sucesso. Nosso time está preparando seu diagnóstico personalizado com base nas informações fornecidas.
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-teal-900 text-center">
                O que acontece agora?
              </p>
              <ul className="space-y-2 text-sm text-teal-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Seus dados serão analisados com atenção</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>O resultado será revisado por nosso especialista</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Você receberá o link para acessar seu diagnóstico</span>
                </li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="font-semibold text-gray-900 text-center">
                Se essa jornada foi proveitosa e você deseja iniciar um processo de assessoria e tecnologia para sua CME, entre em contato:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-semibold text-gray-900">CMEINTELIGENTE@GMAIL.COM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                    <p className="text-sm font-semibold text-gray-900">(11) 9.99661-0399</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              Material exclusivo e de propriedade da CME INTELIGENTE. Metodologia, lógica de dados, estrutura técnica e perguntas desenvolvidas por Klever Oliveira Lopes. Proibida a reprodução total ou parcial, replicação, adaptação, distribuição ou utilização sem autorização expressa.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================
// Screen 4: Assessment
// ============================
function AssessmentScreen({ responses, onAnswer, onFinish }: {
  responses: Map<string, number>;
  onAnswer: (questionId: string, answer: number) => void;
  onFinish: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const prevCategoryRef = useRef<CategoryKey | null>(null);

  const TOTAL_QUESTIONS = checkupQuestions.length;
  const currentQuestion = checkupQuestions[currentIndex];
  const currentCategory = currentQuestion.category;
  const categoryInfo = CATEGORIES.find(c => c.key === currentCategory)!;
  const totalAnswered = responses.size;
  const answeredWithValues = Array.from(responses.values()).filter(v => v > 0).length;
  const progressPercent = (totalAnswered / TOTAL_QUESTIONS) * 100;

  // Track category transitions
  useEffect(() => {
    prevCategoryRef.current = currentCategory;
  }, [currentCategory]);

  const goToNext = () => {
    if (currentIndex < checkupQuestions.length - 1) {
      setDirection('forward');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setDirection('backward');
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    onFinish();
  };

  const currentAnswer = responses.get(currentQuestion.id) ?? null;
  const selectedOption = currentAnswer !== null ? currentQuestion.options.find(o => o.value === currentAnswer) : null;
  const isVisibilityGap = selectedOption && selectedOption.value === 0;

  // Determine if we can finish (all questions answered)
  const allAnswered = totalAnswered === TOTAL_QUESTIONS;

  // Calculate questions per category up to current
  const categoryStartIndex = checkupQuestions.findIndex(q => q.category === currentCategory);
  const categoryQuestions = checkupQuestions.filter(q => q.category === currentCategory);
  const questionInCategory = categoryQuestions.findIndex(q => q.id === currentQuestion.id) + 1;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Questão {currentIndex + 1} de {TOTAL_QUESTIONS}
            </span>
            <span className="text-sm font-medium text-primary">
              {totalAnswered} respondidas
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />

          {/* Category indicators */}
          <div className="flex gap-1 mt-3 flex-wrap">
            {CATEGORIES.map((cat) => {
              const catQuestions = checkupQuestions.filter(q => q.category === cat.key);
              const catAnswered = catQuestions.filter(q => responses.has(q.id)).length;
              const isActive = cat.key === currentCategory;
              const isComplete = catAnswered === catQuestions.length;

              return (
                <Badge
                  key={cat.key}
                  variant={isActive ? 'default' : isComplete ? 'secondary' : 'outline'}
                  className={`text-xs ${isActive ? '' : 'opacity-70'}`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.label} ({catAnswered}/{catQuestions.length})
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          <Card className="border-0 shadow-lg overflow-hidden">
            {/* Category header */}
            <div
              className="px-6 py-4 text-white"
              style={{ backgroundColor: categoryInfo.color }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{categoryInfo.icon}</span>
                  <span className="font-semibold">{categoryInfo.label}</span>
                </div>
                <span className="text-sm opacity-80">
                  {questionInCategory} de {categoryQuestions.length}
                </span>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Question */}
              <div className={`mb-6 ${direction === 'forward' ? 'animate-slide-right' : 'animate-slide-left'}`}
                key={currentIndex}
              >
                <h2 className="text-lg font-semibold leading-relaxed mb-1">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.description && (
                  <p className="text-sm text-muted-foreground mt-1">{currentQuestion.description}</p>
                )}
              </div>

              {/* Impact feedback after selection */}
              {selectedOption && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${isVisibilityGap ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-teal-50 border border-teal-200 text-teal-800'}`}>
                  {isVisibilityGap && <AlertTriangle className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />}
                  {selectedOption.impact}
                </div>
              )}

              {/* Options */}
              <div className="space-y-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentAnswer === option.value;
                  const isGapOption = option.value === 0;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onAnswer(currentQuestion.id, option.value)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? isGapOption
                            ? 'border-amber-400 bg-amber-50 shadow-sm'
                            : 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border-2 transition-colors ${
                        isSelected
                          ? isGapOption
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/30 text-muted-foreground'
                      }`}>
                        {isGapOption ? '?' : option.value}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${isGapOption ? 'text-amber-700' : ''}`}>{option.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{option.impact}</p>
                      </div>
                      {isSelected && <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isGapOption ? 'text-amber-500' : 'text-primary'}`} />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPrev}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {/* Question navigator dots */}
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {currentIndex + 1}/{TOTAL_QUESTIONS}
              </span>
            </div>

            {currentIndex < checkupQuestions.length - 1 ? (
              <Button onClick={goToNext} disabled={currentAnswer === null}>
                Próxima
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={!allAnswered}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Finalizar
              </Button>
            )}
          </div>

          {!allAnswered && currentIndex === checkupQuestions.length - 1 && (
            <p className="text-xs text-amber-600 text-center mt-3">
              ⚠️ Responda todas as {TOTAL_QUESTIONS} questões para finalizar a avaliação.
              Faltam {TOTAL_QUESTIONS - totalAnswered}.
            </p>
          )}

          {/* Copyright footer */}
          <p className="text-[10px] text-gray-400 text-center mt-8 leading-relaxed max-w-lg mx-auto">
            Material exclusivo e de propriedade da CME INTELIGENTE. Metodologia, lógica de dados, estrutura técnica e perguntas desenvolvidas por Klever Oliveira Lopes. Proibida a reprodução total ou parcial, replicação, adaptação, distribuição ou utilização sem autorização expressa.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================
// Screen 5: Results
// ============================
function ResultsScreen({ result, registrationData, onRestart }: {
  result: AssessmentResult;
  registrationData: RegistrationData;
  onRestart: () => void;
}) {
  const classification = result.classification;
  const classColor = getClassificationColor(classification);
  const classBg = getClassificationBg(classification);

  // Get lowest scoring categories for recommendations
  const sortedCategories = [...result.categoryScores].sort((a, b) => a.percentage - b.percentage);
  const weakestCategories = sortedCategories.slice(0, 2);

  const recommendations: Record<CategoryKey, string> = {
    gestao: 'Fortaleça a liderança com capacitação gerencial, implemente reuniões periódicas de acompanhamento de KPIs, e estruture um programa formal de gestão de riscos e planejamento estratégico para o CME.',
    processo: 'Revise e atualize POPs, fortaleça o programa de monitoramento com Indicador Biológico (IB) e Indicador Químico (IQ), implante auditorias internas sistemáticas, e padronize o fluxo de rastreabilidade de materiais em todas as etapas.',
    tecnologia: 'Invista em sistemas de gestão informatizados, implemente monitoramento digital em tempo real, estabeleça programa de manutenção preventiva calibrada, e avalie oportunidades de automação de processos repetitivos.',
    financeiro: 'Implemente controle detalhado de custos por categoria, realize análises de ROI antes de investimentos, otimize contratos com fornecedores, e crie um plano de redução de desperdícios com metas mensuráveis.',
  };

  const handleDownload = () => {
    const categoryLines = result.categoryScores.map(cs =>
      `  • ${cs.label}: ${cs.percentage.toFixed(1)}% (${cs.score}/${cs.maxScore} pontos)`
    ).join('\n');

    const recommendationLines = weakestCategories.map(cs =>
      `\n📌 ${cs.label} (prioridade):\n${recommendations[cs.category]}`
    ).join('\n');

    const report = `
═══════════════════════════════════════════════════════════
           CHECKUP CME INTELIGENTE - RELATÓRIO
═══════════════════════════════════════════════════════════

Data: ${new Date().toLocaleDateString('pt-BR')}
Avaliador: Klever Oliveira Lopes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DO AVALIADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nome: ${registrationData.name}
Cargo: ${registrationData.position}
Telefone: ${registrationData.phone}
Email: ${registrationData.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DA INSTITUIÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tipo: ${ESTABLISHMENT_TYPES.find(t => t.id === registrationData.establishmentType)?.label || registrationData.establishmentType}
Leitos: ${BED_COUNT_OPTIONS.find(b => b.id === registrationData.bedCount)?.label || registrationData.bedCount}
Profissionais CME: ${CME_PROFESSIONALS_OPTIONS.find(p => p.id === registrationData.cmeProfessionals)?.label || registrationData.cmeProfessionals}
Localização: ${REGIONS.find(r => r.id === registrationData.region)?.label || ''} - ${REGIONS.find(r => r.id === registrationData.region)?.states.find(s => s.id === registrationData.state)?.label || ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO GERAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pontuação Total: ${result.totalPercentage.toFixed(1)}%
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
${result.visibilityGaps.length > 0 ? result.visibilityGaps.map((g, i) => `  ${i + 1}. ${g}`).join('\n') : '  Nenhuma lacuna de visibilidade identificada.'}

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
    link.download = `checkup-cme-${registrationData.establishmentType}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col">
      {/* Header */}
      <div className="medical-gradient text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Resultado do Checkup</h1>
          <p className="text-white/80">
            {registrationData.name}
            {registrationData.position && <span> — {registrationData.position}</span>}
          </p>
          <p className="text-white/60 text-sm mt-1">
            {ESTABLISHMENT_TYPES.find(t => t.id === registrationData.establishmentType)?.label}
            {registrationData.region && registrationData.state && (
              <> — {REGIONS.find(r => r.id === registrationData.region)?.label} — {
                REGIONS.find(r => r.id === registrationData.region)?.states.find(s => s.id === registrationData.state)?.label
              }</>
            )}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 -mt-6 relative z-10 pb-16">
        {/* Overall Score */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="pt-8 pb-8 flex flex-col items-center">
            <CircularProgress percentage={result.totalPercentage} size={200} strokeWidth={14} label="Nota Geral" />
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
            {result.categoryScores.map((cs) => {
              const catInfo = CATEGORIES.find(c => c.key === cs.category)!;
              const barColor = cs.percentage >= 80 ? 'bg-emerald-500' : cs.percentage >= 60 ? 'bg-teal-500' : cs.percentage >= 40 ? 'bg-amber-500' : 'bg-red-500';

              return (
                <div key={cs.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{catInfo.icon}</span>
                      <span className="font-medium text-sm">{cs.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{cs.score}/{cs.maxScore}</span>
                      <span className={`text-sm font-bold ${
                        cs.percentage >= 80 ? 'text-emerald-600' : cs.percentage >= 60 ? 'text-teal-600' : cs.percentage >= 40 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {cs.percentage.toFixed(1)}%
                      </span>
                    </div>
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
                <div key={cs.category} className="bg-muted/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{catInfo.icon}</span>
                    <h4 className="font-semibold">{cs.label}</h4>
                    <Badge variant={cs.percentage >= 60 ? 'secondary' : 'destructive'} className="ml-auto">
                      {cs.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recommendations[cs.category]}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Visibility Gaps */}
        {result.visibilityGaps.length > 0 && (
          <Card className="border-0 shadow-lg mb-6 border-l-4 border-l-amber-400">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                Lacunas de Visibilidade
              </CardTitle>
              <CardDescription>
                {result.visibilityGaps.length} {result.visibilityGaps.length === 1 ? 'pergunta sem informação clara' : 'perguntas sem informação clara'} — indicam necessidade de indicadores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.visibilityGaps.map((gap, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg p-3">
                  <span className="font-bold text-amber-500 shrink-0">{i + 1}.</span>
                  <span>{gap}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Specialist Note */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-full medical-gradient flex items-center justify-center text-white shrink-0">
                <User className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Klever Oliveira Lopes</strong> — Especialista em Esterilização e CME.
                  As recomendações acima são baseadas na análise das suas respostas e nas melhores práticas
                  do setor. Para uma avaliação mais aprofundada, entre em contato para uma consultoria personalizada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRestart} variant="outline" size="lg" className="rounded-xl">
            <RotateCcw className="w-4 h-4 mr-2" />
            Iniciar Novo Checkup
          </Button>
          <Button onClick={handleDownload} size="lg" className="medical-gradient border-0 text-white hover:opacity-90 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Baixar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================
// Main App
// ============================
export default function Home() {
  const [screen, setScreen] = useState<ScreenType>('intro');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({ name: '', position: '', phone: '', email: '', establishmentType: '', bedCount: '', cmeProfessionals: '', region: '', state: '' });
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [responses, setResponses] = useState<Map<string, number>>(new Map());
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const calculateResults = useCallback(() => {
    const visibilityGaps: string[] = [];

    const categoryScores: CategoryScore[] = CATEGORIES.map((cat) => {
      const catQuestions = checkupQuestions.filter(q => q.category === cat.key);
      let score = 0;
      let maxScore = 0;

      catQuestions.forEach(q => {
        const answer = responses.get(q.id);
        if (answer !== undefined && answer > 0) {
          score += answer * q.weight;
          maxScore += 4 * q.weight;
        }
        // Collect visibility gaps
        if (answer === 0) {
          const opt = q.options.find(o => o.value === 0);
          if (opt && opt.impact.startsWith('FALTA DE VISIBILIDADE')) {
            visibilityGaps.push(q.question);
          }
        }
      });

      return {
        category: cat.key,
        label: cat.label,
        score,
        maxScore,
        percentage: maxScore > 0 ? (score / maxScore) * 100 : 0,
      };
    });

    const totalScore = categoryScores.reduce((sum, cs) => sum + cs.score, 0);
    const totalMax = categoryScores.reduce((sum, cs) => sum + cs.maxScore, 0);
    const totalPercentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

    const classification = getClassification(totalPercentage);

    const responseArray: AssessmentResponse[] = Array.from(responses.entries()).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    setResult({
      totalScore,
      totalPercentage,
      classification,
      categoryScores,
      responses: responseArray,
      visibilityGaps,
    });
  }, [responses]);

  const handleStart = () => {
    setScreen('register1');
  };

  const handleRegisterNext = () => {
    setScreen('register2');
  };

  const handleConsentBack = () => {
    setScreen('register2');
  };

  const handleAssessmentStart = () => {
    setScreen('assessment');
  };

  const handleAnswer = (questionId: string, answer: number) => {
    setResponses(prev => {
      const next = new Map(prev);
      next.set(questionId, answer);
      return next;
    });
  };

  const handleFinish = async () => {
    calculateResults();
    // Save to DB and show thank you
    try {
      const responsesObj: Record<string, number> = {};
      responses.forEach((val, key) => { responsesObj[key] = val; });

      const currentResult = {
        totalScore: result?.totalScore ?? 0,
        totalPercentage: result?.totalPercentage ?? 0,
        classification: result?.classification,
        categoryScores: result?.categoryScores ?? [],
        responses: result?.responses ?? [],
        visibilityGaps: result?.visibilityGaps ?? [],
      };

      await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationData,
          responses: responsesObj,
          result: currentResult,
        }),
      });
    } catch (err) {
      console.error('Error saving assessment:', err);
    }
    setScreen('thankyou');
  };

  const handleRestart = () => {
    setScreen('intro');
    setRegistrationData({ name: '', position: '', phone: '', email: '', establishmentType: '', bedCount: '', cmeProfessionals: '', region: '', state: '' });
    setConsent1(false);
    setConsent2(false);
    setResponses(new Map());
    setResult(null);
  };

  switch (screen) {
    case 'intro':
      return <IntroScreen onStart={handleStart} />;
    case 'register1':
      return (
        <RegisterScreen1
          data={registrationData}
          onChange={setRegistrationData}
          onNext={handleRegisterNext}
          onBack={() => setScreen('intro')}
        />
      );
    case 'register2':
      return (
        <RegisterScreen2
          data={registrationData}
          onChange={setRegistrationData}
          onNext={() => setScreen('consent')}
          onBack={() => setScreen('register1')}
        />
      );
    case 'consent':
      return (
        <ConsentScreen
          consent1={consent1}
          consent2={consent2}
          onConsentChange={(c1, c2) => { setConsent1(c1); setConsent2(c2); }}
          onStart={handleAssessmentStart}
          onBack={handleConsentBack}
        />
      );
    case 'assessment':
      return (
        <AssessmentScreen
          responses={responses}
          onAnswer={handleAnswer}
          onFinish={handleFinish}
        />
      );
    case 'thankyou':
      return <ThankYouScreen />;
    default:
      return <IntroScreen onStart={handleStart} />;
  }
}
