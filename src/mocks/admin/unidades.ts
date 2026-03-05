import type { Unit } from '@/pages/admin/components/types';

export const mockUnits: Unit[] = [
    { id: 1, nome: 'Clínica Central', cnpj: '12.345.678/0001-90', endereco: 'Av. Principal, 123 - Centro', gestor: 'Dr. João Silva', status: 'Ativa' },
    { id: 2, nome: 'Unidade Norte', cnpj: '23.456.789/0001-01', endereco: 'Rua Norte, 456 - Zona Norte', gestor: 'Dra. Maria Santos', status: 'Ativa' },
    { id: 3, nome: 'Consultório Sul', cnpj: '34.567.890/0001-12', endereco: 'Av. Sul, 789 - Zona Sul', gestor: 'Dr. Paulo Gestor', status: 'Em Manutenção' },
    { id: 4, nome: 'Sede Principal', cnpj: '45.678.901/0001-23', endereco: 'Rua Sede, 321 - Centro', gestor: 'Carlos Admin', status: 'Ativa' },
];
