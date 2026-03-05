import { BASE_PACIENTES_LIST } from '@/mocks/shared/base'

export interface Aniversariante {
  id: string
  nome: string
  dataNascimento: string
  telefone: string
  idade: number
  mensagemEnviada: boolean
}

const calcIdade = (birthDate: string, refDate: Date) => {
  const [year, month, day] = birthDate.split('-').map(Number)
  let age = refDate.getFullYear() - year
  const hasBirthdayPassed =
    refDate.getMonth() + 1 > month ||
    (refDate.getMonth() + 1 === month && refDate.getDate() >= day)
  if (!hasBirthdayPassed) age -= 1
  return age
}

export const mapPacientesToAniversariantes = (refDate: Date) =>
  BASE_PACIENTES_LIST.map((paciente) => ({
    id: paciente.id,
    nome: paciente.nome,
    dataNascimento: paciente.birthDate,
    telefone: paciente.phone,
    idade: calcIdade(paciente.birthDate, refDate),
    mensagemEnviada: false
  }))

