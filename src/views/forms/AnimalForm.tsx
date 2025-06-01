import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  ModalFooter,
  Text
} from '@chakra-ui/react';
import { Animal } from '../../models/types/AnimalTypes';

interface AnimalFormProps {
  animal?: Animal; // Se fornecido, é modo de edição
  tutores: { id: string; nome: string }[];
  onSave: (animalData: Omit<Animal, 'id' | 'tutor'>) => Promise<boolean>;
  onCancel: () => void;
  onDelete?: () => void; // Opcional, apenas para edição
  isLoading: boolean;
  successColor: string;
  errorColor: string;
  buttonColorScheme: string;
  mensagem: string;
}

const AnimalForm: React.FC<AnimalFormProps> = ({
  animal,
  tutores,
  onSave,
  onCancel,
  onDelete,
  isLoading,
  successColor,
  errorColor,
  buttonColorScheme,
  mensagem
}) => {
  const [nome, setNome] = useState(animal?.nome || '');
  const [especie, setEspecie] = useState(animal?.especie || '');
  const [raca, setRaca] = useState(animal?.raca || '');
  const [tutorId, setTutorId] = useState(animal?.tutorId || '');
  
  // Atualizar os campos se o animal for alterado externamente
  useEffect(() => {
    if (animal) {
      setNome(animal.nome);
      setEspecie(animal.especie || '');
      setRaca(animal.raca || '');
      setTutorId(animal.tutorId || '');
    }
  }, [animal]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      nome,
      especie,
      raca,
      tutorId
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={3}>
        <FormLabel>Nome:</FormLabel>
        <Input 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          required 
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Espécie:</FormLabel>
        <Input 
          value={especie} 
          onChange={e => setEspecie(e.target.value)} 
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Raça:</FormLabel>
        <Input 
          value={raca} 
          onChange={e => setRaca(e.target.value)} 
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Tutor:</FormLabel>
        <Select 
          value={tutorId} 
          onChange={e => setTutorId(e.target.value)} 
          required
        >
          <option value="">Selecione o tutor</option>
          {tutores.map(t => (
            <option key={t.id} value={t.id}>{t.nome}</option>
          ))}
        </Select>
      </FormControl>
      
      <ModalFooter px={0}>
        {onDelete && (
          <Button 
            variant="outline" 
            colorScheme="red"
            mr="auto"
            onClick={onDelete}
          >
            Excluir
          </Button>
        )}
        <Button 
          variant="outline" 
          mr={3} 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          isLoading={isLoading}
          loadingText="Salvando" 
          colorScheme={buttonColorScheme}
        >
          Salvar
        </Button>
      </ModalFooter>
      
      {mensagem && (
        <Text 
          mt={4} 
          color={mensagem.includes('sucesso') ? successColor : errorColor}
        >
          {mensagem}
        </Text>
      )}
    </form>
  );
};

export default AnimalForm;
