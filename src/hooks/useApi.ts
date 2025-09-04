import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwNJFT4q_KJJIz7DVBichnP30jO42NisrV77OFZKtnY1OurTb31dbv3spTgdIPDKD2IJQ/exec';

export interface Product {
  Produto: string;
  Quantidade: number;
}

export interface HistoryItem {
  Data: string;
  Usuario: string;
  Produto: string;
  Operacao: 'Adicionar' | 'Atualizar' | 'Solicitar';
  Quantidade: number;
}

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar produtos',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateStock = useCallback(async (user: string, items: Product[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      toast({
        title: 'Sucesso',
        description: 'Estoque atualizado com sucesso',
      });
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar estoque',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchHistory = useCallback(async (): Promise<HistoryItem[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/historico`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar histórico',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    fetchProducts,
    updateStock,
    fetchHistory,
    isLoading,
  };
};