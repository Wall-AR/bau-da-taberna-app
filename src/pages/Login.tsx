import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TavernLogo } from '@/components/TavernLogo';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, Coffee, Shield, Sword } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to={user.role === 'cozinha' ? '/cozinha' : '/balcao'} replace />;
  }

  const handleLogin = async (role: 'cozinha' | 'balcao') => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    try {
      await login(username.trim(), role);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center mobile-safe-area">
      {/* Medieval background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im0xMCAxMGgxMHYxMGgtMTB6IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJtMzAgMTBoMTB2MTBoLTEweiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9nPjwvc3ZnPg==')] opacity-20" />
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <TavernLogo size="lg" showText={true} />
          <p className="mt-4 tavern-body text-muted-foreground">
            ⚔️ Sistema Medieval de Gestão de Estoque
          </p>
        </div>

        {/* Login Card */}
        <Card className="tavern-card border-tavern-gold/30 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="tavern-title text-foreground">
              🏰 Acesso à Taberna
            </CardTitle>
            <CardDescription className="tavern-body">
              Identifique-se para entrar nas dependências da taberna
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="tavern-body font-semibold text-foreground">
                👤 Nome do Guerreiro
              </label>
              <Input
                type="text"
                placeholder="Digite seu nome..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mobile-button border-tavern-gold/30 focus:border-tavern-gold font-content"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && username.trim()) {
                    handleLogin('cozinha'); // Default to kitchen on Enter
                  }
                }}
              />
            </div>

            {/* Role Selection Buttons */}
            <div className="space-y-3">
              <p className="tavern-body font-semibold text-center text-muted-foreground">
                🏛️ Escolha sua posição:
              </p>
              
              <div className="grid gap-3">
                {/* Kitchen Role */}
                <Button
                  onClick={() => handleLogin('cozinha')}
                  disabled={!username.trim() || isLoading}
                  className="mobile-button tavern-button-primary h-16 flex-col gap-2 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 border-2 border-success/30"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <ChefHat className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-medieval font-bold">🍳 Cozinha</div>
                      <div className="text-xs opacity-90 font-content">Controle de Estoque</div>
                    </div>
                  </div>
                </Button>

                {/* Counter Role */}
                <Button
                  onClick={() => handleLogin('balcao')}
                  disabled={!username.trim() || isLoading}
                  className="mobile-button tavern-button-primary h-16 flex-col gap-2 bg-gradient-to-r from-tavern-wood-medium to-tavern-wood-dark hover:from-tavern-wood-medium/90 hover:to-tavern-wood-dark/90 border-2 border-tavern-gold/30 text-tavern-cream"
                  size="lg"
                  variant="secondary"
                >
                  <div className="flex items-center gap-3">
                    <Coffee className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-medieval font-bold">🍺 Balcão</div>
                      <div className="text-xs opacity-90 font-content">Solicitações</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="mobile-loading">
                <div className="mobile-spinner"></div>
                <p className="ml-3 tavern-body text-muted-foreground">
                  🏰 Verificando credenciais...
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center space-y-2 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground font-content">
                💡 <strong>Cozinha:</strong> Gerencie o estoque dos ingredientes
              </p>
              <p className="text-xs text-muted-foreground font-content">
                💡 <strong>Balcão:</strong> Solicite ingredientes da cozinha
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span className="tavern-body text-xs">Sistema seguro da taberna</span>
            <Sword className="w-4 h-4" />
          </div>
          <p className="text-xs text-muted-foreground/60 font-content">
            Desenvolvido para a gestão medieval de estoques
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;