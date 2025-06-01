import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, Timestamp, DocumentData } from 'firebase/firestore';
import { Atendimento } from '../types/AtendimentoTypes';
import { Animal } from '../types/AnimalTypes';
import { Servico } from '../types/ServicoTypes';
import { Funcionario } from '../types/FuncionarioTypes';

export const AtendimentoService = {
  // Buscar todos os atendimentos
  getAtendimentos: async () => {
    try {
      const atendimentosSnapshot = await getDocs(collection(db, 'atendimentos'));
      
      const atendimentos = atendimentosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          data: data.data instanceof Timestamp ? data.data.toDate() : new Date(data.data),
          createdAt: data.criadoEm instanceof Timestamp ? data.criadoEm.toDate() : new Date(data.criadoEm)
        } as Atendimento;
      });
      
      return atendimentos;
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      throw error;
    }
  },
  
  // Buscar atendimentos por animal
  getAtendimentosPorAnimal: async (animalId: string) => {
    try {
      const q = query(collection(db, 'atendimentos'), where('animalId', '==', animalId));
      const atendimentosSnapshot = await getDocs(q);
      
      return atendimentosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          data: data.data instanceof Timestamp ? data.data.toDate() : new Date(data.data),
          createdAt: data.criadoEm instanceof Timestamp ? data.criadoEm.toDate() : new Date(data.criadoEm)
        } as Atendimento;
      });
    } catch (error) {
      console.error("Erro ao buscar atendimentos do animal:", error);
      throw error;
    }
  },
  // Adicionar novo atendimento
  addAtendimento: async (atendimento: Omit<Atendimento, 'id'>) => {
    try {
      // Garantir que o valorTotal seja um número
      const dadosFormatados = {
        ...atendimento,
        valorTotal: Number(atendimento.valorTotal),
        criadoEm: new Date()
      };
      
      return await addDoc(collection(db, 'atendimentos'), dadosFormatados);
    } catch (error) {
      console.error("Erro ao cadastrar atendimento:", error);
      throw error;
    }
  },
    // Atualizar atendimento existente
  updateAtendimento: async (id: string, atendimento: Partial<Atendimento>) => {
    try {
      const atendimentoRef = doc(db, 'atendimentos', id);
      
      // Garantir que valorTotal seja um número se estiver presente
      const dadosFormatados = {
        ...atendimento,
        valorTotal: atendimento.valorTotal !== undefined ? Number(atendimento.valorTotal) : undefined,
        atualizadoEm: new Date()
      } as DocumentData;
      
      await updateDoc(atendimentoRef, dadosFormatados);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar atendimento:", error);
      throw error;
    }
  },
  
  // Excluir atendimento
  deleteAtendimento: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'atendimentos', id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir atendimento:", error);
      throw error;
    }
  },  // Carregar dados relacionados
  loadRelatedData: async (atendimentos: Atendimento[], animais: Animal[], servicos: Servico[], funcionarios: Funcionario[]) => {
    return atendimentos.map(atendimento => {
      const animal = animais.find(a => a.id === atendimento.animalId);
      
      // Determinar serviços
      const servicosArray: Servico[] = [];
      let servico: Servico | undefined = undefined;
      
      // Se temos serviços IDs, usar eles
      if (atendimento.servicosIds && atendimento.servicosIds.length > 0) {
        // Obter todos os serviços correspondentes
        for (const servicoId of atendimento.servicosIds) {
          const servicoEncontrado = servicos.find(s => s.id === servicoId);
          if (servicoEncontrado) {
            servicosArray.push(servicoEncontrado);
          }
        }
        
        // Para compatibilidade com código existente
        servico = servicosArray.length > 0 ? servicosArray[0] : undefined;
      } 
      // Caso contrário, tente usar o servicoId
      else if (atendimento.servicoId) {
        servico = servicos.find(s => s.id === atendimento.servicoId);
        if (servico) {
          servicosArray.push(servico);
        }
      }
      
      const funcionario = funcionarios.find(f => f.id === atendimento.funcionarioId);
      
      return {
        ...atendimento,
        animal,
        servico,
        servicos: servicosArray,
        servicosIds: atendimento.servicosIds || (atendimento.servicoId ? [atendimento.servicoId] : []),
        funcionario
      } as Atendimento;
    });
  }
};
