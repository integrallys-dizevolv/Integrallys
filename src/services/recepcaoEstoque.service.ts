import type { InventaryItem } from "@/mocks/recepcionista/estoque";

export const RECEPCAO_ESTOQUE_ITEMS_KEY = "recepcao_estoque_items_mock_db";
export const RECEPCAO_ESTOQUE_MOVS_KEY = "recepcao_estoque_movs_mock_db";

export interface RecepcaoEstoqueMovimentacao {
  id: string;
  tipo: "entrada" | "saida";
  data: string;
  produto: string;
  quantidade: number;
  detalhe: string;
}

export interface VendaEstoqueItem {
  productName: string;
  quantity: number;
}

const isBrowser = () => typeof window !== "undefined";

const getStatusByQuantity = (
  quantity: number,
  minQuantity: number,
): InventaryItem["status"] => {
  if (quantity <= minQuantity / 2) return "critical";
  if (quantity <= minQuantity) return "low";
  return "available";
};

export const loadRecepcaoEstoqueItems = (): InventaryItem[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(RECEPCAO_ESTOQUE_ITEMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InventaryItem[]) : [];
  } catch {
    return [];
  }
};

export const loadRecepcaoEstoqueMovs = (): RecepcaoEstoqueMovimentacao[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(RECEPCAO_ESTOQUE_MOVS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecepcaoEstoqueMovimentacao[]) : [];
  } catch {
    return [];
  }
};

export const applyVendaBaixaEstoque = (
  items: VendaEstoqueItem[],
  context: { paciente: string; vendedor: string; formaPagamento: string },
) => {
  if (!isBrowser()) return;

  const now = new Date();
  const dateIso = now.toISOString().split("T")[0];
  const estoqueAtual = loadRecepcaoEstoqueItems();
  const movsAtuais = loadRecepcaoEstoqueMovs();
  const nextItems = [...estoqueAtual];
  const nextMovs = [...movsAtuais];

  for (const saleItem of items) {
    const index = nextItems.findIndex(
      (item) => item.name.trim().toLowerCase() === saleItem.productName.trim().toLowerCase(),
    );

    if (index >= 0) {
      const current = nextItems[index];
      const nextQty = Math.max(0, current.quantity - saleItem.quantity);
      nextItems[index] = {
        ...current,
        quantity: nextQty,
        status: getStatusByQuantity(nextQty, current.minQuantity),
      };
    } else {
      nextItems.unshift({
        id: `auto-${Date.now()}-${saleItem.productName}`,
        name: saleItem.productName,
        category: "Prescrição/Vendas",
        quantity: 0,
        minQuantity: 1,
        unit: "unid",
        status: "critical",
      });
    }

    nextMovs.unshift({
      id: `venda-${Date.now()}-${saleItem.productName}`,
      tipo: "saida",
      data: dateIso,
      produto: saleItem.productName,
      quantidade: saleItem.quantity,
      detalhe: `Baixa automática • Paciente: ${context.paciente} • Vendedor: ${context.vendedor} • Forma: ${context.formaPagamento}`,
    });
  }

  window.localStorage.setItem(RECEPCAO_ESTOQUE_ITEMS_KEY, JSON.stringify(nextItems));
  window.localStorage.setItem(RECEPCAO_ESTOQUE_MOVS_KEY, JSON.stringify(nextMovs.slice(0, 1500)));
  window.dispatchEvent(new Event("storage"));
};
