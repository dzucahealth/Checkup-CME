import { Question } from './types';

const defaultOptions = [
  { value: 1, label: 'Discordo totalmente', description: 'Não se aplica à realidade do CME' },
  { value: 2, label: 'Discordo', description: 'Parcialmente presente, precisa de melhorias' },
  { value: 3, label: 'Neutro', description: 'Atende parcialmente os requisitos' },
  { value: 4, label: 'Concordo', description: 'Atende satisfatoriamente os requisitos' },
  { value: 5, label: 'Concordo totalmente', description: 'Atende plenamente, referência de excelência' },
];

function makeQuestion(id: number, category: Question['category'], text: string): Question {
  return { id, category, text, options: defaultOptions };
}

export const questions: Question[] = [
  // ==========================================
  // GESTÃO (Management) - 9 questions
  // ==========================================
  makeQuestion(1, 'gestao', 'A liderança do CME demonstra visão estratégica e capacidade de tomar decisões alinhadas com as necessidades da instituição.'),
  makeQuestion(2, 'gestao', 'A equipe do CME recebe treinamentos periódicos e atualizações sobre boas práticas de esterilização e processamento de produtos para saúde.'),
  makeQuestion(3, 'gestao', 'Existem protocolos e procedimentos operacionais padrão (POPs) claramente documentados, atualizados e acessíveis a toda a equipe.'),
  makeQuestion(4, 'gestao', 'São realizadas reuniões periódicas com a equipe para discussão de melhorias, alinhamento de processos e análise de indicadores de desempenho.'),
  makeQuestion(5, 'gestao', 'O CME monitora e avalia indicadores de desempenho (KPIs) de forma sistemática, como taxa de reprovação, produtividade e prazos.'),
  makeQuestion(6, 'gestao', 'A cultura de melhoria contínua está implementada no CME, com utilização de metodologias como PDCA ou Lean.'),
  makeQuestion(7, 'gestao', 'A alocação de recursos humanos e materiais é suficiente para atender à demanda de processamento do CME de forma segura e eficiente.'),
  makeQuestion(8, 'gestao', 'O CME possui um programa de gerenciamento de riscos que identifica, avalia e mitiga riscos associados aos seus processos.'),
  makeQuestion(9, 'gestao', 'Existe um planejamento estratégico documentado para o CME, com metas claras, prazos definidos e mecanismos de acompanhamento.'),

  // ==========================================
  // PROCESSO (Process) - 12 questions
  // ==========================================
  makeQuestion(10, 'processo', 'O fluxo de trabalho de limpeza e descontaminação segue rigorosamente as normas vigentes (RDC 15/2012, RDC 222/2018) e é executado de forma padronizada.'),
  makeQuestion(11, 'processo', 'Os processos de esterilização são validados periodicamente, com monitoramento físico, químico e biológico de forma documentada e rastreável.'),
  makeQuestion(12, 'processo', 'O sistema de rastreabilidade do CME permite identificar cada ciclo de processamento, rastreando o material desde a recepção até a entrega.'),
  makeQuestion(13, 'processo', 'O processo de embalagem utiliza materiais compatíveis com o tipo de esterilização e segue as recomendações técnicas para garantir a manutenção da esterilidade.'),
  makeQuestion(14, 'processo', 'O controle de qualidade é realizado em todas as etapas do processamento, com registros documentados e mecanismos de verificação.'),
  makeQuestion(15, 'processo', 'Existe um programa de manutenção preventiva e corretiva para todos os equipamentos do CME, com cronograma definido e registros de execução.'),
  makeQuestion(16, 'processo', 'O gerenciamento de resíduos de serviços de saúde (RSS) no CME segue a legislação vigente (RDC 222/2018) com segregação, acondicionamento e destinação corretos.'),
  makeQuestion(17, 'processo', 'O manuseio de produtos químicos no CME segue as normas de segurança, com FISPQs (Fichas de Informação de Segurança de Produto Químico) acessíveis e treinamento da equipe.'),
  makeQuestion(18, 'processo', 'Indicadores biológicos (IB) são utilizados de forma rotineira em todos os ciclos de esterilização, com resultados registrados e monitorados.'),
  makeQuestion(19, 'processo', 'A documentação e registros do CME são completos, organizados, legíveis e mantidos pelo período exigido pela legislação, permitindo auditorias.'),
  makeQuestion(20, 'processo', 'São realizadas auditorias internas periódicas nos processos do CME, com verificação do cumprimento das normas e protocolos estabelecidos.'),
  makeQuestion(21, 'processo', 'Existe um sistema de notificação e registro de incidentes, não conformidades e near-misses, com análise de causa e ações corretivas implementadas.'),

  // ==========================================
  // TECNOLOGIA (Technology) - 15 questions
  // ==========================================
  makeQuestion(22, 'tecnologia', 'Os equipamentos de esterilização (autoclaves, estufas, EO) possuem manutenção preventiva programada e calibração periódica conforme recomendações do fabricante.'),
  makeQuestion(23, 'tecnologia', 'O CME utiliza um sistema informatizado (software) para gestão de materiais, rastreabilidade, controle de estoque e emissão de laudos de processamento.'),
  makeQuestion(24, 'tecnologia', 'Processos repetitivos do CME são automatizados, como controle de temperatura, registro de ciclos e emissão de etiquetas de rastreabilidade.'),
  makeQuestion(25, 'tecnologia', 'Sensores de monitoramento ambiental (temperatura, umidade, pressão) estão instalados e funcionando nas áreas críticas do CME.'),
  makeQuestion(26, 'tecnologia', 'Os registros do CME são mantidos de forma digital, com sistema de backup seguro e acesso controlado.'),
  makeQuestion(27, 'tecnologia', 'Os equipamentos de medição e monitoramento do CME possuem calibração vigente e rastreável a padrões nacionais ou internacionais.'),
  makeQuestion(28, 'tecnologia', 'O sistema de tratamento de água utilizado nos processos do CME (lavadoras, autoclaves) atende aos parâmetros de qualidade exigidos.'),
  makeQuestion(29, 'tecnologia', 'A qualidade do ar nas áreas limpas e semi-limpas do CME é monitorada e controlada, com filtros e manutenção adequados.'),
  makeQuestion(30, 'tecnologia', 'O CME adota práticas de eficiência energética, como equipamentos com selo Procel, otimização de ciclos e controle de consumo.'),
  makeQuestion(31, 'tecnologia', 'Existem sistemas de backup (geradores, nobreaks) que garantem a continuidade dos processos críticos em caso de falha no fornecimento de energia.'),
  makeQuestion(32, 'tecnologia', 'O CME utiliza recursos de telemonitoramento ou acesso remoto para supervisão de equipamentos e processos críticos.'),
  makeQuestion(33, 'tecnologia', 'Dispositivos IoT (Internet das Coisas) são utilizados para monitoramento em tempo real de parâmetros críticos do processo de esterilização.'),
  makeQuestion(34, 'tecnologia', 'O CME possui medidas de segurança cibernética para proteger dados sensíveis e sistemas informatizados contra acessos não autorizados.'),
  makeQuestion(35, 'tecnologia', 'Há suporte técnico especializado disponível para os equipamentos e sistemas do CME, com contratos de manutenção ativos e SLA definidos.'),
  makeQuestion(36, 'tecnologia', 'O CME possui um plano de atualização tecnológica que avalia periodicamente novas tecnologias e equipamentos para melhoria dos processos.'),

  // ==========================================
  // FINANCEIRO (Financial) - 10 questions
  // ==========================================
  makeQuestion(37, 'financeiro', 'O CME possui um orçamento anual planejado e detalhado, contemplando todas as despesas operacionais, de capital e investimentos necessários.'),
  makeQuestion(38, 'financeiro', 'Existe um sistema de controle de custos que permite identificar e monitorar as despesas por categoria (pessoal, materiais, manutenção, energia, etc.).'),
  makeQuestion(39, 'financeiro', 'As prioridades de investimento do CME são definidas com base em análise de custo-benefício, impacto na segurança do paciente e necessidade operacional.'),
  makeQuestion(40, 'financeiro', 'A gestão de fornecedores é estruturada, com avaliação de desempenho, negociação de prazos e condições, e estoque mínimo definido para materiais críticos.'),
  makeQuestion(41, 'financeiro', 'Contratos de fornecimento e serviços são negociados periodicamente, buscando as melhores condições comerciais sem comprometer a qualidade.'),
  makeQuestion(42, 'financeiro', 'São realizadas ações de redução de desperdícios (materiais, energia, água) com metas definidas e resultados mensuráveis, gerando economia comprovada.'),
  makeQuestion(43, 'financeiro', 'Análises de ROI (Retorno sobre Investimento) são realizadas antes de decisões de aquisição de novos equipamentos ou implementação de tecnologias.'),
  makeQuestion(44, 'financeiro', 'O faturamento e cobrança dos serviços do CME são realizados de forma precisa, com verificação periódica de conformidade dos valores praticados.'),
  makeQuestion(45, 'financeiro', 'O CME produz relatórios financeiros periódicos com indicadores como custo por processamento, custo por ciclo de esterilização e variação orçamentária.'),
  makeQuestion(46, 'financeiro', 'Há otimização na utilização dos recursos disponíveis, evitando ociosidade de equipamentos, excesso de estoque e subutilização de mão de obra.'),

  // ==========================================
  // LGPD (Data Privacy) - 8 questions
  // ==========================================
  makeQuestion(47, 'lgpd', 'O CME obtém consentimento expresso e informado dos pacientes antes da coleta e processamento de dados pessoais em seus processos.'),
  makeQuestion(48, 'lgpd', 'Políticas de privacidade estão documentadas, acessíveis e comunicadas a todos os colaboradores que lidam com dados pessoais no CME.'),
  makeQuestion(49, 'lgpd', 'A retenção de dados no CME segue os prazos definidos na legislação, com políticas claras de descarte seguro após o período de guarda.'),
  makeQuestion(50, 'lgpd', 'Existem controles de acesso adequados (físicos e lógicos) para proteger dados pessoais e sensíveis processados no CME.'),
  makeQuestion(51, 'lgpd', 'O CME possui um plano de resposta a incidentes de segurança de dados, com procedimentos de notificação à ANPD e aos titulares dentro dos prazos legais.'),
  makeQuestion(52, 'lgpd', 'Os colaboradores do CME recebem treinamento periódico sobre a Lei Geral de Proteção de Dados (LGPD), boas práticas de privacidade e proteção de dados.'),
  makeQuestion(53, 'lgpd', 'Foi realizado o mapeamento completo dos dados pessoais tratados no CME, identificando finalidade, base legal, origem e fluxo dos dados.'),
  makeQuestion(54, 'lgpd', 'O compartilhamento de dados com terceiros (empresas de manutenção, fornecedores, laboratórios) é formalizado por meio de contratos e cláusulas de proteção de dados.'),

  // ==========================================
  // Additional questions to reach 59 total
  // ==========================================

  // Gestão (need 0 more - already at 9)

  // Processo (need 0 more - already at 12)

  // Tecnologia (need 0 more - already at 15)

  // Financeiro (need 0 more - already at 10)

  // LGPD (need 3 more to reach 8)
  makeQuestion(55, 'lgpd', 'O CME possui um Encarregado de Proteção de Dados (DPO) formalmente designado, responsável por supervisionar o cumprimento da LGPD.'),
  makeQuestion(56, 'lgpd', 'Medidas técnicas e organizacionais adequadas são implementadas para garantir a segurança dos dados pessoais, como criptografia e anonimização quando aplicável.'),
  makeQuestion(57, 'lgpd', 'O CME realiza avaliações de impacto à proteção de dados (AIPD) para processos de alto risco relacionados ao tratamento de dados sensíveis.'),

  // Additional process and management questions
  makeQuestion(58, 'gestao', 'O CME promove a integração e comunicação eficaz com as demais áreas da instituição (centro cirúrgico, enfermarias, emergência) para atendimento das demandas.'),
  makeQuestion(59, 'processo', 'O CME realiza validação de processos de limpeza por meio de testes como ATP-bioluminescência ou testes de sangue artificial, garantindo a eficácia da descontaminação.'),
];

export const TOTAL_QUESTIONS = questions.length;
