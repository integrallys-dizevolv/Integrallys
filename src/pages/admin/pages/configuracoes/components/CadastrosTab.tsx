import { useState } from 'react'
import {
    Building2,
    CreditCard,
    Wallet,
    BarChart3,
    Stethoscope,
    Users,
    FileText,
    Plus,
    Edit2,
    Trash2,
    Search,
    MoreVertical,
    AlertTriangle
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Badge } from '@/components/ui/Badge'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/Select'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/Table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
    DialogFooter,
} from '@/components/ui/Dialog'
import { toast } from 'sonner'

import {
    MOCK_BANCOS, Banco,
    MOCK_FORMAS_PAGAMENTO, FormaPagamento,
    MOCK_FORMAS_RECEBIMENTO, FormaRecebimento,
    MOCK_CATEGORIAS_DRE, CategoriaDRE,
    MOCK_PROCEDIMENTOS, Procedimento,
    MOCK_PROFISSIONAIS, Profissional,
    MOCK_TIPOS_DOCUMENTOS, TipoDocumento
} from '@/mocks/admin/cadastros'

type CadastroTab = 'bancos' | 'pagamento' | 'recebimento' | 'dre' | 'procedimentos' | 'profissionais' | 'documentos'

const cadastroTabs = [
    { id: 'bancos' as CadastroTab, label: 'Bancos', icon: Building2 },
    { id: 'pagamento' as CadastroTab, label: 'Formas de Pagamento', icon: CreditCard },
    { id: 'recebimento' as CadastroTab, label: 'Formas de Recebimento', icon: Wallet },
    { id: 'dre' as CadastroTab, label: 'Categorias DRE', icon: BarChart3 },
    { id: 'procedimentos' as CadastroTab, label: 'Procedimentos', icon: Stethoscope },
    { id: 'profissionais' as CadastroTab, label: 'Profissionais', icon: Users },
    { id: 'documentos' as CadastroTab, label: 'Documentos', icon: FileText },
]

type CadastroItem = Banco | FormaPagamento | FormaRecebimento | CategoriaDRE | Procedimento | Profissional | TipoDocumento

export function CadastrosTab() {
    const [activeTab, setActiveTab] = useState<CadastroTab>('bancos')
    const [searchTerm, setSearchTerm] = useState('')

    // State for each cadastro
    const [bancos, setBancos] = useState<Banco[]>(MOCK_BANCOS)
    const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>(MOCK_FORMAS_PAGAMENTO)
    const [formasRecebimento, setFormasRecebimento] = useState<FormaRecebimento[]>(MOCK_FORMAS_RECEBIMENTO)
    const [categoriasDRE, setCategoriasDRE] = useState<CategoriaDRE[]>(MOCK_CATEGORIAS_DRE)
    const [procedimentos, setProcedimentos] = useState<Procedimento[]>(MOCK_PROCEDIMENTOS)
    const [profissionais, setProfissionais] = useState<Profissional[]>(MOCK_PROFISSIONAIS)
    const [documentos, setDocumentos] = useState<TipoDocumento[]>(MOCK_TIPOS_DOCUMENTOS)

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<CadastroItem | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    const handleOpenCreate = () => {
        setSelectedItem(null)
        setIsCreating(true)
        setIsEditModalOpen(true)
    }

    const handleOpenEdit = (item: CadastroItem) => {
        setSelectedItem(item)
        setIsCreating(false)
        setIsEditModalOpen(true)
    }

    const handleOpenDelete = (item: CadastroItem) => {
        setSelectedItem(item)
        setIsDeleteModalOpen(true)
    }

    const handleSave = () => {
        toast.success(isCreating ? 'Item criado com sucesso!' : 'Item atualizado com sucesso!')
        setIsEditModalOpen(false)
        setSelectedItem(null)
    }

    const handleDelete = () => {
        // Remove item from the appropriate list based on activeTab
        switch (activeTab) {
            case 'bancos':
                setBancos(prev => prev.filter(item => item.id !== selectedItem?.id))
                break
            case 'pagamento':
                setFormasPagamento(prev => prev.filter(item => item.id !== selectedItem?.id))
                break
            case 'recebimento':
                setFormasRecebimento(prev => prev.filter(item => item.id !== selectedItem?.id))
                break
            case 'dre':
                setCategoriasDRE(prev => prev.filter(item => item.id !== selectedItem?.id))
                break
            case 'procedimentos':
                setProcedimentos(prev => prev.filter(item => item.id !== selectedItem?.id))
                break
            case 'profissionais':
                setProfissionais(prev => prev.filter(item => item.id !== selectedItem?.id))
                break
            case 'documentos':
                setDocumentos(prev => prev.filter(item => item.id !== selectedItem?.id))
                break
        }
        toast.success('Item excluído com sucesso!')
        setIsDeleteModalOpen(false)
        setSelectedItem(null)
    }

    const getActiveTabLabel = () => {
        return cadastroTabs.find(t => t.id === activeTab)?.label || ''
    }

    const renderTable = () => {
        switch (activeTab) {
            case 'bancos':
                return (
                    <Table>
                        <TableHeader className="bg-app-bg-secondary dark:bg-app-table-header-dark">
                            <TableRow>
                                <TableHead className="font-normal">Nome</TableHead>
                                <TableHead className="font-normal">Código</TableHead>
                                <TableHead className="font-normal">Agência/Conta</TableHead>
                                <TableHead className="font-normal">Tipo</TableHead>
                                <TableHead className="font-normal">Status</TableHead>
                                <TableHead className="font-normal text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bancos.filter(b => b.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                <TableRow key={item.id} className="dark:hover:bg-app-card/5">
                                    <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                                    <TableCell className="font-normal">{item.codigo}</TableCell>
                                    <TableCell className="font-normal">{item.agencia}/{item.conta}</TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-full font-normal">{item.tipo}</Badge></TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'}`}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="gap-2"><Edit2 size={14} />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenDelete(item)} className="gap-2 text-red-600"><Trash2 size={14} />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )

            case 'pagamento':
                return (
                    <Table>
                        <TableHeader className="bg-app-bg-secondary dark:bg-app-table-header-dark">
                            <TableRow>
                                <TableHead className="font-normal">Nome</TableHead>
                                <TableHead className="font-normal">Tipo</TableHead>
                                <TableHead className="font-normal">Taxa (%)</TableHead>
                                <TableHead className="font-normal">Dias p/ Receb.</TableHead>
                                <TableHead className="font-normal">Status</TableHead>
                                <TableHead className="font-normal text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formasPagamento.filter(f => f.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                <TableRow key={item.id} className="dark:hover:bg-app-card/5">
                                    <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-full font-normal">{item.tipo}</Badge></TableCell>
                                    <TableCell className="font-normal">{item.taxaPercentual}%</TableCell>
                                    <TableCell className="font-normal">{item.diasRecebimento} dias</TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'}`}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="gap-2"><Edit2 size={14} />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenDelete(item)} className="gap-2 text-red-600"><Trash2 size={14} />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )

            case 'recebimento':
                return (
                    <Table>
                        <TableHeader className="bg-app-bg-secondary dark:bg-app-table-header-dark">
                            <TableRow>
                                <TableHead className="font-normal">Nome</TableHead>
                                <TableHead className="font-normal">Descrição</TableHead>
                                <TableHead className="font-normal">Conta Destino</TableHead>
                                <TableHead className="font-normal">Status</TableHead>
                                <TableHead className="font-normal text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formasRecebimento.filter(f => f.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                <TableRow key={item.id} className="dark:hover:bg-app-card/5">
                                    <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                                    <TableCell className="font-normal text-app-text-muted">{item.descricao}</TableCell>
                                    <TableCell className="font-normal">{item.contaDestino}</TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'}`}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="gap-2"><Edit2 size={14} />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenDelete(item)} className="gap-2 text-red-600"><Trash2 size={14} />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )

            case 'dre':
                return (
                    <Table>
                        <TableHeader className="bg-app-bg-secondary dark:bg-app-table-header-dark">
                            <TableRow>
                                <TableHead className="font-normal">Nome</TableHead>
                                <TableHead className="font-normal">Tipo</TableHead>
                                <TableHead className="font-normal">Grupo</TableHead>
                                <TableHead className="font-normal">Ordem</TableHead>
                                <TableHead className="font-normal">Status</TableHead>
                                <TableHead className="font-normal text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categoriasDRE.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                <TableRow key={item.id} className="dark:hover:bg-app-card/5">
                                    <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.tipo === 'Receita' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                                            {item.tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-normal">{item.grupo}</TableCell>
                                    <TableCell className="font-normal">{item.ordem}</TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'}`}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="gap-2"><Edit2 size={14} />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenDelete(item)} className="gap-2 text-red-600"><Trash2 size={14} />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )

            case 'procedimentos':
                return (
                    <Table>
                        <TableHeader className="bg-app-bg-secondary dark:bg-app-table-header-dark">
                            <TableRow>
                                <TableHead className="font-normal">Nome</TableHead>
                                <TableHead className="font-normal">Código</TableHead>
                                <TableHead className="font-normal">Categoria</TableHead>
                                <TableHead className="font-normal">Duração</TableHead>
                                <TableHead className="font-normal">Valor</TableHead>
                                <TableHead className="font-normal">Baixa Auto. Suprimentos</TableHead>
                                <TableHead className="font-normal">Status</TableHead>
                                <TableHead className="font-normal text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {procedimentos.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                <TableRow key={item.id} className="dark:hover:bg-app-card/5">
                                    <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                                    <TableCell className="font-normal text-app-text-muted">{item.codigo}</TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-full font-normal">{item.categoria}</Badge></TableCell>
                                    <TableCell className="font-normal">{item.duracao} min</TableCell>
                                    <TableCell className="font-normal">R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.baixaAutomaticaSuprimentos
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                                            : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'
                                            }`}>
                                            {item.baixaAutomaticaSuprimentos ? 'Sim' : 'N?o'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'}`}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="gap-2"><Edit2 size={14} />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenDelete(item)} className="gap-2 text-red-600"><Trash2 size={14} />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )

            case 'profissionais':
                return (
                    <Table>
                        <TableHeader className="bg-app-bg-secondary dark:bg-app-table-header-dark">
                            <TableRow>
                                <TableHead className="font-normal">Nome</TableHead>
                                <TableHead className="font-normal">Especialidade</TableHead>
                                <TableHead className="font-normal">Registro</TableHead>
                                <TableHead className="font-normal">Comissão</TableHead>
                                <TableHead className="font-normal">Status</TableHead>
                                <TableHead className="font-normal text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {profissionais.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                <TableRow key={item.id} className="dark:hover:bg-app-card/5">
                                    <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-full font-normal">{item.especialidade}</Badge></TableCell>
                                    <TableCell className="font-normal text-app-text-muted">{item.registro}</TableCell>
                                    <TableCell className="font-normal">{item.comissao}%</TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'}`}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="gap-2"><Edit2 size={14} />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenDelete(item)} className="gap-2 text-red-600"><Trash2 size={14} />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )

            case 'documentos':
                return (
                    <Table>
                        <TableHeader className="bg-app-bg-secondary dark:bg-app-table-header-dark">
                            <TableRow>
                                <TableHead className="font-normal">Nome</TableHead>
                                <TableHead className="font-normal">Categoria</TableHead>
                                <TableHead className="font-normal">Formato</TableHead>
                                <TableHead className="font-normal">Obrigatório</TableHead>
                                <TableHead className="font-normal">Status</TableHead>
                                <TableHead className="font-normal text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documentos.filter(d => d.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                <TableRow key={item.id} className="dark:hover:bg-app-card/5">
                                    <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-full font-normal">{item.categoria}</Badge></TableCell>
                                    <TableCell className="font-normal">{item.formato}</TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.obrigatorio ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'}`}>
                                            {item.obrigatorio ? 'Sim' : 'Não'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full font-normal ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-app-bg-secondary text-gray-600 dark:bg-app-bg-secondary0/10 dark:text-app-text-muted'}`}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="gap-2"><Edit2 size={14} />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenDelete(item)} className="gap-2 text-red-600"><Trash2 size={14} />Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-normal dark:text-white">Cadastros do Sistema</h3>
                    <p className="text-sm text-app-text-muted font-normal">Gerencie os cadastros configuráveis da plataforma.</p>
                </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-app-bg-secondary dark:bg-app-table-header-dark rounded-xl">
                {cadastroTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setSearchTerm('') }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all font-normal ${activeTab === tab.id
                            ? 'bg-[#0039A6] text-white shadow-md'
                            : 'text-app-text-muted dark:text-app-text-muted hover:bg-app-card/50 dark:hover:bg-app-card/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search and Add */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                    <Input
                        placeholder={`Buscar ${getActiveTabLabel().toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 rounded-xl font-normal"
                    />
                </div>
                <Button onClick={handleOpenCreate} className="h-11 px-6 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl gap-2 font-normal">
                    <Plus size={18} />
                    Novo
                </Button>
            </div>

            {/* Table */}
            <Card className="border-gray-100 dark:border-app-border-dark rounded-xl overflow-hidden">
                {renderTable()}
            </Card>

            {/* Edit/Create Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[550px] rounded-2xl border-none max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="p-6 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                                {isCreating ? <Plus className="h-5 w-5 text-emerald-700 dark:text-emerald-400" /> : <Edit2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />}
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white">
                                    {isCreating ? `Novo ${getActiveTabLabel().slice(0, -1)}` : `Editar ${getActiveTabLabel().slice(0, -1)}`}
                                </DialogTitle>
                                <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">
                                    {isCreating ? 'Preencha todos os campos obrigatórios' : 'Atualize as informações'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="px-6 pb-6 space-y-4">
                        {/* Campos comuns: Nome e Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Nome *</Label>
                                <Input
                                    defaultValue={selectedItem?.nome || ''}
                                    placeholder="Digite o nome"
                                    className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Status</Label>
                                <Select defaultValue={selectedItem?.status || 'Ativo'}>
                                    <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ativo" className="font-normal">Ativo</SelectItem>
                                        <SelectItem value="Inativo" className="font-normal">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Campos específicos por tipo de cadastro */}
                        {activeTab === 'bancos' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Código do Banco *</Label>
                                        <Input
                                            defaultValue={(selectedItem as Banco)?.codigo || ''}
                                            placeholder="Ex: 001, 341, 237"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Tipo de Conta</Label>
                                        <Select defaultValue={(selectedItem as Banco)?.tipo || 'Corrente'}>
                                            <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Corrente" className="font-normal">Corrente</SelectItem>
                                                <SelectItem value="Poupança" className="font-normal">Poupança</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Agência</Label>
                                        <Input
                                            defaultValue={(selectedItem as Banco)?.agencia || ''}
                                            placeholder="Ex: 1234-5"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Conta</Label>
                                        <Input
                                            defaultValue={(selectedItem as Banco)?.conta || ''}
                                            placeholder="Ex: 12345-6"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'pagamento' && (
                            <>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Tipo de Pagamento *</Label>
                                    <Select defaultValue={(selectedItem as FormaPagamento)?.tipo || 'Dinheiro'}>
                                        <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Dinheiro" className="font-normal">Dinheiro</SelectItem>
                                            <SelectItem value="PIX" className="font-normal">PIX</SelectItem>
                                            <SelectItem value="Cartão Crédito" className="font-normal">Cartão de Crédito</SelectItem>
                                            <SelectItem value="Cartão Débito" className="font-normal">Cartão de Débito</SelectItem>
                                            <SelectItem value="Boleto" className="font-normal">Boleto</SelectItem>
                                            <SelectItem value="Transferência" className="font-normal">Transferência</SelectItem>
                                            <SelectItem value="Cheque" className="font-normal">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Taxa (%)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            defaultValue={(selectedItem as FormaPagamento)?.taxaPercentual || 0}
                                            placeholder="0.00"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Dias para Recebimento</Label>
                                        <Input
                                            type="number"
                                            defaultValue={(selectedItem as FormaPagamento)?.diasRecebimento || 0}
                                            placeholder="0"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'recebimento' && (
                            <>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Descrição</Label>
                                    <Input
                                        defaultValue={(selectedItem as FormaRecebimento)?.descricao || ''}
                                        placeholder="Descrição da forma de recebimento"
                                        className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Conta Destino</Label>
                                    <Input
                                        defaultValue={(selectedItem as FormaRecebimento)?.contaDestino || ''}
                                        placeholder="Ex: Itaú - 0987/98765-4"
                                        className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'dre' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Tipo *</Label>
                                        <Select defaultValue={(selectedItem as CategoriaDRE)?.tipo || 'Receita'}>
                                            <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Receita" className="font-normal">Receita</SelectItem>
                                                <SelectItem value="Despesa" className="font-normal">Despesa</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Ordem</Label>
                                        <Input
                                            type="number"
                                            defaultValue={(selectedItem as CategoriaDRE)?.ordem || 1}
                                            placeholder="1"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Grupo *</Label>
                                    <Select defaultValue={(selectedItem as CategoriaDRE)?.grupo || 'Receita Bruta'}>
                                        <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Receita Bruta" className="font-normal">Receita Bruta</SelectItem>
                                            <SelectItem value="Deduções" className="font-normal">Deduções</SelectItem>
                                            <SelectItem value="Custo dos Serviços" className="font-normal">Custo dos Serviços</SelectItem>
                                            <SelectItem value="Despesas Operacionais" className="font-normal">Despesas Operacionais</SelectItem>
                                            <SelectItem value="Despesas Administrativas" className="font-normal">Despesas Administrativas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        {activeTab === 'procedimentos' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Código</Label>
                                        <Input
                                            defaultValue={(selectedItem as Procedimento)?.codigo || ''}
                                            placeholder="Ex: CONS01"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Categoria *</Label>
                                        <Select defaultValue={(selectedItem as Procedimento)?.categoria || 'Consultas'}>
                                            <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Consultas" className="font-normal">Consultas</SelectItem>
                                                <SelectItem value="Avaliações" className="font-normal">Avaliações</SelectItem>
                                                <SelectItem value="Fisioterapia" className="font-normal">Fisioterapia</SelectItem>
                                                <SelectItem value="Terapias" className="font-normal">Terapias</SelectItem>
                                                <SelectItem value="Exames" className="font-normal">Exames</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Duração (minutos) *</Label>
                                        <Input
                                            type="number"
                                            defaultValue={(selectedItem as Procedimento)?.duracao || 30}
                                            placeholder="30"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Valor (R$) *</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            defaultValue={(selectedItem as Procedimento)?.valor || 0}
                                            placeholder="0.00"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Baixa autom?tica de suprimentos ao receber pagamento?</Label>
                                    <Select defaultValue={(selectedItem as Procedimento)?.baixaAutomaticaSuprimentos ? 'sim' : 'nao'}>
                                        <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sim" className="font-normal">Sim, baixar automaticamente</SelectItem>
                                            <SelectItem value="nao" className="font-normal">N?o baixar automaticamente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Suprimentos vinculados</Label>
                                    <Input
                                        defaultValue={(selectedItem as Procedimento)?.suprimentosVinculados?.join(', ') || ''}
                                        placeholder="Ex: Luva descart?vel, ?lcool 70%, Algod?o"
                                        className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                    />
                                    <p className="text-[11px] text-app-text-muted">
                                        Informe os suprimentos separados por v?rgula para controle e relat?rio de estoque.
                                    </p>
                                </div>
                            </>
                        )}

                        {activeTab === 'profissionais' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Especialidade *</Label>
                                        <Input
                                            defaultValue={(selectedItem as Profissional)?.especialidade || ''}
                                            placeholder="Ex: Clínico Geral"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Registro (CRM/CRN/etc) *</Label>
                                        <Input
                                            defaultValue={(selectedItem as Profissional)?.registro || ''}
                                            placeholder="Ex: CRM 12345"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">E-mail</Label>
                                        <Input
                                            type="email"
                                            defaultValue={(selectedItem as Profissional)?.email || ''}
                                            placeholder="email@clinica.com"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Telefone</Label>
                                        <Input
                                            defaultValue={(selectedItem as Profissional)?.telefone || ''}
                                            placeholder="(11) 99999-9999"
                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Comissão (%)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        defaultValue={(selectedItem as Profissional)?.comissao || 0}
                                        placeholder="0"
                                        className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal"
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'documentos' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Categoria *</Label>
                                        <Select defaultValue={(selectedItem as TipoDocumento)?.categoria || 'Clínico'}>
                                            <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Clínico" className="font-normal">Clínico</SelectItem>
                                                <SelectItem value="Prontuário" className="font-normal">Prontuário</SelectItem>
                                                <SelectItem value="Financeiro" className="font-normal">Financeiro</SelectItem>
                                                <SelectItem value="Administrativo" className="font-normal">Administrativo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted">Formato</Label>
                                        <Select defaultValue={(selectedItem as TipoDocumento)?.formato || 'PDF'}>
                                            <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PDF" className="font-normal">PDF</SelectItem>
                                                <SelectItem value="DOCX" className="font-normal">DOCX</SelectItem>
                                                <SelectItem value="HTML" className="font-normal">HTML</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-app-bg-secondary dark:bg-app-card/5 rounded-xl">
                                    <input
                                        type="checkbox"
                                        id="obrigatorio"
                                        defaultChecked={(selectedItem as TipoDocumento)?.obrigatorio || false}
                                        className="h-5 w-5 rounded border-app-border text-[#0039A6] focus:ring-[#0039A6]"
                                    />
                                    <Label htmlFor="obrigatorio" className="text-sm font-normal text-gray-700 dark:text-white/80 cursor-pointer">
                                        Documento obrigatório
                                    </Label>
                                </div>
                            </>
                        )}

                        <DialogFooter className="pt-4 gap-3">
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-11 rounded-xl font-normal">
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} className="flex-1 h-11 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl font-normal">
                                {isCreating ? 'Criar' : 'Salvar'}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl border-none">
                    <DialogHeader className="p-6 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-xl font-normal text-red-600">Excluir item</DialogTitle>
                                <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">
                                    Esta ação não pode ser desfeita.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="px-6 pb-6 space-y-4">
                        <p className="text-sm text-[#334155] dark:text-white/80 font-normal">
                            Deseja realmente excluir "<span className="font-medium text-app-text-primary dark:text-white">{selectedItem?.nome}</span>"?
                        </p>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl h-11 px-6 font-normal">
                                Cancelar
                            </Button>
                            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 px-8 font-normal">
                                Excluir
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
