import {
  LayoutDashboard,
  Users,
  Shield,
  MapPin,
  Calendar,
  Search,
  Clock,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  FileText,
  BarChart2,
  Settings,
  Wallet,
  Stethoscope,
} from "lucide-react";
import { SidebarItem } from "@/components/global/Sidebar";

export const GESTOR_SIDEBAR_ITEMS: SidebarItem[] = [
  // ===== OPERACIONAL =====
  {
    id: "cat-operacional",
    label: "Operacional",
    icon: LayoutDashboard,
    type: "category",
  },
  { id: "inicio", label: "Início", icon: LayoutDashboard },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "pacientes", label: "Pacientes", icon: Search },
  { id: "espera", label: "Lista de Espera", icon: Clock },
  { id: "vendas", label: "Prescrição/Vendas", icon: ShoppingCart },
  { id: "estoque", label: "Estoque por Unidade", icon: Package },

  // ===== CLÍNICO =====
  { id: "cat-clinico", label: "Clínico", icon: Stethoscope, type: "category" },
  { id: "documentacao", label: "Documentação Clínica", icon: FileText },

  // ===== FINANCEIRO =====
  { id: "cat-financeiro", label: "Financeiro", icon: Wallet, type: "category" },
  { id: "financeiro", label: "Financeiro", icon: DollarSign },
  { id: "recebimento", label: "Recebimentos", icon: TrendingUp },
  { id: "pagamento", label: "Pagamentos", icon: TrendingDown },
  { id: "repasse", label: "Repasse", icon: ArrowLeftRight },

  // ===== GESTÃO =====
  { id: "cat-gestao", label: "Gestão", icon: Shield, type: "category" },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "unidades", label: "Unidades", icon: MapPin },
  { id: "permissoes", label: "Permissões", icon: Shield },
  { id: "relatorios", label: "Relatórios Corporativos", icon: BarChart2 },

  // ===== SISTEMA =====
  { id: "cat-sistema", label: "Sistema", icon: Settings, type: "category" },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];
