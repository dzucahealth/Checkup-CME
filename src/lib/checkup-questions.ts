// Estrutura de perguntas do Checkup CME Inteligente
// Organizado por categorias: Gestão, Processo, Tecnologia e Financeiro/Riscos

export interface Question {
  id: string;
  category: 'gestao' | 'processo' | 'tecnologia' | 'financeiro';
  question: string;
  description?: string;
  options: {
    value: number;
    label: string;
    impact: string; // Descrição do impacto desta resposta
  }[];
  weight: number; // Peso da pergunta no cálculo final
}

export interface CategoryResult {
  category: string;
  categoryName: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'critico' | 'necessita_melhorias' | 'precisa_tecnologia' | 'em_desenvolvimento';
  findings: string[];
  recommendations: string[];
}

export interface CheckupResult {
  overallScore: number;
  overallLevel: 'critico' | 'necessita_melhorias' | 'precisa_tecnologia' | 'em_desenvolvimento';
  categories: CategoryResult[];
  mainProblems: string[];
  quickWins: string[];
  economyEstimate: {
    min: number;
    max: number;
    description: string;
  };
  nextSteps: string[];
  financialRisk?: {
    riskLevel: string;
    estimatedLoss: string;
    description: string;
  };
  visibilityGaps?: string[]; // Novo: questões onde não há informação
}

export const checkupQuestions: Question[] = [
  // ==================== GESTÃO ====================
  {
    id: 'gestao_1',
    category: 'gestao',
    question: 'Quantos itens sua CME esteriliza por mês?',
    description: 'O volume de processamento indica a complexidade e necessidade de controle.',
    options: [
      { 
        value: 1, 
        label: 'Até 500 itens/mês',
        impact: 'Volume baixo, mas ainda assim necessita controle organizado e rastreabilidade'
      },
      { 
        value: 2, 
        label: '501 a 2.000 itens/mês',
        impact: 'Volume médio que exige sistema organizado para evitar perdas e gargalos'
      },
      { 
        value: 3, 
        label: '2.001 a 5.000 itens/mês',
        impact: 'Volume significativo que demanda controle rigoroso e indicadores claros'
      },
      { 
        value: 4, 
        label: 'Mais de 5.000 itens/mês',
        impact: 'Alto volume que requer sistema especializado para gestão eficiente'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: a ausência desta informação indica necessidade de indicadores básicos de produtividade'
      },
    ],
    weight: 1,
  },
  {
    id: 'gestao_2',
    category: 'gestao',
    question: 'Quantas cirurgias sua instituição realiza por mês?',
    description: 'O volume cirúrgico impacta diretamente na demanda da CME.',
    options: [
      { 
        value: 1, 
        label: 'Até 50 cirurgias/mês',
        impact: 'Volume cirúrgico baixo, mas exige organização para atender demandas'
      },
      { 
        value: 2, 
        label: '51 a 200 cirurgias/mês',
        impact: 'Volume médio com necessidade de planejamento de kits e instrumental'
      },
      { 
        value: 3, 
        label: '201 a 500 cirurgias/mês',
        impact: 'Volume alto que exige controle rigoroso de turn-around e disponibilidade'
      },
      { 
        value: 4, 
        label: 'Mais de 500 cirurgias/mês',
        impact: 'Volume elevado que requer sistema integrado com centro cirúrgico'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: a ausência desta informação indica desconnect entre CME e centro cirúrgico'
      },
    ],
    weight: 1,
  },
  {
    id: 'gestao_3',
    category: 'gestao',
    question: 'Quantos kits/caixas de instrumentais sua CME gerencia?',
    description: 'O tamanho do arsenal indica complexidade de gestão.',
    options: [
      { 
        value: 1, 
        label: 'Até 50 kits',
        impact: 'Arsenal pequeno, controle pode ser simplificado mas necessita organização'
      },
      { 
        value: 2, 
        label: '51 a 150 kits',
        impact: 'Arsenal médio que demanda controle de composição e manutenção'
      },
      { 
        value: 3, 
        label: '151 a 300 kits',
        impact: 'Arsenal grande que requer controle detalhado de instrumentais por kit'
      },
      { 
        value: 4, 
        label: 'Mais de 300 kits',
        impact: 'Arsenal extenso que exige sistema para gestão de composição e rastreabilidade'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: a ausência desta informação indica necessidade de inventário estruturado'
      },
    ],
    weight: 1,
  },
  {
    id: 'gestao_4',
    category: 'gestao',
    question: 'Sua CME possui enfermeiro dedicado exclusivamente ao setor?',
    description: 'A presença de enfermeiro dedicado garante supervisão técnica qualificada.',
    options: [
      { 
        value: 1, 
        label: 'Não - não temos enfermeiro no setor',
        impact: 'Ausência de supervisão técnica, risco regulatório e de qualidade'
      },
      { 
        value: 2, 
        label: 'Enfermeiro divide atendimento com outros setores',
        impact: 'Supervisão parcial, possível falta de foco nas questões da CME'
      },
      { 
        value: 3, 
        label: 'Sim, mas sem tempo para gestão estratégica',
        impact: 'Supervisão operacional existe, mas gestão estratégica é limitada'
      },
      { 
        value: 4, 
        label: 'Sim, enfermeiro dedicado com tempo para gestão',
        impact: 'Supervisão técnica completa, condições para melhoria contínua'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecimento sobre a estrutura técnica do setor'
      },
    ],
    weight: 3,
  },
  {
    id: 'gestao_5',
    category: 'gestao',
    question: 'Como é feito o controle de insumos no setor da CME?',
    description: 'O controle de insumos impacta diretamente nos custos e na disponibilidade.',
    options: [
      { 
        value: 1, 
        label: 'Manual - papel ou planilhas não integradas',
        impact: 'Desperdício oculto, rupturas frequentes, compras de emergência'
      },
      { 
        value: 2, 
        label: 'Controle de estoque geral pelo ERP hospitalar',
        impact: 'Visão administrativa, mas sem vincular consumo ao processamento real'
      },
      { 
        value: 3, 
        label: 'Sistema de controle, mas sem integração com ciclos/processos',
        impact: 'Controle existe, mas sem precisão por tipo de processamento'
      },
      { 
        value: 4, 
        label: 'Controle integrado vinculado a cada ciclo/processo',
        impact: 'Custo real por processo, identificação de desperdício, economia comprovada'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: ausência de controle de insumos indica gestão deficiente'
      },
    ],
    weight: 2,
  },
  {
    id: 'gestao_6',
    category: 'gestao',
    question: 'Como sua CME registra e controla o processamento dos materiais?',
    description: 'O controle do processamento é fundamental para rastreabilidade e segurança.',
    options: [
      { 
        value: 1, 
        label: 'Apenas papel e planilhas manuais',
        impact: 'Alto risco de perda de informações, impossibilidade de rastreabilidade confiável'
      },
      { 
        value: 2, 
        label: 'Planilhas eletrônicas (Excel)',
        impact: 'Risco de erros manuais, falta de validações automáticas, dados não integrados'
      },
      { 
        value: 3, 
        label: 'Módulo de estoque do ERP hospitalar (MV, Tasy, etc)',
        impact: 'Controle administrativo, mas sem supervisão técnica do processo de esterilização'
      },
      { 
        value: 4, 
        label: 'Sistema especializado para CME com rastreabilidade completa',
        impact: 'Controle técnico-operacional ativo com validações e rastreabilidade estruturada'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecimento sobre o sistema de controle é um risco'
      },
    ],
    weight: 3,
  },
  {
    id: 'gestao_7',
    category: 'gestao',
    question: 'Sua equipe consegue identificar rapidamente qual paciente recebeu cada instrumental processado?',
    description: 'A RDC 15 exige rastreabilidade do processamento ao paciente.',
    options: [
      { 
        value: 1, 
        label: 'Não temos como fazer essa vinculação',
        impact: 'Não conformidade regulatória grave, risco jurídico e assistencial elevado'
      },
      { 
        value: 2, 
        label: 'É possível, mas demora horas ou dias de busca manual',
        impact: 'Dificuldade de resposta em investigações de infecção, processos ineficientes'
      },
      { 
        value: 3, 
        label: 'Parcialmente - alguns itens têm rastreabilidade, outros não',
        impact: 'Rastreabilidade incompleta, riscos em investigações epidemiológicas'
      },
      { 
        value: 4, 
        label: 'Sim, rastreabilidade completa e imediata de todos os itens',
        impact: 'Conformidade regulatória, segurança assistencial e governança estabelecida'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a rastreabilidade é um risco regulatório'
      },
    ],
    weight: 3,
  },
  {
    id: 'gestao_8',
    category: 'gestao',
    question: 'Sua CME possui indicadores de desempenho estruturados?',
    description: 'Indicadores são essenciais para gestão baseada em dados.',
    options: [
      { 
        value: 1, 
        label: 'Não temos indicadores sistemáticos',
        impact: 'Gestão por intuição, impossibilidade de melhoria contínua baseada em dados'
      },
      { 
        value: 2, 
        label: 'Alguns indicadores isolados, coletados manualmente',
        impact: 'Dados inconsistentes, difícil comparação temporal, análise limitada'
      },
      { 
        value: 3, 
        label: 'Indicadores gerados pelo ERP, mas com pouca profundidade para CME',
        impact: 'Visão administrativa, falta de indicadores técnicos-operacionais específicos'
      },
      { 
        value: 4, 
        label: 'Dashboard completo com indicadores de produtividade, qualidade e custos',
        impact: 'Gestão data-driven, identificação de gargalos, melhoria contínua'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: ausência de indicadores impede gestão estratégica'
      },
    ],
    weight: 2,
  },
  {
    id: 'gestao_9',
    category: 'gestao',
    question: 'Como você calcula o custo real de processamento da sua CME?',
    description: 'Conhecer o custo real é fundamental para decisões estratégicas.',
    options: [
      { 
        value: 1, 
        label: 'Não calculamos - não sabemos o custo real',
        impact: 'Impossibilidade de otimização, decisões sem base econômica'
      },
      { 
        value: 2, 
        label: 'Estimativa geral baseada em despesas totais',
        impact: 'Visão macro, sem detalhamento por tipo de processamento'
      },
      { 
        value: 3, 
        label: 'Cálculo por rateio, mas sem vincular insumos aos processos',
        impact: 'Custos aproximados, sem precisão para análise de rentabilidade'
      },
      { 
        value: 4, 
        label: 'Custo real por kit/caixa/lote com consumo de insumos rastreado',
        impact: 'Precisão total, identificação de desperdícios, negociação com dados'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer os custos impede otimização financeira'
      },
    ],
    weight: 2,
  },

  // ==================== PROCESSO ====================
  {
    id: 'processo_1',
    category: 'processo',
    question: 'Qual a porcentagem do seu arsenal de instrumentais que está em manutenção atualmente?',
    description: 'Instrumentais em manutenção indisponibilizam kits e impactam cirurgias.',
    options: [
      { 
        value: 1, 
        label: 'Mais de 20% do arsenal em manutenção',
        impact: 'Impacto grave na disponibilidade, possível cancelamento de cirurgias'
      },
      { 
        value: 2, 
        label: 'Entre 10% e 20% em manutenção',
        impact: 'Impacto significativo, necessidade de planejamento de reposição'
      },
      { 
        value: 3, 
        label: 'Entre 5% e 10% em manutenção',
        impact: 'Impacto moderado, gestão ativa de manutenção necessária'
      },
      { 
        value: 4, 
        label: 'Menos de 5% em manutenção',
        impact: 'Arsenal bem conservado, gestão preventiva de manutenção adequada'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o estado do arsenal é um risco operacional'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_2',
    category: 'processo',
    question: 'Sua CME realiza teste de funcionalidade dos instrumentais antes do preparo?',
    description: 'Testar a funcionalidade evita problemas durante procedimentos cirúrgicos.',
    options: [
      { 
        value: 1, 
        label: 'Não realizamos - instrumentais seguem sem verificação',
        impact: 'Risco de uso de materiais com defeito, impactos em cirurgias'
      },
      { 
        value: 2, 
        label: 'Verificação visual apenas, sem critério padronizado',
        impact: 'Detecção parcial de problemas, falta de padronização'
      },
      { 
        value: 3, 
        label: 'Teste funcional em alguns instrumentais críticos',
        impact: 'Controle parcial, instrumentais não críticos podem passar com defeito'
      },
      { 
        value: 4, 
        label: 'Teste funcional padronizado para todos os instrumentais',
        impact: 'Garantia de qualidade, redução de problemas em cirurgias'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o processo de verificação é um risco'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_3',
    category: 'processo',
    question: 'Qual é a disponibilidade de água de osmose na sua CME?',
    description: 'A qualidade da água é fundamental para o processo de esterilização.',
    options: [
      { 
        value: 1, 
        label: 'Não temos água de osmose',
        impact: 'Não conformidade com RDC 15, risco de resíduos e corrosão em materiais'
      },
      { 
        value: 2, 
        label: 'Apenas para as autoclaves (esterilização)',
        impact: 'Conformidade parcial, expurgos podem comprometer qualidade da água'
      },
      { 
        value: 3, 
        label: 'Água de osmose nas máquinas de lavagem e autoclaves',
        impact: 'Boa qualidade, mas expurgos manuais podem não usar água adequada'
      },
      { 
        value: 4, 
        label: 'Água de osmose disponível em toda a CME (total)',
        impact: 'Conformidade total, qualidade garantida em todas as etapas'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a qualidade da água é um risco regulatório'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_4',
    category: 'processo',
    question: 'Sua instituição realiza qualificação de todos os equipamentos pelo menos uma vez ao ano?',
    description: 'A qualificação anual é exigência regulatória para equipamentos críticos.',
    options: [
      { 
        value: 1, 
        label: 'Não realizamos qualificação dos equipamentos',
        impact: 'Não conformidade regulatória grave, riscos à segurança do paciente'
      },
      { 
        value: 2, 
        label: 'Apenas alguns equipamentos são qualificados',
        impact: 'Conformidade parcial, risco em equipamentos não qualificados'
      },
      { 
        value: 3, 
        label: 'Qualificação realizada, mas com atrasos ou gaps',
        impact: 'Conformidade existente, mas gestão de cronograma deficiente'
      },
      { 
        value: 4, 
        label: 'Todos os equipamentos qualificados anualmente, em dia',
        impact: 'Conformidade total, cronograma organizado, segurança garantida'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o status de qualificação é um risco grave'
      },
    ],
    weight: 3,
  },
  {
    id: 'processo_5',
    category: 'processo',
    question: 'Sua CME realiza calibração das incubadoras para leitura do Indicador Biológico (IB)?',
    description: 'Incubadoras calibradas garantem resultados confiáveis do Indicador Biológico (IB).',
    options: [
      { 
        value: 1, 
        label: 'Não realizamos calibração',
        impact: 'Resultados de BI não confiáveis, risco de falsos negativos/positivos'
      },
      { 
        value: 2, 
        label: 'Calibração feita esporadicamente',
        impact: 'Resultados intermediários podem não ser confiáveis'
      },
      { 
        value: 3, 
        label: 'Calibração anual, mas sem controle de vencimento automatizado',
        impact: 'Conformidade existe, mas risco de atrasos na recalibração'
      },
      { 
        value: 4, 
        label: 'Calibração em dia com controle automatizado de vencimento',
        impact: 'Confiabilidade total dos resultados, gestão preventiva'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a calibração compromete a confiabilidade'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_6',
    category: 'processo',
    question: 'Sua CME realiza Teste de Limpeza (TL) dos instrumentais após o expurgo?',
    description: 'O Teste de Limpeza (TL) garante que os instrumentais estão adequados para esterilização.',
    options: [
      { 
        value: 1, 
        label: 'Não realizamos Teste de Limpeza (TL)',
        impact: 'Instrumentais podem ser esterilizados sujos, falha no processo'
      },
      { 
        value: 2, 
        label: 'Apenas inspeção visual',
        impact: 'Resíduos não visíveis podem passar, risco de esterilização ineficaz'
      },
      { 
        value: 3, 
        label: 'Teste de Limpeza (TL) em alguns lotes/ciclos',
        impact: 'Controle parcial, alguns instrumentais podem não estar adequadamente limpos'
      },
      { 
        value: 4, 
        label: 'Teste de Limpeza (TL) padronizado e documentado para todos os ciclos',
        impact: 'Garantia de limpeza, esterilização eficaz, conformidade total'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o controle do Teste de Limpeza (TL) é um risco'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_7',
    category: 'processo',
    question: 'Sua CME realiza treinamentos educacionais de rotina com a equipe?',
    description: 'Treinamentos frequentes mantêm a equipe atualizada e reduzem erros.',
    options: [
      { 
        value: 1, 
        label: 'Não realizamos treinamentos sistemáticos',
        impact: 'Equipe desatualizada, erros por falta de conhecimento, não conformidade'
      },
      { 
        value: 2, 
        label: 'Treinamentos apenas quando há mudanças ou problemas',
        impact: 'Equipe reativa, conhecimento defasado, riscos operacionais'
      },
      { 
        value: 3, 
        label: 'Treinamentos anuais ou semestrais',
        impact: 'Atualização periódica, mas intervalo longo pode gerar gaps de conhecimento'
      },
      { 
        value: 4, 
        label: 'Treinamentos a cada 3 meses ou menos (rotina)',
        impact: 'Equipe sempre atualizada, redução de erros, cultura de melhoria contínua'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a capacitação da equipe é um risco'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_8',
    category: 'processo',
    question: 'Além de POPs, sua CME possui instruções de trabalho detalhadas?',
    description: 'Instruções de trabalho complementam os POPs e orientam a prática diária.',
    options: [
      { 
        value: 1, 
        label: 'Não temos nem POPs estruturados',
        impact: 'Ausência de padronização, cada profissional faz de um jeito'
      },
      { 
        value: 2, 
        label: 'Temos POPs, mas sem instruções de trabalho',
        impact: 'Documentação existe, mas falta detalhamento prático para rotina'
      },
      { 
        value: 3, 
        label: 'Instruções de trabalho para alguns processos',
        impact: 'Parcialmente documentado, alguns processos sem orientação detalhada'
      },
      { 
        value: 4, 
        label: 'POPs e instruções de trabalho completos para todos os processos',
        impact: 'Padronização total, suporte à equipe, conformidade garantida'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a documentação indica gestão deficiente'
      },
    ],
    weight: 1,
  },
  {
    id: 'processo_9',
    category: 'processo',
    question: 'Como é feito o controle dos testes: Bowie&Dick (B&D), Indicador Biológico (IB), Indicador Químico (IQ), Pacote Desafio (PCD), Helix, Teste de Limpeza (TL) e Teste de Selagem (TS)?',
    description: 'O controle e registro dos testes de validação são obrigatórios e essenciais para a segurança do processo.',
    options: [
      { 
        value: 1, 
        label: 'Não realizamos todos os testes ou registramos em papel, sem vinculação com os lotes processados',
        impact: 'Não conformidade regulatória, impossibilidade de rastreabilidade, riscos assistenciais graves'
      },
      { 
        value: 2, 
        label: 'Realizamos alguns testes, mas o registro é feito de forma isolada e sem integração',
        impact: 'Controle parcial, difícil consulta, sem vinculação automática com ciclos e lotes'
      },
      { 
        value: 3, 
        label: 'Realizamos e registramos os testes no sistema, mas o processo pode seguir sem validação completa',
        impact: 'Controle passivo, risco de liberação de materiais sem validação de todos os testes'
      },
      { 
        value: 4, 
        label: 'Todos os testes registrados e o sistema bloqueia a liberação sem validação completa de B&D, IB, IQ, PCD, Helix, TL e TS',
        impact: 'Blindagem operacional total, conformidade garantida, segurança do paciente'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o controle dos testes de validação é um risco grave'
      },
    ],
    weight: 3,
  },
  {
    id: 'processo_10',
    category: 'processo',
    question: 'Sua CME consegue impedir que materiais sejam liberados sem passar por todas as etapas do processo?',
    description: 'Pular etapas críticas pode causar infecções e problemas graves.',
    options: [
      { 
        value: 1, 
        label: 'Não temos controle - depende da disciplina da equipe',
        impact: 'Alto risco de falhas, segurança dependente apenas de fator humano'
      },
      { 
        value: 2, 
        label: 'Procedimentos escritos, mas sem validação obrigatória no sistema',
        impact: 'Risco de não conformidade por erro humano ou pressão operacional'
      },
      { 
        value: 3, 
        label: 'Controle parcial - algumas etapas são bloqueadas',
        impact: 'Proteção incompleta, possibilidade de gaps no processo'
      },
      { 
        value: 4, 
        label: 'Sistema com validações obrigatórias em todas as etapas críticas',
        impact: 'Blindagem operacional total, conformidade forçada pelo sistema'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o controle de etapas é um risco grave'
      },
    ],
    weight: 3,
  },
  {
    id: 'processo_11',
    category: 'processo',
    question: 'Como sua CME controla o consumo de insumos por processo/ciclo?',
    description: 'Vincular insumos ao processo permite identificar desperdícios.',
    options: [
      { 
        value: 1, 
        label: 'Não controlamos - compras baseadas em estimativa geral',
        impact: 'Desperdício oculto, rupturas frequentes, compras de emergência'
      },
      { 
        value: 2, 
        label: 'Controle de estoque geral, sem vincular ao processamento',
        impact: 'Visão de consumo, mas sem relação com volume de trabalho'
      },
      { 
        value: 3, 
        label: 'Registro manual de consumo em alguns processos',
        impact: 'Dados parciais, difícil identificar oportunidades de economia'
      },
      { 
        value: 4, 
        label: 'Vinculação automática de insumos por ciclo/processo',
        impact: 'Controle total, identificação de desperdício, economia comprovada'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o consumo impede controle de custos'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_12',
    category: 'processo',
    question: 'Como sua CME identifica e trata materiais preparados e não utilizados (reprocessamento)?',
    description: 'Reprocessamentos desnecessários geram custo e desgaste de materiais.',
    options: [
      { 
        value: 1, 
        label: 'Não temos controle - reprocessamos sem saber o volume',
        impact: 'Custo oculto significativo, desgaste de materiais, desperdício de recursos'
      },
      { 
        value: 2, 
        label: 'Identificamos, mas não temos métrica do impacto financeiro',
        impact: 'Conhecimento do problema, mas sem dimensão para ação'
      },
      { 
        value: 3, 
        label: 'Controlamos o volume, mas sem identificar causas por setor/cirurgia',
        impact: 'Dados parciais, difícil atuar na causa raiz'
      },
      { 
        value: 4, 
        label: 'Rastreamento completo com análise de causas e relatórios por setor',
        impact: 'Visão completa, ações corretivas, redução de custos comprovada'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer reprocessamentos é um custo oculto'
      },
    ],
    weight: 2,
  },

  // ==================== TECNOLOGIA ====================
  {
    id: 'tecnologia_1',
    category: 'tecnologia',
    question: 'Quantos dos seus equipamentos de esterilização têm mais de 10 anos de uso?',
    description: 'Equipamentos antigos podem apresentar falhas e menor eficiência.',
    options: [
      { 
        value: 1, 
        label: 'Mais de 50% dos equipamentos com mais de 10 anos',
        impact: 'Alto risco de falhas, manutenções frequentes, tecnologia obsoleta'
      },
      { 
        value: 2, 
        label: 'Entre 25% e 50% com mais de 10 anos',
        impact: 'Risco moderado, planejamento de substituição necessário'
      },
      { 
        value: 3, 
        label: 'Entre 10% e 25% com mais de 10 anos',
        impact: 'Maior parte renovada, alguns equipamentos precisam de atenção'
      },
      { 
        value: 4, 
        label: 'Menos de 10% ou nenhum equipamento antigo',
        impact: 'Parque tecnológico atualizado, menor risco de falhas'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a idade dos equipamentos é um risco'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_2',
    category: 'tecnologia',
    question: 'Seus equipamentos possuem tecnologia IoT (Internet das Coisas) integrada?',
    description: 'IoT permite monitoramento em tempo real e manutenção preditiva.',
    options: [
      { 
        value: 1, 
        label: 'Não - equipamentos sem conectividade',
        impact: 'Monitoramento manual, impossibilidade de manutenção preditiva'
      },
      { 
        value: 2, 
        label: 'Alguns equipamentos têm conectividade básica',
        impact: 'Monitoramento parcial, dados não integrados ao sistema'
      },
      { 
        value: 3, 
        label: 'Maior parte com IoT, mas sem integração total com sistema CME',
        impact: 'Dados disponíveis, mas não totalmente utilizados na gestão'
      },
      { 
        value: 4, 
        label: 'Todos equipamentos com IoT integrados ao sistema de gestão',
        impact: 'Monitoramento em tempo real, manutenção preditiva, dados integrados'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a tecnologia disponível é um gap'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_3',
    category: 'tecnologia',
    question: 'Os instrumentais da sua CME são gravados (identificação permanente)?',
    description: 'Instrumentais gravados facilitam a rastreabilidade e controle de composição.',
    options: [
      { 
        value: 1, 
        label: 'Não - instrumentais sem identificação permanente',
        impact: 'Impossibilidade de rastreabilidade individual, difícil controle de composição'
      },
      { 
        value: 2, 
        label: 'Parcialmente - apenas alguns instrumentais críticos gravados',
        impact: 'Rastreabilidade limitada, instrumentais comuns sem controle individual'
      },
      { 
        value: 3, 
        label: 'Maior parte gravada, mas sem integração com sistema',
        impact: 'Identificação existe, mas não totalmente aproveitada na gestão'
      },
      { 
        value: 4, 
        label: 'Todos instrumentais gravados e integrados ao sistema',
        impact: 'Rastreabilidade total, controle de composição preciso, gestão eficiente'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a identificação é um gap de controle'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_4',
    category: 'tecnologia',
    question: 'Sua CME possui sistema integrado com as autoclaves para captura automática de ciclos?',
    description: 'Integração elimina erros de digitação e garante dados precisos.',
    options: [
      { 
        value: 1, 
        label: 'Não - registramos ciclos manualmente',
        impact: 'Risco de erros, dados incompletos, tempo da equipe desperdiçado'
      },
      { 
        value: 2, 
        label: 'Autoclaves geram relatórios impressos que arquivamos',
        impact: 'Dados existem, mas não estruturados para análise ou rastreabilidade'
      },
      { 
        value: 3, 
        label: 'Exportamos dados das autoclaves periodicamente',
        impact: 'Integração parcial, possível gap entre ciclos e processamento'
      },
      { 
        value: 4, 
        label: 'Integração automática em tempo real com todas as autoclaves',
        impact: 'Dados precisos, eliminação de erros, rastreabilidade total'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a integração é um gap tecnológico'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_5',
    category: 'tecnologia',
    question: 'Sua CME consegue gerar evidências documentais para auditorias e acreditações automaticamente?',
    description: 'Auditorias e acreditações exigem documentação estruturada.',
    options: [
      { 
        value: 1, 
        label: 'Precisamos compilar tudo manualmente quando solicitado',
        impact: 'Trabalho intenso, risco de dados incompletos, estresse em auditorias'
      },
      { 
        value: 2, 
        label: 'Alguns relatórios são fáceis, outros exigem trabalho manual',
        impact: 'Parcialmente preparado, risco de não conformidade em itens específicos'
      },
      { 
        value: 3, 
        label: 'Relatórios disponíveis, mas em formatos diferentes e dispersos',
        impact: 'Informação existe, mas consolidação consome tempo'
      },
      { 
        value: 4, 
        label: 'Sistema gera automaticamente relatórios estruturados para auditoria',
        impact: 'Prontidão total, conformidade facilitada, profissionalismo'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a prontidão para auditorias é um risco'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_6',
    category: 'tecnologia',
    question: 'Sua CME possui integração com o sistema hospitalar (prontuário, centro cirúrgico)?',
    description: 'Integração amplia a rastreabilidade assistencial.',
    options: [
      { 
        value: 1, 
        label: 'Não temos integração - sistemas isolados',
        impact: 'Rastreabilidade limitada à CME, gap na cadeia assistencial'
      },
      { 
        value: 2, 
        label: 'Integração básica - recebemos pedidos, mas sem vínculo completo',
        impact: 'Comunicação existe, mas rastreabilidade assistencial incompleta'
      },
      { 
        value: 3, 
        label: 'Integração com prontuário, mas dados limitados',
        impact: 'Rastreabilidade parcial, oportunidades de ampliação'
      },
      { 
        value: 4, 
        label: 'Integração completa - rastreabilidade do processamento ao paciente',
        impact: 'Cadeia assistencial completa, conformidade RDC 15, governança total'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a integração é um gap de governança'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_7',
    category: 'tecnologia',
    question: 'Sua equipe consegue visualizar a produtividade da CME em tempo real?',
    description: 'Visibilidade em tempo real permite gestão proativa.',
    options: [
      { 
        value: 1, 
        label: 'Não - só sabemos no fim do mês ou quando fechamos relatórios',
        impact: 'Gestão reativa, descoberta tardia de problemas'
      },
      { 
        value: 2, 
        label: 'Alguns indicadores em painéis físicos (quadros brancos)',
        impact: 'Visão parcial, dados manuais, possível desatualização'
      },
      { 
        value: 3, 
        label: 'Relatórios diários, mas não em tempo real',
        impact: 'Gestão com pequeno delay, ações mais lentas'
      },
      { 
        value: 4, 
        label: 'Dashboard em tempo real com produtividade, gargalos e alertas',
        impact: 'Gestão proativa, identificação imediata de problemas'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a produtividade é um gap de gestão'
      },
    ],
    weight: 1,
  },
  {
    id: 'tecnologia_8',
    category: 'tecnologia',
    question: 'Como sua CME registra e controla a capacitação e treinamento da equipe?',
    description: 'Equipe treinada é fundamental para qualidade e segurança.',
    options: [
      { 
        value: 1, 
        label: 'Registros em papel ou planilhas desconectadas',
        impact: 'Difícil acompanhamento, risco de treinamentos vencidos'
      },
      { 
        value: 2, 
        label: 'Controle de treinamentos em sistema de RH',
        impact: 'Registro existe, mas sem vínculo com operação da CME'
      },
      { 
        value: 3, 
        label: 'Treinamentos registrados, mas sem conteúdos integrados',
        impact: 'Controle administrativo, mas suporte operacional limitado'
      },
      { 
        value: 4, 
        label: 'Sistema com trilha de capacitação integrada à operação',
        impact: 'Equipe qualificada, treinamento contextualizado, conformidade garantida'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a capacitação é um risco operacional'
      },
    ],
    weight: 1,
  },
  {
    id: 'tecnologia_9',
    category: 'tecnologia',
    question: 'Como sua CME controla a vida útil e manutenção do instrumental?',
    description: 'Instrumentais desgastados comprometem procedimentos e aumentam custos.',
    options: [
      { 
        value: 1, 
        label: 'Não temos controle - substituímos quando quebra',
        impact: 'Uso de materiais degradados, riscos ao paciente, compras de emergência'
      },
      { 
        value: 2, 
        label: 'Controle manual em planilhas desconectadas',
        impact: 'Informações desencontradas, difícil planejamento de reposição'
      },
      { 
        value: 3, 
        label: 'Controle patrimonial, mas sem dados de utilização',
        impact: 'Substituições sem critério técnico, desperdício ou falta de materiais'
      },
      { 
        value: 4, 
        label: 'Controle integrado com histórico de uso e manutenção',
        impact: 'Planejamento eficiente de reposição, redução de custos, qualidade garantida'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o estado dos instrumentais é um risco'
      },
    ],
    weight: 2,
  },

  // ==================== FINANCEIRO E RISCOS ====================
  {
    id: 'financeiro_1',
    category: 'financeiro',
    question: 'Sua instituição já enfrentou processos jurídicos relacionados a infecções associadas ao processamento de materiais?',
    description: 'Processos jurídicos podem gerar indenizações milionárias e danos à reputação.',
    options: [
      { 
        value: 1, 
        label: 'Sim, tivemos processos com condenações',
        impact: 'EXPOSIÇÃO JURÍDICA GRAVE: prejuízos financeiros e danos à imagem institucional'
      },
      { 
        value: 2, 
        label: 'Sim, processos em andamento ou arquivados',
        impact: 'Risco jurídico ativo, necessidade de blindagem processual urgente'
      },
      { 
        value: 3, 
        label: 'Não tivemos processos, mas já houve suspeitas de infecção',
        impact: 'Risco potencial, falta de evidências pode dificultar defesa'
      },
      { 
        value: 4, 
        label: 'Nunca tivemos processos ou suspeitas relacionadas',
        impact: 'Baixo risco jurídico atual, mas prevenção deve ser mantida'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer processos jurídicos é um risco de governança'
      },
    ],
    weight: 3,
  },
  {
    id: 'financeiro_2',
    category: 'financeiro',
    question: 'Quantas cirurgias foram canceladas ou adiadas nos últimos 12 meses por falta de material esterilizado disponível?',
    description: 'Cancelamentos geram prejuízo direto e indireto, além de insatisfação.',
    options: [
      { 
        value: 1, 
        label: 'Mais de 20 cancelamentos/ano',
        impact: 'PREJUÍZO SIGNIFICATIVO: perda de receita, ocupação de leitos, insatisfação de pacientes e cirurgiões'
      },
      { 
        value: 2, 
        label: 'Entre 10 e 20 cancelamentos/ano',
        impact: 'Impacto financeiro relevante, necessidade de gestão de disponibilidade'
      },
      { 
        value: 3, 
        label: 'Entre 1 e 9 cancelamentos/ano',
        impact: 'Ocorre esporadicamente, mas cada cancelamento tem custo evitável'
      },
      { 
        value: 4, 
        label: 'Nenhum cancelamento por falta de material',
        impact: 'Excelente gestão de disponibilidade, zero prejuízo por este motivo'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer cancelamentos é um gap de gestão financeira'
      },
    ],
    weight: 3,
  },
  {
    id: 'financeiro_3',
    category: 'financeiro',
    question: 'Qual é o percentual estimado de reprocessamentos de materiais preparados e não utilizados?',
    description: 'Reprocessamentos desperdiçam insumos, tempo da equipe e desgastam materiais.',
    options: [
      { 
        value: 1, 
        label: 'Mais de 30% dos materiais são reprocessados',
        impact: 'DESPERDÍCIO GRAVE: custo elevado com insumos, tempo ocioso, desgaste acelerado de materiais'
      },
      { 
        value: 2, 
        label: 'Entre 15% e 30%',
        impact: 'Desperdício significativo, oportunidade de economia com controle de causas'
      },
      { 
        value: 3, 
        label: 'Entre 5% e 15%',
        impact: 'Desperdício moderado, pode ser otimizado com análise de causas'
      },
      { 
        value: 4, 
        label: 'Menos de 5%',
        impact: 'Controle eficiente, baixo desperdício com reprocessamentos'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer reprocessamentos é um custo oculto significativo'
      },
    ],
    weight: 2,
  },
  {
    id: 'financeiro_4',
    category: 'financeiro',
    question: 'Quantos instrumentais são perdidos ou extraviados por ano na sua CME?',
    description: 'Perdas de instrumentais representam custo direto de reposição.',
    options: [
      { 
        value: 1, 
        label: 'Mais de 50 instrumentais/ano',
        impact: 'PREJUÍZO FINANCEIRO ALTO: custo de reposição frequente, gaps no arsenal'
      },
      { 
        value: 2, 
        label: 'Entre 20 e 50 instrumentais/ano',
        impact: 'Perdas frequentes, necessidade de controle de rastreabilidade'
      },
      { 
        value: 3, 
        label: 'Entre 5 e 19 instrumentais/ano',
        impact: 'Perdas ocasionais, podem ser reduzidas com controle'
      },
      { 
        value: 4, 
        label: 'Menos de 5 ou zero perdas/ano',
        impact: 'Controle eficiente de instrumental, baixo prejuízo com perdas'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer perdas é um custo oculto'
      },
    ],
    weight: 2,
  },
  {
    id: 'financeiro_5',
    category: 'financeiro',
    question: 'Sua instituição já recebeu multas ou notificações de órgãos reguladores relacionadas à CME?',
    description: 'Multas regulatórias geram prejuízo direto e risco de interdição.',
    options: [
      { 
        value: 1, 
        label: 'Sim, multas aplicadas nos últimos 2 anos',
        impact: 'NÃO CONFORMIDADE REGULATÓRIA: prejuízo financeiro, risco de interdição, danos à imagem'
      },
      { 
        value: 2, 
        label: 'Notificações, mas sem multas aplicadas',
        impact: 'Risco regulatório ativo, necessidade de adequação urgente'
      },
      { 
        value: 3, 
        label: 'Orientações de adequação recebidas',
        impact: 'Alerta regulatório, oportunidade de correção antes de penalidades'
      },
      { 
        value: 4, 
        label: 'Nenhuma notificação ou multa relacionada',
        impact: 'Conformidade regulatória mantida, baixo risco de penalidades'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o histórico regulatório é um risco'
      },
    ],
    weight: 3,
  },
  {
    id: 'financeiro_6',
    category: 'financeiro',
    question: 'Qual é o custo médio mensal de manutenção corretiva de equipamentos da CME?',
    description: 'Manutenções corretivas são mais caras que preventivas e causam paradas.',
    options: [
      { 
        value: 1, 
        label: 'Mais de R$ 10.000/mês em manutenções corretivas',
        impact: 'CUSTO ELEVADO: manutenções de emergência, paradas não planejadas, risco de falhas'
      },
      { 
        value: 2, 
        label: 'Entre R$ 5.000 e R$ 10.000/mês',
        impact: 'Custo significativo, oportunidade de reduzir com preventiva'
      },
      { 
        value: 3, 
        label: 'Entre R$ 1.000 e R$ 5.000/mês',
        impact: 'Custo moderado, pode ser otimizado com programa preventivo'
      },
      { 
        value: 4, 
        label: 'Menos de R$ 1.000/mês (foco em preventiva)',
        impact: 'Gestão eficiente de manutenção, baixo custo corretivo'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer custos de manutenção impede otimização'
      },
    ],
    weight: 2,
  },
  {
    id: 'financeiro_7',
    category: 'financeiro',
    question: 'Sua instituição consegue mensurar o custo real de cada processo de esterilização?',
    description: 'Conhecer o custo por processo permite identificar oportunidades de economia.',
    options: [
      { 
        value: 1, 
        label: 'Não temos ideia do custo por processo',
        impact: 'CEGUEIRA FINANCEIRA: impossibilidade de otimização, gastos ocultos, sem controle'
      },
      { 
        value: 2, 
        label: 'Estimativa aproximada sem detalhamento',
        impact: 'Visão superficial, sem precisão para decisões de economia'
      },
      { 
        value: 3, 
        label: 'Custo calculado, mas sem vincular todos os insumos',
        impact: 'Parcialmente mapeado, alguns custos ocultos permanecem'
      },
      { 
        value: 4, 
        label: 'Custo real por processo com todos os insumos rastreados',
        impact: 'Controle financeiro total, identificação de oportunidades de economia'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer custos é um gap crítico de gestão financeira'
      },
    ],
    weight: 2,
  },
  {
    id: 'financeiro_8',
    category: 'financeiro',
    question: 'Quantas reclamações de cirurgiões relacionadas a materiais da CME sua instituição recebe por mês?',
    description: 'Reclamações indicam problemas de qualidade e podem gerar conflitos.',
    options: [
      { 
        value: 1, 
        label: 'Mais de 10 reclamações/mês',
        impact: 'INSATISFAÇÃO GRAVE: conflitos com equipe médica, risco de perda de cirurgiões, imagem comprometida'
      },
      { 
        value: 2, 
        label: 'Entre 5 e 10 reclamações/mês',
        impact: 'Insatisfação frequente, necessidade de melhoria de processos'
      },
      { 
        value: 3, 
        label: 'Entre 1 e 4 reclamações/mês',
        impact: 'Reclamações ocasionais, oportunidades de melhoria pontuais'
      },
      { 
        value: 4, 
        label: 'Nenhuma ou raras reclamações',
        impact: 'Alta satisfação da equipe cirúrgica, qualidade percebida'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a satisfação dos cirurgiões é um risco'
      },
    ],
    weight: 2,
  },
  {
    id: 'financeiro_9',
    category: 'financeiro',
    question: 'Sua CME já teve materiais recusados em auditorias ou acreditações nos últimos 2 anos?',
    description: 'Não conformidades em auditorias podem comprometer acreditações.',
    options: [
      { 
        value: 1, 
        label: 'Sim, várias não conformidades críticas',
        impact: 'RISCO DE PERDA DE ACREDITAÇÃO: perda de contratos, imagem prejudicada, necessidade de investimentos urgentes'
      },
      { 
        value: 2, 
        label: 'Algumas não conformidades menores',
        impact: 'Risco de escalada, necessidade de planos de ação'
      },
      { 
        value: 3, 
        label: 'Poucos ajustes solicitados',
        impact: 'Conformidade geral, melhorias pontuais necessárias'
      },
      { 
        value: 4, 
        label: 'Nenhuma não conformidade relacionada à CME',
        impact: 'Excelência em auditorias, credenciamentos mantidos'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o histórico de auditorias é um risco'
      },
    ],
    weight: 2,
  },
  {
    id: 'financeiro_10',
    category: 'financeiro',
    question: 'Qual é o custo estimado de insumos desperdiçados por mês (validades vencidas, uso indevido, perdas)?',
    description: 'Desperdício de insumos é um custo evitável que impacta o resultado.',
    options: [
      { 
        value: 1, 
        label: 'Mais de R$ 5.000/mês em desperdício',
        impact: 'DESPERDÍCIO ELEVADO: prejuízo mensal significativo, falta de controle de estoque e uso'
      },
      { 
        value: 2, 
        label: 'Entre R$ 2.000 e R$ 5.000/mês',
        impact: 'Desperdício relevante, oportunidade de economia com controle'
      },
      { 
        value: 3, 
        label: 'Entre R$ 500 e R$ 2.000/mês',
        impact: 'Desperdício moderado, pode ser reduzido com melhor gestão'
      },
      { 
        value: 4, 
        label: 'Menos de R$ 500/mês',
        impact: 'Controle eficiente de insumos, baixo desperdício'
      },
      { 
        value: 0, 
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer desperdícios é um custo oculto'
      },
    ],
    weight: 2,
  },

  // ==================== NOVAS PERGUNTAS - PROCESSO ====================
  {
    id: 'processo_13',
    category: 'processo',
    question: 'Quais métodos de limpeza estão disponíveis no expurgo da sua CME?',
    description: 'A diversidade de métodos de limpeza no expurgo impacta diretamente na qualidade do processamento.',
    options: [
      {
        value: 1,
        label: 'Apenas limpeza manual com escovas',
        impact: 'Dependência exclusiva do trabalho manual, maior risco de falhas, baixa padronização'
      },
      {
        value: 2,
        label: 'Limpeza manual com escovas e sistema pressurizado de ar/água',
        impact: 'Métodos complementares, mas sem automação para grandes volumes'
      },
      {
        value: 3,
        label: 'Escovas, sistema pressurizado e sistema de limpeza a vapor (steamer)',
        impact: 'Boa diversidade de métodos, processo mais eficiente e padronizado'
      },
      {
        value: 4,
        label: 'Todos os métodos (escovas, pressurizado, steamer) integrados ao processo de limpeza',
        impact: 'Processo de limpeza completo, máxima eficiência e padronização'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer os métodos de limpeza é um risco operacional'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_14',
    category: 'processo',
    question: 'Sua CME possui lupa para inspeção de instrumentais na área de limpeza e preparo?',
    description: 'A lupa é essencial para detectar sujidades e defeitos não visíveis a olho nu.',
    options: [
      {
        value: 1,
        label: 'Não possuímos lupa no setor',
        impact: 'Inspeção limitada, defeitos e resíduos podem passar despercebidos'
      },
      {
        value: 2,
        label: 'Possuímos, mas não é utilizada de forma padronizada',
        impact: 'Equipamento disponível, mas subutilizado pela equipe'
      },
      {
        value: 3,
        label: 'Possuímos e é utilizada em alguns instrumentais críticos',
        impact: 'Inspeção parcial, instrumentais comuns podem passar sem verificação adequada'
      },
      {
        value: 4,
        label: 'Possuímos e é utilizada de forma padronizada para todos os instrumentais',
        impact: 'Inspeção completa, detecção precoce de defeitos, qualidade garantida'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a inspeção com lupa é um risco de qualidade'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_15',
    category: 'processo',
    question: 'Sua CME possui armário de selagem? Quantas unidades?',
    description: 'O armário de selagem garante a integridade do pacote e a efetividade da esterilização.',
    options: [
      {
        value: 1,
        label: 'Não possuímos armário de selagem',
        impact: 'Risco de contaminação pós-esterilização, selagem manual sem controle'
      },
      {
        value: 2,
        label: 'Possuímos 1 unidade, mas pode ser insuficiente para a demanda',
        impact: 'Gargalo operacional, risco de fila e atraso no preparo'
      },
      {
        value: 3,
        label: 'Possuímos 2 a 3 unidades para atendimento da demanda',
        impact: 'Boa capacidade, atendimento adequado ao volume de processamento'
      },
      {
        value: 4,
        label: 'Possuímos 4 ou mais unidades, dimensionadas para a demanda',
        impact: 'Capacidade plena, sem gargalos, selagem padronizada e eficiente'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o equipamento de selagem é um risco operacional'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_16',
    category: 'processo',
    question: 'Que tipos de desinfecção sua CME realiza?',
    description: 'A desinfecção é etapa crítica para redução de carga microbiana antes da esterilização.',
    options: [
      {
        value: 1,
        label: 'Não realizamos desinfecção de forma padronizada',
        impact: 'Ausência de desinfecção, risco elevado de contaminação cruzada'
      },
      {
        value: 2,
        label: 'Realizamos apenas desinfecção química',
        impact: 'Processo parcial, dependência de produtos químicos sem validação térmica'
      },
      {
        value: 3,
        label: 'Realizamos apenas desinfecção térmica',
        impact: 'Processo térmico eficaz, mas sem alternativa para materiais termossensíveis'
      },
      {
        value: 4,
        label: 'Realizamos desinfecção química e térmica conforme protocolos',
        impact: 'Processo completo, cobrindo todos os tipos de materiais, conformidade total'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer os tipos de desinfecção é um risco assistencial'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_17',
    category: 'processo',
    question: 'Sua CME possui controle de temperatura de ambiente nos setores (Expurgo, Preparo, Esterilização e Arsenal)?',
    description: 'O controle de temperatura é fundamental para conservação de materiais e conforto da equipe.',
    options: [
      {
        value: 1,
        label: 'Não possuímos controle de temperatura em nenhum setor',
        impact: 'Risco para materiais, desconforto da equipe, não conformidade com normas'
      },
      {
        value: 2,
        label: 'Controle parcial (apenas em alguns setores)',
        impact: 'Alguns setores protegidos, outros sem monitoramento adequado'
      },
      {
        value: 3,
        label: 'Controle em todos os setores, mas sem alertas automáticos',
        impact: 'Monitoramento existe, mas resposta lenta a variações críticas'
      },
      {
        value: 4,
        label: 'Controle em todos os setores (Expurgo, Preparo, Esterilização e Arsenal) com alertas automáticos',
        impact: 'Ambientes controlados, conformidade total, resposta imediata a variações'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o controle de temperatura é um risco operacional'
      },
    ],
    weight: 2,
  },
  {
    id: 'processo_18',
    category: 'processo',
    question: 'Quais tipos de embalagens sua CME utiliza para esterilização?',
    description: 'A diversidade de embalagens permite atender diferentes tipos de instrumentais e tecnologias de esterilização.',
    options: [
      {
        value: 1,
        label: 'Apenas papel crepado e/ou tecido de algodão',
        impact: 'Embalagens básicas, menor barreira microbiológica, dependência de lavagem/reutilização'
      },
      {
        value: 2,
        label: 'Papel grau cirúrgico e SMS, além de papel crepado/algodão',
        impact: 'Boa cobertura para instrumental comum, barreira microbiológica adequada'
      },
      {
        value: 3,
        label: 'Papel grau cirúrgico, SMS, Tyvek e papel crepado/algodão',
        impact: 'Ampla variedade de embalagens, atende materiais comuns e termossensíveis'
      },
      {
        value: 4,
        label: 'Todas as opções (papel grau cirúrgico, SMS, Tyvek, tecido de algodão, papel crepado e containers)',
        impact: 'Embalagem completa e versátil, cobertura total para todos os tipos de materiais e processos'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer os tipos de embalagem é um risco de qualidade'
      },
    ],
    weight: 2,
  },

  // ==================== NOVAS PERGUNTAS - TECNOLOGIA ====================
  {
    id: 'tecnologia_10',
    category: 'tecnologia',
    question: 'Sua CME possui lavadoras ultrassônicas? Quantas unidades?',
    description: 'Lavadoras ultrassônicas garantem limpeza eficiente de instrumentais com lúmenes e articulações.',
    options: [
      {
        value: 1,
        label: 'Não possuímos lavadoras ultrassônicas',
        impact: 'Dependência de limpeza manual, risco de resíduos em instrumentais complexos'
      },
      {
        value: 2,
        label: 'Possuímos 1 unidade, mas pode ser insuficiente para a demanda',
        impact: 'Gargalo operacional, filas de processamento, risco de atraso'
      },
      {
        value: 3,
        label: 'Possuímos 2 a 3 unidades para atendimento da demanda',
        impact: 'Boa capacidade, processamento adequado ao volume da CME'
      },
      {
        value: 4,
        label: 'Possuímos 4 ou mais unidades, dimensionadas para a demanda',
        impact: 'Capacidade plena, sem gargalos, limpeza eficiente garantida'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o parque de lavadoras é um gap tecnológico'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_11',
    category: 'tecnologia',
    question: 'Sua CME possui termodesinfectoradoras (lavadoras termodesinfectoras)? Quantas unidades?',
    description: 'Termodesinfectoradoras unificam lavagem e desinfecção térmica em um único ciclo.',
    options: [
      {
        value: 1,
        label: 'Não possuímos termodesinfectoradoras',
        impact: 'Processo de desinfecção manual ou em etapas separadas, menor eficiência'
      },
      {
        value: 2,
        label: 'Possuímos 1 unidade, mas pode ser insuficiente para a demanda',
        impact: 'Gargalo operacional, dependência de processo manual complementar'
      },
      {
        value: 3,
        label: 'Possuímos 2 a 3 unidades para atendimento da demanda',
        impact: 'Boa capacidade, processo integrado de lavagem e desinfecção'
      },
      {
        value: 4,
        label: 'Possuímos 4 ou mais unidades, dimensionadas para a demanda',
        impact: 'Capacidade plena, processo automatizado de alta eficiência'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer as termodesinfectoradoras é um gap tecnológico'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_12',
    category: 'tecnologia',
    question: 'Sua CME possui autoclaves? Quais tipos e quantidades?',
    description: 'A diversidade de tecnologias de esterilização amplia a capacidade de processamento de diferentes materiais.',
    options: [
      {
        value: 1,
        label: 'Possuímos apenas autoclaves a vapor',
        impact: 'Limitação para materiais termossensíveis, dependência de esterilização externa'
      },
      {
        value: 2,
        label: 'Possuímos vapor e peróxido de hidrogênio',
        impact: 'Boa cobertura, atende materiais termossensíveis com tecnologia complementar'
      },
      {
        value: 3,
        label: 'Possuímos vapor, peróxido de hidrogênio e plasma',
        impact: 'Tecnologia diversificada, cobertura quase total de todos os tipos de materiais'
      },
      {
        value: 4,
        label: 'Possuímos todos os tipos (vapor, peróxido e plasma) em quantidade adequada à demanda',
        impact: 'Parque tecnológico completo, autossuficiência, máxima versatilidade'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer os tipos de autoclaves é um gap crítico'
      },
    ],
    weight: 3,
  },
  {
    id: 'tecnologia_13',
    category: 'tecnologia',
    question: 'A instituição possui engenharia clínica própria ou terceirizada?',
    description: 'A engenharia clínica é essencial para manutenção preventiva e qualificação de equipamentos.',
    options: [
      {
        value: 1,
        label: 'Não possuímos engenharia clínica (própria ou terceirizada)',
        impact: 'Risco grave: equipamentos sem suporte técnico, manutenção sem planejamento'
      },
      {
        value: 2,
        label: 'Possuímos engenharia clínica terceirizada, com atendimento eventual',
        impact: 'Suporte parcial, atendimento por demanda, sem acompanhamento contínuo'
      },
      {
        value: 3,
        label: 'Possuímos engenharia clínica terceirizada com contrato ativo',
        impact: 'Suporte estruturado, manutenção planejada, mas sem equipe exclusiva'
      },
      {
        value: 4,
        label: 'Possuímos engenharia clínica própria dedicada',
        impact: 'Suporte técnico completo, resposta imediata, gestão preventiva efetiva'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o suporte de engenharia clínica é um risco'
      },
    ],
    weight: 2,
  },
  {
    id: 'tecnologia_14',
    category: 'tecnologia',
    question: 'A instituição possui acreditações hospitalares (ONA, JCI, Qmentum)?',
    description: 'Acreditações demonstram compromisso com qualidade e segurança assistencial.',
    options: [
      {
        value: 1,
        label: 'Não possuímos nenhuma acreditação',
        impact: 'Sem certificação de qualidade reconhecida, possível desvantagem competitiva'
      },
      {
        value: 2,
        label: 'Estamos em processo de acreditação',
        impact: 'Compromisso com qualidade, mas ainda sem certificação formal'
      },
      {
        value: 3,
        label: 'Possuímos acreditação ONA (nível 1 ou 2)',
        impact: 'Certificação nacional reconhecida, processo de melhoria contínua em curso'
      },
      {
        value: 4,
        label: 'Possuímos ONA nível 3 e/ou acreditações internacionais (JCI, Qmentum)',
        impact: 'Excelência em qualidade, reconhecimento nacional e internacional'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer acreditações é um gap de governança'
      },
    ],
    weight: 2,
  },

  // ==================== NOVAS PERGUNTAS - GESTÃO ====================
  {
    id: 'gestao_10',
    category: 'gestao',
    question: 'Qual a natureza jurídica da instituição?',
    description: 'A natureza jurídica influencia regulamentações, financiamento e gestão do estabelecimento.',
    options: [
      {
        value: 1,
        label: 'Hospital Público (SUS)',
        impact: 'Depende de financiamento público, sujeito a limitações orçamentárias e processos de compra'
      },
      {
        value: 2,
        label: 'Hospital Privado (Lucrativo)',
        impact: 'Maior flexibilidade de investimento, foco em resultado e eficiência'
      },
      {
        value: 3,
        label: 'Hospital Filantrópico (Sem fins lucrativos)',
        impact: 'Mistura de financiamento público e privado, desafios de sustentabilidade'
      },
      {
        value: 4,
        label: 'Gerido por OSS (Organização Social de Saúde)',
        impact: 'Gestão híbrida com metodologia privada e financiamento público, potencial de eficiência'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer a natureza jurídica é um gap institucional'
      },
    ],
    weight: 1,
  },
  {
    id: 'gestao_11',
    category: 'gestao',
    question: 'Qual a quantidade estimada de caixas cirúrgicas e kits gerenciados pela CME?',
    description: 'O volume de caixas e kits indica a complexidade logística da operação.',
    options: [
      {
        value: 1,
        label: 'Até 100 caixas/kits',
        impact: 'Arsenal pequeno, complexidade logística baixa, controle simplificado possível'
      },
      {
        value: 2,
        label: 'Entre 101 e 300 caixas/kits',
        impact: 'Arsenal médio, exige organização estruturada para rastreabilidade'
      },
      {
        value: 3,
        label: 'Entre 301 e 500 caixas/kits',
        impact: 'Arsenal grande, requer sistema robusto de gestão e controle'
      },
      {
        value: 4,
        label: 'Mais de 500 caixas/kits',
        impact: 'Arsenal extenso, demanda sistema especializado e equipe capacitada'
      },
      {
        value: 0,
        label: 'Não possuo esta informação',
        impact: 'FALTA DE VISIBILIDADE: desconhecer o volume do arsenal é um risco operacional'
      },
    ],
    weight: 1,
  },
];

// Função para calcular o resultado do checkup
export function calculateResult(answers: Record<string, number>): CheckupResult {
  const categories = [
    { 
      id: 'gestao', 
      name: 'Gestão',
      questions: checkupQuestions.filter(q => q.category === 'gestao')
    },
    { 
      id: 'processo', 
      name: 'Processo',
      questions: checkupQuestions.filter(q => q.category === 'processo')
    },
    { 
      id: 'tecnologia', 
      name: 'Tecnologia',
      questions: checkupQuestions.filter(q => q.category === 'tecnologia')
    },
    { 
      id: 'financeiro', 
      name: 'Financeiro e Riscos',
      questions: checkupQuestions.filter(q => q.category === 'financeiro')
    },
  ];

  const visibilityGaps: string[] = []; // Armazena questões sem informação
  const categoryResults: CategoryResult[] = categories.map(cat => {
    let score = 0;
    let maxScore = 0;
    const findings: string[] = [];
    const recommendations: string[] = [];

    cat.questions.forEach(q => {
      const answer = answers[q.id];
      // Se não respondeu ou respondeu "não sei" (value: 0), trata como pior cenário mas adiciona gap de visibilidade
      const effectiveAnswer = answer === undefined || answer === 0 ? 1 : answer;
      
      const weightedScore = effectiveAnswer * q.weight;
      const maxWeightedScore = 4 * q.weight;
      
      score += weightedScore;
      maxScore += maxWeightedScore;

      // Identificar falta de visibilidade (resposta "não sei")
      if (answer === 0) {
        const option = q.options.find(o => o.value === 0);
        if (option) {
          visibilityGaps.push(`${q.question}: ${option.impact}`);
        }
      }

      // Identificar pontos críticos (exceto quando não souber)
      if (answer !== 0 && effectiveAnswer <= 2) {
        const option = q.options.find(o => o.value === answer);
        if (option) {
          findings.push(option.impact);
        }
      }
    });

    const percentage = Math.round((score / maxScore) * 100);
    let level: 'critico' | 'necessita_melhorias' | 'precisa_tecnologia' | 'em_desenvolvimento';
    
    // Sempre indicar necessidade de melhoria - o objetivo é vender o CME Inteligente
    if (percentage < 40) {
      level = 'critico';
      recommendations.push(`URGENTE: Implementar CME Inteligente para controle total de ${cat.name}`);
    } else if (percentage < 55) {
      level = 'necessita_melhorias';
      recommendations.push(`Necessário implementar CME Inteligente para estruturar ${cat.name}`);
    } else if (percentage < 75) {
      level = 'precisa_tecnologia';
      recommendations.push(`CME Inteligente pode transformar ${cat.name} com tecnologia e rastreabilidade`);
    } else {
      level = 'em_desenvolvimento';
      recommendations.push(`Continuar evoluindo ${cat.name} com CME Inteligente para excelência`);
    }

    return {
      category: cat.id,
      categoryName: cat.name,
      score,
      maxScore,
      percentage,
      level,
      findings,
      recommendations,
    };
  });

  // Calcular score geral
  const totalScore = categoryResults.reduce((sum, c) => sum + c.score, 0);
  const totalMaxScore = categoryResults.reduce((sum, c) => sum + c.maxScore, 0);
  const overallScore = Math.round((totalScore / totalMaxScore) * 100);

  let overallLevel: 'critico' | 'necessita_melhorias' | 'precisa_tecnologia' | 'em_desenvolvimento';
  if (overallScore < 40) overallLevel = 'critico';
  else if (overallScore < 55) overallLevel = 'necessita_melhorias';
  else if (overallScore < 75) overallLevel = 'precisa_tecnologia';
  else overallLevel = 'em_desenvolvimento';

  // Identificar principais problemas - SEMPRE mostrar que precisa melhorar
  const mainProblems: string[] = [];
  categoryResults.forEach(cat => {
    if (cat.level === 'critico') {
      mainProblems.push(`${cat.categoryName} em situação crítica (${cat.percentage}%) - Requer ação imediata`);
    } else if (cat.level === 'necessita_melhorias') {
      mainProblems.push(`${cat.categoryName} necessita melhorias significativas (${cat.percentage}%)`);
    } else if (cat.level === 'precisa_tecnologia') {
      mainProblems.push(`${cat.categoryName} precisa de tecnologia e processos estruturados (${cat.percentage}%)`);
    } else {
      mainProblems.push(`${cat.categoryName} em desenvolvimento - oportunidade de evolução (${cat.percentage}%)`);
    }
  });

  // Adicionar problema de visibilidade se houver
  if (visibilityGaps.length > 0) {
    mainProblems.push(`FALTA DE VISIBILIDADE: ${visibilityGaps.length} questões sem informação clara - indica necessidade de indicadores`);
  }

  // Quick wins - sempre direcionando para CME Inteligente
  const quickWins: string[] = [
    'Implementar CME Inteligente para rastreabilidade completa',
    'Vincular insumos aos processos com o sistema especializado',
    'Criar validações obrigatórias com blindagem operacional do CME Inteligente',
    'Estabelecer dashboard de indicadores em tempo real com CME Inteligente',
  ];

  // Estimativa de economia - SEMPRE mostrar oportunidade
  const economyEstimate = {
    min: overallScore < 55 ? 20 : overallScore < 75 ? 12 : 8,
    max: overallScore < 55 ? 35 : overallScore < 75 ? 22 : 15,
    description: overallScore < 55 
      ? 'Redução SIGNIFICATIVA de custos com CME Inteligente: otimização de processos, redução de reprocessamentos e controle total de insumos'
      : overallScore < 75
      ? 'Economia substancial com CME Inteligente: refinamento de processos e gestão de recursos orientada por dados'
      : 'Otimização contínua com CME Inteligente para máxima eficiência e economia',
  };

  // Calcular risco financeiro baseado nas respostas da categoria financeiro
  const financialCategory = categoryResults.find(c => c.category === 'financeiro');
  let financialRisk = {
    riskLevel: 'Alto',
    estimatedLoss: 'R$ 50.000 a R$ 200.000/ano',
    description: 'Riscos financeiros significativos identificados que podem ser mitigados com controles adequados.'
  };

  if (financialCategory) {
    if (financialCategory.percentage >= 75) {
      financialRisk = {
        riskLevel: 'Baixo',
        estimatedLoss: 'Menos de R$ 20.000/ano',
        description: 'Riscos financeiros controlados, manter ações preventivas.'
      };
    } else if (financialCategory.percentage >= 55) {
      financialRisk = {
        riskLevel: 'Moderado',
        estimatedLoss: 'R$ 20.000 a R$ 50.000/ano',
        description: 'Oportunidades de economia identificadas com controle de processos.'
      };
    } else if (financialCategory.percentage >= 40) {
      financialRisk = {
        riskLevel: 'Elevado',
        estimatedLoss: 'R$ 50.000 a R$ 100.000/ano',
        description: 'Riscos financeiros relevantes que demandam ações corretivas urgentes.'
      };
    } else {
      financialRisk = {
        riskLevel: 'Crítico',
        estimatedLoss: 'R$ 100.000 a R$ 500.000+/ano',
        description: 'EXPOSIÇÃO FINANCEIRA GRAVE: processos jurídicos, multas, desperdícios e ineficiências podem gerar prejuízos elevados.'
      };
    }
  }

  // Próximos passos - sempre direcionando para venda
  const nextSteps = [
    'Agendar reunião com Klever Oliveira para diagnóstico detalhado',
    'Apresentar proposta personalizada de CME Inteligente',
    'Planejar implantação com governança técnica especializada',
    'Definir cronograma e indicadores de sucesso com ROI comprovado',
  ];

  return {
    overallScore,
    overallLevel,
    categories: categoryResults,
    mainProblems,
    quickWins,
    economyEstimate,
    nextSteps,
    financialRisk,
    visibilityGaps,
  };
}
