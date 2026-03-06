import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck, ChevronLeft, ChevronRight, FileText, Check, Eye } from 'lucide-react'
import { useAtendimento } from '../../../context/AtendimentoContext'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { SignaturePad } from '../../../components/SignaturePad'
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal'
import { Dialog, DialogContent } from '@/components/ui/Dialog'

interface DocumentosSectionProps {
    onBack: () => void
    onNext: () => void
}

interface DocumentTemplate {
    id: string
    title: string
    type: 'fields' | 'editor'
    fields?: { label: string; placeholder: string }[]
    defaultValue?: string
}

const TEMPLATE_STORAGE_KEY = 'clinic_document_templates_v1'

const DOCUMENT_TYPES: DocumentTemplate[] = [
    {
        id: 'atestado',
        title: 'Atestado Medico',
        type: 'fields',
        fields: [
            { label: 'Dias de Afastamento', placeholder: 'Ex: 3' },
            { label: 'Motivo', placeholder: 'Descreva o motivo do atestado...' }
        ]
    },
    {
        id: 'dieta',
        title: 'Plano Alimentar / Dieta',
        type: 'editor',
        defaultValue: 'PLANO ALIMENTAR\n\nCafé da Manhã:\n- Opção 1: ...\n\nAlmoço:\n- ...'
    },
    {
        id: 'encaminhamento',
        title: 'Encaminhamento para Especialista',
        type: 'editor',
        defaultValue: 'ENCAMINHAMENTO MÉDICO\n\nAo Dr(a). Especialista em ...\n\nSolicito avaliação do paciente...'
    },
    {
        id: 'laudo',
        title: 'Laudo Médico',
        type: 'editor',
        defaultValue: 'LAUDO MÉDICO\n\nAtesto para os devidos fins que o paciente apresenta quadro de...'
    },
    {
        id: 'declaracao',
        title: 'Declaração de Comparecimento',
        type: 'editor',
        defaultValue: `DECLARAÇÃO DE COMPARECIMENTO

Declaro para os devidos fins que o(a) paciente [NOME DO PACIENTE], portador(a) do CPF [CPF], compareceu à consulta médica nesta data (20/01/2026) no horário de 14:00 às 15:00.

A consulta teve duração aproximada de 1 (uma) hora.

Esta declaração é válida para aprovação junto ao empregador ou instituição de ensino.

Atenciosamente,

Dr(a). [NOME DO MÉDICO]
CRM: [NÚMERO]
Data: 20/01/2026`
    },
    {
        id: 'fototerapy',
        title: 'Procedimento Fototerapia',
        type: 'editor',
        defaultValue: `RELATORIO DE PROCEDIMENTO - FOTOTERAPIA

Paciente: [NOME DO PACIENTE]
Data do Procedimento: 20/01/2026

PROCEDIMENTO REALIZADO:
Fototerapia com LED de alta potencia

AREA TRATADA:
[Descrever a area do corpo tratada]

PROTOCOLO UTILIZADO:
- Comprimento de onda: [especificar nm]
- Potencia: [especificar mW/cm2]
- Tempo de exposicao: [especificar minutos]
- Distancia do equipamento: [especificar cm]

OBJETIVO DO TRATAMENTO:`
    },
    {
        id: 'biomodular',
        title: 'Procedimento Biomodular Infra',
        type: 'editor',
        defaultValue: `RELATORIO DE PROCEDIMENTO - BIOMODULACAO INFRAVERMELHO

Paciente: [NOME DO PACIENTE]
Data do Procedimento: 20/01/2026

PROCEDIMENTO REALIZADO:
Biomodulacao com Infravermelho de Alta Intensidade

AREA TRATADA:
[Descrever a regiao anatomica tratada]

PROTOCOLO UTILIZADO:
- Comprimento de onda: [especificar nm] (infravermelho proximo)
- Potencia: [especificar W]
- Densidade de energia: [especificar J/cm2]
- Tempo de aplicacao: [especificar minutos]
- Modo de aplicacao: [continuo/pulsado]
- Numero de pontos tratados: [especificar]`
    }
]

export const DocumentosSection = ({ onBack, onNext }: DocumentosSectionProps) => {
    const { status, patientName, isSigned, setIsSigned, signature, setSignature } = useAtendimento()
    const isReadOnly = status === 'read-only' || status === 'finalized'
    const [selectedDocs, setSelectedDocs] = useState<string[]>([])
    const [docData, setDocData] = useState<Record<string, Record<string, string>>>({})
    const [showSignatureModal, setShowSignatureModal] = useState(false)
    const [previewDoc, setPreviewDoc] = useState<{ title: string, content: string } | null>(null)
    const [templates, setTemplates] = useState<Record<string, string>>({})

    useEffect(() => {
        try {
            const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY)
            if (stored) {
                setTemplates(JSON.parse(stored))
            }
        } catch {
            setTemplates({})
        }
    }, [])

    const persistTemplates = (next: Record<string, string>) => {
        setTemplates(next)
        try {
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(next))
        } catch {
            // ignore storage errors in mock
        }
    }

    const getTemplateContent = (doc: DocumentTemplate) => templates[doc.id] || doc.defaultValue || ''

    const getDocContent = (doc: DocumentTemplate) => {
        const base = docData[doc.id]?.content ?? getTemplateContent(doc)
        return base.replace('[NOME DO PACIENTE]', patientName || 'Paciente')
    }

    const toggleDoc = (doc: DocumentTemplate) => {
        if (isReadOnly) return
        setSelectedDocs(prev => {
            const next = prev.includes(doc.id) ? prev.filter(d => d !== doc.id) : [...prev, doc.id]
            return next
        })
        if (doc.type === 'editor' && !docData[doc.id]?.content) {
            setDocData(prev => ({
                ...prev,
                [doc.id]: {
                    ...prev[doc.id],
                    content: getTemplateContent(doc)
                }
            }))
        }
    }

    const updateDocData = (id: string, field: string, value: string) => {
        setDocData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }))
    }

    const handleSaveTemplate = (doc: DocumentTemplate) => {
        const content = docData[doc.id]?.content ?? doc.defaultValue ?? ''
        persistTemplates({
            ...templates,
            [doc.id]: content
        })
    }

    const handleResetTemplate = (doc: DocumentTemplate) => {
        const next = { ...templates }
        delete next[doc.id]
        persistTemplates(next)
        setDocData(prev => ({
            ...prev,
            [doc.id]: {
                ...prev[doc.id],
                content: doc.defaultValue || ''
            }
        }))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header and Bulk Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-normal text-gray-900 dark:text-white">Documentos Adicionais</h3>
                    <p className="text-app-text-muted dark:text-app-text-muted">Gere atestados, dietas, encaminhamentos, laudos, declaracoes e documentos de procedimentos</p>
                </div>
                {!isSigned && selectedDocs.length > 0 && (
                    <Button
                        onClick={() => setShowSignatureModal(true)}
                        className="h-11 px-6 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[12px] font-normal flex items-center gap-2 shadow-lg shadow-[#0039A6]/10 animate-in fade-in slide-in-from-right-4 transition-all active:scale-95"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Assinar documentos selecionados
                    </Button>
                )}
            </div>

            {/* Signature Modal */}
            <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
                <DialogContent className="sm:max-w-md p-8 bg-white dark:bg-[#0c1e3d] border-none shadow-2xl">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#0039A6]/10 dark:bg-[#0039A6]/20 flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-[#0039A6]" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-lg font-normal text-gray-900 dark:text-white">Assinatura Eletronica</h3>
                                <p className="text-xs text-app-text-muted font-normal">Sua assinatura manuscrita sera aplicada aos documentos</p>
                            </div>
                        </div>

                        <SignaturePad
                            onCancel={() => setShowSignatureModal(false)}
                            onSave={(sig: string) => {
                                setSignature(sig)
                                setIsSigned(true)
                                setShowSignatureModal(false)
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Documents List */}
            <div className="space-y-4">
                {DOCUMENT_TYPES.map((doc) => {
                    const isSelected = selectedDocs.includes(doc.id)

                    return (
                        <div
                            key={doc.id}
                            className={`bg-white dark:bg-app-card-dark border rounded-[12px] transition-all duration-200 overflow-hidden ${isSelected
                                ? 'border-app-border dark:border-gray-600 shadow-sm'
                                : 'border-app-border dark:border-gray-800'
                                }`}
                        >
                            <div
                                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                                onClick={() => toggleDoc(doc)}
                            >
                                <div
                                    className={`h-6 w-6 rounded border flex items-center justify-center transition-colors ${isSelected
                                        ? 'bg-[#0039A6] border-[#0039A6] text-white'
                                        : 'bg-white dark:bg-transparent border-app-border dark:border-gray-600'
                                        }`}
                                >
                                    {isSelected && <Check className="h-4 w-4" />}
                                </div>
                                <div className="flex items-center justify-between flex-1 pr-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-700 dark:text-white/80" />
                                        <span className={`font-normal ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-white/80'}`}>
                                            {doc.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isSelected && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation()
                                                    setPreviewDoc({
                                                        title: doc.title,
                                                        content: getDocContent(doc)
                                                    })
                                                }}
                                                className="h-8 px-3 rounded-full text-xs font-normal text-[#0039A6] hover:bg-[#0039A6]/10 flex items-center gap-2"
                                            >
                                                <Eye className="h-3.5 w-3.5" /> Visualizar
                                            </Button>
                                        )}
                                        {isSigned && isSelected && (
                                            <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none font-normal px-3 py-1 rounded-full text-[10px] animate-in fade-in zoom-in shadow-sm">
                                                Assinado digitalmente
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                        {doc.type === 'fields' && doc.fields && (
                                            <div className="space-y-4">
                                                {doc.fields.map((field, idx) => (
                                                    <div key={idx} className="space-y-2">
                                                        <Label className="font-normal text-gray-900 dark:text-white">{field.label}</Label>
                                                        <Input
                                                            placeholder={field.placeholder}
                                                            className="h-11 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal"
                                                            value={docData[doc.id]?.[field.label] || ''}
                                                            onChange={(e) => updateDocData(doc.id, field.label, e.target.value)}
                                                            disabled={isReadOnly}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {doc.type === 'editor' && (
                                            <div className="space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <Label className="font-normal text-gray-900 dark:text-white">Modelo do documento (editavel pela clinica)</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleSaveTemplate(doc)}
                                                            disabled={isReadOnly}
                                                            className="h-8 px-3 rounded-full text-xs font-normal"
                                                        >
                                                            Salvar modelo
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleResetTemplate(doc)}
                                                            disabled={isReadOnly}
                                                            className="h-8 px-3 rounded-full text-xs font-normal text-app-text-muted"
                                                        >
                                                            Restaurar padrao
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Textarea
                                                    className="min-h-[300px] p-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal font-mono text-sm leading-relaxed whitespace-pre-wrap"
                                                    value={docData[doc.id]?.content ?? getTemplateContent(doc)}
                                                    onChange={(e) => updateDocData(doc.id, 'content', e.target.value)}
                                                    disabled={isReadOnly}
                                                />
                                            </div>
                                        )}

                                        {isSigned && (
                                            <div className="mt-6 p-4 rounded-[16px] border border-[#0039A6]/20 bg-[#0039A6]/5 flex items-center justify-between animate-in fade-in">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-white dark:bg-app-table-header-dark border border-[#0039A6]/30 flex items-center justify-center">
                                                        <ShieldCheck className="h-6 w-6 text-[#0039A6]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-normal text-gray-900 dark:text-white">Documento assinado digitalmente</p>
                                                        <p className="text-[11px] text-app-text-muted dark:text-app-text-muted">Autenticacao: {Math.random().toString(16).substring(2, 12).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                                <div className="h-12 w-12 opacity-50 contrast-0 dark:invert">
                                                    <div className="grid grid-cols-2 gap-0.5">
                                                        <div className="w-2 h-2 bg-gray-600"></div>
                                                        <div className="w-2 h-2 bg-gray-600"></div>
                                                        <div className="w-2 h-2 bg-gray-600"></div>
                                                        <div className="w-2 h-2 bg-gray-600"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Electronic Signature Section (Summary) */}
            <div className="p-8 rounded-[24px] bg-white dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark/30 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-normal text-gray-900 dark:text-white">Assinatura eletronica</h3>
                        <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">Sua assinatura garante a validade juridica de todos os documentos gerados neste atendimento</p>
                    </div>
                </div>

                {!isSigned ? (
                    <div className="pt-2">
                        <p className="text-red-500 text-sm font-normal">Assinatura pendente para os documentos selecionados.</p>
                    </div>
                ) : (
                    <div className="pt-2 animate-in fade-in zoom-in duration-300">
                        <div className="bg-[#0039A6]/5 dark:bg-[#0039A6]/10 border border-[#0039A6]/10 dark:border-[#0039A6]/30 rounded-[16px] p-4 flex items-center gap-4">
                            <div className="h-16 w-32 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center p-2">
                                {signature && <img src={signature} alt="Sua Assinatura" className="h-full object-contain grayscale" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 dark:text-white text-sm font-normal">Assinatura manuscrita capturada!</p>
                                <p className="text-app-text-muted dark:text-app-text-muted text-xs font-normal">ID de Autenticacao: {Math.random().toString(16).substring(2, 10).toUpperCase()}-{new Date().getFullYear()}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsSigned(false)
                                    setSignature(null)
                                }}
                                className="text-app-text-muted hover:text-gray-900 dark:hover:text-white hover:bg-app-bg-secondary dark:hover:bg-white/5 font-normal text-xs transition-colors"
                            >
                                Alterar assinatura
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                docTitle={previewDoc?.title || ''}
                docContent={previewDoc?.content || ''}
            />

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-12 px-6 rounded-[10px] border-app-border dark:border-app-border-dark text-gray-900 dark:text-white font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Voltar: Prescrição
                </Button>
                <Button
                    onClick={onNext}
                    className="h-12 px-8 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[10px] font-normal flex items-center gap-2"
                >
                    Proximo: Conclusao <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
