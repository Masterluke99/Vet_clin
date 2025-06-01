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
import { ServicoFormValues } from '../../models/types/ServicoTypes';
import { Servico } from '../../models/types/ServicoTypes';


interface ServicoFormProps {
  initialValues?: Servico;
  onSubmit: (data: ServicoFormValues) => void;
  isSubmitting?: boolean;
}

const ServicoForm: React.FC<ServicoFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServicoFormValues>({
    defaultValues: initialValues ? {
      nome: initialValues.nome,
      descricao: initialValues.descricao,
      preco: initialValues.preco,
      duracao: initialValues.duracao,
      categoria: initialValues.categoria
    } : {
      preco: 0,
      duracao: 30
    },
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={4} align="flex-start">
        <FormControl isInvalid={!!errors.nome} isRequired>
          <FormLabel htmlFor="nome">Nome do Serviço</FormLabel>
          <Input
            id="nome"
            {...register('nome', { required: 'Nome do serviço é obrigatório' })}
            placeholder="Nome do serviço"
          />
          <FormErrorMessage>{errors.nome?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.descricao}>
          <FormLabel htmlFor="descricao">Descrição</FormLabel>
          <Textarea
            id="descricao"
            {...register('descricao')}
            placeholder="Descrição detalhada do serviço"
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

        <FormControl isInvalid={!!errors.duracao}>
          <FormLabel htmlFor="duracao">Duração (minutos)</FormLabel>          <Controller
            name="duracao"
            control={control}
            rules={{ min: { value: 0, message: 'Duração não pode ser negativa' } }}
            render={({ field }: { field: any }) => (
              <NumberInput {...field} min={0} step={5} w="100%">
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <FormErrorMessage>{errors.duracao?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.categoria}>
          <FormLabel htmlFor="categoria">Categoria</FormLabel>
          <Input
            id="categoria"
            {...register('categoria')}
            placeholder="Categoria do serviço"
          />
          <FormErrorMessage>{errors.categoria?.message}</FormErrorMessage>
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

export default ServicoForm;
