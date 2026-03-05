import { Calendar, Users, XCircle } from 'lucide-react'

export const MOCK_DASHBOARD_STATS = [
    {
        label: 'Consultas Hoje',
        value: '24',
        icon: Calendar,
        color: 'text-blue-500',
        iconBg: 'bg-blue-50',
        borderColor: 'border-l-4 border-blue-500'
    },
    {
        label: 'Pacientes Aguardando',
        value: '7',
        icon: Users,
        color: 'text-green-500',
        iconBg: 'bg-green-50',
        borderColor: 'border-l-4 border-green-500'
    },
    {
        label: 'Cancelamentos',
        value: '3',
        icon: XCircle,
        color: 'text-red-500',
        iconBg: 'bg-red-50',
        borderColor: 'border-l-4 border-red-500'
    }
];

export const MOCK_NEXT_APPOINTMENTS = [
    {
        id: 1,
        patient: 'Maria Silva',
        specialist: 'Dr. João Santos',
        type: 'Consulta',
        time: '14:30',
        status: 'Confirmado',
        statusColor: 'bg-green-100 text-green-700'
    },
    {
        id: 2,
        patient: 'Pedro Costa',
        specialist: 'Dra. Ana Lima',
        type: 'Retorno',
        time: '15:00',
        status: 'Aguardando',
        statusColor: 'bg-amber-100 text-amber-700'
    }
];
