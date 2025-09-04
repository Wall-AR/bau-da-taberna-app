// Update this page (the content is just a fallback if you fail to update the page)

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  // Redirect based on user role or to login if not authenticated
  if (user) {
    return <Navigate to={user.role === 'cozinha' ? '/cozinha' : '/balcao'} replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
