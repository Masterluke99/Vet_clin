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
      await VendaService.addVenda(vendaData);
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
    } catch (error) {
      toast({
        title: 'Erro ao registrar',
        description: 'Ocorreu um erro ao registrar a venda',
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

  // Atualizar venda existente
  const updateVenda = async (id: string, vendaData: Partial<Venda>) => {
    setLoading(true);
    try {
      await VendaService.updateVenda(id, vendaData);
      toast({
        title: 'Venda atualizada',
        description: 'A venda foi atualizada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      await fetchData(); // Recarregar dados
      return true;
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Ocorreu um erro ao atualizar a venda',
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

  // Excluir venda
  const deleteVenda = async (id: string) => {
    setLoading(true);
    try {
      await VendaService.deleteVenda(id);
      toast({
        title: 'Venda excluída',
        description: 'A venda foi excluída com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      await fetchData(); // Recarregar dados
      return true;
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: 'Ocorreu um erro ao excluir a venda',
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

  // Buscar vendas por tutor
  const getVendasPorTutor = async (tutorId: string) => {
    setLoading(true);
    try {
      const vendasTutor = await VendaService.getVendasPorTutor(tutorId);
      
      // Carregar dados relacionados
      const vendasCompletas = await VendaService.loadRelatedData(
        vendasTutor, 
        produtos, 
        tutores, 
        funcionarios
      );
      
      return vendasCompletas;
    } catch (error) {
      toast({
        title: 'Erro ao buscar',
        description: 'Ocorreu um erro ao buscar as vendas',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

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
    updateVenda,
    deleteVenda,
    getVendasPorTutor,
    reloadData: fetchData
  };
};
