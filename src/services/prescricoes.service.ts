import {
  MOCK_PRESCRICOES,
  MOCK_PRESCRICOES_PACIENTES,
  MOCK_PRESCRICOES_PRODUTOS,
  MOCK_PRESCRICOES_USUARIOS,
} from '@/mocks/prescricoes.mock';
import type { Prescription } from '@/mocks/recepcionista/prescricoes';

const PRESCRICOES_STORAGE_KEY = 'recepcao_prescricoes_mock_db';
const RETORNOS_PENDENTES_STORAGE_KEY = 'recepcao_prescricoes_retorno_pendente_mock_db';

export interface RetornoPendenteRegistro {
  prescriptionId: string;
  status: 'retorno_pendente';
  createdAt: string;
}

const isBrowser = () => typeof window !== 'undefined';

export const getPrescricoesData = async () => {
  const prescriptions = isBrowser()
    ? (() => {
        try {
          const raw = window.localStorage.getItem(PRESCRICOES_STORAGE_KEY);
          if (!raw) return MOCK_PRESCRICOES;
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? (parsed as Prescription[]) : MOCK_PRESCRICOES;
        } catch {
          return MOCK_PRESCRICOES;
        }
      })()
    : MOCK_PRESCRICOES;

  return Promise.resolve({
    prescriptions,
    patients: MOCK_PRESCRICOES_PACIENTES,
    products: MOCK_PRESCRICOES_PRODUTOS,
    users: MOCK_PRESCRICOES_USUARIOS,
  });
};

export const savePrescricoes = async (items: Prescription[]) => {
  if (!isBrowser()) return Promise.resolve();
  window.localStorage.setItem(PRESCRICOES_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('storage'));
  return Promise.resolve();
};

export const loadRetornosPendentes = async () => {
  if (!isBrowser()) return Promise.resolve([] as string[]);
  try {
    const raw = window.localStorage.getItem(RETORNOS_PENDENTES_STORAGE_KEY);
    if (!raw) return Promise.resolve([] as string[]);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return Promise.resolve([] as string[]);
    if (typeof parsed[0] === 'string') return Promise.resolve(parsed as string[]);
    return Promise.resolve(
      (parsed as RetornoPendenteRegistro[]).map((item) => item.prescriptionId),
    );
  } catch {
    return Promise.resolve([] as string[]);
  }
};

export const registrarRetornoPendente = async (prescriptionId: string) => {
  if (!isBrowser()) return Promise.resolve();
  const current = await loadRetornosPendentes();
  const nextIds = Array.from(new Set([prescriptionId, ...current]));
  const next: RetornoPendenteRegistro[] = nextIds.map((id) => ({
    prescriptionId: id,
    status: 'retorno_pendente',
    createdAt: new Date().toISOString(),
  }));
  window.localStorage.setItem(RETORNOS_PENDENTES_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('storage'));
  return Promise.resolve();
};
