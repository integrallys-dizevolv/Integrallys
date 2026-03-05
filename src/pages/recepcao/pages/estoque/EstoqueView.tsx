import React, { useEffect, useMemo, useState } from 'react'
import {
    Package,
    Search,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Edit,
    Trash2,
    MoreVertical
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { type InventaryItem } from '@/mocks/estoque.mock'
import { EditarProdutoModal, ExcluirProdutoModal, EntradaEstoqueModal, SaidaEstoqueModal } from './modals'
import type { EntradaEstoqueData } from './modals/EntradaEstoqueModal'
import type { SaidaEstoqueData } from './modals/SaidaEstoqueModal'
import { toast } from 'sonner'
import {
    loadEstoqueItems,
    loadEstoqueMovs,
    removeItem,
    registrarEntradaEstoque,
    registrarSaidaEstoque,
    saveEditedItem,
    type EstoqueMovimentacao,
} from '@/services/estoque.service'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'

interface EstoqueViewProps {
    onPageChange?: (page: string) => void;
}

export const EstoqueView = ({ onPageChange }: EstoqueViewProps) => {
    const setCurrentPage = onPageChange;
    const [searchTerm, setSearchTerm] = useState('')
    const [items, setItems] = useState<InventaryItem[]>(() => loadEstoqueItems())

    // Modal states
    const [selectedProduto, setSelectedProduto] = useState<InventaryItem | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false)
    const [isSaidaModalOpen, setIsSaidaModalOpen] = useState(false)
    const [movimentacoes, setMovimentacoes] = useState<EstoqueMovimentacao[]>(() => loadEstoqueMovs())

    useEffect(() => {
        if (typeof window === 'undefined') return

        const syncFromStorage = () => {
            setItems(loadEstoqueItems())
            setMovimentacoes(loadEstoqueMovs())
        }

        window.addEventListener('storage', syncFromStorage)
        return () => window.removeEventListener('storage', syncFromStorage)
    }, [])

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm, items])

    const criticalCount = items.filter(i => i.status === 'low' || i.status === 'critical').length

    // Handlers
    const handleOpenEdit = (produto: InventaryItem) => {
        setSelectedProduto(produto)
        setIsEditModalOpen(true)
    }

    const handleOpenDelete = (produto: InventaryItem) => {
        setSelectedProduto(produto)
        setIsDeleteModalOpen(true)
    }

    const handleSaveEdit = (updatedProduto: InventaryItem) => {
        const nextItems = saveEditedItem(updatedProduto)
        setItems(nextItems)
    }

    const handleConfirmDelete = (produto: InventaryItem) => {
        const nextItems = removeItem(produto.id)
        setItems(nextItems)
    }

    const handleEntrada = (data: EntradaEstoqueData, options?: { atualizarCustoExistente?: boolean }) => {
        const next = registrarEntradaEstoque(data, options)
        setItems(next.items)
        setMovimentacoes(next.movimentacoes)

        toast.success('Entrada registrada com sucesso.')
        if (next.novoProdutoIncompleto) {
            toast.info('Produto criado a partir da NF. Finalize o cadastro com preço de venda, estoque mínimo, NCM e tributação.')
        }
    }

    const handleSaida = (data: SaidaEstoqueData) => {
        const result = registrarSaidaEstoque(data)
        if (!result.ok) {
            toast.error(result.error)
            return
        }

        setItems(result.items)
        setMovimentacoes(result.movimentacoes)

        toast.success('Saída registrada com sucesso.')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setCurrentPage?.('inicio')} className="cursor-pointer text-app-text-primary/70 dark:text-white/80 hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Estoque</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-normal text-app-text-primary dark:text-white tracking-tight italic">Estoque & suprimentos</h1>
                    <p className="text-app-text-secondary dark:text-white/60 font-normal mt-1">Gerenciamento completo de estoque</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        onClick={() => setIsEntradaModalOpen(true)}
                        className="flex-1 md:flex-none h-11 md:h-12 px-6 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0039A6]/10 transition-all active:scale-[0.98]"
                    >
                        <ArrowUpRight size={18} />
                        Entrada
                    </Button>
                    <Button
                        onClick={() => setIsSaidaModalOpen(true)}
                        className="flex-1 md:flex-none h-11 md:h-12 px-6 bg-[#E53E3E] hover:bg-[#C53030] text-white font-normal rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 transition-all active:scale-[0.98]"
                    >
                        <ArrowDownRight size={18} />
                        Saída
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted group-focus-within:text-[#0039A6] transition-colors" />
                <Input
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 md:h-14 pl-12 pr-4 bg-app-card dark:bg-app-card-dark border-app-border dark:border-app-border-dark rounded-2xl text-sm md:text-base focus:ring-2 focus:ring-[#0039A6] outline-none shadow-sm transition-all"
                />
            </div>

            <Card className="rounded-[24px] border border-app-border dark:border-app-border-dark shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-5 border-b border-app-border/50 dark:border-app-border-dark/50">
                        <h3 className="text-lg font-normal text-app-text-primary dark:text-white">Movimentações de estoque</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {movimentacoes.length === 0 ? (
                            <p className="text-sm text-app-text-muted">Sem movimentações registradas nesta sessão.</p>
                        ) : movimentacoes.slice(0, 8).map((mov) => (
                            <div key={mov.id} className="rounded-xl border border-app-border dark:border-app-border-dark p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-normal text-app-text-primary dark:text-white">{mov.produto}</p>
                                    <span className={`text-xs px-2.5 py-1 rounded-full ${mov.tipo === 'entrada' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                                        {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                    </span>
                                </div>
                                <p className="text-xs text-app-text-secondary dark:text-white/70 mt-1">{mov.data} • Qtd: {mov.quantidade}</p>
                                <p className="text-xs text-app-text-muted mt-1">{mov.detalhe}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Alert Banner */}
            {criticalCount > 0 && (
                <div className="bg-[#FFFBEB] dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-4 md:p-5 rounded-[20px] flex items-center gap-3 animate-in slide-in-from-top-2 duration-500">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-amber-500 flex-shrink-0">
                        <AlertCircle size={22} className="md:h-6 md:w-6" />
                    </div>
                    <p className="text-sm md:text-base font-normal text-amber-800 dark:text-amber-400">
                        {criticalCount} produto(s) com estoque baixo ou crítico
                    </p>
                </div>
            )}

            {/* List Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-normal text-app-text-primary dark:text-white">Produtos em estoque</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredItems.map((item) => (
                        <Card key={item.id} className="group overflow-hidden rounded-[24px] border-none bg-app-card dark:bg-app-card-dark shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-4 md:p-6 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-app-bg-secondary dark:bg-white/5 flex items-center justify-center text-app-text-muted group-hover:scale-110 transition-transform">
                                        <Package size={24} className="md:h-7 md:w-7" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-md md:text-lg font-normal text-app-text-primary dark:text-white truncate">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs md:text-sm text-app-text-secondary dark:text-white/60 font-normal">
                                            {item.category}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-6">
                                    <div className="text-right space-y-0.5">
                                        <p className="text-sm md:text-md font-normal text-app-text-primary dark:text-white">
                                            Qtd: {item.quantity}
                                        </p>
                                        <p className="text-[10px] md:text-xs text-app-text-muted dark:text-white/50 font-normal uppercase tracking-wider">
                                            Mín: {item.minQuantity}
                                        </p>
                                    </div>

                                    <span className={`px-4 py-1.5 rounded-full text-xs font-normal shadow-sm text-white whitespace-nowrap ${item.status === 'available'
                                        ? 'bg-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-100'
                                        : item.status === 'low'
                                            ? 'bg-amber-500 dark:bg-amber-900/60 dark:text-amber-100'
                                            : 'bg-red-600 dark:bg-red-900/60 dark:text-red-100'
                                        }`}>
                                        {item.status === 'available' ? 'Disponível' : item.status === 'low' ? 'Estoque baixo' : 'Crítico'}
                                    </span>

                                    {/* Actions Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-10 w-10 rounded-xl flex items-center justify-center text-app-text-muted hover:text-app-text-secondary hover:bg-app-bg-secondary dark:hover:bg-white/10 transition-colors">
                                                <MoreVertical size={20} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                            <DropdownMenuItem
                                                onClick={() => handleOpenEdit(item)}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <Edit size={16} />
                                                Editar produto
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleOpenDelete(item)}
                                                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                                Excluir produto
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 bg-app-bg-secondary/50 dark:bg-white/5 rounded-[32px] border-2 border-dashed border-app-border dark:border-app-border-dark">
                            <Package className="mx-auto h-12 w-12 text-app-text-muted" />
                            <h3 className="mt-4 text-lg font-normal text-app-text-primary dark:text-white">Nenhum produto encontrado</h3>
                            <p className="text-app-text-muted text-sm font-normal">Tente ajustar sua busca para encontrar o item desejado.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <EditarProdutoModal
                isOpen={isEditModalOpen}
                onClose={setIsEditModalOpen}
                produto={selectedProduto}
                onSave={handleSaveEdit}
            />

            <ExcluirProdutoModal
                isOpen={isDeleteModalOpen}
                onClose={setIsDeleteModalOpen}
                produto={selectedProduto}
                onConfirm={handleConfirmDelete}
            />

            <EntradaEstoqueModal
                isOpen={isEntradaModalOpen}
                onClose={setIsEntradaModalOpen}
                items={items}
                onConfirm={handleEntrada}
            />

            <SaidaEstoqueModal
                isOpen={isSaidaModalOpen}
                onClose={setIsSaidaModalOpen}
                items={items}
                onConfirm={handleSaida}
            />
        </div>
    )
}
