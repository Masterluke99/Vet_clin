import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
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
  // Função getVendasPorTutor removida, pois não é necessária no PDV
  // Adicionar nova venda
  addVenda: async (venda: Omit<Venda, 'id'>) => {
    try {
      if (!venda.itens || venda.itens.length === 0) {
        console.error("Tentativa de cadastrar venda sem itens");
        throw new Error("Uma venda precisa ter pelo menos um item");
      }

      // Garantir que todos os valores numéricos são números
      const dadosNormalizados = {
        ...venda,
        valorTotal: Number(venda.valorTotal) || 0,
        desconto: Number(venda.desconto) || 0,
        valorFinal: Number(venda.valorFinal) || 0,
        // Garantir que os itens também têm valores numéricos
        itens: venda.itens.map(item => ({
          ...item,
          precoUnitario: Number(item.precoUnitario) || 0,
          quantidade: Number(item.quantidade) || 1,
          subtotal: Number(item.subtotal) || 0
        })),
        criadoEm: new Date(),
        status: venda.status || 'concluida'
      };
        // Adicionar documento e retornar a referência
      const docRef = await addDoc(collection(db, 'vendas'), dadosNormalizados);
      
      if (!docRef || !docRef.id) {
        throw new Error("Falha ao gerar o ID da venda");
      }
      
      // Atualizar estoque dos produtos vendidos
      if (venda.status === 'concluida') {
        try {
          await Promise.all(venda.itens.map(async (item) => {
            if (item.produto && item.produtoId) {
              // Obter referência do produto
              const produtoRef = doc(db, 'produtos', item.produtoId);
              
              // Obter dados atuais do produto
              const produtoSnap = await getDoc(produtoRef);
              
              if (produtoSnap.exists()) {
                const produtoData = produtoSnap.data();
                const estoqueAtual = produtoData.estoque || 0;
                const novoEstoque = Math.max(0, estoqueAtual - item.quantidade);
                
                // Atualizar estoque
                await updateDoc(produtoRef, {
                  estoque: novoEstoque
                });
              }
            }
          }));
        } catch (updateError) {
          console.error("Erro ao atualizar estoque:", updateError);
          // Não interromper o processo por falha no estoque, apenas registrar
        }
      }
      
      return docRef;
    } catch (error: any) {
      console.error("Erro ao cadastrar venda:", error);
      throw new Error(error?.message || "Erro ao cadastrar venda");
    }
  },
  // Funções de atualização e exclusão de vendas foram removidas, pois não são necessárias no PDV

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

