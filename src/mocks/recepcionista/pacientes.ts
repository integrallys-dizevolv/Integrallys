import { BASE_PACIENTES_LIST } from '@/mocks/shared/base'
import { Patient } from '../../pages/recepcao/context/types'

const getAgeLabel = (birthDate: string) => {
  const [year, month, day] = birthDate.split('-').map(Number)
  const birth = new Date(year, month - 1, day)
  const today = new Date('2026-02-21')
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1
  return `${age} anos`
}

export const MOCK_PACIENTES: Patient[] = BASE_PACIENTES_LIST.map((paciente, index) => ({
  id: `${index + 1}`,
  name: paciente.nome,
  cpf: paciente.cpf,
  rg: `00.${(index + 10).toString().padStart(3, '0')}.000-${index}`,
  inscricaoEstadual: `123.456.789.${(index + 10).toString().padStart(3, '0')}`,
  age: getAgeLabel(paciente.birthDate),
  birthDate: paciente.birthDate,
  phone: paciente.phone,
  email: paciente.email,
  gender: index % 2 === 0 ? 'feminino' : 'masculino',
  plan: index % 2 === 0 ? 'Particular' : 'Unimed',
  status: index % 3 === 0 ? 'incomplete' : 'complete',
  activeStatus: index % 4 === 0 ? 'Inativo' : 'Ativo',
  lastVisit: '2026-02-10',
  address: paciente.endereco,
  addressDetails: {
    zipCode: '01000-000',
    street: paciente.endereco.split(',')[0],
    number: '123',
    complement: '',
    neighborhood: 'Centro',
    city: 'Sao Paulo',
    state: 'SP'
  },
  source: index % 2 === 0 ? 'Indicacao' : 'Instagram',
  specialNeeds: {
    hasNeeds: false
  },
  financial: {
    requiresReceipt: true,
    receiptData: {
      useProfileData: true
    }
  }
}))
