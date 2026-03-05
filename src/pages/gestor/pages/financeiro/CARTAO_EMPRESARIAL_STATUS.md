# Cartao de Credito Empresarial - Status

## Implementado
- Cadastro base de cartao empresarial com banco, limite, fechamento e vencimento.
- Aba dedicada no financeiro do gestor para visualizacao de cartoes e faturas.
- Visualizacao de faturas abertas, fechadas e pagas.

## Pendente de decisao de negocio
- Regras de conciliacao automatica com modulo de pagamentos.
- Multi-cartao por unidade com centros de custo obrigatorios.
- Regra de parcelamento por cartao e taxa financeira por emissor.

## Proximos passos tecnicos
- Persistir dados em tabelas Supabase (`cartoes_empresariais`, `faturas_cartao`, `lancamentos_cartao`).
- Integrar lancamentos de despesa para compor fatura automaticamente.
- Fechar ciclo com rotina de quitacao da fatura no modulo de pagamentos.
