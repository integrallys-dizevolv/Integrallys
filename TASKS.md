# Integrallys — Solicitações de Melhoria do Cliente

Estas são as 40 solicitações de melhoria do cliente, organizadas por módulo.
**Não são o escopo da migração** — são melhorias e novas funcionalidades a implementar durante ou após a migração, em paralelo com o `AGENTS.md`.

**Legenda:**
- ✅ `Finalizado` — já existe no Vite, garantir que seja migrado fielmente
- 🔄 `Em andamento` — existe parcialmente no Vite, completar durante a migração
- 🆕 `Não iniciado` — não existe no Vite, implementar do zero

---

## Agenda (todos os perfis com agenda)

- [ ] ✅ Ícone `$` exibe as mesmas informações de "Emitir Cobrança" e puxa automaticamente o valor do procedimento
- [ ] ✅ Pagamento parcial: modal de cobrança exibe demonstrativo do pagamento anterior (data + valor) e permite receber o saldo restante
- [ ] ✅ Status na ordem exata: `Confirmado` · `Check-in` · `Em Atendimento` · `Check-out` · `Em atraso` · `Cancelado`
- [ ] ✅ Ao alterar para `Cancelado`: pop-up obrigatório solicitando motivo do cancelamento
- [ ] ✅ Após cancelamento: horário fica opaco/cinza, permanece no histórico, slot liberado automaticamente
- [ ] ✅ Botão "Lista de Espera" ao lado de "+ Marcar Consulta"
- [ ] ✅ Botão "Tarefas" ao lado de "Lista de Espera" — lista individual por usuário logado
- [ ] ✅ Filtros na ordem: `Todos` · `Agendamentos` · `Aguardando` · `Em Atendimento` · `Atendidos`
- [ ] ✅ Nas abas `Todos` e `Agendamentos`: horários disponíveis visíveis de cada especialista
- [ ] ✅ Controle de agenda pessoal: filtro para ver só atendimentos / só pessoal / simultâneos
- [ ] ✅ Modal "Gerar Agenda": abertura por período (diário, mensal, até 2027+), feriados nacionais, tempo de atendimento e horários por especialista
- [ ] 🆕 Nos 3 pontinhos de cada consulta: após recebimento total, exibir "Emissão de recibo ou NF"

---

## Pacientes (Recepção)

- [ ] ✅ Campos adicionais não obrigatórios: RG, Inscrição Estadual
- [ ] ✅ Necessidade especial: sim/não → se sim: Física / Auditiva / Visual / Intelectual + campo descritivo
- [ ] ✅ CEP com preenchimento automático de cidade e estado
- [ ] ✅ Ao concluir cadastro: impressão/PDF com "Manual de Serviços Prestados" (puxa idade do cliente e responsável)
- [ ] ✅ Menor de 18 anos: cadastro de responsável obrigatório com grau de parentesco
- [ ] ✅ Acima de 70 anos: cadastro de responsável opcional
- [ ] ✅ Botão "Exige NF": sim/não com campos de dados para NF ("os mesmos" ou "adicionar" dados diferentes)
- [ ] ✅ Status: `Ativo` · `Inativo` · `Óbito`
- [ ] 🆕 Foto do paciente visível no editar e no visualizar
- [ ] 🆕 Informar tipo de vínculo: cliente, fornecedor, profissional, usuário, etc.

---

## Caixa (Recepção)

- [ ] ✅ Fechamento de caixa com transferência de valor para cofre/responsável

---

## Recebimentos (Recepção e Gestor)

- [ ] ✅ Cards clicáveis — ao clicar abre detalhamento dos valores

---

## Repasse (Admin e Gestor)

- [ ] ✅ Disponível apenas para Admin e Gestor — nunca para Recepção
- [ ] ✅ Coluna com percentual de cada especialista conforme cadastrado
- [ ] ✅ Status pago: disponibilizar impressão de recibo

---

## Prescrição / Vendas (Recepção)

- [ ] ✅ Nomenclatura "Prescrição/Vendas" padronizada em todos os lugares
- [ ] ✅ Após venda: ícone para emissão de NF ou recibo
- [ ] ✅ Após venda: pop-up "Agendar Retorno" — `Sim` (vai para agenda) ou `Mais tarde` (entra no relatório com tag "Retorno Pendente")
- [ ] ✅ Nova Prescrição/Venda sem vínculo a atendimento: nome paciente, produtos (buscador), quantidade, valor automático, forma de pagamento, desconto, vendedor — baixa estoque e lança caixa
- [ ] 🆕 Forma de pagamento "Consumo": venda calculada a preço de custo, não entra no caixa, baixa estoque; filtro "por consumo" no relatório de vendas

---

## Estoque (Recepção)

- [ ] 🆕 Entrada: NF, fornecedor, data, produto, quantidade, preço de custo, lote, validade; importar XML da NF com edição manual
- [ ] 🆕 Saída: produto, quantidade e justificativa (baixa que não seja venda)

---

## Lista de Espera (Recepção e Gestor)

- [ ] ✅ Coluna de preferência de horário: `Manhã` · `Tarde` · `Final do dia`

---

## Relatórios (Recepção)

- [ ] ✅ Remover: Relatório Financeiro, total de despesas e despesas por categoria
- [ ] ✅ Relatório de Retornos: data, nome, últimos 3 procedimentos, especialista, data prevista, status; filtros por período, nome, profissional, especialidade, situação
- [ ] 🆕 Orçamentos/Prescrição: monitorar clientes que não adquiriram produtos e controlar prazos

---

## Permissões (Admin)

- [ ] ✅ Configuração de quais especialistas cada recepcionista gerencia
- [ ] ✅ Permissão de acesso à agenda pessoal do especialista configurável por recepcionista

---

## Atendimento (Especialista)

- [ ] ✅ Início de atendimento: exibir todos os dados do paciente (nascimento, idade, CPF, endereço, telefone, email, foto)
- [ ] ✅ Anamnese em múltipla escolha sim/não — "sim" abre campo "Qual?/Observações"
- [ ] ✅ Documentos editáveis — modelo configurável por clínica
- [ ] ✅ Ao finalizar: pop-up de tempo de retorno (30, 60, 90, 120 dias, 6 meses, liberado, personalizado)
- [ ] ✅ Anatomy 3D abaixo de diagnose na área de anamnese durante o atendimento

---

## Pacientes (Especialista)

- [ ] 🆕 Coluna de ações: "Ajuste de posologia" (altera última prescrição) e "Prescrição complementar" (adiciona novos produtos)
- [ ] 🆕 Em "Ver ficha": exibir data de nascimento além da idade

---

## Prontuário (Especialista)

- [ ] 🆕 Visualizar: exibir todos os dados de cadastro (nascimento, idade, CPF, endereço, telefone, email, foto)
- [ ] 🆕 Anatomy 3D integrado na área de anamnese/diagnose

---

## Relatórios (Especialista)

- [ ] ✅ Aba "Meus Repassses" entre "Desempenho Geral" e "Minhas Comissões"
- [ ] ✅ "Minhas Comissões": tabela por Prescrição/Venda (valor total bruto), não por produto individual
- [ ] 🆕 "Minhas Comissões": botão Visualizar que abre os produtos da prescrição

---

## Dashboard (Gestor)

- [ ] ✅ Cards clicáveis — ao clicar abre detalhamento dos valores
- [ ] 🆕 Saldos de contas: incluir "Caixinha de Troco"

---

## Vendas (Gestor)

- [ ] ✅ Formato detalhado: colunas `preço unitário` · `custo unitário` · `margem`

---

## Financeiro (Admin e Gestor)

- [ ] ✅ Lançamentos: colunas `Forma` · `Status` · `Ações`
- [ ] ✅ Pagamentos: status `À vencer` (não "Pendente")
- [ ] ✅ Pagamentos: colunas `nº do documento` · `parcela` · `forma de pagamento` · `data de emissão`
- [ ] 🔄 Cartão de crédito empresarial (verificar o que existe no Vite e completar)

---

## Relatórios (Admin e Gestor)

- [ ] ✅ Agendamentos: filtros incluindo cancelados com justificativa, disponíveis, não comparecimentos
- [ ] ✅ Clientes: filtro por não comparecimento
- [ ] ✅ Estoque: movimentação diária com entrada (NF, fornecedor, produto, qtd, custo, venda, margem) e saída (cliente, produto, qtd, custo, venda, margem)
- [ ] ✅ Retornos: filtros por período, nome, profissional, especialidade, situação (no prazo / limite prazo / vencido)

---

## Aniversariantes (Admin)

- [ ] ✅ Card: nome, data de nascimento, idade, telefone, checkbox "ok — mensagem enviada"

---

## Configurações (Admin)

- [ ] ✅ Cadastros editáveis: bancos, formas de pagamento, formas de recebimento, categorias DRE, procedimentos, profissionais, documentos (atestados, laudos, encaminhamentos)

---

## Paciente — Portal

- [ ] ✅ Home: mensagem inicial editável por clínica
- [ ] ✅ Configurações pessoais: mesmos campos do cadastro da recepção (foto, necessidades especiais, CEP automático, responsável, exige NF)

---

## Documentação Clínica (Gestor)

- [ ] 🆕 Confirmar com cliente o que está proposto e implementar conforme definição

---

## Resumo

| Status | Qtd |
|---|---|
| ✅ Finalizado — existe no Vite, migrar fielmente | 26 |
| 🔄 Em andamento — existe parcialmente, completar | 1 |
| 🆕 Não iniciado — implementar do zero | 13 |
| **Total** | **40** |

---

## Checklist de Validação

Para cada item implementado, o agente deve validar os seguintes critérios antes de marcar como concluído:

### Validação por tipo de status

**Para itens ✅ Finalizado:**
- [ ] Comportamento idêntico ao Vite — abrir o arquivo original e comparar lado a lado
- [ ] Nenhum campo, botão ou fluxo foi omitido na migração
- [ ] Textos, labels e nomenclaturas idênticos ao Vite (ex: "Prescrição/Vendas", não "Prescrições")
- [ ] Modais abrem e fecham corretamente com os mesmos dados
- [ ] Validações de formulário preservadas (campos obrigatórios, formatos, máscaras)

**Para itens 🔄 Em andamento:**
- [ ] O que existe no Vite foi migrado fielmente
- [ ] A parte incompleta foi identificada e implementada
- [ ] O fluxo completo funciona de ponta a ponta

**Para itens 🆕 Não iniciado:**
- [ ] Funcionalidade implementada conforme a descrição da task
- [ ] Integrada ao fluxo existente sem quebrar o que já funciona
- [ ] Mock de dados criado se necessário
- [ ] Nenhum comportamento inventado — se a descrição for ambígua, perguntar antes de implementar

---

### Validação por módulo

**Agenda (todos os perfis)**
- [ ] Ícone `$` abre modal de cobrança com valor do procedimento preenchido automaticamente
- [ ] Pagamento parcial: modal exibe data e valor do pagamento anterior + campo para receber saldo restante
- [ ] Dropdown de status tem exatamente 6 opções na ordem correta
- [ ] Cancelamento abre pop-up de motivo — não cancela sem motivo preenchido
- [ ] Consulta cancelada: visualmente opaca na agenda, slot disponível para novo agendamento, aparece no histórico
- [ ] Botões aparecem na ordem: `+ Marcar Consulta` · `Lista de Espera` · `Tarefas`
- [ ] Filtros aparecem na ordem: `Todos` · `Agendamentos` · `Aguardando` · `Em Atendimento` · `Atendidos`
- [ ] Horários disponíveis visíveis nas abas `Todos` e `Agendamentos`
- [ ] Filtro de agenda pessoal funcionando com as 3 opções
- [ ] Modal "Gerar Agenda" com todas as configurações funcionando
- [ ] 3 pontinhos exibe "Emissão de recibo ou NF" somente após recebimento total

**Pacientes (Recepção)**
- [ ] Campos RG e Inscrição Estadual visíveis e não obrigatórios
- [ ] Campo necessidade especial: ao marcar "sim" aparece seletor de tipo + campo descritivo
- [ ] CEP: ao preencher e sair do campo, cidade e estado preenchem automaticamente
- [ ] Botão de impressão/PDF gera o Manual de Serviços com dados do paciente e responsável
- [ ] Ao informar data de nascimento < 18 anos: seção de responsável aparece como obrigatória
- [ ] Ao informar data de nascimento > 70 anos: seção de responsável aparece como opcional
- [ ] Botão "Exige NF" com os dois fluxos funcionando ("os mesmos dados" e "dados diferentes")
- [ ] Status com as 3 opções: Ativo, Inativo, Óbito
- [ ] Foto visível tanto na tela de editar quanto na de visualizar
- [ ] Campo de tipo de vínculo presente e funcional

**Caixa (Recepção)**
- [ ] Modal de fechamento tem campo para valor transferido ao cofre/responsável

**Recebimentos**
- [ ] Cada card é clicável e abre painel/modal com detalhamento dos valores

**Repasse**
- [ ] Módulo de repasse não aparece no menu da Recepção
- [ ] Coluna de percentual exibe o valor cadastrado para cada especialista
- [ ] Botão de imprimir recibo aparece somente quando status = Pago

**Prescrição / Vendas**
- [ ] Label "Prescrição/Vendas" em todos os menus, títulos e modais — nunca só "Prescrições" ou só "Vendas"
- [ ] Após venda concluída: ícone de NF/recibo visível na linha da venda
- [ ] Após venda: pop-up de retorno com as duas opções funcionando corretamente
- [ ] Modal de nova venda sem atendimento: todos os campos presentes, baixa o estoque e lança no caixa ao salvar
- [ ] Forma de pagamento "Consumo" disponível, calcula a preço de custo, não aparece no caixa, aparece no filtro do relatório

**Estoque (Recepção)**
- [ ] Modal de entrada com todos os campos: NF, fornecedor, data, produto, quantidade, custo, lote, validade
- [ ] Opção de importar XML da NF com possibilidade de editar os dados antes de salvar
- [ ] Modal de saída com campos: produto, quantidade, justificativa

**Lista de Espera**
- [ ] Coluna "Preferência de Horário" com as 3 opções: Manhã, Tarde, Final do dia

**Relatórios (Recepção)**
- [ ] Módulo financeiro, total de despesas e despesas por categoria não existem no menu da Recepção
- [ ] Relatório de Retornos com todos os campos e filtros
- [ ] Relatório de Orçamentos/Prescrição com controle de clientes pendentes e prazos

**Permissões (Admin)**
- [ ] Na configuração de perfil da Recepção: seletor de quais especialistas o recepcionista gerencia
- [ ] Opção de permitir ou bloquear acesso à agenda pessoal do especialista

**Atendimento (Especialista)**
- [ ] Tela de atendimento exibe: foto, data de nascimento, idade, CPF, endereço, telefone, email
- [ ] Anamnese: ao marcar "sim" em qualquer item, campo "Qual?/Observações" aparece abaixo
- [ ] Documentos: template editável vinculado à clínica
- [ ] Ao clicar em "Finalizar atendimento": pop-up de retorno com todas as opções de prazo
- [ ] Anatomy 3D visível abaixo da área de diagnose

**Pacientes (Especialista)**
- [ ] Coluna de ações com "Ajuste de posologia" e "Prescrição complementar"
- [ ] Modal "Ver ficha" exibe data de nascimento e idade

**Prontuário (Especialista)**
- [ ] Modal de visualização exibe todos os dados de cadastro incluindo foto
- [ ] Anatomy 3D presente na área de anamnese/diagnose

**Relatórios (Especialista)**
- [ ] Abas na ordem: `Desempenho Geral` · `Meus Repassses` · `Minhas Comissões`
- [ ] "Minhas Comissões": uma linha por prescrição/venda, não por produto
- [ ] Botão "Visualizar" em cada linha de comissão abre os produtos daquela prescrição

**Dashboard (Gestor)**
- [ ] Cada card é clicável e abre detalhamento
- [ ] "Caixinha de Troco" presente na seção de saldos de contas

**Vendas (Gestor)**
- [ ] Tabela exibe colunas `preço unitário`, `custo unitário` e `margem`

**Financeiro (Admin e Gestor)**
- [ ] Tabela de lançamentos tem colunas `Forma`, `Status` e `Ações`
- [ ] Status de pagamento exibe "À vencer", não "Pendente"
- [ ] Tabela de pagamentos tem colunas `nº do documento`, `parcela`, `forma de pagamento`, `data de emissão`
- [ ] Cartão de crédito empresarial verificado e completo

**Relatórios (Admin e Gestor)**
- [ ] Relatório de Agendamentos: filtros de cancelados com justificativa, disponíveis, não comparecimentos funcionando
- [ ] Relatório de Clientes: filtro "não comparecimento" presente e funcional
- [ ] Relatório de Estoque: aba ou seção de movimentação diária com todos os campos de entrada e saída
- [ ] Relatório de Retornos: filtros por situação com as 3 opções (no prazo, limite prazo, vencido)

**Aniversariantes (Admin)**
- [ ] Card exibe nome, data de nascimento, idade, telefone
- [ ] Checkbox "ok — mensagem enviada" funcional por paciente

**Configurações (Admin)**
- [ ] Todas as categorias de cadastro editáveis presentes: bancos, formas de pagamento, formas de recebimento, categorias DRE, procedimentos, profissionais, documentos

**Portal do Paciente**
- [ ] Mensagem da home é configurável por clínica (não hardcoded)
- [ ] Configurações pessoais com todos os campos do cadastro da recepção

**Documentação Clínica (Gestor)**
- [ ] Definição confirmada com o cliente antes de implementar
