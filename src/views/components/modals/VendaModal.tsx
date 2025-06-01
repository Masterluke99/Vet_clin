import React from 'react';
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
import { Venda } from '../../../models/types/VendaTypes';
import { Produto } from '../../../models/types/ProdutoTypes';
import { Tutor } from '../../../models/types/TutorTypes';
import { Funcionario } from '../../../models/types/FuncionarioTypes';
import VendaForm from '../../forms/VendaForm';

interface VendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  venda?: Venda;
  produtos: Produto[];
  tutores: Tutor[];
  funcionarios: Funcionario[];
  onSave: (vendaData: Omit<Venda, 'id'>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
  isLoading: boolean;
  successColor: string;
  errorColor: string;
  buttonColorScheme: string;
  mensagem: string;
}

const VendaModal: React.FC<VendaModalProps> = ({
  isOpen,
  onClose,
  venda,
  produtos,
  tutores,
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
    onClose: onDeleteDialogClose   } = useDisclosure();
  // Usando React.RefObject<HTMLButtonElement> para compatibilidade com AlertDialog
  const cancelRef = React.useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  
  const handleDelete = async () => {
    if (venda && onDelete) {
      const success = await onDelete(venda.id);
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
            {venda ? 'Editar Venda' : 'Nova Venda'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VendaForm 
              initialValues={venda}
              produtos={produtos}
              tutores={tutores}
              funcionarios={funcionarios}
              onSubmit={async (data) => {
                const success = await onSave(data);
                if (success) {
                  onClose();
                }
              }}
              isSubmitting={isLoading}
            />
            {venda && onDelete && (
              <Button
                colorScheme="red"
                mt={4}
                onClick={onDeleteDialogOpen}
                width="100%"
              >
                Excluir Venda
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Diálogo de confirmação para exclusão */}
      {venda && onDelete && (
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteDialogClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Excluir Venda
              </AlertDialogHeader>

              <AlertDialogBody>
                Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
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

export default VendaModal;
