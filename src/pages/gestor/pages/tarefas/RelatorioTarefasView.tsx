import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { loadTarefas } from '@/services/tarefas.service'

export function RelatorioTarefasView({
  onPageChange,
  perfil,
}: {
  onPageChange?: (page: string) => void
  perfil: 'gestor' | 'admin'
}) {
  const [usuarioFilter, setUsuarioFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [search, setSearch] = useState('')

  const tarefas = useMemo(() => loadTarefas(), [])
  const usuarios = useMemo(
    () => Array.from(new Set(tarefas.map((item) => item.usuarioCriador))),
    [tarefas],
  )

  const filtered = useMemo(
    () =>
      tarefas.filter((item) => {
        if (perfil === 'gestor' && item.perfil === 'admin') return false
        if (usuarioFilter !== 'todos' && item.usuarioCriador !== usuarioFilter) return false
        if (statusFilter !== 'todos' && item.status !== statusFilter) return false
        if (
          search &&
          !item.titulo.toLowerCase().includes(search.toLowerCase()) &&
          !item.descricao?.toLowerCase().includes(search.toLowerCase())
        ) {
          return false
        }
        return true
      }),
    [perfil, tarefas, usuarioFilter, statusFilter, search],
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Relatório de tarefas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título/descrição"
          className="h-11"
        />
        <Select value={usuarioFilter} onValueChange={setUsuarioFilter}>
          <SelectTrigger className="h-11"><SelectValue preferPlaceholder placeholder="Usuário" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos usuários</SelectItem>
            {usuarios.map((user) => (
              <SelectItem key={user} value={user}>{user}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11"><SelectValue preferPlaceholder placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Concluída">Concluída</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.titulo}</TableCell>
                <TableCell>{item.usuarioCriador}</TableCell>
                <TableCell className="capitalize">{item.perfil}</TableCell>
                <TableCell>{item.prazo}</TableCell>
                <TableCell>
                  <Badge className={item.status === 'Concluída' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
