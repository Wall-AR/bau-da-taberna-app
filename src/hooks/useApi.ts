import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwNJFT4q_KJJIz7DVBichnP30jO42NisrV77OFZKtnY1OurTb31dbv3spTgdIPDKD2IJQ/exec';

export interface Product {
  Produto?: string;
  Nome?: string;
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
      console.log('Buscando produtos no backend...');
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      console.log('Dados brutos recebidos:', data);
      
      // Filtrar produtos válidos (não vazios)
      const validProducts = data.filter((item: any) => 
        item.Produto && 
        item.Produto.trim() !== '' && 
        typeof item.Quantidade !== 'undefined' &&
        item.Quantidade !== '' &&
        item.Quantidade !== null
      ).map((item: any) => ({
        Produto: item.Produto.trim(),
        Quantidade: parseInt(item.Quantidade) || 0
      }));
      
      console.log('Produtos válidos filtrados:', validProducts);
      
      if (validProducts.length === 0) {
        console.log('Nenhum produto válido encontrado. Tentando endpoint alternativo...');
        
        // Tentar endpoint com parâmetro específico para produtos
        const altResponse = await fetch(`${API_BASE_URL}?action=produtos`);
        if (altResponse.ok) {
          const altData = await altResponse.json();
          console.log('Dados do endpoint alternativo:', altData);
          
          const altValidProducts = altData.filter((item: any) => 
            item.Produto && 
            item.Produto.trim() !== ''
          ).map((item: any) => ({
            Produto: item.Produto.trim(),
            Quantidade: parseInt(item.Quantidade) || 0
          }));
          
          if (altValidProducts.length > 0) {
            return altValidProducts;
          }
        }
      }
      
      return validProducts;
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

  const updateStock = useCallback(async (items: { [key: string]: number }): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Enviando dados para o backend:', { items });
      
      // Tentativa 1: POST direto
      try {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update',
            items,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Resposta do backend:', result);
          toast({
            title: 'Sucesso',
            description: 'Estoque atualizado com sucesso',
          });
          return true;
        }
      } catch (corsError) {
        console.log('CORS error, tentando método alternativo:', corsError);
      }

      // Tentativa 2: GET com parâmetros na URL (workaround para CORS)
      const params = new URLSearchParams({
        action: 'update',
        data: JSON.stringify(items)
      });
      
      const urlWithParams = `${API_BASE_URL}?${params.toString()}`;
      console.log('Tentando URL alternativa:', urlWithParams);
      
      const response = await fetch(urlWithParams, {
        method: 'GET',
      });

      if (response.ok) {
        console.log('Atualização via GET bem-sucedida');
        toast({
          title: 'Sucesso',
          description: 'Estoque atualizado com sucesso',
        });
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Erro',
        description: `Falha ao atualizar estoque: ${error}`,
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
      const response = await fetch(`${API_BASE_URL}?action=historico`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      
      // Filtrar histórico válido
      const validHistory = data.filter((item: any) => 
        item.Data && 
        item.Usuario && 
        item.Produto && 
        item.Operacao
      );
      
      return validHistory;
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