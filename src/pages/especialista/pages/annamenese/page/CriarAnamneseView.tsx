import { useState, useEffect } from 'react'
import { PageHeader } from '../../../ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { ChevronLeft, FileText, Save, X, Home } from 'lucide-react'

interface CriarAnamneseViewProps {
    onPageChange: (page: string) => void
}

export const CriarAnamneseView = ({ onPageChange }: CriarAnamneseViewProps) => {
    const [anamneseType, setAnamneseType] = useState<'consulta' | 'reconsulta'>('consulta')
    const [paciente, setPaciente] = useState('')
    const [peso, setPeso] = useState('')
    const [altura, setAltura] = useState('')
    const [imc, setImc] = useState<string>('-')
    const [queixa, setQueixa] = useState('')
    const [diagnostico, setDiagnostico] = useState('')

    // Auto-calculate IMC
    useEffect(() => {
        const pesoNum = parseFloat(peso.replace(',', '.'))
        const alturaNum = parseFloat(altura.replace(',', '.'))

        if (pesoNum > 0 && alturaNum > 0) {
            // Formula: weight / height(m)^2
            // If height is in cm, divide by 100
            const heightInMeters = alturaNum > 3 ? alturaNum / 100 : alturaNum // Handle both cm and m input gracefully
            const calculatedImc = (pesoNum / (heightInMeters * heightInMeters)).toFixed(1)
            setImc(calculatedImc)
        } else {
            setImc('-')
        }
    }, [peso, altura])

    const handleSave = () => {
        // Handle save logic
        console.log({ anamneseType, paciente, peso, altura, imc, queixa, diagnostico })
        onPageChange('anamnese')
    }

    const breadcrumbs = [
        { label: 'Anamnese', onClick: () => onPageChange('anamnese') },
        { label: 'Nova anamnese', isCurrent: true }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <PageHeader
                title="Nova anamnese"
                subtitle="Inicie um novo registro de avaliação para o paciente"
                breadcrumbs={breadcrumbs}
                onPageChange={onPageChange}
                backAction={{
                    label: "Voltar para lista",
                    onClick: () => onPageChange('anamnese')
                }}
            />

            {/* Main Form Content */}
            <div className="bg-white dark:bg-app-card-dark rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8 space-y-10">
                    {/* Section Title */}
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-gray-900 dark:text-white" />
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                            Nova anamnese
                        </h2>
                    </div>

                    {/* Form Layout */}
                    <div className="space-y-8">
                        {/* Type Selection */}
                        <div className="space-y-4">
                            <Label className="text-[15px] font-normal text-gray-900 dark:text-white">
                                Tipo de anamnese <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setAnamneseType('consulta')}
                                    className={`relative flex items-center p-6 rounded-[16px] border-2 transition-all text-left ${anamneseType === 'consulta'
                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                                        : 'border-gray-100 dark:border-gray-800 hover:border-app-border dark:hover:border-gray-700'
                                        }`}
                                >
                                    <div className={`h-6 w-6 rounded-full border-2 mr-4 flex items-center justify-center ${anamneseType === 'consulta' ? 'border-blue-500' : 'border-app-border dark:border-gray-600'
                                        }`}>
                                        {anamneseType === 'consulta' && <div className="h-3 w-3 rounded-full bg-blue-500" />}
                                    </div>
                                    <div>
                                        <h3 className="font-normal text-gray-900 dark:text-white">Consulta</h3>
                                        <p className="text-sm text-app-text-muted dark:text-app-text-muted">Primeira vez / Avaliação inicial completa</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setAnamneseType('reconsulta')}
                                    className={`relative flex items-center p-6 rounded-[16px] border-2 transition-all text-left ${anamneseType === 'reconsulta'
                                        ? 'border-[#0039A6] bg-[#0039A6]/5 dark:bg-[#0039A6]/10'
                                        : 'border-gray-100 dark:border-gray-800 hover:border-app-border dark:hover:border-gray-700'
                                        }`}
                                >
                                    <div className={`h-6 w-6 rounded-full border-2 mr-4 flex items-center justify-center ${anamneseType === 'reconsulta' ? 'border-[#0039A6]' : 'border-app-border dark:border-gray-600'
                                        }`}>
                                        {anamneseType === 'reconsulta' && <div className="h-3 w-3 rounded-full bg-[#0039A6]" />}
                                    </div>
                                    <div>
                                        <h3 className="font-normal text-gray-900 dark:text-white">Reconsulta</h3>
                                        <p className="text-sm text-app-text-muted dark:text-app-text-muted">Retorno / Avaliação de evolução</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Patient Selection */}
                        <div className="space-y-3">
                            <Label className="text-[15px] font-normal text-gray-900 dark:text-white">
                                Paciente <span className="text-red-500">*</span>
                            </Label>
                            <Select onValueChange={setPaciente}>
                                <SelectTrigger className="h-12 rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/30 dark:bg-app-table-header-dark px-4 focus:ring-[#0039A6]">
                                    <SelectValue preferPlaceholder placeholder="Selecione o paciente" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[14px]">
                                    <SelectItem value="maria">Maria Silva</SelectItem>
                                    <SelectItem value="joao">João Santos</SelectItem>
                                    <SelectItem value="ana">Ana Costa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Measures Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[15px] font-normal text-gray-900 dark:text-white">
                                    Peso (kg) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="Ex: 68.5"
                                    value={peso}
                                    onChange={(e) => setPeso(e.target.value)}
                                    className="h-12 rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/30 dark:bg-app-table-header-dark px-4 focus-visible:ring-[#0039A6]"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[15px] font-normal text-gray-900 dark:text-white">
                                    Altura (cm) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="Ex: 165"
                                    value={altura}
                                    onChange={(e) => setAltura(e.target.value)}
                                    className="h-12 rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/30 dark:bg-app-table-header-dark px-4 focus-visible:ring-[#0039A6]"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[15px] font-normal text-gray-900 dark:text-white">
                                    Imc (calculado)
                                </Label>
                                <Input
                                    readOnly
                                    value={imc}
                                    className="h-12 rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/10 dark:bg-app-table-header-dark px-4 font-normal text-gray-900 dark:text-white focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        {/* Informational Message */}
                        <div className="p-4 rounded-[12px] bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500 flex items-center gap-3">
                            <h4 className="font-normal text-blue-800 dark:text-blue-300">
                                {anamneseType === 'consulta' ? 'Consulta (Primeira Vez)' : 'Reconsulta (Retorno)'}
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                - Preencha a queixa principal e diagnóstico
                            </p>
                        </div>

                        {/* Text Areas */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[15px] font-normal text-gray-900 dark:text-white">
                                    Queixa principal <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    placeholder="Descreva a queixa principal do paciente..."
                                    value={queixa}
                                    onChange={(e) => setQueixa(e.target.value)}
                                    className="min-h-[120px] rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/30 dark:bg-app-table-header-dark p-4 focus:ring-[#0039A6] resize-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[15px] font-normal text-gray-900 dark:text-white">
                                    Diagnose <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    placeholder="Registre o diagnóstico do especialista..."
                                    value={diagnostico}
                                    onChange={(e) => setDiagnostico(e.target.value)}
                                    className="min-h-[120px] rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/30 dark:bg-app-table-header-dark p-4 focus:ring-[#0039A6] resize-none"
                                />
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="pt-10 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                            <Button
                                variant="outline"
                                onClick={() => onPageChange('anamnese')}
                                className="h-12 px-8 rounded-[12px] border-app-border dark:border-gray-800 text-gray-700 dark:text-white/80 font-normal transition-all hover:bg-app-bg-secondary dark:hover:bg-white/5"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!paciente || !peso || !altura || !queixa || !diagnostico}
                                className="h-12 px-10 rounded-[12px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal transition-all shadow-lg shadow-[#0039A6]/20 flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                Salvar anamnese
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

