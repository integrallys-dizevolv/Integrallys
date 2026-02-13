import { useState, useRef, useEffect } from 'react';
import { getTodayDate } from '@/utils/dateUtils';
import {
    MoreVertical, Eye, Edit, Trash2, TrendingDown, Clock, Plus, Receipt
} from 'lucide-react';
import { FinanceiroStatCard } from '../../../components/ui/FinanceiroStatCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { MOCK_TRANSACTIONS } from '@/mocks/admin/financeiro';

interface Transaction {
    id: number;
    data: string;
    tipo: string;
    unidade: string;
    descricao: string;
    categoria: string;
    valorTotal: number;
    valorPago: number;
    saldo: number;
    forma: string;
    status: string;
    [key: string]: string | number | boolean | undefined | null;
}

interface PagamentosViewProps {
    openModal: (type: string, transaction?: Transaction) => void;
}

export function PagamentosView({ openModal }: PagamentosViewProps) {
    const [filters, setFilters] = useState(() => {
        const today = getTodayDate();
        return {
            dataInicial: today,
            dataFinal: today,
            status: 'todos', // todos, liquidado, a_pagar
            unidade: 'todas',
        };
    });
    const filtersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
                const activeElement = document.activeElement;
                if (activeElement instanceof HTMLInputElement && activeElement.type === 'date') {
                    activeElement.blur();
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Filtrar apenas SAÍDAS para a view de Pagamentos/Despesas
    const pagamentos = MOCK_TRANSACTIONS.filter(t => t.tipo === 'Saída');

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
        switch (status) {
            case 'Quitado': case 'Pago': return 'default';
            case 'Parcial': return 'secondary';
            case 'Pendente': return 'destructive';
            default: return 'outline';
        }
    }

    const getStatusLabel = (status: string) => {
        if (status === 'Pendente' || status === 'Parcial') return 'A Pagar';
        if (status === 'Pago' || status === 'Quitado') return 'Liquidado';
        return status;
    }

    return (
        <div className="space-y-6">
            <Card ref={filtersRef} className="border border-gray-100 dark:border-app-border-dark shadow-sm mb-6">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                            <div className="space-y-1.5 focus-within:z-50 relative">
                                <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Data inicial</Label>
                                <input
                                    type="date"
                                    value={filters.dataInicial}
                                    onChange={(e) => updateFilter('dataInicial', e.target.value)}
                                    className="w-full h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-lg text-sm font-normal text-app-text-primary dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#0039A6]/10 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5 focus-within:z-50 relative">
                                <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Data final</Label>
                                <input
                                    type="date"
                                    value={filters.dataFinal}
                                    onChange={(e) => updateFilter('dataFinal', e.target.value)}
                                    className="w-full h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-lg text-sm font-normal text-app-text-primary dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#0039A6]/10 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Status</Label>
                                <Select value={filters.status} onValueChange={(v) => updateFilter('status', v)}>
                                    <SelectTrigger className="h-11 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-lg text-sm font-normal text-app-text-primary dark:text-white/80">
                                        <SelectValue preferPlaceholder placeholder="Todos os status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os status</SelectItem>
                                        <SelectItem value="liquidado">Liquidado</SelectItem>
                                        <SelectItem value="a_pagar">A Pagar / Pendente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Unidade</Label>
                                <Select value={filters.unidade} onValueChange={(v) => updateFilter('unidade', v)}>
                                    <SelectTrigger className="h-11 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-lg text-sm font-normal text-app-text-primary dark:text-white/80">
                                        <SelectValue preferPlaceholder placeholder="Todas as unidades">
                                            {filters.unidade === 'todas' ? 'Todas as unidades' : 'Clínica Central'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas as unidades</SelectItem>
                                        <SelectItem value="central">Clínica Central</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2">
                            <Button
                                variant="outline"
                                className="h-11 px-4 border-app-border dark:border-app-border-dark rounded-lg text-sm font-normal text-app-text-primary dark:text-white/80"
                                onClick={() => setFilters({
                                    dataInicial: '',
                                    dataFinal: '',
                                    status: 'todos',
                                    unidade: 'todas',
                                })}
                            >
                                Limpar
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openModal('novo');
                                }}
                                className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 shadow-sm shrink-0 whitespace-nowrap"
                            >
                                <Plus className="h-4 w-4" />
                                Nova Despesa
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FinanceiroStatCard
                    label="Pago no período"
                    value="R$ 12.850,00"
                    sub="Total liquidado"
                    color="text-red-600"
                    icon={TrendingDown}
                    iconColor="text-red-500"
                />
                <FinanceiroStatCard
                    label="A pagar"
                    value="R$ 850,00"
                    sub="Total a pagar"
                    color="text-amber-600"
                    icon={Clock}
                    iconColor="text-amber-500"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[150px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Vencimento</TableHead>
                                    <TableHead className="min-w-[150px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Unidade</TableHead>
                                    <TableHead className="min-w-[200px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Descrição/Fornecedor</TableHead>
                                    <TableHead className="min-w-[120px] text-right text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Valor Total</TableHead>
                                    <TableHead className="min-w-[120px] text-right text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Valor Pago</TableHead>
                                    <TableHead className="min-w-[120px] text-right text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Saldo Devedor</TableHead>
                                    <TableHead className="min-w-[100px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Status</TableHead>
                                    <TableHead className="text-center min-w-[100px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagamentos.filter(t => {
                                    if (filters.unidade !== 'todas' && t.unidade !== (filters.unidade === 'central' ? 'Clínica Central' : '')) return false;

                                    const statusLower = t.status.toLowerCase();
                                    const isLiquidado = statusLower === 'pago' || statusLower === 'quitado';

                                    if (filters.status === 'liquidado' && !isLiquidado) return false;
                                    if (filters.status === 'a_pagar' && isLiquidado) return false;

                                    if (filters.dataInicial && t.data.split(' ')[0].split('/').reverse().join('-') < filters.dataInicial) return false;
                                    if (filters.dataFinal && t.data.split(' ')[0].split('/').reverse().join('-') > filters.dataFinal) return false;
                                    return true;
                                }).map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell className="text-app-text-secondary dark:text-app-text-muted font-normal">{t.data.split(' ')[0]}</TableCell>
                                        <TableCell className="text-app-text-secondary dark:text-app-text-muted font-normal">{t.unidade}</TableCell>
                                        <TableCell className="text-app-text-primary dark:text-white font-normal">{t.descricao}</TableCell>
                                        <TableCell className="text-app-text-primary dark:text-white text-right font-normal">R$ {t.valorTotal.toFixed(2)}</TableCell>
                                        <TableCell className="text-red-600 dark:text-red-400 text-right font-normal">R$ {t.valorPago.toFixed(2)}</TableCell>
                                        <TableCell className={`text-right font-normal ${t.saldo > 0 ? 'text-amber-600' : 'text-app-text-muted'}`}>
                                            R$ {t.saldo.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(t.status)} className={`font-normal ${['Pago', 'Quitado'].includes(t.status) ? 'bg-green-600 hover:bg-green-700 border-transparent text-white' : ''}`}>
                                                {getStatusLabel(t.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="h-9 w-9 flex items-center justify-center mx-auto border-blue-200 dark:border-blue-900/10 bg-app-card dark:bg-app-bg-dark hover:bg-blue-50 dark:hover:bg-blue-900/20 text-app-text-secondary dark:text-app-text-muted rounded-xl transition-all"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal('visualizar', t); }}>
                                                        <Eye className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                        <span>Visualizar</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal('edit_caixa', t); }}>
                                                        <Edit className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                        <span>Editar</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal('comprovante', t); }}>
                                                        <Receipt className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                        <span>Anexo/Doc</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal('delete', t); }} className="text-red-600 dark:text-red-400">
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        <span>Excluir</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

