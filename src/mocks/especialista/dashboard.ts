import { Calendar, Users, Clock, TrendingUp } from "lucide-react";

export const MOCK_KPI_DATA = [
  {
    title: "Consultas de Hoje",
    value: "8",
    subtitle: "2 em andamento",
    icon: Calendar,
    trend: "neutral",
  },
  {
    title: "Pacientes Ativos",
    value: "247",
    subtitle: "+12 este mês",
    icon: Users,
    trend: "up",
  },
  {
    title: "Próximas Consultas",
    value: "5",
    subtitle: "Próximas 2 horas",
    icon: Clock,
    trend: "neutral",
  },
  {
    title: "Taxa de Retorno",
    value: "85%",
    subtitle: "+5% este mês",
    icon: TrendingUp,
    trend: "up",
  },
];

export const MOCK_RECENT_PATIENTS = [
  {
    id: 1,
    name: "Maria Silva",
    type: "Consulta de Retorno",
    time: "14:30",
    status: "Concluída",
    initials: "MS",
    initialsBg: "bg-[#0039A6]",
  },
  {
    id: 2,
    name: "João Souza",
    type: "Exame de Rotina",
    time: "15:00",
    status: "Em Andamento",
    initials: "JS",
    initialsBg: "bg-blue-600",
  },
  {
    id: 3,
    name: "Ana Pereira",
    type: "Primeira Consulta",
    time: "13:00",
    status: "Concluída",
    initials: "AP",
    initialsBg: "bg-indigo-600",
  },
  {
    id: 4,
    name: "Carlos Oliveira",
    type: "Retorno",
    time: "11:45",
    status: "Concluída",
    initials: "CO",
    initialsBg: "bg-purple-600",
  },
];
