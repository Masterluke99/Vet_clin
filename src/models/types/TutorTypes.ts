export interface Tutor {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  animais?: string[]; // IDs dos animais associados a este tutor
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TutorFormValues {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
}
