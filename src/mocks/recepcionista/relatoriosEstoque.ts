export interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  stockType: "Suprimentos" | "Prescricao/Vendas";
  unit: string;
  quantity: number;
  minQuantity: number;
  batch: string;
  expirationDate: string;
  costPrice: number;
  status: "Em Estoque" | "Baixo Estoque" | "Sem Estoque" | "Vencido";
}

export interface InventoryMovement {
  id: string;
  type: "Entrada" | "Saida";
  stockType: "Suprimentos" | "Prescricao/Vendas";
  origin: "Procedimento Pago" | "Prescricao/Venda" | "Entrada Manual";
  procedureName?: string;
  date: string;
  time: string;
  unit: string;
  userName: string;
  productName: string;
  quantity: number;
  costPrice: number;
  // Entrada specific
  invoiceNumber?: string;
  supplier?: string;
  // Saida specific
  clientName?: string;
}

export const MOCK_ESTOQUE_SALDO: InventoryItem[] = [
  {
    id: "1",
    productName: "Toxina Botulinica Tipo A 50U",
    category: "Toxinas",
    stockType: "Suprimentos",
    unit: "Central",
    quantity: 15,
    minQuantity: 10,
    batch: "TX2024001",
    expirationDate: "2026-03-31",
    costPrice: 600.0,
    status: "Em Estoque",
  },
  {
    id: "2",
    productName: "Acido Hialuronico Voluma",
    category: "Preenchedores",
    stockType: "Suprimentos",
    unit: "Central",
    quantity: 8,
    minQuantity: 15,
    batch: "AH2024055",
    expirationDate: "2026-02-20",
    costPrice: 450.0,
    status: "Baixo Estoque",
  },
  {
    id: "3",
    productName: "Kit Pos-Procedimento",
    category: "Kits",
    stockType: "Suprimentos",
    unit: "Sul",
    quantity: 0,
    minQuantity: 5,
    batch: "KP2023099",
    expirationDate: "2027-01-15",
    costPrice: 120.0,
    status: "Sem Estoque",
  },
  {
    id: "4",
    productName: "Fios de PDO (Specules)",
    category: "Fios",
    stockType: "Suprimentos",
    unit: "Norte",
    quantity: 50,
    minQuantity: 20,
    batch: "PDO2024101",
    expirationDate: "2026-03-01",
    costPrice: 80.0,
    status: "Vencido",
  },
  {
    id: "5",
    productName: "Anestesico Topico 30g",
    category: "Medicamentos",
    stockType: "Prescricao/Vendas",
    unit: "Central",
    quantity: 25,
    minQuantity: 10,
    batch: "AN2026002",
    expirationDate: "2026-03-30",
    costPrice: 45.0,
    status: "Em Estoque",
  },
];

export const MOCK_ESTOQUE_MOVIMENTACAO: InventoryMovement[] = [
  {
    id: "1",
    type: "Entrada",
    stockType: "Suprimentos",
    origin: "Entrada Manual",
    date: "2026-02-11",
    time: "08:30",
    unit: "Central",
    userName: "Ana Gerente",
    productName: "Toxina Botulinica Tipo A 50U",
    quantity: 10,
    costPrice: 600.0,
    invoiceNumber: "NF-102030",
    supplier: "Allergan Distribuidora",
  },
  {
    id: "2",
    type: "Saida",
    stockType: "Suprimentos",
    origin: "Procedimento Pago",
    procedureName: "Consulta Inicial",
    date: "2026-02-11",
    time: "09:45",
    unit: "Central",
    userName: "Beatriz Recepcionista",
    productName: "Toxina Botulinica Tipo A 50U",
    quantity: 1,
    costPrice: 600.0,
    clientName: "Juliana Martins",
  },
  {
    id: "3",
    type: "Entrada",
    stockType: "Suprimentos",
    origin: "Entrada Manual",
    date: "2026-02-10",
    time: "14:00",
    unit: "Norte",
    userName: "Carla Gerente",
    productName: "Kit Pos-Procedimento",
    quantity: 20,
    costPrice: 120.0,
    invoiceNumber: "NF-554433",
    supplier: "Dermocosmeticos Ltda",
  },
  {
    id: "4",
    type: "Saida",
    stockType: "Prescricao/Vendas",
    origin: "Prescricao/Venda",
    date: "2026-02-10",
    time: "16:20",
    unit: "Norte",
    userName: "Carla Recepcionista",
    productName: "Kit Pos-Procedimento",
    quantity: 2,
    costPrice: 120.0,
    clientName: "Lucas Mendes",
  },
  {
    id: "5",
    type: "Saida",
    stockType: "Suprimentos",
    origin: "Procedimento Pago",
    procedureName: "Sessao de Fisioterapia",
    date: "2026-02-09",
    time: "10:15",
    unit: "Sul",
    userName: "Ana Recepcionista",
    productName: "Anestesico Topico 30g",
    quantity: 1,
    costPrice: 45.0,
    clientName: "Uso em Gabinete (Dra. Sofia)",
  },
];
