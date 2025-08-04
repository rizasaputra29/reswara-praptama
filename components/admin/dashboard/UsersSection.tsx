// src/components/admin/dashboard/UsersSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Users, Trash2 } from 'lucide-react';
import { Employee } from '@/lib/types';

interface UsersSectionProps {
  employees: Employee[];
  handleAddEmployee: () => void;
  handleDeleteEmployee: (id: number) => Promise<void>;
  setAddEmployeeDialogOpen: (open: boolean) => void;
}

export const UsersSection: React.FC<UsersSectionProps> = ({ employees, handleDeleteEmployee, setAddEmployeeDialogOpen }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">User Management</CardTitle>
            <CardDescription>Manage employee accounts and permissions</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setAddEmployeeDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-1"/>
                Add Employee
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {employees.length > 0 ? (
          <div className="space-y-2">
            {employees.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{emp.username}</p>
                    <p className="text-sm text-gray-500">Employee</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(emp.id)}>
                  <Trash2 className="h-4 w-4 text-red-500"/>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No employees yet</p>
            <p className="text-sm text-gray-400 mb-4">Start by adding your first employee</p>
            <Button onClick={() => setAddEmployeeDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};