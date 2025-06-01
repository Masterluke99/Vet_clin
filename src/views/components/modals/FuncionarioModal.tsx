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
import { Funcionario } from '../../../models/types/FuncionarioTypes';
import FuncionarioForm from '../../forms/FuncionarioForm';

interface FuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionario?: Funcionario;
  onSave: (funcionarioData: Omit<Funcionario, 'id'>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
  isLoading: boolean;
  successColor: string;
  errorColor: string;
  buttonColorScheme: string;
  mensagem: string;
}

const FuncionarioModal: React.FC<FuncionarioModalProps> = ({
  isOpen,
  onClose,
  funcionario,
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
    if (funcionario && onDelete) {
      const success = await onDelete(funcionario.id);
      if (success) {
        onDeleteDialogClose();
        onClose();
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="white" p={4} maxW="600px">
          <ModalHeader color="green.700">
            {funcionario ? 'Editar Funcionário' : 'Novo Funcionário'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FuncionarioForm 
              initialValues={funcionario}
              onSubmit={async (data) => {
                const success = await onSave(data);
                if (success) {
                  onClose();
                }
              }}
              isSubmitting={isLoading}
            />
            {funcionario && onDelete && (
              <Button
                colorScheme="red"
                mt={4}
                onClick={onDeleteDialogOpen}
                isLoading={isLoading}
              >
                Excluir Funcionário
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Diálogo de confirmação para exclusão */}
      {funcionario && onDelete && (
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteDialogClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Excluir Funcionário
              </AlertDialogHeader>

              <AlertDialogBody>
                Tem certeza que deseja excluir o funcionário "{funcionario.nome}"? Esta ação não pode ser desfeita.
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

export default FuncionarioModal;
