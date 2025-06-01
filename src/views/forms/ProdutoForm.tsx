import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { ProdutoFormValues } from '../../models/types/ProdutoTypes';
import { Produto } from '../../models/types/ProdutoTypes';

// Funções utilitárias locais

interface ProdutoFormProps {
  initialValues?: Produto;
  onSubmit: (data: ProdutoFormValues) => void;
  isSubmitting?: boolean;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
}) => {  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProdutoFormValues>({
    defaultValues: initialValues ? {
      nome: initialValues.nome,
      descricao: initialValues.descricao || '',
      preco: initialValues.preco || 0,
      estoque: initialValues.estoque || 0,
      categoria: initialValues.categoria || '',
      fornecedor: initialValues.fornecedor || '',
      codigoBarras: initialValues.codigoBarras || ''
    } : {
      nome: '',
      descricao: '',
      preco: 0,
      estoque: 0,
      categoria: '',
      fornecedor: '',
      codigoBarras: ''
    },
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={4} align="flex-start">
        <FormControl isInvalid={!!errors.nome} isRequired>
          <FormLabel htmlFor="nome">Nome do Produto</FormLabel>
          <Input
            id="nome"
            {...register('nome', { required: 'Nome do produto é obrigatório' })}
            placeholder="Nome do produto"
          />
          <FormErrorMessage>{errors.nome?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.descricao}>
          <FormLabel htmlFor="descricao">Descrição</FormLabel>
          <Textarea
            id="descricao"
            {...register('descricao')}
            placeholder="Descrição detalhada do produto"
            rows={3}
          />
          <FormErrorMessage>{errors.descricao?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.preco} isRequired>
          <FormLabel htmlFor="preco">Preço (R$)</FormLabel>          <Controller
            name="preco"
            control={control}
            rules={{ required: 'Preço é obrigatório', min: { value: 0, message: 'Preço não pode ser negativo' } }}
            render={({ field }: { field: any }) => (
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.500">
                  R$
                </InputLeftElement>                <NumberInput 
                  {...field} 
                  min={0} 
                  precision={2} 
                  step={0.01} 
                  w="100%"
                  format={(val) => String(val).replace('.', ',')}
                  parse={(val) => val.replace(',', '.')}
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
          <FormErrorMessage>{errors.preco?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.estoque} isRequired>
          <FormLabel htmlFor="estoque">Quantidade em Estoque</FormLabel>          <Controller
            name="estoque"
            control={control}
            rules={{ required: 'Estoque é obrigatório', min: { value: 0, message: 'Estoque não pode ser negativo' } }}
            render={({ field }: { field: any }) => (
              <NumberInput {...field} min={0} step={1} w="100%">
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <FormErrorMessage>{errors.estoque?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.categoria}>
          <FormLabel htmlFor="categoria">Categoria</FormLabel>
          <Input
            id="categoria"
            {...register('categoria')}
            placeholder="Categoria do produto"
          />
          <FormErrorMessage>{errors.categoria?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.fornecedor}>
          <FormLabel htmlFor="fornecedor">Fornecedor</FormLabel>
          <Input
            id="fornecedor"
            {...register('fornecedor')}
            placeholder="Nome do fornecedor"
          />
          <FormErrorMessage>{errors.fornecedor?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.codigoBarras}>
          <FormLabel htmlFor="codigoBarras">Código de Barras</FormLabel>
          <Input
            id="codigoBarras"
            {...register('codigoBarras')}
            placeholder="Código de barras do produto"
          />
          <FormErrorMessage>{errors.codigoBarras?.message}</FormErrorMessage>
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="blue" 
          width="full" 
          isLoading={isSubmitting}
        >
          {initialValues ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </VStack>
    </Box>
  );
};

export default ProdutoForm;
