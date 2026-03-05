export interface BudgetReportItem {
  id: string;
  patientName: string;
  professionalName: string;
  unit: string;
  creationDate: string;
  expirationDate: string;
  description: string; // List of products/services
  totalValue: number;
  status: "No Prazo" | "Vencido" | "Convertido";
}

export const MOCK_RELATORIO_ORCAMENTOS: BudgetReportItem[] = [
  {
    id: "1",
    patientName: "Juliana Martins",
    professionalName: "Dra. Ana Lima",
    unit: "Central",
    creationDate: "2026-02-10",
    expirationDate: "2026-02-20",
    description: "Toxina Botulínica + Bioestimulador",
    totalValue: 3300.0,
    status: "No Prazo",
  },
  {
    id: "2",
    patientName: "Roberto Carlos",
    professionalName: "Dr. João Santos",
    unit: "Norte",
    creationDate: "2026-02-01",
    expirationDate: "2026-02-11",
    description: "Kit Pós-Cirúrgico",
    totalValue: 250.0,
    status: "No Prazo", // Expires today
  },
  {
    id: "3",
    patientName: "Fernanda Souza",
    professionalName: "Dra. Sofia Castro",
    unit: "Sul",
    creationDate: "2026-01-20",
    expirationDate: "2026-01-30",
    description: "Sessão Laser (Pacote 3 sessões)",
    totalValue: 1050.0,
    status: "Vencido",
  },
  {
    id: "4",
    patientName: "Lucas Mendes",
    professionalName: "Dra. Flávia Alves",
    unit: "Central",
    creationDate: "2026-02-08",
    expirationDate: "2026-02-18",
    description: "Limpeza de Pele + Hidratação",
    totalValue: 350.0,
    status: "No Prazo",
  },
  {
    id: "5",
    patientName: "Patrícia Lima",
    professionalName: "Dr. João Santos",
    unit: "Norte",
    creationDate: "2026-01-15",
    expirationDate: "2026-01-25",
    description: "Preenchimento Labial",
    totalValue: 1200.0,
    status: "Vencido",
  },
  {
    id: "6",
    patientName: "Carlos Pereira",
    professionalName: "Dra. Ana Lima",
    unit: "Sul",
    creationDate: "2026-02-05",
    expirationDate: "2026-02-15",
    description: "Consulta Dermatológica + Retorno",
    totalValue: 400.0,
    status: "No Prazo",
  },
  {
    id: "7",
    patientName: "Mariana Costa",
    professionalName: "Dra. Sofia Castro",
    unit: "Central",
    creationDate: "2026-01-28",
    expirationDate: "2026-02-07",
    description: "Creme Anti-idade + Protetor Solar",
    totalValue: 280.0,
    status: "Vencido",
  },
  {
    id: "8",
    patientName: "Gustavo Oliveira",
    professionalName: "Dra. Flávia Alves",
    unit: "Norte",
    creationDate: "2026-02-09",
    expirationDate: "2026-02-19",
    description: "Harmonização Facial Completa",
    totalValue: 4500.0,
    status: "No Prazo",
  },
  {
    id: "9",
    patientName: "Beatriz Silva",
    professionalName: "Dr. João Santos",
    unit: "Sul",
    creationDate: "2026-01-10",
    expirationDate: "2026-01-20",
    description: "Tratamento Capilar",
    totalValue: 800.0,
    status: "Vencido",
  },
  {
    id: "10",
    patientName: "Amanda Torres",
    professionalName: "Dra. Ana Lima",
    unit: "Central",
    creationDate: "2026-02-11",
    expirationDate: "2026-02-21",
    description: "Peeling Químico",
    totalValue: 300.0,
    status: "No Prazo",
  },
];
