import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Funcionario } from '../../models/types/FuncionarioTypes';
import { FuncionarioService } from '../../models/services/FuncionarioService';

export const useFuncionario = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Buscar dados iniciais
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const funcionariosLista = await FuncionarioService.getFuncionarios();
      setFuncionarios(funcionariosLista);
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

  // Adicionar novo funcionário
  const addFuncionario = async (funcionarioData: Omit<Funcionario, 'id'>) => {
    setLoading(true);
    try {
      await FuncionarioService.addFuncionario(funcionarioData);
      toast({
        title: 'Funcionário cadastrado',
        description: 'O funcionário foi cadastrado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      await fetchData(); // Recarregar dados
      return true;
    } catch (error) {
      toast({
        title: 'Erro ao cadastrar',
        description: 'Ocorreu um erro ao cadastrar o funcionário',
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

  // Atualizar funcionário existente
  const updateFuncionario = async (id: string, funcionarioData: Partial<Funcionario>) => {
    setLoading(true);
    try {
      await FuncionarioService.updateFuncionario(id, funcionarioData);
      toast({
        title: 'Funcionário atualizado',
        description: 'O funcionário foi atualizado com sucesso',
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
        description: 'Ocorreu um erro ao atualizar o funcionário',
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

  // Excluir funcionário
  const deleteFuncionario = async (id: string) => {
    setLoading(true);
    try {
      await FuncionarioService.deleteFuncionario(id);
      toast({
        title: 'Funcionário excluído',
        description: 'O funcionário foi excluído com sucesso',
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
        description: 'Ocorreu um erro ao excluir o funcionário',
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

  // Carregar dados na inicialização
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    funcionarios,
    loading,
    error,
    addFuncionario,
    updateFuncionario,
    deleteFuncionario,
    reloadData: fetchData
  };
};
