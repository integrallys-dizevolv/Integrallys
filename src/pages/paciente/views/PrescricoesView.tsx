import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, Eye, Download, Trash2 } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import { PrescricaoModal } from '../modals/PrescricaoModal'
import { ExcluirModal } from '../modals/ExcluirModal'
import type { PatientPrescriptionDoc } from '@/types'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'

interface PrescricoesViewProps {
    mockPrescricoes: PatientPrescriptionDoc[]
    onPageChange: (page: string) => void
}

export function PrescricoesView({ mockPrescricoes, onPageChange }: PrescricoesViewProps) {
    const [buscaPrescricao, setBuscaPrescricao] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('todos')
    const [filtroStatus, setFiltroStatus] = useState('todos')

    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedDoc, setSelectedDoc] = useState<PatientPrescriptionDoc | null>(null)

    const handleView = (doc: PatientPrescriptionDoc) => {
        setSelectedDoc(doc)
        setViewModalOpen(true)
    }

    const handleDelete = (doc: PatientPrescriptionDoc) => {
        setSelectedDoc(doc)
        setDeleteModalOpen(true)
    }

    const confirmDelete = () => {
        setDeleteModalOpen(false)
        setSelectedDoc(null)
    }

    const filteredPrescricoes = mockPrescricoes.filter(item => {
        const matchesSearch =
            item.id.toString().toLowerCase().includes(buscaPrescricao.toLowerCase()) ||
            item.profissional.toLowerCase().includes(buscaPrescricao.toLowerCase())

        const matchesType = filtroTipo === 'todos' || item.tipo.toLowerCase() === filtroTipo.toLowerCase()
        const matchesStatus = filtroStatus === 'todos' || item.status.toLowerCase() === filtroStatus.toLowerCase()

        return matchesSearch && matchesType && matchesStatus
    })



    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange('inicio')}
                            className="text-sm font-medium text-gray-500 hover:text-[#0039A6] dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-medium text-gray-900 dark:text-white">Prescrições e Documentos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div>
                <h2 className="text-2xl font-bold text-[#101828] dark:text-white">Prescrições e Documentos</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredPrescricoes.length} documentos encontrados
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por nº ou profissional..."
                        className="h-11 pl-10 bg-white dark:bg-[#0c1e3d] border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-[#0039A6] transition-all"
                        value={buscaPrescricao}
                        onChange={(e) => setBuscaPrescricao(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                        <SelectTrigger className="w-full md:w-[180px] h-11 bg-white dark:bg-[#0c1e3d] border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-[#0039A6]">
                            <SelectValue preferPlaceholder placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-200 dark:border-white/10">
                            <SelectItem value="todos">Todos os tipos</SelectItem>
                            <SelectItem value="prescricao">Prescrição</SelectItem>
                            <SelectItem value="atestado">Atestado</SelectItem>
                            <SelectItem value="exame">Exame</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                        <SelectTrigger className="w-full md:w-[180px] h-11 bg-white dark:bg-[#0c1e3d] border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-[#0039A6]">
                            <SelectValue preferPlaceholder placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-200 dark:border-white/10">
                            <SelectItem value="todos">Todos os status</SelectItem>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="expirado">Expirado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Card className="rounded-[14px] border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader className="bg-gray-50/50 dark:bg-white/5">
                            <TableRow>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm py-4 whitespace-nowrap px-4">Nº Prescrição</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm py-4 whitespace-nowrap px-4">Profissional</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm py-4 whitespace-nowrap px-4">Data</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm py-4 whitespace-nowrap px-4">Tipo</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm py-4 whitespace-nowrap px-4">Validade</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm py-4 whitespace-nowrap px-4">Status</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm py-4 whitespace-nowrap px-4">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPrescricoes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        Nenhum documento encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPrescricoes.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 border-gray-100 dark:border-gray-800">
                                        <TableCell className="text-center py-4 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap px-4">
                                            {item.id}
                                        </TableCell>
                                        <TableCell className="text-center py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap px-4">{item.profissional}</TableCell>
                                        <TableCell className="text-center py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap px-4">{item.data}</TableCell>
                                        <TableCell className="text-center py-4 px-4">
                                            <Badge variant="outline" className="bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                                                {item.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap px-4">{item.validade}</TableCell>
                                        <TableCell className="text-center py-4 px-4">
                                            <Badge
                                                className={`
                                                     font-medium rounded-md px-2.5 py-0.5 whitespace-nowrap border-0
                                                     ${item.status === 'Ativo'
                                                        ? 'bg-[#0039A6]/10 text-[#0039A6] dark:bg-[#0039A6]/20 dark:text-[#4ADE80]'
                                                        : item.status === 'Pendente'
                                                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                                            : 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-400'}
                                                 `}
                                            >
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 active:scale-95 transition-all"
                                                    onClick={() => handleView(item)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 active:scale-95 transition-all"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 active:scale-95 transition-all"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <PrescricaoModal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                selectedDoc={selectedDoc}
            />

            <ExcluirModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                documentId={selectedDoc ? String(selectedDoc.id) : undefined}
            />
        </div>
    )
}
