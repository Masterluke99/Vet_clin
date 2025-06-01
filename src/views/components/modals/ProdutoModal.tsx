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
import { Produto, ProdutoFormValues } from '../../../models/types/ProdutoTypes';
import ProdutoForm from '../../forms/ProdutoForm';

interface ProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  produto?: Produto;
  onSave: (produto: ProdutoFormValues) => Promise<void>;
  title?: string;
}

const ProdutoModal: React.FC<ProdutoModalProps> = ({
  isOpen,
  onClose,
  produto,
  onSave,
  title = produto ? 'Editar Produto' : 'Adicionar Produto'
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const toast = useToast();

  const handleSubmit = async (data: ProdutoFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      toast({
        title: produto ? 'Produto atualizado' : 'Produto adicionado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao salvar o produto',
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
          <ProdutoForm
            initialValues={produto}
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

export default ProdutoModal;
