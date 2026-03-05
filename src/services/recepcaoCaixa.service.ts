import { createClient } from "@supabase/supabase-js";
import type { Transaction } from "@/mocks/recepcionista/caixa";
import { CAIXA_STORAGE_KEYS } from "@/mocks/caixa.mock";

export const RECEPCAO_CAIXA_TRANSACTIONS_KEY = CAIXA_STORAGE_KEYS.transactions;
export const RECEPCAO_CAIXA_FECHAMENTOS_KEY = CAIXA_STORAGE_KEYS.fechamentos;
export const RECEPCAO_CAIXA_REABERTURA_KEY = CAIXA_STORAGE_KEYS.reabertura;

export interface CaixaLancamentoInput {
  description: string;
  value: number;
  method: "cash" | "credit" | "debit" | "pix";
  responsible: string;
}

export interface CaixaFechamentoInput {
  saldoInicial: number;
  saldoFinal: number;
  valorTransferido: number;
  saldoRestante: number;
  usuario: string;
}

const isBrowser = () => typeof window !== "undefined";

let supabaseClient: ReturnType<typeof createClient> | null | undefined;

const getSupabaseClient = () => {
  if (supabaseClient !== undefined) return supabaseClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    supabaseClient = null;
    return supabaseClient;
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
};

export const loadCaixaTransactions = (): Transaction[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(RECEPCAO_CAIXA_TRANSACTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Transaction[]) : [];
  } catch {
    return [];
  }
};

export const appendCaixaTransaction = async (input: CaixaLancamentoInput) => {
  if (!isBrowser()) return;

  const now = new Date();
  const transaction: Transaction = {
    id: `trx-${Date.now()}`,
    hour: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    date: now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    description: input.description,
    type: "income",
    value: input.value,
    method: input.method,
    responsible: input.responsible,
    status: "cleared",
  };

  const current = loadCaixaTransactions();
  const next = [transaction, ...current];
  window.localStorage.setItem(RECEPCAO_CAIXA_TRANSACTIONS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("caixa-transactions-updated", { detail: next }));
  window.dispatchEvent(new Event("storage"));

  try {
    const client = getSupabaseClient();
    if (!client) return;

    await (client as any).from("caixa_lancamentos").insert({
      descricao: input.description,
      valor: input.value,
      forma_pagamento: input.method,
      tipo: "income",
      responsavel: input.responsible,
      criado_em: now.toISOString(),
    });
  } catch {
    // fallback local only
  }
};

export const persistCaixaFechamento = async (input: CaixaFechamentoInput) => {
  if (!isBrowser()) return;

  const now = new Date();
  const fechamento = {
    id: `fech-${Date.now()}`,
    closedAt: now.toISOString(),
    ...input,
  };

  try {
    const raw = window.localStorage.getItem(RECEPCAO_CAIXA_FECHAMENTOS_KEY);
    const current = raw ? (JSON.parse(raw) as Array<typeof fechamento>) : [];
    window.localStorage.setItem(
      RECEPCAO_CAIXA_FECHAMENTOS_KEY,
      JSON.stringify([fechamento, ...current].slice(0, 300)),
    );
  } catch {
    // ignore local failures
  }

  try {
    const client = getSupabaseClient();
    if (!client) return;

    await (client as any).from("caixa_fechamentos").insert({
      fechado_em: now.toISOString(),
      saldo_inicial: input.saldoInicial,
      saldo_final: input.saldoFinal,
      valor_transferido_cofre: input.valorTransferido,
      saldo_restante: input.saldoRestante,
      usuario: input.usuario,
    });
  } catch {
    // fallback local only
  }

  window.dispatchEvent(new Event("storage"));
};

export const canReopenCaixa = () => {
  if (!isBrowser()) return true;

  const authorized = window.localStorage.getItem(RECEPCAO_CAIXA_REABERTURA_KEY) === "true";
  if (authorized) return true;

  try {
    const raw = window.localStorage.getItem(RECEPCAO_CAIXA_FECHAMENTOS_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    const last = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
    if (!last?.closedAt) return true;

    const closeDate = new Date(last.closedAt);
    const today = new Date();
    return closeDate.toDateString() !== today.toDateString();
  } catch {
    return true;
  }
};
