import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Venda } from '../../models/types/VendaTypes';
import { VendaService } from '../../models/services/VendaService';
import { ProdutoService } from '../../models/services/ProdutoService';
import { TutorService } from '../../models/services/TutorService';
import { FuncionarioService } from '../../models/services/FuncionarioService';
import { Produto } from '../../models/types/ProdutoTypes';
import { Tutor } from '../../models/types/TutorTypes';
import { Funcionario } from '../../models/types/FuncionarioTypes';

export const useVenda = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Buscar dados iniciais
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar produtos
      const produtosLista = await ProdutoService.getProdutos();
      setProdutos(produtosLista);
      
      // Buscar tutores
      const tutoresLista = await TutorService.getTutores();
      setTutores(tutoresLista);
      
      // Buscar funcionários
      const funcionariosLista = await FuncionarioService.getFuncionarios();
      setFuncionarios(funcionariosLista);
      
      // Buscar vendas
      const vendasLista = await VendaService.getVendas();
      
      // Carregar dados relacionados
      const vendasCompletas = await VendaService.loadRelatedData(
        vendasLista, 
        produtosLista, 
        tutoresLista, 
        funcionariosLista
      );
      
      setVendas(vendasCompletas);
    } catch (error) {
      setError('Erro ao carregar dados');
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  // Adicionar nova venda
  const addVenda = async (vendaData: Omit<Venda, 'id'>) => {
    setLoading(true);
    try {
      // Validar dados antes de enviar
      if (!vendaData.itens || vendaData.itens.length === 0) {
        throw new Error('A venda precisa conter pelo menos um item');
      }

      // Verificar e normalizar valores numéricos
      const dadosValidados = {
        ...vendaData,
        valorTotal: Number(vendaData.valorTotal),
        desconto: Number(vendaData.desconto || 0),
        valorFinal: Number(vendaData.valorFinal),
      };

      // Enviar para o serviço
      const resultado = await VendaService.addVenda(dadosValidados);
      
      if (!resultado) {
        throw new Error('Falha ao registrar venda no serviço');
      }
      
      toast({
        title: 'Venda registrada',
        description: 'A venda foi registrada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      
      await fetchData(); // Recarregar dados
      return true;
    } catch (error: any) {
      console.error("Erro no hook addVenda:", error);
      toast({
        title: 'Erro ao registrar',
        description: error?.message || 'Ocorreu um erro ao registrar a venda',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Função simplificada apenas para o PDV
  // Não precisamos mais de updateVenda, deleteVenda, getVendasPorTutor

  // Carregar dados na inicialização
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return {
    vendas,
    produtos,
    tutores,
    funcionarios,
    loading,
    error,
    addVenda,
    reloadData: fetchData
  };
};
