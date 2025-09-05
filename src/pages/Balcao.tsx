import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { ProductCard } from '@/components/ProductCard';
import { TavernLogo } from '@/components/TavernLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useApi, Product } from '@/hooks/useApi';
import { RefreshCw, Coffee, AlertTriangle, Package } from 'lucide-react';
import { toast } from 'sonner';

const Balcao = () => {
  const { user } = useAuth();
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

  const handleProductRequest = async (productName: string, quantity: number) => {
    const product = products.find(p => (p.Produto || p.Nome) === productName);
    if (!product) return;

    const currentQuantity = product.Quantidade || 0;
    const newQuantity = Math.max(0, currentQuantity - quantity);
    
    try {
      await updateStock({ [productName]: newQuantity });
      
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(p => {
          const name = p.Produto || p.Nome || '';
          return name === productName
            ? { ...p, Quantidade: newQuantity }
            : p;
        })
      );

      toast.success(`🏹 Solicitado: ${quantity} unidades de ${productName}`);
    } catch (error) {
      toast.error('❌ Erro ao processar solicitação');
      console.error('Error updating stock:', error);
    }
  };

  // Calculate stats
  const outOfStockCount = products.filter(product => (product.Quantidade || 0) === 0).length;
  const lowStockCount = products.filter(product => {
    const quantity = product.Quantidade || 0;
    return quantity <= 5 && quantity > 0;
  }).length;
  const availableCount = products.filter(product => (product.Quantidade || 0) > 5).length;

  return (
    <div className="min-h-screen bg-background balcao-theme">
      {/* Header */}
      <header className="mobile-header">
        <div className="mobile-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TavernLogo size="md" showText={false} />
              <div>
                <h1 className="mobile-title-responsive text-foreground flex items-center gap-2">
                  <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-tavern-gold" />
                  🍺 Balcão da Taberna
                </h1>
                <p className="mobile-text-responsive text-muted-foreground">
                  ⚔️ {user.username} • Solicitações
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={loadProducts}
                disabled={isLoading}
                className="mobile-button flex-1 sm:flex-none border-tavern-gold/30"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="font-content">🔄 Atualizar</span>
              </Button>
              
              <Navigation />
            </div>
          </div>
        </div>
      </header>

      {/* Critical Stock Alert */}
      {outOfStockCount > 0 && (
        <div className="mobile-container py-4">
          <Card className="tavern-card border-l-4 border-l-danger bg-danger/5 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-2">
                  <h3 className="tavern-subtitle text-danger">🚨 Alerta Crítico!</h3>
                  <p className="mobile-text-responsive text-foreground">
                    <Badge variant="destructive" className="mr-2 animate-pulse">⚔️ {outOfStockCount}</Badge>
                    ingredientes <strong>completamente esgotados</strong>
                  </p>
                  <p className="text-xs text-muted-foreground font-content">
                    Contate a cozinha para reposição urgente
                  </p>
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
              <div className="mobile-spinner border-tavern-gold border-t-transparent"></div>
              <p className="ml-3 mobile-text-responsive text-muted-foreground">
                🍺 Verificando despensa da taberna...
              </p>
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <Card className="tavern-card p-3 text-center bg-gradient-to-br from-card to-card/50">
                  <div className="text-2xl sm:text-3xl font-bold text-tavern-gold font-medieval">
                    {products.length}
                  </div>
                  <div className="text-xs text-muted-foreground font-content">
                    🍔 Ingredientes
                  </div>
                </Card>
                
                <Card className="tavern-card p-3 text-center bg-gradient-to-br from-success/20 to-success/5">
                  <div className="text-2xl sm:text-3xl font-bold text-success font-medieval">
                    {availableCount}
                  </div>
                  <div className="text-xs text-muted-foreground font-content">
                    ✅ Disponíveis
                  </div>
                </Card>
                
                <Card className="tavern-card p-3 text-center bg-gradient-to-br from-warning/20 to-warning/5">
                  <div className="text-2xl sm:text-3xl font-bold text-warning font-medieval">
                    {lowStockCount}
                  </div>
                  <div className="text-xs text-muted-foreground font-content">
                    ⚠️ Poucos
                  </div>
                </Card>
                
                <Card className="tavern-card p-3 text-center bg-gradient-to-br from-danger/20 to-danger/5">
                  <div className="text-2xl sm:text-3xl font-bold text-danger font-medieval">
                    {outOfStockCount}
                  </div>
                  <div className="text-xs text-muted-foreground font-content">
                    🚨 Esgotados
                  </div>
                </Card>
              </div>

              {/* Products Grid */}
              <div className="mobile-card-grid">
                {products.map((product, index) => (
                  <ProductCard
                    key={`${product.Produto || product.Nome}-${index}`}
                    product={product}
                    mode="balcao"
                    onRequest={handleProductRequest}
                  />
                ))}
              </div>

              {products.length === 0 && !isLoading && (
                <Card className="tavern-card">
                  <CardContent className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="tavern-subtitle text-muted-foreground mb-2">Despensa Vazia</p>
                    <p className="mobile-text-responsive text-muted-foreground">
                      Não há ingredientes cadastrados no momento
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

export default Balcao;