import { useState, useEffect } from 'react';
import { Produto, ProdutoFormValues } from '../../models/types/ProdutoTypes';
import { ProdutoService } from '../../models/services/ProdutoService';

export const useProduto = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchProdutos();
  }, []);
  
  // Buscar todos os produtos
  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const data = await ProdutoService.getProdutos();
      setProdutos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar produtos');
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Adicionar novo produto
  const addProduto = async (produtoData: ProdutoFormValues) => {
    try {
      const newProduto = await ProdutoService.addProduto(produtoData);
      setProdutos(prev => [...prev, newProduto]);
      return newProduto;
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar produto');
      console.error('Erro ao adicionar produto:', err);
      throw err;
    }
  };
  
  // Atualizar produto existente
  const updateProduto = async (id: string, produtoData: Partial<ProdutoFormValues>) => {
    try {
      await ProdutoService.updateProduto(id, produtoData);
      setProdutos(prev =>
        prev.map(produto => (produto.id === id ? { ...produto, ...produtoData } : produto))
      );
      return id;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar produto');
      console.error('Erro ao atualizar produto:', err);
      throw err;
    }
  };
  
  // Deletar produto
  const deleteProduto = async (id: string) => {
    try {
      await ProdutoService.deleteProduto(id);
      setProdutos(prev => prev.filter(produto => produto.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar produto');
      console.error('Erro ao deletar produto:', err);
      throw err;
    }
  };
  
  // Buscar produtos com termo de busca
  const searchProdutos = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return fetchProdutos();
    }
    
    setLoading(true);
    try {
      const data = await ProdutoService.getProdutosBySearch(searchTerm);
      setProdutos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar produtos');
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    produtos,
    loading,
    error,
    fetchProdutos,
    addProduto,
    updateProduto,
    deleteProduto,
    searchProdutos
  };
};
