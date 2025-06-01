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
  Select,
  Tooltip,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { ptBR } from 'date-fns/locale';
import { Venda } from '../../models/types/VendaTypes';
import { useVenda } from '../../controllers/hooks/useVenda';
import VendaModal from '../components/modals/VendaModal';
import { VendaStyles, VendaStatusColors } from '../../styles/themeStyles';

// Função utilitária local
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "0,00";
  const numValue = typeof value === "number" ? value : Number(value);
  return numValue.toFixed(2).replace(".", ",");
};

interface Props {
  onSelect?: (venda: Venda) => void;
  onAddNew?: () => void;
}

const ListaVendasComBusca: React.FC<Props> = ({ onSelect }) => {
  // Hook para gerenciar estado e lógica
  const { 
    vendas, 
    produtos, 
    tutores, 
    funcionarios,
    loading, 
    addVenda, 
    updateVenda, 
    deleteVenda 
  } = useVenda();
  
  // Estados locais (UI-specific)
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [mensagem, setMensagem] = useState('');
  const [vendaEmEdicao, setVendaEmEdicao] = useState<Venda | null>(null);
  
  // Modais
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    // Importação dos estilos centralizados
  const { bgColor, headerBgColor, buttonColorScheme, borderColor, successColor, errorColor } = VendaStyles;
  // Mapeamento de cores para status
  const statusColors = VendaStatusColors;

  // Filtragem de vendas
  const vendasFiltradas = vendas
    .filter(v => filtroStatus ? v.status === filtroStatus : true)
    .filter(v => {
      if (!busca) return true;
      
      const termoLower = busca.toLowerCase();
      
      // Verificar se algum item contém o termo
      const temItemComTermo = v.itens?.some(item => 
        item.produto?.nome?.toLowerCase().includes(termoLower)
      );
      
      const nomeTutor = v.tutor?.nome?.toLowerCase() || '';
      const nomeFuncionario = v.funcionario?.nome?.toLowerCase() || '';
      
      return temItemComTermo || 
             nomeTutor.includes(termoLower) ||
             nomeFuncionario.includes(termoLower);
    })
    .sort((a, b) => {
      // Ordenar por data (mais recente primeiro)
      const dateA = a.data instanceof Date ? a.data : new Date(a.data);
      const dateB = b.data instanceof Date ? b.data : new Date(b.data);
      return dateB.getTime() - dateA.getTime();
    });

  // Handlers
  const handleEdit = (venda: Venda) => {
    setVendaEmEdicao(venda);
    onEditOpen();
  };
  
  const handleSaveNew = async (vendaData: Omit<Venda, 'id'>) => {
    const success = await addVenda(vendaData);
    if (success) {
      setMensagem('Venda registrada com sucesso!');
      onAddClose();
      return true;
    } else {
      setMensagem('Erro ao registrar venda.');
      return false;
    }
  };
  
  const handleSaveEdit = async (vendaData: Omit<Venda, 'id'>) => {
    if (!vendaEmEdicao) return false;
    const success = await updateVenda(vendaEmEdicao.id, vendaData);
    if (success) {
      setMensagem('Venda atualizada com sucesso!');
      onEditClose();
      return true;
    } else {
      setMensagem('Erro ao atualizar venda.');
      return false;
    }
  };
  
  const handleDelete = async (id: string) => {
    return await deleteVenda(id);
  };
  
  const formatarData = (data: Date | string) => {
    try {
      const dataObj = data instanceof Date ? data : new Date(data);
      return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  // Formatar descrição dos itens
  const formatarItens = (venda: Venda) => {
    if (!venda.itens || venda.itens.length === 0) {
      return "Sem itens";
    }
    
    if (venda.itens.length === 1) {
      const item = venda.itens[0];
      return `${item.quantidade}x ${item.produto?.nome || 'Produto'}`;
    }
    
    return `${venda.itens.length} itens`;
  };

  return (
    <Container maxW="1000px" mx="auto" mt="40px" p="6" bg={bgColor} borderRadius="lg" shadow="xl" boxShadow="0 5px 20px rgba(0,0,0,0.1)" position="relative">
      <Heading size="lg" mb={6} color="green.700">Vendas</Heading>
      
      <Flex mb={4} gap={3} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
        <Input
          placeholder="Buscar por produto, cliente ou vendedor..."
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
          <option value="concluida">Concluída</option>
          <option value="pendente">Pendente</option>
          <option value="cancelada">Cancelada</option>
        </Select>
        
        <Button
          onClick={onAddOpen}
          colorScheme={buttonColorScheme}
          leftIcon={<Text fontSize="xl">+</Text>}
          width={{ base: "100%", md: "auto" }}
        >
          Nova
        </Button>
      </Flex>
      
      {/* Tabela de vendas */}
      <Box mt={6} overflowX="auto">
        <Table variant="simple" bg="white" borderRadius="md" overflow="hidden">
          <Thead bg={headerBgColor}>
            <Tr>
              <Th>Data</Th>
              <Th>Cliente</Th>
              <Th>Itens</Th>
              <Th>Valor</Th>
              <Th>Pagamento</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {vendasFiltradas.map(venda => (
              <Tr key={venda.id}>
                <Td>{formatarData(venda.data)}</Td>
                <Td>{venda.tutor?.nome || "Cliente não identificado"}</Td>                <Td>                  <Tooltip 
                    label={venda.itens?.map(i => `${i.quantidade}x ${i.produto?.nome} - R$ ${formatCurrency(i.subtotal)}`).join(', ')}
                    placement="top"
                    hasArrow
                  >
                    <Text>{formatarItens(venda)}</Text>
                  </Tooltip>
                </Td>                <Td isNumeric>                  <Text>R$ {formatCurrency(venda.valorFinal)}</Text>                  {venda.desconto !== undefined && venda.desconto > 0 && (
                    <Text fontSize="xs" color="gray.500">
                      Desconto: R$ {formatCurrency(venda.desconto)}
                    </Text>
                  )}
                </Td>
                <Td>
                  {venda.formaPagamento === 'dinheiro' && 'Dinheiro'}
                  {venda.formaPagamento === 'cartao_credito' && 'Cartão de Crédito'}
                  {venda.formaPagamento === 'cartao_debito' && 'Cartão de Débito'}
                  {venda.formaPagamento === 'pix' && 'PIX'}
                  {venda.formaPagamento === 'transferencia' && 'Transferência'}
                </Td>
                <Td>
                  <Badge colorScheme={statusColors[venda.status] || 'gray'}>
                    {venda.status === 'concluida' && 'Concluída'}
                    {venda.status === 'pendente' && 'Pendente'}
                    {venda.status === 'cancelada' && 'Cancelada'}
                  </Badge>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleEdit(venda)}
                  >
                    Editar
                  </Button>
                </Td>
              </Tr>
            ))}
            {vendasFiltradas.length === 0 && (
              <Tr>
                <Td colSpan={7} textAlign="center" py={4}>
                  Nenhuma venda encontrada.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      
      {/* Modal para adicionar nova venda */}
      <VendaModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        produtos={produtos}
        tutores={tutores}
        funcionarios={funcionarios}
        onSave={handleSaveNew}
        isLoading={loading}
        successColor={successColor}
        errorColor={errorColor}
        buttonColorScheme={buttonColorScheme}
        mensagem={mensagem}
      />
      
      {/* Modal para editar venda existente */}
      <VendaModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        venda={vendaEmEdicao || undefined}
        produtos={produtos}
        tutores={tutores}
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

export default ListaVendasComBusca;
