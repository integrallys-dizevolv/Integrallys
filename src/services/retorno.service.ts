import { supabase } from "@/lib/supabase";
import {
  appendRetornoAlerts,
  appendRetornoFollowup,
} from "@/utils/retornosFollowup";

interface RegistrarRetornoInput {
  paciente: string;
  profissional: string;
  especialidade: string;
  dataAtendimento: string;
  proximoRetorno: string;
  returnOption: string;
  customDays: number | null;
}

export const registrarRetornoAtendimento = async (
  input: RegistrarRetornoInput,
) => {
  const followup = appendRetornoFollowup({
    dataAtendimento: input.dataAtendimento,
    cliente: input.paciente,
    procedimentosRecentes: ["Consulta", "Acompanhamento", "Retorno"],
    profissional: input.profissional,
    especialidade: input.especialidade,
    proximoRetorno: input.proximoRetorno,
    status: "No prazo",
  });

  appendRetornoAlerts({
    title: "Retorno para agendamento",
    description: `${input.paciente} precisa agendar retorno (${input.proximoRetorno}).`,
    date: "agora",
    read: false,
    profile: "recepcao",
  });

  appendRetornoAlerts({
    title: "Retorno pendente",
    description: `${input.paciente} aguardando agendamento de retorno pela recepção.`,
    date: "agora",
    read: false,
    profile: "gestor",
  });

  try {
    await supabase.from("retornos_controle").insert({
      paciente: input.paciente,
      profissional: input.profissional,
      especialidade: input.especialidade,
      data_atendimento: input.dataAtendimento,
      proximo_retorno: input.proximoRetorno,
      status: "No prazo",
      return_option: input.returnOption,
      custom_days: input.customDays,
      created_at: new Date().toISOString(),
    });
  } catch {
    // fallback local already persisted
  }

  try {
    await supabase.from("notificacoes_internas").insert([
      {
        perfil_destino: "recepcao",
        titulo: "Retorno para agendamento",
        descricao: `${input.paciente} precisa agendar retorno (${input.proximoRetorno}).`,
        lida: false,
        created_at: new Date().toISOString(),
      },
      {
        perfil_destino: "gestor",
        titulo: "Retorno pendente",
        descricao: `${input.paciente} aguardando agendamento de retorno pela recepção.`,
        lida: false,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch {
    // fallback local already persisted
  }

  return followup;
};
