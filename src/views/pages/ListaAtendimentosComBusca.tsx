import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Badge,
  Select
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Atendimento } from '../../models/types/AtendimentoTypes';
import { useAtendimento } from '../../controllers/hooks/useAtendimento';
import AtendimentoModal from '../components/modals/AtendimentoModal';
import { AtendimentoStyles, AtendimentoStatusColors } from '../../styles/themeStyles';

// Função utilitária local - garantindo que trabalhamos com números
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "0,00";
  // Garantir que estamos trabalhando com um número
  const numValue = typeof value === "number" ? value : Number(value);
  // Verificar se é um número válido
  if (isNaN(numValue)) return "0,00";
  // Formatar com duas casas decimais e separador brasileiro
  return numValue.toFixed(2).replace(".", ",");
};

interface Props {
  onSelect?: (atendimento: Atendimento) => void;
  onAddNew?: () => void;
}

const ListaAtendimentosComBusca: React.FC<Props> = ({ onSelect }) => {
  // Hook para gerenciar estado e lógica
  const { 
    atendimentos, 
    animais, 
    servicos, 
    funcionarios,
    loading, 
    addAtendimento, 
    updateAtendimento, 
    deleteAtendimento 
  } = useAtendimento();
  
  // Estados locais (UI-specific)
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [mensagem, setMensagem] = useState('');
  const [atendimentoEmEdicao, setAtendimentoEmEdicao] = useState<Atendimento | null>(null);
  
  // Modais
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    // Importação dos estilos centralizados
  const { bgColor, headerBgColor, buttonColorScheme, borderColor, successColor, errorColor } = AtendimentoStyles;

  // Mapeamento de cores para status
  const statusColors = AtendimentoStatusColors;

  // Filtragem de atendimentos
  const atendimentosFiltrados = atendimentos
    .filter(a => filtroStatus ? a.status === filtroStatus : true)
    .filter(a => {
      if (!busca) return true;
      
      const termoLower = busca.toLowerCase();
      const nomeAnimal = a.animal?.nome?.toLowerCase() || '';
      const nomeTutor = a.tutor?.nome?.toLowerCase() || '';
      
      // Busca em todos os serviços se disponível
      let servicoMatch = false;
      if (a.servicos && a.servicos.length > 0) {
        servicoMatch = a.servicos.some(s => s.nome?.toLowerCase().includes(termoLower));
      } else if (a.servico) {
        servicoMatch = a.servico.nome?.toLowerCase()?.includes(termoLower) || false;
      }
      
      return nomeAnimal.includes(termoLower) || 
             nomeTutor.includes(termoLower) ||
             servicoMatch;
    })
    .sort((a, b) => {
      // Ordenar por data (mais recente primeiro)
      const dateA = a.data instanceof Date ? a.data : new Date(a.data);
      const dateB = b.data instanceof Date ? b.data : new Date(b.data);
      return dateB.getTime() - dateA.getTime();
    });

  // Handlers
  const handleEdit = (atendimento: Atendimento) => {
    setAtendimentoEmEdicao(atendimento);
    onEditOpen();
  };
  
  const handleSaveNew = async (atendimentoData: Omit<Atendimento, 'id'>) => {
    const success = await addAtendimento(atendimentoData);
    if (success) {
      setMensagem('Atendimento registrado com sucesso!');
      onAddClose();
      return true;
    } else {
      setMensagem('Erro ao registrar atendimento.');
      return false;
    }
  };
  
  const handleSaveEdit = async (atendimentoData: Omit<Atendimento, 'id'>) => {
    if (!atendimentoEmEdicao) return false;
    const success = await updateAtendimento(atendimentoEmEdicao.id, atendimentoData);
    if (success) {
      setMensagem('Atendimento atualizado com sucesso!');
      onEditClose();
      return true;
    } else {
      setMensagem('Erro ao atualizar atendimento.');
      return false;
    }
  };
  
  const handleDelete = async (id: string) => {
    return await deleteAtendimento(id);
  };
  
  const formatarData = (data: Date | string) => {
    try {
      const dataObj = data instanceof Date ? data : new Date(data);
      return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };



  return (
    <Container maxW="1000px" mx="auto" mt="40px" p="6" bg={bgColor} borderRadius="lg" shadow="xl" boxShadow="0 5px 20px rgba(0,0,0,0.1)" position="relative">
      <Heading size="lg" mb={6} color="green.700">Atendimentos</Heading>
      
      <Flex mb={4} gap={3} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
        <Input
          placeholder="Buscar por animal, tutor ou serviço..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          bg="white"
          borderColor={borderColor}
          flex="1"
        />
        
        <Select
          placeholder="Todos os status"
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          bg="white"
          borderColor={borderColor}
          width={{ base: "100%", md: "200px" }}
        >
          <option value="agendado">Agendado</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </Select>
        
        <Button
          onClick={onAddOpen}
          colorScheme={buttonColorScheme}
          leftIcon={<Text fontSize="xl">+</Text>}
          width={{ base: "100%", md: "auto" }}
        >
          Novo
        </Button>
      </Flex>
      
      {/* Tabela de atendimentos */}
      <Box mt={6} overflowX="auto">
        <Table variant="simple" bg="white" borderRadius="md" overflow="hidden">
          <Thead bg={headerBgColor}>
            <Tr>
              <Th>Data/Hora</Th>
              <Th>Animal</Th>
              <Th>Tutor</Th>
              <Th>Serviço</Th>
              <Th>Valor</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {atendimentosFiltrados.map(atendimento => (
              <Tr key={atendimento.id}>
                <Td>
                  <Text fontWeight="bold">{formatarData(atendimento.data)}</Text>
                  <Text fontSize="sm">{atendimento.hora}</Text>
                </Td>                <Td>{atendimento.animal?.nome}</Td>
                <Td>{atendimento.tutor?.nome}</Td>
                <Td>
                  {/* Mostrar múltiplos serviços se estiverem disponíveis */}
                  {atendimento.servicos && atendimento.servicos.length > 0 ? (
                    <Box>
                      {atendimento.servicos.map((servico, idx) => (
                        <Text key={idx} fontSize="sm">
                          {servico.nome}
                          {idx < atendimento.servicos.length - 1 ? ', ' : ''}
                        </Text>
                      ))}
                    </Box>
                  ) : (
                    atendimento.servico?.nome || '-'
                  )}
                </Td>
                <Td>R$ {formatCurrency(atendimento.valorTotal)}</Td>
                <Td>
                  <Badge colorScheme={statusColors[atendimento.status] || 'gray'}>
                    {atendimento.status === 'agendado' && 'Agendado'}
                    {atendimento.status === 'em_andamento' && 'Em Andamento'}
                    {atendimento.status === 'concluido' && 'Concluído'}
                    {atendimento.status === 'cancelado' && 'Cancelado'}
                  </Badge>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleEdit(atendimento)}
                  >
                    Editar
                  </Button>
                </Td>
              </Tr>
            ))}
            {atendimentosFiltrados.length === 0 && (
              <Tr>
                <Td colSpan={7} textAlign="center" py={4}>
                  Nenhum atendimento encontrado.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      
      {/* Modal para adicionar novo atendimento */}
      <AtendimentoModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        animais={animais}
        servicos={servicos}
        funcionarios={funcionarios}
        onSave={handleSaveNew}
        isLoading={loading}
        successColor={successColor}
        errorColor={errorColor}
        buttonColorScheme={buttonColorScheme}
        mensagem={mensagem}
      />
      
      {/* Modal para editar atendimento existente */}
      <AtendimentoModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        atendimento={atendimentoEmEdicao || undefined}
        animais={animais}
        servicos={servicos}
        funcionarios={funcionarios}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        isLoading={loading}
        successColor={successColor}
        errorColor={errorColor}
        buttonColorScheme={buttonColorScheme}
        mensagem={mensagem}
      />
    </Container>
  );
};

export default ListaAtendimentosComBusca;
