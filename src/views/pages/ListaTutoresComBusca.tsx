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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Badge,
  Divider,
  useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Tutor } from '../../models/types/TutorTypes';
import { Animal } from '../../models/types/AnimalTypes';
import { useTutor } from '../../controllers/hooks/useTutor';
import TutorModal from '../components/modals/TutorModal';
import { TutorStyles } from '../../styles/themeStyles';

interface Props {
  onSelect?: (tutor: Tutor) => void;
  onAddNew?: () => void;
}

const ListaTutoresComBusca: React.FC<Props> = ({ onSelect, onAddNew }) => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Hook para gerenciar estado e lógica
  const { tutores, loading, error, addTutor, updateTutor, searchTutores } = useTutor();
  
  // Estados locais (UI-specific)
  const [busca, setBusca] = useState('');
  const [foco, setFoco] = useState(false);
  const [tutorSelecionado, setTutorSelecionado] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<Tutor | null>(null);
  const [animaisPorTutor] = useState<{ [tutorId: string]: Animal[] }>({});
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingTutor, setEditingTutor] = useState<Tutor | undefined>(undefined);
  // Importação dos estilos centralizados
  const { bgColor, headerBgColor, buttonColorScheme, borderColor } = TutorStyles;

  // Filtragem local de tutores (alternativa à busca no servidor)
  const tutoresFiltrados = busca
    ? tutores.filter(t => t.nome.toLowerCase().includes(busca.toLowerCase()))
    : tutores;

  const handleTutorClick = (tutorId: string) => {
    if (tutorSelecionado === tutorId) {
      setTutorSelecionado(null);  // Fechando se clicar no mesmo tutor novamente
    } else {
      setTutorSelecionado(tutorId);
    }
  };

  const handleVerDetalhes = (animalId: string) => {
    navigate(`/gerenciar-animais/${animalId}`);
  };

  const handleSelect = (tutor: Tutor) => {
    setSelecionado(tutor);
    setBusca(tutor.nome);
    setFoco(false);
    if (onSelect) onSelect(tutor);
  };

  const handleAddClick = () => {
    setEditingTutor(undefined);
    onOpen();
  };

  const handleEditClick = (tutor: Tutor) => {
    setEditingTutor(tutor);
    onOpen();
  };

  const handleSaveTutor = async (tutorData: any) => {
    try {
      if (editingTutor) {
        await updateTutor(editingTutor.id, tutorData);
        toast({
          title: 'Tutor atualizado',
          description: 'O tutor foi atualizado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addTutor(tutorData);
        toast({
          title: 'Tutor cadastrado',
          description: 'O tutor foi cadastrado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o tutor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setBusca(searchTerm);
    setSelecionado(null);
    
    // Opcional: buscar no servidor se quiser resultados mais precisos
    if (searchTerm.length > 2) {
      searchTutores(searchTerm);
    }
  };

  return (
    <Container maxW="800px" mx="auto" mt="40px" p="6" bg={bgColor} borderRadius="lg" shadow="xl" boxShadow="0 5px 20px rgba(0,0,0,0.1)" position="relative">
      <Heading size="lg" mb="4" color="green.700">Tutores e Seus Animais</Heading>
      
      <Flex mb={4} align="center">
        <Input
          placeholder="Buscar tutor pelo nome..."
          value={busca}
          onChange={handleSearch}
          onFocus={() => setFoco(true)}
          mr={3}
          bg="white"
          borderColor={borderColor}
        />
        <Button
          onClick={handleAddClick}
          colorScheme={buttonColorScheme}
          leftIcon={<Text fontSize="xl">+</Text>}
        >
          Novo
        </Button>
      </Flex>
      
      {foco && busca && tutoresFiltrados.length > 0 && (
        <Box 
          position="absolute" 
          left={6} 
          right={6} 
          top="110px" 
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
            {tutoresFiltrados.map(tutor => (
              <ListItem
                key={tutor.id}
                onClick={() => handleSelect(tutor)}
                cursor="pointer"
                bg={selecionado?.id === tutor.id ? headerBgColor : 'white'}
                p={2}
                _hover={{ bg: 'green.50' }}
              >
                <Text>{tutor.nome} {tutor.email ? `(${tutor.email})` : ''}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {loading ? (
        <Text>Carregando tutores e animais...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : tutoresFiltrados.length === 0 ? (
        <Text>Nenhum tutor encontrado.</Text>
      ) : (
        <Accordion allowToggle>
          {tutoresFiltrados.map(tutor => (
            <AccordionItem key={tutor.id} border="1px" borderColor={borderColor} borderRadius="md" mb={3}>
              <h2>
                <AccordionButton 
                  py={3}
                  _expanded={{ bg: 'green.100', color: 'green.700' }}
                  onClick={() => handleTutorClick(tutor.id)}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">{tutor.nome}</Text>
                    <Text fontSize="sm" color="gray.600">{tutor.email} | {tutor.telefone}</Text>
                  </Box>
                  <Badge colorScheme="green" mr={2}>
                    {animaisPorTutor[tutor.id]?.length || 0} Animais
                  </Badge>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} bg="white">
                <Box mb={3}>
                  <Text fontWeight="bold">Informações de Contato:</Text>
                  <Text>Email: {tutor.email || 'Não informado'}</Text>
                  <Text>Telefone: {tutor.telefone || 'Não informado'}</Text>
                  <Text>Endereço: {tutor.endereco || 'Não informado'}</Text>
                </Box>
                
                <Flex justify="flex-end" mt={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleEditClick(tutor)}
                  >
                    Editar Tutor
                  </Button>
                </Flex>
                
                <Divider my={3} />
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Animais deste Tutor:</Text>
                  {!animaisPorTutor[tutor.id] || animaisPorTutor[tutor.id].length === 0 ? (
                    <Text color="gray.500">Este tutor não possui animais cadastrados.</Text>
                  ) : (
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Nome</Th>
                          <Th>Espécie</Th>
                          <Th>Raça</Th>
                          <Th>Ações</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {animaisPorTutor[tutor.id].map(animal => (
                          <Tr key={animal.id}>
                            <Td>{animal.nome}</Td>
                            <Td>{animal.especie || 'Não informada'}</Td>
                            <Td>{animal.raca || 'Não informada'}</Td>
                            <Td>
                              <Button
                                size="xs"
                                colorScheme="blue"
                                onClick={() => handleVerDetalhes(animal.id)}
                              >
                                Ver Detalhes
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      
      <TutorModal 
        isOpen={isOpen} 
        onClose={onClose}
        tutor={editingTutor}
        onSave={handleSaveTutor}
        title={editingTutor ? 'Editar Tutor' : 'Novo Tutor'}
      />
    </Container>
  );
};

export default ListaTutoresComBusca;
