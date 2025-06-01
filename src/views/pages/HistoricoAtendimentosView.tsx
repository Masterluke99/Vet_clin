import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Spinner,
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure
} from '@chakra-ui/react';
import { useRelatorio } from '../../controllers/hooks/useRelatorio';
import { AtendimentoRelatorio } from '../../models/types/RelatorioTypes';
import AtendimentoModal from '../components/modals/AtendimentoModal';
import { Atendimento } from '../../models/types/AtendimentoTypes';
import { RelatorioStyles, AtendimentoStatusColors } from '../../styles/themeStyles';

const HistoricoAtendimentosView: React.FC = () => {
  // Controlador para gerenciar a lógica e o estado
  const { 
    atendimentos,
    filtros,
    loading,
    animais,
    servicos,
    funcionarios,
    atualizarFiltros,
    carregarAtendimentos,
    formatarData
  } = useRelatorio();

  // Estado da interface do usuário
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState<Atendimento | null>(null);  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  // Constantes de UI importadas do arquivo de estilos centralizado
  const { bgColor, headerBgColor, buttonColorScheme } = RelatorioStyles;

  // Contadores para o dashboard
  const totalAtendimentos = atendimentos.length;
  // Status badges
  const getStatusBadge = (status: string) => {
    // Type assertion to allow string indexing
    const statusColors = AtendimentoStatusColors as Record<string, string>;
    
    return (
      <Badge colorScheme={statusColors[status] || 'gray'} px={2} py={1} borderRadius="md">
        {status === 'agendado' && 'Agendado'}
        {status === 'em_andamento' && 'Em Andamento'}
        {status === 'concluido' && 'Concluído'}
        {status === 'cancelado' && 'Cancelado'}
        {!statusColors[status] && status}
      </Badge>
    );
  };

  // Handler para visualizar detalhes do atendimento
  const handleViewAtendimento = (atendimento: AtendimentoRelatorio) => {
    setAtendimentoSelecionado(atendimento as Atendimento);
    onViewOpen();
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Box bg={bgColor} p={5} borderRadius="lg" boxShadow="md" mb={6}>
        <Heading size="lg" mb={6} color="blue.700">Histórico de Atendimentos</Heading>

        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <Card bg="white">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.500">Total de Atendimentos</StatLabel>
                  <StatNumber color="blue.600">{totalAtendimentos}</StatNumber>
                  <StatHelpText>No período selecionado</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
        
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          bg={headerBgColor} 
          p={4} 
          borderRadius="md" 
          mb={6}
          gap={4}
        >
          <FormControl>
            <FormLabel>Data Inicial</FormLabel>
            <Input
              type="date"
              value={filtros.dataInicio || ''}
              onChange={(e) => atualizarFiltros({ dataInicio: e.target.value })}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Data Final</FormLabel>
            <Input
              type="date"
              value={filtros.dataFim || ''}
              onChange={(e) => atualizarFiltros({ dataFim: e.target.value })}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Animal</FormLabel>
            <Select
              placeholder="Todos os animais"
              value={filtros.animalId || ''}
              onChange={(e) => atualizarFiltros({ animalId: e.target.value })}
            >
              {animais.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome}
                </option>
              ))}
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel>Serviço</FormLabel>
            <Select
              placeholder="Todos os serviços"
              value={filtros.servicoId || ''}
              onChange={(e) => atualizarFiltros({ servicoId: e.target.value })}
            >
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>
                  {servico.nome}
                </option>
              ))}
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              placeholder="Todos os status"
              value={filtros.status || ''}
              onChange={(e) => atualizarFiltros({ status: e.target.value })}
            >
              <option value="agendado">Agendado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </Select>
          </FormControl>
          
          <Box alignSelf="flex-end" mb={{ base: 0, md: 1 }}>
            <Button 
              colorScheme={buttonColorScheme}
              onClick={() => carregarAtendimentos()}
              isLoading={loading}
            >
              Filtrar
            </Button>
          </Box>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Flex>
        ) : (
          <>
            {atendimentos.length === 0 ? (
              <Box p={5} textAlign="center">
                <Text fontSize="lg">Nenhum atendimento encontrado com os filtros selecionados.</Text>
              </Box>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr bg={headerBgColor}>
                      <Th>Data</Th>
                      <Th>Animal</Th>
                      <Th>Serviços</Th>
                      <Th>Profissional</Th>
                      <Th>Status</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {atendimentos.map((atendimento) => (
                      <Tr key={atendimento.id} _hover={{ bg: 'gray.50' }}>
                        <Td>{formatarData(atendimento.data)}</Td>
                        <Td>{atendimento.animalNome || '-'}</Td>
                        <Td>
                          {atendimento.servicosNomes && atendimento.servicosNomes.length > 0 
                            ? atendimento.servicosNomes.join(', ') 
                            : '-'}
                        </Td>
                        <Td>{atendimento.funcionarioNome || '-'}</Td>
                        <Td>{atendimento.status ? getStatusBadge(atendimento.status) : '-'}</Td>                        <Td>
                          <Button
                            size="sm"
                            colorScheme={buttonColorScheme}
                            onClick={() => handleViewAtendimento(atendimento)}
                          >
                            Ver Detalhes
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </>
        )}
      </Box>      {/* Modal de detalhes do atendimento */}
      {atendimentoSelecionado && (
        <AtendimentoModal
          isOpen={isViewOpen}
          onClose={() => {
            onViewClose();
            setAtendimentoSelecionado(null);
          }}
          atendimento={atendimentoSelecionado}
          animais={animais}
          servicos={servicos}
          funcionarios={funcionarios}
          onSave={async (_atendimentoData) => false} // No-op handler returning Promise<boolean>
          isLoading={false}
          successColor={RelatorioStyles.successColor}
          errorColor={RelatorioStyles.errorColor}
          buttonColorScheme={buttonColorScheme}
          mensagem=""
        />
      )}
    </Container>
  );
};

export default HistoricoAtendimentosView;
