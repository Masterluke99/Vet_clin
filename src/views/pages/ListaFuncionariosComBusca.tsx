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
  useDisclosure,
  Badge
} from '@chakra-ui/react';
import { Funcionario } from '../../models/types/FuncionarioTypes';
import { useFuncionario } from '../../controllers/hooks/useFuncionario';
import FuncionarioModal from '../components/modals/FuncionarioModal';
import { FuncionarioStyles } from '../../styles/themeStyles';

interface Props {
  onSelect?: (funcionario: Funcionario) => void;
  onAddNew?: () => void;
}

const ListaFuncionariosComBusca: React.FC<Props> = ({ onSelect }) => {
  // Hook para gerenciar estado e lógica
  const { funcionarios, loading, addFuncionario, updateFuncionario, deleteFuncionario } = useFuncionario();
  
  // Estados locais (UI-specific)
  const [busca, setBusca] = useState('');
  const [foco, setFoco] = useState(false);
  const [selecionado, setSelecionado] = useState<Funcionario | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState<Funcionario | null>(null);
  
  // Modais
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    // Importação dos estilos centralizados
  const { bgColor, headerBgColor, buttonColorScheme, borderColor, successColor, errorColor } = FuncionarioStyles;

  // Filtragem de funcionários
  const funcionariosFiltrados = busca
    ? funcionarios.filter(f => f.nome.toLowerCase().includes(busca.toLowerCase()) || 
                               f.cargo.toLowerCase().includes(busca.toLowerCase()))
    : funcionarios;

  // Handlers
  const handleSelect = (funcionario: Funcionario) => {
    setSelecionado(funcionario);
    setBusca(funcionario.nome);
    setFoco(false);
    if (onSelect) onSelect(funcionario);
  };
  
  const handleEdit = (funcionario: Funcionario) => {
    setFuncionarioEmEdicao(funcionario);
    onEditOpen();
  };
  
  const handleSaveNew = async (funcionarioData: Omit<Funcionario, 'id'>) => {
    const success = await addFuncionario(funcionarioData);
    if (success) {
      setMensagem('Funcionário cadastrado com sucesso!');
      onAddClose();
      return true;
    } else {
      setMensagem('Erro ao cadastrar funcionário.');
      return false;
    }
  };
  
  const handleSaveEdit = async (funcionarioData: Omit<Funcionario, 'id'>) => {
    if (!funcionarioEmEdicao) return false;
    const success = await updateFuncionario(funcionarioEmEdicao.id, funcionarioData);
    if (success) {
      setMensagem('Funcionário atualizado com sucesso!');
      onEditClose();
      return true;
    } else {
      setMensagem('Erro ao atualizar funcionário.');
      return false;
    }
  };
  
  const handleDelete = async (id: string) => {
    return await deleteFuncionario(id);
  };

  return (
    <Container maxW="800px" mx="auto" mt="40px" p="6" bg={bgColor} borderRadius="lg" shadow="xl" boxShadow="0 5px 20px rgba(0,0,0,0.1)" position="relative">
      <Flex mb={4} align="center">
        <Input
          placeholder="Buscar funcionário..."
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
      {foco && busca && funcionariosFiltrados.length > 0 && (
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
            {funcionariosFiltrados.map(funcionario => (
              <ListItem
                key={funcionario.id}
                onClick={() => handleSelect(funcionario)}
                cursor="pointer"
                bg={selecionado?.id === funcionario.id ? headerBgColor : 'white'}
                p={2}
                _hover={{ bg: 'green.50' }}
              >
                <Text>{funcionario.nome} - {funcionario.cargo}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {/* Tabela de funcionários */}
      <Box mt={6} overflowX="auto">
        <Heading size="md" color="green.700" mb={2}>Funcionários</Heading>
        <Table variant="simple" bg="white" borderRadius="md" overflow="hidden">
          <Thead bg={headerBgColor}>
            <Tr>
              <Th>Nome</Th>
              <Th>Cargo</Th>
              <Th>Contato</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {funcionariosFiltrados.map(funcionario => (
              <Tr key={funcionario.id}>
                <Td>{funcionario.nome}</Td>
                <Td>{funcionario.cargo}</Td>
                <Td>
                  {funcionario.email && <Text fontSize="sm">{funcionario.email}</Text>}
                  {funcionario.telefone && <Text fontSize="sm">{funcionario.telefone}</Text>}
                </Td>
                <Td>
                  <Badge colorScheme={funcionario.ativo !== false ? 'green' : 'red'}>
                    {funcionario.ativo !== false ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleEdit(funcionario)}
                  >
                    Editar
                  </Button>
                </Td>
              </Tr>
            ))}
            {funcionariosFiltrados.length === 0 && (
              <Tr>
                <Td colSpan={5} textAlign="center" py={4}>
                  Nenhum funcionário encontrado.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      
      {/* Modal para adicionar novo funcionário */}
      <FuncionarioModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSave={handleSaveNew}
        isLoading={loading}
        successColor={successColor}
        errorColor={errorColor}
        buttonColorScheme={buttonColorScheme}
        mensagem={mensagem}
      />
      
      {/* Modal para editar funcionário existente */}
      <FuncionarioModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        funcionario={funcionarioEmEdicao || undefined}
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

export default ListaFuncionariosComBusca;
