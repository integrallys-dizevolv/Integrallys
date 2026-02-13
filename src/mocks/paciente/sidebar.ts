import {
  Home,
  Calendar,
  History,
  FileText,
  CreditCard,
  Settings,
} from "lucide-react";
import { SidebarItem } from "@/components/global/Sidebar";

export const PATIENT_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "agenda", label: "Minha Agenda", icon: Calendar },
  { id: "historico", label: "Histórico", icon: History },
  { id: "prescricoes", label: "Prescrição/Vendas", icon: FileText },
  { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];
