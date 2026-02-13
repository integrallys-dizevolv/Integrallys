# 🩺 Perfil Especialista Clínico: Contexto Antigravity (FINAL)

## 1. Visão do Especialista (Persona: Dr. Adelmo)
O Especialista é o centro produtor de dados clínicos. O sistema deve priorizar a **redução da carga cognitiva** e a **imutabilidade dos dados legais**.

## 2. Componentes de UI Prioritários

### 2.1 Dashboard de Atendimento (The Clinical Hub)
* **Header Dinâmico:** Nome do paciente, idade, última consulta e **Cronômetro de Atendimento**.
* **Ação Crítica (RN-006):** Botão "Chamar Próximo" que dispara um Socket/Notificação modal para a Recepção.
* **Visualizador 3D (API Biodigital):** Placeholder integrado para modelos anatômicos.

### 2.2 Prontuário Inteligente (Editor de Prontuário)
* **Campos de Texto:** Anamnese, Exame Físico e Observações (suporte a Markdown/Rich Text).
* **Busca CID-11 (RF-007.5):** Input com debounce (< 1s) para busca na base oficial da OMS.
* **Regra de Imutabilidade (RN-009):** * Estado `Rascunho`: Edição livre.
    * Estado `Assinado`: Bloqueio total (`disabled`).
    * **Componente Adenda:** Campo para Notas/Erratas pós-assinatura com timestamp.

### 2.3 Prescrição e Estoque (Prescription Engine)
* **Grade de Prescrição:**
    * Auto-complete de itens vinculados ao estoque da unidade.
    * **Alerta de Saldo (RN-002):** Se `quantidade > estoque_disponível`, borda do input fica vermelha com tooltip de aviso.
* **Saída Financeira:** Botão "Finalizar e Orçar" gera automaticamente uma entidade `Budget` na recepção.

## 3. Fluxos de Trabalho (Logica de Front/Back)

| Ação | Gatilho | Regra de Negócio (RN) |
| :--- | :--- | :--- |
| **Finalizar Prontuário** | Clique em "Assinar Digitalmente" | RN-009: Bloqueia edição e gera hash de integridade. |
| **Prescrever Item** | OnChange Quantidade | RN-002: Valida contra API de Estoque Real. |
| **Chamada de Paciente** | Botão "Próximo" | Notificação In-App obrigatória para perfil 'Recepção'. |
| **Histórico** | Timeline Lateral | Carregamento assíncrono de consultas anteriores em Read-Only. |

## 4. Guia de Estilo (Style Guide - Integrallys)
* **Cor Primária:** Verde Esmeralda (Sucesso/Saúde).
* **Cor de Estado (Erro):** Coral (RN-001/002).
* **Tipografia:** Foco em legibilidade para leitura rápida de diagnósticos.
* **Modais:** Padrão para "Novo Atendimento" e "Confirmação de Assinatura".

## 5. Referência de Dados (Schema Simplificado)
```json
{
  "atendimento_id": "uuid",
  "status": "rascunho | finalizado",
  "paciente": { "id": "uuid", "nome": "string" },
  "clinico": {
    "anamnese": "text",
    "cid": "string",
    "anatomia_snapshot": "url"
  },
  "prescricao": [
    { "produto_id": "uuid", "dosagem": "string", "estoque_ok": "boolean" }
  ]
}