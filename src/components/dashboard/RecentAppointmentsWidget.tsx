import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Flex, 
  Spinner, 
  Stack, 
  Avatar
} from '@chakra-ui/react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface Atendimento {
  id: string;
  animalNome?: string;
  servicoNome?: string;
  data?: Date;
  concluido?: boolean;
  observacoes?: string;
}

const RecentAppointmentsWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);

  useEffect(() => {
    const fetchRecentAppointments = async () => {
      setLoading(true);
      try {
        const atendimentosRef = collection(db, 'atendimentos');
        const q = query(
          atendimentosRef,
          orderBy('data', 'desc'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const atendimentosData: Atendimento[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
           let appointmentDate: Date | undefined; // This variable is now correctly declared and will be used

  if (data.data && typeof data.data.toDate === 'function') {
    // Recommended: If data.data is a Firestore Timestamp object
    appointmentDate = data.data.toDate();
  } else if (data.data instanceof Date) {
    // Fallback: If data.data is already a JS Date object
    appointmentDate = data.data;
  } else if (typeof data.data === 'object' && data.data !== null && 'seconds' in data.data && 'nanoseconds' in data.data) {
    // Fallback: For raw Timestamp object if .toDate() isn't available for some reason
    appointmentDate = new Date(data.data.seconds * 1000);
  } else {
    // Default: If data.data is truly missing or in an unexpected format
    appointmentDate = undefined;
  }
          atendimentosData.push({
            id: doc.id,
            animalNome: data.animalNome || 'Animal não identificado',
            servicoNome: data.servicoNome || 'Serviço não especificado',
            data: appointmentDate,
            concluido: data.concluido || false,
            observacoes: data.observacoes
          });
        });
        
        setAtendimentos(atendimentosData);
      } catch (error) {
        console.error('Erro ao buscar atendimentos recentes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAppointments();
  }, []);
  const formatDate = (date?: Date) => {
    if (!date) return 'Data não definida';
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Erro na data';
    }
  };

  const getRandomColor = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colorOptions = ['blue', 'green', 'purple', 'orange', 'teal', 'cyan', 'pink'];
    const index = Math.abs(hash % colorOptions.length);
    return colorOptions[index];
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      p={5}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Heading as="h3" size="md" mb={4} color="brand.500">
        Atendimentos Recentes
      </Heading>
      
      {loading ? (
        <Flex justify="center" align="center" flex="1">
          <Spinner color="brand.500" size="md" />
          <Text ml={3}>Carregando atendimentos...</Text>
        </Flex>
      ) : atendimentos.length > 0 ? (
        <Stack spacing={4}>
          {atendimentos.map(atendimento => {
            const avatarColor = getRandomColor(atendimento.animalNome || '');
            
            return (
              <Flex 
                key={atendimento.id} 
                p={3} 
                bg="gray.50" 
                borderRadius="md" 
                align="center"
                boxShadow="sm"
              >
                <Avatar 
                  size="sm" 
                  bg={`${avatarColor}.500`} 
                  color="white"
                  name={atendimento.animalNome} 
                  mr={3} 
                />              <Box flex="1">
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold" fontSize="sm">
                      {atendimento.animalNome}
                    </Text>
                    <Box 
                      bg={atendimento.concluido ? 'green.500' : 'yellow.500'} 
                      color="white" 
                      borderRadius="full" 
                      px={2}
                      fontSize="xs"
                    >
                      {atendimento.concluido ? 'Concluído' : 'Pendente'}
                    </Box>
                  </Flex>
                  <Text fontSize="xs" color="gray.500">
                    {formatDate(atendimento.data)}
                  </Text>
                  <Text fontSize="sm" mt={1}>
                    {atendimento.servicoNome}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      ) : (
        <Text color="gray.500" textAlign="center" mt={8}>
          Nenhum atendimento recente encontrado.
        </Text>
      )}
    </Box>
  );
};

export default RecentAppointmentsWidget;
