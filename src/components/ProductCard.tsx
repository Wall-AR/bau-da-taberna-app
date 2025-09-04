import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/hooks/useApi';
import { getProductImage } from '@/utils/productImages';

interface ProductCardProps {
  product: Product;
  mode: 'cozinha' | 'balcao';
  onUpdate?: (produto: string, quantidade: number, operacao: 'Adicionar' | 'Atualizar') => void;
  onRequest?: (produto: string, quantidade: number) => void;
}

export const ProductCard = ({ product, mode, onUpdate, onRequest }: ProductCardProps) => {
  const [inputValue, setInputValue] = useState(0);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'stock-danger';
    if (quantity <= 3) return 'stock-warning';
    return 'stock-success';
  };

  const getStockIcon = (quantity: number) => {
    if (quantity === 0) return '🔴';
    if (quantity <= 3) return '🟡';
    return '🟢';
  };

  const handleAdd = () => {
    if (inputValue > 0 && onUpdate) {
      onUpdate(product.Produto, inputValue, 'Adicionar');
      setInputValue(0);
    }
  };

  const handleUpdate = () => {
    if (inputValue >= 0 && onUpdate) {
      onUpdate(product.Produto, inputValue, 'Atualizar');
      setInputValue(0);
    }
  };

  const handleRequest = () => {
    if (inputValue > 0 && onRequest) {
      onRequest(product.Produto, inputValue);
      setInputValue(0);
    }
  };

  // Não renderizar se o produto não tem nome válido
  if (!product.Produto || product.Produto.trim() === '') {
    return null;
  }

  return (
    <Card className={`border-2 transition-all duration-300 ${getStockStatus(product.Quantidade)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <img 
            src={getProductImage(product.Produto)} 
            alt={product.Produto}
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <CardTitle className="text-lg flex items-center gap-2 flex-1">
            <span>{getStockIcon(product.Quantidade)}</span>
            {product.Produto}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm font-medium opacity-70">Quantidade Atual</p>
          <p className="text-3xl font-bold">{product.Quantidade}</p>
        </div>

        <div className="space-y-2">
          <Input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            placeholder={mode === 'cozinha' ? 'Quantidade' : 'Solicitar'}
            className="text-center"
          />

          {mode === 'cozinha' ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAdd}
                disabled={inputValue <= 0}
                className="flex-1"
              >
                Adicionar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdate}
                disabled={inputValue < 0}
                className="flex-1"
              >
                Atualizar
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleRequest}
              disabled={inputValue <= 0}
              className="w-full"
            >
              Enviar Solicitação
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};