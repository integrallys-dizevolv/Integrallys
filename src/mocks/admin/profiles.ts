import type { PermissionModule } from "@/pages/admin/components/types";

export const MOCK_PROFILES = [
  "Administrador SaaS",
  "Gestor de Unidade",
  "Especialista",
  "Recepcionista",
  "Paciente",
];

export const PERMISSION_ACTIONS = [
  "Visualizar",
  "Cadastrar",
  "Editar",
  "Deletar",
];

const createModule = (id: string, nome: string): PermissionModule => ({
  id,
  nome,
  permissoes: PERMISSION_ACTIONS.map((action) => ({
    id: `${id}-${action.toLowerCase()}`,
    label: action,
    enabled: false,
  })),
});

export const MOCK_PERMISSION_MODULES: PermissionModule[] = [
  {
    ...createModule("agenda", "Agenda"),
    permissoes: [
      ...createModule("agenda", "Agenda").permissoes,
      {
        id: "agenda-simultanea",
        label: "Visualizar Agenda Simultânea",
        enabled: true,
      },
    ],
  },
  createModule("paciente", "Paciente"),
  createModule("prontuario", "Prontuário"),
  createModule("estoque", "Estoque"),
  createModule("financeiro", "Financeiro"),
  createModule("usuario", "Usuário"),
  createModule("relatorios", "Relatórios"),
  createModule("configuracoes", "Configurações"),
];
