import React, { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  InputGroup,
  InputLeftElement,
  Badge,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Card,
  CardBody,
  Divider,
  Heading,
  IconButton
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { useVenda } from '../../controllers/hooks/useVenda';
import { ItemVenda, Venda } from '../../models/types/VendaTypes';

// Funções utilitárias
const formatCurrency = (value: number | undefined | null | string): string => {
  if (value === undefined || value === null) return "0,00";
  const numValue = typeof value === "number" ? value : Number(value);
  if (isNaN(numValue)) return "0,00";
  return numValue.toFixed(2).replace(".", ",");
};

const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

const PdvPage: React.FC = () => {
  const { produtos, tutores, funcionarios, addVenda, loading } = useVenda();
  const toast = useToast();
  const [localLoading, setLocalLoading] = useState(false);

  // Estados do PDV
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [tutorId, setTutorId] = useState<string>('');
  const [funcionarioId, setFuncionarioId] = useState<string>('');
  const [desconto, setDesconto] = useState<number>(0);
  const [formaPagamento, setFormaPagamento] = useState<string>('dinheiro');
  const [filtro, setFiltro] = useState<string>('');

  // Cálculo de valores
  const valorTotal = itens.reduce((total, item) => total + parseNumber(item.subtotal), 0);
  const valorFinal = Math.max(0, valorTotal - parseNumber(desconto));

  // Produtos filtrados pela busca
  const produtosFiltrados = React.useMemo(() => {
    if (!filtro.trim()) return produtos;
    const termoLower = filtro.toLowerCase();
    return produtos.filter(
      p => p.nome.toLowerCase().includes(termoLower) || 
           p.id.toLowerCase().includes(termoLower)
    );
  }, [produtos, filtro]);
  // Adicionar item à venda
  const adicionarItem = (produtoId?: string) => {
    const idToUse = produtoId || produtoSelecionado;
    if (!idToUse) {
      toast({
        title: "Atenção",
        description: "Selecione um produto para adicionar",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    const produtoObj = produtos.find(p => p.id === idToUse);
    if (!produtoObj) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    // Verificar estoque
    if (!produtoObj.estoque || produtoObj.estoque < quantidade) {
      toast({
        title: "Estoque insuficiente",
        description: `Restam apenas ${produtoObj.estoque || 0} unidades de ${produtoObj.nome}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    // Verificar se o produto já está no carrinho
    const itemExistente = itens.findIndex(item => item.produtoId === idToUse);
    if (itemExistente !== -1) {
      // Atualizar quantidade do item existente
      alterarQuantidade(itemExistente, itens[itemExistente].quantidade + quantidade);
      setProdutoSelecionado('');
      setQuantidade(1);
      return;
    }
    
    const precoUnitario = typeof produtoObj.preco === 'number' ? 
      produtoObj.preco : Number(produtoObj.preco || 0);
    const subtotal = precoUnitario * quantidade;
    
    const novoItem: ItemVenda = {
      id: `temp-${Date.now()}`,
      produtoId: idToUse,
      produto: produtoObj,
      quantidade,
      precoUnitario,
      subtotal
    };
    
    setItens([...itens, novoItem]);
    setProdutoSelecionado('');
    setQuantidade(1);
  };
  
  // Remover item da venda
  const removerItem = (index: number) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setItens(novosItens);
  };
    // Alterar quantidade de um item
  const alterarQuantidade = (index: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) return;
    
    const novosItens = [...itens];
    const item = novosItens[index];
    
    // Verificar estoque disponível
    const estoqueDisponivel = item.produto?.estoque || 0;
    if (novaQuantidade > estoqueDisponivel) {
      toast({
        title: "Estoque insuficiente",
        description: `Disponível: ${estoqueDisponivel} un. de ${item.produto?.nome}`,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      // Ajustar para o máximo disponível
      item.quantidade = estoqueDisponivel;
    } else {
      item.quantidade = novaQuantidade;
    }
    
    item.subtotal = item.precoUnitario * item.quantidade;
    setItens(novosItens);
  };
    // Finalizar venda
  const finalizarVenda = async () => {
    if (itens.length === 0) {
      toast({
        title: "Atenção",
        description: "Adicione pelo menos um produto à venda",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    // Validar forma de pagamento com tipo apropriado
    const tipoPagamento = formaPagamento as 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'transferencia';
    
    const vendaData: Omit<Venda, 'id'> = {
      itens,
      tutorId: tutorId || undefined,
      funcionarioId: funcionarioId || undefined,
      data: new Date(),
      valorTotal,
      desconto,
      valorFinal,
      formaPagamento: tipoPagamento,
      status: 'concluida',
      observacoes: ''  // Campo obrigatório vazio
    };
    
    setLocalLoading(true); // Feedback visual durante processamento
    try {
      const success = await addVenda(vendaData);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Venda registrada com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        // Limpar o PDV
        setItens([]);
        setTutorId('');
        setFuncionarioId('');
        setDesconto(0);
        setFormaPagamento('dinheiro');
      } else {
        // Tratar caso em que addVenda retorna false
        toast({
          title: "Erro",
          description: "Não foi possível registrar a venda. Tente novamente.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error: any) {
      console.error("Erro ao finalizar venda:", error);
      toast({
        title: "Erro",
        description: error?.message || "Ocorreu um erro ao finalizar a venda",
        status: "error", 
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLocalLoading(false); // Garantir que o loading é finalizado
    }
  };
  
  // Limpar PDV
  const limparPdv = () => {
    setItens([]);
    setTutorId('');
    setFuncionarioId('');
    setDesconto(0);
    setFormaPagamento('dinheiro');
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={4}>
        PDV - Ponto de Venda
      </Heading>
      
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {/* Coluna da Esquerda - Produtos */}
        <GridItem colSpan={{ base: 12, md: 4 }}>
          <Card>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Text fontSize="lg" fontWeight="bold">Produtos</Text>
                
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar produtos..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                </InputGroup>
                
                <Box maxH="400px" overflowY="auto" borderWidth="1px" borderRadius="md">
                  {produtosFiltrados.length === 0 ? (
                    <Text p={3} color="gray.500" textAlign="center">
                      Nenhum produto encontrado
                    </Text>
                  ) : (
                    produtosFiltrados.map(produto => (
                      <Flex
                        key={produto.id}
                        p={2}
                        borderBottomWidth="1px"
                        justifyContent="space-between"
                        alignItems="center"
                        transition="background 0.2s"
                        _hover={{ bg: "gray.50" }}
                        cursor="pointer"
                        onClick={() => {
                          setProdutoSelecionado(produto.id);
                          setQuantidade(1);
                          adicionarItem(produto.id);
                        }}
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">{produto.nome}</Text>
                          <Text fontSize="sm">Estoque: {produto.estoque}</Text>
                        </VStack>
                        <Flex direction="column" align="end">
                          <Text color="green.600" fontWeight="bold">
                            R$ {formatCurrency(produto.preco)}
                          </Text>
                          {produto.estoque <= 5 && (
                            <Badge colorScheme="red" fontSize="xs">
                              Estoque baixo
                            </Badge>
                          )}
                        </Flex>
                      </Flex>
                    ))
                  )}
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
        
        {/* Coluna Central - Carrinho */}
        <GridItem colSpan={{ base: 12, md: 5 }}>
          <Card>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Text fontSize="lg" fontWeight="bold">Itens da Venda</Text>
                
                <Box maxH="400px" overflowY="auto" borderWidth="1px" borderRadius="md">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Produto</Th>
                        <Th isNumeric>Preço</Th>
                        <Th isNumeric>Qtd</Th>
                        <Th isNumeric>Subtotal</Th>
                        <Th width="50px"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {itens.length === 0 ? (
                        <Tr>
                          <Td colSpan={5} textAlign="center" py={4}>
                            Nenhum item adicionado
                          </Td>
                        </Tr>
                      ) : (
                        itens.map((item, index) => (
                          <Tr key={item.id}>
                            <Td>{item.produto?.nome}</Td>
                            <Td isNumeric>R$ {formatCurrency(item.precoUnitario)}</Td>
                            <Td isNumeric>
                              <NumberInput
                                size="xs"
                                min={1}
                                max={item.produto?.estoque || 999}
                                value={item.quantidade}
                                onChange={(_, val) => alterarQuantidade(index, val)}
                              >
                                <NumberInputField width="60px" textAlign="center" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </Td>
                            <Td isNumeric>R$ {formatCurrency(item.subtotal)}</Td>
                            <Td>
                              <IconButton
                                aria-label="Remover item"
                                icon={<CloseIcon />}
                                size="xs"
                                colorScheme="red"
                                onClick={() => removerItem(index)}
                              />
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
        
        {/* Coluna da Direita - Pagamento */}
        <GridItem colSpan={{ base: 12, md: 3 }}>
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">Pagamento</Text>
                
                <VStack spacing={3} align="stretch">
                  <Box>
                    <Text fontSize="sm">Cliente (opcional)</Text>
                    <Select
                      placeholder="Selecione um cliente"
                      value={tutorId}
                      onChange={(e) => setTutorId(e.target.value)}
                    >
                      {tutores.map(tutor => (
                        <option key={tutor.id} value={tutor.id}>
                          {tutor.nome}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm">Atendente (opcional)</Text>
                    <Select
                      placeholder="Selecione um atendente"
                      value={funcionarioId}
                      onChange={(e) => setFuncionarioId(e.target.value)}
                    >
                      {funcionarios.map(funcionario => (
                        <option key={funcionario.id} value={funcionario.id}>
                          {funcionario.nome}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm">Forma de Pagamento</Text>
                    <Select
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                    >
                      <option value="dinheiro">Dinheiro</option>
                      <option value="cartao_credito">Cartão de Crédito</option>
                      <option value="cartao_debito">Cartão de Débito</option>
                      <option value="pix">PIX</option>
                      <option value="transferencia">Transferência</option>
                    </Select>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm">Desconto</Text>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        R$
                      </InputLeftElement>
                      <NumberInput
                        value={desconto}
                        onChange={(_, val) => setDesconto(val)}
                        min={0}
                        max={valorTotal}
                        precision={2}
                        step={5}
                        width="100%"
                      >
                        <NumberInputField pl={8} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </InputGroup>
                  </Box>
                </VStack>
                
                <Divider />
                
                <VStack spacing={1} align="stretch">
                  <Flex justify="space-between">
                    <Text>Valor Total:</Text>
                    <Text fontWeight="bold">R$ {formatCurrency(valorTotal)}</Text>
                  </Flex>
                  
                  <Flex justify="space-between">
                    <Text>Desconto:</Text>
                    <Text>R$ {formatCurrency(desconto)}</Text>
                  </Flex>
                  
                  <Flex justify="space-between">
                    <Text fontWeight="bold">TOTAL A PAGAR:</Text>
                    <Text fontSize="xl" fontWeight="bold" color="green.600">
                      R$ {formatCurrency(valorFinal)}
                    </Text>
                  </Flex>
                </VStack>
                
                <VStack spacing={2}>
                  <Button
                    colorScheme="green"
                    size="lg"
                    width="100%"
                    isLoading={loading || localLoading}
                    onClick={finalizarVenda}
                  >
                    Finalizar Venda
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    width="100%"
                    onClick={limparPdv}
                  >
                    Limpar
                  </Button>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PdvPage;
