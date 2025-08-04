import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { ProjectItem, Category } from '@/lib/types';

// Define a type for the form data to ensure consistency and avoid 'any'
interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  client: string;
  completedDate: string;
  categoryId: string;
}

interface ProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProject: ProjectItem | null;
  newProject: ProjectFormData;
  // Removed setNewProject as it's no longer needed inside this component
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  categories: Category[];
  onSubmit: (projectData: any, isEditing: boolean, selectedImage: File | null) => Promise<void>;
  isUploading: boolean;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  isOpen, onOpenChange, editingProject, newProject, selectedImage, setSelectedImage, categories, onSubmit, isUploading
}) => {
  const isEditing = !!editingProject;
  
  // Use a single state object for the form to simplify logic
  const [formData, setFormData] = React.useState<ProjectFormData>(
    isEditing 
      ? { 
          ...editingProject!, 
          categoryId: String(editingProject!.categoryId),
          client: editingProject?.client || '',
          completedDate: editingProject?.completedDate || ''
        } 
      : newProject
  );

  // Use a useEffect to handle updates if the parent's `editingProject` or `newProject` props change
  React.useEffect(() => {
    if (isEditing && editingProject) {
      setFormData({ 
        ...editingProject, 
        categoryId: String(editingProject.categoryId),
        client: editingProject?.client || '',
        completedDate: editingProject?.completedDate || ''
      });
    } else if (!isEditing) {
      setFormData(newProject);
    }
  }, [editingProject, newProject, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Explicitly type the previous state as ProjectFormData
    setFormData((prev: ProjectFormData) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    // Explicitly type the previous state as ProjectFormData
    setFormData((prev: ProjectFormData) => ({ ...prev, categoryId: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData, isEditing, selectedImage);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{isEditing ? 'Edit' : 'Add'} Project</DialogTitle>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select
                value={formData.categoryId || ''}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
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
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};