export interface CnpjLookupResult {
  razaoSocial: string
  nomeFantasia?: string
  cnpj: string
  email?: string
  telefone?: string
  endereco?: {
    cep?: string
    logradouro?: string
    numero?: string
    bairro?: string
    cidade?: string
    uf?: string
  }
}

const sanitizeCnpj = (value: string) => value.replace(/\D/g, '')

export const buscarCnpj = async (cnpjInput: string): Promise<CnpjLookupResult> => {
  const cnpj = sanitizeCnpj(cnpjInput)
  if (cnpj.length !== 14) throw new Error('CNPJ inválido')

  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
  if (!response.ok) throw new Error('Não foi possível consultar CNPJ no momento')

  const data = await response.json() as {
    razao_social?: string
    nome_fantasia?: string
    cnpj?: string
    email?: string
    ddd_telefone_1?: string
    cep?: string
    logradouro?: string
    numero?: string
    bairro?: string
    municipio?: string
    uf?: string
  }

  return {
    razaoSocial: data.razao_social || '',
    nomeFantasia: data.nome_fantasia || '',
    cnpj: data.cnpj || cnpj,
    email: data.email || '',
    telefone: data.ddd_telefone_1 || '',
    endereco: {
      cep: data.cep || '',
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      bairro: data.bairro || '',
      cidade: data.municipio || '',
      uf: data.uf || '',
    },
  }
}
