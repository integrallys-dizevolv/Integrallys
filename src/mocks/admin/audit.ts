export interface AuditLog {
    id: number;
    timestamp: string;
    usuario: string;
    acao: string;
    modulo: string;
    descricao: string;
    ip: string;
}

export const mockAuditLogs: AuditLog[] = [
    {
        id: 1,
        timestamp: '19/11/2026 14:32:15',
        usuario: 'Carlos Admin',
        acao: 'DELETAR',
        modulo: 'Agendamento',
        descricao: 'Deletou Agendamento ID: 4521',
        ip: '192.168.1.105'
    },
    {
        id: 2,
        timestamp: '19/11/2026 13:15:42',
        usuario: 'Dra. Maria Santos',
        acao: 'EDITAR',
        modulo: 'Prontuário',
        descricao: 'Editou Prontuário do Paciente ID: 789',
        ip: '192.168.1.87'
    },
    {
        id: 3,
        timestamp: '19/11/2026 11:08:33',
        usuario: 'Dr. João Silva',
        acao: 'CRIAR',
        modulo: 'Paciente',
        descricao: 'Cadastrou novo Paciente: Roberto Paciente',
        ip: '192.168.1.92'
    },
    {
        id: 4,
        timestamp: '18/11/2026 16:45:21',
        usuario: 'Carlos Admin',
        acao: 'EDITAR',
        modulo: 'Usuário',
        descricao: 'Alterou permissões do usuário Ana Secretária',
        ip: '192.168.1.105'
    },
    {
        id: 5,
        timestamp: '18/11/2026 09:22:10',
        usuario: 'Dr. Paulo Gestor',
        acao: 'CRIAR',
        modulo: 'Produto',
        descricao: 'Adicionou produto ao estoque: Luva Cirúrgica',
        ip: '192.168.1.73'
    },
    {
        id: 6,
        timestamp: '17/11/2026 15:33:05',
        usuario: 'Ana Secretária',
        acao: 'CRIAR',
        modulo: 'Agendamento',
        descricao: 'Criou novo agendamento para paciente João Silva',
        ip: '192.168.1.120'
    },
    {
        id: 7,
        timestamp: '17/11/2026 10:15:30',
        usuario: 'Carlos Admin',
        acao: 'EDITAR',
        modulo: 'Permissões',
        descricao: 'Modificou permissões do perfil Recepcionista',
        ip: '192.168.1.105'
    },
    {
        id: 8,
        timestamp: '16/11/2026 14:20:18',
        usuario: 'Dr. Paulo Gestor',
        acao: 'DELETAR',
        modulo: 'Produto',
        descricao: 'Removeu produto do estoque: Material vencido',
        ip: '192.168.1.73'
    },
];

