export interface RetornoFollowupItem {
  id: string;
  dataAtendimento: string;
  cliente: string;
  procedimentosRecentes: [string, string, string];
  profissional: string;
  especialidade: string;
  proximoRetorno: string;
  status: "No prazo" | "Limite prazo" | "Prazo vencido";
  createdAt: string;
}

export interface RetornoAlertItem {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  profile: "recepcao" | "gestor";
  createdAt: string;
}

export const RETORNOS_FOLLOWUP_STORAGE_KEY = "integrallys_retornos_followup";
export const RETORNOS_ALERTS_STORAGE_KEY = "integrallys_retornos_alerts";

const isBrowser = () => typeof window !== "undefined";

const readJson = <T,>(key: string): T[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const writeJson = <T,>(key: string, value: T[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadRetornosFollowup = () =>
  readJson<RetornoFollowupItem>(RETORNOS_FOLLOWUP_STORAGE_KEY);

export const appendRetornoFollowup = (
  payload: Omit<RetornoFollowupItem, "id" | "createdAt">,
) => {
  const nextItem: RetornoFollowupItem = {
    ...payload,
    id: `${payload.cliente}-${payload.dataAtendimento}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const current = loadRetornosFollowup();
  const next = [nextItem, ...current].slice(0, 1000);
  writeJson(RETORNOS_FOLLOWUP_STORAGE_KEY, next);
  if (isBrowser()) window.dispatchEvent(new Event("storage"));
  return nextItem;
};

export const loadRetornosAlerts = () =>
  readJson<RetornoAlertItem>(RETORNOS_ALERTS_STORAGE_KEY);

export const appendRetornoAlerts = (
  payload: Omit<RetornoAlertItem, "id" | "createdAt">,
) => {
  const nextItem: RetornoAlertItem = {
    ...payload,
    id: `${payload.profile}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const current = loadRetornosAlerts();
  const next = [nextItem, ...current].slice(0, 1000);
  writeJson(RETORNOS_ALERTS_STORAGE_KEY, next);
  if (isBrowser()) window.dispatchEvent(new Event("storage"));
  return nextItem;
};
