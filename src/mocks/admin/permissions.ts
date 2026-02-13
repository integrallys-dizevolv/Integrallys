import type { Permission } from '@/pages/admin/components/types';

export const mockPermissions: Permission[] = [
    { id: 1, perfil: 'Administrador', descricao: 'Acesso total ao sistema', usuarios: 2 },
    { id: 2, perfil: 'Gestor de Unidade', descricao: 'Gestão completa da unidade', usuarios: 3 },
    { id: 3, perfil: 'Recepcionista', descricao: 'Gestão de agendamentos e recepção', usuarios: 8 },
    { id: 4, perfil: 'Especialista', descricao: 'Acesso a prontuários e consultas', usuarios: 25 },
    { id: 5, perfil: 'Paciente', descricao: 'Acesso ao prontuário próprio', usuarios: 1250 },
];

export const mockDetailedPermissions: (Permission & { modulo: string })[] = [
    { id: 1, perfil: 'Administrador', modulo: 'Agenda', descricao: 'Acesso total ao sistema', usuarios: 2 },
    { id: 2, perfil: 'Gestor de Unidade', modulo: 'Financeiro', descricao: 'Gestão completa da unidade', usuarios: 3 },
    { id: 3, perfil: 'Recepcionista', modulo: 'Pacientes', descricao: 'Gestão de agendamentos e recepção', usuarios: 8 },
];
