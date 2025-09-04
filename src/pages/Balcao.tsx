import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApi, Product } from '@/hooks/useApi';
import { RefreshCw } from 'lucide-react';

const Balcao = () => {
  const { user, logout } = useAuth();
  const { fetchProducts, updateStock, isLoading } = useApi();
  const [products, setProducts] = useState<Product[]>([]);

  if (!user || user.role !== 'balcao') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleProductRequest = async (produto: string, quantidade: number) => {
    const currentProduct = products.find(p => p.Produto === produto);
    if (!currentProduct) return;

    // Calculate new quantity (subtract requested amount)
    const newQuantity = Math.max(0, currentProduct.Quantidade - quantidade);
    
    const success = await updateStock(user.username, [
      { Produto: produto, Quantidade: newQuantity }
    ]);

    if (success) {
      // Update local state
      setProducts(prev =>
        prev.map(p =>
          p.Produto === produto ? { ...p, Quantidade: newQuantity } : p
        )
      );
    }
  };

  const hasZeroStock = products.some(p => p.Quantidade === 0);

  return (
    <div className="min-h-screen balcao-theme">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              🍹 Estoque - Balcão
            </h1>
            {hasZeroStock && (
              <span className="text-sm px-2 py-1 bg-danger/20 text-danger-foreground rounded-full animate-pulse">
                🔴 Itens em falta
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadProducts}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            
            <Navigation />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {isLoading && products.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-foreground">Carregando produtos...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.Produto}
                product={product}
                mode="balcao"
                onRequest={handleProductRequest}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Balcao;