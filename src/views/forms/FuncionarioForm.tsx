import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  FormErrorMessage,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { FuncionarioFormValues } from '../../models/types/FuncionarioTypes';
import { Funcionario } from '../../models/types/FuncionarioTypes';


interface FuncionarioFormProps {
  initialValues?: Funcionario;
  onSubmit: (data: FuncionarioFormValues) => void;
  isSubmitting?: boolean;
}

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FuncionarioFormValues>({
    defaultValues: initialValues ? {
      nome: initialValues.nome,
      cargo: initialValues.cargo,
      email: initialValues.email || '',
      telefone: initialValues.telefone || '',
      cpf: initialValues.cpf || '',
      dataContratacao: initialValues.dataContratacao ? new Date(initialValues.dataContratacao) : undefined,
      salario: initialValues.salario || 0,
      ativo: initialValues.ativo !== false
    } : {
      nome: '',
      cargo: '',
      email: '',
      telefone: '',
      cpf: '',
      dataContratacao: undefined,
      salario: 0,
      ativo: true
    },
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={4} align="flex-start">
        <FormControl isInvalid={!!errors.nome} isRequired>
          <FormLabel htmlFor="nome">Nome do Funcionário</FormLabel>
          <Input
            id="nome"
            {...register('nome', { required: 'Nome é obrigatório' })}
            placeholder="Nome completo"
          />
          <FormErrorMessage>{errors.nome?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.cargo} isRequired>
          <FormLabel htmlFor="cargo">Cargo</FormLabel>
          <Input
            id="cargo"
            {...register('cargo', { required: 'Cargo é obrigatório' })}
            placeholder="Cargo do funcionário"
          />
          <FormErrorMessage>{errors.cargo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">E-mail</FormLabel>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                message: 'E-mail inválido' 
              }
            })}
            placeholder="email@exemplo.com"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.telefone}>
          <FormLabel htmlFor="telefone">Telefone</FormLabel>
          <Input
            id="telefone"
            {...register('telefone')}
            placeholder="(00) 90000-0000"
          />
          <FormErrorMessage>{errors.telefone?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.cpf}>
          <FormLabel htmlFor="cpf">CPF</FormLabel>
          <Input
            id="cpf"
            {...register('cpf')}
            placeholder="000.000.000-00"
          />
          <FormErrorMessage>{errors.cpf?.message}</FormErrorMessage>
        </FormControl>        <FormControl isInvalid={!!errors.dataContratacao}>
          <FormLabel htmlFor="dataContratacao">Data de Contratação</FormLabel>
          <Controller
            name="dataContratacao"
            control={control}
            render={({ field }) => (              <Input
                id="dataContratacao"
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
          <FormErrorMessage>{errors.dataContratacao?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.salario}>
          <FormLabel htmlFor="salario">Salário</FormLabel>
          <Controller
            name="salario"
            control={control}
            render={({ field }: { field: any }) => (
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.500">
                  R$
                </InputLeftElement>                <NumberInput 
                  {...field} 
                  min={0} 
                  precision={2} 
                  step={100} 
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
          <FormErrorMessage>{errors.salario?.message}</FormErrorMessage>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="ativo" mb="0">
            Ativo
          </FormLabel>
          <Controller
            name="ativo"
            control={control}
            render={({ field }: { field: any }) => (
              <Switch 
                id="ativo" 
                isChecked={field.value} 
                onChange={(e) => field.onChange(e.target.checked)} 
                colorScheme="green" 
              />
            )}
          />
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="green" 
          width="full" 
          isLoading={isSubmitting}
        >
          {initialValues ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </VStack>
    </Box>
  );
};

export default FuncionarioForm;
