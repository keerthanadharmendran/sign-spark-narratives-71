
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: Array<{ id: string; email: string; password: string; name: string }>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

// Load users from localStorage or use default mock user
const getInitialUsers = (): Array<{ id: string; email: string; password: string; name: string }> => {
  const storedUsers = localStorage.getItem('auth-users');
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (error) {
      console.error('Error parsing stored users:', error);
    }
  }
  
  // Return default user if no stored users
  return [
    { id: '1', email: 'user@example.com', password: 'password', name: 'Demo User' }
  ];
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: getInitialUsers(),

      login: async (email: string, password: string) => {
        // Get latest users array from state
        const { users } = get();
        
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            const user = users.find(
              u => u.email === email && u.password === password
            );
            
            if (user) {
              const { password: _, ...userWithoutPassword } = user;
              set({ 
                user: userWithoutPassword, 
                isAuthenticated: true 
              });
              
              // Update localStorage manually for immediate persistence
              localStorage.setItem('auth-users', JSON.stringify(users));
              
              resolve();
            } else {
              reject(new Error('Invalid credentials'));
            }
          }, 500);
        });
      },

      register: async (email: string, name: string, password: string) => {
        // Get latest users array from state
        const { users } = get();
        
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            if (users.some(u => u.email === email)) {
              reject(new Error('User already exists'));
              return;
            }
            
            const newUser = {
              id: String(users.length + 1),
              email,
              password,
              name
            };
            
            const updatedUsers = [...users, newUser];
            
            // Update users array in state
            const { password: _, ...userWithoutPassword } = newUser;
            set({ 
              user: userWithoutPassword, 
              isAuthenticated: true,
              users: updatedUsers
            });
            
            // Update localStorage manually for immediate persistence
            localStorage.setItem('auth-users', JSON.stringify(updatedUsers));
            
            resolve();
          }, 500);
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      // Only store the authentication state, not the users array
      // This is handled manually for better control
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
