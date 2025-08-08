// src/components/admin/dialogs/PartnerDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { PartnerItem } from '@/lib/types';

interface PartnerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPartner: PartnerItem | null;
  newPartner: { logoUrl: string };
  setNewPartner: (partner: { logoUrl: string }) => void;
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  onSubmit: (partnerData: any, isEditing: boolean, selectedImage: File | null) => Promise<void>;
  isUploading: boolean;
}

export const PartnerDialog: React.FC<PartnerDialogProps> = ({
  isOpen, onOpenChange, editingPartner, newPartner, setNewPartner, selectedImage, setSelectedImage, onSubmit, isUploading
}) => {
  const isEditing = !!editingPartner;
  const [formData, setFormData] = React.useState(
    isEditing ? { ...editingPartner } : { ...newPartner }
  );

  React.useEffect(() => {
    if (isEditing && editingPartner) {
      setFormData({ ...editingPartner });
    } else if (!isEditing) {
      setFormData({ ...newPartner });
    }
  }, [editingPartner, newPartner, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, logoUrl: e.target.value });
  };

  const handleSubmit = async () => {
    await onSubmit(formData, isEditing, selectedImage);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{isEditing ? 'Edit' : 'Add'} Partner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <Input 
              name="logoUrl"
              placeholder="Partner logo URL" 
              value={formData.logoUrl || ''} 
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Image</label>
            <div className="flex items-center space-x-2">
              <Input type="file" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
              {selectedImage && <span className="text-sm text-gray-500">{selectedImage.name}</span>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Partner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};