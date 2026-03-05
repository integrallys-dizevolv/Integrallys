1. Diretrizes de Design & UX (Figma Maker Context)
Paleta de Cores: Verde Primário #1F382C (usado em botões, itens ativos na sidebar e badges de status "Ativo"). Fundo da UI em Branco Puro #FFFFFF.

Tipografia: Fonte Inter para todo o sistema. Títulos em Semibold, labels e corpo em Regular.

Componentização UI (Pasta gestor-unidade/UI):

Tabelas: Coluna "Ações" sempre com o botão de três pontos verticais (⋮) que abre menu contextual. Padding pr-8 na coluna de Valor.

Modais: Estrutura com Header e Footer fixos. O corpo (Body) possui scroll único se o conteúdo exceder 90vh.

Badges de Status: Ativo (Verde), Inativo (Cinza), Manutenção (Amarelo).

Indicadores de Pagamento ($): Verde (Pago Total), Amarelo (Pago Parcial), Vermelho (Pendente).

2. Estrutura de Navegação (As 12 Janelas do Sidebar)
2.1 Início (Dashboard Executivo)
Métricas de Performance: Cards com faturamento, ticket médio, taxa de ocupação e no-show.

Gráficos de Tendência: Comparativo de desempenho entre especialistas da unidade.

2.2 Gestão de Utilizadores & Permissões
Utilizadores: Listagem e edição de perfis (Médicos, Recepcionistas, etc.) vinculados à unidade.

Permissões: Ajuste de RBAC local (quem pode ver o DRE, quem pode editar a agenda).

2.3 Unidades & Equipas
Unidade: Detalhes da infraestrutura, salas disponíveis e horários de funcionamento.

Equipas: Gestão de especialidades e alocação de profissionais por sala.

2.4 Agenda Global (Dual-View)
Modo Calendário: Visualização em grade semanal sincronizada com todos os profissionais.

Modo Lista: Tabela escaneável de compromissos com filtros de status e pagamento.

Controlo: Seletor segmentado (Calendário/Lista) na top bar.

2.5 Pacientes (CRM de Unidade)
Listagem: Base de dados local com histórico de consultas e status financeiro.

Marketing (RN-003): Relatório de "Como nos conheceu" para análise de origem de tráfego.

2.6 Vendas de Produtos & Prescrições
PDV: Interface para venda direta de suplementos e conversão de orçamentos médicos.

Orçamentos: Visualização de planos de tratamento pendentes de aprovação.

2.7 Estoque por Unidade (RN-018)
Inventário: Saldo de insumos com alertas de estoque mínimo.

Tombamento: Modal completo para transferência de produtos (Lote, Validade, NF e Unidade Destino).

2.8 Financeiro & DRE Analítico
DRE: Demonstrativo de Resultados por Mês/Ano.

Categorias: Janela de gestão para criar categorias de Receita e Despesa.

Repasse: Cálculo de comissões de especialistas com filtros de período (De/Até).

2.9 Relatórios & Configurações
Corporativos: Exportação de dados operacionais em Excel/PDF.

Definições: Personalização da interface e preferências de notificação.

3. Regras de Negócio Fundamentais (Lógica de Código)
Sincronização Ativa: O Check-out na agenda deve gerar automaticamente uma entrada no Financeiro e, se houver prescrição, uma baixa no Estoque.

RN-009 (Imutabilidade): O gestor pode visualizar prontuários, mas nunca editá-los após finalizados.

Auditoria Global: Todo o ajuste manual de saldo de estoque ou estorno financeiro deve gerar um log de auditoria vinculado ao perfil do Gestor.

Responsividade: O layout deve ser adaptável para tablets (uso em trânsito dentro da clínica) e desktops.

4. Arquitetura de Pastas Sugerida
Plaintext

src/modules/gestor-unidade/
├── UI/                         # SegmentedControl, ModalScrollBody, ActionMenu (⋮)
├── components/                 # DRETable, TombamentoModal, RepasseFilter
├── hooks/                      # useDRE, useInventoryManagement, useUnitPerformance
├── services/                   # API: FinanceiroService, StockAPI, Analytics
└── pages/                      # Dashboard.tsx, AgendaGlobal.tsx, DREPage.tsx