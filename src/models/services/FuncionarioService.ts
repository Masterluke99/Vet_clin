import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, DocumentData } from 'firebase/firestore';
import { Funcionario } from '../types/FuncionarioTypes';

export const FuncionarioService = {
  // Buscar todos os funcionários
  getFuncionarios: async () => {
    try {
      const funcionariosSnapshot = await getDocs(collection(db, 'funcionarios'));
      
      const funcionarios = funcionariosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dataContratacao: data.dataContratacao instanceof Timestamp ? data.dataContratacao.toDate() : data.dataContratacao ? new Date(data.dataContratacao) : undefined,
          createdAt: data.criadoEm instanceof Timestamp ? data.criadoEm.toDate() : new Date(data.criadoEm)
        } as Funcionario;
      });
      
      return funcionarios;
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      throw error;
    }
  },

  // Adicionar novo funcionário
  addFuncionario: async (funcionario: Omit<Funcionario, 'id'>) => {
    try {
      return await addDoc(collection(db, 'funcionarios'), {
        ...funcionario,
        criadoEm: new Date()
      });
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      throw error;
    }
  },
  
  // Atualizar funcionário existente
  updateFuncionario: async (id: string, funcionario: Partial<Funcionario>) => {
    try {
      const funcionarioRef = doc(db, 'funcionarios', id);
      await updateDoc(funcionarioRef, {
        ...funcionario,
        atualizadoEm: new Date()
      } as DocumentData);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      throw error;
    }
  },
  
  // Excluir funcionário
  deleteFuncionario: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'funcionarios', id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      throw error;
    }
  }
};
