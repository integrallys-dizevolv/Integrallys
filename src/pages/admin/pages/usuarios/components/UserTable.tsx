import { Eye, Edit, Trash2, UserCog, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import type { User } from '../../../components/types'

interface UserTableProps {
    users: User[]
    onView: (user: User) => void
    onEdit: (user: User) => void
    onPermissions: (user: User) => void
    onDelete: (user: User) => void
}

export function UserTable({ users, onView, onEdit, onPermissions, onDelete }: UserTableProps) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Nome</TableHead>
                                <TableHead className="min-w-[250px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">E-mail</TableHead>
                                <TableHead className="min-w-[150px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Perfil</TableHead>
                                <TableHead className="min-w-[180px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Unidade</TableHead>
                                <TableHead className="min-w-[100px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Status</TableHead>
                                <TableHead className="text-center min-w-[100px] text-xs font-normal text-app-text-secondary dark:text-app-text-muted ">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <p className="text-app-text-secondary dark:text-app-text-muted">
                                            Nenhum usuário encontrado com os filtros aplicados.
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-normal text-app-text-primary dark:text-white">
                                            {user.nome}
                                        </TableCell>
                                        <TableCell className="text-app-text-secondary dark:text-app-text-muted">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">{user.perfil}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-app-text-secondary dark:text-app-text-muted">
                                            {user.unidade}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={user.status === 'Ativo'
                                                    ? 'bg-[#0039A6] text-white shadow-sm font-normal rounded-md px-3 py-1 whitespace-nowrap'
                                                    : 'bg-gray-600 text-white dark:bg-app-bg-dark dark:text-gray-200 font-normal rounded-md px-3 py-1 whitespace-nowrap shadow-sm'
                                                }
                                            >
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 mx-auto">
                                                        <MoreVertical className="h-4 w-4 text-app-text-secondary dark:text-app-text-muted" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => onView(user)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Visualizar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onEdit(user)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    {/* Ajuste "Alterar permissões" com whitespace-nowrap para não quebrar o texto */}
                                                    <DropdownMenuItem onClick={() => onPermissions(user)} className="whitespace-nowrap">
                                                        <UserCog className="h-4 w-4 mr-2" />
                                                        Alterar permissões
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600 dark:text-red-400">
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
