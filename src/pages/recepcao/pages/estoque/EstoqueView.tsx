import React, { useState, useMemo } from 'react'
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
import { MOCK_ESTOQUE, InventaryItem } from '@/mocks/recepcionista/estoque'
import { EditarProdutoModal, ExcluirProdutoModal } from './modals'
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
    const [items, setItems] = useState<InventaryItem[]>(MOCK_ESTOQUE)

    // Modal states
    const [selectedProduto, setSelectedProduto] = useState<InventaryItem | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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
        setItems(prev => prev.map(item =>
            item.id === updatedProduto.id ? updatedProduto : item
        ))
    }

    const handleConfirmDelete = (produto: InventaryItem) => {
        setItems(prev => prev.filter(item => item.id !== produto.id))
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
                    <Button className="flex-1 md:flex-none h-11 md:h-12 px-6 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0039A6]/10 transition-all active:scale-[0.98]">
                        <ArrowUpRight size={18} />
                        Entrada
                    </Button>
                    <Button className="flex-1 md:flex-none h-11 md:h-12 px-6 bg-[#E53E3E] hover:bg-[#C53030] text-white font-normal rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 transition-all active:scale-[0.98]">
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
        </div>
    )
}
