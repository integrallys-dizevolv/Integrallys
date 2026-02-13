import { useState } from 'react'
import {
    Plus,
    MoreVertical,
    Edit2,
    Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'
import { NovoPerfilModal } from './modals/NovoPerfilModal'
import { MOCK_PERFIS } from '@/mocks/gestor/perfis'

interface PermissoesViewProps {
    onPageChange?: (page: string) => void
}

export const PermissoesView = ({ onPageChange }: PermissoesViewProps) => {
    const [isNovoPerfilOpen, setIsNovoPerfilOpen] = useState(false)


    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange?.('inicio')}
                            className="text-sm font-normal text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Permissões</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Action Bar */}
            <div className="flex justify-end">
                <Button
                    onClick={() => setIsNovoPerfilOpen(true)}
                    className="bg-[#0039A6] hover:bg-[#002d82] text-white flex items-center gap-2 rounded-lg h-11 px-6 shadow-md shadow-[#0039A6]/10 font-normal"
                >
                    <Plus size={20} />
                    Novo perfil
                </Button>
            </div>

            {/* Table */}
            <div className="bg-app-card dark:bg-[#0c1e3d] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mt-4">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-transparent hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                            <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider">Nome do perfil</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider">Descrição resumida</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-center">Escopo</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_PERFIS.map((perfil) => (
                            <TableRow key={perfil.id} className="hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 border-b border-gray-50 dark:border-gray-800 transition-colors">
                                <TableCell className="px-6 py-5">
                                    <span className="text-sm font-normal text-[#101828] dark:text-white">{perfil.nome}</span>
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    <span className="text-sm text-[#6a7282] dark:text-app-text-muted font-normal">
                                        {perfil.descricao}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-app-bg-secondary dark:bg-app-card/5 text-[#6a7282] dark:text-app-text-muted text-xs border border-gray-100 dark:border-gray-800 font-normal">
                                        {perfil.escopo}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-5 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 hover:bg-app-bg-secondary dark:hover:bg-app-card/10 rounded-lg transition-all text-app-text-muted">
                                                <MoreVertical size={20} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32 p-1 rounded-xl shadow-xl border-gray-100 dark:border-gray-800 dark:bg-[#020817]">
                                            <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                                <Edit2 size={16} className="text-gray-600 dark:text-app-text-muted font-normal" />
                                                <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Editar</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600">
                                                <Trash2 size={16} />
                                                <span className="text-sm font-normal">Excluir</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            <NovoPerfilModal
                isOpen={isNovoPerfilOpen}
                onClose={() => setIsNovoPerfilOpen(false)}
            />
        </div>
    )
}
