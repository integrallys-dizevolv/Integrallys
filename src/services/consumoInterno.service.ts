export interface ConsumoInternoRegistro {
  id: string
  data: string
  hora: string
  usuario: string
  perfil: 'recepcao' | 'gestor' | 'master'
  paciente: string
  produto: string
  quantidade: number
  custoUnitario: number
  totalCusto: number
  origem: 'prescricao-venda' | 'edicao-prescricao'
}

interface ConsumoInternoInput {
  usuario: string
  perfil: 'recepcao' | 'gestor' | 'master'
  paciente: string
  produto: string
  quantidade: number
  custoUnitario: number
  origem: 'prescricao-venda' | 'edicao-prescricao'
}

interface ConsumoAlert {
  id: number
  title: string
  description: string
  date: string
  read: boolean
  profile: 'gestor'
}

const CONSUMO_REGISTROS_KEY = 'integrallys_consumo_interno_registros_v1'
const CONSUMO_ALERTAS_KEY = 'integrallys_consumo_interno_alertas_v1'

const isBrowser = () => typeof window !== 'undefined'

export const loadConsumoInterno = (): ConsumoInternoRegistro[] => {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(CONSUMO_REGISTROS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ConsumoInternoRegistro[]) : []
  } catch {
    return []
  }
}

const loadConsumoAlerts = (): ConsumoAlert[] => {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(CONSUMO_ALERTAS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ConsumoAlert[]) : []
  } catch {
    return []
  }
}

const saveConsumoInterno = (items: ConsumoInternoRegistro[]) => {
  if (!isBrowser()) return
  window.localStorage.setItem(CONSUMO_REGISTROS_KEY, JSON.stringify(items.slice(0, 2000)))
}

const saveConsumoAlerts = (items: ConsumoAlert[]) => {
  if (!isBrowser()) return
  window.localStorage.setItem(CONSUMO_ALERTAS_KEY, JSON.stringify(items.slice(0, 300)))
}

export const loadGestorConsumoNotifications = () => loadConsumoAlerts().filter((item) => item.profile === 'gestor')

export const registrarConsumoInterno = (payload: ConsumoInternoInput) => {
  if (!isBrowser()) return

  const now = new Date()
  const data = now.toISOString().split('T')[0]
  const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const totalCusto = Number((payload.quantidade * payload.custoUnitario).toFixed(2))

  const registro: ConsumoInternoRegistro = {
    id: `cons-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    data,
    hora,
    usuario: payload.usuario,
    perfil: payload.perfil,
    paciente: payload.paciente,
    produto: payload.produto,
    quantidade: payload.quantidade,
    custoUnitario: Number(payload.custoUnitario.toFixed(2)),
    totalCusto,
    origem: payload.origem,
  }

  const nextRegistros = [registro, ...loadConsumoInterno()]
  saveConsumoInterno(nextRegistros)

  const alerta: ConsumoAlert = {
    id: Date.now(),
    title: 'Baixa de consumo registrada',
    description: `${payload.usuario} baixou ${payload.quantidade}x ${payload.produto} (custo total R$ ${totalCusto.toFixed(2)}).`,
    date: 'Agora',
    read: false,
    profile: 'gestor',
  }

  const nextAlerts = [alerta, ...loadConsumoAlerts()]
  saveConsumoAlerts(nextAlerts)
  window.dispatchEvent(new Event('storage'))
}
