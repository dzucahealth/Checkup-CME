"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  Shield,
  FileText,
  DollarSign,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Download,
  User,
  Building2,
  ChevronRight,
  ClipboardList,
  TrendingUp,
  Star,
  Award,
  BarChart3,
  RotateCcw,
  HeartPulse,
  Activity,
  Info,
  Leaf,
  Lock,
  BedDouble,
  Users,
  MapPin,
  Hospital,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { checkupQuestions } from "@/lib/checkup-questions";
import {
  CATEGORIES,
  ESTABLISHMENT_TYPES,
  BED_COUNT_OPTIONS,
  CME_PROFESSIONALS_OPTIONS,
  REGIONS,
  CategoryKey,
  RegistrationData,
  AssessmentResult,
  getClassification,
  getClassificationColor,
  getClassificationBg,
} from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

function CircularProgress({
  percentage,
  size = 180,
  strokeWidth = 12,
  label,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 80
      ? "#059669"
      : percentage >= 60
        ? "#0D9488"
        : percentage >= 40
          ? "#D97706"
          : "#DC2626";

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
            style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-muted-foreground mt-1">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function IntroScreen({
  onStart,
  hasExistingAssessment,
}: {
  onStart: () => void;
  hasExistingAssessment?: boolean;
}) {
  const { user, logout } = useAuth();
  return (
    <div className="animate-fade-in min-h-screen flex flex-col bg-white">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-teal-600" />
            <span className="font-bold text-gray-900">
              Checkup CME Inteligente
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {hasExistingAssessment && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Você tem uma avaliação em andamento. Clique em "Continuar" para
              retomar de onde parou.
            </span>
          </div>
        </div>
      )}

      <section className="pt-12 sm:pt-16 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-2 mb-6">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">
              Diagnóstico de Gestão, Processo e Tecnologia
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Checkup CME
            <span className="block text-teal-600">Inteligente</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Descubra o ranking da sua CME e receba um diagnóstico personalizado
            com recomendações
          </p>
        </div>
      </section>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pb-16">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center">
                <FileText className="w-7 h-7 text-sky-500" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">
                Diagnóstico Personalizado
              </h3>
              <p className="text-sm text-gray-500">
                Receba um diagnóstico completo com pontos críticos e
                recomendações específicas para sua CME.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">
                Economia Estimada
              </h3>
              <p className="text-sm text-gray-500">
                Saiba quanto sua CME pode economizar com melhorias em processos
                e tecnologia.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center">
                <Target className="w-7 h-7 text-violet-500" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">
                Plano de Ação
              </h3>
              <p className="text-sm text-gray-500">
                Quick wins e próximos passos claros para transformar sua CME.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10 border border-gray-100 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5 text-teal-600" />O Checkup Avalia 4
              Dimensões
            </CardTitle>
            <CardDescription>
              {checkupQuestions.length} questões distribuídas em 4 categorias
              estratégicas
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
                  <span className="font-medium text-sm text-gray-800">
                    {cat.label}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-white border border-gray-200"
                  >
                    {cat.questionCount} questões
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-10 border border-gray-100 shadow-md overflow-hidden">
          <div className="md:flex">
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
            <CardContent className="pt-8 pb-8 px-6 sm:px-8 flex flex-col justify-center">
              <h3 className="font-bold text-xl text-gray-900 mb-1">
                Klever Lopes
              </h3>
              <p className="text-sm text-teal-600 font-medium mb-5">
                Especialista em Esterilização e CME
              </p>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  Eu sou <strong className="text-gray-900">Klever Lopes</strong>
                  , especialista em CME, e estou disponibilizando{" "}
                  <strong className="text-gray-900">
                    gratuitamente, por tempo limitado
                  </strong>
                  , este Check Up CME INTELIGENTE para ajudar você, gestor, a
                  fazer uma leitura mais clara, estratégica e sincera da sua
                  operação.
                </p>
                <p>
                  Para que o resultado tenha qualidade, preciso que suas
                  respostas sejam francas e conscientes. Eu sei que o seu dia é
                  corrido, mas reserve esse momento para se conectar com a
                  realidade da sua CME. Essa pode ser uma experiência reveladora
                  e muito valiosa para sua gestão.
                </p>
                <p>
                  Neste check-up, o nome da sua instituição{" "}
                  <strong className="text-gray-900">não será solicitado</strong>
                  . A proposta é permitir que você responda com mais liberdade,
                  segurança e sinceridade.
                </p>
                <p className="font-semibold text-gray-900">
                  Clique no botão abaixo e comece sua jornada do checkup CME
                  Inteligente AGORA.
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="text-center">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 border-0 text-white shadow-lg px-10 py-6 text-base font-semibold rounded-xl h-auto"
          >
            {hasExistingAssessment ? (
              <>
                Continuar Avaliação <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Iniciar Checkup Gratuito <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          <p className="text-xs text-gray-400 mt-3">
            {hasExistingAssessment
              ? "⏱ Avaliação salva • Continue de onde parou"
              : "⏱ Duração estimada: 15-20 minutos • 100% gratuito • Por tempo limitado"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckupPage() {
  const { token } = useAuth();
  const [screen, setScreen] = useState<
    "intro" | "register1" | "register2" | "consent" | "assessment" | "thankyou"
  >("intro");
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: "",
    position: "",
    phone: "",
    email: "",
    establishmentType: "",
    bedCount: "",
    cmeProfessionals: "",
    region: "",
    state: "",
  });
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [responses, setResponses] = useState<Map<string, number>>(new Map());
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingAssessment, setHasExistingAssessment] = useState(false);

  useEffect(() => {
    async function loadExistingAssessment() {
      if (!token) return;
      try {
        const res = await fetch("/api/assessment/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.assessment && data.responses) {
          setAssessmentId(data.assessment.id);
          setRegistrationData({
            name: data.assessment.name || "",
            position: data.assessment.position || "",
            phone: data.assessment.phone || "",
            email: data.assessment.email || "",
            establishmentType: data.assessment.establishmentType || "",
            bedCount: data.assessment.bedCount || "",
            cmeProfessionals: data.assessment.cmeProfessionals || "",
            region: data.assessment.region || "",
            state: data.assessment.state || "",
          });
          setConsent1(data.assessment.consentGiven || false);
          setConsent2(data.assessment.consentGiven || false);
          const responsesMap = new Map<string, number>();
          Object.entries(data.responses).forEach(([qId, ans]) => {
            responsesMap.set(qId, ans as number);
          });
          setResponses(responsesMap);
          if (data.assessment.status === "completed") {
            setScreen("thankyou");
          } else {
            setHasExistingAssessment(true);
          }
        }
      } catch (e) {
        console.error("Error loading existing assessment:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadExistingAssessment();
  }, []);

  const handleStart = async () => {
    if (hasExistingAssessment && assessmentId) {
      // Se já tem avaliação mas não deu consentimento, vai para consent
      // Se já deu consentimento, vai para assessment
      const consentGiven = registrationData.name !== ""; // simplificado: se tem dados de registro, tem consentimento
      if (consentGiven) {
        setScreen("assessment");
      } else {
        setScreen("consent");
      }
      return;
    }
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          createOnly: true,
          registrationData: {
            name: "",
            position: "",
            phone: "",
            email: "",
            establishmentType: "",
            bedCount: "",
            cmeProfessionals: "",
            region: "",
            state: "",
            consentGiven: false,
          },
        }),
      });
      const data = await res.json();
      if (data.id) {
        setAssessmentId(data.id);
      }
    } catch (e) {
      console.error("Error creating assessment:", e);
    }
    setScreen("register1");
  };
  const handleRegister1Next = () => {
    setScreen("register2");
  };
  const handleRegister2Next = () => {
    setScreen("consent");
  };
  const handleConsentStart = async () => {
    if (assessmentId) {
      try {
        await fetch(`/api/assessment/${assessmentId}/progress`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            registrationData,
            consentGiven: true,
          }),
        });
      } catch (e) {
        console.error("Error saving registration data:", e);
      }
    }
    setScreen("assessment");
  };

  const handleAnswer = async (questionId: string, answer: number) => {
    setResponses((prev) => {
      const next = new Map(prev);
      next.set(questionId, answer);
      return next;
    });

    if (assessmentId) {
      const responsesObj: Record<string, number> = {};
      responses.forEach((val, key) => {
        responsesObj[key] = val;
      });
      responsesObj[questionId] = answer;

      try {
        await fetch(`/api/assessment/${assessmentId}/progress`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ allResponses: responsesObj }),
        });
      } catch (e) {
        console.error("Error saving progress:", e);
      }
    }
  };

  const handleFinish = useCallback(async () => {
    const responsesObj: Record<string, number> = {};
    responses.forEach((val, key) => {
      responsesObj[key] = val;
    });

    const categoryScores = CATEGORIES.map((cat) => {
      const catQuestions = checkupQuestions.filter(
        (q) => q.category === cat.key,
      );
      let score = 0,
        maxScore = 0;
      catQuestions.forEach((q) => {
        const ans = responsesObj[q.id];
        if (ans !== undefined) {
          score += ans * q.weight;
          maxScore += 4 * q.weight;
        }
      });
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      return { category: cat.key, score, maxScore, percentage };
    });

    const totalScore = categoryScores.reduce((acc, cat) => acc + cat.score, 0);
    const totalMaxScore = categoryScores.reduce(
      (acc, cat) => acc + cat.maxScore,
      0,
    );
    const totalPercentage =
      totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

    const newResult: AssessmentResult = {
      totalPercentage,
      totalScore,
      categoryScores,
      classification: getClassification(totalPercentage),
      recommendations: {},
    };

    setResult(newResult);

    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          registrationData,
          responses: responsesObj,
          result: newResult,
        }),
      });
    } catch (e) {
      console.error("Error saving assessment:", e);
    }

    setScreen("thankyou");
  }, [responses, registrationData]);

  const handleRestart = () => {
    setScreen("intro");
    setRegistrationData({
      name: "",
      position: "",
      phone: "",
      email: "",
      establishmentType: "",
      bedCount: "",
      cmeProfessionals: "",
      region: "",
      state: "",
    });
    setConsent1(false);
    setConsent2(false);
    setResponses(new Map());
    setResult(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  switch (screen) {
    case "intro":
      return (
        <IntroScreen
          onStart={handleStart}
          hasExistingAssessment={hasExistingAssessment}
        />
      );
    case "register1":
      return (
        <RegisterScreen1
          data={registrationData}
          onChange={setRegistrationData}
          onNext={handleRegister1Next}
          onBack={() => setScreen("intro")}
        />
      );
    case "register2":
      return (
        <RegisterScreen2
          data={registrationData}
          onChange={setRegistrationData}
          onNext={handleRegister2Next}
          onBack={() => setScreen("register1")}
        />
      );
    case "consent":
      return (
        <ConsentScreen
          consent1={consent1}
          consent2={consent2}
          onConsentChange={(c1, c2) => {
            setConsent1(c1);
            setConsent2(c2);
          }}
          onStart={handleConsentStart}
          onBack={() => setScreen("register2")}
        />
      );
    case "assessment":
      return (
        <AssessmentScreen
          responses={responses}
          onAnswer={handleAnswer}
          onFinish={handleFinish}
        />
      );
    case "thankyou":
      return <ThankYouScreen onRestart={handleRestart} />;
    default:
      return (
        <IntroScreen
          onStart={handleStart}
          hasExistingAssessment={hasExistingAssessment}
        />
      );
  }
}

function RegisterScreen1({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: RegistrationData;
  onChange: (data: RegistrationData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { logout } = useAuth();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!data.position.trim()) newErrors.position = "Cargo é obrigatório";
    if (!data.phone.trim()) newErrors.phone = "Telefone/WhatsApp é obrigatório";
    if (!data.email.trim()) newErrors.email = "Email é obrigatório";
    if (!data.establishmentType)
      newErrors.establishmentType = "Selecione o tipo de estabelecimento";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span className="ml-1">Dados Pessoais</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span className="ml-1">Dados da Instituição</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span className="ml-1">Consentimento</span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <User className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Dados Pessoais</CardTitle>
            <CardDescription>
              Informe seus dados pessoais e o tipo de estabelecimento para
              personalizar o checkup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={data.name}
                onChange={(e) => onChange({ ...data, name: e.target.value })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                placeholder="Ex: Enfermeiro Responsável, Gestor do CME"
                value={data.position}
                onChange={(e) =>
                  onChange({ ...data, position: e.target.value })
                }
                className={errors.position ? "border-destructive" : ""}
              />
              {errors.position && (
                <p className="text-xs text-destructive">{errors.position}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (WhatsApp)</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={data.phone}
                onChange={(e) => onChange({ ...data, phone: e.target.value })}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={data.email}
                onChange={(e) => onChange({ ...data, email: e.target.value })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-3">
              <Label>Tipo de Estabelecimento</Label>
              {errors.establishmentType && (
                <p className="text-xs text-destructive">
                  {errors.establishmentType}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ESTABLISHMENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      onChange({ ...data, establishmentType: type.id })
                    }
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${data.establishmentType === type.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card"}`}
                  >
                    <span className="text-xl shrink-0">{type.icon}</span>
                    <span className="text-sm font-medium leading-tight">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={onBack}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={handleNext} className="flex-[2]" size="lg">
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

function RegisterScreen2({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: RegistrationData;
  onChange: (data: RegistrationData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedRegion = REGIONS.find((r) => r.id === data.region);
  const availableStates = selectedRegion?.states || [];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.bedCount) newErrors.bedCount = "Selecione a quantidade de leitos";
    if (!data.cmeProfessionals)
      newErrors.cmeProfessionals = "Selecione a quantidade de profissionais";
    if (!data.region) newErrors.region = "Selecione a região";
    if (!data.state) newErrors.state = "Selecione o estado";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Dados Pessoais</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm font-medium text-primary">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span className="ml-1">Dados da Instituição</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span className="ml-1">Consentimento</span>
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
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-primary" />
                Quantidade de Leitos
              </Label>
              {errors.bedCount && (
                <p className="text-xs text-destructive">{errors.bedCount}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BED_COUNT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange({ ...data, bedCount: option.id })}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${data.bedCount === option.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card"}`}
                  >
                    <span className="text-lg shrink-0">🛏️</span>
                    <span className="text-sm font-medium leading-tight">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Quantidade de profissionais que atuam na CME
              </Label>
              {errors.cmeProfessionals && (
                <p className="text-xs text-destructive">
                  {errors.cmeProfessionals}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CME_PROFESSIONALS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      onChange({ ...data, cmeProfessionals: option.id })
                    }
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${data.cmeProfessionals === option.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card"}`}
                  >
                    <span className="text-lg shrink-0">👷</span>
                    <span className="text-sm font-medium leading-tight">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Região do Brasil onde está localizada a instituição
              </Label>
              {errors.region && (
                <p className="text-xs text-destructive">{errors.region}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() =>
                      onChange({ ...data, region: region.id, state: "" })
                    }
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${data.region === region.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card"}`}
                  >
                    <span className="text-lg shrink-0">📍</span>
                    <span className="text-sm font-medium leading-tight">
                      {region.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {data.region && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Estado
                </Label>
                {errors.state && (
                  <p className="text-xs text-destructive">{errors.state}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableStates.map((state) => (
                    <button
                      key={state.id}
                      type="button"
                      onClick={() => onChange({ ...data, state: state.id })}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${data.state === state.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card"}`}
                    >
                      <span className="text-sm font-medium leading-tight">
                        {state.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={onBack}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={handleNext} className="flex-[2]" size="lg">
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

function ConsentScreen({
  consent1,
  consent2,
  onConsentChange,
  onStart,
  onBack,
}: {
  consent1: boolean;
  consent2: boolean;
  onConsentChange: (c1: boolean, c2: boolean) => void;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
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
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span className="ml-1">Consentimento</span>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-violet-600" />
            </div>
            <CardTitle className="text-2xl">Termos de Consentimento</CardTitle>
            <CardDescription>
              Leia atentamente e aceite os termos abaixo para iniciar a
              avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-5 space-y-4 text-sm text-muted-foreground leading-relaxed max-h-72 overflow-y-auto custom-scrollbar">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Política de Privacidade e Termos de Uso
              </p>
              <Separator />
              <p>
                <strong className="text-foreground">Finalidade:</strong> Os
                dados coletados serão utilizados para diagnóstico de avaliação
                do CME, identificação de oportunidades de melhoria e
                recomendações personalizadas.
              </p>
              <p>
                <strong className="text-foreground">Base Legal:</strong> O
                tratamento dos dados é fundamentado no consentimento do titular
                (Art. 7º, I, LGPD) e legítimo interesse para melhoria de
                serviços de saúde.
              </p>
              <p>
                <strong className="text-foreground">Compartilhamento:</strong>{" "}
                Consentimento para coleta e tratamento de nome, cargo, telefone,
                email, tipo de estabelecimento, dados operacionais e respostas
                do questionário; sem compartilhamento a terceiros sem
                consentimento, exceto obrigação legal ou regulatória.
              </p>
              <p>
                <strong className="text-foreground">Retenção:</strong> Os dados
                serão mantidos enquanto necessários ou até exclusão por e-mail
                contato@cmeinteligente.com.br.
              </p>
              <p>
                <strong className="text-foreground">Segurança:</strong> Medidas
                técnicas e organizacionais para proteger os dados.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent1"
                  checked={consent1}
                  onCheckedChange={(checked) =>
                    onConsentChange(!!checked, consent2)
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor="consent1"
                  className="text-sm font-medium leading-tight cursor-pointer"
                >
                  Li e aceito os Termos de Consentimento e a Política de
                  Privacidade descritos acima.
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent2"
                  checked={consent2}
                  onCheckedChange={(checked) =>
                    onConsentChange(consent1, !!checked)
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor="consent2"
                  className="text-sm font-medium leading-tight cursor-pointer"
                >
                  Autorizo o uso dos dados fornecidos para fins de melhoria
                  contínua dos processos do CME.
                </Label>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 leading-relaxed space-y-3">
                <p className="font-bold text-base text-amber-900">
                  Aviso sobre o caráter do check-up
                </p>
                <p>
                  O CHECK UP CME INTELIGENTE possui caráter educacional,
                  orientativo e de diagnóstico de gestão.
                </p>
                <p className="font-semibold">Este material não substitui:</p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li>avaliação técnica presencial;</li>
                  <li>assessoria especializada;</li>
                  <li>exigências legais e sanitárias aplicáveis;</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onBack}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={onStart}
                className="flex-[2]"
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

function AssessmentScreen({
  responses,
  onAnswer,
  onFinish,
}: {
  responses: Map<string, number>;
  onAnswer: (questionId: string, answer: number) => void;
  onFinish: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, logout } = useAuth();

  const TOTAL_QUESTIONS = checkupQuestions.length;
  const currentQuestion = checkupQuestions[currentIndex];
  const currentCategory = currentQuestion.category;
  const categoryInfo = CATEGORIES.find((c) => c.key === currentCategory)!;
  const totalAnswered = responses.size;

  const goToNext = () => {
    if (currentIndex < checkupQuestions.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };
  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const currentAnswer = responses.get(currentQuestion.id) ?? null;
  const allAnswered = totalAnswered === TOTAL_QUESTIONS;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Questão {currentIndex + 1} de {TOTAL_QUESTIONS}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <Progress
            value={(totalAnswered / TOTAL_QUESTIONS) * 100}
            className="h-2"
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => {
            const catQuestions = checkupQuestions.filter(
              (q) => q.category === cat.key,
            );
            const catAnswered = catQuestions.filter((q) =>
              responses.has(q.id),
            ).length;
            const isActive = cat.key === currentCategory;
            const isComplete = catAnswered === catQuestions.length;
            return (
              <Badge
                key={cat.key}
                variant={
                  isActive ? "default" : isComplete ? "secondary" : "outline"
                }
                className={`text-xs ${isActive ? "" : "opacity-70"}`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label} ({catAnswered}/{catQuestions.length})
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div
              className="px-6 py-4 text-white"
              style={{ backgroundColor: categoryInfo.color }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{categoryInfo.icon}</span>
                  <span className="font-semibold">{categoryInfo.label}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold leading-relaxed mb-1">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentAnswer === option.value;
                  const isZero = option.value === 0;
                  const displayValue = isZero ? "?" : option.value;
                  const buttonClasses = isSelected
                    ? isZero
                      ? "border-amber-400 bg-amber-50 shadow-sm"
                      : "border-teal-600 bg-teal-100 shadow-sm"
                    : "border-border bg-card hover:border-teal-300 hover:bg-teal-50";
                  const badgeClasses =
                    isSelected && isZero
                      ? "bg-amber-500 border-amber-500 text-white"
                      : isSelected
                        ? "bg-teal-600 border-teal-600 text-white"
                        : "border-muted-foreground/30 text-muted-foreground";
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onAnswer(currentQuestion.id, option.value)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${buttonClasses}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border-2 ${badgeClasses}`}
                      >
                        {displayValue}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={
                            isZero
                              ? "font-medium text-sm text-amber-700"
                              : "font-medium text-sm"
                          }
                        >
                          {option.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {option.impact}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 mt-0.5 ${isZero ? "text-amber-500" : "text-teal-600"}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPrev}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            {currentIndex < checkupQuestions.length - 1 ? (
              <Button onClick={goToNext} disabled={currentAnswer === null}>
                Próxima
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={onFinish} disabled={!allAnswered}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThankYouScreen({ onRestart }: { onRestart: () => void }) {
  const { logout } = useAuth();

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl">
              Obrigado por completar o Checkup CME Inteligente!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground leading-relaxed">
              Suas respostas foram registradas com sucesso. Nosso time está
              preparando seu diagnóstico personalizado.
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-teal-900 text-center">
                O que acontece agora?
              </p>
              <ul className="space-y-2 text-sm text-teal-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Seus dados serão analisados</span>
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
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
              <Button onClick={onRestart} className="bg-teal-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nova Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
