import React, { useState } from 'react'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Plus, X, Search, ChevronLeft, ChevronRight, Check, Tag } from 'lucide-react'
import { LabelEditorModal } from '../../../../recepcao/pages/prescricoes/modals/LabelEditorModal'
import { useAtendimento } from '../../../context/AtendimentoContext'
import { Badge } from '@/components/ui/Badge'

interface PrescricaoSectionProps {
    onBack: () => void
    onNext: () => void
}

const STOCK_MOCK = [
    { id: 1, nome: 'Vitamina D3 2000 UI', categoria: 'Vitaminas', agua_boa: 150, querencia: 80, total: 230 },
    { id: 2, nome: 'Ômega 3 1000mg', categoria: 'Suplementos', agua_boa: 200, querencia: 120, total: 320 },
    { id: 3, nome: 'Magnésio Dimalato 500mg', categoria: 'Minerais', agua_boa: 95, querencia: 50, total: 145 },
    { id: 4, nome: 'Curcumina 500mg', categoria: 'Anti-inflamatórios', agua_boa: 70, querencia: 35, total: 105 },
]

export const PrescricaoSection = ({ onBack, onNext }: PrescricaoSectionProps) => {
    const { prescritos, setPrescritos, status, observacoesGerais, setObservacoesGerais, patientName } = useAtendimento()
    const [searchTerm, setSearchTerm] = useState('')
    const isReadOnly = status === 'read-only' || status === 'finalized'
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
    const [selectedLabelData, setSelectedLabelData] = useState<any>(null)

    const handleOpenLabelEditor = (item: any) => {
        setIsLabelModalOpen(true)
        setSelectedLabelData({
            patientName: patientName || 'Paciente',
            productName: item.nome,
            composition: item.categoria,
            usage: item.posologia || 'Conforme orientação médica',
            validity: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString('pt-BR')
        })
    }

    const handleAddItem = (item: typeof STOCK_MOCK[0]) => {
        if (isReadOnly) return
        if (prescritos.find(p => p.id === item.id)) return // Already added

        setPrescritos(prev => [
            {
                id: item.id,
                nome: item.nome,
                categoria: item.categoria,
                quantidade: 1,
                posologia: '',
                total: item.total,
                aguaBoa: item.agua_boa,
                querencia: item.querencia
            },
            ...prev
        ])
    }

    const handleRemoveItem = (id: number) => {
        if (isReadOnly) return
        setPrescritos(prev => prev.filter(p => p.id !== id))
    }

    const updateItem = (id: number, field: string, value: any) => {
        if (isReadOnly) return
        setPrescritos(prev => prev.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ))
    }

    const filteredStock = STOCK_MOCK.filter(item =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-xl font-normal text-gray-900 dark:text-white">Prescrição de Medicamentos/Suplementos</h2>
                <p className="text-app-text-muted dark:text-app-text-muted">Selecione medicamentos do estoque e defina a posologia</p>
            </div>

            {/* Selected Items List (Top) */}
            {prescritos.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-normal text-gray-900 dark:text-white">Medicamentos Prescritos ({prescritos.length})</h3>
                    <div className="space-y-4">
                        {prescritos.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-app-card-dark border border-app-border dark:border-gray-800 rounded-[12px] p-6 shadow-sm relative group animate-in slide-in-from-top-2">
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleOpenLabelEditor(item)}
                                        className="bg-[#0039A6] hover:bg-[#1d3b2e] border border-[#2d5a46] text-white h-9 px-3 rounded-[10px] font-normal flex items-center gap-2"
                                        title="Imprimir Etiqueta"
                                    >
                                        <Tag className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline text-xs">Imprimir Etiqueta</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-normal text-gray-900 dark:text-white text-lg">{item.nome}</h4>
                                    <p className="text-app-text-muted dark:text-app-text-muted text-sm">Categoria: {item.categoria}</p>
                                    <div className="flex gap-4 text-xs text-app-text-muted mt-1">
                                        <span>Água Boa: {STOCK_MOCK.find(s => s.id === item.id)?.agua_boa}</span>
                                        <span>Querência: {STOCK_MOCK.find(s => s.id === item.id)?.querencia}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-normal text-gray-900 dark:text-white text-sm">Quantidade</Label>
                                        <Input
                                            type="number"
                                            value={item.quantidade}
                                            onChange={(e) => updateItem(item.id, 'quantidade', parseInt(e.target.value) || 0)}
                                            min={1}
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal"
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label className="font-normal text-gray-900 dark:text-white text-sm">Posologia *</Label>
                                        <Input
                                            placeholder="Ex: Tomar 1 cápsula 2x ao dia, após refeições"
                                            value={item.posologia}
                                            onChange={(e) => updateItem(item.id, 'posologia', e.target.value)}
                                            className="h-11 px-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stock Selection Section */}
            <div className="space-y-4">
                <h3 className="font-normal text-gray-900 dark:text-white">Estoque Disponível ({filteredStock.length} produtos)</h3>

                <div className="relative">
                    <Input
                        placeholder="Buscar suplementos por nome ou categoria..."
                        className="pl-10 h-12 bg-app-bg-secondary dark:bg-app-table-header-dark border-gray-100 dark:border-gray-800 rounded-[10px] font-normal text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted" />
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredStock.map((item) => {
                        const isAdded = prescritos.some(p => p.id === item.id)
                        return (
                            <div key={item.id} className="bg-white dark:bg-app-card-dark border border-app-border dark:border-gray-800 p-4 rounded-[12px] flex items-center justify-between hover:border-app-border dark:hover:border-gray-700 transition-all">
                                <div>
                                    <h4 className="font-normal text-gray-900 dark:text-white text-lg">{item.nome}</h4>
                                    <p className="text-app-text-muted dark:text-app-text-muted text-sm">{item.categoria}</p>
                                    <div className="flex gap-4 text-xs text-app-text-muted mt-1">
                                        <span>Água Boa: {item.agua_boa}</span>
                                        <span>Querência: {item.querencia}</span>
                                        <span>Total: {item.total}</span>
                                    </div>
                                </div>
                                <Button
                                    variant={isAdded ? "ghost" : "outline"}
                                    onClick={() => !isAdded && handleAddItem(item)}
                                    disabled={isAdded || isReadOnly}
                                    className={`h-10 px-4 rounded-[10px] font-normal gap-2 ${isAdded ? 'text-app-text-muted cursor-default hover:bg-transparent' : 'border-app-border dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'}`}
                                >
                                    {isAdded ? (
                                        <>
                                            <Plus className="h-4 w-4" /> Adicionado
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" /> Adicionar
                                        </>
                                    )}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* General Observations */}
            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Label className="font-normal text-gray-900 dark:text-white text-base">Observações da Prescrição</Label>
                <Textarea
                    placeholder="Orientações gerais para o paciente sobre o uso dos medicamentos..."
                    value={observacoesGerais}
                    onChange={(e) => setObservacoesGerais(e.target.value)}
                    readOnly={isReadOnly}
                    className="min-h-[100px] p-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                />
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-12 px-6 rounded-[10px] border-app-border dark:border-app-border-dark text-gray-900 dark:text-white font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Voltar: Prontuário
                </Button>
                <Button
                    onClick={onNext}
                    className="h-12 px-8 bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px] font-normal flex items-center gap-2"
                >
                    Próximo: Documentos <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
