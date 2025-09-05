import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { ProductCard } from '@/components/ProductCard';
import { TavernLogo } from '@/components/TavernLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useApi, Product } from '@/hooks/useApi';
import { RefreshCw, AlertTriangle, ChefHat, Package, Save } from 'lucide-react';
import { toast } from 'sonner';

const Cozinha = () => {
  const { user } = useAuth();
  const { fetchProducts, updateStock, isLoading } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [changedItems, setChangedItems] = useState<{ [key: string]: number }>({});

  if (!user || user.role !== 'cozinha') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
    setChangedItems({}); // Clear changes when reloading
  };

  const handleProductUpdate = (productName: string, newQuantity: number) => {
    // Update local state
    setProducts(prevProducts =>
      prevProducts.map(product => {
        const name = product.Produto || product.Nome || '';
        return name === productName
          ? { ...product, Quantidade: newQuantity }
          : product;
      })
    );

    // Track changes
    setChangedItems(prev => ({
      ...prev,
      [productName]: newQuantity
    }));
  };

  const handleSaveChanges = async () => {
    if (Object.keys(changedItems).length === 0) {
      toast.info('⚡ Nenhuma alteração para salvar');
      return;
    }

    try {
      await updateStock(changedItems);
      toast.success(`⚔️ ${Object.keys(changedItems).length} produtos atualizados com sucesso!`);
      setChangedItems({});
      await loadProducts(); // Reload to get fresh data
    } catch (error) {
      toast.error('❌ Erro ao salvar alterações');
      console.error('Error saving changes:', error);
    }
  };

  // Count products with low stock
  const lowStockCount = products.filter(product => (product.Quantidade || 0) <= 5).length;
  const outOfStockCount = products.filter(product => (product.Quantidade || 0) === 0).length;
  const changedCount = Object.keys(changedItems).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="mobile-header">
        <div className="mobile-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TavernLogo size="md" showText={false} />
              <div>
                <h1 className="mobile-title-responsive text-foreground flex items-center gap-2">
                  <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
                  🍳 Cozinha da Taberna
                </h1>
                <p className="mobile-text-responsive text-muted-foreground">
                  ⚔️ {user.username} • Controle de Estoque
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Save Changes Button */}
              {changedCount > 0 && (
                <Button
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  className="mobile-button tavern-button-primary flex-1 sm:flex-none animate-pulse"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span className="font-content">💾 Salvar ({changedCount})</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadProducts}
                disabled={isLoading}
                className="mobile-button flex-1 sm:flex-none"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="font-content">🔄 Atualizar</span>
              </Button>
              
              <Navigation />
            </div>
          </div>
        </div>
      </header>

      {/* Alert Section */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="mobile-container py-4">
          <Card className="tavern-card border-l-4 border-l-warning bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="tavern-subtitle text-warning">🚨 Atenção na Cozinha!</h3>
                  <div className="space-y-1">
                    {outOfStockCount > 0 && (
                      <p className="mobile-text-responsive text-foreground">
                        <Badge variant="destructive" className="mr-2">⚔️ {outOfStockCount}</Badge>
                        produtos <strong>sem estoque</strong>
                      </p>
                    )}
                    {lowStockCount > 0 && (
                      <p className="mobile-text-responsive text-foreground">
                        <Badge variant="secondary" className="mr-2">⚠️ {lowStockCount}</Badge>
                        produtos com <strong>estoque baixo</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="mobile-main">
        <div className="mobile-container">
          {isLoading && products.length === 0 ? (
            <div className="mobile-loading">
              <div className="mobile-spinner"></div>
              <p className="ml-3 mobile-text-responsive text-muted-foreground">
                📦 Carregando arsenal da cozinha...
              </p>
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <Card className="tavern-card p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary font-medieval">
                    {products.length}
                  </div>
                  <div className="text-xs text-muted-foreground font-content">
                    🍔 Total Items
                  </div>
                </Card>
                
                <Card className="tavern-card p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-success font-medieval">
                    {products.filter(p => (p.Quantidade || 0) > 5).length}
                  </div>
                  <div className="text-xs text-muted-foreground font-content">
                    ✅ Estoque OK
                  </div>
                </Card>
                
                <Card className="tavern-card p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-warning font-medieval">
                    {lowStockCount - outOfStockCount}
                  </div>
                  <div className="text-xs text-muted-foreground font-content">
                    ⚠️ Estoque Baixo
                  </div>
                </Card>
                
                <Card className="tavern-card p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-danger font-medieval">
                    {outOfStockCount}
                  </div>
                  <div className="text-xs text-muted-foreground font-content">
                    🚨 Sem Estoque
                  </div>
                </Card>
              </div>

              {/* Products Grid */}
              <div className="mobile-card-grid">
                {products.map((product, index) => (
                  <ProductCard
                    key={`${product.Produto || product.Nome}-${index}`}
                    product={product}
                    mode="cozinha"
                    onUpdate={handleProductUpdate}
                  />
                ))}
              </div>

              {products.length === 0 && !isLoading && (
                <Card className="tavern-card">
                  <CardContent className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="tavern-subtitle text-muted-foreground mb-2">Arsenal da Cozinha Vazio</p>
                    <p className="mobile-text-responsive text-muted-foreground">
                      Não há produtos cadastrados no momento
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cozinha;