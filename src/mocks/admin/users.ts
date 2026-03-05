import type { User } from '@/pages/admin/components/types';

export const mockUsers: User[] = [
    { id: 1, nome: 'Dr. João Silva', perfil: 'Médico', status: 'Ativo', email: 'joao@integrallys.com', unidade: 'Clínica Central', crth: 'CRM 123456-SP' },
    { id: 2, nome: 'Dra. Maria Santos', perfil: 'Especialista', status: 'Ativo', email: 'maria@integrallys.com', unidade: 'Unidade Norte', crth: 'CRTH 67890-SP' },
    { id: 3, nome: 'Carlos Admin', perfil: 'Administrador', status: 'Inativo', email: 'carlos@integrallys.com', unidade: 'Sede Principal' },
    { id: 4, nome: 'Ana Secretária', perfil: 'Recepcionista', status: 'Ativo', email: 'ana@integrallys.com', unidade: 'Consultório Sul' },
    { id: 5, nome: 'Dr. Paulo Gestor', perfil: 'Gestor de Unidade', status: 'Ativo', email: 'paulo@integrallys.com', unidade: 'Clínica Central', crth: 'CRP 11223-RJ' },
    { id: 6, nome: 'Roberto Paciente', perfil: 'Paciente', status: 'Ativo', email: 'roberto@email.com', unidade: 'N/A' },
    { id: 7, nome: 'Dra. Fernanda Costa', perfil: 'Especialista', status: 'Ativo', email: 'fernanda@integrallys.com', unidade: 'Unidade Norte', crth: 'CRO 45678-MG' },
    { id: 8, nome: 'Dr. Ricardo Lima', perfil: 'Especialista', status: 'Ativo', email: 'ricardo@integrallys.com', unidade: 'Clínica Central', crth: 'CREFITO 98765-RJ' },
];
