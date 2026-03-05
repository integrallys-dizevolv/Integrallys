import {
  MOCK_REGRAS_TRIBUTACAO,
  TRIBUTACAO_STORAGE_KEY,
  type RegraTributacao,
} from '@/mocks/tributacao.mock'

const isBrowser = () => typeof window !== 'undefined'

export const loadRegrasTributacao = (): RegraTributacao[] => {
  if (!isBrowser()) return MOCK_REGRAS_TRIBUTACAO
  try {
    const raw = window.localStorage.getItem(TRIBUTACAO_STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(TRIBUTACAO_STORAGE_KEY, JSON.stringify(MOCK_REGRAS_TRIBUTACAO))
      return MOCK_REGRAS_TRIBUTACAO
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as RegraTributacao[]) : MOCK_REGRAS_TRIBUTACAO
  } catch {
    return MOCK_REGRAS_TRIBUTACAO
  }
}
