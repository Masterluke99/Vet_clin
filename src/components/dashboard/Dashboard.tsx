import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Image
} from '@chakra-ui/react';

// Importando ícones personalizados
import negocioIcon from '../../icones/negocio.png';
import petsIcon from '../../icones/pets.png';
import tutorIcon from '../../icones/tutor.png';
import servicosIcon from '../../icones/servicos.png';
import atendimentosIcon from '../../icones/atendimentos.png';
import historicoIcon from '../../icones/historico.png';
import produtosIcon from '../../icones/produtos.png';
import vendasIcon from '../../icones/vendas.png';
import lojaIcon from '../../icones/loja.png';

// Importando estilos centralizados
import { DashboardStyles } from '../../styles/themeStyles';


interface DashboardProps {
  children: React.ReactNode;
  title: string;
}

const Dashboard: React.FC<DashboardProps> = ({ children, title }) => {    const location = useLocation();
  const currentPath = location.pathname;
  
  // Usando estilos centralizados
  const { 
    navBgColor, 
    navTextColor, 
    sidebarBgColor, 
    linkColor, 
    activeBgColor, 
    contentBgColor 
  } = DashboardStyles;

  return (
    <Box>
      {/* Navbar */}

      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="4"
        bg={navBgColor}
        color={navTextColor}
      >
        <Heading size="md">{title}</Heading>
        
        <Stack direction="row" spacing={4}>
          <RouterLink to="/" style={{ color: navTextColor, marginRight: '10px' }}>
            Home
          </RouterLink>
          <Text>|</Text>
          <RouterLink to="/animais" style={{ color: navTextColor, margin: '0 10px' }}>
            Animais
          </RouterLink>
          <Text>|</Text>
          <RouterLink to="/tutores" style={{ color: navTextColor, marginLeft: '10px' }}>
            Tutores
          </RouterLink>
        </Stack>
      </Flex>

      <Flex>
        {/* Sidebar */}        <Box
          as="aside"
          w="250px"
          bg={sidebarBgColor}
          h="calc(120vh - 68px)"
          p={5}
          shadow="lg"
        >               <Flex 
                align="center" 
                mb={6} 
                p={3} 
                borderRadius="lg" 
                bg="green.200" 
                shadow="sm"
               >
                <Image src={lojaIcon} alt="Loja" boxSize="60px" mr={2} />
                <Heading size="md" color="green.500">Menu</Heading>
               </Flex><Stack direction="column" align="stretch" spacing="3">              <Box 
              mb={3} 
              p={2} 
              borderRadius="md" 
              bg={currentPath === '/negocio' ? activeBgColor : 'transparent'}
              _hover={{ bg: "green.200", shadow: "md" }}
              transition="all 0.2s"
            >
              <RouterLink to="/negocio" style={{ color: linkColor }}>
                <Flex align="center">
                  <Image src={negocioIcon} alt="Negocio" boxSize="30px" mr={2} />
                  Negocio
                </Flex>
              </RouterLink>
            </Box>              <Box 
              mb={3}
              p={2} 
              borderRadius="md" 
              bg={currentPath === '/animais' ? activeBgColor : 'transparent'}
              _hover={{ bg: "green.200", shadow: "md" }}
              transition="all 0.2s"
            >
              <RouterLink to="/animais" style={{ color: linkColor }}>
                <Flex align="center">
                  <Image src={petsIcon} alt="Animais" boxSize="30px" mr={2} />
                  Animais
                </Flex>
              </RouterLink>
            </Box>            <Box 
              mb={3} 
              p={2} 
              borderRadius="md" 
              bg={currentPath === '/tutores' ? activeBgColor : 'transparent'}
              _hover={{ bg: "green.200", shadow: "md" }}
              transition="all 0.2s"
            >
              <RouterLink to="/tutores" style={{ color: linkColor }}>
                <Flex align="center">
                  <Image src={tutorIcon} alt="Tutores" boxSize="30px" mr={2} />
                  Tutores
                </Flex>
              </RouterLink>
            </Box>
            <Box 
              mb={3} 
              p={2} 
              borderRadius="md" 
              bg={currentPath === '/servicos' ? activeBgColor : 'transparent'}
              _hover={{ bg: "green.200", shadow: "md" }}
              transition="all 0.2s"
            >
              <RouterLink to="/servicos" style={{ color: linkColor }}>
                <Flex align="center">
                  <Image src={servicosIcon} alt="Serviços" boxSize="30px" mr={2} />
                  Serviços
                </Flex>
              </RouterLink>
            </Box>            <Box 
              mb={3} 
              p={2} 
              borderRadius="md" 
              bg={currentPath === '/atendimentos' ? activeBgColor : 'transparent'}
              _hover={{ bg: "green.200", shadow: "md" }}
              transition="all 0.2s"
            >
              <RouterLink to="/atendimentos" style={{ color: linkColor }}>
                <Flex align="center">
                  <Image src={atendimentosIcon} alt="Atendimentos" boxSize="30px" mr={2} />
                  Atendimentos
                </Flex>
              </RouterLink>
            </Box>
            <Box 
              mb={3} 
              p={2} 
              borderRadius="md" 
              bg={currentPath === '/historico-atendimentos' ? activeBgColor : 'transparent'}
              _hover={{ bg: "green.200", shadow: "md" }}
              transition="all 0.2s"
            >
              <RouterLink to="/historico-atendimentos" style={{ color: linkColor }}>
                <Flex align="center">
                  <Image src={historicoIcon} alt="Histórico" boxSize="30px" mr={2} />
                  Histórico
                </Flex>
              </RouterLink>
            </Box>            <Box 
              mb={3} 
              p={2} 
              borderRadius="md" 
              bg={currentPath === '/produtos' ? activeBgColor : 'transparent'}
              _hover={{ bg: "green.200", shadow: "md" }}
              transition="all 0.2s"
            >
              <RouterLink to="/produtos" style={{ color: linkColor }}>
                <Flex align="center">
                  <Image src={produtosIcon} alt="Produtos" boxSize="30px" mr={2} />
                  Produtos
                </Flex>
              </RouterLink>
            </Box>            <Box 
              mb={3} 
              p={2} 
              borderRadius="md" 
              bg={currentPath === '/pdv' ? activeBgColor : 'transparent'}
              _hover={{ bg: "green.200", shadow: "md" }}
              transition="all 0.2s"
            >              <RouterLink to="/pdv" style={{ color: linkColor }}>
                <Flex align="center">
                  <Image src={vendasIcon} alt="PDV" boxSize="30px" mr={2} />
                  PDV - Ponto de Venda
                </Flex>
              </RouterLink>
            </Box>          </Stack>
          
          {/* Version display */}
          <Text fontSize="xs" color="gray.500" textAlign="center" mt={8}>
            Vet_Clin v1.0.0
          </Text>
        </Box>

        {/* Content */}<Box 
          flex="1"
          p={6}
          bg={contentBgColor}
          h="calc(120vh - 68px)"
          overflowY="auto"
          shadow="inner"
          borderRadius="md"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Dashboard;
