// src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { parseJwt } from '@/lib/api';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useAuth = (onSuccess: (user: User) => void) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      const userData = parseJwt(token);
      if (userData) {
        setCurrentUser(userData);
        onSuccess(userData);
      } else {
        handleLogout();
      }
    }
  }, [onSuccess]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('adminToken', token);
        const userData = parseJwt(token);
        setCurrentUser(userData);
        if (userData) {
          onSuccess(userData);
        }
      } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid credentials.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Login Error', description: 'An unexpected error occurred.' });
    }
  }, [username, password, onSuccess, toast]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setCurrentUser(null);
  }, []);

  return { currentUser, username, setUsername, password, setPassword, handleLogin, handleLogout };
};