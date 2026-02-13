import { useState, useEffect, useMemo } from 'react'
import {
    X,
    ShoppingCart,
    Package,
    Plus,
    Trash2,
    CreditCard,
    User,
    ShoppingBag,
    CheckCircle2,
    Banknote,
    QrCode
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import type { Prescription, PrescriptionItem as CartItem } from '@/mocks/recepcionista/prescricoes'
import { toast } from 'sonner'

interface EditarPrescricaoModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    prescricao: Prescription | null
    onSave?: (prescricao: Prescription) => void
}

// Mocks (reused for consistency)
const MOCK_PATIENTS = [
    { id: '1', name: 'Maria Silva' },
    { id: '2', name: 'Pedro Costa' },
    { id: '3', name: 'Laura Oliveira' },
    { id: '4', name: 'Carlos Mendes' },
    { id: '5', name: 'Julia Martins' },
    { id: '6', name: 'Roberto Santos' },
]

const MOCK_PRODUCTS = [
    { id: 'p1', name: 'Vitamina D3 1000UI', price: 45.00, stock: 50 },
    { id: 'p2', name: 'Ômega 3 1000mg', price: 89.90, stock: 30 },
    { id: 'p3', name: 'Whey Protein Isolado', price: 150.00, stock: 20 },
    { id: 'p4', name: 'Multivitamínico Complex', price: 65.50, stock: 40 },
    { id: 'p5', name: 'Colágeno Hidrolisado', price: 95.00, stock: 25 },
    { id: 'p6', name: 'Magnésio Dimalato', price: 55.00, stock: 35 },
]

const MOCK_PROFESSIONALS = [
    { id: 'prof1', name: 'Dr. João Santos', role: 'Especialista' },
    { id: 'prof2', name: 'Dra. Beatriz Silva', role: 'Especialista' },
    { id: 'prof3', name: 'Ana Recepcionista', role: 'Recepcionista' },
    { id: 'prof4', name: 'Dra. Ana Paula', role: 'Especialista' },
    { id: 'prof5', name: 'Dr. Adelmo', role: 'Especialista' },
]
export function EditarPrescricaoModal({ isOpen, onClose, prescricao, onSave }: EditarPrescricaoModalProps) {
    // Form States
    const [selectedPatientId, setSelectedPatientId] = useState('')
    const [selectedSellerId, setSelectedSellerId] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [status, setStatus] = useState<'Ativa' | 'Vencida' | 'Convertida'>('Ativa')

    // Product Selection State
    const [selectedProductId, setSelectedProductId] = useState('')
    const [quantity, setQuantity] = useState(1)

    // Cart State
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // Financial State
    const [discountType, setDiscountType] = useState<'value' | 'percent'>('value')
    const [discountValue, setDiscountValue] = useState('')

    // Initialize form when prescricao changes
    useEffect(() => {
        if (prescricao) {
            // Find patient ID by name (mock match)
            const patient = MOCK_PATIENTS.find(p => p.name === prescricao.patientName)
            setSelectedPatientId(patient?.id || '')

            // Find specialist ID by name (mock match)
            const seller = MOCK_PROFESSIONALS.find(p => p.name === prescricao.specialistName)
            setSelectedSellerId(seller?.id || '')

            setStatus(prescricao.status)

            // Load items from prescription to cart if available
            let initialItems: CartItem[] = []
            if (prescricao.items && prescricao.items.length > 0) {
                initialItems = prescricao.items
                setCartItems(initialItems)
            } else {
                setCartItems([])
            }

            // Calculate implied discount if totalValue matches sum of items
            const itemsTotal = initialItems.reduce((acc, item) => acc + item.total, 0)
            if (itemsTotal > 0 && prescricao.totalValue < itemsTotal) {
                const impliedDiscount = itemsTotal - prescricao.totalValue
                if (impliedDiscount > 0.01) {
                    setDiscountType('value')
                    setDiscountValue(impliedDiscount.toFixed(2))
                } else {
                    setDiscountValue('')
                }
            } else {
                setDiscountValue('')
            }

            setPaymentMethod('')
        }
    }, [prescricao])

    // Computed Values
    const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0)

    const discountAmount = useMemo(() => {
        const val = parseFloat(discountValue) || 0
        if (discountType === 'value') return val
        return subtotal * (val / 100)
    }, [discountValue, discountType, subtotal])

    const total = Math.max(0, subtotal - discountAmount)

    const handleAddProduct = () => {
        const product = MOCK_PRODUCTS.find(p => p.id === selectedProductId)
        if (!product) return

        const newItem: CartItem = {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            unitPrice: product.price,
            total: product.price * quantity
        }

        setCartItems(prev => [...prev, newItem])
        setSelectedProductId('')
        setQuantity(1)
    }

    const handleRemoveItem = (index: number) => {
        setCartItems(prev => prev.filter((_, i) => i !== index))
    }

    const handleSave = () => {
        if (!prescricao) return

        const updatedPrescricao: Prescription = {
            ...prescricao,
            patientName: MOCK_PATIENTS.find(p => p.id === selectedPatientId)?.name || prescricao.patientName,
            specialistName: MOCK_PROFESSIONALS.find(p => p.id === selectedSellerId)?.name || prescricao.specialistName,
            totalValue: total > 0 ? total : prescricao.totalValue,
            status: paymentMethod ? 'Convertida' : status
        }

        onSave?.(updatedPrescricao)
        toast.success('Alterações salvas com sucesso!')
        onClose(false)
    }

    const selectedProductDetails = MOCK_PRODUCTS.find(p => p.id === selectedProductId)

    return (
        <Dialog open={isOpen} onOpenChange={(v) => onClose(v)}>
            <DialogContent className="max-w-[1200px] w-full bg-white dark:bg-[#0c1e3d] rounded-[24px] border-none p-0 overflow-hidden h-[90vh] flex flex-col shadow-2xl outline-none ring-0">

                {/* Header */}
                <div className="px-8 py-6 bg-white dark:bg-[#0c1e3d] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-[#0039A6]/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-[#0039A6] dark:text-blue-400">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Editar Venda / Prescrição</DialogTitle>
                            <p className="text-base text-gray-500 dark:text-gray-400 font-normal">
                                Editando: {prescricao?.number}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="hidden md:block">
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Atual</p>
                            <p className="text-3xl font-bold text-[#0039A6] dark:text-blue-400 leading-none">
                                R$ {(total > 0 ? total : prescricao?.totalValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-hidden grid grid-cols-12 relative">

                    {/* LEFT COLUMN: Products & Cart (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 p-8 overflow-y-auto bg-gray-50/50 dark:bg-black/20 border-r border-gray-100 dark:border-gray-800 flex flex-col gap-8">

                        {/* 1. Who is buying/selling */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 uppercase tracking-wide">
                                    <User size={16} className="text-blue-500" />
                                    Paciente
                                </Label>
                                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                                    <SelectTrigger className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 focus:ring-blue-500 text-gray-900 dark:text-white font-medium">
                                        <SelectValue preferPlaceholder placeholder="Selecione o paciente..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_PATIENTS.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 uppercase tracking-wide">
                                    <CheckCircle2 size={16} className="text-blue-500" />
                                    Vendedor
                                </Label>
                                <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                                    <SelectTrigger className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 focus:ring-blue-500 text-gray-900 dark:text-white font-medium">
                                        <SelectValue preferPlaceholder placeholder="Profissional responsável" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_PROFESSIONALS.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* 2. Add Products */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Package className="text-[#0039A6] dark:text-blue-400" />
                                Adicionar Produtos
                            </h3>

                            <div className="flex gap-4 items-end bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex-1 space-y-2">
                                    <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Buscar Produto</Label>
                                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                                        <SelectTrigger className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 text-base text-gray-900 dark:text-white font-medium focus:ring-[#0039A6]">
                                            <SelectValue preferPlaceholder placeholder="Selecione um produto..." />
                                        </SelectTrigger>
                                        <SelectContent className="min-w-[400px]">
                                            {MOCK_PRODUCTS.map(p => (
                                                <SelectItem key={p.id} value={p.id} className="cursor-pointer py-3">
                                                    <div className="flex justify-between items-center w-full min-w-[300px]">
                                                        <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-gray-500">Stock: {p.stock}</span>
                                                            <span className="font-bold text-[#0039A6] dark:text-blue-400">R$ {p.price.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-24 space-y-2">
                                    <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Qtd.</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 text-center text-lg font-semibold text-gray-900 dark:text-white focus-visible:ring-[#0039A6]"
                                    />
                                </div>

                                <div className="w-32 space-y-2">
                                    <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Unitário</Label>
                                    <div className="h-12 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-xl text-base font-bold text-gray-700 dark:text-gray-300">
                                        R$ {selectedProductDetails?.price.toFixed(2) || '0.00'}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAddProduct}
                                    disabled={!selectedProductId}
                                    className="h-12 px-8 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white font-bold text-sm uppercase tracking-wide shadow-lg shadow-blue-900/20 shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Adicionar
                                </Button>
                            </div>
                        </div>

                        {/* 3. Cart Table */}
                        <div className="flex-1 flex flex-col min-h-[250px] bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-white/5">
                                    <TableRow className="border-b-gray-100 dark:border-b-gray-800 hover:bg-transparent">
                                        <TableHead className="py-4 pl-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</TableHead>
                                        <TableHead className="py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qtd</TableHead>
                                        <TableHead className="py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit.</TableHead>
                                        <TableHead className="py-4 text-right pr-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center hover:bg-transparent">
                                                <div className="flex flex-col items-center justify-center text-gray-400 gap-4 opacity-50">
                                                    <div className="h-20 w-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                                        <ShoppingBag size={40} strokeWidth={1.5} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-medium">O carrinho está vazio</p>
                                                        <p className="text-sm">Adicione produtos acima para começar</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        cartItems.map((item, idx) => (
                                            <TableRow key={idx} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors border-b-gray-100 dark:border-b-gray-800">
                                                <TableCell className="pl-6 py-5">
                                                    <span className="font-semibold text-gray-900 dark:text-white text-base">{item.productName}</span>
                                                </TableCell>
                                                <TableCell className="text-center py-5">
                                                    <Badge variant="outline" className="px-3 py-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white font-bold text-sm rounded-lg">
                                                        {item.quantity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right py-5 text-gray-600 dark:text-gray-400 font-medium">
                                                    R$ {item.unitPrice.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-5 font-bold text-[#0039A6] dark:text-blue-400 text-base">
                                                    R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className="py-5 pr-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveItem(idx)}
                                                        className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Finance & Totals (4 cols) */}
                    <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#0c1e3d] flex flex-col h-full border-l border-gray-100 dark:border-gray-800 shadow-2xl z-10 relative overflow-hidden">

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                                <CreditCard className="h-6 w-6 text-[#0039A6] dark:text-blue-400" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Status e Pagamento
                                </h3>
                            </div>

                            <div className="space-y-8">

                                {/* Status Override */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">Status da Venda</Label>
                                    <Select value={status} onValueChange={(v) => setStatus(v as 'Ativa' | 'Vencida' | 'Convertida')}>
                                        <SelectTrigger className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ativa">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    <span className="text-green-600 font-medium">Ativa (Pendente)</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Convertida">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    <span className="text-blue-600 font-medium">Convertida (Paga)</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Vencida">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                    <span className="text-red-600 font-medium">Vencida</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Forma de Pagamento
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'dinheiro', label: 'Dinheiro', icon: Banknote },
                                            { id: 'pix', label: 'PIX', icon: QrCode },
                                            { id: 'cartao_credito', label: 'Crédito', icon: CreditCard },
                                            { id: 'cartao_debito', label: 'Débito', icon: CreditCard },
                                        ].map((method) => (
                                            <button
                                                type="button"
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id === paymentMethod ? '' : method.id)}
                                                className={`
                                                    h-20 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center justify-center gap-2
                                                    ${paymentMethod === method.id
                                                        ? 'border-[#0039A6] bg-blue-50 dark:bg-blue-900/20 text-[#0039A6] dark:text-blue-400 shadow-lg ring-1 ring-blue-500/50 scale-[1.02]'
                                                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/10'}
                                                `}
                                            >
                                                <method.icon className={`h-6 w-6 ${paymentMethod === method.id ? 'text-[#0039A6] dark:text-blue-400' : 'text-gray-400'}`} />
                                                <span>{method.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">Desconto</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Select value={discountType} onValueChange={(v) => setDiscountType(v as 'value' | 'percent')}>
                                            <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-base font-medium text-gray-900 dark:text-white shadow-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="value">Valor (R$)</SelectItem>
                                                <SelectItem value="percent">Porcentagem (%)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="relative w-full">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                                {discountType === 'value' ? 'R$' : '%'}
                                            </span>
                                            <Input
                                                type="number"
                                                placeholder="0,00"
                                                value={discountValue}
                                                onChange={(e) => setDiscountValue(e.target.value)}
                                                className="h-14 pl-12 rounded-xl bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-lg font-semibold text-gray-900 dark:text-white shadow-sm w-full focus:ring-[#0039A6] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                                <div className="flex justify-between text-base text-gray-600 dark:text-gray-400 font-medium">
                                    <span>Subtotal</span>
                                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-base text-green-600 dark:text-green-400 font-bold">
                                        <span>Desconto</span>
                                        <span>- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white mb-1">Total Final</span>
                                    <div className="text-right">
                                        <span className="text-4xl font-extrabold text-[#0039A6] dark:text-blue-400 leading-none tracking-tight">
                                            R$ {(total > 0 ? total : prescricao?.totalValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Fixed Button Area */}
                        <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c1e3d] shrink-0">
                            <div className="space-y-3">
                                <Button
                                    onClick={handleSave}
                                    className="w-full h-14 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white font-bold shadow-xl shadow-blue-900/20 text-lg transition-all hover:scale-[1.02] active:scale-98 uppercase tracking-wide"
                                >
                                    Salvar Alterações
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => onClose(false)}
                                    className="w-full h-12 rounded-xl font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

