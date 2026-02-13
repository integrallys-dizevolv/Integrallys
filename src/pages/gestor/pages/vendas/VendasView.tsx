import React, { useMemo, useState } from 'react'
import {
  Search,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  MoreVertical,
  Eye,
  FileText,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { NovaVendaModal } from '@/pages/recepcao/pages/prescricoes/modals/NovaVendaModal'
import { MOCK_PRESCRICOES, Prescription } from '@/mocks/recepcionista/prescricoes'
import { BASE_UNIDADES } from '@/mocks/shared/base'

interface VendasViewProps {
  onPageChange?: (page: string) => void
}

type CardDetail = 'mes' | 'produtos' | 'ticket'

export const VendasView = ({ onPageChange }: VendasViewProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(MOCK_PRESCRICOES)
  const [isNovaVendaOpen, setIsNovaVendaOpen] = useState(false)
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false)
  const [activeCard, setActiveCard] = useState<CardDetail | null>(null)

  const formatMoney = (value: number) =>
    `R$ ${value.toFixed(2).replace('.', ',')}`

  const salesRows = useMemo(() => {
    const unitNames = [BASE_UNIDADES.central.nome, BASE_UNIDADES.norte.nome]
    return prescriptions.flatMap((presc, index) => {
      const unit = unitNames[index % unitNames.length]
      const items = presc.items || []
      return items.map((item, itemIndex) => {
        const unitCostValue = item.unitPrice * 0.6
        return {
          id: `${presc.id}-${item.productId}-${itemIndex}`,
          prescriptionNumber: presc.number,
          patientName: presc.patientName,
          specialistName: presc.specialistName,
          createdAt: presc.createdAt,
          type: presc.type,
          status: presc.status,
          product: item.productName,
          unit,
          quantity: item.quantity,
          unitPrice: formatMoney(item.unitPrice),
          unitCost: formatMoney(unitCostValue),
          margin: '40%',
          total: formatMoney(item.total)
        }
      })
    })
  }, [prescriptions])

  const filteredSales = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return salesRows.filter((sale) =>
      sale.product.toLowerCase().includes(term) ||
      sale.unit.toLowerCase().includes(term) ||
      sale.patientName.toLowerCase().includes(term) ||
      sale.specialistName.toLowerCase().includes(term) ||
      sale.prescriptionNumber.toLowerCase().includes(term)
    )
  }, [searchTerm, salesRows])

  const totalMonthValue = useMemo(() => {
    return prescriptions.reduce((acc, presc) => acc + presc.totalValue, 0)
  }, [prescriptions])

  const totalItemsSold = useMemo(() => {
    return prescriptions.reduce((acc, presc) => {
      const items = presc.items || []
      return acc + items.reduce((sum, item) => sum + item.quantity, 0)
    }, 0)
  }, [prescriptions])

  const avgTicket = useMemo(() => {
    if (!prescriptions.length) return 0
    return totalMonthValue / prescriptions.length
  }, [prescriptions, totalMonthValue])

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; total: number }>()
    prescriptions.forEach((presc) => {
      presc.items?.forEach((item) => {
        const current = map.get(item.productId)
        if (current) {
          current.qty += item.quantity
          current.total += item.total
        } else {
          map.set(item.productId, {
            name: item.productName,
            qty: item.quantity,
            total: item.total
          })
        }
      })
    })
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 5)
  }, [prescriptions])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Convertida':
        return (
          <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none shadow-sm font-normal rounded-lg px-3 py-1 whitespace-nowrap">
            Convertida
          </Badge>
        )
      case 'Ativa':
        return (
          <Badge className="bg-amber-500 dark:bg-amber-900/40 dark:text-amber-100 text-white border-none shadow-sm font-normal rounded-lg px-3 py-1 whitespace-nowrap">
            Ativa
          </Badge>
        )
      case 'Vencida':
        return (
          <Badge className="bg-red-600 dark:bg-red-900/40 dark:text-red-100 text-white border-none shadow-sm font-normal rounded-lg px-3 py-1 whitespace-nowrap">
            Vencida
          </Badge>
        )
      default:
        return <Badge variant="outline" className="font-normal rounded-lg">{status}</Badge>
    }
  }

  const handleOpenCard = (card: CardDetail) => {
    setActiveCard(card)
    setIsCardDetailOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => onPageChange?.('inicio')}
              className="text-sm font-normal text-app-text-muted hover:text-[#0039A6] dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
            >
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Prescricao/Vendas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Prescricoes/Vendas do mes</span>
              <button
                type="button"
                title="Ver detalhes"
                onClick={() => handleOpenCard('mes')}
                className="h-10 w-10 rounded-lg bg-[#0039A6] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <ShoppingBag size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-2xl font-normal text-[#101828] dark:text-white">{formatMoney(totalMonthValue)}</h3>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-emerald-600 font-normal flex items-center">
                  <ArrowUpRight size={14} className="mr-0.5" />
                  +18%
                </span>
                <span className="text-app-text-muted dark:text-app-text-muted">vs mes anterior</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Produtos vendidos</span>
              <button
                type="button"
                title="Ver detalhes"
                onClick={() => handleOpenCard('produtos')}
                className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <TrendingUp size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-2xl font-normal text-[#101828] dark:text-white">{totalItemsSold}</h3>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[#6a7282] dark:text-app-text-muted font-normal">+25 este mes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Ticket medio</span>
              <button
                type="button"
                title="Ver detalhes"
                onClick={() => handleOpenCard('ticket')}
                className="h-10 w-10 rounded-lg bg-teal-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <DollarSign size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-2xl font-normal text-[#101828] dark:text-white">{formatMoney(avgTicket)}</h3>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-red-500 font-normal flex items-center">
                  <ArrowDownRight size={14} className="mr-0.5" />
                  -2%
                </span>
                <span className="text-app-text-muted dark:text-app-text-muted font-normal">vs mes anterior</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NovaVendaModal
        isOpen={isNovaVendaOpen}
        onClose={() => setIsNovaVendaOpen(false)}
        onSave={(venda) => {
          setPrescriptions((prev) => [venda, ...prev])
        }}
      />

      <Dialog open={isCardDetailOpen} onOpenChange={setIsCardDetailOpen}>
        <DialogContent className="max-w-[720px] p-0 overflow-hidden bg-app-card dark:bg-[#0c1e3d] border-app-border dark:border-app-border-dark">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-app-border dark:border-app-border-dark">
            <DialogTitle className="text-[28px] leading-tight font-normal text-app-text-primary dark:text-white">
              {activeCard === 'mes' && 'Detalhes de Prescricoes/Vendas do mes'}
              {activeCard === 'produtos' && 'Detalhes de Produtos vendidos'}
              {activeCard === 'ticket' && 'Detalhes do Ticket medio'}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            {activeCard === 'mes' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-app-border dark:border-app-border-dark p-4 bg-app-bg-secondary/40 dark:bg-app-card/20">
                    <p className="text-xs text-app-text-muted">Total em Prescricoes/Vendas</p>
                    <p className="mt-1 text-lg text-app-text-primary dark:text-white">{formatMoney(totalMonthValue)}</p>
                  </div>
                  <div className="rounded-xl border border-app-border dark:border-app-border-dark p-4 bg-app-bg-secondary/40 dark:bg-app-card/20">
                    <p className="text-xs text-app-text-muted">Quantidade de Prescricoes/Vendas</p>
                    <p className="mt-1 text-lg text-app-text-primary dark:text-white">{prescriptions.length}</p>
                  </div>
                  <div className="rounded-xl border border-app-border dark:border-app-border-dark p-4 bg-app-bg-secondary/40 dark:bg-app-card/20">
                    <p className="text-xs text-app-text-muted">Itens vendidos</p>
                    <p className="mt-1 text-lg text-app-text-primary dark:text-white">{totalItemsSold}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-app-border dark:border-app-border-dark p-4">
                  <p className="text-xs text-app-text-muted">Ticket medio do periodo</p>
                  <p className="mt-1 text-base text-app-text-primary dark:text-white">{formatMoney(avgTicket)}</p>
                </div>
              </>
            )}

            {activeCard === 'produtos' && (
              <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden">
                {topProducts.length === 0 && (
                  <p className="px-4 py-5 text-sm text-app-text-muted">Sem produtos registrados.</p>
                )}
                {topProducts.map((item, index) => (
                  <div
                    key={item.name}
                    className={`px-4 py-3 flex items-center justify-between ${index !== topProducts.length - 1 ? 'border-b border-app-border dark:border-app-border-dark' : ''}`}
                  >
                    <div>
                      <p className="text-sm text-app-text-primary dark:text-white">{item.name}</p>
                      <p className="text-xs text-app-text-muted">{item.qty} unidades</p>
                    </div>
                    <p className="text-sm text-app-text-primary dark:text-white">{formatMoney(item.total)}</p>
                  </div>
                ))}
              </div>
            )}

            {activeCard === 'ticket' && (
              <>
                <div className="rounded-xl border border-app-border dark:border-app-border-dark p-4 bg-app-bg-secondary/40 dark:bg-app-card/20">
                  <p className="text-xs text-app-text-muted">Ticket medio atual</p>
                  <p className="mt-1 text-lg text-app-text-primary dark:text-white">{formatMoney(avgTicket)}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-app-border dark:border-app-border-dark p-4">
                    <p className="text-xs text-app-text-muted">Valor total acumulado</p>
                    <p className="mt-1 text-base text-app-text-primary dark:text-white">{formatMoney(totalMonthValue)}</p>
                  </div>
                  <div className="rounded-xl border border-app-border dark:border-app-border-dark p-4">
                    <p className="text-xs text-app-text-muted">Quantidade de Prescricoes/Vendas</p>
                    <p className="mt-1 text-base text-app-text-primary dark:text-white">{prescriptions.length}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-app-card dark:bg-[#0c1e3d] p-6 rounded-t-xl border border-b-0 border-gray-100 dark:border-app-border-dark">
            <h2 className="text-lg font-normal text-gray-900 dark:text-white">Prescricoes/Vendas recentes</h2>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative w-full md:w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                <Input
                  placeholder="Buscar por paciente, prescricao ou produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pl-9 bg-app-bg-secondary dark:bg-[#152520] border-app-border dark:border-app-border-dark rounded-lg focus:ring-1 focus:ring-[#0039A6] transition-all font-normal"
                />
              </div>
              <Button
                onClick={() => setIsNovaVendaOpen(true)}
                className="h-10 px-4 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-lg flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} />
                Nova Prescricao/Venda
              </Button>
            </div>
          </div>

          <div className="bg-app-card dark:bg-[#0c1e3d] rounded-b-xl border border-t-0 border-gray-100 dark:border-app-border-dark shadow-sm overflow-hidden mt-0">
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-app-card dark:bg-[#0c1e3d]">
                  <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Prescricao/Venda</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Paciente</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Profissional</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Produto</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Unidade</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Quantidade</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Preco unit.</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Custo unit.</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Margem</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Total</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Data</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right whitespace-nowrap">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 border-b border-gray-50 dark:border-gray-800 transition-colors">
                      <TableCell className="px-6 py-5">
                        <span className="text-sm font-normal text-[#101828] dark:text-white whitespace-nowrap">{sale.prescriptionNumber}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{sale.patientName}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{sale.specialistName}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="font-normal text-[#101828] dark:text-white whitespace-nowrap">{sale.product}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{sale.unit}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-gray-900 dark:text-white whitespace-nowrap font-normal">{sale.quantity}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{sale.unitPrice}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{sale.unitCost}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{sale.margin}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm font-normal text-gray-900 dark:text-white whitespace-nowrap">{sale.total}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{sale.createdAt}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        {getStatusBadge(sale.status)}
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-app-bg-secondary dark:hover:bg-app-card/10 rounded-lg transition-all text-app-text-muted outline-none focus:ring-2 focus:ring-[#0039A6]/20 font-normal">
                              <MoreVertical size={20} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-gray-100 dark:border-app-border-dark dark:bg-[#0c1e3d]">
                            <DropdownMenuItem className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/5 text-gray-700 dark:text-gray-200 font-normal">
                              <Eye size={16} className="text-app-text-muted" />
                              <span className="text-sm font-normal">Visualizar detalhes</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/5 text-gray-700 dark:text-gray-200 font-normal">
                              <FileText size={16} className="text-app-text-muted dark:text-app-text-muted" />
                              <span className="text-sm font-normal">Nota fiscal</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredSales.length === 0 && (
                <div className="text-center py-12 font-normal">
                  <div className="w-12 h-12 bg-app-bg-secondary dark:bg-app-card/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search size={24} className="text-app-text-muted" />
                  </div>
                  <h3 className="text-sm font-normal text-gray-900 dark:text-white">Nenhuma Prescricao/Venda encontrada</h3>
                  <p className="text-sm text-app-text-muted dark:text-app-text-muted mt-1">Tente buscar por outro termo.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
