import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Atendimento } from '../types/AtendimentoTypes';
import { Animal } from '../types/AnimalTypes';
import { Servico } from '../types/ServicoTypes';
import { Funcionario } from '../types/FuncionarioTypes';
import { AtendimentoRelatorio, FiltrosRelatorio } from '../types/RelatorioTypes';

export class RelatorioService {
  static async getAtendimentos(filtros: FiltrosRelatorio): Promise<AtendimentoRelatorio[]> {
    try {
      let q = query(collection(db, "atendimentos"));
      
      // Aplicar filtros
      if (filtros.dataInicio && filtros.dataFim) {
        const dataInicio = new Date(filtros.dataInicio);
        const dataFim = new Date(filtros.dataFim);
        dataFim.setHours(23, 59, 59, 999); // Fim do dia
        
        q = query(q, 
          where('data', '>=', dataInicio), 
          where('data', '<=', dataFim)
        );
      }
      
      if (filtros.animalId) {
        q = query(q, where('animal_id', '==', filtros.animalId));
      }
      
      // Buscar atendimentos
      const atendimentosSnapshot = await getDocs(q);
      const atendimentos: AtendimentoRelatorio[] = [];
      
      // Buscar todos os animais, serviços e funcionários para enriquecer os dados
      const animaisSnapshot = await getDocs(collection(db, "animais"));
      const servicosSnapshot = await getDocs(collection(db, "servicos"));
      const funcionariosSnapshot = await getDocs(collection(db, "funcionarios"));
      
      const animaisMap = new Map<string, Animal>();
      const servicosMap = new Map<string, Servico>();
      const funcionariosMap = new Map<string, Funcionario>();
      
      animaisSnapshot.forEach(doc => {
        animaisMap.set(doc.id, { id: doc.id, ...doc.data() } as Animal);
      });
      
      servicosSnapshot.forEach(doc => {
        servicosMap.set(doc.id, { id: doc.id, ...doc.data() } as Servico);
      });
      
      funcionariosSnapshot.forEach(doc => {
        funcionariosMap.set(doc.id, { id: doc.id, ...doc.data() } as Funcionario);
      });
      
      // Mapear e enriquecer cada atendimento
      atendimentosSnapshot.forEach(doc => {
        const atendimento = { id: doc.id, ...doc.data() } as Atendimento;
        const atendimentoRelatorio: AtendimentoRelatorio = { ...atendimento };
        
        // Adicionar nomes e informações adicionais
        if (atendimento.animalId && animaisMap.has(atendimento.animalId)) {
          atendimentoRelatorio.animalNome = animaisMap.get(atendimento.animalId)?.nome;
        }
        
        if (atendimento.funcionarioId && funcionariosMap.has(atendimento.funcionarioId)) {
          atendimentoRelatorio.funcionarioNome = funcionariosMap.get(atendimento.funcionarioId)?.nome;
        }
        
        // Tratar serviços (considerando apenas servicoId único)
        const servicosIds: string[] = [];
        if (atendimento.servicoId) {
          servicosIds.push(atendimento.servicoId);
        }
        
        if (servicosIds.length > 0) {
          atendimentoRelatorio.servicosNomes = servicosIds
            .filter(id => servicosMap.has(id))
            .map(id => servicosMap.get(id)?.nome || '');
        }
        
        // Filtro de serviço (aplicado após a busca)
        if (!filtros.servicoId || 
            atendimento.servicoId === filtros.servicoId) {
          atendimentos.push(atendimentoRelatorio);
        }
      });
      
      // Ordenar por data (mais recente primeiro)
      return atendimentos.sort((a, b) => {
        const dataA = a.data instanceof Timestamp ? a.data.toDate() : new Date(a.data);
        const dataB = b.data instanceof Timestamp ? b.data.toDate() : new Date(b.data);
        return dataB.getTime() - dataA.getTime();
      });
    } catch (error) {
      console.error("Erro ao buscar histórico de atendimentos:", error);
      throw error;
    }
  }
}
