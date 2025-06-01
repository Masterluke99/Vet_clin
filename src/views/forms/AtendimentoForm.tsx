import React, { useEffect, useState, useCallback } from 'react';
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
  Checkbox,
  CheckboxGroup,
  Stack,
  Text
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { AtendimentoFormValues } from '../../models/types/AtendimentoTypes';
import { Atendimento } from '../../models/types/AtendimentoTypes';
import { Animal } from '../../models/types/AnimalTypes';
import { Servico } from '../../models/types/ServicoTypes';
import { Funcionario } from '../../models/types/FuncionarioTypes';

// Funções utilitárias locais - Convertendo para usar number em vez de string
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "0,00";
  const numValue = typeof value === "number" ? value : Number(value);
  return numValue.toFixed(2).replace(".", ",");
};


interface AtendimentoFormProps {
  initialValues?: Atendimento;
  animais: Animal[];
  servicos: Servico[];
  funcionarios: Funcionario[];
  onSubmit: (data: AtendimentoFormValues) => void;
  isSubmitting?: boolean;
}

const AtendimentoForm: React.FC<AtendimentoFormProps> = ({
  initialValues,
  animais,
  servicos,
  funcionarios,
  onSubmit,
  isSubmitting = false,
}) => {
  // Estado para controlar os serviços selecionados
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialValues?.servicosIds || (initialValues?.servicoId ? [initialValues.servicoId] : [])
  );
  
  // Valor total calculado automaticamente - usando number para evitar problemas de formatação
  const [calculatedTotal, setCalculatedTotal] = useState<number>(
    initialValues?.valorTotal ? Number(initialValues.valorTotal) : 0
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },  
  } = useForm<AtendimentoFormValues>({    
    defaultValues: initialValues ? {
      animalId: initialValues.animalId,
      tutorId: initialValues.tutorId,
      servicoId: initialValues.servicoId || '',
      servicosIds: initialValues.servicosIds || (initialValues.servicoId ? [initialValues.servicoId] : []),
      funcionarioId: initialValues.funcionarioId || '',
      data: (() => {
        try {
          if (initialValues.data instanceof Date) {
            return initialValues.data.toISOString().split('T')[0];
          }
          // Garantir que temos uma data válida
          const date = initialValues.data ? new Date(initialValues.data) : new Date();
          if (isNaN(date.getTime())) {
            return new Date().toISOString().split('T')[0]; // Fallback para hoje se a data for inválida
          }
          return date.toISOString().split('T')[0];
        } catch (error) {
          return new Date().toISOString().split('T')[0]; // Em caso de erro, use a data atual
        }
      })(),
      hora: initialValues.hora,
      observacoes: initialValues.observacoes || '',
      valorTotal: Number(initialValues.valorTotal) || 0, // Garantir que é número
      status: initialValues.status,
      formaPagamento: initialValues.formaPagamento || 'dinheiro'
    } : {
      animalId: '',
      tutorId: '',
      servicoId: '',
      servicosIds: [],
      funcionarioId: '',
      data: new Date().toISOString().split('T')[0],
      hora: '10:00',
      observacoes: '',
      valorTotal: 0,
      status: 'agendado',
      formaPagamento: 'dinheiro'
    },
  });
  
  // Função simplificada para calcular o valor total com base nos serviços selecionados
  const calcularValorTotal = useCallback(() => {
    // Faz soma direta dos valores dos serviços selecionados
    const total = selectedServices.reduce((acc, servicoId) => {
      const servico = servicos.find(s => s.id === servicoId);
      // Garantir que estamos somando números, não strings
      const valorServico = servico ? Number(servico.preco) : 0;
      return acc + valorServico;
    }, 0);
    
    // Arredondar para 2 casas decimais e garantir que é um número
    const valorFinal = Number(total.toFixed(2));
    
    // Atualizar os estados e o formulário
    setCalculatedTotal(valorFinal);
    setValue('valorTotal', valorFinal);
    
    return valorFinal;
  }, [selectedServices, servicos, setValue]);
  
  // Recalcular o total sempre que os serviços selecionados mudarem
  useEffect(() => {
    calcularValorTotal();
  }, [selectedServices, calcularValorTotal]);
  
  // Função para gerenciar a seleção dos serviços
  const handleServiceSelection = (servicoId: string) => {
    let newSelectedServices;
    
    if (selectedServices.includes(servicoId)) {
      newSelectedServices = selectedServices.filter(id => id !== servicoId);
    } else {
      newSelectedServices = [...selectedServices, servicoId];
    }
    
    setSelectedServices(newSelectedServices);
    setValue('servicosIds', newSelectedServices);
    
    // Manter compatibilidade com código existente
    if (newSelectedServices.length > 0) {
      setValue('servicoId', newSelectedServices[0]);
    } else {
      setValue('servicoId', '');
    }
  };
  
  // Função personalizada para validar antes de enviar
  const onFormSubmit = (data: AtendimentoFormValues) => {
    // Verificar se pelo menos um serviço foi selecionado
    if (selectedServices.length === 0) {
      return;
    }
    
    // Garantir que os servicosIds estão atualizados e valorTotal é um número
    const updatedData = {
      ...data,
      servicosIds: selectedServices,
      servicoId: selectedServices.length > 0 ? selectedServices[0] : '', // Para compatibilidade
      valorTotal: Number(data.valorTotal) // Garantir que é número
    };
    
    onSubmit(updatedData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onFormSubmit)} width="100%">
      <VStack spacing={4} align="flex-start">
        <FormControl isInvalid={!!errors.animalId} isRequired>
          <FormLabel htmlFor="animalId">Animal</FormLabel>
          <Select
            id="animalId"
            {...register('animalId', { required: 'Animal é obrigatório' })}
            placeholder="Selecione o animal"
          >
            {animais.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.nome} {animal.especie ? `(${animal.especie})` : ''}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.animalId?.message}</FormErrorMessage>
        </FormControl>        <FormControl isInvalid={!!errors.servicosIds} isRequired>
          <FormLabel>Serviços</FormLabel>
          <Box p={3} borderWidth="1px" borderRadius="md">
            <Stack spacing={2}>
              {servicos.map((servico) => (
                <Checkbox
                  key={servico.id}
                  isChecked={selectedServices.includes(servico.id)}
                  onChange={() => handleServiceSelection(servico.id)}
                >
                  {servico.nome} - R$ {formatCurrency(servico.preco)}
                </Checkbox>
              ))}
            </Stack>
            
            {selectedServices.length === 0 && (
              <Text color="red.500" fontSize="sm" mt={2}>
                Selecione pelo menos um serviço
              </Text>
            )}
          </Box>
          <FormErrorMessage>
            {errors.servicosIds?.message || (errors.servicoId?.message && "Selecione pelo menos um serviço")}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.funcionarioId}>
          <FormLabel htmlFor="funcionarioId">Funcionário Responsável</FormLabel>
          <Select
            id="funcionarioId"
            {...register('funcionarioId')}
            placeholder="Selecione o funcionário"
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
                    // Validar a data antes de usar toISOString
                    const date = field.value ? new Date(field.value) : new Date();
                    if (isNaN(date.getTime())) {
                      return new Date().toISOString().split('T')[0]; // Fallback para hoje
                    }
                    return date.toISOString().split('T')[0];
                  } catch (error) {
                    return new Date().toISOString().split('T')[0]; // Em caso de erro, use a data atual
                  }
                })()}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
              />
            )}
          />
          <FormErrorMessage>{errors.data?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.hora} isRequired>
          <FormLabel htmlFor="hora">Hora</FormLabel>
          <Input
            id="hora"
            type="time"
            {...register('hora', { required: 'Hora é obrigatória' })}
          />
          <FormErrorMessage>{errors.hora?.message}</FormErrorMessage>
        </FormControl>        <FormControl isInvalid={!!errors.valorTotal} isRequired>
          <FormLabel htmlFor="valorTotal">Valor Total</FormLabel>
          <Controller
            name="valorTotal"
            control={control}
            rules={{ 
              required: 'Valor é obrigatório', 
              min: { value: 0, message: 'Valor não pode ser negativo' },
              validate: value => Number.isFinite(Number(value)) || 'Valor deve ser numérico'
            }}
            render={({ field }) => (
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.500">
                  R$
                </InputLeftElement>
                <NumberInput 
                  value={calculatedTotal}
                  onChange={(valueAsString, valueAsNumber) => {
                    // Garantir que é um número válido
                    const numValue = isNaN(valueAsNumber) ? 0 : valueAsNumber;
                    field.onChange(numValue);
                  }}
                  min={0} 
                  precision={2} 
                  step={10} 
                  w="100%"
                  isReadOnly // Tornar somente leitura já que é calculado automaticamente
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
            Valor calculado automaticamente com base nos serviços selecionados
          </Text>
          <FormErrorMessage>{errors.valorTotal?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.status} isRequired>
          <FormLabel htmlFor="status">Status</FormLabel>
          <Select
            id="status"
            {...register('status', { required: 'Status é obrigatório' })}
          >
            <option value="agendado">Agendado</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
            <option value="em_andamento">Em Andamento</option>
          </Select>
          <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.formaPagamento}>
          <FormLabel htmlFor="formaPagamento">Forma de Pagamento</FormLabel>
          <Select
            id="formaPagamento"
            {...register('formaPagamento')}
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="cartao_debito">Cartão de Débito</option>
            <option value="pix">PIX</option>
            <option value="transferencia">Transferência</option>
          </Select>
          <FormErrorMessage>{errors.formaPagamento?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.observacoes}>
          <FormLabel htmlFor="observacoes">Observações</FormLabel>
          <Textarea
            id="observacoes"
            {...register('observacoes')}
            placeholder="Observações sobre o atendimento"
            rows={3}
          />
          <FormErrorMessage>{errors.observacoes?.message}</FormErrorMessage>
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="green" 
          width="full" 
          isLoading={isSubmitting}
        >
          {initialValues ? 'Atualizar' : 'Registrar Atendimento'}
        </Button>
      </VStack>
    </Box>
  );
};

export default AtendimentoForm;
