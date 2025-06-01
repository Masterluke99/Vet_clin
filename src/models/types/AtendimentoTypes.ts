import { Servico } from './ServicoTypes';
import { Animal } from './AnimalTypes';
import { Tutor } from './TutorTypes';
import { Funcionario } from './FuncionarioTypes';

export interface Atendimento {
  id: string;
  animalId: string;
  animal?: Animal;
  tutorId: string;
  tutor?: Tutor;
  servicoId: string;
  servico?: Servico;
  servicosIds: string[];
  servicos: Servico[];
  funcionarioId?: string;
  funcionario?: Funcionario;
  data: Date;
  hora: string;
  status: 'agendado' | 'concluido' | 'cancelado' | 'em_andamento';
  observacoes?: string;
  valorTotal: number;
  formaPagamento?: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'transferencia';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AtendimentoFormValues {
  animalId: string;
  tutorId: string;
  servicoId: string;
  servicosIds: string[];
  funcionarioId?: string;
  data: Date | string;
  hora: string;
  observacoes?: string;
  valorTotal: number;
  status: 'agendado' | 'concluido' | 'cancelado' | 'em_andamento';
  formaPagamento?: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'transferencia';
}
