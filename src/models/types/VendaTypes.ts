import { Produto } from './ProdutoTypes';
import { Tutor } from './TutorTypes';
import { Funcionario } from './FuncionarioTypes';

export interface ItemVenda {
  id: string;
  produtoId: string;
  produto?: Produto;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  itens: ItemVenda[];
  tutorId?: string;
  tutor?: Tutor;
  funcionarioId?: string;
  funcionario?: Funcionario;
  data: Date;
  valorTotal: number;
  desconto?: number;
  valorFinal: number;
  formaPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'transferencia';
  status: 'concluida' | 'cancelada' | 'pendente';
  observacoes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VendaFormValues {
  itens: {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
  }[];
  tutorId?: string;
  funcionarioId?: string;
  data: Date | string;
  desconto?: number;
  formaPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'transferencia';
  status: 'concluida' | 'cancelada' | 'pendente';
  observacoes?: string;
}
