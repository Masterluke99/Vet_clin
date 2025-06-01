import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  Text,
  List,
  ListItem,
  Flex,
  useDisclosure
} from '@chakra-ui/react';
import { Animal } from '../../models/types/AnimalTypes';
import { useAnimal } from '../../controllers/hooks/useAnimal';
import AnimalModal from '../components/modals/AnimalModal';
import { AnimalStyles } from '../../styles/themeStyles';

interface Props {
  onSelect?: (animal: Animal) => void;
  onAddNew?: () => void;
}

const ListaAnimaisComBusca: React.FC<Props> = ({ onSelect }) => {
  // Hook para gerenciar estado e lógica
  const { animais, tutores, loading, addAnimal, updateAnimal, deleteAnimal } = useAnimal();
  
  // Estados locais (UI-specific)
  const [busca, setBusca] = useState('');
  const [foco, setFoco] = useState(false);
  const [selecionado, setSelecionado] = useState<Animal | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [animalEmEdicao, setAnimalEmEdicao] = useState<Animal | null>(null);
  
  // Modais
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    // Importação dos estilos centralizados
  const { bgColor, headerBgColor, buttonColorScheme, borderColor, successColor, errorColor } = AnimalStyles;

  // Filtragem de animais
  const animaisFiltrados = busca
    ? animais.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()))
    : animais;

  // Handlers
  const handleSelect = (animal: Animal) => {
    setSelecionado(animal);
    setBusca(animal.nome);
    setFoco(false);
    if (onSelect) onSelect(animal);
  };
  
  const handleEdit = (animal: Animal) => {
    setAnimalEmEdicao(animal);
    onEditOpen();
  };
  
  const handleSaveNew = async (animalData: Omit<Animal, 'id' | 'tutor'>) => {
    const success = await addAnimal(animalData);
    if (success) {
      setMensagem('Animal cadastrado com sucesso!');
      onAddClose();
      return true;
    } else {
      setMensagem('Erro ao cadastrar animal.');
      return false;
    }
  };
  
  const handleSaveEdit = async (animalData: Omit<Animal, 'id' | 'tutor'>) => {
    if (!animalEmEdicao) return false;
    const success = await updateAnimal(animalEmEdicao.id, animalData);
    if (success) {
      setMensagem('Animal atualizado com sucesso!');
      onEditClose();
      return true;
    } else {
      setMensagem('Erro ao atualizar animal.');
      return false;
    }
  };
  
  const handleDelete = async (id: string) => {
    return await deleteAnimal(id);
  };

  return (
    <Container maxW="600px" mx="auto" mt="40px" p="6" bg={bgColor} borderRadius="lg" shadow="xl" boxShadow="0 5px 20px rgba(0,0,0,0.1)" position="relative">
      <Flex mb={4} align="center">
        <Input
          placeholder="Buscar animal pelo nome..."
          value={busca}
          onChange={e => { setBusca(e.target.value); setSelecionado(null); }}
          onFocus={() => setFoco(true)}
          mr={3}
          bg="white"
          borderColor={borderColor}
        />
        <Button
          onClick={onAddOpen}
          colorScheme={buttonColorScheme}
          leftIcon={<Text fontSize="xl">+</Text>}
        >
          Novo
        </Button>
      </Flex>
      
      {/* Resultados da busca */}
      {foco && busca && animaisFiltrados.length > 0 && (
        <Box 
          position="absolute" 
          left={6} 
          right={6} 
          top="70px" 
          bg="white" 
          borderWidth="1px" 
          borderColor={borderColor}
          borderRadius="md"
          zIndex={10} 
          maxH="200px" 
          overflowY="auto"
          shadow="lg"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
        >
          <List styleType="none" m={0} p={0}>
            {animaisFiltrados.map(animal => (
              <ListItem
                key={animal.id}
                onClick={() => handleSelect(animal)}
                cursor="pointer"
                bg={selecionado?.id === animal.id ? headerBgColor : 'white'}
                p={2}
                _hover={{ bg: 'green.50' }}
              >
                <Text>{animal.nome} {animal.especie ? `(${animal.especie})` : ''} {animal.tutor ? `- Tutor: ${animal.tutor}` : ''}  </Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {/* Lista de animais */}
      <Box mt={6}>
        <Heading size="md" color="green.700" mb={2}>Animais cadastrados</Heading>
        <List styleType="none" p={0}>
          {animais.map(animal => (
            <ListItem 
              key={animal.id} 
              p={2} 
              borderBottomWidth="1px" 
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center">
                <Text>
                  <strong>{animal.nome}</strong> 
                  {animal.especie && ` - ${animal.especie}`} 
                  {animal.raca && ` - ${animal.raca}`} 
                  {animal.tutor && ` - Tutor: ${animal.tutor}`}
                </Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(animal);
                  }}
                >
                  Editar
                </Button>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Modal para adicionar novo animal */}
      <AnimalModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        tutores={tutores}
        onSave={handleSaveNew}
        isLoading={loading}
        successColor={successColor}
        errorColor={errorColor}
        buttonColorScheme={buttonColorScheme}
        mensagem={mensagem}
      />
      
      {/* Modal para editar animal existente */}
      <AnimalModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        animal={animalEmEdicao || undefined}
        tutores={tutores}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        isLoading={loading}
        successColor={successColor}
        errorColor={errorColor}
        buttonColorScheme={buttonColorScheme}
        mensagem={mensagem}
      />
    </Container>
  );
};

export default ListaAnimaisComBusca;
