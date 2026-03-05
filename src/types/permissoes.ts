export interface PerfilPermissao {
  id: number;
  nome: string;
  descricao: string;
  escopo: string;
}

export interface PerfilPermissaoModal {
  id: number;
  descricao: string;
  perfil?: string;
  nome?: string;
  escopo?: string;
  usuarios?: number;
  especialistas?: number;
}
