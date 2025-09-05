import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, Plus, Minus } from 'lucide-react';
import { Product } from '@/hooks/useApi';
import { getProductImage } from '@/utils/productImages';

interface ProductCardProps {
  product: Product;
  mode: 'cozinha' | 'balcao';
  onUpdate?: (productName: string, newQuantity: number) => void;
  onRequest?: (productName: string, quantity: number) => void;
}

export const ProductCard = ({ product, mode, onUpdate, onRequest }: ProductCardProps) => {
  const [inputValue, setInputValue] = useState(product.Quantidade?.toString() || '0');

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'danger';
    if (quantity <= 5) return 'warning';
    return 'success';
  };

  const getStockIcon = (quantity: number) => {
    if (quantity === 0) return '🚨';
    if (quantity <= 5) return '⚠️';
    return '✅';
  };

  const getStockMessage = (quantity: number) => {
    if (quantity === 0) return 'SEM ESTOQUE!';
    if (quantity <= 5) return 'ESTOQUE BAIXO';
    return 'ESTOQUE OK';
  };

  const handleAdd = () => {
    const newQuantity = (product.Quantidade || 0) + 1;
    onUpdate?.(product.Produto || product.Nome || '', newQuantity);
    setInputValue(newQuantity.toString());
  };

  const handleUpdate = () => {
    const quantity = parseInt(inputValue);
    if (!isNaN(quantity) && quantity >= 0) {
      onUpdate?.(product.Produto || product.Nome || '', quantity);
    }
  };

  const handleRequest = () => {
    const quantity = parseInt(inputValue);
    if (!isNaN(quantity) && quantity > 0) {
      onRequest?.(product.Produto || product.Nome || '', quantity);
    }
  };

  const productName = product.Produto || product.Nome || '';
  const productQuantity = product.Quantidade || 0;
  const stockStatus = getStockStatus(productQuantity);

  // Skip rendering if product name is invalid
  if (!productName || productName.trim() === '') {
    return null;
  }

  return (
    <Card className="mobile-card tavern-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        {/* Product Image */}
        <div className="product-image-container mb-3">
          <img
            src={getProductImage(productName)}
            alt={`${productName} - Ingrediente da taberna`}
            className="product-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center';
            }}
          />
          {/* Stock overlay */}
          <div className="absolute top-2 right-2">
            <Badge 
              variant={stockStatus === 'danger' ? 'destructive' : stockStatus === 'warning' ? 'secondary' : 'default'}
              className="text-xs font-bold shadow-md"
            >
              {getStockIcon(productQuantity)} {productQuantity}
            </Badge>
          </div>
        </div>

        <CardTitle className="tavern-subtitle text-center mb-2">
          {productName}
        </CardTitle>
        
        {/* Stock Status */}
        <div className={`text-center p-2 rounded-md border-2 ${
          stockStatus === 'danger' ? 'stock-danger' : 
          stockStatus === 'warning' ? 'stock-warning' : 'stock-success'
        }`}>
          <div className="flex items-center justify-center gap-2">
            {stockStatus === 'danger' && <AlertTriangle className="w-4 h-4 animate-pulse" />}
            <span className="font-bold text-sm">
              {getStockMessage(productQuantity)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Quantity Input */}
        <div className="space-y-2">
          <label className="tavern-body font-semibold text-muted-foreground">
            {mode === 'cozinha' ? '📦 Quantidade em estoque:' : '🍽️ Solicitar quantidade:'}
          </label>
          <div className="flex items-center gap-2">
            {mode === 'cozinha' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newVal = Math.max(0, parseInt(inputValue) - 1);
                  setInputValue(newVal.toString());
                }}
                className="mobile-button flex-shrink-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
            )}
            
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              min="0"
              className="text-center font-bold text-lg border-tavern-gold/30 focus:border-tavern-gold"
              placeholder="0"
            />
            
            {mode === 'cozinha' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdd}
                className="mobile-button flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={mode === 'cozinha' ? handleUpdate : handleRequest}
          className="w-full mobile-button tavern-button-primary font-medieval font-bold"
          variant={mode === 'cozinha' ? 'default' : 'secondary'}
          disabled={!inputValue || parseInt(inputValue) < 0 || (mode === 'balcao' && parseInt(inputValue) === 0)}
        >
          <Package className="w-4 h-4 mr-2" />
          {mode === 'cozinha' ? '⚔️ Atualizar Estoque' : '🏹 Solicitar ao Estoque'}
        </Button>

        {/* Current vs New Display for Cozinha */}
        {mode === 'cozinha' && inputValue !== productQuantity.toString() && (
          <div className="text-center p-2 bg-primary/10 rounded-md border border-primary/20">
            <p className="text-xs text-muted-foreground">Alteração:</p>
            <p className="font-bold">
              <span className="text-muted-foreground">{productQuantity}</span>
              <span className="mx-2">→</span>
              <span className="text-primary">{inputValue}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};