import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Produto } from '../types/ProdutoTypes';

export const ProdutoService = {
  getProdutos: async (): Promise<Produto[]> => {
    try {
      const produtosSnapshot = await getDocs(collection(db, 'produtos'));
      return produtosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Produto[];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },
  
  getProdutoById: async (id: string): Promise<Produto | null> => {
    try {
      const produtoDoc = await getDoc(doc(db, 'produtos', id));
      if (!produtoDoc.exists()) {
        return null;
      }
      return {
        id: produtoDoc.id,
        ...produtoDoc.data(),
        createdAt: produtoDoc.data().createdAt?.toDate(),
        updatedAt: produtoDoc.data().updatedAt?.toDate()
      } as Produto;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    }
  },
  
  addProduto: async (produto: Omit<Produto, 'id'>): Promise<Produto> => {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, 'produtos'), {
        ...produto,
        createdAt: now,
        updatedAt: now
      });
      return {
        id: docRef.id,
        ...produto,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  },
  
  updateProduto: async (id: string, produto: Partial<Omit<Produto, 'id'>>): Promise<void> => {
    try {
      const produtoRef = doc(db, 'produtos', id);
      await updateDoc(produtoRef, {
        ...produto,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },
  
  deleteProduto: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'produtos', id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  },
  
  getProdutosBySearch: async (searchTerm: string): Promise<Produto[]> => {
    try {
      const produtosSnapshot = await getDocs(collection(db, 'produtos'));
      const produtos = produtosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Produto[];
      
      return produtos.filter(produto => 
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  }
};
