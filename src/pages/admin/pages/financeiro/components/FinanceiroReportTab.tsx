import React from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Download, EyeOff, Eye, Copy,
  Clock, FileSpreadsheet, FileBarChart, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

interface ReportHistoryItem {
  id: number;
  data: string;
  tipo: string;
  periodo: string;
  unidades: string;
  geradoPor: string;
}

interface FinanceiroReportTabProps {
  isDarkMode: boolean;
  showFluxoCaixa: boolean;
  setShowFluxoCaixa: (show: boolean) => void;
  mockCashAccounts: Array<{
    id: number;
    nome: string;
    tipo: string;
    saldo: number;
    cor: string;
  }>;
  mockReportHistory: ReportHistoryItem[];
  handleExportPDF: () => void;
  handleExportXLSX: () => void;
  handleExportCSV: () => void;
  handleGerarRelatorio: () => void;
  handleRemoverRelatorio: (report: ReportHistoryItem) => void;
}

export function FinanceiroReportTab({
  isDarkMode,
  showFluxoCaixa,
  setShowFluxoCaixa,
  mockCashAccounts,
  mockReportHistory,
  handleExportPDF,
  handleExportXLSX,
  handleExportCSV,
  handleGerarRelatorio,
  handleRemoverRelatorio,
}: FinanceiroReportTabProps) {
  return (
    <div className="space-y-6">
      {/* Botão de Ocultar Fluxo de Caixa (sempre visível) */}
      <div className="flex justify-start">
        <Button
          className="bg-[#0039A6] hover:bg-[#002d82] text-white"
          onClick={() => setShowFluxoCaixa(!showFluxoCaixa)}
        >
          {showFluxoCaixa ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Ocultar Fluxo de Caixa Detalhado
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Mostrar Fluxo de Caixa Detalhado
            </>
          )}
        </Button>
      </div>

      {/* 4 Cards principais de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total em Caixas */}
        <Card className={isDarkMode ? 'bg-[#0c1e3d]/30 border-[#0039A6]' : 'bg-app-card border-[#e6e6e6]'}>
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#6c757d]">Total em Caixas</p>
              <Copy className="h-5 w-5 text-[#0039A6]" />
            </div>
            <p className="text-2xl font-bold text-[#0039A6] dark:text-green-400">
              R$ {mockCashAccounts.reduce((sum, acc) => sum + acc.saldo, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        {/* Entradas do Período */}
        <Card className={isDarkMode ? 'bg-[#0c1e3d]/30 border-[#0039A6]' : 'bg-app-card border-[#e6e6e6]'}>
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#6c757d]">Entradas do Período</p>
              <TrendingUp className="h-5 w-5 text-[#00a63e]" />
            </div>
            <p className="text-2xl font-bold text-[#00a63e]">
              R$ 35.200,00
            </p>
          </CardContent>
        </Card>

        {/* Saídas do Período */}
        <Card className={isDarkMode ? 'bg-[#0c1e3d]/30 border-[#0039A6]' : 'bg-app-card border-[#e6e6e6]'}>
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#6c757d]">Saídas do Período</p>
              <TrendingDown className="h-5 w-5 text-[#dc3545]" />
            </div>
            <p className="text-2xl font-bold text-[#dc3545]">
              R$ 13.900,00
            </p>
          </CardContent>
        </Card>

        {/* Saldo do Período */}
        <Card className={isDarkMode ? 'bg-[#0c1e3d]/30 border-[#0039A6]' : 'bg-app-card border-[#e6e6e6]'}>
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#6c757d]">Saldo do Período</p>
              <DollarSign className="h-5 w-5 text-[#1a1a1a]" />
            </div>
            <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">
              R$ 21.300,00
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Saldo Detalhado por Caixa - mostra/oculta baseado no estado */}
      {showFluxoCaixa && (
        <Card className={isDarkMode ? 'bg-[#0c1e3d]/30' : 'bg-app-card'}>
          <CardHeader className="border-b border-[#e6e6e6]">
            <div>
              <CardTitle className="text-base">Saldo Detalhado por Caixa</CardTitle>
              <p className="text-sm text-[#62748e] mt-1">Visualização de todos os caixas e contas</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa]">
                    <TableHead className="text-[#6c757d] font-bold">Caixa/Conta</TableHead>
                    <TableHead className="text-[#6c757d] font-bold">Tipo</TableHead>
                    <TableHead className="text-[#6c757d] font-bold">Entradas</TableHead>
                    <TableHead className="text-[#6c757d] font-bold">Saídas</TableHead>
                    <TableHead className="text-[#6c757d] font-bold">Saldo Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCashAccounts.map((account, index) => {
                    // Dados mockados de entradas/saídas para cada conta
                    const entradas = [8500, 12000, 5200, 1850, 3500, 500, 900][index] || 0;
                    const saidas = [3200, 5900, 1850, 650, 2100, 300, 550][index] || 0;

                    const getTipo = (tipo: string) => {
                      switch (tipo) {
                        case 'banco': return 'Conta Bancária';
                        case 'caixa': return 'Caixa Físico';
                        case 'carteira-digital': return 'Carteira Digital';
                        default: return 'Outro';
                      }
                    };

                    return (
                      <TableRow key={account.id}>
                        <TableCell className="font-normal text-[#1a1a1a] dark:text-white">{account.nome}</TableCell>
                        <TableCell className="text-[#6c757d]">{getTipo(account.tipo)}</TableCell>
                        <TableCell className="text-[#00a63e]">+ R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-[#dc3545]">- R$ {saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className="font-bold text-[#1a1a1a] dark:text-white">
                          R$ {account.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gerador de Relatórios */}
      <Card className={isDarkMode ? 'bg-[#0c1e3d]/30' : 'bg-app-card'}>
        <CardHeader>
          <CardTitle>Gerar Novo Relatório</CardTitle>
          <p className="text-sm text-muted-foreground">Personalize e exporte relatórios financeiros</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Relatório</label>
              <Select>
                <SelectTrigger>
                  <SelectValue preferPlaceholder placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fluxo-caixa">Fluxo de Caixa</SelectItem>
                  <SelectItem value="dre-sintetica">DRE Sintética</SelectItem>
                  <SelectItem value="dre-analitica">DRE Analítica</SelectItem>
                  <SelectItem value="recebimentos">Recebimentos em Aberto</SelectItem>
                  <SelectItem value="pagamentos">Pagamentos em Aberto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select>
                <SelectTrigger>
                  <SelectValue preferPlaceholder placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nov-2025">Nov/2025</SelectItem>
                  <SelectItem value="out-2025">Out/2025</SelectItem>
                  <SelectItem value="set-2025">Set/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Formato</label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm" onClick={handleExportPDF}>PDF</Button>
                <Button variant="outline" className="flex-1" size="sm" onClick={handleExportXLSX}>XLSX</Button>
                <Button variant="outline" className="flex-1" size="sm" onClick={handleExportCSV}>CSV</Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleGerarRelatorio}>
              <Download className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Este Mês</CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Geração</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,3s</div>
            <p className="text-xs text-muted-foreground">Processamento rápido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formato Mais Usado</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">XLSX</div>
            <p className="text-xs text-muted-foreground">68% dos relatórios</p>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Relatórios */}
      <Card className="table-scroll">
        <CardHeader>
          <CardTitle>Histórico de Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Unidades</TableHead>
                <TableHead>Gerado por</TableHead>
                <TableHead>Download</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReportHistory.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-sm">{report.data}</TableCell>
                  <TableCell className="font-medium">{report.tipo}</TableCell>
                  <TableCell className="text-sm">{report.periodo}</TableCell>
                  <TableCell className="text-sm">{report.unidades}</TableCell>
                  <TableCell className="text-sm">{report.geradoPor}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={handleExportPDF}>
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleExportXLSX}>
                        <Download className="h-3 w-3 mr-1" />
                        XLSX
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoverRelatorio(report)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
