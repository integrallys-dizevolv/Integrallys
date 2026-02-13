import { BASE_PACIENTES } from '@/mocks/shared/base'

export interface PatientProfile {
    name: string;
    cpf: string;
    birthDate: string;
    email: string;
    phone: string;
    cep: string;
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    initials: string;
}

const patient = BASE_PACIENTES.maria

export const MOCK_PATIENT_PROFILE: PatientProfile = {
    name: patient.nome,
    cpf: patient.cpf,
    birthDate: '1985-03-15',
    email: patient.email,
    phone: patient.phone,
    cep: '01310-100',
    address: patient.endereco,
    neighborhood: 'Bela Vista',
    city: 'Sao Paulo',
    state: 'SP',
    initials: 'MS'
};
