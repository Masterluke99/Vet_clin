import React from 'react';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <div>
      <Link to="/" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Negocio
      </Link>
      
      <Link to="/animais" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Animais
      </Link>
      
      <Link to="/tutores" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Tutores
      </Link>
      
      <Link to="/atendimentos" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Atendimentos
      </Link>
      
      <Link to="/servicos" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Serviços
      </Link>
      
      <Link to="/produtos" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Produtos
      </Link>
      
      <Link to="/vendas" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Vendas
      </Link>
    </div>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <div style={{marginTop: '20px'}}>
      <div style={{padding: '10px', fontWeight: 'bold'}}>Relatórios</div>
      
      <Link to="/historico-atendimentos" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Histórico Atendimentos
      </Link>
      
      <Link to="/estatisticas" style={{display: 'block', padding: '10px', color: '#333', textDecoration: 'none'}}>
        Estatísticas
      </Link>
    </div>
  </React.Fragment>
);
