import { useState, useEffect } from 'react';
import { Tutor, TutorFormValues } from '../../models/types/TutorTypes';
import { TutorService } from '../../models/services/TutorService';

export const useTutor = () => {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTutores();
  }, []);
  
  // Buscar todos os tutores
  const fetchTutores = async () => {
    setLoading(true);
    try {
      const data = await TutorService.getTutores();
      setTutores(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar tutores');
      console.error('Erro ao buscar tutores:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Adicionar novo tutor
  const addTutor = async (tutorData: TutorFormValues) => {
    try {
      const newTutor = await TutorService.addTutor(tutorData);
      setTutores(prev => [...prev, newTutor]);
      return newTutor;
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar tutor');
      console.error('Erro ao adicionar tutor:', err);
      throw err;
    }
  };
  
  // Atualizar tutor existente
  const updateTutor = async (id: string, tutorData: Partial<TutorFormValues>) => {
    try {
      await TutorService.updateTutor(id, tutorData);
      setTutores(prev =>
        prev.map(tutor => (tutor.id === id ? { ...tutor, ...tutorData } : tutor))
      );
      return id;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar tutor');
      console.error('Erro ao atualizar tutor:', err);
      throw err;
    }
  };
  
  // Deletar tutor
  const deleteTutor = async (id: string) => {
    try {
      await TutorService.deleteTutor(id);
      setTutores(prev => prev.filter(tutor => tutor.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar tutor');
      console.error('Erro ao deletar tutor:', err);
      throw err;
    }
  };
  
  // Buscar tutores com termo de busca
  const searchTutores = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return fetchTutores();
    }
    
    setLoading(true);
    try {
      const data = await TutorService.getTutoresBySearch(searchTerm);
      setTutores(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar tutores');
      console.error('Erro ao buscar tutores:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    tutores,
    loading,
    error,
    fetchTutores,
    addTutor,
    updateTutor,
    deleteTutor,
    searchTutores
  };
};
