import { useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Search, Eye, Package, Info, AlertCircle } from 'lucide-react'
import { PageHeader, StandardTable } from '../../ui'
import { VisualizarEstoqueModal } from '../../modals'

interface ProdutoEstoque {
    id: number
    nome: string
    categoria: string
    unidade: string
    aguaBoa: {
        qtd: number
        unidade: string
    }
    querencia: {
        qtd: number
        unidade: string
    }
    minimo: number
    valor: string
    status: 'Estoque baixo' | 'Normal'
}

const MOCK_ESTOQUE: ProdutoEstoque[] = [
    {
        id: 1,
        nome: 'Creatina Monohidratada',
        categoria: 'Suplementos',
        unidade: 'pote',
        aguaBoa: { qtd: 15, unidade: 'pote(s)' },
        querencia: { qtd: 8, unidade: 'pote(s)' },
        minimo: 10,
        valor: '89,90',
        status: 'Estoque baixo'
    },
    {
        id: 2,
        nome: 'Whey Protein Isolado',
        categoria: 'Suplementos',
        unidade: 'pote',
        aguaBoa: { qtd: 12, unidade: 'pote(s)' },
        querencia: { qtd: 5, unidade: 'pote(s)' },
        minimo: 10,
        valor: '149,90',
        status: 'Estoque baixo'
    },
    {
        id: 3,
        nome: 'BCAA 2:1:1',
        categoria: 'Aminoácidos',
        unidade: 'unidade',
        aguaBoa: { qtd: 30, unidade: 'unidade(s)' },
        querencia: { qtd: 25, unidade: 'unidade(s)' },
        minimo: 15,
        valor: '75,00',
        status: 'Normal'
    },
    {
        id: 4,
        nome: 'Multivitamínico A-Z',
        categoria: 'Vitaminas',
        unidade: 'caixa',
        aguaBoa: { qtd: 5, unidade: 'caixa(s)' },
        querencia: { qtd: 3, unidade: 'caixa(s)' },
        minimo: 10,
        valor: '45,00',
        status: 'Estoque baixo'
    },
    {
        id: 5,
        nome: 'Albumina Naturovos',
        categoria: 'Proteínas',
        unidade: 'pacote',
        aguaBoa: { qtd: 20, unidade: 'pacote(s)' },
        querencia: { qtd: 18, unidade: 'pacote(s)' },
        minimo: 15,
        valor: '59,90',
        status: 'Normal'
    },
]

interface EstoqueViewProps {
    onPageChange: (page: string) => void
}

export const EstoqueView = ({ onPageChange }: EstoqueViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItem, setSelectedItem] = useState<ProdutoEstoque | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleViewItem = (item: ProdutoEstoque) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const filteredEstoque = MOCK_ESTOQUE.filter(item =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const columns = [
        { header: 'Produto', key: 'nome' },
        { header: 'Categoria', key: 'categoria' },
        { header: 'Água Boa', key: 'aguaBoa' },
        { header: 'Querência', key: 'querencia' },
        { header: 'Status', key: 'status', align: 'center' as const },
        { header: 'Ações', key: 'acoes', align: 'center' as const }
    ]

    const renderCell = (item: ProdutoEstoque, key: string) => {
        switch (key) {
            case 'nome': return <span className="font-normal text-gray-900 dark:text-white">{item.nome}</span>
            case 'categoria': return (
                <Badge variant="outline" className="rounded-full border-app-border dark:border-app-border-dark bg-app-bg-secondary dark:bg-app-bg-dark text-gray-700 dark:text-white/80 px-3 py-0.5 font-normal whitespace-nowrap">
                    {item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1).toLowerCase()}
                </Badge>
            )
            case 'aguaBoa': return (
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-white/80">
                    <span className="font-normal">{item.aguaBoa.qtd}</span>
                    <span className="text-app-text-muted dark:text-app-text-muted text-sm font-normal">{item.aguaBoa.unidade}</span>
                </div>
            )
            case 'querencia': return (
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-white/80">
                    <span className="font-normal">{item.querencia.qtd}</span>
                    <span className="text-app-text-muted dark:text-app-text-muted text-sm font-normal">{item.querencia.unidade}</span>
                </div>
            )
            case 'status': return (
                <Badge className={`
                    rounded-[8px] text-[12px] font-normal px-3 py-1.5 border-0 transition-all shadow-sm text-white
                    ${item.status === 'Estoque baixo'
                        ? 'bg-orange-600 dark:bg-amber-900/40 dark:text-amber-100'
                        : 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100'
                    }
                `}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                </Badge>
            )
            case 'acoes': return (
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => handleViewItem(item)}
                        className="p-2 hover:bg-app-bg-secondary dark:hover:bg-white/5 rounded-lg transition-colors text-gray-900 dark:text-white"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                </div>
            )
            default: return null
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Estoque</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
                title="Consulta de estoque"
                subtitle="Visualize a disponibilidade de produtos para prescrição (Rn-010)"
                onPageChange={onPageChange}
                extra={
                    <div className="bg-red-600 dark:bg-red-900/40 dark:text-red-100 text-white flex items-center gap-2 px-4 py-2.5 rounded-[12px] font-normal text-sm shadow-lg shadow-red-500/10">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>6 item(ns) com estoque baixo</span>
                    </div>
                }
            />

            {/* Alert Box */}
            <div className="bg-white dark:bg-app-card-dark border border-gray-100 dark:border-gray-800 rounded-[16px] p-6 shadow-sm flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-app-bg-secondary dark:bg-app-table-header-dark flex items-center justify-center shrink-0 border border-gray-100 dark:border-app-border-dark">
                    <Info className="h-5 w-5 text-app-text-muted" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-[15px] font-normal text-gray-900 dark:text-white">Atenção:</h4>
                    <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal leading-relaxed">
                        Existem produtos com estoque abaixo do mínimo recomendado. Considere isso ao prescrever.
                    </p>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[20px] shadow-sm border border-gray-50 dark:border-gray-800/50 overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* List Header */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-app-bg-secondary dark:bg-app-table-header-dark flex items-center justify-center border border-gray-100 dark:border-gray-800">
                                <Package className="h-5 w-5 text-gray-900 dark:text-white" />
                            </div>
                            <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                                Produtos disponíveis
                            </h2>
                        </div>

                        <div className="relative w-full lg:w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-app-text-muted" />
                            <Input
                                placeholder="Buscar por nome ou categoria..."
                                className="pl-12 h-12 rounded-[14px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/50 dark:bg-app-bg-dark focus-visible:ring-[#0039A6] transition-all w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <StandardTable
                        columns={columns}
                        data={filteredEstoque}
                        renderCell={renderCell}
                    />
                </div>
            </div>
            <VisualizarEstoqueModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
            />
        </div>
    )
}
