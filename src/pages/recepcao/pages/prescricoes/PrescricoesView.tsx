import { useEffect, useMemo, useState } from 'react'
import {
    FileText,
    Search,
    Eye,
    ShoppingCart,
    Clock,
    Edit,
    Trash2,
    MoreVertical,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
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
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { GerarVendaModal, EditarPrescricaoModal, ExcluirPrescricaoModal, NovaVendaModal, AgendarRetornoModal, DetalhesVendaModal } from './modals'
import { Prescription } from '@/mocks/recepcionista/prescricoes'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { getPrescricoesData, loadRetornosPendentes, registrarRetornoPendente, savePrescricoes } from '@/services/prescricoes.service'

interface PrescricoesViewProps {
    onPageChange?: (page: string) => void;
}

export const PrescricoesView = ({ onPageChange }: PrescricoesViewProps) => {
    const setCurrentPage = onPageChange;
    const [searchTerm, setSearchTerm] = useState('')
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

    // Modal states
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
    const [isVendaModalOpen, setIsVendaModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isNovaVendaModalOpen, setIsNovaVendaModalOpen] = useState(false)
    const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false)
    const [isAgendarRetornoModalOpen, setIsAgendarRetornoModalOpen] = useState(false)
    const [recentlyConvertedId, setRecentlyConvertedId] = useState<string | null>(null)
    const [pendingReturns, setPendingReturns] = useState<string[]>([])
    const [isEmitirModalOpen, setIsEmitirModalOpen] = useState(false)
    const [isPreviewDocumentoOpen, setIsPreviewDocumentoOpen] = useState(false)
    const [tipoDocumento, setTipoDocumento] = useState<'Recibo' | 'Nota Fiscal'>('Recibo')

    useEffect(() => {
        let mounted = true

        const loadData = async () => {
            const [data, retornos] = await Promise.all([
                getPrescricoesData(),
                loadRetornosPendentes(),
            ])

            if (!mounted) return
            setPrescriptions(data.prescriptions)
            setPendingReturns(retornos)
        }

        void loadData()

        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        if (prescriptions.length === 0) return
        void savePrescricoes(prescriptions)
    }, [prescriptions])

    const filteredPrescriptions = useMemo(() => {
        return prescriptions.filter(p => {
            const matchesSearch = p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.number.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesSearch
        })
    }, [searchTerm, prescriptions])

    const activeCount = prescriptions.filter(p => p.status === 'Ativa').length
    const expiredCount = prescriptions.filter(p => p.status === 'Vencida').length
    const totalValueActive = prescriptions
        .filter(p => p.status === 'Ativa')
        .reduce((sum, p) => sum + p.totalValue, 0)

    // Handlers
    const handleOpenVenda = (p: Prescription) => {
        setSelectedPrescription(p)
        setIsVendaModalOpen(true)
    }

    const handleOpenEdit = (p: Prescription) => {
        setSelectedPrescription(p)
        setIsEditModalOpen(true)
    }

    const handleOpenDelete = (p: Prescription) => {
        setSelectedPrescription(p)
        setIsDeleteModalOpen(true)
    }

    const handleOpenDetalhes = (p: Prescription) => {
        setSelectedPrescription(p)
        setIsDetalhesModalOpen(true)
    }

    const handleSaveEdit = (updatedPrescricao: Prescription) => {
        setPrescriptions(prev => prev.map(item =>
            item.id === updatedPrescricao.id ? updatedPrescricao : item
        ))
    }

    const handleConfirmDelete = (prescricao: Prescription) => {
        setPrescriptions(prev => prev.filter(item => item.id !== prescricao.id))
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
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Prescrição/Vendas</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-normal text-app-text-primary dark:text-white tracking-tight">Prescrição/Vendas</h1>
                    <p className="text-app-text-secondary dark:text-white/60 font-normal mt-1">Visualize e gerencie Prescrição/Vendas</p>
                </div>
                <Button
                    onClick={() => setIsNovaVendaModalOpen(true)}
                    className="h-11 px-6 bg-[#0039A6] hover:bg-[#002d82] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#0039A6]/20 transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Nova Prescrição/Vendas
                </Button>
            </div>

            {/* Modals */}
            <GerarVendaModal
                isOpen={isVendaModalOpen}
                onClose={() => {
                    setIsVendaModalOpen(false)
                    if (recentlyConvertedId) {
                        setTimeout(() => setIsAgendarRetornoModalOpen(true), 300)
                        setRecentlyConvertedId(null)
                    }
                }}
                prescription={selectedPrescription}
                onConfirm={(id) => {
                    setPrescriptions(prev => prev.map(p =>
                        p.id === id ? { ...p, status: 'Convertida' } : p
                    ))
                    setRecentlyConvertedId(id)
                }}
            />

            <EditarPrescricaoModal
                isOpen={isEditModalOpen}
                onClose={setIsEditModalOpen}
                prescricao={selectedPrescription}
                onSave={handleSaveEdit}
            />

            <NovaVendaModal
                isOpen={isNovaVendaModalOpen}
                onClose={() => setIsNovaVendaModalOpen(false)}
                onSave={(venda) => {
                    setPrescriptions(prev => [venda, ...prev])
                }}
                onAfterSale={({ prescriptionId, patientName }) => {
                    setSelectedPrescription(
                        prescriptions.find((item) => item.id === prescriptionId) || {
                            id: prescriptionId,
                            number: `VENDA-${prescriptionId}`,
                            patientName,
                            specialistName: 'Venda Direta',
                            createdAt: new Date().toLocaleDateString('pt-BR'),
                            totalValue: 0,
                            type: 'Venda Direta',
                            status: 'Convertida',
                            generator: 'Manual',
                            validity: '-',
                        },
                    )
                    setTimeout(() => setIsAgendarRetornoModalOpen(true), 200)
                }}
            />

            <DetalhesVendaModal
                isOpen={isDetalhesModalOpen}
                onClose={() => setIsDetalhesModalOpen(false)}
                venda={selectedPrescription}
            />

            <ExcluirPrescricaoModal
                isOpen={isDeleteModalOpen}
                onClose={setIsDeleteModalOpen}
                prescricao={selectedPrescription}
                onConfirm={handleConfirmDelete}
            />

            <AgendarRetornoModal
                isOpen={isAgendarRetornoModalOpen}
                onClose={() => setIsAgendarRetornoModalOpen(false)}
                patientName={selectedPrescription?.patientName}
                onConfirm={() => {
                    setIsAgendarRetornoModalOpen(false)
                    setCurrentPage?.('agenda')
                }}
                onLater={() => {
                    if (selectedPrescription) {
                        setPendingReturns(prev => [...prev, selectedPrescription.id])
                        void registrarRetornoPendente(selectedPrescription.id)
                    }
                    setIsAgendarRetornoModalOpen(false)
                }}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-app-border dark:border-app-border-dark">
                    <CardContent className="p-6 md:p-8 flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-normal text-app-text-secondary dark:text-white/60">Prescrição/Vendas ativas</p>
                            <h2 className="text-3xl md:text-4xl font-normal text-green-600 dark:text-green-500">{activeCount}</h2>
                        </div>
                        <div>
                            <FileText size={32} className="text-green-600 dark:text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-app-border dark:border-app-border-dark">
                    <CardContent className="p-6 md:p-8 flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-normal text-app-text-secondary dark:text-white/60">Prescrição/Vendas vencidas</p>
                            <h2 className="text-3xl md:text-4xl font-normal text-amber-500">{expiredCount}</h2>
                        </div>
                        <div>
                            <Clock size={32} className="text-amber-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-app-border dark:border-app-border-dark">
                    <CardContent className="p-6 md:p-8 flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-normal text-app-text-secondary dark:text-white/60">Valor total (Ativas)</p>
                            <h2 className="text-2xl md:text-3xl font-normal text-blue-600 dark:text-blue-500 uppercase tracking-tighter">
                                R$ {totalValueActive.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>
                        <div>
                            <FileText size={32} className="text-blue-600 dark:text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                    <Input
                        placeholder="Buscar por paciente ou número..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-11 bg-app-card dark:bg-app-card-dark border-app-border dark:border-app-border-dark rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-[#0039A6]"
                    />
                </div>
            </div>

            {/* Table Section */}
            <Card className="rounded-[24px] border-none bg-app-card dark:bg-app-card-dark shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-app-border/50 dark:border-app-border-dark/50">
                    <h3 className="text-lg font-normal text-app-text-primary dark:text-white">
                        Lista de Prescrição/Vendas ({filteredPrescriptions.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-app-border dark:border-app-border-dark">
                                <TableHead className="pl-8 font-normal text-app-text-secondary dark:text-white/80 h-14">Número</TableHead>
                                <TableHead className="font-normal text-app-text-secondary dark:text-white/80">Paciente</TableHead>
                                <TableHead className="font-normal text-app-text-secondary dark:text-white/80">Data de criação</TableHead>
                                <TableHead className="font-normal text-app-text-secondary dark:text-white/80 text-right">Valor total</TableHead>
                                <TableHead className="font-normal text-app-text-secondary dark:text-white/80">Tipo</TableHead>
                                <TableHead className="font-normal text-app-text-secondary dark:text-white/80">Status</TableHead>
                                <TableHead className="font-normal text-app-text-secondary dark:text-white/80">Fato gerador</TableHead>
                                <TableHead className="font-normal text-app-text-secondary dark:text-white/80">Validade</TableHead>
                                <TableHead className="text-center pr-8 font-normal text-app-text-secondary dark:text-white/80">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPrescriptions.map((p) => (
                                <TableRow key={p.id} className="hover:bg-app-bg-secondary/50 dark:hover:bg-white/5 transition-colors border-app-border dark:border-app-border-dark">
                                    <TableCell className="pl-8 py-4 font-normal text-app-text-primary dark:text-white uppercase">{p.number}</TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="font-normal text-app-text-primary dark:text-white/90">{p.patientName}</p>
                                            <p className="text-xs text-app-text-secondary dark:text-white/60 font-normal">{p.specialistName}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-app-text-secondary dark:text-white/80 font-normal">{p.createdAt}</TableCell>
                                    <TableCell className="text-right font-normal text-app-text-primary dark:text-white">
                                        R$ {p.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-app-bg-secondary dark:bg-white/5 border-app-border dark:border-app-border-dark text-app-text-secondary dark:text-white/80 font-normal rounded-lg px-3 py-1">
                                            {p.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`px-3 py-1 rounded-lg text-sm font-normal ${p.status === 'Ativa'
                                                ? 'bg-[#E6F9F1] text-[#047857] dark:bg-emerald-500/10 dark:text-emerald-400'
                                                : p.status === 'Vencida'
                                                    ? 'bg-[#FFFBEB] text-[#92400E] dark:bg-amber-500/10 dark:text-amber-400'
                                                    : 'bg-[#E0F2FE] text-[#0369A1] dark:bg-blue-500/10 dark:text-blue-400'
                                                }`}>
                                                {p.status}
                                            </span>
                                            {pendingReturns.includes(p.id) && (
                                                <span className="px-3 py-1 rounded-lg text-xs font-normal bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                                    Retorno Pendente
                                                </span>
                                            )}
                                            {(((p.generator ?? '').toLowerCase().includes('consumo')) || p.tipo_venda === 'consumo') && (
                                                <span className="px-3 py-1 rounded-lg text-xs font-normal bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800">
                                                    Consumo
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-app-text-secondary dark:text-white/60 font-normal">{p.generator}</TableCell>
                                    <TableCell className="text-app-text-secondary dark:text-white/60 font-normal">{p.validity}</TableCell>
                                    <TableCell className="text-center pr-8">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDetalhes(p)}
                                                className="h-9 w-9 text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </Button>

                                            {(p.status as string) === 'Convertida' ? (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                    title="Emitir NF/Recibo"
                                                    onClick={() => {
                                                        setSelectedPrescription(p)
                                                        setIsEmitirModalOpen(true)
                                                    }}
                                                >
                                                    <FileText size={18} />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handleOpenVenda(p)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                                    disabled={(p.status as string) === 'Convertida'}
                                                >
                                                    <ShoppingCart size={18} />
                                                </Button>
                                            )}

                                            {/* Actions Dropdown */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-app-text-muted hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors">
                                                        <MoreVertical size={18} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                    {(p.status as string) === 'Convertida' && (
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedPrescription(p)
                                                                setIsEmitirModalOpen(true)
                                                            }}
                                                            className="flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <FileText size={16} />
                                                            Emitir Recibo / NF
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleOpenEdit(p)}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Edit size={16} />
                                                        Editar Prescrição/Vendas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleOpenDelete(p)}
                                                        className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                        Excluir Prescrição/Vendas
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Dialog open={isEmitirModalOpen} onOpenChange={setIsEmitirModalOpen}>
                <DialogContent className="max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Emitir Recibo / NF</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <p className="text-sm text-app-text-secondary">
                            Selecione o tipo de documento para {selectedPrescription?.patientName || 'o cliente'}.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setTipoDocumento('Recibo')
                                    setIsEmitirModalOpen(false)
                                    setIsPreviewDocumentoOpen(true)
                                }}
                            >
                                Recibo
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setTipoDocumento('Nota Fiscal')
                                    setIsEmitirModalOpen(false)
                                    setIsPreviewDocumentoOpen(true)
                                }}
                            >
                                Nota Fiscal
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isPreviewDocumentoOpen} onOpenChange={setIsPreviewDocumentoOpen}>
                <DialogContent className="max-w-[720px]">
                    <DialogHeader>
                        <DialogTitle>Preview de {tipoDocumento}</DialogTitle>
                    </DialogHeader>
                    <div className="rounded-xl border p-4 space-y-1">
                        <p className="text-sm"><strong>Documento:</strong> {tipoDocumento}</p>
                        <p className="text-sm"><strong>Paciente:</strong> {selectedPrescription?.patientName}</p>
                        <p className="text-sm"><strong>Prescrição/Vendas:</strong> {selectedPrescription?.number}</p>
                        <p className="text-sm"><strong>Valor:</strong> R$ {selectedPrescription?.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p className="text-sm"><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPreviewDocumentoOpen(false)}>Fechar</Button>
                        <Button onClick={() => window.print()} className="bg-[#0039A6] hover:bg-[#002d82] text-white">Imprimir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
