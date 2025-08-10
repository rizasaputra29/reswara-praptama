// src/components/admin/dialogs/CategoryDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceItem } from '@/lib/types'; // Menggunakan ServiceItem sebagai ganti Category

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: ServiceItem | null;
  tempCategoryName: string;
  setTempCategoryName: (name: string) => void;
  onSubmit: (name: string, isEditing: boolean, categoryId?: number) => Promise<void>;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen, onOpenChange, editingCategory, tempCategoryName, setTempCategoryName, onSubmit
}) => {
  const handleSubmit = async () => {
    await onSubmit(tempCategoryName, !!editingCategory, editingCategory?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{editingCategory ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Update the name of the service category.' : 'Add a new service category for your projects.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
            <Input placeholder="Enter service name" value={tempCategoryName} onChange={(e) => setTempCategoryName(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Service</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};