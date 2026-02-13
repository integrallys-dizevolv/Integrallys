export interface Produto {
    id: number
    nome: string
    categoria: string
    aguaBoa: number
    querencia: number
    total: number
}

export interface ItemPrescrito extends Produto {
    quantidade: number
    posologia: string
}

export interface AnamneseData {
    peso: string
    altura: string
    queixa: string
    diagnostico: string
    avaliacaoCliente: string
    resultados: string
    indicacaoTratamento: string
    historicos: Set<string>
    medicamentos: Set<string>
    condicoes: Record<string, string>
    cid?: string // Added for CID-11
}

export interface DocumentState {
    selected: boolean
    dias?: string
    motivo?: string
    detalhes?: string
    especialidade?: string
    texto?: string
}

export interface DocumentosData {
    atestado: DocumentState
    dieta: DocumentState
    encaminhamento: DocumentState
    laudo: DocumentState
    declaracao: DocumentState
    fototerapia: DocumentState
    biomodulacao: DocumentState
}

export type AtendimentoStatus = 'draft' | 'finalized' | 'read-only'
