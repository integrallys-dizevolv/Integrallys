import React, { useMemo, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    CreditCard,
    Filter,
    MoreVertical,
    Calendar,
    Plus,
    DollarSign
} from 'lucide-react';
import { getTodayDate } from '@/utils/dateUtils';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/Table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { MOCK_PAGAMENTOS } from '@/mocks/gestor/pagamentos';
import { MOCK_CATEGORIAS_DRE_FINANCEIRO, MOCK_FORMAS_PAGAMENTO_FINANCEIRO } from '@/mocks/financeiro.mock';

interface PagamentoRow {
    id: string;
    descricao: string;
    fornecedor: string;
    categoria: string;
    valor: string;
    documento: string;
    parcela: string;
    formaPagamento: string;
    dataEmissao: string;
    vencimento: string;
    tipo: 'Fixa' | 'Variavel';
    status: 'À vencer' | 'Atrasado' | 'Pago';
}

export function PagamentosView({ onPageChange }: { onPageChange: (page: string) => void }) {
    const [isNovaDespesaModalOpen, setIsNovaDespesaModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        dataInicio: '',
        dataFim: '',
        fornecedor: '',
        formaPagamento: 'todas'
    });
    const [novaDespesa, setNovaDespesa] = useState({
        dataEmissao: getTodayDate(),
        credor: '',
        descricao: '',
        valor: '',
        formaPagamento: 'Pix',
        parcelamento: '1/1',
        vencimento: getTodayDate(),
        categoria: String(MOCK_CATEGORIAS_DRE_FINANCEIRO[0])
    });

    const parseDate = (value: string) => {
        const [day, month, year] = value.split('/').map(Number);
        return new Date(year, (month || 1) - 1, day || 1);
    };
    const parseIsoDate = (value: string) => {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, (month || 1) - 1, day || 1);
    };
    const valueToNumber = (value: string) => Number(value.replace(/[\D]/g, '')) / 100;

    const filteredData = useMemo(() => {
        return (MOCK_PAGAMENTOS as PagamentoRow[]).filter(item => {
            if (filters.fornecedor && !item.fornecedor.toLowerCase().includes(filters.fornecedor.toLowerCase())) return false;
            if (filters.formaPagamento !== 'todas' && item.formaPagamento.toLowerCase() !== filters.formaPagamento.toLowerCase()) return false;
            if (filters.dataInicio && parseDate(item.vencimento) < parseIsoDate(filters.dataInicio)) return false;
            if (filters.dataFim && parseDate(item.vencimento) > parseIsoDate(filters.dataFim)) return false;
            return true;
        });
    }, [filters]);

    const totalsData = useMemo(() => {
        const hasRange = Boolean(filters.dataInicio || filters.dataFim);
        const today = parseIsoDate(getTodayDate());
        return (MOCK_PAGAMENTOS as PagamentoRow[]).filter(item => {
            if (filters.fornecedor && !item.fornecedor.toLowerCase().includes(filters.fornecedor.toLowerCase())) return false;
            if (filters.formaPagamento !== 'todas' && item.formaPagamento.toLowerCase() !== filters.formaPagamento.toLowerCase()) return false;
            if (hasRange) {
                if (filters.dataInicio && parseDate(item.vencimento) < parseIsoDate(filters.dataInicio)) return false;
                if (filters.dataFim && parseDate(item.vencimento) > parseIsoDate(filters.dataFim)) return false;
                return true;
            }
            const itemDate = parseDate(item.vencimento);
            return itemDate.toDateString() === today.toDateString();
        });
    }, [filters]);

    const totals = useMemo(() => {
        const totalAVencer = totalsData.filter(t => t.status === 'À vencer').reduce((acc, t) => acc + valueToNumber(t.valor), 0);
        const totalPago = totalsData.filter(t => t.status === 'Pago').reduce((acc, t) => acc + valueToNumber(t.valor), 0);
        const totalAtrasado = totalsData.filter(t => t.status === 'Atrasado').reduce((acc, t) => acc + valueToNumber(t.valor), 0);
        return { totalAVencer, totalPago, totalAtrasado };
    }, [totalsData]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'À vencer': return <span className="px-3 py-1 rounded-full text-[10px] font-normal text-white shadow-sm bg-orange-600 dark:bg-amber-900/40 dark:text-amber-100 uppercase">À vencer</span>;
            case 'Atrasado': return <span className="px-3 py-1 rounded-full text-[10px] font-normal text-white shadow-sm bg-red-600 dark:bg-red-900/40 dark:text-red-100 uppercase">Atrasado</span>;
            case 'Pago': return <span className="px-3 py-1 rounded-full text-[10px] font-normal text-white shadow-sm bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 uppercase">Pago</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 font-normal">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange('inicio')}
                            className="text-sm font-normal text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange('financeiro')}
                            className="text-sm font-normal text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Financeiro
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Pagamentos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'À vencer', value: `R$ ${totals.totalAVencer.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'Em aberto', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                    { title: 'Liquidado', value: `R$ ${totals.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'Pagos no período', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                    { title: 'Atrasado', value: `R$ ${totals.totalAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'Pagamentos vencidos', icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
                ].map((kpi, i) => (
                    <div key={i} className="p-8 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark shadow-sm rounded-[24px] flex flex-col justify-between hover:shadow-md transition-all duration-300 group h-[210px]">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <p className="text-sm font-normal text-app-text-secondary dark:text-white/80">{kpi.title}</p>
                                <h3 className="text-3xl font-normal text-[#0039A6] dark:text-white mt-1 tracking-tight">{kpi.value}</h3>
                                <p className="text-xs text-app-text-muted font-normal">{kpi.sub}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${kpi.bg}`}>
                                <kpi.icon size={24} className={kpi.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-app-card dark:bg-app-bg-dark rounded-[24px] border border-app-border dark:border-app-border-dark shadow-premium overflow-hidden">
                <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-gray-50 dark:border-app-border-dark">
                    <div>
                        <h2 className="text-xl font-normal text-app-text-primary dark:text-white">Pagamentos</h2>
                        <p className="text-app-text-muted text-sm font-normal">Liquidado e em aberto à vencer.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsFilterModalOpen(true)} className="h-11 px-6 rounded-xl border border-app-border dark:border-app-border-dark text-app-text-secondary dark:text-white/80 font-normal text-sm hover:bg-app-bg-secondary dark:hover:bg-app-card/5 transition-all flex items-center justify-center gap-2"><Filter size={18} /> Filtros</button>
                        <button onClick={() => setIsNovaDespesaModalOpen(true)} className="h-11 px-6 rounded-xl bg-[#0039A6] hover:bg-[#15251f] text-white font-normal text-sm shadow-sm transition-all flex items-center justify-center gap-2"><Plus size={18} /> Nova despesa</button>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-app-table-header dark:bg-app-table-header-dark border-b border-app-border dark:border-app-border-dark">
                            <TableRow className="hover:bg-transparent">
                                {['Descrição', 'Fornecedor', 'Documento', 'Parcela', 'Valor', 'Emissão', 'Vencimento', 'Forma', 'Status', 'Ações'].map(h => (
                                    <TableHead key={h} className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((row) => (
                                <TableRow key={row.id} className="border-b border-app-border dark:border-app-border-dark hover:bg-app-table-header dark:hover:bg-app-card/5 transition-colors">
                                    <TableCell className="px-6 py-5"><span className="text-sm font-normal text-app-text-secondary dark:text-white/80">{row.descricao}</span></TableCell>
                                    <TableCell className="px-6 py-5"><span className="text-xs text-app-text-muted font-normal uppercase">{row.fornecedor}</span></TableCell>
                                    <TableCell className="px-6 py-5 text-sm font-normal text-app-text-secondary dark:text-white/80">{row.documento}</TableCell>
                                    <TableCell className="px-6 py-5 text-sm font-normal text-app-text-secondary dark:text-white/80">{row.parcela}</TableCell>
                                    <TableCell className="px-6 py-5 text-sm font-normal text-app-text-secondary dark:text-white/80">{row.valor}</TableCell>
                                    <TableCell className="px-6 py-5"><div className="flex items-center gap-2 text-xs text-app-text-muted font-normal"><Calendar size={14} className="text-app-text-muted" /> {row.dataEmissao}</div></TableCell>
                                    <TableCell className="px-6 py-5"><div className="flex items-center gap-2 text-xs text-app-text-muted font-normal"><Calendar size={14} className="text-app-text-muted" /> {row.vencimento}</div></TableCell>
                                    <TableCell className="px-6 py-5 text-sm font-normal text-app-text-secondary dark:text-white/80">{row.formaPagamento}</TableCell>
                                    <TableCell className="px-6 py-5">{getStatusBadge(row.status)}</TableCell>
                                    <TableCell className="px-6 py-5 text-right font-normal">
                                        <button className="h-9 w-9 flex items-center justify-center rounded-lg text-app-text-muted hover:text-[#0039A6] transition-all"><MoreVertical size={18} /></button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isNovaDespesaModalOpen} onOpenChange={setIsNovaDespesaModalOpen}>
                <DialogContent className="max-w-[720px] w-full p-0 overflow-hidden rounded-[32px] border-none bg-app-card dark:bg-app-bg-dark shadow-2xl">
                    <DialogHeader className="px-10 pt-10 pb-6 bg-app-table-header dark:bg-app-table-header-dark">
                        <DialogTitle className="text-2xl font-normal text-[#0039A6] dark:text-white uppercase tracking-widest">Nova despesa</DialogTitle>
                        <DialogDescription className="text-sm text-app-text-muted">Preencha os dados para registrar a despesa.</DialogDescription>
                    </DialogHeader>
                    <div className="px-10 py-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Data de emissão</label>
                                <Input type="date" value={novaDespesa.dataEmissao} onChange={(e) => setNovaDespesa({ ...novaDespesa, dataEmissao: e.target.value })} className="h-12 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Credor</label>
                                <Input value={novaDespesa.credor} onChange={(e) => setNovaDespesa({ ...novaDespesa, credor: e.target.value })} className="h-12 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal dark:text-white" placeholder="Nome do fornecedor" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Descrição</label>
                                <Input value={novaDespesa.descricao} onChange={(e) => setNovaDespesa({ ...novaDespesa, descricao: e.target.value })} className="h-12 bg-app-bg-secondary dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal dark:text-white" placeholder="Ex: Manutenção de equipamentos" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Valor</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                    <Input type="number" min="0" step="0.01" value={novaDespesa.valor} onChange={(e) => setNovaDespesa({ ...novaDespesa, valor: e.target.value })} className="h-12 pl-12 pr-4 bg-app-bg-secondary dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal dark:text-white" placeholder="0,00" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Forma de pagamento</label>
                                <Select value={novaDespesa.formaPagamento} onValueChange={(value) => setNovaDespesa({ ...novaDespesa, formaPagamento: value })}>
                                    <SelectTrigger className="h-12 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_FORMAS_PAGAMENTO_FINANCEIRO.map((forma) => (
                                            <SelectItem key={forma} value={forma}>{forma}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Parcelamento</label>
                                <Select
                                    value={novaDespesa.parcelamento}
                                    onValueChange={(value) => {
                                        if (novaDespesa.formaPagamento !== 'Crédito') return
                                        setNovaDespesa({ ...novaDespesa, parcelamento: value })
                                    }}
                                >
                                    <SelectTrigger className={`h-12 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal ${novaDespesa.formaPagamento !== 'Crédito' ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((parcela) => (
                                            <SelectItem key={parcela} value={`1/${parcela}`}>{`1/${parcela}`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Data de vencimento</label>
                                <Input type="date" value={novaDespesa.vencimento} onChange={(e) => setNovaDespesa({ ...novaDespesa, vencimento: e.target.value })} className="h-12 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Categoria (DRE)</label>
                                <Select value={novaDespesa.categoria} onValueChange={(value) => setNovaDespesa({ ...novaDespesa, categoria: value })}>
                                    <SelectTrigger className="h-12 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_CATEGORIAS_DRE_FINANCEIRO.map((categoria) => (
                                            <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="px-10 py-8 bg-app-table-header dark:bg-app-table-header-dark flex gap-4">
                        <button onClick={() => setIsNovaDespesaModalOpen(false)} className="flex-1 h-12 font-normal uppercase tracking-widest text-[10px] text-app-text-muted rounded-xl">Cancelar</button>
                        <button className="flex-1 h-12 bg-[#0039A6] text-white font-normal uppercase tracking-widest text-[10px] rounded-xl shadow-premium">Salvar despesa</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                <DialogContent className="max-w-[520px] w-full p-0 overflow-hidden rounded-[32px] border-none bg-app-card dark:bg-app-bg-dark shadow-2xl">
                    <DialogHeader className="px-10 pt-10 pb-6">
                        <DialogTitle className="text-2xl font-normal text-[#0039A6] dark:text-white uppercase tracking-widest">Filtros avançados</DialogTitle>
                        <DialogDescription className="text-sm text-app-text-muted">Filtre por período, fornecedor e forma de pagamento.</DialogDescription>
                    </DialogHeader>
                    <div className="px-10 py-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Período inicial</label>
                                <Input type="date" value={filters.dataInicio} onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })} className="h-11 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Período final</label>
                                <Input type="date" value={filters.dataFim} onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })} className="h-11 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal dark:text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Fornecedor</label>
                            <Input value={filters.fornecedor} onChange={(e) => setFilters({ ...filters, fornecedor: e.target.value })} className="h-11 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal dark:text-white" placeholder="Nome do fornecedor" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-normal text-app-text-muted uppercase tracking-widest ml-1">Forma de pagamento</label>
                            <Select value={filters.formaPagamento} onValueChange={(value) => setFilters({ ...filters, formaPagamento: value })}>
                                <SelectTrigger className="h-11 bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-xs font-normal">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas as formas</SelectItem>
                                    <SelectItem value="pix">PIX</SelectItem>
                                    <SelectItem value="debito">Cartão de débito</SelectItem>
                                    <SelectItem value="credito">Cartão de crédito</SelectItem>
                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                    <SelectItem value="boleto">Boleto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="p-10 flex gap-4">
                        <button onClick={() => setFilters({ dataInicio: '', dataFim: '', fornecedor: '', formaPagamento: 'todas' })} className="w-full h-12 border border-app-border dark:border-app-border-dark text-app-text-muted font-normal uppercase tracking-widest text-[10px] rounded-xl">Limpar</button>
                        <button onClick={() => setIsFilterModalOpen(false)} className="w-full h-12 bg-[#0039A6] text-white font-normal uppercase tracking-widest text-[10px] rounded-xl shadow-premium">Aplicar filtros</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
