import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ServicesWidget from './ServicesWidget';
import ProductSalesWidget from './ProductSalesWidget';
import RecentAppointmentsWidget from './RecentAppointmentsWidget';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Spinner,
  Container,
} from '@chakra-ui/react';
import { DashboardStyles } from '../../styles/themeStyles';

const DashboardHome: React.FC = () => {
  const [countAnimais, setCountAnimais] = useState(0);
  const [countTutores, setCountTutores] = useState(0);
  const [countAtendimentos, setCountAtendimentos] = useState(0);
  const [countProdutos, setCountProdutos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const animaisSnapshot = await getDocs(collection(db, 'animais'));
        setCountAnimais(animaisSnapshot.size);

        const tutoresSnapshot = await getDocs(collection(db, 'tutores'));
        setCountTutores(tutoresSnapshot.size);

        const atendimentosSnapshot = await getDocs(collection(db, 'atendimentos'));
        setCountAtendimentos(atendimentosSnapshot.size);

        const produtosSnapshot = await getDocs(collection(db, 'produtos'));
        setCountProdutos(produtosSnapshot.size);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>      {loading ? (
        <Flex justify="center" align="center" height="300px">
          <Spinner size="xl" color={DashboardStyles.linkColor} thickness="4px" />
          <Text ml={4} fontSize="lg">Carregando dados...</Text>
        </Flex>
      ) : (
        <>

        
          <Heading textAlign="center" size="lg" my={6} color={DashboardStyles.headerColor}>Painel Vet Clin</Heading>
            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4} px={4}>
            <GridItem>
              <Stat bg={DashboardStyles.statCards.animais} p={5} borderRadius="md" boxShadow="md" textAlign="center">
                <StatLabel fontSize="lg">Total de Animais</StatLabel>
                <StatNumber fontSize="3xl">{countAnimais}</StatNumber>
              </Stat>
            </GridItem>
            
            <GridItem>
              <Stat bg={DashboardStyles.statCards.tutores} p={5} borderRadius="md" boxShadow="md" textAlign="center">
                <StatLabel fontSize="lg">Total de Tutores</StatLabel>
                <StatNumber fontSize="3xl">{countTutores}</StatNumber>
              </Stat>
            </GridItem>
            
            <GridItem>
              <Stat bg={DashboardStyles.statCards.atendimentos} p={5} borderRadius="md" boxShadow="md" textAlign="center">
                <StatLabel fontSize="lg">Atendimentos</StatLabel>
                <StatNumber fontSize="3xl">{countAtendimentos}</StatNumber>
              </Stat>
            </GridItem>
            
            <GridItem>
              <Stat bg={DashboardStyles.statCards.produtos} p={5} borderRadius="md" boxShadow="md" textAlign="center">
                <StatLabel fontSize="lg">Produtos Cadastrados</StatLabel>
                <StatNumber fontSize="3xl">{countProdutos}</StatNumber>
              </Stat>
            </GridItem>
          </Grid>            <Container maxW="container.xl" mt={8}>
            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
              <GridItem>
                <Box 
                  bg={DashboardStyles.widgetBgColor} 
                  borderRadius={DashboardStyles.widgetBorderRadius} 
                  boxShadow={DashboardStyles.widgetShadow} 
                  p={4}
                >
                  <ServicesWidget />
                </Box>
              </GridItem>
              <GridItem>
                <Box 
                  bg={DashboardStyles.widgetBgColor} 
                  borderRadius={DashboardStyles.widgetBorderRadius} 
                  boxShadow={DashboardStyles.widgetShadow} 
                  p={4}
                >
                  <ProductSalesWidget />
                </Box>
              </GridItem>
            </Grid>

            {/* Add the recent appointments widget */}
            <Box mt={6}>
              <Box 
                bg={DashboardStyles.widgetBgColor} 
                borderRadius={DashboardStyles.widgetBorderRadius} 
                boxShadow={DashboardStyles.widgetShadow} 
                p={4}
              >
                <RecentAppointmentsWidget />
              </Box>
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
};

export default DashboardHome;
