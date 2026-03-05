import {
  LISTA_ESPERA_STORAGE_KEY,
  MOCK_WAITING_LIST,
  type WaitingPatient,
} from '@/mocks/listaEspera.mock'

const isBrowser = () => typeof window !== 'undefined'

export const loadWaitingList = (): WaitingPatient[] => {
  if (!isBrowser()) return MOCK_WAITING_LIST
  try {
    const raw = window.localStorage.getItem(LISTA_ESPERA_STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(LISTA_ESPERA_STORAGE_KEY, JSON.stringify(MOCK_WAITING_LIST))
      return MOCK_WAITING_LIST
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as WaitingPatient[]) : MOCK_WAITING_LIST
  } catch {
    return MOCK_WAITING_LIST
  }
}

export const saveWaitingList = (items: WaitingPatient[]) => {
  if (!isBrowser()) return
  window.localStorage.setItem(LISTA_ESPERA_STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('storage'))
}

export const removeWaitingPatient = (id: string) => {
  const next = loadWaitingList().filter((item) => item.id !== id)
  saveWaitingList(next)
  return next
}
