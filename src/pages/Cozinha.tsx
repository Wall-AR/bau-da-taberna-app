import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApi, Product } from '@/hooks/useApi';
import { RefreshCw, Save } from 'lucide-react';

const Cozinha = () => {
  const { user, logout } = useAuth();
  const { fetchProducts, updateStock, isLoading } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [changedItems, setChangedItems] = useState<Product[]>([]);

  if (!user || user.role !== 'cozinha') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleProductUpdate = (produto: string, quantidade: number, operacao: 'Adicionar' | 'Atualizar') => {
    const currentProduct = products.find(p => p.Produto === produto);
    if (!currentProduct) return;

    let newQuantity = quantidade;
    if (operacao === 'Adicionar') {
      newQuantity = currentProduct.Quantidade + quantidade;
    }

    // Update local state
    setProducts(prev =>
      prev.map(p =>
        p.Produto === produto ? { ...p, Quantidade: newQuantity } : p
      )
    );

    // Track changes
    setChangedItems(prev => {
      const existing = prev.find(item => item.Produto === produto);
      if (existing) {
        return prev.map(item =>
          item.Produto === produto ? { ...item, Quantidade: newQuantity } : item
        );
      }
      return [...prev, { Produto: produto, Quantidade: newQuantity }];
    });
  };

  const handleSaveChanges = async () => {
    if (changedItems.length === 0) return;
    
    const success = await updateStock(user.username, changedItems);
    if (success) {
      setChangedItems([]);
      await loadProducts(); // Refresh from server
    }
  };

  const hasLowStock = products.some(p => p.Quantidade <= 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              📦 Estoque - Cozinha
            </h1>
            {hasLowStock && (
              <span className="text-sm px-2 py-1 bg-warning/20 text-warning-foreground rounded-full animate-pulse">
                ⚠️ Itens com estoque baixo
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
            
            {changedItems.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações ({changedItems.length})
              </Button>
            )}
            
            <Navigation />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {isLoading && products.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Carregando produtos...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.Produto}
                product={product}
                mode="cozinha"
                onUpdate={handleProductUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Cozinha;