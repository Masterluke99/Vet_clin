import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RelatorioService } from '../../models/services/RelatorioService';
import { AtendimentoRelatorio, FiltrosRelatorio } from '../../models/types/RelatorioTypes';
import { useAnimal } from './useAnimal';
import { useServico } from './useServico';
import { useFuncionario } from './useFuncionario';

export const useRelatorio = () => {
  const [atendimentos, setAtendimentos] = useState<AtendimentoRelatorio[]>([]);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    dataInicio: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Último mês
    dataFim: format(new Date(), 'yyyy-MM-dd'),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Acesso aos dados de outras entidades
  const { animais } = useAnimal();
  const { servicos } = useServico();
  const { funcionarios } = useFuncionario();

  const toast = useToast();
  // Carregar atendimentos com base nos filtros
  const carregarAtendimentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dados = await RelatorioService.getAtendimentos(filtros);
      setAtendimentos(dados);
    } catch (err) {
      console.error('Erro ao carregar atendimentos:', err);
      setError('Não foi possível carregar o histórico de atendimentos');
      
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de atendimentos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [filtros, toast]);

  // Atualizar filtros
  const atualizarFiltros = (novosFiltros: Partial<FiltrosRelatorio>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
  };

  // Formatar data para exibição
  const formatarData = (data: Date | string | any): string => {
    try {
      if (!data) return '';
      
      const dataObj = data instanceof Date 
        ? data 
        : data.toDate 
          ? data.toDate() 
          : new Date(data);
          
      return format(dataObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return String(data);
    }
  };
  // Efeito para carregar dados quando os filtros mudarem
  useEffect(() => {
    carregarAtendimentos();
  }, [filtros, carregarAtendimentos]);

  return {
    atendimentos,
    filtros,
    loading,
    error,
    animais,
    servicos,
    funcionarios,
    atualizarFiltros,
    carregarAtendimentos,
    formatarData,
  };
};
