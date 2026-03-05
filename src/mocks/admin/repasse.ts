export interface Repasse {
    id: number;
    especialista: string;
    especialidade: string;
    periodo: string;
    valorBruto: string;
    valorRepasse: string;
    percentual: string;
    validado: boolean;
    status: string;
    tipoVinculo: 'Colaborador' | 'Parceiro';
}

export const mockRepasses: Repasse[] = [
    { id: 1, especialista: 'Dr. Carlos Silva', especialidade: 'Odontologia', periodo: 'Dezembro 2026', valorBruto: 'R$ 8.500,00', valorRepasse: 'R$ 3.400,00', percentual: '40%', validado: false, status: 'Pendente', tipoVinculo: 'Colaborador' },
    { id: 2, especialista: 'Dra. Ana Paula', especialidade: 'Fisioterapia', periodo: 'Dezembro 2026', valorBruto: 'R$ 6.200,00', valorRepasse: 'R$ 3.100,00', percentual: '50%', validado: true, status: 'Pago', tipoVinculo: 'Colaborador' },
    { id: 3, especialista: 'Dr. Diego (Parceiro)', especialidade: 'Psicologia', periodo: 'Dezembro 2026', valorBruto: 'R$ 3.000,00', valorRepasse: 'R$ 900,00', percentual: '30%', validado: false, status: 'Pendente', tipoVinculo: 'Parceiro' },
    { id: 4, especialista: 'Dra. Mariana Costa', especialidade: 'Nutricao', periodo: 'Novembro 2026', valorBruto: 'R$ 5.800,00', valorRepasse: 'R$ 2.610,00', percentual: '45%', validado: true, status: 'Pago', tipoVinculo: 'Colaborador' },
    { id: 5, especialista: 'Dr. Fernando Souza', especialidade: 'Ortopedia', periodo: 'Dezembro 2026', valorBruto: 'R$ 12.000,00', valorRepasse: 'R$ 4.800,00', percentual: '40%', validado: true, status: 'Pendente', tipoVinculo: 'Colaborador' }
];

export const mockRepasseConfigs = [
    { id: 1, especialista: 'Dr. Carlos Silva', especialidade: 'Odontologia', unidade: 'Agua Boa', tipo: 'Percentual', valor: '40%', tipoVinculo: 'Colaborador' },
    { id: 2, especialista: 'Dra. Ana Paula', especialidade: 'Fisioterapia', unidade: 'Agua Boa', tipo: 'Percentual', valor: '50%', tipoVinculo: 'Colaborador' },
    { id: 3, especialista: 'Dr. Diego (Parceiro)', especialidade: 'Psicologia', unidade: 'Querencia', tipo: 'Percentual', valor: '30%', tipoVinculo: 'Parceiro' },
    { id: 4, especialista: 'Dra. Mariana Costa', especialidade: 'Nutricao', unidade: 'Agua Boa', tipo: 'Percentual', valor: '45%', tipoVinculo: 'Colaborador' }
];
