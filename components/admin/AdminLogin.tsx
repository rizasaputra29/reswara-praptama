// src/components/admin/AdminLogin.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft, ArrowLeft, SendToBackIcon, Users } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';

interface AdminLoginProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ username, setUsername, password, setPassword, handleLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <Card className="w-full max-w-md shadow-xl border-0">
        <Link href="/" className='relative top-4 left-4 flex items-center space-x-2' passHref>
          <ArrowLeft />
        </Link>
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
          <p className="text-gray-600 mt-2">Sign in to access the dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <Input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="h-12"
                placeholder="Enter your username"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="h-12"
                placeholder="Enter your password"
                required 
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};