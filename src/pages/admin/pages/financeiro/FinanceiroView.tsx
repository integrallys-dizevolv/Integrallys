import { useState } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { X, AlertTriangle } from 'lucide-react';
import {
  EstornarLancamentoModal,
  ComprovanteLancamentoModal,
  VisualizarLancamentoModal,
  EditarLancamentoModal
} from './modals';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';

// Sub-Views
import { LancamentosView } from './pages/LancamentosView';
import { CaixaView } from './pages/CaixaView';
import { DreView } from './pages/DreView';
import { RecebimentosView } from './pages/RecebimentosView';
import { PagamentosView } from './pages/PagamentosView';
import type {
  DreItem,
  FinanceiroAccount,
  FinanceiroDailyMovement,
  FinanceiroTransaction,
} from '@/types/financeiro';
import {
  MOCK_ACCOUNTS,
  MOCK_DAILY_MOVEMENTS,
  MOCK_DRE_ITEMS,
  MOCK_TRANSACTIONS,
} from '@/mocks/admin/financeiro';

interface FinanceiroViewProps {
  setCurrentPage?: (page: string) => void;
  transactions?: FinanceiroTransaction[];
  accounts?: FinanceiroAccount[];
  dailyMovements?: FinanceiroDailyMovement[];
  dreItems?: DreItem[];
  loading?: boolean;
  error?: string | null;
}

export function FinanceiroView({
  setCurrentPage,
  transactions = MOCK_TRANSACTIONS,
  accounts = MOCK_ACCOUNTS,
  dailyMovements = MOCK_DAILY_MOVEMENTS,
  dreItems = MOCK_DRE_ITEMS,
  loading = false,
  error = null,
}: FinanceiroViewProps) {
  const [financeTab, setFinanceTab] = useState('recebimentos');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<FinanceiroTransaction | FinanceiroDailyMovement | null>(null);
  const [naturezaLancamento, setNaturezaLancamento] = useState<'entrada' | 'saida'>('entrada');
  const [metodoPagamentoNovo, setMetodoPagamentoNovo] = useState('');
  const [cartaoEmpresarialNovo, setCartaoEmpresarialNovo] = useState({
    bandeira: '',
    final: '',
    titular: '',
    fechamento: '',
    vencimento: '',
  });

  const closeModal = () => {
    setActiveModal(null);
    setMetodoPagamentoNovo('');
    setCartaoEmpresarialNovo({ bandeira: '', final: '', titular: '', fechamento: '', vencimento: '' });
  };

  const openModal = (
    type: string,
    transaction?: FinanceiroTransaction | FinanceiroDailyMovement,
    defaultNatureza?: 'entrada' | 'saida',
  ) => {
    // Garante que qualquer outro modal seja "fechado" ao trocar o tipo ativo
    // e limpa a transação antes de setar a nova
    setSelectedTransaction(transaction || null);

    if (transaction) {
      setNaturezaLancamento(transaction.tipo.toLowerCase() === 'entrada' ? 'entrada' : 'saida');
    } else if (defaultNatureza) {
      setNaturezaLancamento(defaultNatureza);
    } else {
      setNaturezaLancamento('entrada');
    }

    setActiveModal(type);
  };

  const isFinanceiroTransaction = (
    item: FinanceiroTransaction | FinanceiroDailyMovement | null,
  ): item is FinanceiroTransaction => {
    return !!item && 'valorTotal' in item;
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setCurrentPage?.('inicio')} className="cursor-pointer hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Financeiro</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <SegmentedControl
        options={[
          { value: 'recebimentos', label: 'Recebimentos' },
          { value: 'pagamentos', label: 'Pagamentos' },
          { value: 'lancamentos', label: 'Lançamentos' },
          { value: 'caixa', label: 'Caixa' },
          { value: 'dre', label: 'DRE' },
        ]}
        value={financeTab}
        onChange={setFinanceTab}
      />

      {financeTab === 'recebimentos' && (
        <RecebimentosView
          openModal={(type, t) => openModal(type, t, 'entrada')}
          transactions={transactions}
          loading={loading}
        />
      )}
      {financeTab === 'pagamentos' && (
        <PagamentosView
          openModal={(type, t) => openModal(type, t, 'saida')}
          transactions={transactions}
          loading={loading}
        />
      )}
      {financeTab === 'lancamentos' && (
        <LancamentosView openModal={openModal} transactions={transactions} loading={loading} />
      )}
      {financeTab === 'caixa' && (
        <CaixaView
          openModal={openModal}
          accounts={accounts}
          dailyMovements={dailyMovements}
          loading={loading}
        />
      )}
      {financeTab === 'dre' && (
        <DreView dreItemsSource={dreItems} loading={loading} />
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <Dialog open={!!activeModal && ['delete', 'abrircaixa', 'suprimento', 'sangria', 'fecharcaixa', 'novo'].includes(activeModal)} onOpenChange={closeModal}>
        <DialogContent className={`p-0 overflow-hidden border-none rounded-2xl sm:max-h-[90vh] custom-scrollbar ${['delete', 'abrircaixa', 'suprimento', 'sangria', 'fecharcaixa'].includes(activeModal || '') ? 'sm:max-w-[500px]' : 'sm:max-w-[700px]'}`}>
          {activeModal === 'delete' ? (
            <div className="bg-app-card dark:bg-app-bg-dark rounded-2xl overflow-hidden">
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-xl font-normal text-red-600 ">Excluir</DialogTitle>
                    <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">Esta ação não pode ser desfeita.</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 pb-6 space-y-4">
                <p className="text-sm text-[#334155] dark:text-white/80 font-normal mt-2">Deseja realmente excluir o lançamento "<span className="font-normal text-app-text-primary dark:text-white underline underline-offset-4 decoration-red-500/30">{selectedTransaction?.descricao}</span>"?</p>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={closeModal} className="rounded-xl h-11 px-6 font-normal text-sm">Cancelar</Button>
                  <Button onClick={closeModal} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 px-8 font-normal text-sm">Excluir</Button>
                </div>
              </div>
            </div>
          ) : activeModal === 'abrircaixa' ? (
            <div className="bg-app-card dark:bg-app-bg-dark flex flex-col rounded-2xl overflow-hidden relative">
              <Button variant="ghost" size="icon" onClick={closeModal} className="absolute right-4 top-4 text-app-text-muted z-10"><X size={20} /></Button>
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#0039A6]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#0039A6]" />
                  </div>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white ">Abrir caixa</DialogTitle>
                    <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">Informe o saldo inicial para começar</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-4 mt-2">
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Unidade</Label>
                    <Select defaultValue="central">
                      <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl text-sm font-normal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central" className="font-normal text-sm">Clínica Central</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Saldo inicial (dinheiro)</Label>
                    <Input placeholder="R$ 0,00" className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Observações</Label>
                    <Textarea placeholder="Informações adicionais" className="min-h-[80px] bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={closeModal} className="rounded-xl h-11 px-6 font-normal text-sm">Cancelar</Button>
                  <Button onClick={closeModal} className="bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl h-11 px-8 font-normal text-sm">Abrir caixa</Button>
                </div>
              </div>
            </div>
          ) : activeModal === 'suprimento' ? (
            <div className="bg-app-card dark:bg-app-bg-dark flex flex-col rounded-2xl overflow-hidden relative">
              <Button variant="ghost" size="icon" onClick={closeModal} className="absolute right-4 top-4 text-app-text-muted z-10"><X size={20} /></Button>
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#0039A6]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#0039A6]" />
                  </div>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white ">Suprimento</DialogTitle>
                    <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">Adicione saldo ao caixa</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-4 mt-2">
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Valor do suprimento</Label>
                    <Input placeholder="R$ 0,00" className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Motivo / descrição</Label>
                    <Textarea placeholder="Ex: Troco inicial..." className="min-h-[80px] bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={closeModal} className="rounded-xl h-11 px-6 font-normal text-sm">Cancelar</Button>
                  <Button onClick={closeModal} className="bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl h-11 px-8 font-normal text-sm">Confirmar</Button>
                </div>
              </div>
            </div>
          ) : activeModal === 'sangria' ? (
            <div className="bg-app-card dark:bg-app-bg-dark flex flex-col rounded-2xl overflow-hidden relative">
              <Button variant="ghost" size="icon" onClick={closeModal} className="absolute right-4 top-4 text-app-text-muted z-10"><X size={20} /></Button>
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white ">Sangria</DialogTitle>
                    <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">Retirada de valores</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-4 mt-2">
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Valor da sangria</Label>
                    <Input placeholder="R$ 0,00" className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Destino / motivo</Label>
                    <Textarea placeholder="Ex: Depósito bancário..." className="min-h-[80px] bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={closeModal} className="rounded-xl h-11 px-6 font-normal text-sm">Cancelar</Button>
                  <Button onClick={closeModal} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 px-8 font-normal text-sm">Confirmar</Button>
                </div>
              </div>
            </div>
          ) : activeModal === 'fecharcaixa' ? (
            <div className="bg-app-card dark:bg-app-bg-dark flex flex-col rounded-2xl overflow-hidden relative">
              <Button variant="ghost" size="icon" onClick={closeModal} className="absolute right-4 top-4 text-app-text-muted z-10"><X size={20} /></Button>
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#0039A6]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#0039A6]" />
                  </div>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white ">Fechar caixa</DialogTitle>
                    <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">Encerramento da sessão</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark">
                      <p className="text-[10px] text-[#64748B] dark:text-app-text-muted mb-0.5 r font-normal">Entradas</p>
                      <p className="text-base font-normal text-green-600">R$ 470,00</p>
                    </div>
                    <div className="p-3 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark">
                      <p className="text-[10px] text-[#64748B] dark:text-app-text-muted mb-0.5 r font-normal">Saídas</p>
                      <p className="text-base font-normal text-red-600">R$ 500,00</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Conferência física</Label>
                    <Input placeholder="Valor contado" className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={closeModal} className="rounded-xl h-11 px-6 font-normal text-sm">Cancelar</Button>
                  <Button onClick={closeModal} className="bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl h-11 px-8 font-normal text-sm">Fechar caixa</Button>
                </div>
              </div>
            </div>
          ) : activeModal === 'novo' ? (
            <div className="bg-app-card dark:bg-app-bg-dark flex flex-col rounded-2xl overflow-hidden relative">
              <Button variant="ghost" size="icon" onClick={closeModal} className="absolute right-4 top-4 text-app-text-muted z-10 font-normal"><X size={20} /></Button>
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#0039A6]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#0039A6]" />
                  </div>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white ">Novo lançamento</DialogTitle>
                    <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">Registre uma nova movimentação</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-1.5 mt-2 leading-none">
                  <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Natureza</Label>
                  <div className="flex gap-2 p-1 bg-app-bg-secondary/50 dark:bg-app-card/5 rounded-xl border border-gray-100 dark:border-app-border-dark">
                    <Button
                      variant={naturezaLancamento === 'entrada' ? 'primary' : 'ghost'}
                      className={`flex-1 rounded-lg h-9 font-normal text-xs ${naturezaLancamento === 'entrada' ? 'bg-[#0039A6] text-white' : ''}`}
                      onClick={() => setNaturezaLancamento('entrada')}
                    >
                      Entrada
                    </Button>
                    <Button
                      variant={naturezaLancamento === 'saida' ? 'primary' : 'ghost'}
                      className={`flex-1 rounded-lg h-9 font-normal text-xs ${naturezaLancamento === 'saida' ? 'bg-red-600 text-white' : ''}`}
                      onClick={() => setNaturezaLancamento('saida')}
                    >
                      Saída
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Unidade</Label>
                    <Select>
                      <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl text-sm font-normal">
                        <SelectValue preferPlaceholder placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central" className="font-normal text-sm">Clínica Central</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Categoria</Label>
                    <Select>
                      <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl text-sm font-normal">
                        <SelectValue preferPlaceholder placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulta" className="font-normal text-sm">Consulta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5 leading-none">
                  <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Descrição</Label>
                  <Input placeholder="Descreva o lançamento" className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Valor total</Label>
                    <Input placeholder="R$ 0,00" className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                  <div className="space-y-1.5 leading-none">
                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Data</Label>
                    <Input type="date" className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                  </div>
                </div>

                <div className="space-y-1.5 leading-none">
                  <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Método de pagamento</Label>
                  <Select value={metodoPagamentoNovo} onValueChange={setMetodoPagamentoNovo}>
                    <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl text-sm font-normal">
                      <SelectValue preferPlaceholder placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix" className="font-normal text-sm">PIX</SelectItem>
                      <SelectItem value="cartao-empresarial" className="font-normal text-sm">Cartão de crédito empresarial</SelectItem>
                      <SelectItem value="boleto" className="font-normal text-sm">Boleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {metodoPagamentoNovo === 'cartao-empresarial' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-xl border border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-app-card/5">
                    <div className="space-y-1.5 leading-none">
                      <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Bandeira</Label>
                      <Input
                        placeholder="Ex: Visa Business"
                        value={cartaoEmpresarialNovo.bandeira}
                        onChange={(e) => setCartaoEmpresarialNovo((prev) => ({ ...prev, bandeira: e.target.value }))}
                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 leading-none">
                      <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Final do cartão</Label>
                      <Input
                        placeholder="0000"
                        value={cartaoEmpresarialNovo.final}
                        onChange={(e) => setCartaoEmpresarialNovo((prev) => ({ ...prev, final: e.target.value }))}
                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 leading-none md:col-span-2">
                      <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Titular corporativo</Label>
                      <Input
                        placeholder="Razão social"
                        value={cartaoEmpresarialNovo.titular}
                        onChange={(e) => setCartaoEmpresarialNovo((prev) => ({ ...prev, titular: e.target.value }))}
                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 leading-none">
                      <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Fechamento da fatura</Label>
                      <Input
                        placeholder="Dia 10"
                        value={cartaoEmpresarialNovo.fechamento}
                        onChange={(e) => setCartaoEmpresarialNovo((prev) => ({ ...prev, fechamento: e.target.value }))}
                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 leading-none">
                      <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Vencimento da fatura</Label>
                      <Input
                        placeholder="Dia 20"
                        value={cartaoEmpresarialNovo.vencimento}
                        onChange={(e) => setCartaoEmpresarialNovo((prev) => ({ ...prev, vencimento: e.target.value }))}
                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 leading-none">
                  <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted ">Observações</Label>
                  <Textarea placeholder="Informações adicionais" className="min-h-[80px] bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm" />
                </div>

                <DialogFooter className="pt-2 gap-3">
                  <Button variant="outline" onClick={closeModal} className="w-full sm:flex-1 h-11 rounded-xl font-normal text-[#64748B] dark:text-white/80 border-app-border dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-card/5 text-sm">Cancelar</Button>
                  <Button onClick={closeModal} className="w-full sm:flex-1 h-11 bg-[#0039A6] hover:bg-[#1a3329] text-white rounded-xl shadow-lg shadow-[#0039A6]/10 font-normal text-sm">Salvar</Button>
                </DialogFooter>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <VisualizarLancamentoModal
        isOpen={activeModal === 'visualizar'}
        onClose={closeModal}
        transaction={selectedTransaction}
      />
      <EditarLancamentoModal
        isOpen={activeModal === 'edit_caixa'}
        onClose={closeModal}
        onSave={(t: FinanceiroTransaction) => {
          void t
          toast.success('Lançamento atualizado com sucesso!')
        }}
        transaction={isFinanceiroTransaction(selectedTransaction) ? selectedTransaction : null}
      />
      <ComprovanteLancamentoModal
        isOpen={activeModal === 'comprovante'}
        onClose={closeModal}
        transaction={selectedTransaction}
      />
      <EstornarLancamentoModal
        isOpen={activeModal === 'estornar'}
        onClose={closeModal}
        onConfirm={(id: number) => {
          void id
          toast.success('Lançamento estornado com sucesso!')
        }}
        transaction={selectedTransaction}
      />
    </div>
  );
}
