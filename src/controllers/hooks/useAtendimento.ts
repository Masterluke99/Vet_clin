import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Atendimento } from '../../models/types/AtendimentoTypes';
import { AtendimentoService } from '../../models/services/AtendimentoService';
import { AnimalService } from '../../models/services/AnimalService';
import { ServicoService } from '../../models/services/ServicoService';
import { FuncionarioService } from '../../models/services/FuncionarioService';
import { Animal } from '../../models/types/AnimalTypes';
import { Servico } from '../../models/types/ServicoTypes';
import { Funcionario } from '../../models/types/FuncionarioTypes';

export const useAtendimento = () => {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  // Buscar dados iniciais
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar animais
      const animaisLista = await AnimalService.getAnimais([]);
      setAnimais(animaisLista);
      
      // Buscar serviços
      const servicosLista = await ServicoService.getServicos();
      setServicos(servicosLista);
      
      // Buscar funcionários
      const funcionariosLista = await FuncionarioService.getFuncionarios();
      setFuncionarios(funcionariosLista);
      
      // Buscar atendimentos
      const atendimentosLista = await AtendimentoService.getAtendimentos();
      
      // Carregar dados relacionados
      const atendimentosCompletos = await AtendimentoService.loadRelatedData(
        atendimentosLista, 
        animaisLista, 
        servicosLista, 
        funcionariosLista
      );
      
      // Casting explícito para satisfazer o TypeScript
      setAtendimentos(atendimentosCompletos as Atendimento[]);
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
  // Adicionar novo atendimento
  const addAtendimento = async (atendimentoData: Omit<Atendimento, 'id'>) => {
    setLoading(true);
    try {
      // Garantir que temos os dados corretos de serviços
      const dadosParaEnviar = {
        ...atendimentoData,
        // Garantir compatibilidade com implementações anteriores
        servicoId: atendimentoData.servicosIds && atendimentoData.servicosIds.length > 0 
          ? atendimentoData.servicosIds[0] 
          : atendimentoData.servicoId,
        // Garantir que servicosIds está definido
        servicosIds: atendimentoData.servicosIds || 
          (atendimentoData.servicoId ? [atendimentoData.servicoId] : [])
      };
      
      await AtendimentoService.addAtendimento(dadosParaEnviar);
      toast({
        title: 'Atendimento registrado',
        description: 'O atendimento foi registrado com sucesso',
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
        description: 'Ocorreu um erro ao registrar o atendimento',
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
  // Atualizar atendimento existente
  const updateAtendimento = async (id: string, atendimentoData: Partial<Atendimento>) => {
    setLoading(true);
    try {
      // Garantir que temos os dados corretos de serviços
      const dadosParaEnviar = {
        ...atendimentoData,
        // Garantir compatibilidade com implementações anteriores
        servicoId: atendimentoData.servicosIds && atendimentoData.servicosIds.length > 0 
          ? atendimentoData.servicosIds[0] 
          : atendimentoData.servicoId,
        // Garantir que servicosIds está definido
        servicosIds: atendimentoData.servicosIds || 
          (atendimentoData.servicoId ? [atendimentoData.servicoId] : [])
      };
      
      await AtendimentoService.updateAtendimento(id, dadosParaEnviar);
      toast({
        title: 'Atendimento atualizado',
        description: 'O atendimento foi atualizado com sucesso',
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
        description: 'Ocorreu um erro ao atualizar o atendimento',
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

  // Excluir atendimento
  const deleteAtendimento = async (id: string) => {
    setLoading(true);
    try {
      await AtendimentoService.deleteAtendimento(id);
      toast({
        title: 'Atendimento excluído',
        description: 'O atendimento foi excluído com sucesso',
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
        description: 'Ocorreu um erro ao excluir o atendimento',
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
  // Buscar atendimentos por animal
  const getAtendimentosPorAnimal = async (animalId: string) => {
    setLoading(true);
    try {
      const atendimentosAnimal = await AtendimentoService.getAtendimentosPorAnimal(animalId);
      
      // Carregar dados relacionados
      const atendimentosCompletos = await AtendimentoService.loadRelatedData(
        atendimentosAnimal, 
        animais, 
        servicos, 
        funcionarios
      );
      
      return atendimentosCompletos as Atendimento[];
    } catch (error) {
      toast({
        title: 'Erro ao buscar',
        description: 'Ocorreu um erro ao buscar os atendimentos',
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
    atendimentos,
    animais,
    servicos,
    funcionarios,
    loading,
    error,
    addAtendimento,
    updateAtendimento,
    deleteAtendimento,
    getAtendimentosPorAnimal,
    reloadData: fetchData
  };
};
