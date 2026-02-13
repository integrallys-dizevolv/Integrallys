import React, { useState } from 'react'
import {
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
import { Badge } from '@/components/ui/Badge'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { NovoUsuarioModal } from '../usuarios/modals/NovoUsuarioModal'
import { MOCK_UTILIZADORES } from '@/mocks/gestor/utilizadores'

interface UsuariosViewProps {
    onPageChange?: (page: string) => void
}

export const UsuariosView = ({ onPageChange }: UsuariosViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)


    const filteredUsers = MOCK_UTILIZADORES.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.unit.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange?.('inicio')}
                            className="text-sm font-normal text-app-text-muted hover:text-[#0039A6] dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Usuários</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 sm:max-w-sm lg:max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted dark:text-app-text-muted" />
                        <Input
                            placeholder="Buscar usuários por nome, e-mail ou perfil..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 pl-11 bg-app-bg-secondary/50 dark:bg-[#0c1e3d] border-gray-100 dark:border-gray-800 rounded-xl text-sm transition-all focus:ring-2 focus:ring-[#0039A6]/20 font-normal"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-lg border-gray-100 dark:border-gray-800 font-normal">
                        <Search size={18} className="text-app-text-muted" />
                    </Button>
                </div>

                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#0039A6] hover:bg-[#002d82] text-white flex items-center gap-2 rounded-lg h-11 px-6 shadow-md shadow-[#0039A6]/10 w-full md:w-auto font-normal"
                >
                    <Plus size={20} />
                    Adicionar usuário
                </Button>
            </div>

            {/* Users Table */}
            <div className="bg-app-card dark:bg-[#0c1e3d] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-transparent hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                            <TableHead className="px-6 py-4 text-sm font-normal text-gray-900 dark:text-white">Nome</TableHead>
                            <TableHead className="px-6 py-4 text-sm font-normal text-gray-900 dark:text-white">E-mail</TableHead>
                            <TableHead className="px-6 py-4 text-sm font-normal text-gray-900 dark:text-white text-center">Perfil</TableHead>
                            <TableHead className="px-6 py-4 text-sm font-normal text-gray-900 dark:text-white text-center">Unidade</TableHead>
                            <TableHead className="px-6 py-4 text-sm font-normal text-gray-900 dark:text-white text-center">Status</TableHead>
                            <TableHead className="px-6 py-4 text-sm font-normal text-gray-900 dark:text-white text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 border-b border-gray-50 dark:border-gray-800 transition-colors">
                                <TableCell className="px-6 py-4">
                                    <span className="text-sm font-normal text-gray-600 dark:text-white/80">{user.name}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <span className="text-sm text-gray-600 dark:text-white/80 font-normal">{user.email}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-app-bg-secondary dark:bg-app-card/5 text-gray-600 dark:text-app-text-muted text-xs border border-gray-100 dark:border-gray-800 font-normal">
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <span className="text-sm font-normal text-[#7C9AAB] dark:text-blue-400">
                                        {user.unit}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <Badge
                                        className={`rounded-lg px-3 py-1 text-xs font-normal border-none shadow-sm ${user.status === 'Ativo'
                                            ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white'
                                            : 'bg-gray-600 dark:bg-app-bg-dark dark:text-app-text-muted text-white'
                                            }`}
                                    >
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 hover:bg-app-bg-secondary dark:hover:bg-app-card/10 rounded-lg transition-all text-app-text-muted font-normal">
                                                <MoreVertical size={20} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32 p-1 rounded-xl shadow-xl border-gray-100 dark:border-gray-800 dark:bg-[#020817]">
                                            <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/5 font-normal">
                                                <Edit2 size={16} className="text-gray-600 dark:text-app-text-muted" />
                                                <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Editar</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 font-normal">
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


            <NovoUsuarioModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    )
}
