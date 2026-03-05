import type { Patient } from '@/pages/recepcao/context/types';
import { MOCK_PACIENTES, PACIENTES_STORAGE_KEY } from '@/mocks/pacientes.mock';

const isBrowser = () => typeof window !== 'undefined';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export async function getPacientes(): Promise<Patient[]> {
  if (!isBrowser()) return clone(MOCK_PACIENTES);

  try {
    const raw = window.localStorage.getItem(PACIENTES_STORAGE_KEY);
    if (!raw) return clone(MOCK_PACIENTES);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Patient[]) : clone(MOCK_PACIENTES);
  } catch {
    return clone(MOCK_PACIENTES);
  }
}

export async function savePacientes(items: Patient[]): Promise<void> {
  if (!isBrowser()) return Promise.resolve();
  window.localStorage.setItem(PACIENTES_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('storage'));
  return Promise.resolve();
}

export async function upsertPaciente(patient: Patient): Promise<Patient[]> {
  const current = await getPacientes();
  const index = current.findIndex((item) => item.id === patient.id || item.cpf === patient.cpf);

  const next = [...current];
  if (index >= 0) {
    next[index] = { ...next[index], ...patient };
  } else {
    next.unshift(patient);
  }

  await savePacientes(next);
  return next;
}

export async function removePaciente(patientId: string): Promise<Patient[]> {
  const current = await getPacientes();
  const next = current.filter((item) => item.id !== patientId);
  await savePacientes(next);
  return next;
}
