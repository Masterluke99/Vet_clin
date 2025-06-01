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
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge
} from '@chakra-ui/react';
import { Servico } from '../../models/types/ServicoTypes';
import { useServico } from '../../controllers/hooks/useServico';
import ServicoModal from '../components/modals/ServicoModal';
import { ServicoStyles } from '../../styles/themeStyles';

interface Props {
  onSelect?: (servico: Servico) => void;
  onAddNew?: () => void;
}

const ListaServicosComBusca: React.FC<Props> = ({ onSelect, onAddNew }) => {  // Hook para gerenciar estado e lógica
  const { servicos, loading, error, addServico, updateServico, deleteServico } = useServico();
  
  // Estados locais (UI-specific)
  const [busca, setBusca] = useState('');
  const [foco, setFoco] = useState(false);
  const [selecionado, setSelecionado] = useState<Servico | null>(null);
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingServico, setEditingServico] = useState<Servico | undefined>(undefined);
    // Estado para diálogo de confirmação de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [servicoToDelete, setServicoToDelete] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;  // Importação dos estilos centralizados
  const { bgColor, headerBgColor, buttonColorScheme, borderColor } = ServicoStyles;

  // Filtragem local dos serviços
  const servicosFiltrados = busca
    ? servicos.filter(s => 
        s.nome.toLowerCase().includes(busca.toLowerCase()) || 
        s.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        s.categoria?.toLowerCase().includes(busca.toLowerCase())
      )
    : servicos;

  const handleSelect = (servico: Servico) => {
    setSelecionado(servico);
    setBusca(servico.nome);
    setFoco(false);
    if (onSelect) onSelect(servico);
  };

  const handleAddClick = () => {
    setEditingServico(undefined);
    onOpen();
  };

  const handleEditClick = (servico: Servico) => {
    setEditingServico(servico);
    onOpen();
  };

  const handleDeleteClick = (id: string) => {
    setServicoToDelete(id);
    setIsDeleteDialogOpen(true);
  };  const handleConfirmDelete = async () => {
    if (!servicoToDelete) return;
    try {
      await deleteServico(servicoToDelete);
      toast({
        title: 'Serviço removido',
        description: 'O serviço foi removido com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao remover o serviço',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setServicoToDelete(null);
    }
  };

  const handleSaveServico = async (servicoData: any) => {
    try {
      if (editingServico) {
        await updateServico(editingServico.id, servicoData);
        toast({
          title: 'Serviço atualizado',
          description: 'O serviço foi atualizado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addServico(servicoData);
        toast({
          title: 'Serviço cadastrado',
          description: 'O serviço foi cadastrado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o serviço',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const formatDuracao = (duracao?: number) => {
    if (!duracao) return 'Não definida';
    if (duracao < 60) {
      return `${duracao} min`;
    }
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    if (minutos === 0) {
      return `${horas}h`;
    }
    return `${horas}h${minutos}min`;
  };

  return (
    <Container maxW="800px" mx="auto" mt="40px" p="6" bg={bgColor} borderRadius="lg" shadow="xl" boxShadow="0 5px 20px rgba(0,0,0,0.1)" position="relative">
      <Heading size="lg" mb="4" color="purple.700">Serviços</Heading>
      
      <Flex mb={4} align="center">
        <Input
          placeholder="Buscar serviço por nome, descrição ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
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
      
      {foco && busca && servicosFiltrados.length > 0 && (
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
        >
          <List styleType="none" m={0} p={0}>
            {servicosFiltrados.map(servico => (
              <ListItem
                key={servico.id}
                onClick={() => handleSelect(servico)}
                cursor="pointer"
                bg={selecionado?.id === servico.id ? headerBgColor : 'white'}
                p={2}
                _hover={{ bg: 'purple.50' }}
              >
                <Text>{servico.nome} - {formatPreco(servico.preco)}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {loading ? (
        <Text>Carregando serviços...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : servicosFiltrados.length === 0 ? (
        <Text>Nenhum serviço encontrado.</Text>
      ) : (
        <Table variant="simple" bg="white" shadow="sm" borderRadius="md" mt={4}>
          <Thead bg={headerBgColor}>
            <Tr>
              <Th>Nome</Th>
              <Th>Preço</Th>
              <Th>Duração</Th>
              <Th>Categoria</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {servicosFiltrados.map(servico => (
              <Tr key={servico.id}>
                <Td>
                  <Text fontWeight="bold">{servico.nome}</Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>{servico.descricao}</Text>
                </Td>
                <Td>{formatPreco(servico.preco)}</Td>
                <Td>
                  <Badge colorScheme="purple">
                    {formatDuracao(servico.duracao)}
                  </Badge>
                </Td>
                <Td>{servico.categoria || 'Não categorizado'}</Td>
                <Td>
                  <Flex>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      mr={2}
                      onClick={() => handleEditClick(servico)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteClick(servico.id)}
                    >
                      Excluir
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      
      {/* Modal de adição/edição de serviço */}
      <ServicoModal 
        isOpen={isOpen} 
        onClose={onClose}
        servico={editingServico}
        onSave={handleSaveServico}
        title={editingServico ? 'Editar Serviço' : 'Novo Serviço'}
      />
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Serviço
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir este serviço? Esta ação não poderá ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

// Estado para armazenar o ID do serviço a ser excluído
// (já está declarado dentro do componente)

export default ListaServicosComBusca;

