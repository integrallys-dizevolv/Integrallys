import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/Select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/Table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
    DollarSign,
    TrendingUp,
    Users,
    MoreVertical,
    Plus,
    Info,
    Check,
    Search,
    Calendar,
    ArrowUpCircle,
    ArrowDownCircle,
    Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EfetuarPagamentoRepasseModal } from '../../../modals/EfetuarPagamentoRepasseModal';
import { mockRepasses } from '@/mocks/admin/repasse';
import { toast } from 'sonner';

interface RepasseContentProps {
    onPageChange?: (page: string) => void;
}

export const RepasseContent = ({ onPageChange }: RepasseContentProps) => {
    const [specialistFilter, setSpecialistFilter] = useState('todos');
    const [periodFilter, setPeriodFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRepasse, setSelectedRepasse] = useState<any>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePrintRecibo = (row: any) => {
        const w = window.open('', '_blank', 'width=720,height=880');
        if (!w) {
            toast.error('Não foi possível abrir a visualização de impressão.');
            return;
        }

        w.document.write(`
          <html>
            <head><title>Recibo de Repasse</title></head>
            <body style="font-family: Arial, sans-serif; padding: 24px;">
              <h2>Recibo de Repasse</h2>
              <p><strong>Especialista:</strong> ${row.especialista}</p>
              <p><strong>Período:</strong> ${row.periodo}</p>
              <p><strong>Especialidade:</strong> ${row.especialidade}</p>
              <p><strong>Percentual:</strong> ${row.percentual}</p>
              <p><strong>Valor:</strong> ${row.valorRepasse}</p>
              <p><strong>Status:</strong> ${row.status}</p>
              <hr />
              <p style="margin-top: 18px;">Assinatura: ______________________________</p>
            </body>
          </html>
        `);
        w.document.close();
        w.focus();
        w.print();
    };

    const handleGenerateRepasse = () => {
        setIsGenerating(true);
        const promise = new Promise((resolve) => setTimeout(resolve, 1500));

        toast.promise(promise, {
            loading: 'Gerando relatório de repasse...',
            success: 'Relatório de repasse gerado com sucesso!',
            error: 'Erro ao gerar repasse.',
        });

        promise.finally(() => setIsGenerating(false));
    };

    const filteredRepasses = useMemo(() => {
        return mockRepasses.filter(r => {
            const matchesSpecialist = specialistFilter === 'todos' ||
                (specialistFilter === 'carlos' && r.especialista.includes('Carlos')) ||
                (specialistFilter === 'ana' && r.especialista.includes('Ana')) ||
                (specialistFilter === 'roberto' && r.especialista.includes('Roberto')) ||
                (specialistFilter === 'mariana' && r.especialista.includes('Mariana'));

            const matchesPeriod = periodFilter === 'todos' || r.periodo.toLowerCase().includes(periodFilter.toLowerCase());

            const matchesSearch = r.especialista.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.especialidade.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSpecialist && matchesPeriod && matchesSearch;
        });
    }, [specialistFilter, periodFilter, searchTerm, mockRepasses]);

    const getStatusBadge = (status: string) => {
        if (status === 'Pago') {
            return (
                <Badge className="bg-emerald-600 dark:bg-emerald-900/60 text-white dark:text-emerald-100 border-none shadow-sm font-normal rounded-full px-4 py-1 whitespace-nowrap text-[10px]">
                    Pago
                </Badge>
            );
        }
        return (
            <Badge className="bg-amber-500 dark:bg-amber-900/60 text-white dark:text-amber-100 border-none shadow-sm font-normal rounded-full px-4 py-1 whitespace-nowrap text-[10px]">
                Pendente
            </Badge>
        );
    };

    const getValidadoBadge = (validado: boolean) => {
        if (validado) {
            return (
                <Badge className="bg-emerald-600 dark:bg-emerald-900/60 text-white dark:text-emerald-100 border-none shadow-sm font-normal rounded-full px-4 py-1 whitespace-nowrap text-[10px]">
                    Validado
                </Badge>
            );
        }
        return (
            <Badge className="bg-gray-500 dark:bg-gray-800 text-white dark:text-gray-300 border-none shadow-sm font-normal rounded-full px-4 py-1 whitespace-nowrap text-[10px]">
                Não validado
            </Badge>
        );
    };

    const getTipoVinculoBadge = (tipo: string) => {
        if (tipo === 'Parceiro') {
            return (
                <Badge className="bg-orange-600 dark:bg-orange-900/60 text-white dark:text-orange-100 border-transparent shadow-sm font-normal rounded-full px-4 py-1 whitespace-nowrap text-[10px] flex items-center gap-1">
                    <ArrowDownCircle size={12} /> Parceiro
                </Badge>
            );
        }
        return (
            <Badge className="bg-emerald-600 dark:bg-emerald-900/60 text-white dark:text-emerald-100 border-transparent shadow-sm font-normal rounded-full px-4 py-1 whitespace-nowrap text-[10px] flex items-center gap-1">
                <ArrowUpCircle size={12} /> Colaborador
            </Badge>
        );
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-gray-200/60 dark:border-white/5 shadow-sm rounded-2xl bg-white dark:bg-[#020817]">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[11px] font-normal text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Total pendente</p>
                            <h3 className="text-2xl font-normal text-[#101828] dark:text-white">R$ 11.200,00</h3>
                            <p className="text-xs font-normal text-gray-400 mt-1">Aguardando pagamento</p>
                        </div>
                        <div className="p-2.5 bg-amber-500 text-white dark:bg-amber-900/40 dark:text-amber-100 rounded-xl shadow-sm">
                            <DollarSign size={20} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-gray-200/60 dark:border-white/5 shadow-sm rounded-2xl bg-white dark:bg-[#020817]">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[11px] font-normal text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Total pago</p>
                            <h3 className="text-2xl font-normal text-[#101828] dark:text-white">R$ 5.710,00</h3>
                            <p className="text-xs font-normal text-gray-400 mt-1">Já repassado</p>
                        </div>
                        <div className="p-2.5 bg-green-600 text-white dark:bg-emerald-900/40 dark:text-emerald-100 rounded-xl shadow-sm">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-gray-200/60 dark:border-white/5 shadow-sm rounded-2xl bg-white dark:bg-[#020817]">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[11px] font-normal text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Especialistas</p>
                            <h3 className="text-2xl font-normal text-[#101828] dark:text-white">5</h3>
                            <p className="text-xs font-normal text-gray-400 mt-1">Profissionais ativos</p>
                        </div>
                        <div className="p-2.5 bg-[#0039A6] text-white dark:bg-white/5 dark:text-emerald-400 rounded-xl shadow-sm">
                            <Users size={20} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters & Table Card */}
            <Card className="border-gray-200/60 dark:border-white/5 overflow-hidden rounded-2xl shadow-sm bg-white dark:bg-[#020817]">
                <div className="p-6 border-b border-gray-100 dark:border-white/10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <h3 className="text-lg font-normal text-[#101828] dark:text-white">Repasses</h3>

                        <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full md:w-[280px]">
                                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Buscar especialista..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-11 pl-11 bg-white dark:bg-[#020817] border-gray-200 dark:border-white/10 rounded-xl text-sm transition-all focus:ring-2 focus:ring-[#0039A6]/10 w-full"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                                    <SelectTrigger className="h-11 w-full sm:w-[160px] border-gray-200 dark:border-white/10 bg-white dark:bg-[#020817] rounded-xl text-sm font-normal">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <SelectValue preferPlaceholder placeholder="Período">
                                                {periodFilter === 'todos' ? 'Mês' : periodFilter}
                                            </SelectValue>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100 dark:border-white/10">
                                        <SelectItem value="todos">Todos os meses</SelectItem>
                                        <SelectItem value="Dezembro 2025">Dezembro 2025</SelectItem>
                                        <SelectItem value="Novembro 2025">Novembro 2025</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={specialistFilter} onValueChange={setSpecialistFilter}>
                                    <SelectTrigger className="h-11 w-full sm:w-[180px] border-gray-200 dark:border-white/10 bg-white dark:bg-[#020817] rounded-xl text-sm font-normal">
                                        <SelectValue preferPlaceholder placeholder="Especialista">
                                            {specialistFilter === 'todos' ? 'Especialistas' :
                                                specialistFilter === 'carlos' ? 'Dr. Carlos Silva' :
                                                    specialistFilter === 'ana' ? 'Dra. Ana Paula' :
                                                        specialistFilter === 'roberto' ? 'Dr. Roberto Lima' :
                                                            specialistFilter === 'mariana' ? 'Dra. Mariana Costa' : 'Especialista'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100 dark:border-white/10">
                                        <SelectItem value="todos">Todos especialistas</SelectItem>
                                        <SelectItem value="carlos">Dr. Carlos Silva</SelectItem>
                                        <SelectItem value="ana">Dra. Ana Paula</SelectItem>
                                        <SelectItem value="roberto">Dr. Roberto Lima</SelectItem>
                                        <SelectItem value="mariana">Dra. Mariana Costa</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    className="h-11 px-6 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-xl flex items-center gap-2 transition-all w-full sm:w-auto shadow-sm disabled:opacity-50"
                                    onClick={handleGenerateRepasse}
                                    disabled={isGenerating}
                                >
                                    <Plus size={18} /> {isGenerating ? 'Gerando...' : 'Gerar'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-white/5">
                            <TableRow className="hover:bg-transparent border-gray-100 dark:border-white/10">
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Especialista</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Vínculo</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Especialidade</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Período</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Valor bruto</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Percentual</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Repasse / taxa</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        Validado <Info size={14} className="text-gray-300" />
                                    </div>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-gray-400 uppercase tracking-wider text-right whitespace-nowrap">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRepasses.map((row) => (
                                <TableRow key={row.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors border-gray-100 dark:border-white/10">
                                    <TableCell className="px-6 py-4 font-normal text-[#101828] dark:text-white whitespace-nowrap">{row.especialista}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        {getTipoVinculoBadge(row.tipoVinculo)}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-[#6a7282] dark:text-gray-400 text-sm whitespace-nowrap font-normal">{row.especialidade}</TableCell>
                                    <TableCell className="px-6 py-4 text-[#6a7282] dark:text-gray-400 text-sm whitespace-nowrap font-normal">{row.periodo}</TableCell>
                                    <TableCell className="px-6 py-4 font-normal text-[#101828] dark:text-white whitespace-nowrap">{row.valorBruto}</TableCell>
                                    <TableCell className="px-6 py-4 font-normal text-[#0039A6] dark:text-blue-300 whitespace-nowrap">{row.percentual}</TableCell>
                                    <TableCell className="px-6 py-4 font-normal text-[#101828] dark:text-white whitespace-nowrap">
                                        <span className={row.tipoVinculo === 'Parceiro' ? 'text-orange-600' : 'text-emerald-600 font-normal'}>
                                            {row.valorRepasse}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        {getValidadoBadge(row.validado)}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        {getStatusBadge(row.status)}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm dark:hover:bg-white/10"
                                                >
                                                    <MoreVertical className="h-5 w-5 text-[#6a7282] dark:text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-gray-200 dark:border-white/10 shadow-lg dark:bg-[#0c1e3d]">
                                                <DropdownMenuItem
                                                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium text-sm text-[#101828] dark:text-white"
                                                    onClick={() => {
                                                        setSelectedRepasse(row);
                                                        setIsPaymentModalOpen(true);
                                                    }}
                                                >
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-md flex items-center justify-center",
                                                        row.tipoVinculo === 'Parceiro' ? "bg-orange-50" : "bg-[#ECFDF3]"
                                                    )}>
                                                        <Check size={14} className={row.tipoVinculo === 'Parceiro' ? "text-orange-600" : "text-[#027A48]"} />
                                                    </div>
                                                    {row.tipoVinculo === 'Parceiro' ? 'Baixar Recebimento' : 'Efetuar Pagamento'}
                                                </DropdownMenuItem>
                                                {row.status === 'Pago' && (
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium text-sm text-[#101828] dark:text-white"
                                                        onClick={() => handlePrintRecibo(row)}
                                                    >
                                                        <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#EEF4FF]">
                                                            <Printer size={14} className="text-[#0039A6]" />
                                                        </div>
                                                        Imprimir recibo
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <EfetuarPagamentoRepasseModal
                isOpen={isPaymentModalOpen}
                onClose={setIsPaymentModalOpen}
                repasse={selectedRepasse}
            />
        </div>
    );
};

