export interface Integration {
    id: number;
    nome: string;
    tipo: string;
    status: string;
    ultimaSync: string;
}

export const mockIntegrations: Integration[] = [
    { id: 1, nome: 'WhatsApp API', tipo: 'Mensageria', status: 'Ativa', ultimaSync: 'Há 5 min' },
    { id: 2, nome: 'Gateway de Pagamento', tipo: 'Financeiro', status: 'Ativa', ultimaSync: 'Há 12 min' },
    { id: 3, nome: 'Google Calendar', tipo: 'Agenda', status: 'Inativa', ultimaSync: 'Ontem' },
];
