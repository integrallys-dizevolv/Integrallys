import React from 'react';
import {
    Wallet, DollarSign, ArrowUpRight, ArrowDownRight, MoreVertical,
    Eye, Edit, FileText, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import {
    MOCK_ACCOUNTS,
    MOCK_DAILY_MOVEMENTS
} from '@/mocks/admin/financeiro';
import type { FinanceiroAccount, FinanceiroDailyMovement } from '@/types/financeiro';

interface CaixaViewProps {
    openModal: (type: string, transaction?: FinanceiroDailyMovement) => void;
    accounts?: FinanceiroAccount[];
    dailyMovements?: FinanceiroDailyMovement[];
    loading?: boolean;
}

export function CaixaView({
    openModal,
    accounts = MOCK_ACCOUNTS,
    dailyMovements = MOCK_DAILY_MOVEMENTS,
    loading = false,
}: CaixaViewProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="p-8 border-none shadow-sm bg-app-card/50 dark:bg-app-card/[0.02] backdrop-blur-xl">
                <h3 className="text-lg font-normal text-app-text-primary dark:text-white mb-6">Saldos por conta/caixa</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {accounts.map((acc) => (
                        <div key={acc.id} className="p-5 bg-app-card dark:bg-app-bg-dark border border-gray-100 dark:border-app-border-dark rounded-2xl shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <p className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">{acc.name}</p>
                                <Wallet size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-[#0039A6] transition-colors" />
                            </div>
                            <p className="text-2xl font-normal text-app-text-primary dark:text-white mb-3">
                                R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <Badge variant="outline" className="bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark text-[#64748B] dark:text-app-text-muted rounded-lg">
                                {acc.type}
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <Card className="p-6 border-none shadow-none bg-app-card dark:bg-app-bg-dark flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-normal text-app-text-primary dark:text-white mb-4">Status do caixa</p>
                    <Badge className="bg-[#1a3329] text-white hover:bg-[#1a3329] px-4 py-1.5 rounded-lg mb-2">ABERTO</Badge>
                    <p className="text-xs text-[#64748B] dark:text-app-text-muted">Clínica Central</p>
                </Card>
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Saldo Inicial', value: '1.000,00', color: 'text-app-text-primary' },
                        { label: 'Entradas', value: '470,00', color: 'text-green-600' },
                        { label: 'Saídas', value: '500,00', color: 'text-red-600' },
                        { label: 'Saldo Atual', value: '970,00', color: 'text-app-text-primary' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 border-none shadow-sm bg-app-card dark:bg-app-bg-dark flex flex-col justify-center">
                            <p className="text-sm font-normal text-[#64748B] dark:text-app-text-muted mb-4">{stat.label}</p>
                            <p className={`text-2xl font-normal ${stat.color} dark:text-white`}>R$ {stat.value}</p>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap lg:items-center gap-3">
                <Button onClick={(e) => { e.stopPropagation(); openModal('abrircaixa'); }} variant="outline" className="rounded-xl h-14 lg:h-12 flex items-center justify-center gap-3 border-app-border dark:border-app-border-dark shadow-sm font-normal text-app-text-primary dark:text-white/80 px-6 w-full lg:w-auto">
                    <Wallet size={18} /> <span>Abrir caixa</span>
                </Button>
                <Button onClick={(e) => { e.stopPropagation(); openModal('suprimento'); }} variant="outline" className="rounded-xl h-14 lg:h-12 flex items-center justify-center gap-3 border-app-border dark:border-app-border-dark shadow-sm font-normal text-app-text-primary dark:text-white/80 px-6 w-full lg:w-auto">
                    <ArrowUpRight size={18} /> <span>Suprimento</span>
                </Button>
                <Button onClick={(e) => { e.stopPropagation(); openModal('sangria'); }} variant="outline" className="rounded-xl h-14 lg:h-12 flex items-center justify-center gap-3 border-app-border dark:border-app-border-dark shadow-sm font-normal text-app-text-primary dark:text-white/80 px-6 w-full lg:w-auto">
                    <ArrowDownRight size={18} /> <span>Sangria</span>
                </Button>
                <Button onClick={(e) => { e.stopPropagation(); openModal('fecharcaixa'); }} variant="outline" className="rounded-xl h-14 lg:h-12 flex items-center justify-center gap-3 border-app-border dark:border-app-border-dark shadow-sm font-normal text-app-text-primary dark:text-white/80 px-6 w-full lg:w-auto">
                    <DollarSign size={18} /> <span>Fechar caixa</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Card className="xl:col-span-2 p-0 border-none shadow-xl bg-app-card dark:bg-app-bg-dark">
                    <div className="p-6 border-b border-gray-50 dark:border-app-border-dark">
                        <h3 className="text-lg font-normal text-app-text-primary dark:text-white">Movimentações do dia</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-app-bg-secondary/50 dark:bg-app-card/[0.02] border-none">
                                    <TableHead className="text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Hora</TableHead>
                                    <TableHead className="text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Tipo</TableHead>
                                    <TableHead className="text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Descrição</TableHead>
                                    <TableHead className="text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Forma</TableHead>
                                    <TableHead className="text-right text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Valor</TableHead>
                                    <TableHead className="text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Operador</TableHead>
                                    <TableHead className="text-center text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dailyMovements.map((move) => (
                                    <TableRow key={move.id} className="border-gray-50 dark:border-app-border-dark hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/[0.02] transition-colors">
                                        <TableCell className="text-[#64748B] font-normal">{move.hora}</TableCell>
                                        <TableCell>
                                            <Badge className={`${move.tipo === 'Entrada' ? 'bg-emerald-600 dark:bg-emerald-900 text-white dark:text-emerald-100' : 'bg-red-600 dark:bg-red-900 text-white dark:text-red-100'} font-normal border-none`}>
                                                {move.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-app-text-primary dark:text-white font-normal">{move.descricao}</TableCell>
                                        <TableCell className="text-[#64748B] dark:text-app-text-muted font-normal">{move.forma}</TableCell>
                                        <TableCell className={`text-right font-normal ${move.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                            R$ {move.valor.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-[#64748B] dark:text-app-text-muted font-normal">{move.operador}</TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="h-8 w-8 text-app-text-muted hover:text-app-text-primary mx-auto transition-colors">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal('visualizar', move); }}>
                                                        <Eye className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                        <span>Visualizar</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal('edit_caixa', move); }}>
                                                        <Edit className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                        <span>Editar</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal('comprovante', move); }}>
                                                        <FileText className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                        <span>Comprovante</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal('estornar', move); }} className="text-red-600 dark:text-red-400">
                                                        <RotateCcw className="h-4 w-4 mr-2" />
                                                        <span>Estornar</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-app-text-secondary dark:text-app-text-muted">
                                            Carregando movimentações...
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-xl bg-app-card dark:bg-app-bg-dark h-fit sticky top-8 text-app-text-primary dark:text-white">
                    <h3 className="text-lg font-normal mb-8">Resumo</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-normal mb-4">Por forma de pagamento</p>
                            <div className="space-y-3">
                                {[{ label: 'Dinheiro', value: '620,00' }, { label: 'PIX', value: '350,00' }, { label: 'Cartão', value: '120,00' }, { label: 'Boleto', value: '0,00' }].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-[#64748B] dark:text-app-text-muted">{item.label}</span>
                                        <span className="font-normal">R$ {item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-px bg-app-bg-secondary dark:bg-app-card/5" />
                        <div>
                            <p className="text-sm font-normal mb-4">Por tipo</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#64748B] dark:text-app-text-muted">Total de entradas</span>
                                    <span className="font-normal text-green-600">R$ 1.470,00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#64748B] dark:text-app-text-muted">Total de saídas</span>
                                    <span className="font-normal text-red-600">R$ 500,00</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-app-bg-secondary dark:bg-app-card/5" />
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-base font-normal">Saldo final</span>
                            <span className="text-xl font-normal">R$ 970,00</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
