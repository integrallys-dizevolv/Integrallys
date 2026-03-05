import { supabase } from "@/lib/supabase";

export interface AgendaCancellationEvent {
  id: string;
  createdAt: string;
  appointmentDate: string;
  appointmentTime: string;
  patient: string;
  professional: string;
  unit: string;
  procedure: string;
  reason: string;
  cancelledBy: string;
  amount?: number;
}

const STORAGE_KEY = "integrallys_agenda_cancelamentos";

const isBrowser = () => typeof window !== "undefined";

export const loadAgendaCancellationEvents = (): AgendaCancellationEvent[] => {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const appendAgendaCancellationEvent = (
  payload: Omit<AgendaCancellationEvent, "id" | "createdAt">,
) => {
  if (!isBrowser()) return;

  const nextEvent: AgendaCancellationEvent = {
    ...payload,
    id: `${payload.patient}-${payload.appointmentDate}-${payload.appointmentTime}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const current = loadAgendaCancellationEvents();
  const next = [nextEvent, ...current].slice(0, 500);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  void (async () => {
    try {
      await supabase.from("agenda_justificativas").insert({
        appointment_date: payload.appointmentDate,
        appointment_time: payload.appointmentTime,
        paciente: payload.patient,
        profissional: payload.professional,
        unidade: payload.unit,
        procedimento: payload.procedure,
        motivo: payload.reason,
        cancelado_por: payload.cancelledBy,
        valor: payload.amount ?? null,
        created_at: new Date().toISOString(),
      });
    } catch {
      // fallback local already saved
    }
  })();
};
