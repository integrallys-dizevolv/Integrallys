import React, { useEffect, useMemo, useState } from 'react'
import {
    DollarSign,
    CheckCircle,
    Search,
    Plus,
    Eye,
    Edit3,
    Trash2,
    MoreHorizontal,
    AlertCircle,
    FileText,
    RefreshCcw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { EmitirNovaCobrancaModal } from '@/pages/admin/pages/financeiro/modals/EmitirNovaCobrancaModal'
import { NovaPrescricaoModal } from '@/pages/especialista/pages/prescricoes/modals/NovaPrescricaoModal'
import { MOCK_RECEIVABLES } from '@/mocks/recepcionista/recebimentos'
import type { ReceivableItem } from '@/mocks/recepcionista/recebimentos'
import { toast } from 'sonner'

interface RecebimentosViewProps {
    onPageChange?: (page: string) => void;
}

const STORAGE_KEY = 'recepcao_recebimentos_mock_db'

const getStatusLabel = (status: ReceivableItem['status']) => {
    if (status === 'pago') return 'Pago'
    if (status === 'pendente') return 'A vencer'
    return 'Atrasado'
}

const getMetodoLabel = (method: string) => {
    const value = method.toLowerCase()
    if (value.includes('cartao') || value.includes('cartão')) return 'Cartão'
    if (value === 'pix') return 'Pix'
    if (value === 'dinheiro') return 'Dinheiro'
    if (value === 'boleto') return 'Boleto'
    return method
}

export const RecebimentosView = ({ onPageChange }: RecebimentosViewProps) => {
    const setCurrentPage = onPageChange
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('todos')
    const [methodFilter, setMethodFilter] = useState('todos')
    const [receivables, setReceivables] = useState<ReceivableItem[]>(() => {
        if (typeof window === 'undefined') return MOCK_RECEIVABLES
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY)
            if (!raw) return MOCK_RECEIVABLES
            const parsed = JSON.parse(raw)
            return Array.isArray(parsed) ? parsed as ReceivableItem[] : MOCK_RECEIVABLES
        } catch {
            return MOCK_RECEIVABLES
        }
    })

    useEffect(() => {
        if (typeof window === 'undefined') return
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(receivables))
    }, [receivables])

    const [isCobrancaOpen, setIsCobrancaOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isReverseOpen, setIsReverseOpen] = useState(false)
    const [isNovaVendaOpen, setIsNovaVendaOpen] = useState(false)
    const [isMovimentacaoOpen, setIsMovimentacaoOpen] = useState(false)
    const [isResumoOpen, setIsResumoOpen] = useState(false)
    const [resumoTipo, setResumoTipo] = useState<'recebido' | 'pendente' | 'registros' | null>(null)

    const [selectedItem, setSelectedItem] = useState<ReceivableItem | null>(null)
    const [editForm, setEditForm] = useState({ description: '', value: '' })
    const [movForm, setMovForm] = useState({
        dataEmissao: new Date().toISOString().split('T')[0],
        devedor: '',
        descricao: '',
        valor: '',
        forma: 'dinheiro',
        parcela: '1/1',
        dataVencimento: new Date().toISOString().split('T')[0],
        categoria: 'Atendimento'
    })

    const totalRecebido = useMemo(
        () => receivables.filter(r => r.status === 'pago').reduce((acc, curr) => acc + curr.value, 0),
        [receivables]
    )
    const totalPendente = useMemo(
        () => receivables.filter(r => r.status === 'pendente' || r.status === 'atrasado').reduce((acc, curr) => acc + curr.value, 0),
        [receivables]
    )

    const abrirResumo = (tipo: 'recebido' | 'pendente' | 'registros') => {
        setResumoTipo(tipo)
        setIsResumoOpen(true)
    }

    const filteredReceivables = useMemo(() => {
        return receivables.filter((r) => {
            const matchesSearch = r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.method.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === 'todos'
                ? true
                : statusFilter === 'unpaid'
                    ? (r.status === 'pendente' || r.status === 'atrasado')
                    : r.status === statusFilter

            const matchesMethod = methodFilter === 'todos' || r.method.toLowerCase().includes(methodFilter.toLowerCase())
            return matchesSearch && matchesStatus && matchesMethod
        })
    }, [receivables, searchTerm, statusFilter, methodFilter])

    const resumoItens = useMemo(() => {
        if (resumoTipo === 'recebido') {
            return filteredReceivables.filter((r) => r.status === 'pago')
        }
        if (resumoTipo === 'pendente') {
            return filteredReceivables.filter((r) => r.status === 'pendente' || r.status === 'atrasado')
        }
        return filteredReceivables
    }, [filteredReceivables, resumoTipo])

    const openCobranca = (item: ReceivableItem | null) => {
        setSelectedItem(item)
        setIsCobrancaOpen(true)
    }

    const handleConfirmCobranca = (payload: {
        valor: number
        metodo: string
        observacao?: string
        data: string
    }) => {
        if (!selectedItem) return

        setReceivables((prev) =>
            prev.map((item) => {
                if (item.id !== selectedItem.id) return item

                const pagamentosAtuais = item.pagamentos || []
                const novosPagamentos = [
                    ...pagamentosAtuais,
                    { data: payload.data, valor: payload.valor, metodo: payload.metodo }
                ]
                const totalPago = novosPagamentos.reduce((acc, p) => acc + p.valor, 0)
                const saldo = Math.max(0, item.value - totalPago)
                const status: ReceivableItem['status'] = saldo <= 0
                    ? 'pago'
                    : item.status === 'atrasado'
                        ? 'atrasado'
                        : 'pendente'

                return {
                    ...item,
                    status,
                    pagamentos: novosPagamentos,
                    description: payload.observacao
                        ? `${item.description || ''} ${item.description ? '• ' : ''}${payload.observacao}`.trim()
                        : item.description
                }
            })
        )

        setSelectedItem((prev) => {
            if (!prev) return prev
            const pagamentosAtuais = prev.pagamentos || []
            const novosPagamentos = [
                ...pagamentosAtuais,
                { data: payload.data, valor: payload.valor, metodo: payload.metodo }
            ]
            const totalPago = novosPagamentos.reduce((acc, p) => acc + p.valor, 0)
            const saldo = Math.max(0, prev.value - totalPago)
            return {
                ...prev,
                status: saldo <= 0 ? 'pago' : prev.status === 'atrasado' ? 'atrasado' : 'pendente',
                pagamentos: novosPagamentos,
                description: payload.observacao
                    ? `${prev.description || ''} ${prev.description ? '• ' : ''}${payload.observacao}`.trim()
                    : prev.description
            }
        })

        toast.success('Recebimento registrado com sucesso.')
    }

    const openDetails = (item: ReceivableItem) => {
        setSelectedItem(item)
        setIsDetailsOpen(true)
    }

    const openEdit = (item: ReceivableItem) => {
        setSelectedItem(item)
        setEditForm({ description: item.description || '', value: String(item.value) })
        setIsEditOpen(true)
    }

    const saveEdit = () => {
        if (!selectedItem) return
        const nextValue = Number(String(editForm.value).replace(',', '.')) || selectedItem.value
        setReceivables((prev) => prev.map((r) =>
            r.id === selectedItem.id
                ? { ...r, description: editForm.description, value: nextValue }
                : r
        ))
        setIsEditOpen(false)
        toast.success('Recebimento atualizado.')
    }

    const openReverse = (item: ReceivableItem) => {
        setSelectedItem(item)
        setIsReverseOpen(true)
    }

    const confirmReverse = () => {
        if (!selectedItem) return
        setReceivables((prev) => prev.map((r) => r.id === selectedItem.id ? { ...r, status: 'pendente' } : r))
        setIsReverseOpen(false)
        toast.success('Estorno registrado.')
    }

    const openDelete = (item: ReceivableItem) => {
        setSelectedItem(item)
        setIsDeleteOpen(true)
    }

    const confirmDelete = () => {
        if (!selectedItem) return
        setReceivables((prev) => prev.filter((r) => r.id !== selectedItem.id))
        setIsDeleteOpen(false)
        toast.success('Recebimento removido.')
    }

    const printComprovante = (item: ReceivableItem) => {
        const w = window.open('', '_blank', 'width=720,height=880')
        if (!w) {
            toast.error('Não foi possível abrir o comprovante para impressão.')
            return
        }
        w.document.write(`
          <html>
            <head><title>Comprovante de Recebimento</title></head>
            <body style="font-family: Arial, sans-serif; padding: 24px;">
              <h2>Comprovante de Recebimento</h2>
              <p><strong>Paciente:</strong> ${item.patientName}</p>
              <p><strong>Procedimento:</strong> ${item.procedure}</p>
              <p><strong>Valor:</strong> R$ ${item.value.toFixed(2)}</p>
              <p><strong>Vencimento:</strong> ${item.dueDate}</p>
              <p><strong>Status:</strong> ${getStatusLabel(item.status)}</p>
            </body>
          </html>
        `)
        w.document.close()
        w.focus()
        w.print()
    }

    const salvarMovimentacao = () => {
        const valor = Number(String(movForm.valor).replace(',', '.')) || 0
        if (!movForm.devedor.trim()) {
            toast.error('Informe o devedor.')
            return
        }
        if (!movForm.descricao.trim()) {
            toast.error('Informe a descrição da movimentação.')
            return
        }
        if (valor <= 0) {
            toast.error('Informe um valor maior que zero.')
            return
        }

        const hojeIso = new Date().toISOString().split('T')[0]
        const status: ReceivableItem['status'] = movForm.dataVencimento < hojeIso ? 'atrasado' : 'pendente'

        const novo: ReceivableItem = {
            id: `mov-${Date.now()}`,
            patientName: movForm.devedor || 'Cliente não informado',
            date: movForm.dataEmissao.split('-').reverse().join('/'),
            procedure: 'Movimentacao',
            description: `${movForm.categoria} - ${movForm.descricao || 'Recebimento manual'} (${movForm.parcela})`,
            value: valor,
            method: movForm.forma,
            dueDate: movForm.dataVencimento.split('-').reverse().join('/'),
            status,
            pagamentos: []
        }
        setReceivables((prev) => [novo, ...prev])
        setIsMovimentacaoOpen(false)
        setMovForm({
            dataEmissao: new Date().toISOString().split('T')[0],
            devedor: '',
            descricao: '',
            valor: '',
            forma: 'dinheiro',
            parcela: '1/1',
            dataVencimento: new Date().toISOString().split('T')[0],
            categoria: 'Atendimento'
        })
        toast.success('Movimentação registrada.')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setCurrentPage?.('inicio')} className="cursor-pointer text-app-text-primary/70 dark:text-white/80 hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Recebimentos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    onClick={() => abrirResumo('recebido')}
                    className="p-6 md:p-8 rounded-[24px] shadow-sm flex items-center justify-between bg-white dark:bg-[#0c1e3d] border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
                >
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-app-text-secondary dark:text-white/60">Total Recebido</p>
                        <h2 className="text-2xl md:text-3xl font-medium text-green-600">R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                        <DollarSign size={28} />
                    </div>
                </Card>
                <Card
                    onClick={() => abrirResumo('pendente')}
                    className="p-6 md:p-8 rounded-[24px] shadow-sm flex items-center justify-between bg-white dark:bg-[#0c1e3d] border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
                >
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-app-text-secondary dark:text-white/60">Total a vencer/futuro</p>
                        <h2 className="text-2xl md:text-3xl font-medium text-amber-600">R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                        <AlertCircle size={28} />
                    </div>
                </Card>
                <Card
                    onClick={() => abrirResumo('registros')}
                    className="p-6 md:p-8 rounded-[24px] shadow-sm flex items-center justify-between bg-white dark:bg-[#0c1e3d] border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
                >
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-app-text-secondary dark:text-white/60">Total de Registros</p>
                        <h2 className="text-2xl md:text-3xl font-medium text-blue-600">{filteredReceivables.length}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <CheckCircle size={28} />
                    </div>
                </Card>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
                    <div className="relative w-full sm:max-w-xs lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar recebimentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-app-card dark:bg-app-card-dark border border-app-border dark:border-app-border-dark rounded-xl text-sm focus:ring-2 focus:ring-[#0039A6] outline-none shadow-sm transition-all font-normal"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-40 h-11 text-xs">
                                <SelectValue preferPlaceholder placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos os status</SelectItem>
                                <SelectItem value="pago">Pago</SelectItem>
                                <SelectItem value="unpaid">A vencer e atrasados</SelectItem>
                                <SelectItem value="pendente">Apenas a vencer</SelectItem>
                                <SelectItem value="atrasado">Apenas atrasado</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={methodFilter} onValueChange={setMethodFilter}>
                            <SelectTrigger className="w-full sm:w-40 h-11 text-xs">
                                <SelectValue preferPlaceholder placeholder="Forma" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas as formas</SelectItem>
                                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                <SelectItem value="pix">Pix</SelectItem>
                                <SelectItem value="cartao">Cartão</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button variant="outline" onClick={() => setIsNovaVendaOpen(true)} className="w-full sm:w-auto h-11 md:h-12 px-6 rounded-xl font-normal border-app-border dark:border-app-border-dark text-app-text-secondary dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center gap-2">
                        <Plus size={18} />
                        Nova Prescrição/Vendas
                    </Button>
                    <Button onClick={() => setIsMovimentacaoOpen(true)} className="w-full sm:w-auto h-11 md:h-12 px-6 rounded-xl font-normal bg-[#0039A6] hover:bg-[#002d82] text-white flex items-center gap-2 shadow-lg shadow-[#0039A6]/10 transition-all active:scale-[0.98]">
                        <Plus size={18} />
                        Registrar recebimento
                    </Button>
                </div>
            </div>

            <Card className="rounded-[24px] border border-app-border dark:border-app-border-dark shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-6 md:p-8 border-b border-app-border/50 dark:border-app-border-dark/50">
                        <h3 className="text-lg font-normal text-app-text-primary dark:text-white">Lista de recebimentos ({filteredReceivables.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-8 font-normal">Paciente</TableHead>
                                    <TableHead className="font-normal">Procedimento</TableHead>
                                    <TableHead className="font-normal">Valor</TableHead>
                                    <TableHead className="font-normal">Vencimento</TableHead>
                                    <TableHead className="font-normal">Status</TableHead>
                                    <TableHead className="text-center pr-8 font-normal">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReceivables.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="pl-8">
                                            <div className="space-y-0.5 py-2">
                                                <p className="font-normal text-app-text-primary dark:text-white/90">{r.patientName}</p>
                                                <p className="text-xs text-app-text-secondary dark:text-white/60 font-normal">{r.date}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5 py-2">
                                                <p className="text-app-text-secondary dark:text-white/80 font-medium">{r.procedure}</p>
                                                {r.description && <p className="text-[11px] text-app-text-muted dark:text-white/50 italic">{r.description}</p>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5 py-2">
                                                <p className="font-bold text-app-text-primary dark:text-white">R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                {r.method && <p className="text-[11px] text-app-text-muted dark:text-white/50 font-medium">{r.method}</p>}
                                            </div>
                                        </TableCell>
                                        <TableCell><span className="text-app-text-secondary dark:text-white/80 font-medium">{r.dueDate}</span></TableCell>
                                        <TableCell>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-normal shadow-sm ${r.status === 'pago' ? 'bg-emerald-600 text-white' : r.status === 'pendente' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'}`}>
                                                {getStatusLabel(r.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center pr-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 mx-auto">
                                                        <MoreHorizontal className="h-4 w-4 text-app-text-secondary dark:text-white/60" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-[12px] dark:bg-app-card-dark dark:border-app-border-dark">
                                                    <DropdownMenuItem onClick={() => openDetails(r)} className="gap-2"><Eye size={14} className="text-gray-400" />Visualizar</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEdit(r)} className="gap-2"><Edit3 size={14} className="text-gray-400" />Editar</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openReverse(r)} className="gap-2"><RefreshCcw size={14} className="text-gray-400" />Estorno</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openCobranca(r)} className="gap-2"><FileText size={14} className="text-gray-400" />Emitir cobrança</DropdownMenuItem>
                                                    {r.status === 'pago' && (
                                                        <DropdownMenuItem onClick={() => printComprovante(r)} className="gap-2"><FileText size={14} className="text-gray-400" />Imprimir comprovante</DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => openDelete(r)} className="gap-2 text-red-600 dark:text-red-400"><Trash2 size={14} />Excluir</DropdownMenuItem>
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

            <EmitirNovaCobrancaModal
                isOpen={isCobrancaOpen}
                onClose={() => setIsCobrancaOpen(false)}
                paciente={selectedItem?.patientName}
                horario={selectedItem?.date}
                procedimento={selectedItem?.procedure}
                valorProcedimento={selectedItem?.value}
                pagamentos={selectedItem?.pagamentos}
                onConfirm={handleConfirmCobranca}
            />

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-[560px] rounded-[24px] overflow-hidden">
                    <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                        <DialogTitle>Detalhes do recebimento</DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-5 space-y-2 text-sm">
                        <p><strong>Paciente:</strong> {selectedItem?.patientName}</p>
                        <p><strong>Procedimento:</strong> {selectedItem?.procedure}</p>
                        <p><strong>Descrição:</strong> {selectedItem?.description || '-'}</p>
                        <p><strong>Forma:</strong> {selectedItem ? getMetodoLabel(selectedItem.method) : '-'}</p>
                        <p><strong>Valor:</strong> R$ {selectedItem?.value.toFixed(2)}</p>
                        <p><strong>Vencimento:</strong> {selectedItem?.dueDate}</p>
                        <p><strong>Status:</strong> {selectedItem ? getStatusLabel(selectedItem.status) : '-'}</p>
                    </div>
                    <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-[560px] rounded-[24px] overflow-hidden">
                    <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                        <DialogTitle>Editar recebimento</DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-5 space-y-3">
                        <Input value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descrição" />
                        <Input value={editForm.value} onChange={(e) => setEditForm((prev) => ({ ...prev, value: e.target.value }))} placeholder="Valor" />
                    </div>
                    <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                        <Button onClick={saveEdit} className="bg-[#0039A6] hover:bg-[#002d82] text-white">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isReverseOpen} onOpenChange={setIsReverseOpen}>
                <DialogContent className="max-w-[520px] rounded-[24px] overflow-hidden">
                    <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                        <DialogTitle>Confirmar estorno</DialogTitle>
                        <DialogDescription>O status será alterado para A vencer.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                        <Button variant="outline" onClick={() => setIsReverseOpen(false)}>Cancelar</Button>
                        <Button onClick={confirmReverse} className="bg-[#0039A6] hover:bg-[#002d82] text-white">Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-[520px] rounded-[24px] overflow-hidden">
                    <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                        <DialogTitle>Excluir recebimento</DialogTitle>
                        <DialogDescription>Essa ação remove o registro da lista.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancelar</Button>
                        <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Excluir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isResumoOpen} onOpenChange={setIsResumoOpen}>
                <DialogContent className="max-w-[680px] rounded-[24px] overflow-hidden">
                    <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                        <DialogTitle>
                            {resumoTipo === 'recebido' && 'Detalhamento — Total Recebido'}
                            {resumoTipo === 'pendente' && 'Detalhamento — Total a vencer/futuro'}
                            {resumoTipo === 'registros' && 'Detalhamento — Total de Registros'}
                        </DialogTitle>
                        <DialogDescription>
                            {resumoItens.length} registro(s) conforme filtros aplicados.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="px-6 py-5 space-y-3 max-h-[55vh] overflow-y-auto">
                        {resumoItens.length === 0 ? (
                            <p className="text-sm text-app-text-muted">Nenhum recebimento encontrado.</p>
                        ) : resumoItens.map((item) => (
                            <div key={item.id} className="rounded-xl border border-app-border dark:border-app-border-dark p-3">
                                <p className="text-sm font-normal text-app-text-primary dark:text-white">{item.patientName}</p>
                                <p className="text-xs text-app-text-secondary dark:text-white/70">{item.procedure} • {item.dueDate}</p>
                                <p className="text-xs text-app-text-muted">{getMetodoLabel(item.method)} • {getStatusLabel(item.status)} • R$ {item.value.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                        <Button variant="outline" onClick={() => setIsResumoOpen(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <NovaPrescricaoModal isOpen={isNovaVendaOpen} onClose={() => setIsNovaVendaOpen(false)} />

            <Dialog open={isMovimentacaoOpen} onOpenChange={setIsMovimentacaoOpen}>
                <DialogContent className="max-w-[620px] rounded-[24px] overflow-hidden">
                    <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                        <DialogTitle>Registrar recebimento manual</DialogTitle>
                        <DialogDescription>
                            Informe emissão, devedor, forma, vencimento e categoria DRE.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="px-6 py-5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Input type="date" value={movForm.dataEmissao} onChange={(e) => setMovForm((prev) => ({ ...prev, dataEmissao: e.target.value }))} />
                            <Input type="date" value={movForm.dataVencimento} onChange={(e) => setMovForm((prev) => ({ ...prev, dataVencimento: e.target.value }))} />
                        </div>
                        <Input value={movForm.devedor} onChange={(e) => setMovForm((prev) => ({ ...prev, devedor: e.target.value }))} placeholder="Devedor" />
                        <Input value={movForm.descricao} onChange={(e) => setMovForm((prev) => ({ ...prev, descricao: e.target.value }))} placeholder="Descrição" />
                        <div className="grid grid-cols-2 gap-3">
                            <Input value={movForm.valor} onChange={(e) => setMovForm((prev) => ({ ...prev, valor: e.target.value }))} placeholder="Valor" />
                            <Input value={movForm.parcela} onChange={(e) => setMovForm((prev) => ({ ...prev, parcela: e.target.value }))} placeholder="Parcela (ex: 1/3)" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <select value={movForm.forma} onChange={(e) => setMovForm((prev) => ({ ...prev, forma: e.target.value }))} className="h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-[10px] text-sm text-app-text-primary dark:text-white">
                                <option value="dinheiro">Dinheiro</option>
                                <option value="pix">PIX</option>
                                <option value="cartao debito">Cartão Débito</option>
                                <option value="cartao credito">Cartão Crédito</option>
                                <option value="boleto">Boleto</option>
                            </select>
                            <Input value={movForm.categoria} onChange={(e) => setMovForm((prev) => ({ ...prev, categoria: e.target.value }))} placeholder="Categoria DRE" />
                        </div>
                    </div>
                    <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                        <Button variant="outline" onClick={() => setIsMovimentacaoOpen(false)}>Cancelar</Button>
                        <Button onClick={salvarMovimentacao} className="bg-[#0039A6] hover:bg-[#002d82] text-white">Registrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
