import { useState, useEffect } from 'react';
import { Servico, ServicoFormValues } from '../../models/types/ServicoTypes';
import { ServicoService } from '../../models/services/ServicoService';

export const useServico = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchServicos();
  }, []);
  
  // Buscar todos os serviços
  const fetchServicos = async () => {
    setLoading(true);
    try {
      const data = await ServicoService.getServicos();
      setServicos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar serviços');
      console.error('Erro ao buscar serviços:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Adicionar novo serviço
  const addServico = async (servicoData: ServicoFormValues) => {
    try {
      const newServico = await ServicoService.addServico(servicoData);
      setServicos(prev => [...prev, newServico]);
      return newServico;
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar serviço');
      console.error('Erro ao adicionar serviço:', err);
      throw err;
    }
  };
  
  // Atualizar serviço existente
  const updateServico = async (id: string, servicoData: Partial<ServicoFormValues>) => {
    try {
      await ServicoService.updateServico(id, servicoData);
      setServicos(prev =>
        prev.map(servico => (servico.id === id ? { ...servico, ...servicoData } : servico))
      );
      return id;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar serviço');
      console.error('Erro ao atualizar serviço:', err);
      throw err;
    }
  };
  
  // Deletar serviço
  const deleteServico = async (id: string) => {
    try {
      await ServicoService.deleteServico(id);
      setServicos(prev => prev.filter(servico => servico.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar serviço');
      console.error('Erro ao deletar serviço:', err);
      throw err;
    }
  };
  
  // Buscar serviços com termo de busca
  const searchServicos = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return fetchServicos();
    }
    
    setLoading(true);
    try {
      const data = await ServicoService.getServicosBySearch(searchTerm);
      setServicos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar serviços');
      console.error('Erro ao buscar serviços:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    servicos,
    loading,
    error,
    fetchServicos,
    addServico,
    updateServico,
    deleteServico,
    searchServicos
  };
};
