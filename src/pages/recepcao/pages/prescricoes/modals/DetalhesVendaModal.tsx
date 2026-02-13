import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Prescription } from '@/mocks/recepcionista/prescricoes'
import {
    FileText,
    User,
    CreditCard,
    Receipt,
    Printer,
    Share2,
    Download,
    X
} from 'lucide-react'

// Mock Items generator based on total value to make it look realistic
const generateMockItems = () => {
    // Generate 1-4 random items that sum up roughly to totalValue
    // This is just visual sugar since we don't have real items in the backend mock
    const products = [
        { name: 'Vitamina D3 1000UI', price: 45.00 },
        { name: 'Ômega 3 1000mg', price: 89.90 },
        { name: 'Whey Protein Isolado', price: 150.00 },
        { name: 'Multivitamínico Complex', price: 65.50 },
        { name: 'Colágeno Hidrolisado', price: 95.00 },
        { name: 'Magnésio Dimalato', price: 55.00 },
    ]

    // Simple logic: return a static list for demo purposes, 
    // in real app this would come from the backend relation
    return [
        { ...products[0], quantity: 1, total: products[0].price },
        { ...products[2], quantity: 2, total: products[2].price * 2 },
        { ...products[4], quantity: 1, total: products[4].price },
    ]
}

interface DetalhesVendaModalProps {
    isOpen: boolean
    onClose: () => void
    venda: Prescription | null
}

export function DetalhesVendaModal({ isOpen, onClose, venda }: DetalhesVendaModalProps) {
    if (!venda) return null

    // For demo: consistency in items shown
    const items = generateMockItems()
    const subtotal = items.reduce((acc, item) => acc + item.total, 0)
    // Adjust mock total to match the prescription total (simulating discount/adjustment)
    const discount = Math.max(0, subtotal - venda.totalValue)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[900px] w-full bg-white dark:bg-[#0c1e3d] rounded-[24px] border-none p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 bg-white dark:bg-[#0c1e3d] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Receipt className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Detalhes da Venda
                                <Badge variant="secondary" className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-medium">
                                    #{venda.number}
                                </Badge>
                            </DialogTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                                Realizada em {venda.createdAt}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 space-y-3">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                                <User size={16} />
                                Paciente
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white truncate" title={venda.patientName}>
                                {venda.patientName}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 space-y-3">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                                <User size={16} />
                                Profissional
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white truncate" title={venda.specialistName}>
                                {venda.specialistName}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 space-y-3">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                                <CreditCard size={16} />
                                Status
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className={`
                                    text-sm font-medium px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-none
                                `}>
                                    PAGAMENTO APROVADO
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
                        <div className="bg-gray-50 dark:bg-white/5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                                Itens da Venda
                            </h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-gray-100 dark:border-gray-800">
                                    <TableHead className="pl-6 h-12 text-gray-500 dark:text-gray-400 font-medium">Produto</TableHead>
                                    <TableHead className="text-center h-12 text-gray-500 dark:text-gray-400 font-medium">Qtd</TableHead>
                                    <TableHead className="text-right h-12 text-gray-500 dark:text-gray-400 font-medium">Valor Unit.</TableHead>
                                    <TableHead className="text-right pr-6 h-12 text-gray-500 dark:text-gray-400 font-medium">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, i) => (
                                    <TableRow key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 border-gray-100 dark:border-gray-800">
                                        <TableCell className="pl-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="text-center py-4 text-gray-600 dark:text-gray-300">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right py-4 text-gray-600 dark:text-gray-300">
                                            R$ {item.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-4 font-bold text-gray-900 dark:text-white">
                                            R$ {item.total.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end">
                        <div className="w-full md:w-1/3 bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-3">
                            {discount > 0 && (
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                                    <span>Desconto Aplicado</span>
                                    <span className="text-green-600 dark:text-green-400">- R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">Total Pago</span>
                                <span className="text-2xl font-extrabold text-[#0039A6] dark:text-blue-400">
                                    R$ {venda.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 dark:bg-[#0c1e3d] border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/5 font-semibold gap-2">
                        <Share2 size={18} />
                        Compartilhar
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/5 font-semibold gap-2">
                            <Printer size={18} />
                            Imprimir
                        </Button>
                        <Button variant="primary" className="h-12 px-8 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white font-bold shadow-lg shadow-blue-900/20 gap-2">
                            <Download size={18} />
                            Baixar Recibo
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}
