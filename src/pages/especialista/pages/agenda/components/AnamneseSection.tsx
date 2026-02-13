import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Calendar as CalendarIcon, ChevronRight, User } from 'lucide-react'
import { useAtendimento } from '../../../context/AtendimentoContext'

interface AnamneseSectionProps {
    onCancel: () => void
    onNext: () => void
}

const HISTORICOS = [
    'Tabagismo',
    'Etilismo',
    'Dependencia, drogas, entorpecentes',
    'Pratica atividade fisica'
]

const MEDICAMENTOS = [
    'Anticoncepcional',
    'Antidepressivo',
    'Ansiolitico',
    'Sonifero',
    'Diuretico',
    'Insulina',
    'Hipertensivos',
    'Medicacao para colesterol',
    'Medicacao para triglicerideos',
    'Medicacao para tireoide'
]

export const AnamneseSection = ({ onCancel, onNext }: AnamneseSectionProps) => {
    const {
        anamneseType, setAnamneseType,
        anamneseData, setAnamneseData,
        status, patientName, appointmentTime
    } = useAtendimento()
    const isReadOnly = status === 'read-only' || status === 'finalized'

    const handleAnswerChange = (section: 'historico' | 'medicamento', item: string, value: 'sim' | 'nao') => {
        if (isReadOnly) return
        const key = `${section}:${item}`
        setAnamneseData(prev => {
            const newHistoricos = new Set(prev.historicos)
            const newMedicamentos = new Set(prev.medicamentos)
            if (section === 'historico') {
                if (value === 'sim') newHistoricos.add(item)
                else newHistoricos.delete(item)
            } else {
                if (value === 'sim') newMedicamentos.add(item)
                else newMedicamentos.delete(item)
            }
            const newCondicoes = { ...prev.condicoes }
            if (value === 'nao') {
                delete newCondicoes[key]
            }
            return {
                ...prev,
                historicos: newHistoricos,
                medicamentos: newMedicamentos,
                condicoes: newCondicoes
            }
        })
    }

    const handleObservacoesChange = (section: 'historico' | 'medicamento', item: string, value: string) => {
        if (isReadOnly) return
        const key = `${section}:${item}`
        setAnamneseData(prev => ({
            ...prev,
            condicoes: {
                ...prev.condicoes,
                [key]: value
            }
        }))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header / Identification */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-normal text-gray-900 dark:text-white">Anamnese</h2>
                    <p className="text-app-text-muted dark:text-app-text-muted">Preencha a ficha de anamnese conforme o tipo de consulta</p>
                </div>

                <div className="bg-app-bg-secondary dark:bg-app-card-dark/50 border border-gray-100 dark:border-gray-800 rounded-[12px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white dark:bg-[#0039A6] p-2 rounded-full">
                            <User className="h-5 w-5 text-app-text-muted dark:text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-app-text-muted dark:text-app-text-muted">Paciente</p>
                            <p className="font-normal text-gray-900 dark:text-white text-base">{patientName}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-app-text-muted dark:text-app-text-muted">Horario</p>
                        <p className="font-normal text-gray-900 dark:text-white text-base">{appointmentTime || '00:00'} - 1h</p>
                    </div>
                </div>
            </div>

            {/* Anamnese Type Selector */}
            <div className="space-y-2">
                <Label className="font-normal text-gray-900 dark:text-white">Tipo de Anamnese *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        onClick={() => !isReadOnly && setAnamneseType('consulta')}
                        className={`cursor-pointer p-6 rounded-[14px] border-2 transition-all flex items-center gap-4 ${anamneseType === 'consulta' ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : 'border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark'} ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${anamneseType === 'consulta' ? 'border-blue-500' : 'border-app-border'}`}>
                            {anamneseType === 'consulta' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                        </div>
                        <div>
                            <h4 className="font-normal text-gray-900 dark:text-white">Consulta</h4>
                            <p className="text-sm text-app-text-muted">Primeira vez / Avaliacao inicial completa</p>
                        </div>
                    </div>
                    <div
                        onClick={() => !isReadOnly && setAnamneseType('reconsulta')}
                        className={`cursor-pointer p-6 rounded-[14px] border-2 transition-all flex items-center gap-4 ${anamneseType === 'reconsulta' ? 'border-[#0039A6] bg-[#0039A6]/10' : 'border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark'} ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${anamneseType === 'reconsulta' ? 'border-[#0039A6]' : 'border-app-border'}`}>
                            {anamneseType === 'reconsulta' && <div className="w-3 h-3 rounded-full bg-[#0039A6]" />}
                        </div>
                        <div>
                            <h4 className="font-normal text-gray-900 dark:text-white">Reconsulta</h4>
                            <p className="text-sm text-app-text-muted">Retorno / Avaliacao de evolucao</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="font-normal text-gray-900 dark:text-white">Data *</Label>
                    <div className="relative">
                        <Input type="date" hideDateIcon
                            defaultValue={new Date().toISOString().split('T')[0]}
                            readOnly={true} // Usually fixed to today
                            className="pl-10 h-11 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal"
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="font-normal text-gray-900 dark:text-white">Peso (kg) *</Label>
                    <Input
                        placeholder="Ex: 70.5"
                        value={anamneseData.peso}
                        onChange={(e) => setAnamneseData(p => ({ ...p, peso: e.target.value }))}
                        readOnly={isReadOnly}
                        className="h-11 px-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-normal text-gray-900 dark:text-white">Altura (cm) *</Label>
                    <Input
                        placeholder="Ex: 175"
                        value={anamneseData.altura}
                        onChange={(e) => setAnamneseData(p => ({ ...p, altura: e.target.value }))}
                        readOnly={isReadOnly}
                        className="h-11 px-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal"
                    />
                </div>
            </div>

            {/* Conditional Content based on Type */}
            {anamneseType === 'consulta' ? (
                <>
                    {/* Info Banner */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-[10px]">
                        <p className="text-blue-700 dark:text-blue-300 font-normal text-sm">
                            <span className="font-normal">Consulta (Primeira Vez)</span> - Preencha todos os campos de historico do paciente
                        </p>
                    </div>

                    {/* Queixa */}
                    <div className="space-y-2">
                        <Label className="font-normal text-gray-900 dark:text-white">Queixa Principal *</Label>
                        <Textarea
                            placeholder="Descreva a queixa principal do paciente..."
                            value={anamneseData.queixa}
                            onChange={(e) => setAnamneseData(p => ({ ...p, queixa: e.target.value }))}
                            readOnly={isReadOnly}
                            className="min-h-[100px] p-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                        />
                    </div>

                    {/* Historicos Diarios */}
                    <div className="space-y-4">
                        <h3 className="font-normal text-gray-900 dark:text-white text-lg">Historicos Diarios</h3>
                        <div className="grid gap-3">
                            {HISTORICOS.map((item) => {
                                const isYes = anamneseData.historicos.has(item)
                                return (
                                    <div
                                        key={item}
                                        className="bg-white dark:bg-app-card-dark border border-app-border dark:border-gray-800 p-4 rounded-[12px] space-y-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-normal text-gray-700 dark:text-gray-200">{item}?</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAnswerChange('historico', item, 'sim')}
                                                    disabled={isReadOnly}
                                                    className={`px-3 py-1 rounded-full text-xs font-normal border transition-all ${isYes
                                                        ? 'bg-[#0039A6] border-[#0039A6] text-white'
                                                        : 'border-app-border text-app-text-secondary hover:border-[#0039A6]/40 hover:text-[#0039A6]'} ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    Sim
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAnswerChange('historico', item, 'nao')}
                                                    disabled={isReadOnly}
                                                    className={`px-3 py-1 rounded-full text-xs font-normal border transition-all ${!isYes
                                                        ? 'bg-app-bg-secondary/60 border-app-border text-app-text-secondary'
                                                        : 'border-app-border text-app-text-secondary hover:border-[#0039A6]/40 hover:text-[#0039A6]'} ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    Nao
                                                </button>
                                            </div>
                                        </div>
                                        {isYes && (
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-normal text-app-text-muted uppercase tracking-wider">
                                                    Qual?/Observacoes
                                                </Label>
                                                <Textarea
                                                    value={anamneseData.condicoes[`historico:${item}`] || ''}
                                                    onChange={(e) => handleObservacoesChange('historico', item, e.target.value)}
                                                    readOnly={isReadOnly}
                                                    className="min-h-[80px] bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                                                    placeholder="Descreva..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Uso de Medicamentos */}
                    <div className="space-y-4 p-4 bg-blue-50/30 dark:bg-blue-900/5 rounded-[16px]">
                        <h3 className="font-normal text-gray-900 dark:text-white text-lg">Uso de Medicamentos</h3>
                        <div className="grid gap-3">
                            {MEDICAMENTOS.map((item) => {
                                const isYes = anamneseData.medicamentos.has(item)
                                return (
                                    <div
                                        key={item}
                                        className="bg-white dark:bg-app-card-dark border border-app-border dark:border-gray-800 p-4 rounded-[12px] space-y-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-normal text-gray-700 dark:text-gray-200">{item}?</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAnswerChange('medicamento', item, 'sim')}
                                                    disabled={isReadOnly}
                                                    className={`px-3 py-1 rounded-full text-xs font-normal border transition-all ${isYes
                                                        ? 'bg-[#0039A6] border-[#0039A6] text-white'
                                                        : 'border-app-border text-app-text-secondary hover:border-[#0039A6]/40 hover:text-[#0039A6]'} ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    Sim
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAnswerChange('medicamento', item, 'nao')}
                                                    disabled={isReadOnly}
                                                    className={`px-3 py-1 rounded-full text-xs font-normal border transition-all ${!isYes
                                                        ? 'bg-app-bg-secondary/60 border-app-border text-app-text-secondary'
                                                        : 'border-app-border text-app-text-secondary hover:border-[#0039A6]/40 hover:text-[#0039A6]'} ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    Nao
                                                </button>
                                            </div>
                                        </div>
                                        {isYes && (
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-normal text-app-text-muted uppercase tracking-wider">
                                                    Qual?/Observacoes
                                                </Label>
                                                <Textarea
                                                    value={anamneseData.condicoes[`medicamento:${item}`] || ''}
                                                    onChange={(e) => handleObservacoesChange('medicamento', item, e.target.value)}
                                                    readOnly={isReadOnly}
                                                    className="min-h-[80px] bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                                                    placeholder="Descreva..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Diagnose */}
                    <div className="space-y-2">
                        <Label className="font-normal text-gray-900 dark:text-white">Diagnose *</Label>
                        <Textarea
                            placeholder="Registre o diagnostico do especialista..."
                            value={anamneseData.diagnostico}
                            onChange={(e) => setAnamneseData(p => ({ ...p, diagnostico: e.target.value }))}
                            readOnly={isReadOnly}
                            className="min-h-[80px] bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* Info Banner for Reconsulta */}
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-[10px]">
                        <p className="text-green-700 dark:text-green-300 font-normal text-sm">
                            <span className="font-normal">Reconsulta (Retorno)</span> - Avalie a evolucao do tratamento do paciente
                        </p>
                    </div>

                    {/* Reconsulta specific fields */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="font-normal text-gray-900 dark:text-white">Avaliacao do Cliente *</Label>
                            <Textarea
                                placeholder="Registre a percepcao do especialista sobre o estado atual do paciente..."
                                value={anamneseData.avaliacaoCliente}
                                onChange={(e) => setAnamneseData(p => ({ ...p, avaliacaoCliente: e.target.value }))}
                                readOnly={isReadOnly}
                                className="min-h-[80px] p-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-normal text-gray-900 dark:text-white">Resultados *</Label>
                            <Textarea
                                placeholder="Detalhe os resultados obtidos ate o momento..."
                                value={anamneseData.resultados}
                                onChange={(e) => setAnamneseData(p => ({ ...p, resultados: e.target.value }))}
                                readOnly={isReadOnly}
                                className="min-h-[80px] p-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-normal text-gray-900 dark:text-white">Indicacao para os Proximos Tratamentos *</Label>
                            <Textarea
                                placeholder="Planejamento dos proximos passos ou encaminhamentos..."
                                value={anamneseData.indicacaoTratamento}
                                onChange={(e) => setAnamneseData(p => ({ ...p, indicacaoTratamento: e.target.value }))}
                                readOnly={isReadOnly}
                                className="min-h-[80px] bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="h-12 px-6 rounded-[10px] border-app-border dark:border-app-border-dark text-gray-600 dark:text-white/80 font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5"
                >
                    Cancelar Atendimento
                </Button>
                <Button
                    onClick={onNext}
                    className="h-12 px-8 bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px] font-normal flex items-center gap-2"
                >
                    Proximo: Prontuario <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
