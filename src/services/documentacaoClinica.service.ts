export interface DocumentoProntuarioItem {
  id: string
  paciente: string
  documento: string
  categoria: string
  geradoEm: string
  geradoPor: string
}

const STORAGE_KEY = 'integrallys_documentos_prontuario_v1'

const isBrowser = () => typeof window !== 'undefined'

export const appendDocumentoProntuario = (payload: Omit<DocumentoProntuarioItem, 'id'>) => {
  if (!isBrowser()) return
  const nextItem: DocumentoProntuarioItem = {
    ...payload,
    id: `${payload.paciente}-${payload.documento}-${Date.now()}`,
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const current = raw ? JSON.parse(raw) : []
    const next = [nextItem, ...(Array.isArray(current) ? current : [])]
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('storage'))
  } catch {
    // ignore mock mode errors
  }
}
