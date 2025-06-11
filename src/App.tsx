import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Views - Pages
import ListaAnimaisComBusca from './views/pages/ListaAnimaisComBusca';
import ListaTutoresComBusca from './views/pages/ListaTutoresComBusca';
import ListaProdutosComBusca from './views/pages/ListaProdutosComBusca';
import ListaServicosComBusca from './views/pages/ListaServicosComBusca';
import ListaFuncionariosComBusca from './views/pages/ListaFuncionariosComBusca';
import ListaAtendimentosComBusca from './views/pages/ListaAtendimentosComBusca';
import HistoricoAtendimentosView from './views/pages/HistoricoAtendimentosView';
import PdvPage from './views/pages/PdvPage';

// Dashboard components
import Dashboard from './components/dashboard/Dashboard';
import DashboardHome from './components/dashboard/DashboardHome';
import './App.css';

// Tema personalizado para o Chakra UI inspirado no Horizon UI
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#3f51b5',
      600: '#2c387e',
      700: '#1a237e',
      800: '#0d1b4e',
      900: '#0d1b2a',
    },
    blue: {
      50: '#eff4fb',
      500: '#3965ff',
      700: '#2152ff',
    },
    navy: {
      50: '#d0dcfb',
      100: '#aac0fe',
      200: '#a3b9f8',
      300: '#728fea',
      400: '#3652ba',
      500: '#1b3bbb',
      600: '#24388a',
      700: '#1B254B',
      800: '#111c44',
      900: '#0b1437',
    },
  },
  fonts: {
    heading: "'Roboto', sans-serif",
    body: "'Roboto', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'navy.700',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: {
        p: '22px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        borderRadius: '20px',
        minWidth: '0px',
        wordWrap: 'break-word',
        bg: 'white',
        backgroundClip: 'border-box',
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard title="Gestão do Negócio"><DashboardHome /></Dashboard>} />
          
          {/* Novas rotas com componentes MVC */}
          <Route path="/animais" element={<Dashboard title="Lista de Animais"><ListaAnimaisComBusca /></Dashboard>} />
          <Route path="/tutores" element={<Dashboard title="Lista de Tutores"><ListaTutoresComBusca /></Dashboard>} />
          <Route path="/servicos" element={<Dashboard title="Lista de Serviços"><ListaServicosComBusca /></Dashboard>} />
          <Route path="/produtos" element={<Dashboard title="Lista de Produtos"><ListaProdutosComBusca /></Dashboard>} />          <Route path="/funcionarios" element={<Dashboard title="Lista de Funcionários"><ListaFuncionariosComBusca /></Dashboard>} />
          <Route path="/atendimentos" element={<Dashboard title="Lista de Atendimentos"><ListaAtendimentosComBusca /></Dashboard>} />
          <Route path="/pdv" element={<Dashboard title="PDV - Ponto de Venda"><PdvPage /></Dashboard>} />
          
          {/* Rota para o componente de relatório */}
          <Route path="/historico-atendimentos" element={<Dashboard title="Histórico de Atendimentos"><HistoricoAtendimentosView /></Dashboard>} />
          
          {/* Rota padrão de fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
