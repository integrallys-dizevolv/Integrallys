import { useState, useMemo, useRef, useEffect } from 'react';
import { getTodayDate } from '@/utils/dateUtils';
import { Download, MoreVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb';
import { mockAuditLogs, type AuditLog } from '@/mocks/admin/audit';

interface AuditoriaViewProps {
  setCurrentPage: (page: string) => void;
}

export function AuditoriaView({ setCurrentPage }: AuditoriaViewProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);


  const [filters, setFilters] = useState(() => {
    const today = getTodayDate();
    return {
      dataInicial: today,
      dataFinal: today,
      acao: 'todas',
      modulo: 'todos',
      search: ''
    };
  });

  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLInputElement && activeElement.type === 'date') {
          activeElement.blur();
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter(log => {
      if (filters.acao !== 'todas' && log.acao !== filters.acao) return false;
      if (filters.modulo !== 'todos' && log.modulo !== filters.modulo) return false;

      if (filters.dataInicial) {
        const logDate = log.timestamp.split(' ')[0].split('/').reverse().join('-');
        if (logDate < filters.dataInicial) return false;
      }
      if (filters.dataFinal) {
        const logDate = log.timestamp.split(' ')[0].split('/').reverse().join('-');
        if (logDate > filters.dataFinal) return false;
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          log.usuario.toLowerCase().includes(search) ||
          log.descricao.toLowerCase().includes(search) ||
          log.ip.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [filters]);

  const openViewLogModal = (log: AuditLog) => {
    setSelectedLog(log);
  };

  const closeModal = () => {
    setSelectedLog(null);
  };

  const getAcaoBadgeVariant = (acao: string) => {
    switch (acao) {
      case 'CRIAR':
        return 'default';
      case 'EDITAR':
        return 'outline';
      case 'DELETAR':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setCurrentPage('inicio')} className="cursor-pointer">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Log de Auditoria</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Filtros */}
      <Card ref={filtersRef} className="p-4 md:p-6 bg-app-card dark:bg-app-card-dark border-app-border dark:border-app-border-dark shadow-sm rounded-[14px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          <div className="space-y-2 focus-within:z-50 relative">
            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">Data inicial</Label>
            <input
              type="date"
              value={filters.dataInicial}
              onChange={(e) => updateFilter('dataInicial', e.target.value)}
              className="w-full h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-lg text-sm font-normal text-app-text-primary dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#0039A6]/10 transition-all"
            />
          </div>

          <div className="space-y-2 focus-within:z-50 relative">
            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">Data final</Label>
            <input
              type="date"
              value={filters.dataFinal}
              onChange={(e) => updateFilter('dataFinal', e.target.value)}
              className="w-full h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-lg text-sm font-normal text-app-text-primary dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#0039A6]/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">Ação</Label>
            <Select value={filters.acao} onValueChange={(v) => updateFilter('acao', v)}>
              <SelectTrigger className="h-11 rounded-lg bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark w-full">
                <SelectValue preferPlaceholder placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="todas">Todos</SelectItem>
                <SelectItem value="CRIAR">Criar</SelectItem>
                <SelectItem value="EDITAR">Editar</SelectItem>
                <SelectItem value="DELETAR">Deletar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">Módulo</Label>
            <Select value={filters.modulo} onValueChange={(v) => updateFilter('modulo', v)}>
              <SelectTrigger className="h-11 rounded-lg bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark w-full text-sm font-normal">
                <SelectValue preferPlaceholder placeholder="Todos os módulos" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Agendamento">Agendamento</SelectItem>
                <SelectItem value="Prontuário">Prontuário</SelectItem>
                <SelectItem value="Paciente">Paciente</SelectItem>
                <SelectItem value="Usuário">Usuário</SelectItem>
                <SelectItem value="Produto">Produto</SelectItem>
                <SelectItem value="Permissões">Permissões</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 flex flex-row items-center justify-center gap-2 h-11 px-3 sm:px-4 bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-lg whitespace-nowrap transition-all active:scale-95 shadow-sm font-normal"
            >
              <Download className="h-4 w-4 shrink-0" />
              <span className="text-sm font-normal leading-none">Exportar</span>
            </Button>
          </div>

        </div>
      </Card>

      {/* Tabela de Logs */}
      <Card className="table-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-normal">Data/hora</TableHead>
              <TableHead className="font-normal">Usuário</TableHead>
              <TableHead className="font-normal">Ação</TableHead>
              <TableHead className="font-normal">Módulo</TableHead>
              <TableHead className="font-normal">Descrição</TableHead>
              <TableHead className="font-normal">IP</TableHead>
              <TableHead className="text-center font-normal">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-normal text-[#64748B] dark:text-app-text-muted">{log.timestamp}</TableCell>
                <TableCell className="font-normal text-app-text-primary dark:text-white">{log.usuario}</TableCell>
                <TableCell>
                  <Badge variant={getAcaoBadgeVariant(log.acao) as any} className="font-normal">
                    {log.acao.charAt(0).toUpperCase() + log.acao.slice(1).toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {log.modulo}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-normal text-[#64748B] dark:text-app-text-muted max-w-xs truncate">
                  {log.descricao}
                </TableCell>
                <TableCell className="text-sm font-mono font-normal text-[#64748B] dark:text-app-text-muted">{log.ip}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex items-center justify-center">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewLogModal(log)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar detalhes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal de Visualização de Log */}
      <Dialog open={selectedLog !== null} onOpenChange={closeModal}>
        <DialogContent className="max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Detalhes do log de auditoria</DialogTitle>
            <DialogDescription>
              Informações completas sobre a ação registrada.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-5 px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Data e Hora */}
                <div className="space-y-2">
                  <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Data e hora</Label>
                  <div className="flex items-center px-4 h-11 bg-[#F9FAFB] dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark rounded-xl text-base text-app-text-primary dark:text-white">
                    {selectedLog.timestamp}
                  </div>
                </div>

                {/* Usuário */}
                <div className="space-y-2">
                  <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Usuário</Label>
                  <div className="flex items-center px-4 h-11 bg-[#F9FAFB] dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark rounded-xl text-base text-app-text-primary dark:text-white">
                    {selectedLog.usuario}
                  </div>
                </div>

                {/* Ação */}
                <div className="space-y-2">
                  <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Ação</Label>
                  <div className="flex items-center px-4 h-11 bg-[#F9FAFB] dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark rounded-xl">
                    <Badge variant={getAcaoBadgeVariant(selectedLog.acao) as any} className=" font-normal px-3 py-1">
                      {selectedLog.acao.charAt(0).toUpperCase() + selectedLog.acao.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </div>

                {/* Módulo */}
                <div className="space-y-2">
                  <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Módulo</Label>
                  <div className="flex items-center px-4 h-11 bg-[#F9FAFB] dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark rounded-xl">
                    <Badge variant="outline" className="bg-app-card dark:bg-app-card/10 text-gray-700 dark:text-white/80 border-app-border dark:border-white/20 font-normal px-3 py-1">
                      {selectedLog.modulo}
                    </Badge>
                  </div>
                </div>

                {/* Endereço IP */}
                <div className="space-y-2 sm:col-span-1">
                  <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Endereço IP</Label>
                  <div className="flex items-center px-4 h-11 bg-[#F9FAFB] dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark rounded-xl text-base text-app-text-primary dark:text-white font-mono">
                    {selectedLog.ip}
                  </div>
                </div>

                {/* Descrição Completa */}
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label className="text-sm font-normal text-app-text-primary dark:text-white/80">Descrição completa</Label>
                  <div className="flex items-center px-4 py-3 min-h-[44px] bg-[#F9FAFB] dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark rounded-xl text-base text-app-text-primary dark:text-white">
                    {selectedLog.descricao}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={closeModal}
                  className="bg-[#0039A6] hover:bg-[#1d3b2e] text-white px-8 h-11 rounded-xl font-normal shadow-sm transition-all active:scale-95"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div >
  );
}

