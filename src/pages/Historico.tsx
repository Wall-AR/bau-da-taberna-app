import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { TavernLogo } from '@/components/TavernLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useApi, HistoryItem } from '@/hooks/useApi';
import { RefreshCw, Search, History, Scroll, Plus, Edit, Send } from 'lucide-react';

const Historico = () => {
  const { user, logout } = useAuth();
  const { fetchHistory, isLoading } = useApi();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [productFilter, setProductFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await fetchHistory();
    setHistory(data);
  };

  const uniqueProducts = useMemo(() => {
    return Array.from(new Set(history.map(item => item.Produto))).sort();
  }, [history]);

  const uniqueUsers = useMemo(() => {
    return Array.from(new Set(history.map(item => item.Usuario))).sort();
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesProduct = !productFilter || item.Produto === productFilter;
      const matchesUser = !userFilter || item.Usuario === userFilter;
      const matchesSearch = !searchTerm || 
        item.Produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Operacao.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesProduct && matchesUser && matchesSearch;
    });
  }, [history, productFilter, userFilter, searchTerm]);

  const getOperationIcon = (operacao: string) => {
    switch (operacao) {
      case 'Adicionar': return Plus;
      case 'Atualizar': return Edit;
      case 'Solicitar': return Send;
      default: return Scroll;
    }
  };

  const getOperationColor = (operacao: string) => {
    switch (operacao) {
      case 'Adicionar': return 'text-success bg-success/10 border-success/30';
      case 'Atualizar': return 'text-primary bg-primary/10 border-primary/30';
      case 'Solicitar': return 'text-warning bg-warning/10 border-warning/30';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getOperationEmoji = (operacao: string) => {
    switch (operacao) {
      case 'Adicionar': return '⚔️';
      case 'Atualizar': return '🛡️';
      case 'Solicitar': return '🏹';
      default: return '📜';
    }
  };

  return (
    <div className="min-h-screen bg-background mobile-safe-area">
      {/* Header */}
      <header className="tavern-header sticky top-0 z-10 mb-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <TavernLogo size="md" showText={false} />
            <div>
              <h1 className="tavern-title text-foreground flex items-center gap-2">
                <Scroll className="w-6 h-6 sm:w-8 sm:h-8 text-tavern-gold" />
                📜 Crônicas da Taberna
              </h1>
              <p className="tavern-body text-muted-foreground">
                Registros das batalhas do estoque
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadHistory}
              disabled={isLoading}
              className="mobile-touch-target tavern-button-primary flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-content">Atualizar</span>
            </Button>
            
            <Navigation />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="tavern-card">
          <CardHeader className="pb-4">
            <CardTitle className="tavern-subtitle flex items-center gap-2">
              🔍 Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="🔍 Pesquisar nas crônicas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-content border-tavern-gold/30 focus:border-tavern-gold"
                />
              </div>
              
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="border-tavern-gold/30 focus:border-tavern-gold">
                  <SelectValue placeholder="🍔 Filtrar por produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os produtos</SelectItem>
                  {uniqueProducts.map(product => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="border-tavern-gold/30 focus:border-tavern-gold">
                  <SelectValue placeholder="👤 Filtrar por guerreiro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os guerreiros</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {isLoading && history.length === 0 ? (
          <Card className="tavern-card">
            <CardContent className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-tavern-gold border-t-transparent rounded-full mx-auto mb-6" />
              <p className="tavern-body text-muted-foreground">📜 Consultando as crônicas antigas...</p>
            </CardContent>
          </Card>
        ) : filteredHistory.length === 0 ? (
          <Card className="tavern-card">
            <CardContent className="text-center py-12">
              <Scroll className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="tavern-subtitle text-muted-foreground mb-2">Nenhuma crônica encontrada</p>
              <p className="tavern-body text-muted-foreground">
                Não há registros que correspondam aos filtros aplicados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => {
              const OperationIcon = getOperationIcon(item.Operacao);
              return (
                <Card key={index} className="tavern-card hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getOperationEmoji(item.Operacao)}</div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <OperationIcon className="w-5 h-5 text-muted-foreground" />
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getOperationColor(item.Operacao)} font-content`}>
                              {item.Operacao}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="tavern-subtitle truncate">{item.Produto}</p>
                          <p className="tavern-body text-muted-foreground">
                            <span className="font-medium">⚔️ {item.Usuario}</span> • 📅 {item.Data}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-right bg-primary/10 rounded-lg p-3 border border-primary/20 min-w-[80px]">
                        <p className="font-bold text-xl sm:text-2xl text-primary font-medieval">{item.Quantidade}</p>
                        <p className="text-xs text-muted-foreground font-content uppercase tracking-wider">unidades</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Loading more indicator */}
            {isLoading && history.length > 0 && (
              <Card className="tavern-card">
                <CardContent className="text-center py-6">
                  <div className="animate-spin w-6 h-6 border-2 border-tavern-gold border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="tavern-body text-muted-foreground">Carregando mais crônicas...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Historico;