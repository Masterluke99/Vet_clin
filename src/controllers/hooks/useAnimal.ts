import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Animal } from '../../models/types/AnimalTypes';
import { AnimalService } from '../../models/services/AnimalService';
import { TutorService } from '../../models/services/TutorService';

export const useAnimal = () => {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [tutores, setTutores] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Buscar dados iniciais
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar tutores
      const tutoresLista = await TutorService.getTutores();
      setTutores(tutoresLista);
      
      // Buscar animais
      const animaisLista = await AnimalService.getAnimais(tutoresLista);
      setAnimais(animaisLista);
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

  // Adicionar novo animal
  const addAnimal = async (animalData: Omit<Animal, 'id' | 'tutor'>) => {
    setLoading(true);
    try {
      await AnimalService.addAnimal(animalData);
      toast({
        title: 'Animal cadastrado',
        description: 'O animal foi cadastrado com sucesso',
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
        description: 'Ocorreu um erro ao cadastrar o animal',
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

  // Atualizar animal existente
  const updateAnimal = async (id: string, animalData: Partial<Animal>) => {
    setLoading(true);
    try {
      await AnimalService.updateAnimal(id, animalData);
      toast({
        title: 'Animal atualizado',
        description: 'O animal foi atualizado com sucesso',
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
        description: 'Ocorreu um erro ao atualizar o animal',
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

  // Excluir animal
  const deleteAnimal = async (id: string) => {
    setLoading(true);
    try {
      await AnimalService.deleteAnimal(id);
      toast({
        title: 'Animal excluído',
        description: 'O animal foi excluído com sucesso',
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
        description: 'Ocorreu um erro ao excluir o animal',
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
    animais,
    tutores,
    loading,
    error,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    reloadData: fetchData
  };
};
