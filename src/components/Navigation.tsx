import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, History, ChefHat, Coffee, Sun, Moon, Sword, Shield } from 'lucide-react';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    ...(user.role === 'cozinha' ? [{
      path: '/cozinha',
      label: '🍳 Cozinha',
      icon: ChefHat,
    }] : []),
    ...(user.role === 'balcao' ? [{
      path: '/balcao',
      label: '🍺 Balcão',
      icon: Coffee,
    }] : []),
    {
      path: '/historico',
      label: '📜 Histórico',
      icon: History,
    },
  ];

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Button
            key={item.path}
            asChild
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            className="mobile-touch-target tavern-button-primary"
          >
            <Link to={item.path} className="flex items-center gap-1 sm:gap-2">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline font-content">{item.label}</span>
              <span className="sm:hidden">{item.label.split(' ')[0]}</span>
            </Link>
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="mobile-touch-target flex items-center gap-1 sm:gap-2 border-tavern-gold/30"
        title={theme === 'light' ? 'Modo Taverna Escura' : 'Modo Cozinha Clara'}
      >
        {theme === 'light' ? (
          <Shield className="w-4 h-4 text-tavern-wood-dark" />
        ) : (
          <Sword className="w-4 h-4 text-tavern-gold" />
        )}
        <span className="hidden md:inline font-content">
          {theme === 'light' ? '🌙 Taverna' : '☀️ Cozinha'}
        </span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={logout}
        className="mobile-touch-target text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
        title="Sair da Taberna"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline ml-1 sm:ml-2 font-content">Sair</span>
      </Button>
    </nav>
  );
};