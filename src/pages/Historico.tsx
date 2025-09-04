import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApi, HistoryItem } from '@/hooks/useApi';
import { RefreshCw, Search, History } from 'lucide-react';

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
      case 'Adicionar': return '➕';
      case 'Atualizar': return '📝';
      case 'Solicitar': return '📤';
      default: return '📋';
    }
  };

  const getOperationColor = (operacao: string) => {
    switch (operacao) {
      case 'Adicionar': return 'text-green-600 bg-green-50 border-green-200';
      case 'Atualizar': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Solicitar': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <History className="w-6 h-6" />
            📜 Histórico de Alterações
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadHistory}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            
            <Navigation />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto p-4 border-b border-border bg-card/50">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por produto" />
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
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os usuários</SelectItem>
              {uniqueUsers.map(user => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {isLoading && history.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Carregando histórico...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum registro encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getOperationIcon(item.Operacao)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOperationColor(item.Operacao)}`}>
                          {item.Operacao}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">{item.Produto}</p>
                        <p className="text-sm text-muted-foreground">
                          por {item.Usuario} • {item.Data}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">{item.Quantidade}</p>
                      <p className="text-xs text-muted-foreground">unidades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Historico;