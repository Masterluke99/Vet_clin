import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, Timestamp, DocumentData } from 'firebase/firestore';
import { Venda } from '../types/VendaTypes';
import { Produto } from '../types/ProdutoTypes';
import { Tutor } from '../types/TutorTypes';
import { Funcionario } from '../types/FuncionarioTypes';

export const VendaService = {
  // Buscar todas as vendas
  getVendas: async () => {
    try {
      const vendasSnapshot = await getDocs(collection(db, 'vendas'));
      
      const vendas = vendasSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          data: data.data instanceof Timestamp ? data.data.toDate() : new Date(data.data),
          createdAt: data.criadoEm instanceof Timestamp ? data.criadoEm.toDate() : new Date(data.criadoEm)
        } as Venda;
      });
      
      return vendas;
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      throw error;
    }
  },

  // Buscar vendas por tutor
  getVendasPorTutor: async (tutorId: string) => {
    try {
      const q = query(collection(db, 'vendas'), where('tutorId', '==', tutorId));
      const vendasSnapshot = await getDocs(q);
      
      return vendasSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          data: data.data instanceof Timestamp ? data.data.toDate() : new Date(data.data),
          createdAt: data.criadoEm instanceof Timestamp ? data.criadoEm.toDate() : new Date(data.criadoEm)
        } as Venda;
      });
    } catch (error) {
      console.error("Erro ao buscar vendas do tutor:", error);
      throw error;
    }
  },

  // Adicionar nova venda
  addVenda: async (venda: Omit<Venda, 'id'>) => {
    try {
      // Garantir que todos os valores numéricos são números
      const dadosNormalizados = {
        ...venda,
        valorTotal: Number(venda.valorTotal),
        desconto: Number(venda.desconto),
        valorFinal: Number(venda.valorFinal),
        // Garantir que os itens também têm valores numéricos
        itens: venda.itens.map(item => ({
          ...item,
          precoUnitario: Number(item.precoUnitario),
          quantidade: Number(item.quantidade),
          subtotal: Number(item.subtotal)
        })),
        criadoEm: new Date()
      };
      
      return await addDoc(collection(db, 'vendas'), dadosNormalizados);
    } catch (error) {
      console.error("Erro ao cadastrar venda:", error);
      throw error;
    }
  },

  // Atualizar venda existente
  updateVenda: async (id: string, venda: Partial<Venda>) => {
    try {
      const vendaRef = doc(db, 'vendas', id);
      
      // Normalizar valores para garantir que estão como números
      const dadosNormalizados: DocumentData = {
        ...venda,
        // Converter para número apenas se os valores estiverem definidos
        valorTotal: venda.valorTotal !== undefined ? Number(venda.valorTotal) : undefined,
        desconto: venda.desconto !== undefined ? Number(venda.desconto) : undefined,
        valorFinal: venda.valorFinal !== undefined ? Number(venda.valorFinal) : undefined,
        // Normalizar itens se estiverem presentes
        itens: venda.itens ? venda.itens.map(item => ({
          ...item,
          precoUnitario: Number(item.precoUnitario),
          quantidade: Number(item.quantidade),
          subtotal: Number(item.subtotal)
        })) : undefined,
        atualizadoEm: new Date()
      };
      
      await updateDoc(vendaRef, dadosNormalizados);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
      throw error;
    }
  },
  
  // Excluir venda
  deleteVenda: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vendas', id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
      throw error;
    }
  },

  // Carregar dados relacionados
  loadRelatedData: async (vendas: Venda[], produtos: Produto[], tutores: Tutor[], funcionarios: Funcionario[]) => {
    return vendas.map(venda => {
      const tutor = venda.tutorId ? tutores.find(t => t.id === venda.tutorId) : undefined;
      const funcionario = venda.funcionarioId ? funcionarios.find(f => f.id === venda.funcionarioId) : undefined;
      
      // Adicionar informações dos produtos aos itens
      const itensCompletos = venda.itens.map(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        return {
          ...item,
          produto
        };
      });
      
      return {
        ...venda,
        itens: itensCompletos,
        tutor,
        funcionario
      };
    });
  }
};

