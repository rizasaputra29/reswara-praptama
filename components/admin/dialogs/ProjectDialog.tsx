// components/admin/dialogs/ProjectDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { ProjectItem, ServiceItem } from '@/lib/types';

interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  client: string;
  completedDate: string;
  serviceId: string;
}

interface ProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProject: ProjectItem | null;
  newProject: ProjectFormData;
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  services: ServiceItem[];
  onSubmit: (projectData: any, isEditing: boolean, selectedImage: File | null) => Promise<void>;
  isUploading: boolean;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  isOpen, onOpenChange, editingProject, newProject, selectedImage, setSelectedImage, services, onSubmit, isUploading
}) => {
  const isEditing = !!editingProject;

  const [formData, setFormData] = React.useState<ProjectFormData>(
    isEditing
      ? {
          ...editingProject!,
          serviceId: String((editingProject as any).serviceId),
          client: editingProject?.client || '',
          completedDate: editingProject?.completedDate || ''
        }
      : newProject
  );

  React.useEffect(() => {
    if (isEditing && editingProject) {
      setFormData({
        ...editingProject,
        serviceId: String((editingProject as any).serviceId),
        client: editingProject?.client || '',
        completedDate: editingProject?.completedDate || ''
      });
    } else if (!isEditing) {
      setFormData(newProject);
    }
  }, [editingProject, newProject, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ProjectFormData) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev: ProjectFormData) => ({ ...prev, serviceId: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData, isEditing, selectedImage);
    onOpenChange(false);
  };

  const isSaveDisabled = !formData.title || !formData.serviceId || !formData.description || (!formData.image && !selectedImage)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{isEditing ? 'Edit' : 'Add'} Project</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to this project.' : 'Add a new project to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                name="title"
                placeholder="Project title"
                value={formData.title || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Category</label>
              <Select
                value={formData.serviceId || ''}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger><SelectValue placeholder="Select a service category" /></SelectTrigger>
                <SelectContent>
                  {services.map(service => <SelectItem key={service.id} value={String(service.id)}>{service.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Textarea
              name="description"
              placeholder="Project description"
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="space-y-2">
              <Input
                name="image"
                placeholder="Image URL"
                value={formData.image || ''}
                onChange={handleChange}
              />
              <div className="flex items-center space-x-2">
                <Input type="file" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
                {selectedImage && <span className="text-sm text-gray-500">{selectedImage.name}</span>}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <Input
              name="client"
              placeholder="Location name"
              value={formData.client || ''}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isUploading || isSaveDisabled}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};