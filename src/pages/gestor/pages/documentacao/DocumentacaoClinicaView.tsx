import { useState, useMemo, useEffect } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
    User,
    Stethoscope,
    Search,
    Plus,
    Eye,
    Edit2,
    Trash2,
    Calendar,
    ChevronRight
} from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { VisualizarDocumentoModal } from './modals/VisualizarDocumentoModal';
import { CadastroModeloModal } from './modals/CadastroModeloModal';
import { ExcluirModeloModal } from './modals/ExcluirModeloModal';
import { documentacaoMocks } from '@/mocks/gestor/documentacao';
import { appendDocumentoProntuario } from '@/services/documentacaoClinica.service';
import { toast } from 'sonner';

interface DocumentoModelo {
    id: number;
    nome: string;
    categoria: string;
    especialista: string;
    desc: string;
    variaveis: number;
    template?: string;
}

interface PacienteResumo {
    nome: string;
    cpf: string;
    dataNascimento: string;
}

export function DocumentacaoClinicaView({ onPageChange }: { onPageChange: (page: string) => void }) {
    // --- ESTADOS (Consolidados do useDocumentacao) ---
    const [activeTab, setActiveTab] = useState<'gerar' | 'modelos'>('gerar');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isNewModelOpen, setIsNewModelOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentoModelo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [modelos, setModelos] = useState<DocumentoModelo[]>([]);
    const [especialistaFiltro, setEspecialistaFiltro] = useState('todos');
    const [paciente, setPaciente] = useState<PacienteResumo | null>(null);

    const [type, setType] = useState<'Trava' | 'Outro'>('Outro');
    const [dataInicio, setDataInicio] = useState<string | null>(null);
    const [dataFim, setDataFim] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);

    // --- LOGICA (Consolidada do useDocumentacao) ---
    useEffect(() => {
        // Simulando carregamento de dados
        const mappedModels: DocumentoModelo[] = (documentacaoMocks.models as any[]).map(m => ({
            ...m,
            especialista: m.especialista || 'Dr. Adelmo',
            variaveis: parseInt(m.variaveis) || 0
        }));
        setModelos(mappedModels);
        setPaciente({
            nome: 'Maria Silva Santos',
            cpf: '123.456.789-00',
            dataNascimento: '15/03/1985'
        });
    }, [dataInicio, dataFim, type]);

    const handleTypeChange = (newType: 'Trava' | 'Outro') => {
        setType(newType);
        setDataInicio(null);
        setDataFim(null);
        setDateError(null);
    };

    const handleDataInicioChange = (date: string) => {
        setDataInicio(date);
        if (dataFim && new Date(date) > new Date(dataFim)) {
            setDataFim(null);
            setDateError(null);
        }
    };

    const handleDataFimChange = (date: string) => {
        if (dataInicio && new Date(date) < new Date(dataInicio)) {
            setDateError('A data final não pode ser anterior à data inicial');
            return;
        }
        setDataFim(date);
        setDateError(null);
    };

    const filteredModels = useMemo(() => {
        return modelos.filter(model =>
            (model.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            model.categoria.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (especialistaFiltro === 'todos' || model.especialista === especialistaFiltro)
        );
    }, [modelos, searchTerm, especialistaFiltro]);

    const handleViewDocument = (doc: DocumentoModelo) => {
        setSelectedDocument(doc);
        setIsPreviewOpen(true);
    };

    const handleGenerateAndAttach = (doc: DocumentoModelo) => {
        appendDocumentoProntuario({
            paciente: paciente?.nome || 'Paciente não informado',
            documento: doc.nome,
            categoria: doc.categoria,
            geradoEm: new Date().toISOString(),
            geradoPor: 'Gestor/Admin',
        });
        toast.success('Documento gerado e vinculado ao prontuário.');
    };

    const handleEditDocument = (doc: DocumentoModelo) => {
        setSelectedDocument(doc);
        setIsNewModelOpen(true);
    };

    const handleDeleteDocument = (doc: DocumentoModelo) => {
        setSelectedDocument(doc);
        setIsDeleteOpen(true);
    };

    const handleNewModel = () => {
        setSelectedDocument(null);
        setIsNewModelOpen(true);
    };

    const handleSaveModel = (payload: { nome: string; categoria: string; desc: string; template: string; especialista: string }) => {
        if (selectedDocument) {
            setModelos((prev) => prev.map((item) =>
                item.id === selectedDocument.id
                    ? { ...item, ...payload, variaveis: Math.max(1, (payload.template.match(/\{\{.*?\}\}/g) || []).length) }
                    : item,
            ));
            return;
        }

        setModelos((prev) => [
            {
                id: Date.now(),
                nome: payload.nome,
                categoria: payload.categoria,
                especialista: payload.especialista,
                desc: payload.desc,
                template: payload.template,
                variaveis: Math.max(1, (payload.template.match(/\{\{.*?\}\}/g) || []).length),
            },
            ...prev,
        ]);
    };

    const getBadgeStyle = (categoria: string) => {
        switch (categoria.toLowerCase()) {
            case 'atestado': return 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400';
            case 'declaracao': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'relatorio': return 'bg-app-bg-secondary text-gray-600 dark:bg-app-card/5 dark:text-app-text-muted';
            default: return 'bg-app-bg-secondary text-app-text-muted dark:bg-app-card/10 dark:text-app-text-muted';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange('inicio')}
                            className="text-sm font-normal text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Documentação clínica</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* TAB SWITCHER - Using SegmentedControl */}
            <div className="max-w-4xl mx-auto">
                <SegmentedControl
                    options={[
                        { value: 'gerar', label: 'Gerar documentos' },
                        { value: 'modelos', label: 'Gerenciar modelos' }
                    ]}
                    value={activeTab}
                    onChange={(val) => setActiveTab(val as 'gerar' | 'modelos')}
                />
            </div>

            {activeTab === 'gerar' ? (
                <div className="space-y-6">
                    {/* DADOS PACIENTE */}
                    <Card className="border border-gray-100 dark:border-app-border-dark bg-app-card dark:bg-[#0c1e3d] rounded-[24px] shadow-sm">
                        <CardContent className="p-8 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#0039A6] dark:text-emerald-400">
                                    <User size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-normal text-[#101828] dark:text-white">Dados do paciente</h3>
                                    <p className="text-app-text-muted dark:text-app-text-muted text-sm font-normal">Informações básicas para emissão do documento.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-gray-100 dark:border-app-border-dark">
                                {[
                                    { label: 'Nome completo', val: paciente?.nome },
                                    { label: 'CPF', val: paciente?.cpf },
                                    { label: 'Data de nascimento', val: paciente?.dataNascimento }
                                ].map((field, i) => (
                                    <div key={i} className="space-y-1">
                                        <p className="text-[10px] font-normal text-app-text-muted dark:text-app-text-muted uppercase tracking-widest">{field.label}</p>
                                        <p className="text-lg font-normal text-[#101828] dark:text-white">{field.val}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CONFIGURAÇÃO EMISSÃO */}
                    <Card className="border border-gray-100 dark:border-app-border-dark bg-app-card dark:bg-[#0c1e3d] rounded-[24px] shadow-sm">
                        <CardContent className="p-8 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Stethoscope size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-normal text-[#101828] dark:text-white">Configuração de emissão</h3>
                                        <p className="text-app-text-muted dark:text-app-text-muted text-sm font-normal">Defina os parâmetros temporais do documento.</p>
                                    </div>
                                </div>


                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100 dark:border-app-border-dark">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-normal text-app-text-muted dark:text-app-text-muted uppercase tracking-widest ml-1">Data inicial</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted group-focus-within:text-[#0039A6] dark:group-focus-within:text-emerald-400 transition-colors pointer-events-none">
                                            <Calendar size={20} />
                                        </div>
                                        <Input type="date" hideDateIcon
                                            value={dataInicio || ''}
                                            onChange={(e) => handleDataInicioChange(e.target.value)}
                                            className="w-full h-12 pl-12 pr-4 rounded-[12px] bg-app-card dark:bg-[#0c1e3d] border border-app-border dark:border-app-border-dark text-gray-800 dark:text-gray-200 transition-all font-normal placeholder:text-app-text-muted dark:placeholder:text-gray-600 focus:ring-2 focus:ring-[#0039A6]/10 focus:border-[#0039A6] dark:focus:border-emerald-500/50 shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-normal text-app-text-muted dark:text-app-text-muted uppercase tracking-widest ml-1">Data final</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted group-focus-within:text-[#0039A6] dark:group-focus-within:text-emerald-400 transition-colors pointer-events-none">
                                            <Calendar size={20} />
                                        </div>
                                        <Input type="date" hideDateIcon
                                            value={dataFim || ''}
                                            onChange={(e) => handleDataFimChange(e.target.value)}
                                            className={`w-full h-12 pl-12 pr-4 rounded-[12px] bg-app-card dark:bg-[#0c1e3d] border border-app-border dark:border-app-border-dark text-gray-800 dark:text-gray-200 transition-all font-normal placeholder:text-app-text-muted dark:placeholder:text-gray-600 focus:ring-2 focus:ring-[#0039A6]/10 focus:border-[#0039A6] dark:focus:border-emerald-500/50 shadow-sm ${dateError ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                        />
                                    </div>
                                    {dateError && <p className="text-[11px] text-red-500 font-normal uppercase tracking-wider ml-1 mt-1">{dateError}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SELEÇÃO MODELO */}
                    <div className="space-y-6 pt-4">
                        <div className="px-1">
                            <h3 className="text-xl font-normal text-[#101828] dark:text-white">Selecione um modelo</h3>
                            <p className="text-app-text-muted dark:text-app-text-muted text-sm font-normal">Clique em um modelo para visualizar e gerar o documento.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredModels.map((doc, index) => (
                                <div
                                    key={doc.id}
                                    onClick={() => handleViewDocument(doc)}
                                    className="group cursor-pointer p-8 rounded-[24px] bg-app-card dark:bg-[#0c1e3d] border border-gray-100 dark:border-app-border-dark shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#0039A6] dark:text-emerald-400">
                                            <Stethoscope size={24} />
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-normal uppercase ${getBadgeStyle(doc.categoria)}`}>
                                            {doc.categoria}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-normal text-[#101828] dark:text-white mb-2 tracking-tight">{doc.nome}</h4>
                                    <p className="text-sm text-app-text-muted dark:text-app-text-muted leading-relaxed line-clamp-2 font-normal">{doc.desc}</p>
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-app-border-dark flex justify-between items-center">
                                        <div className="flex gap-1 text-[#027A48] dark:text-emerald-500 font-normal text-[11px] uppercase tracking-wider">
                                            <span>Gerar agora</span>
                                            <ChevronRight size={14} />
                                        </div>
                                        <span className="text-[11px] font-normal text-app-text-muted uppercase">{doc.variaveis} Variáveis</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleGenerateAndAttach(doc)
                                        }}
                                        className="mt-3 h-9 w-full rounded-lg border border-app-border dark:border-app-border-dark text-xs text-app-text-secondary dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-app-card/10"
                                    >
                                        Gerar e vincular ao prontuário
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <Card className="border border-gray-100 dark:border-app-border-dark bg-app-card dark:bg-[#0c1e3d] rounded-[24px] shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-normal text-[#101828] dark:text-white">Modelos do sistema</h3>
                                <p className="text-app-text-muted dark:text-app-text-muted text-sm font-normal">Biblioteca de modelos pré-configurados para a unidade.</p>
                            </div>
                            <button
                                onClick={handleNewModel}
                                className="h-11 px-6 rounded-xl bg-[#1F382C] hover:bg-[#15251f] text-white font-normal text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Novo modelo
                            </button>
                        </div>

                        <div className="px-8 pb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
                                <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted group-focus-within:text-[#0039A6] transition-colors">
                                    <Search size={20} />
                                </div>
                                <input
                                    placeholder="Pesquisar por nome ou categoria..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-11 pl-12 pr-4 rounded-xl bg-app-bg-secondary dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark text-gray-800 dark:text-gray-200 transition-all font-normal placeholder:text-app-text-muted dark:placeholder:text-gray-600 focus:ring-2 focus:ring-[#0039A6]/10 focus:border-[#0039A6] dark:focus:border-emerald-500/50 shadow-sm"
                                />
                            </div>
                                <Select value={especialistaFiltro} onValueChange={setEspecialistaFiltro}>
                                    <SelectTrigger className="h-11 rounded-xl bg-app-bg-secondary dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark">
                                        <SelectValue preferPlaceholder placeholder="Todos os especialistas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os especialistas</SelectItem>
                                        {Array.from(new Set(modelos.map((item) => item.especialista))).map((esp) => (
                                            <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <Table>
                                <TableHeader className="bg-[#F9FAFB] dark:bg-app-card/5 border-b border-gray-100 dark:border-app-border-dark">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Nome do modelo</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider text-center">Categoria</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider text-center">Especialista</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider text-center">Variáveis</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider text-center">Status</TableHead>
                                        <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredModels.map((model) => (
                                        <TableRow key={model.id} className="border-b border-gray-50 dark:border-app-border-dark hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors group">
                                            <TableCell className="px-8 py-6 text-sm font-normal text-gray-700 dark:text-white/80">{model.nome}</TableCell>
                                            <TableCell className="px-6 py-6 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-normal uppercase ${getBadgeStyle(model.categoria)}`}>
                                                    {model.categoria}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-6 text-center text-sm text-app-text-secondary dark:text-white/80">{model.especialista}</TableCell>
                                            <TableCell className="px-6 py-6 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-normal text-[10px] px-2 py-1 rounded-full uppercase">
                                                        {model.variaveis} Vars
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-6 text-center">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-normal uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">Ativo</span>
                                            </TableCell>
                                            <TableCell className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-all duration-300">
                                                    <button onClick={() => handleViewDocument(model)} className="h-10 w-10 flex items-center justify-center rounded-xl text-app-text-muted hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"><Eye size={18} /></button>
                                                    <button onClick={() => handleEditDocument(model)} className="h-10 w-10 flex items-center justify-center rounded-xl text-app-text-muted hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"><Edit2 size={18} /></button>
                                                    <button onClick={() => handleDeleteDocument(model)} className="h-10 w-10 flex items-center justify-center rounded-xl text-app-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}


            <VisualizarDocumentoModal open={isPreviewOpen} onOpenChange={setIsPreviewOpen} document={selectedDocument as any} />
            <CadastroModeloModal open={isNewModelOpen} onOpenChange={setIsNewModelOpen} selectedDocument={selectedDocument as any} onSave={handleSaveModel} />
            <ExcluirModeloModal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} documentName={selectedDocument?.nome} />
        </div>
    );
}
