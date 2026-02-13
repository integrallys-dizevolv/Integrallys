import { Building2, Wallet, CreditCard } from 'lucide-react';

export const MOCK_ACCOUNTS = [
    { name: 'Banco Itaú - CC 12345-6', balance: 'R$ 15.800,00', type: 'Banco', icon: Building2, color: 'bg-blue-500' },
    { name: 'Banco Santander - CC 98765-4', balance: 'R$ 8.200,00', type: 'Banco', icon: Building2, color: 'bg-rose-500' },
    { name: 'Espécie / Cofre', balance: 'R$ 2.350,00', type: 'Espécie', icon: Wallet, color: 'bg-emerald-500' },
    { name: 'Cartão de Crédito', balance: 'R$ 1.200,00', type: 'Cartão', icon: CreditCard, color: 'bg-purple-500' },
];

export const MOCK_PAYMENTS_DUE = [
    { title: 'Aluguel Clínica', value: 'R$ 3.500,00', cat: 'Despesas Fixas', date: '15/11/2026' },
    { title: 'Salário Equipe', value: 'R$ 12.000,00', cat: 'Folha de Pagamento', date: '20/11/2026' },
    { title: 'Material Médico', value: 'R$ 1.800,00', cat: 'Fornecedores', date: '25/11/2026' },
];

export const MOCK_RECEIVABLES = [
    { title: 'Maria Silva', value: 'R$ 280,00', cat: 'Consulta Nutricional', date: '19/11/2026' },
    { title: 'João Santos', value: 'R$ 450,00', cat: 'Hidroterapia Colônica', date: '22/11/2026' },
    { title: 'Ana Costa', value: 'R$ 180,00', cat: 'Consulta Retorno', date: '25/11/2026' },
];

export const MOCK_AGENDA_TODAY = [
    { time: '08:00', patient: 'Carlos Mendes', expert: 'Dra. Ana Paula', proc: 'Hidrocolon', room: 'Sala 1', status: 'Confirmado' },
    { time: '09:30', patient: 'Fernanda Lima', expert: 'Dr. Roberto Silva', proc: 'Consulta Nutricional', room: 'Sala 2', status: 'Confirmado' },
    { time: '11:00', patient: 'Paulo Oliveira', expert: 'Dra. Ana Paula', proc: 'Hidrocolon', room: 'Sala 1', status: 'Aguardando' },
    { time: '14:00', patient: 'Juliana Costa', expert: 'Dr. Roberto Silva', proc: 'Acupuntura', room: 'Sala 3', status: 'Confirmado' },
];

