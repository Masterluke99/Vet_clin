export interface Animal {
  id: string;
  nome: string;
  especie?: string;
  raca?: string;
  tutor?: string;
  tutorId?: string;
  criadoEm?: Date;
}

export interface Tutor {
  id: string;
  nome: string;
  // Outros campos do tutor podem ser adicionados aqui
}

export interface AnimalFormData {
  nome: string;
  especie: string;
  raca: string;
  tutorId: string;
}
