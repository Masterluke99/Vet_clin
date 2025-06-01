import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Servico } from '../types/ServicoTypes';

export const ServicoService = {
  getServicos: async (): Promise<Servico[]> => {
    try {
      const servicosSnapshot = await getDocs(collection(db, 'servicos'));
      return servicosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Servico[];
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      throw error;
    }
  },
  
  getServicoById: async (id: string): Promise<Servico | null> => {
    try {
      const servicoDoc = await getDoc(doc(db, 'servicos', id));
      if (!servicoDoc.exists()) {
        return null;
      }
      return {
        id: servicoDoc.id,
        ...servicoDoc.data(),
        createdAt: servicoDoc.data().createdAt?.toDate(),
        updatedAt: servicoDoc.data().updatedAt?.toDate()
      } as Servico;
    } catch (error) {
      console.error("Erro ao buscar serviço:", error);
      throw error;
    }
  },
  
  addServico: async (servico: Omit<Servico, 'id'>): Promise<Servico> => {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, 'servicos'), {
        ...servico,
        createdAt: now,
        updatedAt: now
      });
      return {
        id: docRef.id,
        ...servico,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      throw error;
    }
  },
  
  updateServico: async (id: string, servico: Partial<Omit<Servico, 'id'>>): Promise<void> => {
    try {
      const servicoRef = doc(db, 'servicos', id);
      await updateDoc(servicoRef, {
        ...servico,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      throw error;
    }
  },
  
  deleteServico: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'servicos', id));
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      throw error;
    }
  },
  
  getServicosBySearch: async (searchTerm: string): Promise<Servico[]> => {
    try {
      const servicosSnapshot = await getDocs(collection(db, 'servicos'));
      const servicos = servicosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Servico[];
      
      return servicos.filter(servico => 
        servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      throw error;
    }
  }
};
