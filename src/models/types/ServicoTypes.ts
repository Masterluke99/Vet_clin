export interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao?: number; // duração em minutos
  categoria?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServicoFormValues {
  nome: string;
  descricao?: string;
  preco: number;
  duracao?: number;
  categoria?: string;
}
