import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { TutorFormValues } from '../../models/types/TutorTypes';
import { Tutor } from '../../models/types/TutorTypes';

interface TutorFormProps {
  initialValues?: Tutor;
  onSubmit: (data: TutorFormValues) => void;
  isSubmitting?: boolean;
}

const TutorForm: React.FC<TutorFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TutorFormValues>({
    defaultValues: initialValues ? {
      nome: initialValues.nome,
      cpf: initialValues.cpf,
      telefone: initialValues.telefone,
      email: initialValues.email,
      endereco: initialValues.endereco,
    } : undefined,
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={4} align="flex-start">
        <FormControl isInvalid={!!errors.nome} isRequired>
          <FormLabel htmlFor="nome">Nome</FormLabel>
          <Input
            id="nome"
            {...register('nome', { required: 'Nome é obrigatório' })}
            placeholder="Nome completo"
          />
          <FormErrorMessage>{errors.nome?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.cpf} isRequired>
          <FormLabel htmlFor="cpf">CPF</FormLabel>
          <Input
            id="cpf"
            {...register('cpf', { 
              required: 'CPF é obrigatório',
              pattern: {
                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                message: 'CPF inválido. Use o formato: 123.456.789-00'
              }
            })}
            placeholder="123.456.789-00"
          />
          <FormErrorMessage>{errors.cpf?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.telefone} isRequired>
          <FormLabel htmlFor="telefone">Telefone</FormLabel>
          <Input
            id="telefone"
            {...register('telefone', { 
              required: 'Telefone é obrigatório',
              pattern: {
                value: /^\(\d{2}\) \d{5}-\d{4}$/,
                message: 'Telefone inválido. Use o formato: (99) 99999-9999'
              }
            })}
            placeholder="(99) 99999-9999"
          />
          <FormErrorMessage>{errors.telefone?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">E-mail</FormLabel>
          <Input
            id="email"
            type="email"
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'E-mail inválido'
              }
            })}
            placeholder="email@exemplo.com"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.endereco}>
          <FormLabel htmlFor="endereco">Endereço</FormLabel>
          <Input
            id="endereco"
            {...register('endereco')}
            placeholder="Endereço completo"
          />
          <FormErrorMessage>{errors.endereco?.message}</FormErrorMessage>
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

export default TutorForm;
