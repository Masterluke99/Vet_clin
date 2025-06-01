export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoria?: string;
  fornecedor?: string;
  codigoBarras?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProdutoFormValues {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoria?: string;
  fornecedor?: string;
  codigoBarras?: string;
}
