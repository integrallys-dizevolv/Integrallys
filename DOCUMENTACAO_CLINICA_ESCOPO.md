# Documentacao Clinica - Escopo

Data de atualizacao: 2026-03-04

## Alinhado com cliente
- Atestados, laudos e encaminhamentos devem ser editaveis por admin/gestor.
- Especialista precisa gerar documentos durante atendimento.
- Documento gerado precisa ficar vinculado ao prontuario do paciente.

## Implementado
- Modulo de Documentacao Clinica com abas de geracao e gerenciamento de modelos.
- Listagem e edicao de modelos de documentos no fluxo de gestor.
- Base para documentos clinicos no fluxo de especialista.
- Persistencia local de modelos e suporte para variaveis em template.

## Pendente
- Persistencia definitiva em Supabase dos modelos e geracoes por paciente.
- Controle de versao de templates por clinica/unidade.
- Assinatura digital ICP-Brasil por documento em ambiente produtivo.

## Riscos/decisoes abertas
- Definir taxonomia final de categorias e permissao por perfil para cada template.
- Definir politica de retencao de documentos e auditoria de alteracoes.
