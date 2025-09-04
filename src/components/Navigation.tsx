import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, History, Package, Coffee } from 'lucide-react';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    ...(user.role === 'cozinha' ? [{
      path: '/cozinha',
      label: 'Cozinha',
      icon: Package,
    }] : []),
    ...(user.role === 'balcao' ? [{
      path: '/balcao',
      label: 'Balcão',
      icon: Coffee,
    }] : []),
    {
      path: '/historico',
      label: 'Histórico',
      icon: History,
    },
  ];

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Button
            key={item.path}
            asChild
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to={item.path}>
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          </Button>
        );
      })}
      
      <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut className="w-4 h-4 mr-2" />
        Sair
      </Button>
    </nav>
  );
};