import { Atendimento } from './AtendimentoTypes';

export interface AtendimentoRelatorio extends Atendimento {
  animalNome?: string;
  servicosNomes?: string[];
  funcionarioNome?: string;
}

export interface FiltrosRelatorio {
  dataInicio?: string;
  dataFim?: string;
  animalId?: string;
  servicoId?: string;
  funcionarioId?: string;
  status?: string;
}
