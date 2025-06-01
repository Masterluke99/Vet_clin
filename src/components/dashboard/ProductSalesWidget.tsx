import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
} from '@chakra-ui/react';

interface ProdutoVenda {
  id: string;
  nome: string;
  quantidade: number;
  valor: number;
}

const ProductSalesWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<ProdutoVenda[]>([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      setLoading(true);
      try {
        // Em uma implementação real, você buscaria dados de vendas
        // e agregaria por produto para calcular as quantidades vendidas
        // Aqui usaremos dados de simulação para demonstração
        
        const produtosRef = collection(db, 'produtos');
        const produtosSnap = await getDocs(produtosRef);
        
        // Dados simulados para demonstração
        const produtosMock: ProdutoVenda[] = produtosSnap.docs.map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id,
            nome: data.nome || `Produto ${index + 1}`,
            quantidade: Math.floor(Math.random() * 50) + 1, // Quantidade aleatória
            valor: Math.floor(Math.random() * 10000) / 100 // Valor aleatório entre R$ 0 e R$ 100
          };
        });
        
        // Ordenar por quantidade vendida
        produtosMock.sort((a, b) => b.quantidade - a.quantidade);
        
        // Pegar os 5 mais vendidos
        setProdutos(produtosMock.slice(0, 5));
      } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  // Formatar valor em reais
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Box 
      bg="white" 
      borderRadius="lg"
      p={5}
      boxShadow="sm"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Heading as="h3" size="md" mb={4} color="brand.500">
        Produtos Mais Vendidos
      </Heading>
      {loading ? (
        <Flex justify="center" align="center" flex="1">
          <Spinner color="brand.500" size="md" />
          <Text ml={3}>Carregando...</Text>
        </Flex>
      ) : produtos.length > 0 ? (
        <Box overflowX="auto" mt={2} flex="1">
          {/* Header Row */}
          <Flex 
            mb={2} 
            borderBottomWidth="2px" 
            borderColor="gray.200" 
            pb={2}
            fontWeight="bold"
          >
            <Box flex="2">Produto</Box>
            <Box flex="1" textAlign="right">Qtd.</Box>
            <Box flex="1" textAlign="right">Valor</Box>
          </Flex>
          
          {/* Data Rows */}
          {produtos.map((produto, index) => (
            <Flex
              key={produto.id}
              py={2}
              bg={index % 2 === 0 ? 'gray.50' : 'white'}
              borderBottomWidth="1px"
              borderColor="gray.200"
            >
              <Box flex="2" fontWeight="medium" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">{produto.nome}</Box>
              <Box flex="1" textAlign="right" fontWeight="medium">{produto.quantidade}</Box>
              <Box flex="1" textAlign="right" fontWeight="medium">{formatarValor(produto.valor)}</Box>
            </Flex>
          ))}
        </Box>
      ) : (
        <Text color="gray.500" textAlign="center" mt={8}>
          Nenhum dado de vendas encontrado.
        </Text>
      )}
    </Box>
  );
};

export default ProductSalesWidget;
