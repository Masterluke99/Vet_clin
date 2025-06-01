import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
  Box,
  Text,
  Heading,
  Flex,
  Progress,
  Spinner,
} from '@chakra-ui/react';

interface ServicoContagem {
  id: string;
  nome: string;
  contagem: number;
}

const ServicesWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [servicos, setServicos] = useState<ServicoContagem[]>([]);
  // Chakra UI color values
  const cardBg = 'white';
  const titleColor = 'brand.500';
  const barColor = 'brand.500';
  const textColor = 'navy.700';

  useEffect(() => {
    const fetchMostUsedServices = async () => {
      setLoading(true);
      try {
        // This is a simplified approach. In a real implementation, you'd need to 
        // aggregate data from 'atendimentos' collection to count service usage
        
        const servicosRef = collection(db, 'servicos');
        const servicosSnap = await getDocs(servicosRef);
        
        // Mock data for demonstration - in a real app you'd count service occurrences
        // in the atendimentos collection
        const servicosMock: ServicoContagem[] = servicosSnap.docs.map((doc, index) => ({
          id: doc.id,
          nome: doc.data().nome || `Serviço ${index + 1}`,
          contagem: Math.floor(Math.random() * 20) + 1 // Random count for demo
        }));
        
        // Sort by count
        servicosMock.sort((a, b) => b.contagem - a.contagem);
        
        // Take top 5
        setServicos(servicosMock.slice(0, 5));
      } catch (error) {
        console.error('Erro ao buscar serviços mais usados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostUsedServices();
  }, []);

  return (
    <Box 
      bg={cardBg} 
      borderRadius="lg" 
      boxShadow="sm"
      p={5}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Heading as="h3" size="md" mb={4} color={titleColor}>
        Serviços Mais Utilizados
      </Heading>
      
      {loading ? (
        <Flex justify="center" align="center" flex="1">          <Spinner color={barColor} size="md" />
          <Text ml={3}>Carregando...</Text>
        </Flex>
      ) : servicos.length > 0 ? (
        <Flex direction="column" mt={4} gap={4}>
          {servicos.map(servico => {
            const maxCount = Math.max(...servicos.map(s => s.contagem));
            const percentage = (servico.contagem / maxCount) * 100;
            
            return (
              <Box key={servico.id}>
                <Flex justify="space-between" mb={1}>                  <Text 
                    fontSize="sm" 
                    fontWeight="medium"
                    color={textColor}
                    noOfLines={1}
                    maxW="70%"
                    title={servico.nome}
                  >
                    {servico.nome}
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {servico.contagem}
                  </Text>
                </Flex>
                <Progress 
                  value={percentage} 
                  size="sm" 
                  colorScheme="brand" 
                  borderRadius="md"
                />
              </Box>
            );
          })}
        </Flex>
      ) : (
        <Text color="gray.500" textAlign="center" mt={8}>
          Nenhum serviço encontrado.
        </Text>
      )}
    </Box>
  );
};

export default ServicesWidget;
