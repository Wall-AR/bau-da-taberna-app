import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'cozinha' | 'balcao';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Validação com os novos usuários da planilha
      const validUsers: { [key: string]: { password: string; role: 'cozinha' | 'balcao' } } = {
        'cozinha': { password: 'cozinha123', role: 'cozinha' },
        'balcao': { password: 'balcao123', role: 'balcao' },
        'Manoela': { password: 'taberna1manoela2025', role: 'cozinha' },
        'Hironer': { password: 'taberna2hironer2025', role: 'cozinha' },
        'Rosana': { password: 'taberna3rosana2025', role: 'cozinha' },
        'Ramon': { password: 'taberna4ramon2025', role: 'balcao' },
        'Gabriel': { password: 'taberna5gabriel2025', role: 'balcao' },
        'Wallace': { password: 'taberna7wallace2025', role: 'cozinha' },
      };

      const userData = validUsers[username];
      if (userData && userData.password === password) {
        
        const newUser: User = {
          id: username,
          username,
          role: userData.role,
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      }
      
      // Fallback to API call
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbwNJFT4q_KJJIz7DVBichnP30jO42NisrV77OFZKtnY1OurTb31dbv3spTgdIPDKD2IJQ/exec/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const userData = await response.json();
        const newUser: User = {
          id: userData.id || username,
          username,
          role: userData.role || (username.includes('cozinha') ? 'cozinha' : 'balcao'),
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};