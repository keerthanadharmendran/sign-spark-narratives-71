
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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock users for demonstration
const mockUsers = [
  { id: '1', email: 'user@example.com', password: 'password', name: 'Demo User' }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API request
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            const user = mockUsers.find(
              u => u.email === email && u.password === password
            );
            
            if (user) {
              const { password, ...userWithoutPassword } = user;
              set({ 
                user: userWithoutPassword, 
                isAuthenticated: true 
              });
              resolve();
            } else {
              reject(new Error('Invalid credentials'));
            }
          }, 500);
        });
      },

      register: async (email: string, name: string, password: string) => {
        // Simulate API request
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            if (mockUsers.some(u => u.email === email)) {
              reject(new Error('User already exists'));
              return;
            }
            
            const newUser = {
              id: String(mockUsers.length + 1),
              email,
              password,
              name
            };
            
            mockUsers.push(newUser);
            
            const { password: _, ...userWithoutPassword } = newUser;
            set({ 
              user: userWithoutPassword, 
              isAuthenticated: true 
            });
            resolve();
          }, 500);
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
