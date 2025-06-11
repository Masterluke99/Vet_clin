import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Image } from '@chakra-ui/react';

// Importando ícones personalizados
import petIcon from './icones/pets.png';
import tutorIcon from './icones/tutor.png';
import servicosIcon from './icones/servicos.png';
import atendimentosIcon from './icones/atendimentos.png';
import historicoIcon from './icones/historico.png';
import produtosIcon from './icones/produtos.png';
import vendasIcon from './icones/vendas.png';
import negocioIcon from './icones/negocio.png';
  
// Cores do tema verde
const primaryGreen = '#2C7A51';
const secondaryGreen = '#256A45';
const textColor = 'white';

const menuStyle: React.CSSProperties = {
  width: 260,
  minHeight: '100vh',
  background: primaryGreen,
  color: textColor,
  padding: 0,
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 100,
  boxShadow: '0px 0px 20px rgba(0,0,0,0.1)',
};

const SideMenu: React.FC = () => {  const links = [
    { to: '/', label: 'Cadastro de Animal', icon: petIcon },
    { to: '/animais', label: 'Lista de Animais', icon: petIcon },
    { to: '/servicos', label: 'Cadastro de Serviço', icon: servicosIcon },
    { to: '/atendimentos', label: 'Registrar Atendimento', icon: atendimentosIcon },
    { to: '/historico', label: 'Histórico de Atendimentos', icon: historicoIcon },
    { to: '/funcionarios', label: 'Cadastro de Funcionário', icon: negocioIcon },
    { to: '/produtos', label: 'Lista de Produtos', icon: produtosIcon },
    { to: '/pdv', label: 'PDV - Ponto de Venda', icon: vendasIcon },
    { to: '/tutores', label: 'Cadastro de Tutor/Cliente', icon: tutorIcon },
  ];
  
  return (
    <nav style={menuStyle}>
      <Box as="div" fontWeight="bold" fontSize={22} p="24px 24px 12px 24px" 
           borderBottom={`2px solid ${textColor}`} mb={2}>
        VetClin
      </Box>
      
      {links.map(link => (        <NavLink 
          key={link.to} 
          to={link.to} 
          style={({ isActive }) => ({
            color: textColor,
            textDecoration: 'none',
            padding: '14px 20px',
            fontSize: 16,
            borderBottom: `1px solid ${secondaryGreen}`,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            background: isActive ? secondaryGreen : 'transparent',
            boxShadow: isActive ? 'inset 4px 0 0 white' : 'none',
          })} 
          end={link.to === '/'}
        >
          <Image src={link.icon} alt={link.label} boxSize="18px" mr={3} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default SideMenu;