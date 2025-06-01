import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  FormErrorMessage,
  Select,
  Textarea,
  InputGroup,
  InputLeftElement,
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
  Text,
  Flex,
  HStack
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { Produto } from '../../models/types/ProdutoTypes';
import { Tutor } from '../../models/types/TutorTypes';
import { Funcionario } from '../../models/types/FuncionarioTypes';
import { ItemVenda, Venda } from '../../models/types/VendaTypes';

// Funções utilitárias locais - garantindo que trabalhamos sempre com números
const formatCurrency = (value: number | undefined | null | string): string => {
  if (value === undefined || value === null) return "0,00";
  // Garantir que estamos trabalhando com um número
  const numValue = typeof value === "number" ? value : Number(value);
  // Verificar se é um número válido
  if (isNaN(numValue)) return "0,00";
  // Formatar com duas casas decimais e separador brasileiro
  return numValue.toFixed(2).replace(".", ",");
};

// Função para converter strings para números, com tratamento de erro
const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  // Tentar converter para número
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};


interface VendaFormProps {
  initialValues?: Venda;
  produtos: Produto[];
  tutores: Tutor[];
  funcionarios: Funcionario[];
  onSubmit: (data: Omit<Venda, 'id'>) => void;
  isSubmitting?: boolean;
}

const VendaForm: React.FC<VendaFormProps> = ({
  initialValues,
  produtos,
  tutores,
  funcionarios,
  onSubmit,
  isSubmitting = false,
}) => {
  // Estado para gerenciar os itens da venda
  const [itens, setItens] = useState<ItemVenda[]>(
    initialValues?.itens || []
  );
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(1);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },  } = useForm<Omit<Venda, 'id'>>({    defaultValues: initialValues ? {
      ...initialValues,
      data: (() => {
        try {
          if (initialValues.data instanceof Date) {
            return initialValues.data;
          }
          const date = new Date(initialValues.data);
          return isNaN(date.getTime()) ? new Date() : date;
        } catch (error) {
          return new Date();
        }
      })()
    } : {
      itens: [],
      tutorId: '',
      funcionarioId: '',
      data: new Date(),
      valorTotal: 0,
      desconto: 0,
      valorFinal: 0,
      formaPagamento: 'dinheiro',
      status: 'concluida',
      observacoes: ''
    },
  });
  // Observar o valor do desconto
  const descontoValue = watch('desconto') || 0;
    // Calcular totais usando a função parseNumber para garantir valores numéricos
  const valorTotal = itens.reduce((total, item) => {
    return total + parseNumber(item.subtotal);
  }, 0);
  
  const valorFinal = Math.max(0, valorTotal - parseNumber(descontoValue));
  
  // Atualizar campos calculados com valores numéricos
  useEffect(() => {
    // Arredondar para 2 casas decimais e garantir que são números
    const totalFormatado = Number(valorTotal.toFixed(2));
    const finalFormatado = Number(valorFinal.toFixed(2));
    
    // Atualizar os campos do formulário com valores numéricos, não strings
    setValue('valorTotal', totalFormatado);
    setValue('valorFinal', finalFormatado);
  }, [itens, descontoValue, valorTotal, valorFinal, setValue]);

  // Adicionar item à venda
  const adicionarItem = () => {
    if (!produtoSelecionado) return;
      const produtoObj = produtos.find(p => p.id === produtoSelecionado);
    if (!produtoObj) return;
    
    // Ensure price is a number
    const precoUnitario = typeof produtoObj.preco === 'number' ? produtoObj.preco : Number(produtoObj.preco || 0);
    const subtotal = precoUnitario * quantidade;
    
    const novoItem: ItemVenda = {
      id: `temp-${Date.now()}`, // ID temporário
      produtoId: produtoSelecionado,
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
  
  // Submeter formulário com itens incluídos
  const onSubmitForm = (data: Omit<Venda, 'id'>) => {
    const vendaData = {
      ...data,
      itens,
      valorTotal,
      valorFinal
    };
    onSubmit(vendaData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmitForm)} width="100%">
      <VStack spacing={4} align="flex-start">
        {/* Seção de adicionar itens */}
        <Box border="1px" borderColor="gray.200" p={4} borderRadius="md" width="full">
          <Text fontWeight="bold" mb={3}>Adicionar Itens</Text>
          <HStack spacing={4} mb={3}>
            <FormControl isInvalid={!produtoSelecionado} isRequired flex="3">
              <FormLabel htmlFor="produto">Produto</FormLabel>
              <Select
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
                placeholder="Selecione o produto"
              >                {produtos.map((produto) => (                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - R$ {formatCurrency(produto.preco)} - Estoque: {produto.estoque}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl isRequired flex="1">
              <FormLabel htmlFor="quantidade">Qtd.</FormLabel>
              <NumberInput 
                value={quantidade} 
                onChange={(_, valueAsNumber) => setQuantidade(valueAsNumber)}
                min={1}
                max={produtos.find(p => p.id === produtoSelecionado)?.estoque || 999}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            
            <Button 
              mt={8} 
              colorScheme="green" 
              onClick={adicionarItem}
              isDisabled={!produtoSelecionado}
            >
              Adicionar
            </Button>
          </HStack>
          
          {/* Tabela de itens */}
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  <Th isNumeric>Preço Unit.</Th>
                  <Th isNumeric>Qtd</Th>
                  <Th isNumeric>Subtotal</Th>
                  <Th width="50px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {itens.map((item, index) => (
                  <Tr key={item.id}>                    <Td>{item.produto?.nome}</Td>
                    <Td isNumeric>R$ {formatCurrency(item.precoUnitario)}</Td>
                    <Td isNumeric>{item.quantidade}</Td>
                    <Td isNumeric>R$ {formatCurrency(item.subtotal)}</Td>
                    <Td>
                      <Button 
                        size="xs" 
                        colorScheme="red" 
                        onClick={() => removerItem(index)}
                      >
                        X
                      </Button>
                    </Td>
                  </Tr>
                ))}
                {itens.length === 0 && (
                  <Tr>
                    <Td colSpan={5} textAlign="center">Nenhum item adicionado</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
        
        {/* Detalhes da venda */}
        <FormControl isInvalid={!!errors.tutorId}>
          <FormLabel htmlFor="tutorId">Tutor (Cliente)</FormLabel>
          <Select
            id="tutorId"
            {...register('tutorId')}
            placeholder="Selecione o tutor (opcional)"
          >
            {tutores.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.nome}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.tutorId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.funcionarioId}>
          <FormLabel htmlFor="funcionarioId">Atendente</FormLabel>
          <Select
            id="funcionarioId"
            {...register('funcionarioId')}
            placeholder="Selecione o funcionário (opcional)"
          >
            {funcionarios.map((funcionario) => (
              <option key={funcionario.id} value={funcionario.id}>
                {funcionario.nome} - {funcionario.cargo}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.funcionarioId?.message}</FormErrorMessage>
        </FormControl>        <FormControl isInvalid={!!errors.data} isRequired>
          <FormLabel htmlFor="data">Data</FormLabel>
          <Controller
            name="data"
            control={control}
            rules={{ required: 'Data é obrigatória' }}
            render={({ field }) => (              <Input
                id="data"
                type="date"
                value={(() => {
                  try {
                    if (typeof field.value === 'string') {
                      return field.value;
                    }
                    if (field.value instanceof Date) {
                      return field.value.toISOString().split('T')[0];
                    }
                    const date = field.value ? new Date(field.value) : new Date();
                    if (isNaN(date.getTime())) {
                      return new Date().toISOString().split('T')[0];
                    }
                    return date.toISOString().split('T')[0];
                  } catch (error) {
                    return new Date().toISOString().split('T')[0];
                  }
                })()}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
              />
            )}
          />
          <FormErrorMessage>{errors.data?.message}</FormErrorMessage>
        </FormControl>

        {/* Valores e Totais */}
        <Flex width="full" justifyContent="space-between" flexWrap="wrap" gap={4}>
          <FormControl isInvalid={!!errors.valorTotal} width={{ base: "100%", md: "30%" }}>
            <FormLabel htmlFor="valorTotal">Valor Total</FormLabel>
            <InputGroup>              <InputLeftElement pointerEvents="none" color="gray.500">
                R$
              </InputLeftElement>              <Input 
                value={formatCurrency(valorTotal)}
                readOnly
                pl={8}
              />
            </InputGroup>
            <FormErrorMessage>{errors.valorTotal?.message}</FormErrorMessage>
          </FormControl>          <FormControl isInvalid={!!errors.desconto} width={{ base: "100%", md: "30%" }}>
            <FormLabel htmlFor="desconto">Desconto</FormLabel>
            <Controller
              name="desconto"
              control={control}
              rules={{ 
                min: { value: 0, message: 'Desconto não pode ser negativo' },
                max: { value: valorTotal, message: 'Desconto não pode ser maior que o valor total' },
                validate: value => Number.isFinite(Number(value)) || 'Valor deve ser numérico'
              }}
              render={({ field }) => (
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.500">
                    R$
                  </InputLeftElement>
                  <NumberInput 
                    value={field.value}
                    onChange={(valueAsString, valueAsNumber) => {
                      // Garantir que é um número válido
                      const numValue = isNaN(valueAsNumber) ? 0 : valueAsNumber;
                      // Limitar o desconto ao valor total
                      const descontoFinal = Math.min(numValue, valorTotal);
                      field.onChange(descontoFinal);
                    }}
                    min={0} 
                    max={valorTotal} 
                    precision={2} 
                    step={5} 
                    w="100%"
                  >
                    <NumberInputField pl={8} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
              )}
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              Máximo permitido: R$ {formatCurrency(valorTotal)}
            </Text>
            <FormErrorMessage>{errors.desconto?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.valorFinal} width={{ base: "100%", md: "30%" }}>
            <FormLabel htmlFor="valorFinal">Valor Final</FormLabel>
            <InputGroup>              <InputLeftElement pointerEvents="none" color="gray.500">
                R$
              </InputLeftElement>              <Input 
                value={formatCurrency(valorFinal)}
                readOnly
                pl={8}
              />
            </InputGroup>
            <FormErrorMessage>{errors.valorFinal?.message}</FormErrorMessage>
          </FormControl>
        </Flex>

        <FormControl isInvalid={!!errors.formaPagamento} isRequired>
          <FormLabel htmlFor="formaPagamento">Forma de Pagamento</FormLabel>
          <Select
            id="formaPagamento"
            {...register('formaPagamento', { required: 'Forma de pagamento é obrigatória' })}
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="cartao_debito">Cartão de Débito</option>
            <option value="pix">PIX</option>
            <option value="transferencia">Transferência</option>
          </Select>
          <FormErrorMessage>{errors.formaPagamento?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.status} isRequired>
          <FormLabel htmlFor="status">Status</FormLabel>
          <Select
            id="status"
            {...register('status', { required: 'Status é obrigatório' })}
          >
            <option value="concluida">Concluída</option>
            <option value="pendente">Pendente</option>
            <option value="cancelada">Cancelada</option>
          </Select>
          <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.observacoes}>
          <FormLabel htmlFor="observacoes">Observações</FormLabel>
          <Textarea
            id="observacoes"
            {...register('observacoes')}
            placeholder="Observações sobre a venda"
            rows={3}
          />
          <FormErrorMessage>{errors.observacoes?.message}</FormErrorMessage>
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="green" 
          width="full" 
          isLoading={isSubmitting}
          isDisabled={itens.length === 0}
        >
          {initialValues ? 'Atualizar Venda' : 'Finalizar Venda'}
        </Button>
      </VStack>
    </Box>
  );
};

export default VendaForm;
