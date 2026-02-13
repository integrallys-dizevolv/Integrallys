import { useState, useEffect } from "react";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Building,
  DollarSign,
  Bell,
  Lock,
  Cake,
  CalendarPlus,
  Play,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import { NovoAgendamentoModal } from "./modals/NovoAgendamentoModal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { MOCK_WEEKLY_CONSULTAS } from "@/mocks/admin/agenda";
import {
  ChamarEspecialistaModal,
  VisualizarConsultaModal,
  RemarcarConsultaModal,
  CancelarConsultaModal,
  AgendarReuniaoModal,
  EditarCompromissoModal,
  AdiarCompromissoModal,
  CancelarCompromissoModal,
} from "./modals";
import { EmitirNovaCobrancaModal } from "../financeiro/modals";
import { TarefasModal } from "@/pages/recepcao/pages/agenda/modals/TarefasModal";
import { BloqueioAgendaModal } from "@/pages/recepcao/pages/agenda/modals/BloqueioAgendaModal";
import { AniversariantesModal } from "@/pages/recepcao/pages/agenda/modals/AniversariantesModal";
import { ListaEsperaModal } from "./modals/ListaEsperaModal";
import {
  GerarAgendaModal,
  GerarAgendaPayload,
} from "./modals/GerarAgendaModal";
import { appendAgendaCancellationEvent } from "@/utils/agendaCancelamentos";

export interface AgendaItem {
  id: number;
  hora: string;
  duracao?: string;
  paciente: string;
  tipo?: string;
  profissional: string;
  unidade: string;
  status: string;
  pagamento: string;
  data?: string;
  valorProcedimento?: number;
  pagamentos?: { data: string; valor: number; metodo?: string }[];
}

export interface AgendaPersonalItem {
  id: number;
  hora: string;
  duracao?: string;
  titulo: string;
  tipo: "Reunião" | "Tarefa" | "Lembrete" | "Evento" | "Aprovação";
  prioridade: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Em Andamento" | "Concluído" | "Cancelado";
  descricao?: string;
  data?: string;
  local?: string;
  participantes?: string;
}

export interface WeekDayData {
  data: string;
  numero: number;
  nome: string;
  consultas?: AgendaItem[];
  itensPersonais?: AgendaPersonalItem[];
  isToday: boolean;
}

interface AgendaGenerationRule {
  id: string;
  profissional: string;
  dataInicio: string;
  dataFim: string;
  considerarFeriados: boolean;
  diasSemana: number[];
  diasMes?: number[];
  horarios: { inicio: string; fim: string }[];
  duracaoPrimeira: number;
  duracaoRetorno: number;
}

interface AgendaBlockRule {
  id: string;
  profissional: string;
  dataInicio: string;
  dataFim: string;
  horarioInicio: string;
  horarioFim: string;
  tipo: "ferias" | "folga" | "reuniao" | "outro";
  justificativa: string;
  bloquearDiaInteiro: boolean;
}

const PRO_MAP: { [key: string]: string } = {
  pedro: "Dr. Pedro Oliveira",
  ana: "Dra. Ana Costa",
  rafael: "Dr. Rafael Lima",
  joao: "Dr. João Santos",
  flavia: "Dra. Flávia Alves",
  sofia: "Dra. Sofia Castro",
  adelmo: "Dr. Adelmo",
  diego: "Dr. Diego",
};

const ALL_PROS = [
  "pedro",
  "ana",
  "rafael",
  "joao",
  "flavia",
  "sofia",
  "adelmo",
  "diego",
];
const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const NATIONAL_HOLIDAYS = [
  "01-01",
  "04-21",
  "05-01",
  "09-07",
  "10-12",
  "11-02",
  "11-15",
  "12-25",
];

interface AgendaViewProps {
  mockAgendaItems: AgendaItem[];
  mockAgendaPersonal: AgendaPersonalItem[];
  setCurrentPage?: (page: string) => void;
  onStartAtendimento?: (item: AgendaItem) => void;
  hideStatusFiltersInPersonal?: boolean;
  isSpecialist?: boolean;
  hideBreadcrumb?: boolean;
  // Props para atalhos da Recepção
  showShortcutButtons?: boolean;
  onListaEsperaClick?: () => void;
  onNewAppointmentClick?: () => void;
  hideGlobalTab?: boolean;
  recepcaoLayout?: boolean;
  allowPersonalTab?: boolean;
  allowMixedView?: boolean;
  allowedProfessionals?: string[];
}

export function AgendaView({
  mockAgendaItems,
  mockAgendaPersonal,
  setCurrentPage,
  onStartAtendimento,
  isSpecialist = false,
  hideBreadcrumb = false,
  showShortcutButtons = false,
  onListaEsperaClick,
  onNewAppointmentClick,
  hideGlobalTab = false,
  recepcaoLayout = false,
  allowPersonalTab = true,
  allowMixedView = false,
  allowedProfessionals,
}: AgendaViewProps) {
  const normalizeStatus = (status: string) => {
    if (status === "Confirmação") return "Confirmado";
    if (status === "Atraso") return "Em atraso";
    return status;
  };

  const [activeTab, setActiveTab] = useState("global");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedProfessional, setSelectedProfessional] = useState("todos");
  const [viewMode, setViewMode] = useState("dia");
  const [agendaRules, setAgendaRules] = useState<AgendaGenerationRule[]>([]);
  const [agendaBlocks, setAgendaBlocks] = useState<AgendaBlockRule[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(mockAgendaItems);
  const [itemStatuses, setItemStatuses] = useState<{ [key: number]: string }>(
    mockAgendaItems.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.status }),
      {},
    ),
  );

  const getResolvedStatus = (item: AgendaItem) =>
    normalizeStatus(itemStatuses[item.id] || item.status);

  const isCancelledStatus = (status: string) =>
    normalizeStatus(status) === "Cancelado";

  // Automação: Verificar atrasos

  // Estado da data atual
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setAgendaItems(mockAgendaItems);
    setItemStatuses(
      mockAgendaItems.reduce(
        (acc, item) => ({ ...acc, [item.id]: item.status }),
        {},
      ),
    );
  }, [mockAgendaItems]);

  const allowedProfessionalList =
    allowedProfessionals && allowedProfessionals.length > 0
      ? allowedProfessionals
      : null;
  const allowedProfessionalSet = allowedProfessionalList
    ? new Set(allowedProfessionalList)
    : null;

  const isAllowedProfessional = (name: string) => {
    if (!allowedProfessionalSet) return true;
    return Array.from(allowedProfessionalSet).some((allowed) =>
      name.includes(allowed),
    );
  };

  const professionalOptions = Array.from(
    new Set([
      ...agendaItems.map((item) => item.profissional),
      ...Object.values(PRO_MAP),
    ]),
  )
    .filter(isAllowedProfessional)
    .sort();

  const getProfessionalLabel = (value: string) => PRO_MAP[value] || value;

  const selectedProfessionalLabel =
    selectedProfessional === "todos"
      ? "Todos os profissionais"
      : getProfessionalLabel(selectedProfessional);

  const allAvailableProfessionalNames =
    allowedProfessionalList ??
    (professionalOptions.length > 0
      ? professionalOptions
      : ALL_PROS.map(getProfessionalLabel));

  const getTargetProfessionalNames = () => {
    if (selectedProfessional === "todos") {
      return allAvailableProfessionalNames;
    }
    return [getProfessionalLabel(selectedProfessional)];
  };

  const selectProfessionalOptions = Array.from(
    new Set(allAvailableProfessionalNames),
  ).sort();

  useEffect(() => {
    if (!allowedProfessionalList || selectedProfessional === "todos") return;
    const selectedLabel = getProfessionalLabel(selectedProfessional);
    if (!isAllowedProfessional(selectedLabel)) {
      setSelectedProfessional("todos");
    }
  }, [allowedProfessionalList, selectedProfessional]);

  const handlePrevDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "mes") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "mes") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const parseTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  const parseDurationToMinutes = (duration?: string) => {
    if (!duration) return 30;
    const lower = duration.toLowerCase();
    const hourMatch = lower.match(/(\d+)\s*h/);
    const minMatch = lower.match(/(\d+)\s*min/);
    const hours = hourMatch ? Number(hourMatch[1]) : 0;
    const minutes = minMatch ? Number(minMatch[1]) : 0;

    if (hours || minutes) return hours * 60 + minutes;

    const numeric = Number(lower.replace(/[^\d]/g, ""));
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 30;
  };

  const isHoliday = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return NATIONAL_HOLIDAYS.includes(`${month}-${day}`);
  };

  const isDateWithinRange = (date: Date, start: string, end: string) => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);
    return dateOnly >= startDate && dateOnly <= endDate;
  };

  const isBlockedFullDay = (date: Date, professionalName: string) => {
    return agendaBlocks.some(
      (block) =>
        block.profissional === professionalName &&
        block.bloquearDiaInteiro &&
        isDateWithinRange(date, block.dataInicio, block.dataFim),
    );
  };

  const isBlockedSlot = (date: Date, time: string, professionalName: string) => {
    const targetMinutes = parseTimeToMinutes(time);
    return agendaBlocks.some((block) => {
      if (block.profissional !== professionalName) return false;
      if (!isDateWithinRange(date, block.dataInicio, block.dataFim)) return false;
      if (block.bloquearDiaInteiro) return true;

      const inicio = parseTimeToMinutes(block.horarioInicio);
      const fim = parseTimeToMinutes(block.horarioFim);
      return targetMinutes >= inicio && targetMinutes < fim;
    });
  };

  const getSlotAvailability = (
    date: Date,
    time: string,
    professionalName: string,
  ) => {
    if (isBlockedSlot(date, time, professionalName)) {
      return { allowed: false, holidayOverride: false, blocked: true };
    }

    const rules = agendaRules.filter(
      (rule) => rule.profissional === professionalName,
    );

    if (rules.length === 0) {
      return { allowed: true, holidayOverride: false };
    }

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const weekday = dateOnly.getDay();
    const dayOfMonth = dateOnly.getDate();
    const targetMinutes = parseTimeToMinutes(time);

    for (const rule of rules) {
      const startDate = new Date(rule.dataInicio + "T00:00:00");
      const endDate = new Date(rule.dataFim + "T00:00:00");

      if (dateOnly < startDate || dateOnly > endDate) continue;

      if (rule.diasMes && rule.diasMes.length > 0) {
        if (!rule.diasMes.includes(dayOfMonth)) continue;
      } else if (!rule.diasSemana.includes(weekday)) {
        continue;
      }

      for (const horario of rule.horarios) {
        const inicio = parseTimeToMinutes(horario.inicio);
        const fim = parseTimeToMinutes(horario.fim);

        if (targetMinutes >= inicio && targetMinutes < fim) {
          if (!rule.considerarFeriados && isHoliday(dateOnly)) {
            return { allowed: false, holidayOverride: true, blocked: false };
          }
          return { allowed: true, holidayOverride: false, blocked: false };
        }
      }
    }

    return { allowed: false, holidayOverride: false, blocked: false };
  };

  const getDayAvailability = (date: Date, professionalName: string) => {
    if (isBlockedFullDay(date, professionalName)) {
      return { allowed: false, holidayOverride: false, blocked: true };
    }

    const rules = agendaRules.filter(
      (rule) => rule.profissional === professionalName,
    );

    if (rules.length === 0) {
      return { allowed: true, holidayOverride: false, blocked: false };
    }

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const weekday = dateOnly.getDay();
    const dayOfMonth = dateOnly.getDate();

    for (const rule of rules) {
      const startDate = new Date(rule.dataInicio + "T00:00:00");
      const endDate = new Date(rule.dataFim + "T00:00:00");

      if (dateOnly < startDate || dateOnly > endDate) continue;

      if (rule.diasMes && rule.diasMes.length > 0) {
        if (!rule.diasMes.includes(dayOfMonth)) continue;
      } else if (!rule.diasSemana.includes(weekday)) {
        continue;
      }

      if (!rule.considerarFeriados && isHoliday(dateOnly)) {
        return { allowed: false, holidayOverride: true, blocked: false };
      }

      return { allowed: true, holidayOverride: false, blocked: false };
    }

    return { allowed: false, holidayOverride: false, blocked: false };
  };

  // Automação: Verificar atrasos
  useEffect(() => {
    const checkDelays = () => {
      const now = new Date();
      // Mock de hora atual para testes (simulando 10:30 do dia atual)
      // const now = new Date();
      // now.setHours(10, 30);

      const updatedStatuses = { ...itemStatuses };
      let hasUpdates = false;

      agendaItems.forEach((item) => {
        const currentStatus = normalizeStatus(
          updatedStatuses[item.id] || item.status,
        );
        if (!["Agendado", "Confirmado"].includes(currentStatus))
          return;

        // Converter hora da consulta (ex: "09:00") para data/hora
        const [hours, minutes] = item.hora.split(":").map(Number);

        // Assumindo que a consulta é no dia atual (currentDate)
        // Em produção, item.data deve ser verificado
        const consultaTime = new Date(currentDate);
        consultaTime.setHours(hours, minutes);

        // Tolerância de 15 min
        const toleranceTime = new Date(consultaTime.getTime() + 15 * 60000);

        if (now > toleranceTime) {
          updatedStatuses[item.id] = "Em atraso";
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        setItemStatuses(updatedStatuses);
      }
    };

    // Executar na montagem e a cada minuto
    checkDelays();
    const interval = setInterval(checkDelays, 60000);
    return () => clearInterval(interval);
  }, [currentDate, itemStatuses, agendaItems]);

  // Função para gerar slots do dia
  const generateDaySlots = () => {
    const slots = [] as { id: string; time: string; available: boolean }[];
    const targetNames = getTargetProfessionalNames();
    const relevantRules = agendaRules.filter((rule) =>
      targetNames.includes(rule.profissional),
    );

    let startHour = 8;
    let endHour = 18;

    if (relevantRules.length > 0) {
      const minutes = relevantRules.flatMap((rule) =>
        rule.horarios.flatMap((h) => [
          parseTimeToMinutes(h.inicio),
          parseTimeToMinutes(h.fim),
        ]),
      );
      const minStart = Math.min(...minutes);
      const maxEnd = Math.max(...minutes);
      startHour = Math.max(0, Math.floor(minStart / 60));
      endHour = Math.min(23, Math.ceil(maxEnd / 60));
    }

    for (let h = startHour; h < endHour; h++) {
      const timeStr = h.toString().padStart(2, "0");
      slots.push({
        id: `slot-${h}-00`,
        time: `${timeStr}:00`,
        available: true,
      });
      slots.push({
        id: `slot-${h}-30`,
        time: `${timeStr}:30`,
        available: true,
      });
    }
    return slots;
  };

  const daySlots = generateDaySlots();

  // Profissional logado (simulado)
  const profissionalLogado = "João Silva (Admin)";

  // Estados dos modais
  const [isMarcarConsultaOpen, setIsMarcarConsultaOpen] = useState(false);
  const [preSelectedTime, setPreSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleTimeSlotClick = (time: string, date?: Date) => {
    setPreSelectedTime(time);
    if (date) {
      setSelectedDate(date);
    } else {
      // Se não vier data (visão dia), usa a data atual da visão
      setSelectedDate(currentDate);
    }
    setIsMarcarConsultaOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setPreSelectedTime(null);
    setIsMarcarConsultaOpen(true);
  };

  const handleNewAppointmentClick = () => {
    setPreSelectedTime(null);
    setSelectedDate(null);
    setIsMarcarConsultaOpen(true);
  };

  const handleCreateAppointment = (data: {
    paciente: string;
    profissional: string;
    data: string;
    horario: string;
    tipo: string;
    observacoes: string;
  }) => {
    const maxId = Math.max(
      0,
      ...agendaItems.map((item) => item.id),
      ...Object.values(MOCK_WEEKLY_CONSULTAS)
        .flat()
        .map((item) => item.id),
    );

    const typeMap: Record<string, string> = {
      consulta: "Consulta",
      exame: "Exame",
      retorno: "Retorno",
    };
    const priceMap: Record<string, number> = {
      consulta: 250,
      exame: 180,
      retorno: 150,
    };

    const newItem: AgendaItem = {
      id: maxId + 1,
      hora: data.horario,
      duracao: "30min",
      paciente: data.paciente,
      tipo: typeMap[data.tipo] || "Consulta",
      profissional: data.profissional,
      unidade: "Unidade Centro",
      status: "Confirmado",
      pagamento: "Pendente",
      data: data.data || format(selectedDate || currentDate, "yyyy-MM-dd"),
      valorProcedimento: priceMap[data.tipo] || 0,
      pagamentos: [],
    };

    setAgendaItems((prev) => [...prev, newItem]);
    setItemStatuses((prev) => ({ ...prev, [newItem.id]: newItem.status }));
  };

  // Connect external prop if provided, otherwise use local handler
  const effectiveNewAppointmentClick =
    onNewAppointmentClick || handleNewAppointmentClick;
  // removed duplicate definition if existed, keeping this one
  const [isAgendarReuniaoOpen, setIsAgendarReuniaoOpen] = useState(false);
  const [isChamarEspecialistaOpen, setIsChamarEspecialistaOpen] =
    useState(false);
  const [isEmitirCobrancaOpen, setIsEmitirCobrancaOpen] = useState(false);
  const [isVisualizarConsultaOpen, setIsVisualizarConsultaOpen] =
    useState(false);
  const [isRemarcarConsultaOpen, setIsRemarcarConsultaOpen] = useState(false);
  const [isCancelarConsultaOpen, setIsCancelarConsultaOpen] = useState(false);
  const [isEditarCompromissoOpen, setIsEditarCompromissoOpen] = useState(false);
  const [isAdiarCompromissoOpen, setIsAdiarCompromissoOpen] = useState(false);
  const [isCancelarCompromissoOpen, setIsCancelarCompromissoOpen] =
    useState(false);
  const [isTarefasOpen, setIsTarefasOpen] = useState(false);
  const [isAniversariantesOpen, setIsAniversariantesOpen] = useState(false);
  const [isBloqueioAgendaOpen, setIsBloqueioAgendaOpen] = useState(false);
  const [isGerarAgendaOpen, setIsGerarAgendaOpen] = useState(false);
  const [isListaEsperaOpen, setIsListaEsperaOpen] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState<AgendaItem | null>(
    null,
  );
  const [selectedCompromisso, setSelectedCompromisso] =
    useState<AgendaPersonalItem | null>(null);
  const [isMonthPopupOpen, setIsMonthPopupOpen] = useState(false);
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date | null>(null);
  const [isCancelamentoOpen, setIsCancelamentoOpen] = useState(false);
  const [cancelamentoMotivo, setCancelamentoMotivo] = useState("");
  const [cancelamentoItemId, setCancelamentoItemId] = useState<number | null>(
    null,
  );
  const [cancelamentoMotivos, setCancelamentoMotivos] = useState<{
    [key: number]: string;
  }>({});
  const [cancelamentoErro, setCancelamentoErro] = useState("");

  const handleListaEsperaClick = () => {
    setIsListaEsperaOpen(true);
    onListaEsperaClick?.();
  };

  // Filtrar consultas baseado no tab ativo/profissional
  const getBaseItems = () => {
    let items = agendaItems;

    if (allowedProfessionalSet) {
      items = items.filter((item) => isAllowedProfessional(item.profissional));
    }

    // Primeiro filtra por aba e profissional
    if (activeTab === "pessoal") {
      items = items.filter((item) => item.profissional === profissionalLogado);
    } else if (selectedProfessional !== "todos") {
      const profName = getProfessionalLabel(selectedProfessional);
      items = items.filter((item) => item.profissional.includes(profName));
    }

    return items;
  };

  // Filtrar consultas baseado no filtro selecionado
  const getFilteredItems = (items: AgendaItem[]) => {
    // Ordem: Todos – Agendamentos – Aguardando – Em atendimento – Atendidos
    switch (selectedFilter) {
      case "agendamentos":
        // Itens futuros ou pendentes de confirmação (Confirmado, Agendado, Atraso)
        return items.filter((item) =>
          ["Confirmado", "Agendado", "Em atraso"].includes(
            getResolvedStatus(item),
          ),
        );
      case "aguardando":
        // Itens que fizeram check-in e esperam
        return items.filter((item) => getResolvedStatus(item) === "Check-in");
      case "atendimento":
        // Itens que estão sendo atendidos no momento
        return items.filter(
          (item) => getResolvedStatus(item) === "Em Atendimento",
        );
      case "atendidos":
        // Itens finalizados
        return items.filter(
          (item) =>
            getResolvedStatus(item) === "Check-out" ||
            getResolvedStatus(item) === "Concluído",
        );
      case "todos":
      default:
        return items;
    }
  };

  const baseItems = getBaseItems();
  const filteredItems = getFilteredItems(baseItems);
  const showSlots =
    activeTab === "global" &&
    (selectedFilter === "todos" || selectedFilter === "agendamentos");

  const freedSlotsFromCancelledInAgendamentos =
    showSlots && selectedFilter === "agendamentos"
      ? baseItems
          .filter((item) => isCancelledStatus(getResolvedStatus(item)))
          .filter(
            (item) =>
              !baseItems.some(
                (other) =>
                  other.id !== item.id &&
                  other.hora === item.hora &&
                  other.profissional === item.profissional &&
                  !isCancelledStatus(getResolvedStatus(other)),
              ),
          )
          .map((item) => ({
            item,
            availability: getSlotAvailability(
              currentDate,
              item.hora,
              item.profissional,
            ),
          }))
          .filter(
            ({ availability }) =>
              availability.allowed || availability.holidayOverride,
          )
          .filter(
            ({ item }, index, all) =>
              index ===
              all.findIndex(
                ({ item: current }) =>
                  current.hora === item.hora &&
                  current.profissional === item.profissional,
              ),
          )
      : [];

  const buildWeekDaysFromCurrentDate = () => {
    const base = new Date(currentDate);
    const day = base.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    base.setDate(base.getDate() + diff);
    return Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(base);
      d.setDate(base.getDate() + idx);
      return {
        data: format(d, "yyyy-MM-dd"),
        numero: d.getDate(),
        nome: format(d, "EEEE", { locale: ptBR }),
        isToday:
          d.getDate() === currentDate.getDate() &&
          d.getMonth() === currentDate.getMonth() &&
          d.getFullYear() === currentDate.getFullYear(),
      };
    });
  };

  // Filtrar agenda pessoal para o dia atual
  const getFilteredPersonalItems = () => {
    const dateKey = format(currentDate, "yyyy-MM-dd");
    return mockAgendaPersonal.filter((item) => item.data === dateKey);
  };

  const filteredPersonalItems = getFilteredPersonalItems();

  const getConsultasForDate = (dateKey: string) => {
    const currentDateKey = format(currentDate, "yyyy-MM-dd");
    let targetConsultas = [
      ...agendaItems.filter((item) =>
        item.data ? item.data === dateKey : dateKey === currentDateKey,
      ),
      ...(MOCK_WEEKLY_CONSULTAS[dateKey] || []),
    ];
    if (allowedProfessionalSet) {
      targetConsultas = targetConsultas.filter((item) =>
        isAllowedProfessional(item.profissional),
      );
    }

    const filteredByProfessional =
      selectedProfessional === "todos"
        ? targetConsultas
        : targetConsultas.filter((item) =>
            item.profissional.includes(getProfessionalLabel(selectedProfessional)),
          );

    return filteredByProfessional.length > 0 || targetConsultas.length === 0
      ? filteredByProfessional
      : targetConsultas;
  };

  const getPessoaisForDate = (dateKey: string) =>
    mockAgendaPersonal.filter((item) => item.data === dateKey);

  const getConsultasSummary = (consultas: AgendaItem[]) =>
    consultas.reduce(
      (acc, item) => {
        const tipo = (item.tipo || "").toLowerCase();
        if (tipo.includes("exame")) {
          acc.exames += 1;
        } else if (tipo.includes("retorno")) {
          acc.retornos += 1;
        } else {
          acc.consultas += 1;
        }
        return acc;
      },
      { consultas: 0, exames: 0, retornos: 0 },
    );

  // Gerar dados mockados para a visualização semanal
  const generateWeekData = () => {
    if (activeTab === "pessoal") {
      // Agrupar itens pessoais por data
      const itensPorDia: { [key: string]: AgendaPersonalItem[] } = {};
      mockAgendaPersonal.forEach((item) => {
        if (item.data) {
          if (!itensPorDia[item.data]) {
            itensPorDia[item.data] = [];
          }
          itensPorDia[item.data].push(item);
        }
      });

      return buildWeekDaysFromCurrentDate().map((dia) => ({
        ...dia,
        itensPersonais: itensPorDia[dia.data] || [],
        isToday: dia.data === format(currentDate, "yyyy-MM-dd"),
      }));
    }

    // Distribuir consultas mockadas nos dias da semana (agenda global)
    return buildWeekDaysFromCurrentDate().map((dia) => {
      let consultasDoDia = MOCK_WEEKLY_CONSULTAS[dia.data] || [];
      if (allowedProfessionalSet) {
        consultasDoDia = consultasDoDia.filter((item) =>
          isAllowedProfessional(item.profissional),
        );
      }
      const consultasFiltradas = consultasDoDia;

      return {
        ...dia,
        consultas: consultasFiltradas,
        isToday: dia.data === format(currentDate, "yyyy-MM-dd"),
      };
    });
  };

  const weekData = generateWeekData();

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Espaçamento do mês anterior
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmação":
      case "Confirmado":
        return "bg-[#eef5ff] dark:bg-[#1e3a5f]/40"; // Azul ultra claro
      case "Check-in":
        return "bg-[#dbeafe] dark:bg-[#1e3a5f]"; // Azul mais forte/visível
      case "Check-out":
        return "bg-[#d1fadf] dark:bg-[#1e3a2f]"; // Verde claro
      case "Atraso":
      case "Em atraso":
        return "bg-[#fef0c7] dark:bg-[#3a2f1e]"; // Amarelo claro
      case "Em Atendimento":
        return "bg-[#e0f2fe] dark:bg-[#1e293b] border-l-4 border-blue-500"; // Azul diferente ou com destaque
      case "Cancelado":
        return "bg-gray-200 dark:bg-gray-800"; // Cinza para indicar cancelamento
      default:
        return "bg-app-bg-secondary dark:bg-app-bg-dark";
    }
  };

  // Função para retornar as classes de badge de status
  const getBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (
      s.includes("agendado") ||
      s.includes("pendente") ||
      s.includes("confirm")
    )
      return "bg-blue-600 dark:bg-blue-900/50 text-white dark:text-blue-100 border-none shadow-sm font-normal";
    if (
      s.includes("aguardando") ||
      s.includes("check-in") ||
      s.includes("andamento") ||
      s.includes("atendimento")
    )
      return "bg-purple-600 dark:bg-purple-900/50 text-white dark:text-purple-100 border-none shadow-sm font-normal";
    if (
      s.includes("concluido") ||
      s.includes("check-out") ||
      s.includes("concluído")
    )
      return "bg-green-600 dark:bg-emerald-950 text-white dark:text-emerald-100 border-none shadow-sm font-normal";
    if (s.includes("cancel"))
      return "bg-red-600 dark:bg-red-900/50 text-white dark:text-red-100 border-none shadow-sm font-normal";
    if (s.includes("atraso"))
      return "bg-orange-600 dark:bg-amber-900/50 text-white dark:text-amber-100 border-none shadow-sm font-normal";
    return "bg-gray-600 dark:bg-app-bg-dark text-white dark:text-gray-200 border-none shadow-sm font-normal";
  };

  const getStatusButtonColor = (status: string) => {
    switch (status) {
      case "Confirmação":
      case "Confirmado":
        return "bg-blue-500 dark:bg-blue-900/50 hover:bg-blue-600 text-white font-normal";
      case "Check-in":
        return "bg-blue-700 dark:bg-blue-900 hover:bg-blue-800 text-white font-normal";
      case "Aguardando":
        return "bg-blue-600 dark:bg-blue-900/80 hover:bg-blue-700 text-white font-normal";
      case "Check-out":
      case "Concluído":
        return "bg-green-600 dark:bg-emerald-950 hover:bg-green-700 text-white font-normal";
      case "Atraso":
      case "Em atraso":
        return "bg-orange-600 dark:bg-amber-900/50 hover:bg-orange-700 text-white font-normal";
      case "Em Atendimento":
        return "bg-purple-600 dark:bg-purple-900/50 hover:bg-purple-700 text-white font-normal";
      case "Cancelado":
        return "bg-gray-600 dark:bg-gray-800 hover:bg-gray-700 text-white font-normal";
      default:
        return "bg-gray-600 dark:bg-app-bg-dark hover:bg-gray-700 text-white font-normal";
    }
  };

  const getPagamentoIcon = (pagamento: string) => {
    switch (pagamento) {
      case "Pago":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case "Parcial":
      case "Pago Parcial":
        return <DollarSign className="h-4 w-4 text-orange-500" />;
      case "Pendente":
        return <DollarSign className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (itemId: number, newStatus: string) => {
    setItemStatuses((prev) => ({ ...prev, [itemId]: newStatus }));
  };

  const handleRequestCancelamento = (itemId: number) => {
    setCancelamentoItemId(itemId);
    setCancelamentoMotivo("");
    setCancelamentoErro("");
    setIsCancelamentoOpen(true);
  };

  const handleConfirmCancelamento = () => {
    if (!cancelamentoMotivo.trim() || cancelamentoItemId === null) {
      setCancelamentoErro("Informe o motivo do cancelamento");
      return;
    }

    setItemStatuses((prev) => ({ ...prev, [cancelamentoItemId]: "Cancelado" }));
    setCancelamentoMotivos((prev) => ({
      ...prev,
      [cancelamentoItemId]: cancelamentoMotivo.trim(),
    }));

    const cancelledItem = agendaItems.find(
      (item) => item.id === cancelamentoItemId,
    );
    if (cancelledItem) {
      appendAgendaCancellationEvent({
        appointmentDate:
          cancelledItem.data || format(currentDate, "yyyy-MM-dd"),
        appointmentTime: cancelledItem.hora,
        patient: cancelledItem.paciente,
        professional: cancelledItem.profissional,
        unit: cancelledItem.unidade,
        procedure: cancelledItem.tipo || "Consulta",
        reason: cancelamentoMotivo.trim(),
        cancelledBy: "Recepção",
        amount: cancelledItem.valorProcedimento,
      });
    }

    setIsCancelamentoOpen(false);
    setCancelamentoItemId(null);
    setCancelamentoMotivo("");
    setCancelamentoErro("");
  };

  const handleOpenChamarEspecialista = (consulta: AgendaItem) => {
    setSelectedConsulta(consulta);
    setIsChamarEspecialistaOpen(true);
  };

  const handleOpenEmitirCobranca = (consulta: AgendaItem) => {
    setSelectedConsulta(consulta);
    setIsEmitirCobrancaOpen(true);
  };

  const handleConfirmCobranca = (payload: {
    valor: number;
    metodo: string;
    observacao?: string;
    data: string;
  }) => {
    if (!selectedConsulta) return;

    const pagamentosAtuais = selectedConsulta.pagamentos || [];
    const novosPagamentos = [
      ...pagamentosAtuais,
      { data: payload.data, valor: payload.valor, metodo: payload.metodo },
    ];
    const valorTotal = selectedConsulta.valorProcedimento || 0;
    const totalPago = novosPagamentos.reduce((acc, p) => acc + p.valor, 0);
    const pagamentoStatus =
      totalPago >= valorTotal && valorTotal > 0
        ? "Pago"
        : totalPago > 0
          ? "Pago Parcial"
          : "Pendente";

    setAgendaItems((prev) =>
      prev.map((item) =>
        item.id === selectedConsulta.id
          ? {
              ...item,
              pagamentos: novosPagamentos,
              pagamento: pagamentoStatus,
            }
          : item,
      ),
    );

    setSelectedConsulta((prev) =>
      prev
        ? {
            ...prev,
            pagamentos: novosPagamentos,
            pagamento: pagamentoStatus,
          }
        : prev,
    );
  };

  const handleOpenVisualizarConsulta = (consulta: AgendaItem) => {
    setSelectedConsulta(consulta);
    setIsVisualizarConsultaOpen(true);
  };

  const handleOpenRemarcarConsulta = (consulta: AgendaItem) => {
    setSelectedConsulta(consulta);
    setIsRemarcarConsultaOpen(true);
  };

  const handleOpenCancelarConsulta = (consulta: AgendaItem) => {
    setSelectedConsulta(consulta);
    setIsCancelarConsultaOpen(true);
  };

  const handleConfirmCancelarConsulta = (reason: string) => {
    if (!selectedConsulta || !reason.trim()) return;

    const itemId = selectedConsulta.id;
    setItemStatuses((prev) => ({ ...prev, [itemId]: "Cancelado" }));
    setCancelamentoMotivos((prev) => ({
      ...prev,
      [itemId]: reason.trim(),
    }));

    appendAgendaCancellationEvent({
      appointmentDate: selectedConsulta.data || format(currentDate, "yyyy-MM-dd"),
      appointmentTime: selectedConsulta.hora,
      patient: selectedConsulta.paciente,
      professional: selectedConsulta.profissional,
      unit: selectedConsulta.unidade,
      procedure: selectedConsulta.tipo || "Consulta",
      reason: reason.trim(),
      cancelledBy: "Recepção",
      amount: selectedConsulta.valorProcedimento,
    });

    setSelectedConsulta((prev) =>
      prev
        ? {
            ...prev,
            status: "Cancelado",
          }
        : prev,
    );
    setIsCancelarConsultaOpen(false);
  };

  // Handler para mudança de status de itens pessoais
  const [personalItemStatuses] = useState<{ [key: number]: string }>(
    mockAgendaPersonal.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.status }),
      {},
    ),
  );

  // Handler para editar compromisso
  const handleEditarCompromisso = (
    id: string,
    data: Partial<AgendaPersonalItem>,
  ) => {
    console.log("Compromisso editado:", id, data);
    // Aqui você atualizaria o estado real dos compromissos
  };

  // Handler para adiar compromisso
  const handleAdiarCompromisso = (
    id: string,
    novaData: string,
    novoHorario: string,
  ) => {
    console.log("Compromisso adiado:", id, novaData, novoHorario);
    // Aqui você atualizaria o estado real dos compromissos
  };

  // Handler para cancelar compromisso
  const handleCancelarCompromisso = (id: string) => {
    console.log("Compromisso cancelado:", id);
    // Aqui você atualizaria o estado real dos compromissos
  };

  const handleGerarAgenda = (payload: GerarAgendaPayload) => {
    const newRule: AgendaGenerationRule = {
      id: `${payload.profissional}-${payload.dataInicio}-${payload.dataFim}-${Date.now()}`,
      profissional: payload.profissional,
      dataInicio: payload.dataInicio,
      dataFim: payload.dataFim,
      considerarFeriados: payload.considerarFeriados,
      diasSemana: payload.diasSemana,
      diasMes: payload.diasMes,
      horarios: payload.horarios,
      duracaoPrimeira: payload.duracaoPrimeira,
      duracaoRetorno: payload.duracaoRetorno,
    };

    setAgendaRules((prev) => [...prev, newRule]);
  };

  const handleBloquearAgenda = (payload: {
    dataInicio: string;
    dataFim: string;
    horarioInicio: string;
    horarioFim: string;
    profissional: string;
    tipo: "ferias" | "folga" | "reuniao" | "outro";
    justificativa: string;
    bloquearDiaInteiro: boolean;
  }) => {
    const newBlock: AgendaBlockRule = {
      id: `${payload.profissional}-${payload.dataInicio}-${payload.horarioInicio}-${Date.now()}`,
      ...payload,
    };
    setAgendaBlocks((prev) => [...prev, newBlock]);
    setIsBloqueioAgendaOpen(false);
  };

  const showRecepcaoShortcuts =
    recepcaoLayout && showShortcutButtons && activeTab === "global";

  return (
    <div className="space-y-6 overflow-x-hidden max-w-full">
      {!hideBreadcrumb && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => setCurrentPage?.("inicio")}
                className="cursor-pointer"
              >
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Agenda</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Modais */}
      <AgendarReuniaoModal
        isOpen={isAgendarReuniaoOpen}
        onClose={() => setIsAgendarReuniaoOpen(false)}
      />
      <ChamarEspecialistaModal
        isOpen={isChamarEspecialistaOpen}
        onClose={() => setIsChamarEspecialistaOpen(false)}
        paciente={selectedConsulta?.paciente}
        horario={selectedConsulta?.hora}
        tipo={selectedConsulta?.tipo}
      />
      <EmitirNovaCobrancaModal
        isOpen={isEmitirCobrancaOpen}
        onClose={() => setIsEmitirCobrancaOpen(false)}
        paciente={selectedConsulta?.paciente}
        profissional={selectedConsulta?.profissional}
        horario={selectedConsulta?.hora}
        procedimento={selectedConsulta?.tipo}
        valorProcedimento={selectedConsulta?.valorProcedimento}
        pagamentos={selectedConsulta?.pagamentos}
        onConfirm={handleConfirmCobranca}
      />
      <VisualizarConsultaModal
        isOpen={isVisualizarConsultaOpen}
        onClose={() => setIsVisualizarConsultaOpen(false)}
      />
      <RemarcarConsultaModal
        isOpen={isRemarcarConsultaOpen}
        onClose={() => setIsRemarcarConsultaOpen(false)}
        consulta={
          selectedConsulta
            ? {
                paciente: selectedConsulta.paciente,
                especialista: selectedConsulta.profissional,
                horario: selectedConsulta.hora,
                tipo: selectedConsulta.tipo || "Consulta",
              }
            : undefined
        }
      />
      <CancelarConsultaModal
        isOpen={isCancelarConsultaOpen}
        onClose={() => setIsCancelarConsultaOpen(false)}
        onConfirm={handleConfirmCancelarConsulta}
        consulta={
          selectedConsulta
            ? {
                paciente: selectedConsulta.paciente,
                especialista: selectedConsulta.profissional,
                horario: selectedConsulta.hora,
                tipo: selectedConsulta.tipo || "Consulta",
              }
            : undefined
        }
      />
      <EditarCompromissoModal
        isOpen={isEditarCompromissoOpen}
        onClose={() => setIsEditarCompromissoOpen(false)}
        compromisso={selectedCompromisso}
        onSave={handleEditarCompromisso}
      />
      <AdiarCompromissoModal
        isOpen={isAdiarCompromissoOpen}
        onClose={() => setIsAdiarCompromissoOpen(false)}
        compromisso={selectedCompromisso}
        onAdiar={handleAdiarCompromisso}
      />
      <CancelarCompromissoModal
        isOpen={isCancelarCompromissoOpen}
        onClose={() => setIsCancelarCompromissoOpen(false)}
        compromisso={selectedCompromisso}
        onCancelar={handleCancelarCompromisso}
      />
      <TarefasModal
        isOpen={isTarefasOpen}
        onClose={() => setIsTarefasOpen(false)}
      />
      <AniversariantesModal
        isOpen={isAniversariantesOpen}
        onClose={() => setIsAniversariantesOpen(false)}
      />
      <BloqueioAgendaModal
        isOpen={isBloqueioAgendaOpen}
        onClose={() => setIsBloqueioAgendaOpen(false)}
        professionals={professionalOptions}
        onSave={handleBloquearAgenda}
      />
      <GerarAgendaModal
        isOpen={isGerarAgendaOpen}
        onClose={() => setIsGerarAgendaOpen(false)}
        professionals={professionalOptions}
        onGenerate={handleGerarAgenda}
      />
      <ListaEsperaModal
        isOpen={isListaEsperaOpen}
        onClose={() => setIsListaEsperaOpen(false)}
      />
      <Dialog
        open={isCancelamentoOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCancelamentoOpen(false);
            setCancelamentoErro("");
          }
        }}
      >
        <DialogContent className="max-w-[520px] bg-app-card dark:bg-app-card-dark">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal">
              Motivo do cancelamento
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
              Informe o motivo para gerar o relatório de justificativas
            </Label>
            <Textarea
              value={cancelamentoMotivo}
              onChange={(e) => {
                setCancelamentoMotivo(e.target.value);
                setCancelamentoErro("");
              }}
              placeholder="Ex.: paciente desmarcou, imprevisto pessoal..."
              className={`min-h-[100px] resize-none ${cancelamentoErro ? "border-red-500" : ""}`}
            />
            {cancelamentoErro && (
              <p className="text-[10px] text-red-500">{cancelamentoErro}</p>
            )}
          </div>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelamentoOpen(false);
                setCancelamentoItemId(null);
                setCancelamentoMotivo("");
                setCancelamentoErro("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmCancelamento}
              className="bg-[#0039A6] hover:bg-[#002d82] text-white"
            >
              Salvar motivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isMonthPopupOpen}
        onOpenChange={(open) => setIsMonthPopupOpen(open)}
      >
        <DialogContent className="max-w-[520px] bg-app-card dark:bg-app-card-dark p-0">
          <div className="px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-normal">
                {selectedMonthDate ? "Agenda do dia" : "Agenda do dia"}
              </DialogTitle>
              {selectedMonthDate && (
                <p className="text-[12px] text-app-text-secondary">
                  {format(selectedMonthDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
              )}
            </DialogHeader>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div className="space-y-3">
              {selectedMonthDate && (() => {
                const dateKey = format(selectedMonthDate, "yyyy-MM-dd");
                const consultasDoDia = getConsultasForDate(dateKey);
                const pessoaisDoDia = getPessoaisForDate(dateKey);
                const consultasTotal = consultasDoDia.length;
                const pessoaisTotal = pessoaisDoDia.length;
                const showEmptySummary =
                  consultasTotal === 0 && pessoaisTotal === 0;

                const targetNames = getTargetProfessionalNames();
                let hasAllowed = false;
                let hasHoliday = false;
                targetNames.forEach((proName) => {
                  const availability = getDayAvailability(selectedMonthDate, proName);
                  if (availability.allowed) {
                    hasAllowed = true;
                  } else if (availability.holidayOverride) {
                    hasHoliday = true;
                  }
                });

                const slots = generateDaySlots()
                  .map((slot) => slot.time)
                  .filter((time) => {
                    if (!showSlots) return false;
                    return targetNames.some((proName) => {
                      const availability = getSlotAvailability(selectedMonthDate, time, proName);
                      return availability.allowed || availability.holidayOverride;
                    });
                  })
                  .filter((time) => {
                    const blocked = new Set<string>();
                    consultasDoDia.forEach((item) => {
                      const itemStatus = getResolvedStatus(item);
                      if (isCancelledStatus(itemStatus)) return;
                      const start = parseTimeToMinutes(item.hora);
                      const duration = parseDurationToMinutes(item.duracao);
                      for (let t = start; t < start + duration; t += 30) {
                        const h = Math.floor(t / 60)
                          .toString()
                          .padStart(2, "0");
                        const m = (t % 60).toString().padStart(2, "0");
                        blocked.add(`${h}:${m}`);
                      }
                    });
                    return !blocked.has(time);
                  });

                return (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      {consultasTotal > 0 && (
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#0039A6]/10 text-[#0039A6] border border-[#0039A6]/20">
                          {consultasTotal} consulta
                          {consultasTotal !== 1 ? "s" : ""}
                        </span>
                      )}
                      {pessoaisTotal > 0 && (
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                          {pessoaisTotal} pessoal
                          {pessoaisTotal !== 1 ? "s" : ""}
                        </span>
                      )}
                      {showEmptySummary && (
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-app-bg-secondary text-app-text-secondary border border-app-border">
                          Sem agendamentos
                        </span>
                      )}
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-app-bg-secondary text-app-text-secondary border border-app-border">
                        {slots.length} horário{slots.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="rounded-[12px] border border-app-border dark:border-app-border-dark p-4 bg-app-bg-secondary/40 dark:bg-app-bg-dark/40">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[12px] text-app-text-secondary">
                            Disponibilidade
                          </p>
                          <p className="text-sm text-app-text-primary dark:text-white">
                            {hasAllowed
                              ? "Horários disponíveis"
                              : hasHoliday
                                ? "Feriado (encaixe)"
                                : "Sem disponibilidade"}
                          </p>
                        </div>
                        <span className="text-[11px] text-app-text-secondary">
                          {slots.length} horário{slots.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {slots.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5 max-h-[90px] overflow-y-auto pr-1">
                          {slots.map((time) => (
                            <span
                              key={time}
                              className="text-[10px] px-2.5 py-1 rounded-full bg-white dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark text-app-text-secondary"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-[12px] text-app-text-secondary">
                          Sem horários livres para esse dia.
                        </p>
                      )}
                    </div>

                    {consultasDoDia.length === 0 && pessoaisDoDia.length === 0 && (
                      <div className="rounded-[10px] border border-app-border dark:border-app-border-dark p-4 text-sm text-app-text-secondary">
                        Sem agendamentos nesse dia.
                      </div>
                    )}

                    {consultasDoDia.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[12px] text-app-text-secondary">
                          Consultas ({consultasDoDia.length})
                        </p>
                        <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
                          {selectedProfessional === "todos"
                            ? Object.entries(
                                consultasDoDia.reduce(
                                  (acc, item) => {
                                    const key = item.profissional || "Outros";
                                    if (!acc[key]) acc[key] = [];
                                    acc[key].push(item);
                                    return acc;
                                  },
                                  {} as Record<string, AgendaItem[]>,
                                ),
                                ).map(([prof, items]) => (
                                <div key={prof} className="space-y-1">
                                  <p className="text-[11px] text-app-text-secondary">{prof}</p>
                                  {items
                                    .sort((a, b) => a.hora.localeCompare(b.hora))
                                    .map((item) => {
                                    const status = getResolvedStatus(item);
                                    return (
                                      <div key={`${item.id}-${item.hora}`} className={`${getStatusColor(status)} rounded-[10px] p-3`}>
                                        <div className="flex items-start justify-between gap-2">
                                          <div>
                                            <p className="text-sm text-app-text-primary dark:text-white">{item.paciente}</p>
                                            <p className="text-[12px] text-app-text-secondary">{item.hora} • {item.tipo}</p>
                                          </div>
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getBadgeStyle(status)}`}>
                                            {status}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))
                            : consultasDoDia
                                .sort((a, b) => a.hora.localeCompare(b.hora))
                                .map((item) => {
                                const status = getResolvedStatus(item);
                                return (
                                  <div key={`${item.id}-${item.hora}`} className={`${getStatusColor(status)} rounded-[10px] p-3`}>
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <p className="text-sm text-app-text-primary dark:text-white">{item.paciente}</p>
                                        <p className="text-[12px] text-app-text-secondary">{item.profissional} • {item.hora} • {item.tipo}</p>
                                      </div>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getBadgeStyle(status)}`}>
                                        {status}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      </div>
                    )}

                    {pessoaisDoDia.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[12px] text-app-text-secondary">
                          Compromissos pessoais ({pessoaisDoDia.length})
                        </p>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                          {pessoaisDoDia
                            .sort((a, b) => a.hora.localeCompare(b.hora))
                            .map((item) => (
                            <div key={item.id} className="bg-app-bg-secondary dark:bg-app-bg-dark rounded-[10px] p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm text-app-text-primary dark:text-white">{item.titulo}</p>
                                  <p className="text-[12px] text-app-text-secondary">{item.hora}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getBadgeStyle(item.status)}`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <Button
              onClick={() => {
                if (selectedMonthDate) {
                  setIsMonthPopupOpen(false);
                  handleDateClick(selectedMonthDate);
                }
              }}
              className="w-full h-10 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl"
            >
              Novo agendamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Segmented Control - Agenda Global/Pessoal (oculto quando hideGlobalTab=true) */}
      {!hideGlobalTab && (
        <SegmentedControl
          options={[
            { value: "global", label: "Agenda" },
            ...(allowPersonalTab
              ? [{ value: "pessoal", label: "Agenda pessoal" }]
              : []),
            ...(allowMixedView
              ? [{ value: "misto", label: "Simultâneo" }]
              : []),
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      )}

      {/* Header Unificado - Refatorado */}
      <div className="flex flex-col gap-4 w-full">
        {/* Mobile: Título e Data em uma linha, Ações na outra? Ou tudo em flex-wrap */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 w-full">
          {/* Esquerda: Navegação e Data */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <h1 className="text-2xl font-normal text-app-text-primary dark:text-white shrink-0 mr-2 hidden md:block">
              {activeTab === "global" ? "Agenda" : "Agenda pessoal"}
            </h1>

            {/* Grupo de Navegação - Compacto em mobile */}
            <div className="flex items-center gap-1 sm:gap-2 bg-app-card dark:bg-app-bg-dark/50 p-1 rounded-xl border border-app-border dark:border-gray-700 shadow-sm shrink-0">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-app-text-secondary hover:text-app-text-primary"
                  onClick={handlePrevDate}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 text-app-text-secondary hover:text-app-text-primary border-x border-gray-100 dark:border-gray-800 rounded-none w-10"
                  onClick={handleGoToToday}
                >
                  <Calendar size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-app-text-secondary hover:text-app-text-primary"
                  onClick={handleNextDate}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
              <span className="text-sm font-medium text-app-text-primary dark:text-white px-2 whitespace-nowrap min-w-[120px] text-center capitalize">
                {currentDate
                  ? format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })
                  : ""}
              </span>
            </div>

            {/* Alternador de Visualização */}
            <SegmentedControl
              value={viewMode}
              options={[
                { label: "Dia", value: "dia" },
                { label: "Semana", value: "semana" },
                { label: "Mês", value: "mes" },
              ]}
              onChange={(value) => setViewMode(value)}
              className="hidden sm:flex"
            />
          </div>

          {/* Direita: Ações Principais */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {showRecepcaoShortcuts ? (
                <>
                  <Button
                    onClick={effectiveNewAppointmentClick}
                    className="h-10 bg-[#0039A6] hover:bg-[#002d82] text-white px-4 md:px-6 rounded-xl gap-2 shadow-sm shadow-blue-900/10 w-full md:w-auto"
                  >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Marcar Consulta</span>
                    <span className="sm:hidden">Marcar</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleListaEsperaClick}
                    className="h-10 px-3 md:px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:border-[#0039A6] hover:text-[#0039A6] whitespace-nowrap text-xs md:text-sm"
                  >
                    <Users size={16} />
                    Lista de Espera
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsTarefasOpen(true)}
                    className="h-10 px-3 md:px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:border-[#0039A6] hover:text-[#0039A6] whitespace-nowrap text-xs md:text-sm"
                  >
                    <Bell size={16} />
                    Tarefas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAniversariantesOpen(true)}
                    className="h-10 px-3 md:px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:border-[#0039A6] hover:text-[#0039A6] whitespace-nowrap text-xs md:text-sm"
                  >
                    <Cake size={16} />
                    Aniversariantes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsBloqueioAgendaOpen(true)}
                    className="h-10 px-3 md:px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:border-[#0039A6] hover:text-[#0039A6] whitespace-nowrap text-xs md:text-sm"
                  >
                    <Lock size={16} />
                    Bloqueios
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsGerarAgendaOpen(true)}
                    className="h-10 px-3 md:px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:border-[#0039A6] hover:text-[#0039A6] whitespace-nowrap text-xs md:text-sm"
                  >
                    <CalendarPlus size={16} />
                    Gerar Agenda
                  </Button>
                </>
              ) : (
                <>
                  {!recepcaoLayout && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsBloqueioAgendaOpen(true)}
                        className="h-10 px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:border-[#0039A6] hover:text-[#0039A6] whitespace-nowrap"
                      >
                        <Lock size={18} />
                        Bloqueios
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsGerarAgendaOpen(true)}
                        className="h-10 px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:border-[#0039A6] hover:text-[#0039A6] whitespace-nowrap"
                      >
                        <CalendarPlus size={18} />
                        Gerar Agenda
                      </Button>
                    </>
                  )}
                  {recepcaoLayout &&
                    !showShortcutButtons &&
                    activeTab === "global" && (
                      <Button
                        variant="outline"
                        onClick={() => setIsGerarAgendaOpen(true)}
                        className="h-10 px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:border-[#0039A6] hover:text-[#0039A6] whitespace-nowrap"
                      >
                        <CalendarPlus size={18} />
                        Gerar Agenda
                      </Button>
                    )}
                </>
              )}
            </div>

            {/* Botão Novo Agendamento - canto */}
            {!showRecepcaoShortcuts && (
              <Button
                onClick={effectiveNewAppointmentClick}
                className="h-10 bg-[#0039A6] hover:bg-[#002d82] text-white px-4 md:px-6 rounded-xl gap-2 shadow-sm shadow-blue-900/10 w-full md:w-auto mt-2 md:mt-0"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Novo Agendamento</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {agendaRules.length > 0 && (
        <div className="w-full rounded-[10px] border border-app-border dark:border-app-border-dark p-3 bg-app-bg-secondary/30 dark:bg-app-bg-dark/20">
          <p className="text-[12px] font-normal text-app-text-secondary mb-2">
            Regras ativas de geração
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {agendaRules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-[10px] border border-app-border dark:border-app-border-dark p-3 bg-white dark:bg-app-bg-dark"
              >
                <p className="text-sm font-normal text-app-text-primary dark:text-white">
                  {rule.profissional}
                </p>
                <p className="text-[11px] text-app-text-secondary">
                  Período: {rule.dataInicio} → {rule.dataFim}
                </p>
                {rule.diasMes && rule.diasMes.length > 0 ? (
                  <p className="text-[11px] text-app-text-secondary">
                    Dias do mês: {rule.diasMes.join(", ")}
                  </p>
                ) : (
                  <p className="text-[11px] text-app-text-secondary">
                    Dias da semana:{" "}
                    {rule.diasSemana.map((d) => WEEKDAY_LABELS[d]).join(", ")}
                  </p>
                )}
                <p className="text-[11px] text-app-text-secondary">
                  Horários:{" "}
                  {rule.horarios.map((h) => `${h.inicio}-${h.fim}`).join(" | ")}
                </p>
                <p className="text-[11px] text-app-text-secondary">
                  Durações: {rule.duracaoPrimeira}min / {rule.duracaoRetorno}min
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 text-[10px] border-app-border text-app-text-secondary"
                >
                  Feriados:{" "}
                  {rule.considerarFeriados ? "Considerar" : "Não considerar"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros por status - Ocultos na Agenda Pessoal por solicitação */}
      {/* Ordem: Todos – Agendamentos – Aguardando – Em atendimento – Atendidos */}
      {activeTab !== "pessoal" && (
        <SegmentedControl
          options={[
            { value: "todos", label: "Todos" },
            { value: "agendamentos", label: "Agendamentos" },
            { value: "aguardando", label: "Aguardando" },
            { value: "atendimento", label: "Em Atendimento" },
            { value: "atendidos", label: "Atendidos" },
          ]}
          value={selectedFilter}
          onChange={setSelectedFilter}
        />
      )}

      {/* Container Principal Branco - Agrupa Filtro, Legendas e Lista */}
      <div className="bg-app-card dark:bg-app-bg-dark rounded-[14px] border border-app-border dark:border-app-border-dark p-4 sm:p-6 space-y-6 overflow-x-hidden">
        {/* Filtro de profissionais e Contador - Responsivo */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Título e Contador */}
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-4 w-4 text-app-text-primary dark:text-white" />
            <span className="text-[14px] font-normal text-app-text-primary dark:text-white">
              {activeTab === "pessoal"
                ? `Reuniões (${viewMode === "semana" ? weekData.reduce((acc, dia: WeekDayData) => acc + (dia.itensPersonais?.length || 0), 0) : filteredPersonalItems.length})`
                : `Consultas (${viewMode === "semana" ? weekData.reduce((acc, dia: WeekDayData) => acc + (dia.consultas?.length || 0), 0) : filteredItems.length})`}
            </span>
          </div>

          {/* Select de Profissionais - Ajustado para w-full no mobile */}
          {activeTab === "global" && !isSpecialist && (
            <div className="w-full sm:w-auto">
              <Select
                value={selectedProfessional}
                onValueChange={setSelectedProfessional}
              >
                <SelectTrigger
                  className="
              h-11 w-full sm:w-64 lg:w-80 
              bg-app-card dark:bg-app-bg-dark 
              border-app-border dark:border-[#364153] 
              rounded-[10px] 
              text-sm font-normal text-[#364153] dark:text-gray-200
              focus:ring-2 focus:ring-[#0039A6]/20 focus:border-[#0039A6]
              transition-all
            "
                >
                  <SelectValue
                    preferPlaceholder
                    placeholder="Todos os profissionais"
                  >
                    {selectedProfessionalLabel}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  className="
              rounded-[10px] 
              border-app-border dark:border-[#364153] 
              bg-app-card dark:bg-app-bg-dark 
              text-[#364153] dark:text-gray-200
              shadow-xl
            "
                >
                  <SelectItem
                    value="todos"
                    className="focus:bg-emerald-50 dark:focus:bg-emerald-900/20 rounded-md"
                  >
                    Todos os profissionais
                  </SelectItem>
                  {selectProfessionalOptions.map((profName) => (
                    <SelectItem
                      key={profName}
                      value={profName}
                      className="focus:bg-emerald-50 dark:focus:bg-emerald-900/20 rounded-md"
                    >
                      {profName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Legendas de Status e Pagamento */}
        <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 rounded-[10px] p-3">
          {activeTab === "global" ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-[12px] text-[#364153] dark:text-app-text-muted">
                  Status:
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] text-[#4a5565] dark:text-white/80">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span>Confirmado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span>Check-in</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span>Check-out</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <span>Em atraso</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <span>Cancelado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                    <span>Em Atendimento</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[12px] text-[#364153] dark:text-app-text-muted">
                  Pagamento:
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] text-[#4a5565] dark:text-white/80">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-green-600" />
                    <span>Pago</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                    <span>Pago Parcial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-red-600" />
                    <span>Pendente</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[12px] text-[#364153] dark:text-app-text-muted">
                Status das reuniões:
              </p>
              <div className="flex items-center gap-4 text-[11px] text-[#4a5565] dark:text-white/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f79009]"></div>
                  <span>Pendente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#155dfc]"></div>
                  <span>Em Andamento</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00c950]"></div>
                  <span>Concluído</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fb2c36]"></div>
                  <span>Cancelado</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visualização Dia */}
        {viewMode === "dia" && (
          <div className="space-y-3">
            {activeTab === "global" ? (
              // Lista de consultas (Agenda Global)
              <>
                {recepcaoLayout ? (
                  <div className="space-y-2">
                    {daySlots.map((slot) => {
                      const itemsInSlot = filteredItems.filter(
                        (i) => i.hora === slot.time,
                      );
                      const targetNames = getTargetProfessionalNames();

                      return (
                        <div key={slot.id} className="space-y-2">
                          {itemsInSlot.map((item) => {
                            const currentStatus = getResolvedStatus(item);
                            return (
                              <div
                                key={item.id}
                                className={`${getStatusColor(currentStatus)} rounded-[10px] p-4 transition-colors duration-300`}
                              >
                                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 sm:gap-0">
                                  {/* Hora e Duração */}
                                  <div className="flex-shrink-0 w-[60px]">
                                    <p className="text-[20px] font-normal text-app-text-primary dark:text-white leading-[30px]">
                                      {item.hora}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Clock className="h-3 w-3 text-app-text-secondary dark:text-app-text-muted" />
                                      <span className="text-[12px] font-normal text-app-text-secondary dark:text-app-text-muted">
                                        {item.duracao || "30min"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Informações do Paciente e Profissional */}
                                  <div className="flex-1 w-full sm:w-auto ml-0 sm:ml-4 min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-[16px] font-normal text-app-text-primary dark:text-white truncate">
                                        {item.paciente}
                                      </p>
                                      {item.tipo && (
                                        <span className="bg-gray-200 dark:bg-gray-700 text-[#364153] dark:text-white/80 px-2 py-0.5 rounded text-[12px] font-normal whitespace-nowrap">
                                          {item.tipo}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[14px] font-normal text-app-text-secondary dark:text-app-text-muted leading-[21px] truncate">
                                      {item.profissional}
                                    </p>
                                  </div>

                                  {/* Controles */}
                                  <div className="flex items-center gap-2 ml-0 sm:ml-4 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                                    {onStartAtendimento &&
                                      (currentStatus === "Aguardando" ||
                                        currentStatus === "Check-in") && (
                                        <Button
                                          onClick={() =>
                                            onStartAtendimento(item)
                                          }
                                          className="bg-[#0039A6] hover:bg-[#1d3b2e] text-white h-9 px-3 sm:px-4 rounded-[10px] font-normal flex items-center gap-2 shadow-sm transition-all active:scale-95 flex-1 sm:flex-initial justify-center"
                                        >
                                          <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                                          <span className="text-sm">
                                            Iniciar Atendimento
                                          </span>
                                        </Button>
                                      )}

                                    {/* Dropdown de Status */}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button
                                          className={`${getStatusButtonColor(currentStatus)} text-white px-4 py-1.5 rounded-[8px] text-[13px] font-normal flex items-center gap-2 min-w-[120px] justify-center transition-colors shadow-sm`}
                                        >
                                          <span>{currentStatus}</span>
                                          <ChevronDown className="h-3 w-3" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="bg-app-card dark:bg-app-bg-dark border-app-border dark:border-[#1a3028] text-gray-700 dark:text-white/80 z-[9999] shadow-lg"
                                      >
                                        <DropdownMenuItem
                                          className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                          onClick={() =>
                                            handleStatusChange(
                                              item.id,
                                              "Confirmado",
                                            )
                                          }
                                        >
                                          Confirmado
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                          onClick={() =>
                                            handleStatusChange(
                                              item.id,
                                              "Check-in",
                                            )
                                          }
                                        >
                                          Check-in
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                          onClick={() =>
                                            handleStatusChange(
                                              item.id,
                                              "Check-out",
                                            )
                                          }
                                        >
                                          Check-out
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                          onClick={() =>
                                            handleStatusChange(
                                              item.id,
                                              "Em Atendimento",
                                            )
                                          }
                                        >
                                          Em Atendimento
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                          onClick={() =>
                                            handleStatusChange(
                                              item.id,
                                              "Em atraso",
                                            )
                                          }
                                        >
                                          Em atraso
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                          onClick={() =>
                                            handleRequestCancelamento(item.id)
                                          }
                                        >
                                          Cancelado
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Ícone de Pagamento */}
                                    {!isSpecialist && (
                                      <>
                                        <button
                                          className="h-8 w-8 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                          onClick={() =>
                                            handleOpenEmitirCobranca(item)
                                          }
                                        >
                                          {getPagamentoIcon(item.pagamento)}
                                        </button>
                                        <button
                                          className="h-8 w-8 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                          onClick={() =>
                                            handleOpenChamarEspecialista(item)
                                          }
                                        >
                                          <Bell className="h-4 w-4 text-[#0039A6] dark:text-white" />
                                        </button>
                                      </>
                                    )}

                                    {/* Menu de Opções */}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button className="h-8 w-8 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                          <MoreVertical className="h-4 w-4 text-[#4a5565] dark:text-white/80" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {!isSpecialist && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleOpenEmitirCobranca(item)
                                            }
                                          >
                                            Emitir nova cobrança
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleOpenVisualizarConsulta(item)
                                          }
                                        >
                                          Visualizar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleOpenRemarcarConsulta(item)
                                          }
                                        >
                                          Reagendar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={() =>
                                            handleOpenCancelarConsulta(item)
                                          }
                                        >
                                          Desmarcar
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {targetNames.map((proName) => {
                            const occupied = itemsInSlot.some((i) =>
                              i.profissional.includes(proName) &&
                              !isCancelledStatus(getResolvedStatus(i)),
                            );
                            if (occupied) return null;

                            const availability = getSlotAvailability(
                              currentDate,
                              slot.time,
                              proName,
                            );
                            if (
                              !availability.allowed &&
                              !availability.holidayOverride
                            )
                              return null;

                            return (
                              <button
                                key={`slot-${slot.id}-${proName}`}
                                onClick={() => handleTimeSlotClick(slot.time)}
                                className="w-full bg-white dark:bg-app-bg-dark border border-dashed border-gray-300 dark:border-gray-700 rounded-[10px] p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group h-[88px]"
                              >
                                <div className="w-[60px] text-left">
                                  <p className="text-[20px] font-normal text-gray-400 dark:text-gray-500 group-hover:text-[#0039A6] dark:group-hover:text-[#0039A6] transition-colors leading-[30px]">
                                    {slot.time}
                                  </p>
                                  <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Clock className="h-3 w-3 text-[#0039A6]" />
                                    <span className="text-[12px] font-normal text-[#0039A6]">
                                      30min
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 text-left flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#0039A6]/10 transition-colors">
                                    <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#0039A6] transition-colors" />
                                  </div>
                                  <div className="flex flex-col ml-3">
                                    <span className="text-[16px] text-gray-400 dark:text-gray-500 font-normal group-hover:text-[#0039A6] transition-colors">
                                      {availability.holidayOverride
                                        ? "Feriado (encaixe)"
                                        : "Disponível"}
                                    </span>
                                    {selectedProfessional === "todos" && (
                                      <span className="text-[11px] text-app-text-muted">
                                        {proName}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    {filteredItems.map((item) => {
                      const currentStatus = getResolvedStatus(item);
                      const hasActiveAtSameSlotForProfessional = filteredItems.some(
                        (other) =>
                          other.id !== item.id &&
                          other.hora === item.hora &&
                          other.profissional === item.profissional &&
                          !isCancelledStatus(getResolvedStatus(other)),
                      );
                      const freedSlotAvailability = getSlotAvailability(
                        currentDate,
                        item.hora,
                        item.profissional,
                      );
                      const shouldShowFreedSlot =
                        showSlots &&
                        isCancelledStatus(currentStatus) &&
                        !hasActiveAtSameSlotForProfessional &&
                        (freedSlotAvailability.allowed ||
                          freedSlotAvailability.holidayOverride);

                      return (
                        <div key={item.id} className="space-y-2">
                          <div
                            className={`${getStatusColor(currentStatus)} rounded-[10px] p-4 transition-colors duration-300`}
                          >
                            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 sm:gap-0">
                            {/* Hora e Duração */}
                            <div className="flex-shrink-0 w-[60px]">
                              <p className="text-[20px] font-normal text-app-text-primary dark:text-white leading-[30px]">
                                {item.hora}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3 text-app-text-secondary dark:text-app-text-muted" />
                                <span className="text-[12px] font-normal text-app-text-secondary dark:text-app-text-muted">
                                  {item.duracao || "30min"}
                                </span>
                              </div>
                            </div>

                            {/* Informações do Paciente e Profissional */}
                            <div className="flex-1 w-full sm:w-auto ml-0 sm:ml-4 min-w-[200px]">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-[16px] font-normal text-app-text-primary dark:text-white truncate">
                                  {item.paciente}
                                </p>
                                {item.tipo && (
                                  <span className="bg-gray-200 dark:bg-gray-700 text-[#364153] dark:text-white/80 px-2 py-0.5 rounded text-[12px] font-normal whitespace-nowrap">
                                    {item.tipo}
                                  </span>
                                )}
                              </div>
                              <p className="text-[14px] font-normal text-app-text-secondary dark:text-app-text-muted leading-[21px] truncate">
                                {item.profissional}
                              </p>
                            </div>

                            {/* Controles */}
                            <div className="flex items-center gap-2 ml-0 sm:ml-4 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                              {onStartAtendimento &&
                                (currentStatus === "Aguardando" ||
                                  currentStatus === "Check-in") && (
                                  <Button
                                    onClick={() => onStartAtendimento(item)}
                                    className="bg-[#0039A6] hover:bg-[#1d3b2e] text-white h-9 px-3 sm:px-4 rounded-[10px] font-normal flex items-center gap-2 shadow-sm transition-all active:scale-95 flex-1 sm:flex-initial justify-center"
                                  >
                                    <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                                    <span className="text-sm">
                                      Iniciar Atendimento
                                    </span>
                                  </Button>
                                )}

                              {/* Dropdown de Status */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className={`${getStatusButtonColor(currentStatus)} text-white px-4 py-1.5 rounded-[8px] text-[13px] font-normal flex items-center gap-2 min-w-[120px] justify-center transition-colors shadow-sm`}
                                  >
                                    <span>{currentStatus}</span>
                                    <ChevronDown className="h-3 w-3" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-app-card dark:bg-app-bg-dark border-app-border dark:border-[#1a3028] text-gray-700 dark:text-white/80 z-[9999] shadow-lg"
                                >
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(item.id, "Confirmado")
                                    }
                                  >
                                    Confirmado
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(item.id, "Check-in")
                                    }
                                  >
                                    Check-in
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(item.id, "Check-out")
                                    }
                                  >
                                    Check-out
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(
                                        item.id,
                                        "Em Atendimento",
                                      )
                                    }
                                  >
                                    Em Atendimento
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(item.id, "Em atraso")
                                    }
                                  >
                                    Em atraso
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleRequestCancelamento(item.id)
                                    }
                                  >
                                    Cancelado
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              {/* Ícone de Pagamento */}
                              {!isSpecialist && (
                                <>
                                  <button
                                    className="h-8 w-8 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                    onClick={() => handleOpenEmitirCobranca(item)}
                                  >
                                    {getPagamentoIcon(item.pagamento)}
                                  </button>
                                  <button
                                    className="h-8 w-8 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                    onClick={() =>
                                      handleOpenChamarEspecialista(item)
                                    }
                                  >
                                    <Bell className="h-4 w-4 text-[#0039A6] dark:text-white" />
                                  </button>
                                </>
                              )}

                              {/* Menu de Opções */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="h-8 w-8 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                    <MoreVertical className="h-4 w-4 text-[#4a5565] dark:text-white/80" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!isSpecialist && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleOpenEmitirCobranca(item)
                                      }
                                    >
                                      Emitir nova cobrança
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleOpenVisualizarConsulta(item)
                                    }
                                  >
                                    Visualizar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleOpenRemarcarConsulta(item)
                                    }
                                  >
                                    Reagendar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleOpenCancelarConsulta(item)
                                    }
                                  >
                                    Desmarcar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            </div>
                          </div>

                          {shouldShowFreedSlot && (
                            <button
                              onClick={() => handleTimeSlotClick(item.hora)}
                              className="w-full bg-white dark:bg-app-bg-dark border border-dashed border-gray-300 dark:border-gray-700 rounded-[10px] p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                            >
                              <div className="w-[60px] text-left">
                                <p className="text-[20px] font-normal text-gray-400 dark:text-gray-500 group-hover:text-[#0039A6] dark:group-hover:text-[#0039A6] transition-colors leading-[30px]">
                                  {item.hora}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Clock className="h-3 w-3 text-[#0039A6]" />
                                  <span className="text-[12px] font-normal text-[#0039A6]">
                                    30min
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 text-left flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#0039A6]/10 transition-colors">
                                  <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#0039A6] transition-colors" />
                                </div>
                                <div className="flex flex-col ml-3">
                                  <span className="text-[16px] text-gray-400 dark:text-gray-500 font-normal group-hover:text-[#0039A6] transition-colors">
                                    {freedSlotAvailability.holidayOverride
                                      ? "Feriado (encaixe)"
                                      : "Disponível"}
                                  </span>
                                  <span className="text-[11px] text-app-text-muted">
                                    {item.profissional}
                                  </span>
                                </div>
                              </div>
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {selectedFilter === "agendamentos" &&
                      freedSlotsFromCancelledInAgendamentos.map(
                        ({ item, availability }) => (
                          <button
                            key={`freed-slot-${item.profissional}-${item.hora}`}
                            onClick={() => handleTimeSlotClick(item.hora)}
                            className="w-full bg-white dark:bg-app-bg-dark border border-dashed border-gray-300 dark:border-gray-700 rounded-[10px] p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                          >
                            <div className="w-[60px] text-left">
                              <p className="text-[20px] font-normal text-gray-400 dark:text-gray-500 group-hover:text-[#0039A6] dark:group-hover:text-[#0039A6] transition-colors leading-[30px]">
                                {item.hora}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Clock className="h-3 w-3 text-[#0039A6]" />
                                <span className="text-[12px] font-normal text-[#0039A6]">
                                  30min
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 text-left flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#0039A6]/10 transition-colors">
                                <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#0039A6] transition-colors" />
                              </div>
                              <div className="flex flex-col ml-3">
                                <span className="text-[16px] text-gray-400 dark:text-gray-500 font-normal group-hover:text-[#0039A6] transition-colors">
                                  {availability.holidayOverride
                                    ? "Feriado (encaixe)"
                                    : "Disponível"}
                                </span>
                                <span className="text-[11px] text-app-text-muted">
                                  {item.profissional}
                                </span>
                              </div>
                            </div>
                          </button>
                        ),
                      )}

                    {filteredItems.length === 0 &&
                      freedSlotsFromCancelledInAgendamentos.length === 0 && (
                      <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 rounded-[10px] p-12 flex flex-col items-center justify-center">
                        <Calendar className="h-12 w-12 text-app-text-muted dark:text-app-text-muted mb-4" />
                        <h3 className="text-app-text-primary dark:text-white mb-2">
                          Nenhum agendamento encontrado
                        </h3>
                        <p className="text-sm text-app-text-secondary dark:text-app-text-muted">
                          Não há consultas agendadas para o período selecionado.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              // Lista de compromissos pessoais (Agenda Pessoal)
              <>
                {filteredPersonalItems.map((item) => {
                  const currentStatus =
                    personalItemStatuses[item.id] || item.status;
                  return (
                    <div
                      key={item.id}
                      className="bg-app-bg-secondary dark:bg-app-bg-dark rounded-[10px] p-4 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        {/* Hora e Duração */}
                        <div className="flex-shrink-0 w-[60px]">
                          <p className="text-[20px] font-normal text-app-text-primary dark:text-white leading-[30px]">
                            {item.hora}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3 text-app-text-secondary dark:text-app-text-muted" />
                            <span className="text-[12px] font-normal text-app-text-secondary dark:text-app-text-muted">
                              {item.duracao || "30min"}
                            </span>
                          </div>
                        </div>

                        {/* Informações do Compromisso */}
                        <div className="flex-1 ml-4">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[16px] font-normal text-app-text-primary dark:text-white">
                              {item.titulo}
                            </p>
                            <span className="bg-[#0039A6] dark:bg-[#1d3b2e] text-white px-2 py-0.5 rounded text-[12px] font-normal">
                              {item.tipo}
                            </span>
                          </div>
                          {item.descricao && (
                            <p className="text-[14px] text-app-text-secondary dark:text-app-text-muted leading-[21px] mb-1">
                              {item.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[12px] text-app-text-secondary dark:text-app-text-muted">
                            {item.local && (
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {item.local}
                              </span>
                            )}
                            {item.participantes && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {item.participantes}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controles */}
                        <div className="flex items-center gap-2 ml-4">
                          {/* Badge de Status (sem dropdown) */}
                          <Badge
                            className={`${getBadgeStyle(currentStatus)} px-2.5 py-0.5 text-[13px] h-[19.5px] rounded-full font-normal`}
                          >
                            {currentStatus}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <MoreVertical className="h-4 w-4 text-[#4a5565] dark:text-white/80" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCompromisso(item);
                                  setIsEditarCompromissoOpen(true);
                                }}
                              >
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCompromisso(item);
                                  setIsAdiarCompromissoOpen(true);
                                }}
                              >
                                Adiar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedCompromisso(item);
                                  setIsCancelarCompromissoOpen(true);
                                }}
                              >
                                Cancelar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredPersonalItems.length === 0 && (
                  <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 rounded-[10px] p-12 flex flex-col items-center justify-center">
                    <Calendar className="h-12 w-12 text-app-text-muted dark:text-app-text-muted mb-4" />
                    <h3 className="text-app-text-primary dark:text-white mb-2">
                      Nenhum compromisso encontrado
                    </h3>
                    <p className="text-sm text-app-text-secondary dark:text-app-text-muted">
                      Não há compromissos agendados para o período selecionado.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Visualização Semana */}
        {viewMode === "semana" && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {weekData.map((dia: WeekDayData) => (
              <div
                key={dia.data}
                className="rounded-[10px] border border-app-border dark:border-app-border-dark bg-app-card dark:bg-app-bg-dark overflow-hidden"
              >
                {/* Cabeçalho do Dia */}
                <div
                  className={`p-3 text-center border-b border-app-border dark:border-app-border-dark ${
                    dia.isToday
                      ? "bg-[#0039A6] dark:bg-[#1d3b2e]"
                      : "bg-app-bg-secondary dark:bg-app-bg-dark/50"
                  }`}
                >
                  <p
                    className={`text-[13px] ${
                      dia.isToday
                        ? "text-white/80"
                        : "text-app-text-secondary dark:text-app-text-muted"
                    }`}
                  >
                    {dia.nome}
                  </p>
                  <p
                    className={`text-[20px] ${
                      dia.isToday
                        ? "text-white"
                        : "text-app-text-primary dark:text-white"
                    }`}
                  >
                    {dia.numero}
                  </p>
                  <p
                    className={`text-[11px] ${
                      dia.isToday
                        ? "text-white/60"
                        : "text-app-text-secondary dark:text-app-text-muted"
                    }`}
                  >
                    (
                    {activeTab === "pessoal"
                      ? dia.itensPersonais?.length || 0
                      : dia.consultas?.length || 0}
                    )
                  </p>
                </div>

                {/* Lista de Consultas/Compromissos do Dia */}
                <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                  {showSlots && (
                    (() => {
                      const dayDate = new Date(`${dia.data}T00:00:00`);
                      const targetNames = getTargetProfessionalNames();
                      let hasAllowed = false;
                      let hasHoliday = false;

                      targetNames.forEach((proName) => {
                        const availability = getDayAvailability(dayDate, proName);
                        if (availability.allowed) {
                          hasAllowed = true;
                        } else if (availability.holidayOverride) {
                          hasHoliday = true;
                        }
                      });

                      if (!hasAllowed && !hasHoliday) return null;

                      return (
                        <button
                          onClick={() => handleDateClick(dayDate)}
                          className="w-full text-[11px] rounded-[8px] border border-dashed border-app-border dark:border-app-border-dark px-2 py-1 text-app-text-secondary hover:text-[#0039A6] hover:border-[#0039A6] transition-colors"
                        >
                          {hasHoliday ? "Feriado (encaixe)" : "Disponível"} •
                          Novo agendamento
                        </button>
                      );
                    })()
                  )}
                  {activeTab === "global" &&
                  dia.consultas &&
                  dia.consultas.length > 0 ? (
                    dia.consultas.map((consulta: AgendaItem) => {
                      const currentStatus = normalizeStatus(
                        itemStatuses[consulta.id] || consulta.status,
                      );
                      return (
                        <div
                          key={consulta.id}
                          className={`${getStatusColor(currentStatus)} rounded-[8px] p-3 space-y-2`}
                        >
                          {/* Horário e Duração */}
                          <div className="flex items-center gap-1">
                            <p className="text-[14px] font-normal text-app-text-primary dark:text-white">
                              {consulta.hora}
                            </p>
                            <Clock className="h-3 w-3 text-app-text-secondary dark:text-app-text-muted" />
                            <span className="text-[11px] font-normal text-app-text-secondary dark:text-app-text-muted">
                              {consulta.duracao}
                            </span>
                          </div>

                          {/* Nome do Paciente */}
                          <p className="text-[13px] text-app-text-primary dark:text-white leading-tight">
                            {consulta.paciente}
                          </p>

                          {/* Profissional */}
                          <p className="text-[11px] text-app-text-secondary dark:text-app-text-muted leading-tight">
                            {consulta.profissional}
                          </p>

                          {/* Tipo de Consulta */}
                          {consulta.tipo && (
                            <span className="inline-block bg-gray-200 dark:bg-gray-700 text-[#364153] dark:text-white/80 px-2 py-0.5 rounded text-[10px]">
                              {consulta.tipo}
                            </span>
                          )}

                          {/* Controles Compactos */}
                          <div className="flex items-center justify-between pt-1">
                            {onStartAtendimento &&
                            (currentStatus === "Aguardando" ||
                              currentStatus === "Check-in") ? (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStartAtendimento(consulta);
                                }}
                                className="h-7 text-[10px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-lg flex items-center gap-1 font-normal shadow-sm group-hover:scale-105 transition-all"
                              >
                                <Play className="h-3 w-3 fill-current" />
                                <span>Atender</span>
                              </Button>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className={`${getStatusButtonColor(currentStatus)} text-white px-2 py-1 rounded-[6px] text-[11px] font-normal flex items-center gap-1 transition-colors shadow-sm`}
                                  >
                                    <span>{currentStatus}</span>
                                    <ChevronDown className="h-3 w-3" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-app-card dark:bg-app-bg-dark border-app-border dark:border-[#1a3028] text-gray-700 dark:text-white/80 z-[9999] shadow-lg"
                                >
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(
                                        consulta.id,
                                        "Confirmado",
                                      )
                                    }
                                  >
                                    Confirmado
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(
                                        consulta.id,
                                        "Check-in",
                                      )
                                    }
                                  >
                                    Check-in
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(
                                        consulta.id,
                                        "Check-out",
                                      )
                                    }
                                  >
                                    Check-out
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(
                                        consulta.id,
                                        "Em Atendimento",
                                      )
                                    }
                                  >
                                    Em Atendimento
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleStatusChange(
                                        consulta.id,
                                        "Em atraso",
                                      )
                                    }
                                  >
                                    Em atraso
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-app-bg-secondary dark:hover:bg-[#1a3028] cursor-pointer"
                                    onClick={() =>
                                      handleRequestCancelamento(consulta.id)
                                    }
                                  >
                                    Cancelado
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}

                            {!isSpecialist && (
                              <div className="flex items-center gap-1">
                                <button
                                  className="h-6 w-6 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded transition-colors"
                                  onClick={() =>
                                    handleOpenEmitirCobranca(consulta)
                                  }
                                >
                                  {getPagamentoIcon(consulta.pagamento)}
                                </button>
                                <button
                                  className="h-6 w-6 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded transition-colors"
                                  onClick={() =>
                                    handleOpenChamarEspecialista(consulta)
                                  }
                                >
                                  <Bell className="h-3 w-3 text-[#0039A6] dark:text-white" />
                                </button>
                              </div>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="h-6 w-6 flex items-center justify-center hover:bg-app-card/50 dark:hover:bg-gray-700/50 rounded transition-colors">
                                  <MoreVertical className="h-3 w-3 text-[#4a5565] dark:text-white/80" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[#020817] border-[#1a3028] text-gray-300 z-[9999]"
                              >
                                {!isSpecialist && (
                                  <DropdownMenuItem
                                    className="hover:bg-[#1a3028] hover:text-white cursor-pointer"
                                    onClick={() =>
                                      handleOpenEmitirCobranca(consulta)
                                    }
                                  >
                                    Emitir nova cobrança
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="hover:bg-[#1a3028] hover:text-white cursor-pointer"
                                  onClick={() =>
                                    handleOpenVisualizarConsulta(consulta)
                                  }
                                >
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="hover:bg-[#1a3028] hover:text-white cursor-pointer"
                                  onClick={() =>
                                    handleOpenRemarcarConsulta(consulta)
                                  }
                                >
                                  Reagendar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-500 hover:bg-[#1a3028] hover:text-red-400 cursor-pointer"
                                  onClick={() =>
                                    handleOpenCancelarConsulta(consulta)
                                  }
                                >
                                  Desmarcar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })
                  ) : activeTab === "pessoal" &&
                    dia.itensPersonais &&
                    dia.itensPersonais.length > 0 ? (
                    dia.itensPersonais.map((item: AgendaPersonalItem) => {
                      const currentStatus =
                        personalItemStatuses[item.id] || item.status;
                      return (
                        <div
                          key={item.id}
                          className="bg-app-bg-secondary dark:bg-app-bg-dark rounded-[8px] p-[10px] space-y-[8px]"
                        >
                          {/* Linha 1: Horário e Duração */}
                          <div className="flex items-center justify-between">
                            <p className="text-[16px] font-normal text-app-text-primary dark:text-white leading-[24px]">
                              {item.hora}
                            </p>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-app-text-secondary dark:text-app-text-muted" />
                              <span className="text-[10px] text-app-text-secondary dark:text-app-text-muted leading-[15px]">
                                {item.duracao}
                              </span>
                            </div>
                          </div>

                          {/* Linha 2: Título */}
                          <div className="h-[19.5px] overflow-hidden">
                            <p className="text-[13px] text-app-text-primary dark:text-white leading-[19.5px]">
                              {item.titulo}
                            </p>
                          </div>

                          {/* Linha 3: Badge de Tipo */}
                          <div>
                            <span className="inline-block bg-[#d1d5dc] dark:bg-gray-700 text-[#364153] dark:text-white/80 px-[6px] py-[2px] rounded text-[10px] leading-[15px]">
                              {item.tipo}
                            </span>
                          </div>

                          {/* Linha 4: Status e Menu */}
                          <div className="flex items-center justify-between">
                            <Badge
                              className={`${getBadgeStyle(currentStatus)} px-2 py-0.5 text-[10px] h-[16px] rounded-full leading-[15px] font-normal`}
                            >
                              {currentStatus}
                            </Badge>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="h-4 w-4 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                                  <MoreVertical className="h-4 w-4 text-[#4a5565] dark:text-white/80" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCompromisso(item);
                                    setIsEditarCompromissoOpen(true);
                                  }}
                                >
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCompromisso(item);
                                    setIsAdiarCompromissoOpen(true);
                                  }}
                                >
                                  Adiar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedCompromisso(item);
                                    setIsCancelarCompromissoOpen(true);
                                  }}
                                >
                                  Cancelar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-[11px] text-app-text-secondary dark:text-app-text-muted">
                        {activeTab === "pessoal"
                          ? "Sem compromissos"
                          : "Sem consultas"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {viewMode === "mes" && (
          <div className="border border-app-border dark:border-app-border-dark rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-7 bg-app-bg-secondary dark:bg-app-bg-dark/50 border-b border-app-border dark:border-app-border-dark">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
                <div
                  key={dia}
                  className="py-3 text-center text-[13px] font-normal text-app-text-secondary dark:text-app-text-muted"
                >
                  {dia}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {getMonthDays(currentDate).map((day, index) => {
                const targetNames = getTargetProfessionalNames();
                const relevantRules = agendaRules.filter((rule) =>
                  targetNames.includes(rule.profissional),
                );
                let availabilityLabel = "";
                const dateKey = day ? format(day, "yyyy-MM-dd") : "";
                const consultasDoDia = day ? getConsultasForDate(dateKey) : [];
                const pessoaisDoDia = day ? getPessoaisForDate(dateKey) : [];
                const { consultas, exames, retornos } = day
                  ? getConsultasSummary(consultasDoDia)
                  : { consultas: 0, exames: 0, retornos: 0 };
                const pessoaisCount = day ? pessoaisDoDia.length : 0;

                if (day && relevantRules.length > 0) {
                  let hasAllowed = false;
                  let hasHoliday = false;

                  targetNames.forEach((proName) => {
                    const availability = getDayAvailability(day, proName);
                    if (availability.allowed) {
                      hasAllowed = true;
                    } else if (availability.holidayOverride) {
                      hasHoliday = true;
                    }
                  });

                  if (hasAllowed) {
                    availabilityLabel = "Disponível";
                  } else if (hasHoliday) {
                    availabilityLabel = "Feriado (encaixe)";
                  }
                }

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (day) {
                        setSelectedMonthDate(day);
                        setIsMonthPopupOpen(true);
                      }
                    }}
                    className={`min-h-[120px] p-2 border-r border-b border-app-border dark:border-app-border-dark transition-colors ${
                      day
                        ? "bg-app-card dark:bg-app-bg-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5"
                        : "bg-app-bg-secondary/30 dark:bg-app-bg-dark/10"
                    } ${day ? "cursor-pointer" : ""}`}
                  >
                    {day && (
                      <>
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-sm font-normal ${
                              day.getDate() === currentDate.getDate() &&
                              day.getMonth() === currentDate.getMonth() &&
                              day.getFullYear() === currentDate.getFullYear()
                                ? "bg-[#0039A6] text-white w-6 h-6 flex items-center justify-center rounded-full"
                                : "text-app-text-primary dark:text-white"
                            }`}
                          >
                            {day.getDate()}
                          </span>
                          <div
                            className="opacity-0 group-hover:opacity-100 cursor-pointer p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDateClick(day);
                            }}
                          >
                            <Plus size={14} className="text-[#0039A6]" />
                          </div>
                        </div>
                        {availabilityLabel && (
                          <div className="mt-1 text-[10px] text-[#0039A6] dark:text-emerald-400 font-normal bg-[#0039A6]/10 dark:bg-[#0039A6]/20 px-1.5 py-1 rounded-md border border-[#0039A6]/10 truncate">
                            {availabilityLabel}
                          </div>
                        )}
                        <div className="mt-2 space-y-1">
                          {(activeTab === "global" || activeTab === "misto") &&
                            consultas > 0 && (
                            <div className="text-[10px] text-[#0039A6] dark:text-emerald-400 font-normal bg-[#0039A6]/10 dark:bg-[#0039A6]/20 px-1.5 py-1 rounded-md border border-[#0039A6]/10 truncate">
                              {consultas} Consulta{consultas > 1 ? "s" : ""}
                            </div>
                          )}
                          {(activeTab === "global" || activeTab === "misto") &&
                            exames > 0 && (
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-normal bg-blue-50 dark:bg-blue-900/20 px-1.5 py-1 rounded-md border border-blue-100 truncate">
                              {exames} Exame{exames > 1 ? "s" : ""}
                            </div>
                          )}
                          {(activeTab === "global" || activeTab === "misto") &&
                            retornos > 0 && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-normal bg-amber-50 dark:bg-amber-900/20 px-1.5 py-1 rounded-md border border-amber-100 truncate">
                              {retornos} Retorno{retornos > 1 ? "s" : ""}
                            </div>
                          )}
                          {(activeTab === "pessoal" || activeTab === "misto") &&
                            pessoaisCount > 0 && (
                              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-normal bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-1 rounded-md border border-emerald-100 truncate">
                                {pessoaisCount} Compromisso
                                {pessoaisCount > 1 ? "s" : ""}
                              </div>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modais */}
      <NovoAgendamentoModal
        isOpen={isMarcarConsultaOpen}
        onClose={() => setIsMarcarConsultaOpen(false)}
        preSelectedTime={preSelectedTime}
        currentDate={selectedDate || undefined}
        professionals={professionalOptions}
        onSubmit={handleCreateAppointment}
      />
      </div>
    </div>
  );
}
