export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  dataContratacao?: Date;
  salario?: number;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FuncionarioFormValues {
  nome: string;
  cargo: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  dataContratacao?: Date;
  salario?: number;
  ativo?: boolean;
}
