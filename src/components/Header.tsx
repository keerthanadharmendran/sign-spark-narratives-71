
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../services/authService';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">Sign Sync</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                Welcome, {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => {
                logout();
                navigate('/login');
              }}>
                Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>
              <LogIn size={16} className="mr-2" /> Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
