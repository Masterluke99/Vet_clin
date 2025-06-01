import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';
import { Animal } from '../../../models/types/AnimalTypes';
import AnimalForm from '../../forms/AnimalForm';

interface AnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal?: Animal; // Se fornecido, é modo de edição
  tutores: { id: string; nome: string }[];
  onSave: (animalData: Omit<Animal, 'id' | 'tutor'>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>; // Opcional, apenas para edição
  isLoading: boolean;
  successColor: string;
  errorColor: string;
  buttonColorScheme: string;
  mensagem: string;
}

const AnimalModal: React.FC<AnimalModalProps> = ({
  isOpen,
  onClose,
  animal,
  tutores,
  onSave,
  onDelete,
  isLoading,
  successColor,
  errorColor,
  buttonColorScheme,
  mensagem
}) => {  const { 
    isOpen: isDeleteDialogOpen, 
    onOpen: onDeleteDialogOpen, 
    onClose: onDeleteDialogClose 
  } = useDisclosure();
  
  // Usando React.RefObject<HTMLButtonElement> para compatibilidade com AlertDialog
  const cancelRef = React.useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  
  const handleDelete = async () => {
    if (animal && onDelete) {
      const success = await onDelete(animal.id);
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
        <ModalContent bg="white" p={4}>
          <ModalHeader color="green.700">
            {animal ? 'Editar Animal' : 'Novo Animal'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AnimalForm 
              animal={animal}
              tutores={tutores}
              onSave={onSave}
              onCancel={onClose}
              onDelete={animal && onDelete ? onDeleteDialogOpen : undefined}
              isLoading={isLoading}
              successColor={successColor}
              errorColor={errorColor}
              buttonColorScheme={buttonColorScheme}
              mensagem={mensagem}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Diálogo de confirmação para exclusão */}
      {animal && onDelete && (
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteDialogClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Excluir Animal
              </AlertDialogHeader>

              <AlertDialogBody>
                Tem certeza que deseja excluir o animal "{animal.nome}"? Esta ação não pode ser desfeita.
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

export default AnimalModal;
