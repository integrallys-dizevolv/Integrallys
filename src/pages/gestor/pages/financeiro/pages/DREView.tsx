import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

import { BarChart3, Download, FileText, ChevronRight, Calendar } from 'lucide-react';

import { MOCK_DRE_ITEMS } from '@/mocks/admin/financeiro';

interface DreItemDetail {
    label: string;
    value: number;
}

interface DreItem {
    id: number;
    label: string;
    value: number;
    type: string;
    sub?: string;
    sub2?: string;
    expandable?: boolean;
    details?: DreItemDetail[];
}

export const DREView = () => {
    const [expandedDreItems, setExpandedDreItems] = useState<number[]>([]);
    const [dreFilters, setDreFilters] = useState({
        periodo: 'mensal',
        mesAno: 'novembro de 2025',
        unidade: 'todas',
        visao: 'gerencial'
    });
    const [dreItems, setDreItems] = useState<DreItem[]>(MOCK_DRE_ITEMS);
    const [isGenerating, setIsGenerating] = useState(false);

    const toggleDreItem = (id: number) => {
        setExpandedDreItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simular carregamento e filtragem
        setTimeout(() => {
            // Apenas para demonstrar funcionalidade real, alteramos levemente os valores
            const multiplier = dreFilters.unidade === 'central' ? 0.7 : dreFilters.unidade === 'norte' ? 0.3 : 1;
            const updatedItems: DreItem[] = MOCK_DRE_ITEMS.map(item => ({
                ...item,
                value: item.value * multiplier,
                details: item.details?.map(d => ({ ...d, value: d.value * multiplier }))
            }));
            setDreItems(updatedItems);
            setIsGenerating(false);
        }, 800);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-6 border-none shadow-sm bg-app-card dark:bg-app-bg-dark">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Período</Label>
                        <Select value={dreFilters.periodo} onValueChange={(v) => setDreFilters({ ...dreFilters, periodo: v })}>
                            <SelectTrigger className="h-11 bg-[#F8FAFC] dark:bg-app-bg-dark border-app-border dark:border-app-border-dark text-sm font-normal rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Mês/ano</Label>
                        <div className="relative">
                            <Input
                                value={dreFilters.mesAno}
                                onChange={(e) => setDreFilters({ ...dreFilters, mesAno: e.target.value })}
                                className="h-11 bg-[#F8FAFC] dark:bg-app-bg-dark border-app-border dark:border-app-border-dark text-sm font-normal rounded-xl pr-10"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted" size={18} />
                        </div>
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Consolidação</Label>
                        <Select value={dreFilters.unidade} onValueChange={(v) => setDreFilters({ ...dreFilters, unidade: v })}>
                            <SelectTrigger className="h-11 bg-[#F8FAFC] dark:bg-app-bg-dark border-gray-100 dark:border-app-border-dark text-sm font-normal rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas as unidades</SelectItem>
                                <SelectItem value="central">Clínica Central</SelectItem>
                                <SelectItem value="norte">Unidade Norte</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Visão</Label>
                        <Select value={dreFilters.visao} onValueChange={(v) => setDreFilters({ ...dreFilters, visao: v })}>
                            <SelectTrigger className="h-11 bg-[#F8FAFC] dark:bg-app-bg-dark border-app-border dark:border-app-border-dark text-sm font-normal rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gerencial">Gerencial</SelectItem>
                                <SelectItem value="contabil">Contábil</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="h-12 px-10 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-xl gap-2 shadow-lg shadow-[#0039A6]/10 whitespace-nowrap flex items-center min-w-[180px]"
                    >
                        {isGenerating ? (
                            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <BarChart3 size={20} className="shrink-0" />
                        )}
                        {isGenerating ? 'Gerando...' : 'Gerar DRE'}
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-8 border-none shadow-sm bg-app-card dark:bg-app-bg-dark">
                    <p className="text-sm font-normal text-[#64748B] dark:text-app-text-muted mb-6">Receita bruta</p>
                    <p className="text-3xl font-normal text-[#101828] dark:text-white mb-2">R$ 45.320,00</p>
                    <p className="text-xs text-[#64748B] dark:text-app-text-muted truncate">+12,3% vs mês anterior</p>
                </Card>
                <Card className="p-8 border-none shadow-sm bg-app-card dark:bg-app-bg-dark">
                    <p className="text-sm font-normal text-[#64748B] dark:text-app-text-muted mb-6">Lucro bruto</p>
                    <p className="text-3xl font-normal text-[#101828] dark:text-white mb-2">R$ 32.338,00</p>
                    <p className="text-xs text-[#64748B] dark:text-app-text-muted truncate">Margem de 71,4%</p>
                </Card>
                <Card className="p-8 border-none shadow-sm bg-app-card dark:bg-app-bg-dark">
                    <p className="text-sm font-normal text-[#64748B] dark:text-app-text-muted mb-6">EBITDA</p>
                    <p className="text-3xl font-normal text-[#101828] dark:text-white mb-2">R$ 13.688,00</p>
                    <p className="text-xs text-[#64748B] dark:text-app-text-muted truncate">Margem de 30,2%</p>
                </Card>
                <Card className="p-8 border-none shadow-xl bg-app-card dark:bg-app-bg-dark">
                    <p className="text-sm font-normal text-[#64748B] dark:text-app-text-muted mb-6">Lucro líquido</p>
                    <p className="text-3xl font-normal text-app-text-primary dark:text-white mb-2">R$ 11.638,00</p>
                    <p className="text-xs text-[#64748B] dark:text-app-text-muted truncate">Margem líquida de 25,7%</p>
                </Card>
            </div>

            <Card className="p-0 border-none shadow-sm overflow-hidden bg-app-card dark:bg-app-bg-dark">
                <div className="p-8 border-b border-gray-50 dark:border-app-border-dark">
                    <h3 className="text-xl font-normal text-[#101828] dark:text-white mb-1">Demonstrativo de resultados do exercício</h3>
                    <p className="text-sm text-[#64748B] dark:text-app-text-muted font-normal">Novembro de 2025 - Todas as unidades</p>
                </div>
                <div className="p-8 space-y-4">
                    {dreItems.map((item: DreItem) => (
                        <div
                            key={item.id}
                            onClick={() => item.expandable && toggleDreItem(item.id)}
                            className={`
                                relative p-6 rounded-2xl transition-all cursor-pointer border
                                ${item.type === 'result' ? 'bg-[#0039A6] text-white border-[#0039A6] shadow-lg shadow-[#0039A6]/20' : ''}
                                ${item.type === 'summary' ? 'bg-[#F1F5F9] dark:bg-app-bg-dark border-[#94A3B8]/20' : ''}
                                ${['positive', 'negative', 'neutral'].includes(item.type) ? 'bg-app-card dark:bg-transparent border-gray-100 dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/[0.02]' : ''}
                                ${item.type === 'total' ? 'bg-[#F1F5F9] dark:bg-app-card/[0.03] border-[#94A3B8]/20 ring-1 ring-[#94A3B8]/10' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    {item.expandable && (
                                        <ChevronRight
                                            size={20}
                                            className={`text-app-text-muted transition-transform duration-200 ${expandedDreItems.includes(item.id) ? 'rotate-90' : ''}`}
                                        />
                                    )}
                                    {!item.expandable && <div className="w-5" />} {/* Spacer for alignment */}

                                    <div className={['total', 'summary', 'result'].includes(item.type) ? 'pl-2' : ''}>
                                        <p className={`text-xl font-normal ${item.type === 'result' ? 'text-white text-lg mb-0.5' : 'text-app-text-primary dark:text-white'}`}>
                                            {item.label}
                                        </p>
                                        <div className="flex flex-col">
                                            {item.sub && (
                                                <p className={`text-sm font-normal ${item.type === 'result' ? 'text-white/70' : 'text-[#64748B] dark:text-app-text-muted'}`}>
                                                    {item.sub}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={`text-2xl font-normal ${item.type === 'result' ? 'text-white text-3xl' : item.type === 'negative' ? 'text-red-600' : 'text-app-text-primary dark:text-white'}`}>
                                        {item.value === 0 ? 'R$ 0,00' :
                                            item.value < 0 ? `(-) R$ ${Math.abs(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` :
                                                `R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                        }
                                    </p>
                                </div>
                            </div>
                            {item.sub2 && item.type === 'result' && (
                                <div className="mt-1 pl-14">
                                    <p className="text-sm text-white/70 font-normal">{item.sub2}</p>
                                </div>
                            )}

                            {/* Expanded Details */}
                            {item.expandable && expandedDreItems.includes(item.id) && item.details && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-app-border-dark pl-14 space-y-3 animate-in fade-in slide-in-from-top-2">
                                    {item.details.map((detail: DreItemDetail, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="font-normal text-[#64748B] dark:text-app-text-muted">{detail.label}</span>
                                            <span className={`${item.type === 'negative' ? 'text-red-500' : 'text-app-text-primary dark:text-white'} font-normal`}>
                                                R$ {detail.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-8 border-t border-gray-100 dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-app-bg-dark/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                        <h4 className="text-lg font-normal text-app-text-primary dark:text-white">Exportar DRE</h4>
                        <p className="text-sm text-[#64748B] dark:text-app-text-muted font-normal">Baixe o demonstrativo para {dreFilters.mesAno}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-11 px-6 rounded-xl border-app-border dark:border-app-border-dark hover:bg-app-card dark:hover:bg-app-card/5 font-normal text-app-text-primary dark:text-white whitespace-nowrap flex items-center shadow-sm">
                            <Download size={18} className="mr-2 shrink-0" /> Exportar PDF
                        </Button>
                        <Button variant="outline" className="h-11 px-6 rounded-xl border-app-border dark:border-app-border-dark hover:bg-app-card dark:hover:bg-app-card/5 font-normal text-[#101828] dark:text-white whitespace-nowrap flex items-center shadow-sm">
                            <FileText size={18} className="mr-2 shrink-0" /> Exportar XLSX
                        </Button>
                    </div>
                </div>
            </Card>

        </div>
    );
};
