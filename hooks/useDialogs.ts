// src/hooks/useDialogs.ts

import { useState } from 'react';
import { ProjectItem, PartnerItem, SubService, Category, SubServiceDraft } from '@/lib/types';

export const useDialogs = () => {
  const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', client: '', completedDate: '', categoryId: '' });
  const [selectedProjectImage, setSelectedProjectImage] = useState<File | null>(null);

  const [isSubServiceDialogOpen, setSubServiceDialogOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState<SubServiceDraft | null>(null);
  const [selectedSubServiceImage, setSelectedSubServiceImage] = useState<File | null>(null);

  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState<string>('');

  const [isPartnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [newPartner, setNewPartner] = useState({ logoUrl: '' });
  const [selectedPartnerImage, setSelectedPartnerImage] = useState<File | null>(null);

  const openProjectDialog = (project: ProjectItem | null) => {
    setEditingProject(project);
    if (project) {
        setNewProject({
            title: project.title,
            description: project.description,
            image: project.image,
            client: project.client || '',
            completedDate: project.completedDate || '',
            categoryId: String(project.categoryId),
        });
    } else {
        setNewProject({ title: '', description: '', image: '', client: '', completedDate: '', categoryId: '' });
    }
    setSelectedProjectImage(null);
    setProjectDialogOpen(true);
  };
  
  const openSubServiceDialog = (subService: SubService | null, serviceId?: number) => {
    if (subService) {
      setEditingSubService(subService);
    } else if (serviceId) {
      setEditingSubService({ id: undefined, title: '', description: '', image: '', serviceId });
    }
    setSelectedSubServiceImage(null);
    setSubServiceDialogOpen(true);
  };

  const openCategoryDialog = (category: Category | null) => {
    setEditingCategory(category);
    setTempCategoryName(category ? category.name : '');
    setCategoryDialogOpen(true);
  };

  const openPartnerDialog = (partner: PartnerItem | null) => {
    setEditingPartner(partner);
    setNewPartner(partner || { logoUrl: '' });
    setSelectedPartnerImage(null);
    setPartnerDialogOpen(true);
  };

  return {
    isProjectDialogOpen, setProjectDialogOpen, editingProject, setEditingProject, newProject, setNewProject, selectedProjectImage, setSelectedProjectImage, openProjectDialog,
    isSubServiceDialogOpen, setSubServiceDialogOpen, editingSubService, setEditingSubService, selectedSubServiceImage, setSelectedSubServiceImage, openSubServiceDialog,
    isCategoryDialogOpen, setCategoryDialogOpen, editingCategory, setEditingCategory, tempCategoryName, setTempCategoryName, openCategoryDialog,
    isPartnerDialogOpen, setPartnerDialogOpen, editingPartner, setEditingPartner, newPartner, setNewPartner, selectedPartnerImage, setSelectedPartnerImage, openPartnerDialog,
  };
};