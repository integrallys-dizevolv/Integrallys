import React, { useState, useEffect, useRef } from 'react';
import { getTodayDate } from '@/utils/dateUtils';
import {
    Calendar, Users, DollarSign, FileText, Package, UserCheck,
    FileBarChart, Download, Filter, CheckCircle, AlertCircle, CreditCard, Info, TrendingUp, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { cn } from '@/lib/utils';
import {
    MOCK_AGENDAMENTOS_REPORT,
    MOCK_CLIENTES_REPORT,
    MOCK_VENDAS_REPORT,
    MOCK_ORCAMENTOS_REPORT,
    MOCK_ESTOQUE_REPORT,
    MOCK_ESTOQUE_ENTRADAS_DIARIAS,
    MOCK_ESTOQUE_SAIDAS_DIARIAS,
    MOCK_REPASSE_REPORT,
    MOCK_FINANCEIRO_REPORT,
    MOCK_NFS_REPORT,
    MOCK_NFE_REPORT,
    MOCK_COMISSOES_REPORT,
    MOCK_JUSTIFICATIVAS_REPORT
} from '@/mocks/admin/relatorios';
import { mapPacientesToAniversariantes } from '@/mocks/shared/aniversariantes';
import { loadAgendaCancellationEvents } from '@/utils/agendaCancelamentos';
import { MOCK_RELATORIO_RETORNOS, type RelatorioRetornoItem } from '@/mocks/recepcionista/relatoriosRetornos';
import { loadRetornosFollowup } from '@/utils/retornosFollowup';
import { loadConsumoInterno } from '@/services/consumoInterno.service';

type ReportType = 'agendamentos' | 'clientes' | 'vendas' | 'orcamentos' | 'estoque' |
    'repasse' | 'nfs' | 'nfe' | 'financeiro' | 'justificativas' | 'comissoes' | 'aniversariantes' | 'retornos' | 'consumo';

interface RelatoriosViewProps {
    onPageChange?: (page: string) => void;
}

export function RelatoriosView({ onPageChange }: RelatoriosViewProps) {
    const [activeReport, setActiveReport] = useState<ReportType>('agendamentos');
    const [showFilters, setShowFilters] = useState(false);
    const [aniversarioChecks, setAniversarioChecks] = useState<Record<string, boolean>>({});
    const [agendaCancellationEvents, setAgendaCancellationEvents] = useState(loadAgendaCancellationEvents());
    const [retornosRefreshTick, setRetornosRefreshTick] = useState(0);



    // Estados para filtros por aba (Independente) - Inicializado com data atual
    const [tabFilters, setTabFilters] = useState<Record<string, Record<string, string>>>(() => {
        const today = getTodayDate();
        return {
            agendamentos: { dataInicial: today, dataFinal: today },
            vendas: { dataInicial: today, dataFinal: today },
            orcamentos: { dataInicial: today, dataFinal: today },
            repasse: { dataInicial: today, dataFinal: today },
            comissoes: { dataInicial: today, dataFinal: today },
            nfs: { dataInicial: today, dataFinal: today },
            nfe: { dataInicial: today, dataFinal: today },
            movimento: { dataInicial: today, dataFinal: today },
            recebimentos: { dataInicial: today, dataFinal: today },
            cartao: { dataInicial: today, dataFinal: today },
            pagamentos: { dataInicial: today, dataFinal: today },
            justificativas: { dataInicial: today, dataFinal: today },
            aniversariantes: { data: today, periodo: 'dia' },
            retornos: { dataInicial: today, dataFinal: today },
            consumo: { dataInicial: today, dataFinal: today },
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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const syncEvents = () => setAgendaCancellationEvents(loadAgendaCancellationEvents());
        syncEvents();
        window.addEventListener('storage', syncEvents);
        return () => window.removeEventListener('storage', syncEvents);
    }, []);

    useEffect(() => {
        const onStorage = () => setRetornosRefreshTick((prev) => prev + 1);
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const updateFilter = (tabId: string, key: string, value: string) => {
        setTabFilters(prev => ({
            ...prev,
            [tabId]: { ...prev[tabId], [key]: value }
        }));
    };

    const getFilter = (tabId: string, key: string, defaultValue: string = '') => {
        return tabFilters[tabId]?.[key] ?? defaultValue;
    };

    const mergedJustificativas = React.useMemo(() => {
        const fromAgenda = agendaCancellationEvents.map((event) => {
            const [year, month, day] = event.appointmentDate.split('-');
            return {
                data: `${day}/${month}/${year}`,
                horario: event.appointmentTime,
                cliente: event.patient,
                procedimento: event.procedure,
                profissional: event.professional,
                motivo: 'Cancelamento',
                justificativa: event.reason,
                responsavel: event.cancelledBy,
                valor: event.amount || 0,
            };
        });
        return [...fromAgenda, ...MOCK_JUSTIFICATIVAS_REPORT];
    }, [agendaCancellationEvents]);

    // 1. Agendamentos
    const agendamentosFiltrados = React.useMemo(() => {
        const filters = tabFilters.agendamentos || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;
        const fUnidade = filters.unidade || 'todas';
        const fProcedimento = filters.procedimento || 'todos';
        const fCliente = (filters.cliente || '').toLowerCase();
        const fConvenio = filters.convenio || 'todos';
        const fPagamento = filters.pagamento || 'todos';
        const fStatus = filters.status || 'todos';

        return MOCK_AGENDAMENTOS_REPORT.filter(item => {
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            if (fUnidade !== 'todas' && item.unidade !== (fUnidade === 'central' ? 'Clínica Central' : 'Unidade Norte')) return false;
            if (fPagamento !== 'todos' && item.pagamento.toLowerCase() !== (fPagamento === 'pago' ? 'pago' : 'em aberto')) return false;
            if (fStatus !== 'todos') {
                if (fStatus === 'cancelado-justificativa') {
                    if (item.status.toLowerCase() !== 'cancelado' || !(item as any).justificativa) return false;
                } else {
                    const mappedStatus = fStatus === 'nao-compareceu' ? 'não compareceu' : fStatus.toLowerCase();
                    if (item.status.toLowerCase() !== mappedStatus) return false;
                }
            }

            return true;
        });
    }, [tabFilters.agendamentos]);

    const totalRecebido = React.useMemo(() =>
        agendamentosFiltrados.filter(item => item.pagamento === 'Pago').reduce((acc, item) => acc + item.valor, 0),
        [agendamentosFiltrados]
    );

    const totalEmAberto = React.useMemo(() =>
        agendamentosFiltrados.filter(item => item.pagamento === 'Em Aberto').reduce((acc, item) => acc + item.valor, 0),
        [agendamentosFiltrados]
    );

    const totalAgendamentos = React.useMemo(() => agendamentosFiltrados.length, [agendamentosFiltrados]);

    // 2. Clientes
    const clientesFiltrados = React.useMemo(() => {
        const filters = tabFilters.clientes || {};
        const fNome = (filters.nome || '').toLowerCase();
        const fProcedimento = filters.procedimento || 'todos';
        const fMidia = filters.midia || 'todas';
        const fSexo = filters.sexo || 'todos';
        const fUnidade = filters.unidade || 'todas';
        const fConvenio = filters.convenio || 'todas';

        return MOCK_CLIENTES_REPORT.filter(item => {
            if (fNome && !item.nome.toLowerCase().includes(fNome)) return false;
            if (fProcedimento !== 'todos' && !(item.procedimento || '').toLowerCase().includes(fProcedimento.toLowerCase())) return false;
            if (fMidia !== 'todas' && item.midia.toLowerCase() !== fMidia.toLowerCase()) return false;
            if (fSexo !== 'todos' && item.sexo.toLowerCase() !== fSexo.toLowerCase()) return false;
            if (fUnidade !== 'todas' && (item.unidade || '').toLowerCase() !== fUnidade.toLowerCase()) return false;
            if (fConvenio !== 'todas' && item.convenio.toLowerCase() !== fConvenio.toLowerCase()) return false;

            return true;
        });
    }, [tabFilters.clientes]);

    // 3. Vendas
    const vendasFiltrados = React.useMemo(() => {
        const filters = tabFilters.vendas || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;
        const fUnidade = filters.unidade || 'todas';
        const fProduto = (filters.produto || '').toLowerCase();
        const fCliente = (filters.cliente || '').toLowerCase();
        const fPagamento = filters.formaPagamento || 'todas';

        return MOCK_VENDAS_REPORT.filter(item => {
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            if (fUnidade !== 'todas' && item.unidade.toLowerCase() !== fUnidade.toLowerCase()) return false;
            if (fProduto && !item.produto.toLowerCase().includes(fProduto)) return false;
            if (fCliente && !item.cliente.toLowerCase().includes(fCliente)) return false;
            if (fPagamento !== 'todas' && item.pagamento.toLowerCase() !== fPagamento.toLowerCase()) return false;

            return true;
        });
    }, [tabFilters.vendas]);

    const totalVendas = React.useMemo(() =>
        vendasFiltrados.reduce((acc, item) => acc + item.total, 0),
        [vendasFiltrados]
    );

    const consumoInternoFiltrado = React.useMemo(() => {
        const filters = tabFilters.consumo || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;
        const fUsuario = (filters.usuario || '').toLowerCase();
        const fProduto = (filters.produto || '').toLowerCase();

        return loadConsumoInterno().filter((item) => {
            if (fDataInicial && item.data < fDataInicial) return false;
            if (fDataFinal && item.data > fDataFinal) return false;
            if (fUsuario && !item.usuario.toLowerCase().includes(fUsuario)) return false;
            if (fProduto && !item.produto.toLowerCase().includes(fProduto)) return false;
            return true;
        });
    }, [tabFilters.consumo, retornosRefreshTick]);

    const consumoTotais = React.useMemo(() => {
        return consumoInternoFiltrado.reduce(
            (acc, item) => {
                acc.totalCusto += item.totalCusto;
                acc.totalItens += item.quantidade;
                return acc;
            },
            { totalCusto: 0, totalItens: 0 },
        );
    }, [consumoInternoFiltrado]);

    // 4. Orçamentos
    const orcamentosFiltrados = React.useMemo(() => {
        const filters = tabFilters.orcamentos || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;
        const fStatus = filters.status || 'todos';
        const fUnidade = filters.unidade || 'todas';
        const fCliente = (filters.cliente || '').toLowerCase();
        const fProfissional = (filters.profissional || '').toLowerCase();

        return MOCK_ORCAMENTOS_REPORT.filter(item => {
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            if (fUnidade !== 'todas' && (item.unidade || '').toLowerCase() !== fUnidade.toLowerCase()) return false;
            if (fCliente && !item.cliente.toLowerCase().includes(fCliente)) return false;
            if (fProfissional && !item.profissional.toLowerCase().includes(fProfissional)) return false;
            if (fStatus !== 'todos') {
                const mappedStatus = fStatus === 'ativo' ? 'Ativo' : fStatus === 'executado' ? 'Executado' : 'Cancelado';
                if (item.situacao !== mappedStatus && (fStatus !== 'ativo' || item.situacao !== 'No Prazo')) return false;
            }

            return true;
        });
    }, [tabFilters.orcamentos]);

    // 5. Estoque
    const estoqueFiltrados = React.useMemo(() => {
        const filters = tabFilters.estoque || {};
        const fProduto = (filters.produto || '').toLowerCase();
        const fCategoria = filters.categoria || 'todos';
        const fTipoEstoque = filters.tipoEstoque || 'todos';
        const fStatus = filters.status || 'todas';

        return MOCK_ESTOQUE_REPORT.filter(item => {
            if (fProduto && !item.produto.toLowerCase().includes(fProduto)) return false;
            if (fCategoria !== 'todos' && item.categoria.toLowerCase() !== fCategoria.toLowerCase()) return false;
            if (fTipoEstoque !== 'todos' && (item.tipoEstoque || '').toLowerCase() !== fTipoEstoque.toLowerCase()) return false;
            if (fStatus !== 'todas') {
                const mappedStatus = fStatus === 'adequado' ? 'Normal' : fStatus === 'baixo' ? 'Baixo' : 'Crítico';
                if (item.situacao !== mappedStatus) return false;
            }

            return true;
        });
    }, [tabFilters.estoque]);

    const estoqueNormal = React.useMemo(() => estoqueFiltrados.filter(item => item.situacao === 'Normal').length, [estoqueFiltrados]);
    const estoqueBaixo = React.useMemo(() => estoqueFiltrados.filter(item => item.situacao === 'Baixo').length, [estoqueFiltrados]);
    const estoqueCritico = React.useMemo(() => estoqueFiltrados.filter(item => item.situacao === 'Crítico').length, [estoqueFiltrados]);

    // 6. Repasse
    const repasseFiltrados = React.useMemo(() => {
        const filters = tabFilters.repasse || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;
        const fProfissional = filters.profissional || 'todos';
        const fUnidade = filters.unidade || 'todas';
        const fProcedimento = filters.procedimento || 'todos';
        const fSituacao = filters.situacao || 'todas';

        return MOCK_REPASSE_REPORT.filter(item => {
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            if (fProfissional !== 'todos' && !item.profissional.toLowerCase().includes(fProfissional.toLowerCase())) return false;
            if (fUnidade !== 'todas' && (item.unidade || '').toLowerCase() !== fUnidade.toLowerCase()) return false;
            if (fProcedimento !== 'todos' && !item.procedimento.toLowerCase().includes(fProcedimento.toLowerCase())) return false;
            if (fSituacao !== 'todas' && (item.situacao || '').toLowerCase() !== fSituacao.toLowerCase()) return false;

            return true;
        });
    }, [tabFilters.repasse]);

    const totalRecebidoRepasse = React.useMemo(() => repasseFiltrados.reduce((acc, item) => acc + item.recebido, 0), [repasseFiltrados]);

    // 9. Financeiro / Movimento
    const financeiroFiltrado = React.useMemo(() => {
        const filters = tabFilters.financeiro || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;
        const fUnidade = filters.unidade || 'todas';
        const fTipo = filters.tipo || 'todos';
        const fPagamento = filters.formaPagamento || 'todas';
        const fBusca = (filters.busca || '').toLowerCase();
        const fUsuario = (filters.usuario || '').toLowerCase();

        return MOCK_FINANCEIRO_REPORT.filter(item => {
            if (fBusca && !item.descricao.toLowerCase().includes(fBusca) && !item.categoria.toLowerCase().includes(fBusca)) return false;
            if (fUsuario && !(item.usuario || '').toLowerCase().includes(fUsuario)) return false;
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            if (fUnidade !== 'todas' && item.unidade) {
                if (fUnidade === 'central' && item.unidade !== 'Clínica Central') return false;
                if (fUnidade === 'norte' && item.unidade !== 'Unidade Norte') return false;
            }
            if (fTipo !== 'todos') {
                if (fTipo === 'entrada' && item.tipo !== 'Receita') return false;
                if (fTipo === 'saida' && item.tipo !== 'Despesa') return false;
            }
            if (fPagamento !== 'todas') {
                if (fPagamento === 'pix' && item.formaPagamento !== 'PIX') return false;
                if (fPagamento === 'dinheiro' && item.formaPagamento !== 'Dinheiro') return false;
            }

            return true;
        });
    }, [tabFilters.financeiro]);

    const totalReceitas = React.useMemo(() =>
        financeiroFiltrado.filter(item => item.tipo === 'Receita').reduce((acc, item) => acc + item.valor, 0),
        [financeiroFiltrado]
    );

    // 10. NFS
    const nfsFiltrados = React.useMemo(() => {
        const filters = tabFilters.nfs || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;

        return MOCK_NFS_REPORT.filter(item => {
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            return true;
        });
    }, [tabFilters.nfs]);

    // 11. NFE
    const nfeFiltrados = React.useMemo(() => {
        const filters = tabFilters.nfe || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;

        return MOCK_NFE_REPORT.filter(item => {
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            return true;
        });
    }, [tabFilters.nfe]);

    // 12. Comissões
    const comissoesFiltrados = React.useMemo(() => {
        const filters = tabFilters.comissoes || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;
        const fVendedor = filters.vendedor || 'todos';
        const fCliente = (filters.cliente || '').toLowerCase();

        return MOCK_COMISSOES_REPORT.filter(item => {
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            if (fVendedor !== 'todos' && !item.vendedor.toLowerCase().includes(fVendedor.toLowerCase())) return false;
            if (fCliente && !item.cliente.toLowerCase().includes(fCliente)) return false;
            return true;
        });
    }, [tabFilters.comissoes]);

    // 13. Justificativas
    const justificativasFiltrados = React.useMemo(() => {
        const filters = tabFilters.justificativas || {};
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;
        const fCliente = (filters.cliente || '').toLowerCase();
        const fProfissional = (filters.profissional || '').toLowerCase();
        const fProcedimento = (filters.procedimento || '').toLowerCase();

        return mergedJustificativas.filter(item => {
            if (fDataInicial && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate < fDataInicial) return false;
            }
            if (fDataFinal && item.data) {
                const itemDate = item.data.split('/').reverse().join('-');
                if (itemDate > fDataFinal) return false;
            }
            if (fCliente && !item.cliente.toLowerCase().includes(fCliente)) return false;
            if (fProfissional && !item.profissional.toLowerCase().includes(fProfissional)) return false;
            if (fProcedimento && !item.procedimento.toLowerCase().includes(fProcedimento)) return false;
            return true;
        });
    }, [tabFilters.justificativas, mergedJustificativas]);

    const aniversariantesFiltrados = React.useMemo(() => {
        const filters = tabFilters.aniversariantes || {};
        const dataRef = filters.data || getTodayDate();
        const periodo = filters.periodo || 'dia';
        const refDate = new Date(`${dataRef}T00:00:00`);
        const mesRef = refDate.getMonth() + 1;
        const diaRef = refDate.getDate();

        return mapPacientesToAniversariantes(refDate).filter((item) => {
            const [, mes, dia] = item.dataNascimento.split('-').map(Number);
            if (periodo === 'mes') return mes === mesRef;
            return mes === mesRef && dia === diaRef;
        });
    }, [tabFilters.aniversariantes]);

    const toggleAniversarioCheck = (id: string) => {
        setAniversarioChecks((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Retornos
    const getRetornoStatus = (proximoRetorno: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const parts = proximoRetorno.includes('/') ? proximoRetorno.split('/').reverse() : proximoRetorno.split('-');
        const retDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        retDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((retDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Prazo Vencido';
        if (diffDays <= 10) return 'Limite Prazo';
        return 'No Prazo';
    };

    const mergedRetornos = React.useMemo<RelatorioRetornoItem[]>(() => {
        const customRetornos = loadRetornosFollowup().map((item, index) => ({
            id: 1000 + index,
            data: '2026-02-10',
            cliente: item.cliente,
            procedimentosRecentes: ['Consulta', 'Acompanhamento', 'Retorno'] as [string, string, string],
            profissional: item.profissional,
            especialidade: item.especialidade || '',
            proximoRetorno: item.proximoRetorno,
        }));
        return [...customRetornos, ...MOCK_RELATORIO_RETORNOS];
    }, [retornosRefreshTick]);

    const retornoProfissionalOptions = React.useMemo(() => {
        return Array.from(new Set(mergedRetornos.map(item => item.profissional)));
    }, [mergedRetornos]);

    const retornoEspecialidadeOptions = React.useMemo(() => {
        return Array.from(new Set(mergedRetornos.map(item => item.especialidade).filter(Boolean)));
    }, [mergedRetornos]);

    const filteredRetornos = React.useMemo(() => {
        const filters = tabFilters.retornos || {};
        const fSearch = (getFilter('retornos', 'cliente') || '').toLowerCase();
        const fProfissional = getFilter('retornos', 'profissional', 'todos');
        const fEspecialidade = getFilter('retornos', 'especialidade', 'todos');
        const fStatus = getFilter('retornos', 'status', 'todos');
        const fDataInicial = filters.dataInicial;
        const fDataFinal = filters.dataFinal;

        return mergedRetornos.filter((item) => {
            if (fSearch && !item.cliente.toLowerCase().includes(fSearch)) return false;
            if (fProfissional !== 'todos' && item.profissional !== fProfissional) return false;
            if (fEspecialidade !== 'todos' && item.especialidade !== fEspecialidade) return false;
            if (fStatus !== 'todos' && getRetornoStatus(item.proximoRetorno) !== fStatus) return false;
            if (fDataInicial) {
                const d = item.proximoRetorno.includes('/') ? item.proximoRetorno.split('/').reverse().join('-') : item.proximoRetorno;
                if (d < fDataInicial) return false;
            }
            if (fDataFinal) {
                const d = item.proximoRetorno.includes('/') ? item.proximoRetorno.split('/').reverse().join('-') : item.proximoRetorno;
                if (d > fDataFinal) return false;
            }
            return true;
        });
    }, [mergedRetornos, tabFilters.retornos]);

    const retornoTotals = React.useMemo(() => {
        const totals = { total: 0, noPrazo: 0, limitePrazo: 0, prazoVencido: 0 };
        filteredRetornos.forEach((item) => {
            totals.total++;
            const s = getRetornoStatus(item.proximoRetorno);
            if (s === 'No Prazo') totals.noPrazo++;
            else if (s === 'Limite Prazo') totals.limitePrazo++;
            else totals.prazoVencido++;
        });
        return totals;
    }, [filteredRetornos]);

    const reportTabs = [
        { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'vendas', label: 'Prescrição/Vendas', icon: DollarSign },
        { id: 'consumo', label: 'Consumo Interno', icon: Package },
        { id: 'orcamentos', label: 'Orçamentos/Prescrição', icon: FileText },
        { id: 'estoque', label: 'Estoque', icon: Package },
        { id: 'repasse', label: 'Repasse Especialistas', icon: UserCheck },
        { id: 'nfs', label: 'NF-s (Serviço)', icon: FileBarChart },
        { id: 'nfe', label: 'NF-e (Produto)', icon: FileBarChart },
        { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
        { id: 'comissoes', label: 'Comissões', icon: DollarSign },
        { id: 'justificativas', label: 'Justificativas', icon: Info },
        { id: 'aniversariantes', label: 'Aniversariantes', icon: Calendar },
        { id: 'retornos', label: 'Retornos', icon: RotateCcw },
    ];

    return (
        <div className="space-y-6 max-w-full">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer font-normal">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-normal text-gray-900 dark:text-white">Relatórios</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="p-[17px] bg-app-card dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark overflow-hidden">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-transparent">
                    {reportTabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveReport(tab.id as ReportType)}
                                className={`flex items-center gap-2 px-6 h-[37px] rounded-full text-sm whitespace-nowrap transition-all shrink-0 font-normal ${activeReport === tab.id
                                    ? 'bg-[#0039A6] text-white shadow-md'
                                    : 'bg-[#f8f9fa] dark:bg-app-bg-dark text-[#6c757d] dark:text-white/80 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </Card>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 h-11 px-4 border-[#dee2e6] dark:border-app-border-dark rounded-lg w-full sm:w-auto font-normal"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4 text-[#4a5565] dark:text-app-text-muted" />
                        {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                    </Button>

                    <Button
                        className="flex items-center gap-2 h-11 px-4 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-lg w-full sm:w-auto transition-all active:scale-95 font-normal shadow-sm"
                    >
                        <Download className="h-4 w-4" />
                        Exportar relatório
                    </Button>
                </div>

                {showFilters && (
                    <Card ref={filtersRef} className="p-6 bg-app-card dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark shadow-sm rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <InputField label="Data Inicial" type="date" value={getFilter(activeReport, 'dataInicial')} onChange={(v) => updateFilter(activeReport, 'dataInicial', v)} />
                            <InputField label="Data Final" type="date" value={getFilter(activeReport, 'dataFinal')} onChange={(v) => updateFilter(activeReport, 'dataFinal', v)} />

                            {(activeReport === 'agendamentos' || activeReport === 'vendas' || activeReport === 'financeiro') && (
                                <SelectField label="Unidade" value={getFilter(activeReport, 'unidade', 'todas')} onChange={(v) => updateFilter(activeReport, 'unidade', v)} options={[
                                    ['todas', 'Todas'],
                                    ['cl??nica central', 'Cl??nica Central'],
                                    ['unidade norte', 'Unidade Norte'],
                                ]} />
                            )}

                            {activeReport === 'agendamentos' && (
                                <>
                                    <InputField label="Nome do cliente" value={getFilter(activeReport, 'cliente')} onChange={(v) => updateFilter(activeReport, 'cliente', v)} />
                                    <SelectField label="Procedimento" value={getFilter(activeReport, 'procedimento', 'todos')} onChange={(v) => updateFilter(activeReport, 'procedimento', v)} options={[
                                        ['todos', 'Todos'], ['consulta', 'Consulta'], ['reconsulta', 'Reconsulta'], ['quiropraxia', 'Quiropraxia'], ['hidrocolon', 'Hidrocolon'], ['fototerapy', 'Fototerapy'], ['outro', 'Outro'],
                                    ]} />
                                    <SelectField label="Conv??nio" value={getFilter(activeReport, 'convenio', 'todos')} onChange={(v) => updateFilter(activeReport, 'convenio', v)} options={[
                                        ['todos', 'Todos'], ['particular', 'Particular'], ['unimed', 'Unimed'],
                                    ]} />
                                    <SelectField label="Status" value={getFilter(activeReport, 'status', 'todos')} onChange={(v) => updateFilter(activeReport, 'status', v)} options={[
                                        ['todos', 'Todos'],
                                        ['realizado', 'Realizado'],
                                        ['agendado', 'Agendado'],
                                        ['cancelado', 'Cancelado'],
                                        ['cancelado-justificativa', 'Cancelado c/ Justificativa'],
                                        ['nao-compareceu', 'Não Compareceu'],
                                        ['disponível', 'Disponível'],
                                    ]} />
                                </>
                            )}

                            {activeReport === 'clientes' && (
                                <>
                                    <InputField label="Nome do cliente" value={getFilter(activeReport, 'nome')} onChange={(v) => updateFilter(activeReport, 'nome', v)} />
                                    <SelectField label="Procedimento" value={getFilter(activeReport, 'procedimento', 'todos')} onChange={(v) => updateFilter(activeReport, 'procedimento', v)} options={[
                                        ['todos', 'Todos'], ['consulta', 'Consulta'], ['reconsulta', 'Reconsulta'], ['quiropraxia', 'Quiropraxia'], ['hidrocolon', 'Hidrocolon'], ['fototerapy', 'Fototerapy'], ['outro', 'Outro'],
                                    ]} />
                                    <SelectField label="M??dia" value={getFilter(activeReport, 'midia', 'todas')} onChange={(v) => updateFilter(activeReport, 'midia', v)} options={[
                                        ['todas', 'Todas'], ['facebook', 'Facebook'], ['instagram', 'Instagram'], ['r??dio', 'R??dio'], ['indica????o', 'Indica????o'],
                                    ]} />
                                    <SelectField label="Sexo" value={getFilter(activeReport, 'sexo', 'todos')} onChange={(v) => updateFilter(activeReport, 'sexo', v)} options={[
                                        ['todos', 'Todos'], ['feminino', 'Feminino'], ['masculino', 'Masculino'],
                                    ]} />
                                    <SelectField label="Unidade" value={getFilter(activeReport, 'unidade', 'todas')} onChange={(v) => updateFilter(activeReport, 'unidade', v)} options={[
                                        ['todas', 'Todas'], ['clinica central', 'Clinica Central'], ['unidade norte', 'Unidade Norte'],
                                    ]} />
                                </>
                            )}

                            {activeReport === 'vendas' && (
                                <>
                                    <InputField label="Produto" value={getFilter(activeReport, 'produto')} onChange={(v) => updateFilter(activeReport, 'produto', v)} />
                                    <InputField label="Cliente" value={getFilter(activeReport, 'cliente')} onChange={(v) => updateFilter(activeReport, 'cliente', v)} />
                                    <SelectField label="Forma de pagamento" value={getFilter(activeReport, 'formaPagamento', 'todas')} onChange={(v) => updateFilter(activeReport, 'formaPagamento', v)} options={[
                                        ['todas', 'Todas'], ['pix', 'PIX'], ['dinheiro', 'Dinheiro'], ['d??bito', 'D??bito'], ['cr??dito', 'Cr??dito'],
                                    ]} />
                                </>
                            )}

                            {activeReport === 'consumo' && (
                                <>
                                    <InputField label="Usuário" value={getFilter(activeReport, 'usuario')} onChange={(v) => updateFilter(activeReport, 'usuario', v)} />
                                    <InputField label="Produto" value={getFilter(activeReport, 'produto')} onChange={(v) => updateFilter(activeReport, 'produto', v)} />
                                </>
                            )}

                            {activeReport === 'orcamentos' && (
                                <>
                                    <SelectField label="Unidade" value={getFilter(activeReport, 'unidade', 'todas')} onChange={(v) => updateFilter(activeReport, 'unidade', v)} options={[
                                        ['todas', 'Todas'], ['clinica central', 'Clinica Central'], ['unidade norte', 'Unidade Norte'],
                                    ]} />
                                    <InputField label="Cliente" value={getFilter(activeReport, 'cliente')} onChange={(v) => updateFilter(activeReport, 'cliente', v)} />
                                    <InputField label="Profissional" value={getFilter(activeReport, 'profissional')} onChange={(v) => updateFilter(activeReport, 'profissional', v)} />
                                </>
                            )}

                            {activeReport === 'estoque' && (
                                <>
                                    <InputField label="Produto" value={getFilter(activeReport, 'produto')} onChange={(v) => updateFilter(activeReport, 'produto', v)} />
                                    <InputField label="Categoria" value={getFilter(activeReport, 'categoria')} onChange={(v) => updateFilter(activeReport, 'categoria', v)} />
                                    <SelectField label="Tipo estoque" value={getFilter(activeReport, 'tipoEstoque', 'todos')} onChange={(v) => updateFilter(activeReport, 'tipoEstoque', v)} options={[
                                        ['todos', 'Todos'], ['suprimentos', 'Suprimentos'], ['Prescrição/Vendas', 'Prescrição/Vendas'],
                                    ]} />
                                    <SelectField label="Status" value={getFilter(activeReport, 'status', 'todas')} onChange={(v) => updateFilter(activeReport, 'status', v)} options={[
                                        ['todas', 'Todas'], ['adequado', 'Normal'], ['baixo', 'Baixo'], ['critico', 'Critico'],
                                    ]} />
                                </>
                            )}

                            {activeReport === 'repasse' && (
                                <>
                                    <SelectField label="Unidade" value={getFilter(activeReport, 'unidade', 'todas')} onChange={(v) => updateFilter(activeReport, 'unidade', v)} options={[
                                        ['todas', 'Todas'], ['clinica central', 'Clinica Central'], ['unidade norte', 'Unidade Norte'],
                                    ]} />
                                    <InputField label="Procedimento" value={getFilter(activeReport, 'procedimento')} onChange={(v) => updateFilter(activeReport, 'procedimento', v)} />
                                    <SelectField label="Situa????o" value={getFilter(activeReport, 'situacao', 'todas')} onChange={(v) => updateFilter(activeReport, 'situacao', v)} options={[
                                        ['todas', 'Todas'], ['atendido', 'Atendido'], ['cancelado', 'Cancelado'],
                                    ]} />
                                </>
                            )}

                            {activeReport === 'financeiro' && <InputField label="Usu??rio" value={getFilter(activeReport, 'usuario')} onChange={(v) => updateFilter(activeReport, 'usuario', v)} />}
                            {activeReport === 'comissoes' && <InputField label="Cliente" value={getFilter(activeReport, 'cliente')} onChange={(v) => updateFilter(activeReport, 'cliente', v)} />}

                            {activeReport === 'justificativas' && (
                                <>
                                    <InputField label="Cliente" value={getFilter(activeReport, 'cliente')} onChange={(v) => updateFilter(activeReport, 'cliente', v)} />
                                    <InputField label="Profissional" value={getFilter(activeReport, 'profissional')} onChange={(v) => updateFilter(activeReport, 'profissional', v)} />
                                    <InputField label="Procedimento" value={getFilter(activeReport, 'procedimento')} onChange={(v) => updateFilter(activeReport, 'procedimento', v)} />
                                </>
                            )}

                            {activeReport === 'aniversariantes' && (
                                <>
                                    <InputField label="Data de referência" type="date" value={getFilter(activeReport, 'data', getTodayDate())} onChange={(v) => updateFilter(activeReport, 'data', v)} />
                                    <SelectField label="Período" value={getFilter(activeReport, 'periodo', 'dia')} onChange={(v) => updateFilter(activeReport, 'periodo', v)} options={[
                                        ['dia', 'Dia'],
                                        ['mes', 'Mês'],
                                    ]} />
                                </>
                            )}

                            {activeReport === 'retornos' && (
                                <>
                                    <InputField label="Nome do cliente" value={getFilter(activeReport, 'cliente')} onChange={(v) => updateFilter(activeReport, 'cliente', v)} />
                                    <SelectField label="Profissional" value={getFilter(activeReport, 'profissional', 'todos')} onChange={(v) => updateFilter(activeReport, 'profissional', v)} options={[
                                        ['todos', 'Todos'],
                                        ...retornoProfissionalOptions.map(p => [p, p] as [string, string]),
                                    ]} />
                                    <SelectField label="Especialidade" value={getFilter(activeReport, 'especialidade', 'todos')} onChange={(v) => updateFilter(activeReport, 'especialidade', v)} options={[
                                        ['todos', 'Todas'],
                                        ...retornoEspecialidadeOptions.map(e => [e, e] as [string, string]),
                                    ]} />
                                    <SelectField label="Situação" value={getFilter(activeReport, 'status', 'todos')} onChange={(v) => updateFilter(activeReport, 'status', v)} options={[
                                        ['todos', 'Todas'],
                                        ['No Prazo', 'No Prazo'],
                                        ['Limite Prazo', 'Limite Prazo'],
                                        ['Prazo Vencido', 'Prazo Vencido'],
                                    ]} />
                                </>
                            )}

                            <div className="flex items-end lg:col-span-1">
                                <Button variant="outline" className="w-full h-11 border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5 rounded-lg font-normal" onClick={() => setTabFilters({})}>
                                    Limpar filtros
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {activeReport === 'agendamentos' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard title="Total Recebido" value={`R$ ${totalRecebido.toFixed(2)}`} color="text-green-600" bg="bg-green-100 dark:bg-emerald-900/40" icon={CheckCircle} />
                            <StatCard title="Em Aberto" value={`R$ ${totalEmAberto.toFixed(2)}`} color="text-orange-600" bg="bg-orange-100 dark:bg-amber-900/40" icon={AlertCircle} />
                            <StatCard title="Agendamentos" value={totalAgendamentos.toString()} color="text-[#0039A6] dark:text-white" bg="bg-[#0039A6]/10 dark:bg-[#0039A6]/30" icon={Calendar} />
                        </div>
                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Data</TableHead>
                                    <TableHead className="px-6 py-4">Horário</TableHead>
                                    <TableHead className="px-6 py-4">Cliente</TableHead>
                                    <TableHead className="px-6 py-4">Status</TableHead>
                                    <TableHead className="px-6 py-4">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agendamentosFiltrados.map((item, i) => (
                                    <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                        <TableCell className="px-6 py-4">{item.data}</TableCell>
                                        <TableCell className="px-6 py-4">{item.horario}</TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.cliente}</TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge className={cn("font-normal rounded-lg px-3 py-1 text-white border-none shadow-sm transition-all",
                                                item.status === 'Realizado' ? "bg-green-600 dark:bg-emerald-900/60 dark:text-emerald-100" :
                                                    item.status === 'Agendado' ? "bg-blue-600 dark:bg-blue-900/60 dark:text-blue-100" :
                                                        "bg-orange-500 dark:bg-amber-900/60 dark:text-amber-100"
                                            )}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">R$ {item.valor.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableWrapper>
                    </div>
                )}

                {activeReport === 'clientes' && (
                    <TableWrapper>
                        <TableHeader>
                            <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                <TableHead className="px-6 py-4">Nome</TableHead>
                                <TableHead className="px-6 py-4">Cidade</TableHead>
                                <TableHead className="px-6 py-4">Convênio</TableHead>
                                <TableHead className="px-6 py-4">Última Consulta</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientesFiltrados.map((item, i) => (
                                <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                    <TableCell className="px-6 py-4 font-normal text-[#101828] dark:text-white">{item.nome}</TableCell>
                                    <TableCell className="px-6 py-4 font-normal">{item.cidade}</TableCell>
                                    <TableCell className="px-6 py-4 font-normal">{item.convenio}</TableCell>
                                    <TableCell className="px-6 py-4 font-normal">{item.ultimo}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableWrapper>
                )}

                {activeReport === 'vendas' && (
                    <div className="space-y-6">
                        <StatCard title="Total em Prescrição/Vendas" value={`R$ ${totalVendas.toFixed(2)}`} color="text-green-600" bg="bg-green-100 dark:bg-emerald-900/40" icon={DollarSign} />
                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Data</TableHead>
                                    <TableHead className="px-6 py-4">Cliente</TableHead>
                                    <TableHead className="px-6 py-4">Total</TableHead>
                                    <TableHead className="px-6 py-4">Pagamento</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendasFiltrados.map((item, i) => (
                                    <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                        <TableCell className="px-6 py-4 font-normal">{item.data}</TableCell>
                                        <TableCell className="px-6 py-4 font-normal text-[#101828] dark:text-white">{item.cliente}</TableCell>
                                        <TableCell className="px-6 py-4 font-normal">R$ {item.total.toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4 font-normal">{item.pagamento}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableWrapper>
                    </div>
                )}

                {activeReport === 'consumo' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard title="Custo total (consumo)" value={`R$ ${consumoTotais.totalCusto.toFixed(2)}`} color="text-red-600" bg="bg-red-100 dark:bg-rose-900/40" icon={DollarSign} />
                            <StatCard title="Itens consumidos" value={consumoTotais.totalItens.toString()} color="text-orange-600" bg="bg-orange-100 dark:bg-amber-900/40" icon={Package} />
                            <StatCard title="Lançamentos" value={consumoInternoFiltrado.length.toString()} color="text-[#0039A6] dark:text-white" bg="bg-[#0039A6]/10 dark:bg-[#0039A6]/30" icon={Info} />
                        </div>

                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Data</TableHead>
                                    <TableHead className="px-6 py-4">Hora</TableHead>
                                    <TableHead className="px-6 py-4">Usuário</TableHead>
                                    <TableHead className="px-6 py-4">Paciente</TableHead>
                                    <TableHead className="px-6 py-4">Produto</TableHead>
                                    <TableHead className="px-6 py-4">Qtd</TableHead>
                                    <TableHead className="px-6 py-4">Custo Unit.</TableHead>
                                    <TableHead className="px-6 py-4">Total Custo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {consumoInternoFiltrado.length > 0 ? consumoInternoFiltrado.map((item) => (
                                    <TableRow key={item.id} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                        <TableCell className="px-6 py-4">{item.data.split('-').reverse().join('/')}</TableCell>
                                        <TableCell className="px-6 py-4">{item.hora}</TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.usuario}</TableCell>
                                        <TableCell className="px-6 py-4">{item.paciente}</TableCell>
                                        <TableCell className="px-6 py-4">{item.produto}</TableCell>
                                        <TableCell className="px-6 py-4">{item.quantidade}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {item.custoUnitario.toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-red-600">R$ {item.totalCusto.toFixed(2)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="px-6 py-8 text-center text-app-text-muted">
                                            Nenhum consumo interno encontrado para os filtros selecionados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </TableWrapper>
                    </div>
                )}

                {activeReport === 'orcamentos' && (
                    <TableWrapper>
                        <TableHeader>
                            <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                <TableHead className="px-6 py-4">Data</TableHead>
                                <TableHead className="px-6 py-4">Cliente</TableHead>
                                <TableHead className="px-6 py-4">Profissional</TableHead>
                                <TableHead className="px-6 py-4">Produto/Combo</TableHead>
                                <TableHead className="px-6 py-4">Valor</TableHead>
                                <TableHead className="px-6 py-4">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orcamentosFiltrados.map((item, i) => (
                                <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                    <TableCell className="px-6 py-4">{item.data}</TableCell>
                                    <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.cliente}</TableCell>
                                    <TableCell className="px-6 py-4">{item.profissional}</TableCell>
                                    <TableCell className="px-6 py-4">{item.produto}</TableCell>
                                    <TableCell className="px-6 py-4">R$ {item.valor.toFixed(2)}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge variant="outline" className={cn("font-normal",
                                            item.situacao === 'Vencido' ? "border-red-500 text-red-600" : "border-blue-500 text-blue-600"
                                        )}>
                                            {item.situacao}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableWrapper>
                )}

                {activeReport === 'estoque' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard title="N?vel Normal" value={estoqueNormal.toString()} color="text-green-600" bg="bg-green-100 dark:bg-emerald-900/40" icon={Package} />
                            <StatCard title="N?vel Baixo" value={estoqueBaixo.toString()} color="text-orange-600" bg="bg-orange-100 dark:bg-amber-900/40" icon={AlertCircle} />
                            <StatCard title="Critico" value={estoqueCritico.toString()} color="text-red-600" bg="bg-red-100 dark:bg-rose-900/40" icon={AlertCircle} />
                            <StatCard title="Qtd Produtos" value={estoqueFiltrados.reduce((acc, i) => acc + i.quantidade, 0).toString()} color="text-[#0039A6] dark:text-white" bg="bg-[#0039A6]/10 dark:bg-[#0039A6]/30" icon={Package} />
                        </div>
                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Produto</TableHead>
                                    <TableHead className="px-6 py-4">Tipo Estoque</TableHead>
                                    <TableHead className="px-6 py-4">Lote</TableHead>
                                    <TableHead className="px-6 py-4">Validade</TableHead>
                                    <TableHead className="px-6 py-4">Qtd Atual</TableHead>
                                    <TableHead className="px-6 py-4">M?nimo</TableHead>
                                    <TableHead className="px-6 py-4">Custo Unit.</TableHead>
                                    <TableHead className="px-6 py-4">Venda Unit.</TableHead>
                                    <TableHead className="px-6 py-4">Margem</TableHead>
                                    <TableHead className="px-6 py-4">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {estoqueFiltrados.map((item, i) => (
                                    <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                        <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.produto}</TableCell>
                                        <TableCell className="px-6 py-4">{item.tipoEstoque || "-"}</TableCell>
                                        <TableCell className="px-6 py-4">{item.lote}</TableCell>
                                        <TableCell className="px-6 py-4">{item.validade}</TableCell>
                                        <TableCell className="px-6 py-4">{item.quantidade}</TableCell>
                                        <TableCell className="px-6 py-4">{item.minimo}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {(item.custoUnitario ?? item.valor * 0.6).toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {item.valor.toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {(item.margemValor ?? (item.valor - (item.custoUnitario ?? item.valor * 0.6))).toFixed(2)} ({(item.margemPercentual ?? ((item.valor - (item.custoUnitario ?? item.valor * 0.6)) / (item.custoUnitario ?? item.valor * 0.6) * 100)).toFixed(2)}%)</TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge className={cn("font-normal rounded-lg px-3 py-1 text-white border-none shadow-sm transition-all",
                                                item.situacao === 'Normal' ? "bg-green-600 dark:bg-emerald-900/60 dark:text-emerald-100" :
                                                    item.situacao === 'Baixo' ? "bg-orange-500 dark:bg-amber-900/60 dark:text-amber-100" :
                                                        "bg-red-600 dark:bg-rose-900/60 dark:text-rose-100"
                                            )}>
                                                {item.situacao}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableWrapper>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard title="Total Custo Estoque" value={`R$ ${estoqueFiltrados.reduce((acc, i) => acc + (i.custoUnitario ?? i.valor * 0.6) * i.quantidade, 0).toFixed(2)}`} color="text-orange-600" bg="bg-orange-100 dark:bg-amber-900/40" icon={DollarSign} />
                            <StatCard title="Total Venda Estoque" value={`R$ ${estoqueFiltrados.reduce((acc, i) => acc + i.valor * i.quantidade, 0).toFixed(2)}`} color="text-green-600" bg="bg-green-100 dark:bg-emerald-900/40" icon={DollarSign} />
                            <StatCard title="Margem Total" value={`R$ ${estoqueFiltrados.reduce((acc, i) => acc + (i.margemValor ?? (i.valor - (i.custoUnitario ?? i.valor * 0.6))) * i.quantidade, 0).toFixed(2)}`} color="text-[#0039A6] dark:text-white" bg="bg-[#0039A6]/10 dark:bg-[#0039A6]/30" icon={TrendingUp} />
                        </div>

                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Entrada - Unidade</TableHead>
                                    <TableHead className="px-6 py-4">Tipo Estoque</TableHead>
                                    <TableHead className="px-6 py-4">Usu?rio</TableHead>
                                    <TableHead className="px-6 py-4">Data</TableHead>
                                    <TableHead className="px-6 py-4">Nota Fiscal</TableHead>
                                    <TableHead className="px-6 py-4">Fornecedor</TableHead>
                                    <TableHead className="px-6 py-4">Produto</TableHead>
                                    <TableHead className="px-6 py-4">Qtd</TableHead>
                                    <TableHead className="px-6 py-4">Custo</TableHead>
                                    <TableHead className="px-6 py-4">Venda</TableHead>
                                    <TableHead className="px-6 py-4">Margem</TableHead>
                                    <TableHead className="px-6 py-4">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_ESTOQUE_ENTRADAS_DIARIAS.map((item, i) => (
                                    <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                        <TableCell className="px-6 py-4">{item.unidade}</TableCell>
                                        <TableCell className="px-6 py-4">{item.tipoEstoque || "-"}</TableCell>
                                        <TableCell className="px-6 py-4">{item.usuario}</TableCell>
                                        <TableCell className="px-6 py-4">{item.data}</TableCell>
                                        <TableCell className="px-6 py-4">{item.notaFiscal}</TableCell>
                                        <TableCell className="px-6 py-4">{item.fornecedor}</TableCell>
                                        <TableCell className="px-6 py-4">{item.produto}</TableCell>
                                        <TableCell className="px-6 py-4">{item.quantidade}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {item.custoUnitario.toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {item.precoVenda.toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {(item.precoVenda - item.custoUnitario).toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {(item.precoVenda * item.quantidade).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableWrapper>

                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Sa?da - Unidade</TableHead>
                                    <TableHead className="px-6 py-4">Tipo Estoque</TableHead>
                                    <TableHead className="px-6 py-4">Usu?rio</TableHead>
                                    <TableHead className="px-6 py-4">Data</TableHead>
                                    <TableHead className="px-6 py-4">Cliente</TableHead>
                                    <TableHead className="px-6 py-4">Produto</TableHead>
                                    <TableHead className="px-6 py-4">Qtd</TableHead>
                                    <TableHead className="px-6 py-4">Custo</TableHead>
                                    <TableHead className="px-6 py-4">Venda</TableHead>
                                    <TableHead className="px-6 py-4">Margem</TableHead>
                                    <TableHead className="px-6 py-4">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_ESTOQUE_SAIDAS_DIARIAS.map((item, i) => (
                                    <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                        <TableCell className="px-6 py-4">{item.unidade}</TableCell>
                                        <TableCell className="px-6 py-4">{item.tipoEstoque || "-"}</TableCell>
                                        <TableCell className="px-6 py-4">{item.usuario}</TableCell>
                                        <TableCell className="px-6 py-4">{item.data}</TableCell>
                                        <TableCell className="px-6 py-4">{item.cliente}</TableCell>
                                        <TableCell className="px-6 py-4">{item.produto}</TableCell>
                                        <TableCell className="px-6 py-4">{item.quantidade}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {item.custoUnitario.toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {item.precoVenda.toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {(item.precoVenda - item.custoUnitario).toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4">R$ {(item.precoVenda * item.quantidade).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableWrapper>
                    </div>
                )}

                {activeReport === 'repasse' && (
                    <div className="space-y-6">
                        <StatCard title="Total Repasse" value={`R$ ${totalRecebidoRepasse.toFixed(2)}`} color="text-[#0039A6] dark:text-white" bg="bg-[#0039A6]/10 dark:bg-[#0039A6]/30" icon={UserCheck} />
                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Data</TableHead>
                                    <TableHead className="px-6 py-4">Profissional</TableHead>
                                    <TableHead className="px-6 py-4">Procedimento</TableHead>
                                    <TableHead className="px-6 py-4">Paciente</TableHead>
                                    <TableHead className="px-6 py-4">Repasse</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {repasseFiltrados.map((item, i) => (
                                    <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                        <TableCell className="px-6 py-4">{item.data}</TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.profissional}</TableCell>
                                        <TableCell className="px-6 py-4">{item.procedimento}</TableCell>
                                        <TableCell className="px-6 py-4">{item.cliente}</TableCell>
                                        <TableCell className="px-6 py-4 font-bold text-blue-600">R$ {item.repasse.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableWrapper>
                    </div>
                )}

                {activeReport === 'nfs' && (
                    <TableWrapper>
                        <TableHeader>
                            <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                <TableHead className="px-6 py-4">Número</TableHead>
                                <TableHead className="px-6 py-4">Data</TableHead>
                                <TableHead className="px-6 py-4">Cliente</TableHead>
                                <TableHead className="px-6 py-4">Valor</TableHead>
                                <TableHead className="px-6 py-4">Imposto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nfsFiltrados.map((item, i) => (
                                <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                    <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.numero}</TableCell>
                                    <TableCell className="px-6 py-4">{item.data}</TableCell>
                                    <TableCell className="px-6 py-4">{item.cliente}</TableCell>
                                    <TableCell className="px-6 py-4">R$ {item.valor.toFixed(2)}</TableCell>
                                    <TableCell className="px-6 py-4 text-red-500">R$ {item.imposto.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableWrapper>
                )}

                {activeReport === 'nfe' && (
                    <TableWrapper>
                        <TableHeader>
                            <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                <TableHead className="px-6 py-4">Chave de Acesso</TableHead>
                                <TableHead className="px-6 py-4">Data</TableHead>
                                <TableHead className="px-6 py-4">Cliente</TableHead>
                                <TableHead className="px-6 py-4">Produto</TableHead>
                                <TableHead className="px-6 py-4">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nfeFiltrados.map((item, i) => (
                                <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                    <TableCell className="px-6 py-4 font-mono text-xs">{item.chave}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">{item.data}</TableCell>
                                    <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.cliente}</TableCell>
                                    <TableCell className="px-6 py-4">{item.produto}</TableCell>
                                    <TableCell className="px-6 py-4 font-bold">R$ {item.valor.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableWrapper>
                )}

                {activeReport === 'financeiro' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StatCard title="Receitas no Período" value={`R$ ${totalReceitas.toFixed(2)}`} color="text-green-600" bg="bg-green-100 dark:bg-emerald-900/40" icon={DollarSign} />
                            <StatCard title="Total Movimentado" value={`R$ ${financeiroFiltrado.reduce((acc, i) => acc + Math.abs(i.valor), 0).toFixed(2)}`} color="text-[#0039A6] dark:text-white" bg="bg-[#0039A6]/10 dark:bg-[#0039A6]/30" icon={CreditCard} />
                        </div>
                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Data</TableHead>
                                    <TableHead className="px-6 py-4">Descrição</TableHead>
                                    <TableHead className="px-6 py-4">Categoria</TableHead>
                                    <TableHead className="px-6 py-4">Tipo</TableHead>
                                    <TableHead className="px-6 py-4 text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {financeiroFiltrado.map((item, i) => (
                                    <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                        <TableCell className="px-6 py-4 whitespace-nowrap">{item.data}</TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.descricao}</TableCell>
                                        <TableCell className="px-6 py-4">{item.categoria}</TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge variant="outline" className={cn("font-normal", item.tipo === 'Receita' ? "border-green-500 text-green-600" : "border-red-500 text-red-600")}>
                                                {item.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={cn("px-6 py-4 text-right font-bold", item.valor > 0 ? "text-green-600" : "text-red-600")}>
                                            R$ {Math.abs(item.valor).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableWrapper>
                    </div>
                )}

                {activeReport === 'comissoes' && (
                    <TableWrapper>
                        <TableHeader>
                            <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                <TableHead className="px-6 py-4">Data</TableHead>
                                <TableHead className="px-6 py-4">Vendedor</TableHead>
                                <TableHead className="px-6 py-4">Cliente</TableHead>
                                <TableHead className="px-6 py-4">Venda</TableHead>
                                <TableHead className="px-6 py-4">Comissão</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comissoesFiltrados.map((item, i) => (
                                <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                    <TableCell className="px-6 py-4">{item.data}</TableCell>
                                    <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.vendedor}</TableCell>
                                    <TableCell className="px-6 py-4">{item.cliente}</TableCell>
                                    <TableCell className="px-6 py-4">R$ {item.valorVenda.toFixed(2)}</TableCell>
                                    <TableCell className="px-6 py-4 font-bold text-green-600">R$ {item.valorComissao.toFixed(2)} ({item.percentual}%)</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableWrapper>
                )}

                {activeReport === 'justificativas' && (
                    <TableWrapper>
                        <TableHeader>
                            <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                <TableHead className="px-6 py-4">Data/Hora</TableHead>
                                <TableHead className="px-6 py-4">Cliente</TableHead>
                                <TableHead className="px-6 py-4">Motivo</TableHead>
                                <TableHead className="px-6 py-4">Justificativa</TableHead>
                                <TableHead className="px-6 py-4">Responsável</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {justificativasFiltrados.map((item, i) => (
                                <TableRow key={i} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                    <TableCell className="px-6 py-4 whitespace-nowrap">{item.data} {item.horario}</TableCell>
                                    <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.cliente}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge variant="outline" className="border-orange-500 text-orange-600 font-normal">{item.motivo}</Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 max-w-xs truncate" title={item.justificativa}>{item.justificativa}</TableCell>
                                    <TableCell className="px-6 py-4">{item.responsavel}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableWrapper>
                )}

                {activeReport === 'aniversariantes' && (
                    <TableWrapper>
                        <TableHeader>
                            <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                <TableHead className="px-6 py-4">Cliente</TableHead>
                                <TableHead className="px-6 py-4">Data de Nascimento</TableHead>
                                <TableHead className="px-6 py-4">Idade</TableHead>
                                <TableHead className="px-6 py-4">Telefone</TableHead>
                                <TableHead className="px-6 py-4 text-center">OK mensagem enviada</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {aniversariantesFiltrados.map((item) => (
                                <TableRow key={item.id} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                    <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.nome}</TableCell>
                                    <TableCell className="px-6 py-4">{item.dataNascimento.split('-').reverse().join('/')}</TableCell>
                                    <TableCell className="px-6 py-4">{item.idade}</TableCell>
                                    <TableCell className="px-6 py-4">{item.telefone}</TableCell>
                                    <TableCell className="px-6 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={!!aniversarioChecks[item.id]}
                                            onChange={() => toggleAniversarioCheck(item.id)}
                                            className="h-4 w-4 accent-[#0039A6]"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {aniversariantesFiltrados.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-6 py-6 text-center text-app-text-muted">
                                        Nenhum aniversariante encontrado para o período.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </TableWrapper>
                )}
                {activeReport === 'retornos' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard title="Total Retornos" value={retornoTotals.total.toString()} color="text-[#0039A6] dark:text-white" bg="bg-[#0039A6]/10 dark:bg-[#0039A6]/30" icon={RotateCcw} />
                            <StatCard title="No Prazo" value={retornoTotals.noPrazo.toString()} color="text-green-600" bg="bg-green-100 dark:bg-emerald-900/40" icon={CheckCircle} />
                            <StatCard title="Limite Prazo" value={retornoTotals.limitePrazo.toString()} color="text-amber-600" bg="bg-amber-100 dark:bg-amber-900/40" icon={AlertCircle} />
                            <StatCard title="Prazo Vencido" value={retornoTotals.prazoVencido.toString()} color="text-red-600" bg="bg-red-100 dark:bg-red-900/40" icon={AlertCircle} />
                        </div>
                        <TableWrapper>
                            <TableHeader>
                                <TableRow className="border-b border-[#dee2e6] dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4">Cliente</TableHead>
                                    <TableHead className="px-6 py-4">Últimos 3 Procedimentos</TableHead>
                                    <TableHead className="px-6 py-4">Profissional</TableHead>
                                    <TableHead className="px-6 py-4">Especialidade</TableHead>
                                    <TableHead className="px-6 py-4">Data Prevista</TableHead>
                                    <TableHead className="px-6 py-4">Situação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRetornos.length > 0 ? filteredRetornos.map((item) => {
                                    const status = getRetornoStatus(item.proximoRetorno);
                                    const statusColor = status === 'No Prazo'
                                        ? 'bg-green-100 text-green-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                        : status === 'Limite Prazo'
                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
                                    const dataFormatada = item.proximoRetorno.includes('/')
                                        ? item.proximoRetorno
                                        : item.proximoRetorno.split('-').reverse().join('/');
                                    return (
                                        <TableRow key={item.id} className="border-b border-[#dee2e6] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                            <TableCell className="px-6 py-4 font-medium text-[#101828] dark:text-white">{item.cliente}</TableCell>
                                            <TableCell className="px-6 py-4 text-sm text-app-text-muted">{item.procedimentosRecentes.join(' · ')}</TableCell>
                                            <TableCell className="px-6 py-4">{item.profissional}</TableCell>
                                            <TableCell className="px-6 py-4">{item.especialidade}</TableCell>
                                            <TableCell className="px-6 py-4">{dataFormatada}</TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge className={`${statusColor} border-none font-normal text-xs px-2 py-1 rounded-md`}>{status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="px-6 py-6 text-center text-app-text-muted">
                                            Nenhum retorno encontrado para os filtros selecionados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </TableWrapper>
                    </div>
                )}

            </div>
        </div>
    );
}

// Subcomponentes para Limpeza do Código

function InputField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
    return (
        <div>
            <label className="block text-sm mb-2 text-[#6c757d] dark:text-white/80">{label}</label>
            <Input
                type={type}
                hideDateIcon={type === 'date'}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                className="w-full h-11 px-4 bg-app-card dark:bg-[#0c1e3d] border border-[#dee2e6] dark:border-app-border-dark rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#0039A6]/10 outline-none"
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
    return (
        <div>
            <label className="block text-sm mb-2 text-[#6c757d] dark:text-white/80">{label}</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-11 bg-app-card dark:bg-[#0c1e3d] border-[#dee2e6] dark:border-app-border-dark rounded-lg text-sm">
                    <SelectValue preferPlaceholder placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1a2e23] dark:border-app-border-dark">
                    {options.map(([v, l]) => (
                        <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function StatCard({ title, value, color, bg, icon: Icon }: { title: string; value: string; color: string; bg: string; icon: React.ElementType }) {
    return (
        <Card className="p-6 bg-app-card dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark shadow-sm rounded-xl transition-all hover:border-[#0039A6]/20">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-normal text-app-text-muted dark:text-app-text-muted uppercase tracking-widest">{title}</p>
                    <p className={cn("text-2xl font-normal tracking-tight", color)}>{value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm", bg)}>
                    <Icon className={cn("h-6 w-6", color)} />
                </div>
            </div>
        </Card>
    );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Card className="overflow-hidden bg-app-card dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark shadow-premium rounded-xl">
            <div className="overflow-x-auto custom-scrollbar">
                <Table>
                    {children}
                </Table>
            </div>
        </Card>
    );
}
