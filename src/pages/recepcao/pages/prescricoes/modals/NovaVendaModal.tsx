import { useState, useMemo } from 'react'
import {
    ShoppingCart,
    CheckCircle2,
    Plus,
    Trash2,
    CreditCard,
    Package,
    User,
    ShoppingBag,
    X,
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
import { Prescription } from '@/mocks/recepcionista/prescricoes'

// Mocks
const MOCK_PATIENTS = [
    { id: '1', name: 'Maria Silva', cpf: '123.456.789-00' },
    { id: '2', name: 'Pedro Costa', cpf: '234.567.890-11' },
    { id: '3', name: 'Laura Oliveira', cpf: '345.678.901-22' },
    { id: '4', name: 'Carlos Mendes', cpf: '456.789.012-33' },
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
    { id: 'prof4', name: 'Carlos Atendente', role: 'Colaborador' },
]

interface CartItem {
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
}

interface NovaVendaModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (venda: Prescription) => void
}

export function NovaVendaModal({ isOpen, onClose, onSave }: NovaVendaModalProps) {
    const [isSuccess, setIsSuccess] = useState(false)

    // Form States
    const [selectedPatientId, setSelectedPatientId] = useState('')
    const [selectedSellerId, setSelectedSellerId] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')

    // Product Selection State
    const [selectedProductId, setSelectedProductId] = useState('')
    const [quantity, setQuantity] = useState(1)

    // Cart State
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // Financial State
    const [discountType, setDiscountType] = useState<'value' | 'percent'>('value')
    const [discountValue, setDiscountValue] = useState('')

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

    const handleSave = async () => {
        const patient = MOCK_PATIENTS.find(p => p.id === selectedPatientId)
        const seller = MOCK_PROFESSIONALS.find(p => p.id === selectedSellerId)

        const newVenda: Prescription = {
            id: Math.random().toString(36).substr(2, 9),
            number: `VENDA-${Math.floor(1000 + Math.random() * 9000)}`,
            patientName: patient?.name || 'Cliente Avulso',
            specialistName: seller?.name || 'Venda Direta',
            createdAt: new Date().toLocaleDateString('pt-BR'),
            totalValue: total,
            type: 'Venda Direta',
            status: paymentMethod ? 'Convertida' : 'Ativa', // Se tiver pagamento, finaliza. Se não, fica pendente.
            generator: 'Manual',
            validity: '-'
        }

        setIsSuccess(true)
        onSave(newVenda)

        setTimeout(() => {
            setIsSuccess(false)
            resetForm()
            onClose()
        }, 2000)
    }

    const resetForm = () => {
        setSelectedPatientId('')
        setSelectedSellerId('')
        setPaymentMethod('')
        setCartItems([])
        setDiscountValue('')
        setSelectedProductId('')
        setQuantity(1)
    }

    const selectedProductDetails = MOCK_PRODUCTS.find(p => p.id === selectedProductId)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1200px] w-full bg-white dark:bg-[#0c1e3d] rounded-[24px] border-none p-0 overflow-hidden h-[90vh] flex flex-col shadow-2xl">
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-6 h-full bg-white dark:bg-[#0c1e3d]">
                        <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 animate-in zoom-in duration-300">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {paymentMethod ? 'Venda Realizada!' : 'Prescrição Salva!'}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-xl">
                                {paymentMethod
                                    ? 'Estoque atualizado e transação lançada no caixa.'
                                    : 'A prescrição foi gerada e está aguardando pagamento.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-8 py-6 bg-white dark:bg-[#0c1e3d] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-[#0039A6]/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-[#0039A6] dark:text-blue-400">
                                    <ShoppingCart className="h-6 w-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Nova Prescrição / Venda</DialogTitle>
                                    <p className="text-base text-gray-500 dark:text-gray-400 font-normal">Registre a venda de produtos e prescrições avulsas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden md:block mr-4">
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Total da Venda</p>
                                    <p className="text-2xl font-bold text-[#0039A6] dark:text-blue-400">
                                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 overflow-hidden grid grid-cols-12 bg-gray-50/30 dark:bg-black/20">

                            {/* LEFT COLUMN: Products & Cart (8 cols) */}
                            <div className="col-span-12 lg:col-span-8 p-8 overflow-y-auto border-r border-gray-100 dark:border-gray-800 flex flex-col gap-8">

                                {/* 1. Who is buying/selling */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <User size={18} className="text-blue-500" />
                                            Paciente
                                        </Label>
                                        <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                                            <SelectTrigger className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 focus:ring-blue-500 text-gray-900 dark:text-white">
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
                                        <Label className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <CheckCircle2 size={18} className="text-blue-500" />
                                            Vendedor / Profissional
                                        </Label>
                                        <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                                            <SelectTrigger className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 focus:ring-blue-500 text-gray-900 dark:text-white">
                                                <SelectValue preferPlaceholder placeholder="Quem realizou a venda?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MOCK_PROFESSIONALS.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.name} <span className="text-gray-400 text-xs ml-1">({p.role})</span>
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
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Buscar Produto</Label>
                                            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                                                <SelectTrigger className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 text-base text-gray-900 dark:text-white">
                                                    <SelectValue preferPlaceholder placeholder="Selecione um produto...">
                                                        {selectedProductId
                                                            ? MOCK_PRODUCTS.find(p => p.id === selectedProductId)?.name
                                                            : "Selecione um produto..."}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="min-w-[400px]">
                                                    {MOCK_PRODUCTS.map(p => (
                                                        <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                                                            <span className="font-medium mr-2">{p.name}</span>
                                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                                (Estoque: {p.stock}) - R$ {p.price.toFixed(2)}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="w-24 space-y-2">
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Qtd.</Label>
                                            <Input
                                                type="number"
                                                min={1}
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                className="h-12 rounded-xl bg-gray-50 dark:bg-black/20 text-center text-lg font-semibold text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        <div className="w-32 space-y-2">
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Unitário</Label>
                                            <div className="h-12 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-300">
                                                R$ {selectedProductDetails?.price.toFixed(2) || '0.00'}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleAddProduct}
                                            disabled={!selectedProductId}
                                            className="h-12 px-8 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white font-bold text-base shadow-lg shadow-blue-900/10 shrink-0"
                                        >
                                            <Plus size={20} className="mr-2" />
                                            Adicionar
                                        </Button>
                                    </div>
                                </div>

                                {/* 3. Cart Table */}
                                <div className="flex-1 flex flex-col min-h-[200px]">
                                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-white/5 flex-1 shadow-sm">
                                        <Table>
                                            <TableHeader className="bg-gray-50 dark:bg-black/20">
                                                <TableRow className="border-b-gray-100 dark:border-b-gray-800">
                                                    <TableHead className="py-4 pl-6 text-sm font-bold text-gray-700 dark:text-gray-300">Produto</TableHead>
                                                    <TableHead className="py-4 text-center font-bold text-gray-700 dark:text-gray-300">Qtd</TableHead>
                                                    <TableHead className="py-4 text-right font-bold text-gray-700 dark:text-gray-300">Unit.</TableHead>
                                                    <TableHead className="py-4 text-right pr-6 font-bold text-gray-700 dark:text-gray-300">Total</TableHead>
                                                    <TableHead className="w-12"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cartItems.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-64 text-center">
                                                            <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                                                                <ShoppingBag size={48} strokeWidth={1} />
                                                                <p className="text-lg font-medium">O carrinho está vazio</p>
                                                                <p className="text-sm">Adicione produtos para iniciar a venda</p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    cartItems.map((item, idx) => (
                                                        <TableRow key={idx} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors border-b-gray-100 dark:border-b-gray-800">
                                                            <TableCell className="pl-6 py-4">
                                                                <span className="font-semibold text-gray-900 dark:text-white text-base">{item.productName}</span>
                                                            </TableCell>
                                                            <TableCell className="text-center py-4">
                                                                <Badge variant="secondary" className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-bold text-sm">
                                                                    {item.quantity}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right py-4 text-gray-600 dark:text-gray-400">
                                                                R$ {item.unitPrice.toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="text-right pr-6 py-4 font-bold text-gray-900 dark:text-white text-base">
                                                                R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </TableCell>
                                                            <TableCell className="py-4 pr-4">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleRemoveItem(idx)}
                                                                    className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                            </div>

                            {/* RIGHT COLUMN: Finance & Totals (4 cols) */}
                            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#0c1e3d] p-8 flex flex-col h-full border-l border-gray-100 dark:border-gray-800 shadow-xl z-10">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-8">
                                    <CreditCard className="h-6 w-6 text-[#0039A6] dark:text-blue-400" />
                                    Resumo Financeiro
                                </h3>

                                <div className="space-y-8 flex-1">
                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                                            Forma de Pagamento
                                            {!paymentMethod && <span className="text-sm font-normal text-gray-400 ml-2">(Opcional p/ Pendente)</span>}
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'dinheiro', label: 'Dinheiro', icon: Banknote },
                                                { id: 'pix', label: 'PIX', icon: QrCode },
                                                { id: 'cartao_credito', label: 'Crédito', icon: CreditCard },
                                                { id: 'cartao_debito', label: 'Débito', icon: CreditCard },
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id === paymentMethod ? '' : method.id)}
                                                    className={`
                                                        h-16 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center justify-center gap-1
                                                        ${paymentMethod === method.id
                                                            ? 'border-[#0039A6] bg-blue-50 dark:bg-blue-900/20 text-[#0039A6] dark:text-blue-400 shadow-md ring-1 ring-blue-500/50'
                                                            : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/10'}
                                                    `}
                                                >
                                                    <method.icon className={`h-5 w-5 ${paymentMethod === method.id ? 'text-[#0039A6] dark:text-blue-400' : 'text-gray-400'}`} />
                                                    <span>{method.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Desconto</Label>
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
                                                    className="h-14 pl-12 rounded-xl bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-lg font-semibold text-gray-900 dark:text-white shadow-sm w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                                        <div className="flex justify-between text-base text-gray-600 dark:text-gray-400">
                                            <span>Subtotal</span>
                                            <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-base text-green-600 dark:text-green-400 font-medium">
                                                <span>Desconto</span>
                                                <span>- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                                        <div className="flex justify-between items-end">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white mb-1">Total a Pagar</span>
                                            <div className="text-right">
                                                <span className="text-3xl font-extrabold text-[#0039A6] dark:text-blue-400 leading-none">
                                                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <Button
                                        onClick={handleSave}
                                        disabled={cartItems.length === 0 || !selectedPatientId}
                                        className="w-full h-14 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white font-bold shadow-xl shadow-blue-900/20 text-lg transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {paymentMethod ? 'Finalizar Venda' : 'Salvar como Pendente'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        className="w-full h-12 rounded-xl font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

