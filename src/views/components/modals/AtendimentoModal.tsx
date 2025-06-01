import React, { useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { Atendimento } from '../../../models/types/AtendimentoTypes';
import { Animal } from '../../../models/types/AnimalTypes';
import { Servico } from '../../../models/types/ServicoTypes';
import { Funcionario } from '../../../models/types/FuncionarioTypes';
import AtendimentoForm from '../../forms/AtendimentoForm';

interface AtendimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  atendimento?: Atendimento;
  animais: Animal[];
  servicos: Servico[];
  funcionarios: Funcionario[];
  onSave: (atendimentoData: Omit<Atendimento, 'id'>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
  isLoading: boolean;
  successColor: string;
  errorColor: string;
  buttonColorScheme: string;
  mensagem: string;
}

const AtendimentoModal: React.FC<AtendimentoModalProps> = ({
  isOpen,
  onClose,
  atendimento,
  animais,
  servicos,
  funcionarios,
  onSave,
  onDelete,
  isLoading,
  successColor,
  errorColor,
  buttonColorScheme,
  mensagem
}) => {
  const { 
    isOpen: isDeleteDialogOpen, 
    onOpen: onDeleteDialogOpen, 
    onClose: onDeleteDialogClose 
  } = useDisclosure();
  
  const cancelRef = useRef<HTMLButtonElement>(null!);
  
  const handleDelete = async () => {
    if (atendimento && onDelete) {
      const success = await onDelete(atendimento.id);
      if (success) {
        onDeleteDialogClose();
        onClose();
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="white" p={4}>
          <ModalHeader color="green.700">
            {atendimento ? 'Editar Atendimento' : 'Novo Atendimento'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AtendimentoForm 
              initialValues={atendimento}
              animais={animais}
              servicos={servicos}
              funcionarios={funcionarios}              onSubmit={async (data) => {
                // Ensure data.data is a Date object
                // Encontrar os objetos de serviço correspondentes aos IDs selecionados
                const servicosArray = data.servicosIds
                  .map(id => servicos.find(s => s.id === id))
                  .filter(s => s !== undefined) as Servico[];
                
                const atendimentoData = {
                  ...data,
                  data: typeof data.data === 'string' ? new Date(data.data) : data.data,
                  // Garantir que servicosIds está preenchido corretamente (nunca será undefined)
                  servicosIds: data.servicosIds.length > 0 ? data.servicosIds : (data.servicoId ? [data.servicoId] : []),
                  // Garantir que servicoId tem um valor (compatibilidade)
                  servicoId: data.servicosIds.length > 0 ? data.servicosIds[0] : data.servicoId,
                  // Incluir o array de objetos de serviço
                  servicos: servicosArray,
                  // Garantir que o valorTotal é um número
                  valorTotal: Number(data.valorTotal)
                };
                const success = await onSave(atendimentoData);
                if (success) {
                  onClose();
                }
              }}
              isSubmitting={isLoading}
            />
            {atendimento && onDelete && (
              <Button
                colorScheme="red"
                mt={4}
                onClick={onDeleteDialogOpen}
                width="100%"
              >
                Excluir Atendimento
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Diálogo de confirmação para exclusão */}
      {atendimento && onDelete && (
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteDialogClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Excluir Atendimento
              </AlertDialogHeader>

              <AlertDialogBody>
                Tem certeza que deseja excluir este atendimento? Esta ação não pode ser desfeita.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};

export default AtendimentoModal;
