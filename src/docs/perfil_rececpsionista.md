Master Spec v2: Ecossistema Integrallys - Recepção (PRD 001)
1. Diretrizes de Arquitetura e Clean Code

Modularização UI: Componentes de tabela, badges de status, inputs de busca e cards de resumo devem residir em src/modules/recepcao/UI para reutilização entre abas.


Sincronização Ativa: Qualquer alteração em Prescrições ou Estoque deve refletir instantaneamente no financeiro e no painel do especialista.


Segurança e RBAC: Acesso restrito a funções de edição conforme o nível de permissão de recepcionista.

2. Detalhamento das Páginas (Sidebar)
2.1. Início & Agenda 📅
Dashboard: Cards de métricas rápidas (Consultas, Aguardando, Cancelamentos).

Agenda Multi-View: Suporte a visualizações Dia, Semana e Mês com legenda de status (Confirmação, Check-in, Check-out, Atraso, Cancelado) e status de pagamento (Pago, Parcial, Pendente).

Notificação: Botão de alta prioridade "Chamar Especialista".

2.2. Pacientes 👥
CRM: Tabela de pacientes com badges de status de cadastro (Completo/Incompleto).

Cadastro: Obrigatoriedade do campo "Indicação (Origem)" para marketing e sistema de captura de foto.

2.3. Prescrições (Novo) 💊

Conversão de Orçamentos: Interface para visualizar prescrições enviadas pelo especialista.

Lógica Funcional:

Transformar itens prescritos em itens de venda no checkout.

Verificar automaticamente a disponibilidade no estoque antes de confirmar o orçamento.

Vincular o valor total ao módulo de Recebimentos.

2.4. Estoque (Novo) 📦
Gestão de Insumos: Visualização de níveis de estoque de suplementos e materiais.


Tombamento (RN-018): Funcionalidade para registrar transferência lógica e física de produtos entre unidades.



Baixa Automática: Integração com a finalização de atendimentos para subtrair itens utilizados/vendidos.

2.5. Lista de Espera (Novo) ⏳

Gestão de Encaixes: Lista dinâmica de pacientes aguardando horários vagos por desistência.

Funcionalidade: Opção de "Promover para Agenda" que preenche automaticamente os dados do paciente no novo horário.

2.6. Caixa, Recebimentos e Relatórios 📊

Caixa: Fluxo diário de abertura e fechamento.


Recebimentos: Conciliação Cielo e gestão de pagamentos antecipados (RN-019).


Relatórios: Sistema de Tabs (Consultas, Pacientes, Financeiro, Performance) com filtros de "Hoje" e "Ontem" e padding ajustado para valores.

3. Regras de Negócio (Lógica de Implementação)

RN-003: Bloqueio de agendamento se CPF/Telefone/Origem estiverem ausentes.


RN-019: Regra de Retorno de 35 dias aplicada automaticamente no cálculo de cobrança.


Sincronização de Presença: O Check-in na agenda deve disparar o status "Aguardando" no dashboard e na lista do especialista.