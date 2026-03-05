# Integrallys — Contexto de Refatoração

## Diretório do Projeto

```
/home/thiagocampelo/Documentos/Integrallys/Integrallys_vite
```

Não há projeto de destino separado — a refatoração acontece **dentro do próprio projeto Vite**, reorganizando o código existente sem mudar de plataforma.

### Onde encontrar cada coisa hoje (antes da refatoração)

| O que buscar | Caminho atual |
|---|---|
| Componentes por perfil | `src/pages/[perfil]/` |
| Componentes globais (Header, Sidebar) | `src/components/global/` |
| Componentes UI | `src/components/ui/` |
| Mocks (fonte de dados) | `src/mocks/` |
| Base de dados mock | `src/mocks/shared/base.ts` |
| Hooks existentes | `src/hooks/` |
| Utilitários | `src/utils/` |
| Tipos existentes | `src/types/` |
| Contextos | `src/contexts/` |

---

## Projeto

Plataforma clínica SaaS com 6 perfis de usuário: **Admin, Gestor, Recepção, Especialista, Paciente e Master**.

Stack: Vite · React · TypeScript · Tailwind CSS · Supabase (a integrar)

## Pilares da Refatoração

**1. Manutenibilidade**
Qualquer desenvolvedor deve conseguir localizar, entender e modificar qualquer parte do sistema sem precisar conhecer o projeto inteiro. Cada arquivo tem uma responsabilidade clara e um lugar previsível.

**2. Padronização**
Todo o código segue os mesmos padrões — mesma estrutura de pastas, mesmo padrão de componente, mesmo padrão de service+hook — independentemente do perfil ou do módulo. O que vale para Admin vale para Recepção.

**3. Fidelidade funcional**
Nenhuma funcionalidade é adicionada, removida ou alterada. O comportamento visual e funcional permanece 100% idêntico ao atual. A refatoração é de arquitetura, não de produto.

Estes três pilares têm precedência sobre qualquer outra decisão. Se uma escolha técnica compromete manutenibilidade ou padronização, ela está errada independentemente de funcionar.

---

## Estrutura de Pastas — Destino da Refatoração

Esta é a estrutura canônica que o projeto deve ter ao final. Nenhum arquivo deve ser criado fora dela sem justificativa.

```
src/
├── components/
│   ├── ui/                        # Camada 1: primitivos (Button, Input, Card...)
│   ├── shared/                    # Camada 2: componentes de negócio reutilizáveis
│   │   ├── layout/                # Header, Sidebar, PortalLayout, NotificationsSheet
│   │   ├── modals/                # modais compartilhados entre perfis
│   │   ├── forms/                 # formulários compartilhados
│   │   └── tables/                # tabelas reutilizáveis com filtros
│   └── features/                  # Camada 3: específico por perfil
│       ├── admin/
│       ├── gestor/
│       ├── recepcao/
│       ├── especialista/
│       ├── paciente/
│       └── master/
│
├── hooks/                         # hooks de dados (useAgendamentos, usePacientes...)
├── services/                      # acesso a dados (agendamentos.service.ts...)
├── contexts/                      # AuthContext, SystemConfigContext
├── types/                         # todos os tipos TypeScript
├── utils/                         # dateUtils, statusBadges, etc.
├── lib/                           # supabase.ts, colors.ts, cn()
├── mocks/                         # dados mock — removidos ao integrar Supabase
│
└── pages/                         # mantido durante a refatoração
    └── [perfil]/                  # esvaziado gradualmente conforme features migram
```

> **Regra de transição:** `src/pages/` continua existindo durante a refatoração. Conforme cada feature é refatorada, seus componentes são movidos para `src/components/features/[perfil]/` e o arquivo em `src/pages/` passa a importar dali. Ao final, `src/pages/` contém apenas os entrypoints de roteamento, sem lógica.

---

## Roteamento

O sistema usa roteamento por estado interno (`currentPage` + switch) dentro de cada `Principal[Perfil].tsx`. **Isso não muda.** O que muda é onde a lógica de cada feature vive.

### Antes (padrão atual a ser eliminado)

```tsx
// src/pages/recepcao/PrincipalRecepcao.tsx
// Lógica, UI e dados todos misturados
const renderContent = () => {
  switch (currentPage) {
    case 'agenda':    return <AgendaView />      // componente local com lógica embutida
    case 'pacientes': return <PacientesView />
  }
}
```

### Depois (padrão alvo)

```tsx
// src/pages/recepcao/PrincipalRecepcao.tsx
// Só roteamento — sem lógica, sem dados, sem UI própria
import { AgendaRecepcao }    from '@/components/features/recepcao/AgendaRecepcao'
import { PacientesRecepcao } from '@/components/features/recepcao/PacientesRecepcao'

const renderContent = () => {
  switch (currentPage) {
    case 'agenda':    return <AgendaRecepcao />
    case 'pacientes': return <PacientesRecepcao />
  }
}
```

---

## Contrato dos Componentes Shared

> **Regra de ouro:** shared resolve estrutura. Feature resolve contexto.

Um componente em `components/shared/` deve obedecer as 5 regras sem exceção:

| # | Regra | Na prática |
|---|-------|-----------|
| 1 | **Cego ao perfil** | Nunca importa `useAuth`. Nunca tem `if (role === x)`. |
| 2 | **Variação via props** | Se pode variar, a variação vem de fora. Quem chama decide. |
| 3 | **Permissões ficam na feature** | Botões condicionais não existem dentro do shared. A feature passa via props. |
| 4 | **Não busca dados** | Nenhum hook de dados. Recebe tudo via props. |
| 5 | **Não conhece rotas** | Nenhum link hardcoded. Navegação é prop quando necessário. |

### Exemplo de Shared Correto

```tsx
// components/shared/tables/DataTable.tsx

interface DataTableProps<T> {
  data:          T[]
  columns:       ColumnDef<T>[]
  loading?:      boolean
  actions?:      React.ReactNode  // botões vêm de fora
  emptyMessage?: string
  onRowClick?:   (row: T) => void
}

export function DataTable<T>({ data, columns, loading, actions, onRowClick }: DataTableProps<T>) {
  // Só renderiza. Não sabe o que são os dados.
  // Não sabe quem está usando.
  // Não decide o que mostrar ou esconder.
}
```

### Exemplo de Feature Usando o Shared

```tsx
// components/features/admin/UsuariosAdmin.tsx

export function UsuariosAdmin() {
  const { usuarios, loading } = useUsuarios()

  const columns: ColumnDef<Usuario>[] = [
    { header: 'Nome',   accessor: 'nome' },
    { header: 'Role',   accessor: 'role' },
    { header: 'Status', accessor: 'status' },
  ]

  return (
    <DataTable
      data={usuarios}
      columns={columns}
      loading={loading}
      actions={<BotaoCriarUsuario />}   // ← permissão decidida aqui, não no DataTable
    />
  )
}
```

---

## Padrão de Service e Hook

### Service

Função async pura. Retorna mock agora. Ao integrar Supabase, descomenta a query e remove o retorno mock.

```ts
// services/agendamentos.service.ts

export async function getAgendamentos(filters?: AgendamentoFilters): Promise<Agendamento[]> {
  // TODO: Supabase
  // const { data, error } = await supabase
  //   .from('agendamentos')
  //   .select('*')
  //   .order('hora')
  // if (error) throw error
  // return data

  return MOCK_AGENDAMENTOS  // ← remover ao conectar Supabase
}
```

### Hook

Encapsula o service e gerencia `loading`, `error` e estado local. **Componentes nunca chamam services diretamente — sempre usam o hook.**

```ts
// hooks/useAgendamentos.ts

export function useAgendamentos(filters?: AgendamentoFilters) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]    = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getAgendamentos(filters)
      .then(setAgendamentos)
      .catch(() => setError('Erro ao carregar agendamentos'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(filters)])

  const cancelar = async (id: string, motivo?: string) => {
    await cancelarAgendamento(id, motivo)
    setAgendamentos(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'Cancelado' } : a)
    )
  }

  return { agendamentos, loading, error, cancelar }
}
```

---

## Padrão de Componente de Feature

```tsx
// components/features/recepcao/AgendaRecepcao.tsx

export function AgendaRecepcao() {
  // 1. Busca dados via hook — nunca via service diretamente
  const { agendamentos, loading, cancelar } = useAgendamentos()

  // 2. Define colunas específicas da recepção
  const columns: ColumnDef<Agendamento>[] = [
    { header: 'Paciente', accessor: 'paciente_nome' },
    { header: 'Horário',  accessor: 'hora' },
    { header: 'Status',   accessor: 'status' },
  ]

  // 3. Define ações permitidas para recepção — não existe no shared
  const actions = (
    <>
      <BotaoNovoAgendamento />
      <BotaoListaEspera />
    </>
  )

  // 4. Usa shared para renderizar — sem lógica de layout aqui
  return (
    <DataTable
      data={agendamentos}
      columns={columns}
      loading={loading}
      actions={actions}
    />
  )
}
```

---

## Escopo por Perfil

O escopo é idêntico ao sistema atual. A refatoração não adiciona nem remove features.

| Perfil | Features |
|--------|----------|
| **Admin** | Agenda · Usuários · Permissões · Unidades · Financeiro (Lançamentos, Caixa, Pagamentos, Recebimentos, DRE) · Repasse · Auditoria · Relatórios · Configurações |
| **Gestor** | Agenda Global · Pacientes · Estoque · Financeiro (DRE) · Pagamentos · Recebimentos · Permissões · Usuários · Unidades · Relatórios · Documentação Clínica · Vendas · Configurações |
| **Recepção** | Agenda · Pacientes · Caixa · Estoque · Prescrições · Recebimentos · Lista de Espera · Relatórios · Configurações |
| **Especialista** | Agenda Pessoal · Atendimento (Anamnese + Prontuário + Prescrição + Conclusão) · Pacientes · Estoque · Prescrições · Prontuários · Evoluções · Anamnese · Relatórios · Configurações |
| **Paciente** | Agenda · Novo Agendamento · Reagendar · Histórico · Prescrições · Pagamentos · Cartões · Configurações |
| **Master** | Acesso total a todos os módulos de todos os perfis |

---

## Checklist — Feature Refatorada

Uma feature só é considerada pronta quando todos os itens abaixo estiverem ok:

### Estrutura
- [ ] Componente existe em `src/components/features/[perfil]/[Feature][Perfil].tsx`
- [ ] `Principal[Perfil].tsx` importa o novo componente — sem lógica interna restante para essa feature
- [ ] Componentes UI usados vêm de `src/components/ui/` — sem cópias locais

### Componentes
- [ ] Elementos reutilizáveis entre perfis estão em `src/components/shared/`
- [ ] Nenhum componente shared importa `useAuth` ou lê o role do usuário
- [ ] Permissões e ações específicas ficam apenas na feature, passadas via props para o shared

### Dados
- [ ] Feature usa hook — nunca chama service diretamente
- [ ] Hook gerencia `loading` e `error`
- [ ] Dados mock cobrem 100% do que é exibido na tela

### Qualidade
- [ ] Sem `any` no TypeScript — todos os tipos em `src/types/`
- [ ] Dark mode funcionando
- [ ] Sem `console.error` ou warnings no terminal
- [ ] Layout e comportamento visual **idênticos** ao antes da refatoração

---

## O Que Nunca Fazer

- **Nunca duplicar componente UI.** Ajuste em `src/components/ui/`, nunca crie cópia local.
- **Nunca colocar lógica de perfil em shared.** Nenhum `if (role === x)` dentro de `components/shared/`.
- **Nunca chamar service direto do componente.** Sempre use o hook correspondente.
- **Nunca apagar código de `src/pages/` sem ter o substituto em `src/components/features/` funcionando.**
- **Nunca alterar comportamento visual.** A refatoração é de arquitetura, não de UI.
- **Nunca usar `any` no TypeScript.** Se o tipo não existe, crie-o em `src/types/` antes de usar.

---

## Melhorias do Cliente

As 40 solicitações de melhoria estão documentadas em:
```
/home/thiagocampelo/Documentos/Integrallys/TASKS.md
```

Ao refatorar um módulo, consulte o `TASKS.md` para verificar se há melhorias a aplicar naquele módulo. Itens ✅ já existem no código — garantir que sejam preservados. Itens 🆕 devem ser implementados do zero junto com a refatoração.

---

## Como Solicitar uma Refatoração

Use este formato ao pedir a refatoração de uma feature:

```
Seguindo os padrões do AGENTS.md, refatore a feature [NOME] do perfil [PERFIL].

Leia o componente original em:
/home/thiagocampelo/Documentos/Integrallys/Integrallys_vite/src/pages/[perfil]/pages/[feature]/[Componente].tsx

Crie o componente refatorado em:
/home/thiagocampelo/Documentos/Integrallys/Integrallys_vite/src/components/features/[perfil]/[Componente].tsx

Atualize o Principal[Perfil].tsx para importar o novo componente.
Extraia os componentes reutilizáveis para src/components/shared/ se aplicável.
Crie o hook use[Feature] em src/hooks/ e o service em src/services/.
Consulte o TASKS.md para verificar se há melhorias do cliente para este módulo.
Siga o checklist do AGENTS.md antes de considerar concluído.
```

---

## Ordem de Execução

1. **Admin** — define o padrão para os demais
2. **Gestor** — muito parecido com Admin, reutiliza bastante
3. **Recepção** — módulos próprios (Caixa, Lista de Espera)
4. **Especialista** — fluxo de atendimento mais complexo
5. **Paciente** — portal mais isolado
6. **Master** — não tem código próprio; reutiliza os componentes dos 5 perfis acima