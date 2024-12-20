import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Bird } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setCurrentUser } = useStore();  // Now works correctly

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simplified login logic for demo
    if (username === 'admin' && password === 'admin') {
      setCurrentUser({
        id: '1',
        name: 'Admin User',
        role: 'admin',
      });
    } else if (username === 'driver' && password === 'driver') {
      setCurrentUser({
        id: '2',
        name: 'Driver User',
        role: 'driver',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Bird className="h-12 w-12 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Poultry Manager</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo Credentials:</p>
          <p>Admin: admin / admin</p>
          <p>Driver: driver / driver</p>
        </div>
      </div>
    </div>
  );
};
