# Padrões e Regras do Projeto

## 1. Organização de Código

### 1.1 Estrutura de Arquivos
- **Cada arquivo deve ter uma única responsabilidade**
- Nomes de arquivos em camelCase (exceto componentes React em PascalCase)
- grouping por funcionalidade, não por tipo
- máxima de ~300 linhas por arquivo

### 1.2 Estrutura de Pastas
```
src/
├── app/                    # Rotas pages
│   ├── (routes)/          # Route groups
│   ├── api/               # APIs
│   └── layout.tsx
├── components/
│   ├── ui/                # Componentes base (shadcn)
│   ├── features/          # Componentes de features
│   └── layouts/           # Componentes de layout
├── lib/
│   ├── utils.ts           # Funções utilitárias
│   ├── db.ts              # Conexão banco
│   └── types.ts           # Tipos globais
├── hooks/                 # Custom hooks
├── contexts/              # React contexts
├── services/             # Lógica de negócio (se necessário)
└── config/                # Configurações
```

### 1.3 Componentes React
- **Nome em PascalCase**: `LoginForm.tsx`, `UserList.tsx`
- ** Props Interface**: `interface LoginFormProps { onSubmit: () => void }`
- **Arquivo único**: componente + estilos (se inline) no mesmo arquivo
- **Separar se > 200 linhas**: extrair sub-componentes
- **Max 3 níveis de Props drilling**: usar Context se necessário

## 2. Banco de Dados

### 2.1 Schema Prisma
- Uma tabela por entidade
- Nome em snake_case (plural): `users`, `assessment_scores`
- PK sempre UUID com `@default(cuid())`
- FK com nomes claros: `userId`, `assessmentId`
- Enum para valores fixos
- indexes em campos de busca/relacionamento

### 2.2 Queries
- nunca usar `prisma.$queryRaw` para queries simples
- usar transactions para operações múltiplas
- sempre tratar erros com try/catch

### 2.3 Manutenção do Prisma
- **APÓS qualquer mudança no schema.prisma**, sempre executar:
  ```bash
  npx prisma migrate dev --name nome_da_mudanca
  npx prisma generate
  ```
- O `prisma generate` atualiza o client e é necessário para o Next.js reconhecer os novos campos
- Se após a migration ainda der erro de "Unknown argument", limpar cache: `rm -rf .next/cache`

### 2.4 Restart do Servidor
- O comando `pkill -f "next dev"` pode não funcionar em alguns ambientes
- Para restart completo: fechar o terminal e abrir novo, ou:
  ```bash
  # No Linux/Mac - matar processo na porta:
  fuser -k 3000/tcp 2>/dev/null || lsof -ti:3000 | xargs kill -9 2>/dev/null
  ```

## 3. APIs

### 3.1 Estrutura
```
src/app/api/
└── [recurso]/
    └── route.ts  (GET, POST, PUT, DELETE)
```

### 3.2 Padrão de Resposta
```typescript
// Sucesso
return NextResponse.json({ data: ..., message: '...' }, { status: 200 })

// Erro
return NextResponse.json({ error: 'mensagem' }, { status: 400 })
```

### 3.3 Validação
- sempre validar input (zod/schema)
- sanitizar dados antes de salvar

## 4. Typescript

### 4.1 Tipos
- nunca usar `any`
- criar interfaces para objetos complexos
- usar type aliases para unions/enums
- tipar retornos de funções

### 4.2 Imports
- usar path aliases (@/...)
- grouping: external -> internal -> components
- evitar imports circulares

## 5. React/Next.js

### 5.1 Client vs Server
- usar 'use client' apenas quando necessário (interatividade)
- server components por padrão
- fetches no server quando possível

### 5.2 State Management
- useState para estado local simples
- useReducer para lógica complexa
- Context para estado global
- Zustand/React Query para estado server

### 5.3 Hooks
- custom hooks para lógica reutilizável
- naming: `useNomeFeature`
- um hook = uma responsabilidade

## 6. Estilização

### 6.1 CSS
- usar classes do Tailwind quando possível
- criar componente se precisar de CSS customizado
- evitar CSS inline (exceto para dynamic styles)

### 6.2 Responsividade
- mobile-first
- breakpoints: sm(640), md(768), lg(1024), xl(1280)

## 7. Convenções de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Arquivo componente | PascalCase | `UserCard.tsx` |
| Arquivo util/helper | camelCase | `dateUtils.ts` |
| Arquivo de configuração | camelCase | `dbConnect.ts` |
| Hook | camelCase com prefix `use` | `useAuth.ts` |
| Variável/função | camelCase | `getUserById` |
| Constante | UPPER_SNAKE | `MAX_RETRY` |
| Interface | PascalCase | `UserResponse` |
| Enum | PascalCase | `UserRole` |

## 8. Git/Commits

### 8.1 Branch Naming
- `feature/nome-da-feature`
- `fix/nome-do-bug`
- `refactor/nome-do-refactor`

### 8.2 Commit Messages
- imperative mood
- max 72 chars na primeira linha
- corpo se necessário

## 9. Performance

- lazy load de rotas/pages pesadas
- memoizar componentes custosos
- evitar re-renders desnecessários
- otimizar imagens (next/image)
- Code splitting quando possível

## 10. Segurança

- nunca expor segredos no código
- validar tudo que vem do usuário
- escapar outputs
- usar prepared statements (prisma já faz)
- implementar rate limiting em APIs