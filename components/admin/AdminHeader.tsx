// src/components/admin/AdminHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { User } from '@/lib/types';

interface AdminHeaderProps {
  currentUser: User;
  handleLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ currentUser, handleLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">{currentUser.username} ({currentUser.role})</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};