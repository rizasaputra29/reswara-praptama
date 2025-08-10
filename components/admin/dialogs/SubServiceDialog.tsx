// src/components/admin/dialogs/SubServiceDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { SubServiceDraft } from '@/lib/types';

interface SubServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingSubService: SubServiceDraft | null;
  setEditingSubService: (subService: SubServiceDraft | null) => void;
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  onSubmit: (subServiceData: SubServiceDraft, isEditing: boolean, selectedImage: File | null) => Promise<void>;
  isUploading: boolean;
}

export const SubServiceDialog: React.FC<SubServiceDialogProps> = ({
  isOpen, onOpenChange, editingSubService, setEditingSubService, selectedImage, setSelectedImage, onSubmit, isUploading
}) => {
  const isEditing = !!editingSubService?.id;

  const handleSubmit = async () => {
    if (editingSubService) {
      await onSubmit(editingSubService, isEditing, selectedImage);
      onOpenChange(false);
    }
  };

  if (!editingSubService) return null;

  const isSaveDisabled = !editingSubService.title || !editingSubService.description;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{isEditing ? 'Edit' : 'Add'} Sub-Service</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to this sub-service.' : 'Add a new sub-service to the selected service category.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input 
              placeholder="Sub-service title" 
              value={editingSubService.title} 
              onChange={(e) => setEditingSubService({...editingSubService, title: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Textarea 
              placeholder="Sub-service description" 
              value={editingSubService.description} 
              onChange={(e) => setEditingSubService({...editingSubService, description: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="space-y-2">
              <Input 
                placeholder="Image URL (optional)" 
                value={editingSubService.image || ''} 
                onChange={(e) => setEditingSubService({...editingSubService, image: e.target.value})} 
              />
              <div className="flex items-center space-x-2">
                <Input type="file" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
                {selectedImage && <span className="text-sm text-gray-500">{selectedImage.name}</span>}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isUploading || isSaveDisabled}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};