import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast
} from '@chakra-ui/react';
import { Tutor, TutorFormValues } from '../../../models/types/TutorTypes';
import TutorForm from '../../forms/TutorForm';

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor?: Tutor;
  onSave: (tutor: TutorFormValues) => Promise<void>;
  title?: string;
}

const TutorModal: React.FC<TutorModalProps> = ({
  isOpen,
  onClose,
  tutor,
  onSave,
  title = tutor ? 'Editar Tutor' : 'Adicionar Tutor'
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const toast = useToast();

  const handleSubmit = async (data: TutorFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      toast({
        title: tutor ? 'Tutor atualizado' : 'Tutor adicionado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao salvar o tutor',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={cancelRef} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TutorForm
            initialValues={tutor}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </ModalBody>
        <ModalFooter>
          <Button ref={cancelRef} onClick={onClose} mr={3}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TutorModal;
