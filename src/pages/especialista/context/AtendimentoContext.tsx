import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AnamneseData, DocumentosData, ItemPrescrito, AtendimentoStatus } from './types'

interface AtendimentoContextType {
    currentStep: number
    setCurrentStep: (step: number) => void
    status: AtendimentoStatus
    setStatus: (status: AtendimentoStatus) => void
    anamneseType: 'consulta' | 'reconsulta'
    setAnamneseType: (type: 'consulta' | 'reconsulta') => void
    anamneseData: AnamneseData
    setAnamneseData: React.Dispatch<React.SetStateAction<AnamneseData>>
    evolucaoAtual: string
    setEvolucaoAtual: (evolucao: string) => void
    prescritos: ItemPrescrito[]
    setPrescritos: React.Dispatch<React.SetStateAction<ItemPrescrito[]>>
    documentosData: DocumentosData
    setDocumentosData: React.Dispatch<React.SetStateAction<DocumentosData>>
    observacoesFinais: string
    setObservacoesFinais: (obs: string) => void
    observacoesGerais: string
    setObservacoesGerais: (obs: string) => void
    finalizeAtendimento: () => void
    patientName: string
    appointmentTime?: string
    isSigned: boolean
    setIsSigned: (isSigned: boolean) => void
    signature: string | null
    setSignature: (signature: string | null) => void
}

const AtendimentoContext = createContext<AtendimentoContextType | undefined>(undefined)

export const AtendimentoProvider = ({
    children,
    patientName,
    appointmentTime
}: {
    children: ReactNode,
    patientName: string,
    appointmentTime?: string
}) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [status, setStatus] = useState<AtendimentoStatus>('draft')
    const [anamneseType, setAnamneseType] = useState<'consulta' | 'reconsulta'>('consulta')

    const [anamneseData, setAnamneseData] = useState<AnamneseData>({
        peso: '',
        altura: '',
        queixa: '',
        diagnostico: '',
        avaliacaoCliente: '',
        resultados: '',
        indicacaoTratamento: '',
        historicos: new Set<string>(),
        medicamentos: new Set<string>(),
        condicoes: {}
    })

    const [evolucaoAtual, setEvolucaoAtual] = useState('')
    const [prescritos, setPrescritos] = useState<ItemPrescrito[]>([])
    const [observacoesFinais, setObservacoesFinais] = useState('')
    const [observacoesGerais, setObservacoesGerais] = useState('')
    const [isSigned, setIsSigned] = useState(false)
    const [signature, setSignature] = useState<string | null>(null)

    const [documentosData, setDocumentosData] = useState<DocumentosData>({
        atestado: { selected: false, dias: '', motivo: '' },
        dieta: { selected: false, detalhes: '' },
        encaminhamento: { selected: false, especialidade: '', motivo: '' },
        laudo: { selected: false, detalhes: '' },
        declaracao: {
            selected: false,
            texto: `Declaro para os devidos fins que o(a) Sr(a) ${patientName} compareceu a este consultório no dia ${new Date().toLocaleDateString('pt-BR')} às ${appointmentTime || '00:00'} para realização de consulta/procedimento.`
        },
        fototerapia: {
            selected: false,
            texto: `RELATÓRIO DE PROCEDIMENTO - FOTOTERAPIA\n\nPaciente: ${patientName}\nData do Procedimento: ${new Date().toLocaleDateString('pt-BR')}\n\nPROCEDIMENTO REALIZADO:\nFototerapia com LED de alta potência\n\nÁREA TRATADA:\n[Descrever a área do corpo tratada]\n\nPROTOCOLO UTILIZADO:\n- Comprimento de onda: [especificar nm]\n- Potência: [especificar mW/cm²]\n- Tempo de exposição: [especificar minutos]\n- Distância do equipamento: [especificar cm]`
        },
        biomodulacao: {
            selected: false,
            texto: `RELATÓRIO DE PROCEDIMENTO - BIOMODULAÇÃO\n\nPaciente: ${patientName}\nData do Procedimento: ${new Date().toLocaleDateString('pt-BR')}\n\nPROCEDIMENTO REALIZADO:\nBiomodulação com Infravermelho\n\nÁREA TRATADA:\n[Descrever a área do corpo tratada]\n\nPROTOCOLO UTILIZADO:\n- Equipamento: [Nome do Equipamento]\n- Frequência: [especificar Hz]\n- Tempo de aplicação: [especificar minutos]\n- Energia entregue: [especificar Joules]`
        }
    })

    const finalizeAtendimento = () => {
        setStatus('finalized')
        // Here we would trigger stock reservation and other side effects
        console.log('Atendimento Finalizado - RN-009 Active')
    }

    return (
        <AtendimentoContext.Provider value={{
            currentStep, setCurrentStep,
            status, setStatus,
            anamneseType, setAnamneseType,
            anamneseData, setAnamneseData,
            evolucaoAtual, setEvolucaoAtual,
            prescritos, setPrescritos,
            documentosData, setDocumentosData,
            observacoesFinais, setObservacoesFinais,
            observacoesGerais, setObservacoesGerais,
            finalizeAtendimento,
            patientName,
            appointmentTime,
            isSigned,
            setIsSigned,
            signature,
            setSignature
        }}>
            {children}
        </AtendimentoContext.Provider>
    )
}

export const useAtendimento = () => {
    const context = useContext(AtendimentoContext)
    if (!context) {
        throw new Error('useAtendimento must be used within an AtendimentoProvider')
    }
    return context
}
