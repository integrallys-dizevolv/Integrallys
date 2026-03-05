export type TarefaStatus = "Pendente" | "Concluída";

export interface TarefaItem {
  id: string;
  titulo: string;
  descricao?: string;
  data: string;
  horario?: string;
  prioridade: "Alta" | "Média" | "Baixa";
  status: TarefaStatus;
  categoria?: string;
  perfil: "recepcao" | "especialista" | "gestor" | "admin";
  usuarioCriador: string;
  prazo: string;
  createdAt: string;
}

const STORAGE_KEY = "integrallys_tarefas_v1";

const isBrowser = () => typeof window !== "undefined";

export const loadTarefas = (): TarefaItem[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TarefaItem[]) : [];
  } catch {
    return [];
  }
};

export const saveTarefas = (tarefas: TarefaItem[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
  window.dispatchEvent(new Event("storage"));
};

export const upsertTarefa = (tarefa: TarefaItem) => {
  const current = loadTarefas();
  const exists = current.some((item) => item.id === tarefa.id);
  const next = exists
    ? current.map((item) => (item.id === tarefa.id ? tarefa : item))
    : [tarefa, ...current];
  saveTarefas(next);
  return next;
};

export const removeTarefa = (id: string) => {
  const next = loadTarefas().filter((item) => item.id !== id);
  saveTarefas(next);
  return next;
};
