import { useState } from 'react'
import {
    ShoppingCart,
    Package,
    CheckCircle2,
    Printer
} from 'lucide-react'
import {
    Dialog,
    DialogContent
} from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { LabelEditorModal, LabelData } from '@/pages/recepcao/pages/prescricoes/modals/LabelEditorModal'

interface PrescriptionItem {
    product: string
    dosage: string
    frequency: string
    stockStatus: 'available' | 'unavailable'
}

interface GerarVendaModalProps {
    isOpen: boolean
    onClose: () => void
    prescription?: {
        id: string
        number: string
        patientName: string
        specialistName: string
        createdAt: string
        type: string
        status: string
    } | null
    onConfirm?: (id: string) => void
}

export function GerarVendaModal({ isOpen, onClose, prescription, onConfirm }: GerarVendaModalProps) {
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
    const [selectedLabelData, setSelectedLabelData] = useState<LabelData | undefined>(undefined)
    const [labelsList, setLabelsList] = useState<LabelData[]>([])
    const [isConverting, setIsConverting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    if (!prescription) return null

    const items: PrescriptionItem[] = [
        { product: 'Vitamina D3', dosage: '1000 UI', frequency: '1x ao dia', stockStatus: 'available' },
        { product: 'Ômega 3', dosage: '1000mg', frequency: '2x ao dia', stockStatus: 'available' }
    ]

    const handleConfirmVenda = async () => {
        setIsConverting(true)
        // Simular API
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsConverting(false)
        setIsSuccess(true)
        onConfirm?.(prescription.id)
    }

    const handlePrintAllLabels = () => {
        const labels: LabelData[] = items.map(item => ({
            patientName: prescription.patientName,
            productName: item.product,
            composition: item.dosage,
            usage: item.frequency,
            validity: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString('pt-BR')
        }))
        setLabelsList(labels)
        setSelectedLabelData(undefined) // Clear single selection
        setIsLabelModalOpen(true)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-[800px] w-[95%] bg-white dark:bg-[#0c1e3d] p-0 overflow-hidden border-none rounded-[24px]">
                    {isSuccess ? (
                        <div className="p-12 text-center space-y-6">
                            <div className="mx-auto w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 size={48} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-[#101828] dark:text-white">Venda Gerada com Sucesso!</h2>
                                <p className="text-[#667085] dark:text-gray-400 font-medium">A prescrição foi convertida em venda e o estoque foi atualizado.</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setIsSuccess(false)
                                    onClose()
                                }}
                                className="h-12 px-8 rounded-xl font-bold bg-[#0039A6] hover:bg-[#002d82] text-white"
                            >
                                Fechar
                            </Button>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8 space-y-8">
                            {/* Header */}
                            <div className="space-y-1 pr-8">
                                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-[#101828] dark:text-white">
                                    <ShoppingCart className="h-6 w-6 text-[#0039A6]" />
                                    Gerar Prescrição/Venda
                                </h2>
                                <p className="text-[#667085] dark:text-gray-400 text-sm font-medium">
                                    Registre a Prescrição/Venda dos itens
                                </p>
                            </div>

                            {/* Prescription Info Card */}
                            <div className="bg-gray-50/50 dark:bg-white/5 rounded-[20px] p-6 space-y-6 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-[#667085] dark:text-gray-500 uppercase tracking-wider">Prescrição</p>
                                        <p className="text-xl font-bold text-[#101828] dark:text-white">{prescription.number}</p>
                                    </div>
                                    <Badge className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-none font-bold px-3 py-1 rounded-lg">
                                        {prescription.status}
                                    </Badge>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-[#667085] dark:text-gray-500 uppercase tracking-wider">Paciente</p>
                                        <p className="font-bold text-[#101828] dark:text-white">{prescription.patientName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-[#667085] dark:text-gray-500 uppercase tracking-wider">Especialista</p>
                                        <p className="font-bold text-[#101828] dark:text-white">{prescription.specialistName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-[#667085] dark:text-gray-500 uppercase tracking-wider">Data Criação</p>
                                        <p className="font-bold text-[#101828] dark:text-white">{prescription.createdAt}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-[#667085] dark:text-gray-500 uppercase tracking-wider">Tipo</p>
                                        <p className="font-bold text-[#101828] dark:text-white">{prescription.type}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="space-y-4">
                                <h3 className="text-md font-bold flex items-center gap-2 text-[#101828] dark:text-white">
                                    <Package className="h-5 w-5 text-[#667085]" />
                                    Itens da Prescrição
                                </h3>

                                <div className="border border-gray-100 dark:border-gray-800 rounded-[16px] overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 dark:bg-white/5">
                                            <TableRow className="border-b border-gray-100 dark:border-gray-800">
                                                <TableHead className="font-bold">Produto</TableHead>
                                                <TableHead className="font-bold">Dosagem</TableHead>
                                                <TableHead className="font-bold">Frequência</TableHead>
                                                <TableHead className="font-bold text-center">Estoque</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="font-medium">
                                            {items.map((item, idx) => (
                                                <TableRow key={idx} className="border-b border-gray-100/50 dark:border-gray-800/50">
                                                    <TableCell className="font-bold text-[#101828] dark:text-white">{item.product}</TableCell>
                                                    <TableCell className="text-[#667085] dark:text-gray-300 font-medium">{item.dosage}</TableCell>
                                                    <TableCell className="text-[#667085] dark:text-gray-300 font-medium">{item.frequency}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-none font-bold flex items-center gap-1.5 px-3 py-1 rounded-lg w-fit mx-auto">
                                                            <CheckCircle2 size={14} />
                                                            Disponível
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex justify-center pt-2">
                                    <Button
                                        onClick={handlePrintAllLabels}
                                        variant="outline"
                                        className="h-10 px-4 border-[#0039A6] text-[#0039A6] hover:bg-[#0039A6]/5 dark:border-[#4da885] dark:text-[#4da885] dark:hover:bg-[#4da885]/10 font-normal rounded-[10px] flex items-center gap-2 active:scale-95 transition-all text-sm"
                                    >
                                        <Printer className="h-4 w-4" />
                                        Imprimir todos os rótulos ({items.length})
                                    </Button>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="h-12 px-6 rounded-xl font-bold border-gray-200 dark:border-gray-800 text-[#667085] dark:text-gray-400"
                                    disabled={isConverting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleConfirmVenda}
                                    disabled={isConverting}
                                    className="h-12 px-8 rounded-xl font-bold bg-[#0039A6] hover:bg-[#002d82] text-white shadow-lg shadow-[#0039A6]/10"
                                >
                                    {isConverting ? 'Processando...' : 'Confirmar Inclusão'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            <LabelEditorModal
                isOpen={isLabelModalOpen}
                onClose={() => setIsLabelModalOpen(false)}
                data={selectedLabelData}
                dataList={labelsList}
            />
        </>
    )
}
