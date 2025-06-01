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
import { Servico, ServicoFormValues } from '../../../models/types/ServicoTypes';
import ServicoForm from '../../forms/ServicoForm';

interface ServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  servico?: Servico;
  onSave: (servico: ServicoFormValues) => Promise<void>;
  title?: string;
}

const ServicoModal: React.FC<ServicoModalProps> = ({
  isOpen,
  onClose,
  servico,
  onSave,
  title = servico ? 'Editar Serviço' : 'Adicionar Serviço'
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const toast = useToast();

  const handleSubmit = async (data: ServicoFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      toast({
        title: servico ? 'Serviço atualizado' : 'Serviço adicionado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao salvar o serviço',
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
          <ServicoForm
            initialValues={servico}
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

export default ServicoModal;
