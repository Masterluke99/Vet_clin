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
  Badge,
  useToast,
  useDisclosure
} from '@chakra-ui/react';
import { Produto } from '../../models/types/ProdutoTypes';
import { useProduto } from '../../controllers/hooks/useProduto';
import ProdutoModal from '../components/modals/ProdutoModal';
import { ProdutoStyles } from '../../styles/themeStyles';

interface Props {
  onSelect?: (produto: Produto) => void;
  onAddNew?: () => void;
}

const ListaProdutosComBusca: React.FC<Props> = ({ onSelect, onAddNew }) => {  // Hook para gerenciar estado e lógica
  const { produtos, loading, error, addProduto, updateProduto, deleteProduto } = useProduto();
  
  // Estados locais (UI-specific)
  const [busca, setBusca] = useState('');
  const [foco, setFoco] = useState(false);
  const [selecionado, setSelecionado] = useState<Produto | null>(null);
  
  const toast = useToast();  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingProduto, setEditingProduto] = useState<Produto | undefined>(undefined);
  
  // Importação dos estilos centralizados
  const { bgColor, headerBgColor, buttonColorScheme, borderColor } = ProdutoStyles;

  // Filtragem local dos produtos
  const produtosFiltrados = busca
    ? produtos.filter(p => 
        p.nome.toLowerCase().includes(busca.toLowerCase()) || 
        p.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(busca.toLowerCase())
      )
    : produtos;

  const handleSelect = (produto: Produto) => {
    setSelecionado(produto);
    setBusca(produto.nome);
    setFoco(false);
    if (onSelect) onSelect(produto);
  };

  const handleAddClick = () => {
    setEditingProduto(undefined);
    onOpen();
  };

  const handleEditClick = (produto: Produto) => {
    setEditingProduto(produto);
    onOpen();
  };

  const handleSaveProduto = async (produtoData: any) => {
    try {
      if (editingProduto) {
        await updateProduto(editingProduto.id, produtoData);
        toast({
          title: 'Produto atualizado',
          description: 'O produto foi atualizado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addProduto(produtoData);
        toast({
          title: 'Produto cadastrado',
          description: 'O produto foi cadastrado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o produto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteProduto = async (id: string) => {
    try {
      await deleteProduto(id);
      toast({
        title: 'Produto removido',
        description: 'O produto foi removido com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao remover o produto',
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

  return (
    <Container maxW="800px" mx="auto" mt="40px" p="6" bg={bgColor} borderRadius="lg" shadow="xl" boxShadow="0 5px 20px rgba(0,0,0,0.1)" position="relative">
      <Heading size="lg" mb="4" color="blue.700">Produtos</Heading>
      
      <Flex mb={4} align="center">
        <Input
          placeholder="Buscar produto por nome, descrição ou categoria..."
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
      
      {foco && busca && produtosFiltrados.length > 0 && (
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
            {produtosFiltrados.map(produto => (
              <ListItem
                key={produto.id}
                onClick={() => handleSelect(produto)}
                cursor="pointer"
                bg={selecionado?.id === produto.id ? headerBgColor : 'white'}
                p={2}
                _hover={{ bg: 'blue.50' }}
              >
                <Text>{produto.nome} - {formatPreco(produto.preco)}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {loading ? (
        <Text>Carregando produtos...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : produtosFiltrados.length === 0 ? (
        <Text>Nenhum produto encontrado.</Text>
      ) : (
        <Table variant="simple" bg="white" shadow="sm" borderRadius="md" mt={4}>
          <Thead bg={headerBgColor}>
            <Tr>
              <Th>Nome</Th>
              <Th>Preço</Th>
              <Th>Estoque</Th>
              <Th>Categoria</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {produtosFiltrados.map(produto => (
              <Tr key={produto.id}>
                <Td>
                  <Text fontWeight="bold">{produto.nome}</Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>{produto.descricao}</Text>
                </Td>
                <Td>{formatPreco(produto.preco)}</Td>
                <Td>
                  <Badge colorScheme={produto.estoque > 10 ? 'green' : produto.estoque > 0 ? 'yellow' : 'red'}>
                    {produto.estoque} {produto.estoque === 1 ? 'unidade' : 'unidades'}
                  </Badge>
                </Td>
                <Td>{produto.categoria || 'Não categorizado'}</Td>
                <Td>
                  <Flex>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      mr={2}
                      onClick={() => handleEditClick(produto)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteProduto(produto.id)}
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
      
      <ProdutoModal 
        isOpen={isOpen} 
        onClose={onClose}
        produto={editingProduto}
        onSave={handleSaveProduto}
        title={editingProduto ? 'Editar Produto' : 'Novo Produto'}
      />
    </Container>
  );
};

export default ListaProdutosComBusca;
