import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, ChevronLeft, AlertCircle, Tag } from 'lucide-react'
import { LabelEditorModal } from '../../../../recepcao/pages/prescricoes/modals/LabelEditorModal'
import type { LabelData } from '../../../../recepcao/pages/prescricoes/modals/LabelEditorModal'
import { useAtendimento } from '../../../context/AtendimentoContext'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'

interface ConclusaoSectionProps {
    onBack: () => void
    onFinalize: () => void
}

export const ConclusaoSection = ({ onBack, onFinalize }: ConclusaoSectionProps) => {
    const { patientName, anamneseData, prescritos, isSigned } = useAtendimento()
    const [obsFinais, setObsFinais] = useState('')
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
    const [labelsToPrint, setLabelsToPrint] = useState<LabelData[]>([])

    const handlePrintLabels = () => {
        const labels = prescritos.map(item => ({
            patientName: patientName || 'Paciente',
            productName: item.nome,
            composition: item.categoria,
            usage: item.posologia || 'Conforme orientação médica',
            validity: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString('pt-BR')
        }))
        setLabelsToPrint(labels)
        setIsLabelModalOpen(true)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-xl font-normal text-gray-900 dark:text-white">Conclusão do Atendimento</h2>
                <p className="text-app-text-muted dark:text-app-text-muted">Revise e finalize o atendimento</p>
            </div>

            {/* Resume Card */}
            <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 p-6 rounded-[14px]">
                <div className="flex items-center gap-2 mb-4">
                    <Check className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                    <h3 className="font-normal text-gray-900 dark:text-white">Resumo do Atendimento</h3>
                </div>
                <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                        <p className="text-gray-700 dark:text-white/80">
                            <span className="font-normal text-gray-900 dark:text-white">Paciente:</span> {patientName || 'João Santos'}
                        </p>
                        <p className="text-gray-700 dark:text-white/80">
                            <span className="font-normal text-gray-900 dark:text-white">Queixa Principal:</span> {anamneseData?.queixa || 'Não informada'}
                        </p>
                        <div className="flex items-center gap-4">
                            <p className="text-gray-700 dark:text-white/80">
                                <span className="font-normal text-gray-900 dark:text-white">Medicamentos Prescritos:</span> {prescritos.length} itens
                            </p>
                            {prescritos.length > 0 && (
                                <Button
                                    size="sm"
                                    onClick={handlePrintLabels}
                                    className="bg-[#0039A6] hover:bg-[#1d3b2e] border border-[#2d5a46] text-white h-8 px-3 rounded-[8px] font-normal flex items-center gap-2 text-xs"
                                >
                                    <Tag className="h-3 w-3" />
                                    Imprimir Todos os Rótulos
                                </Button>
                            )}
                        </div>
                        <p className="text-gray-700 dark:text-white/80">
                            <span className="font-normal text-gray-900 dark:text-white">Documentos Gerados:</span> {prescritos.length > 0 ? prescritos.length : 'Nenhum'}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="font-normal text-gray-900 dark:text-white">Assinatura digital:</span>
                            {isSigned ? (
                                <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none font-normal px-3 py-1 rounded-full text-[10px] shadow-sm">
                                    Assinado eletronicamente
                                </Badge>
                            ) : (
                                <Badge className="bg-orange-600 dark:bg-amber-900/40 dark:text-amber-100 text-white border-none font-normal px-3 py-1 rounded-full text-[10px] shadow-sm">
                                    Pendente
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RN-009 Warning */}
            <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 p-6 rounded-[14px] flex gap-4">
                <AlertCircle className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="font-normal text-orange-800 dark:text-orange-200">Atenção - Regra RN-009</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed font-normal">
                        Após finalizar o atendimento, as evoluções não poderão ser editadas. Você poderá apenas adicionar notas complementares ou erratas para manter a integridade do histórico legal do paciente.
                    </p>
                </div>
            </div>

            {/* Final Observations */}
            <div className="space-y-2">
                <Label className="font-normal text-gray-900 dark:text-white">Observações Finais (Opcional)</Label>
                <Textarea
                    placeholder="Adicione observações finais sobre o atendimento..."
                    value={obsFinais}
                    onChange={(e) => setObsFinais(e.target.value)}
                    className="min-h-[100px] p-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none transition-colors focus:bg-white dark:focus:bg-app-card-dark"
                />
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-12 px-6 rounded-[10px] border-app-border dark:border-app-border-dark text-gray-900 dark:text-white font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Voltar: Documentos
                </Button>
                <Button
                    onClick={onFinalize}
                    className="h-12 px-8 bg-[#0039A6] hover:bg-[#1d3b2e] border border-[#2d5a46] text-white rounded-[10px] font-normal flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                    <Check className="h-4 w-4" /> Finalizar Atendimento
                </Button>
            </div>

            <LabelEditorModal
                isOpen={isLabelModalOpen}
                onClose={() => setIsLabelModalOpen(false)}
                dataList={labelsToPrint}
            />
        </div>
    )
}
