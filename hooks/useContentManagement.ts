// src/hooks/useContentManagement.ts

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadImage as apiUploadImage } from '@/lib/api';
import { ProjectItem, SubService, SubServiceDraft, PartnerItem, ServiceItem, TimelineEvent } from '@/lib/types';

export const useContentManagement = (reload: () => void) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const url = await apiUploadImage(file);
      toast({ title: 'Success', description: 'Image uploaded successfully.' });
      return url;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleProjectSubmit = async (projectData: any, isEditing: boolean, selectedImage: File | null) => {
    const url = '/api/content/projects';
    const method = isEditing ? 'PUT' : 'POST';
    let body = { ...projectData };

    try {
      // FIX: Ganti validasi dari `body.categoryId` menjadi `body.serviceId`
      if (!body.title || !body.serviceId) {
        throw new Error('Title and Service Category are required.');
      }
      
      if (selectedImage) {
        body.image = await handleImageUpload(selectedImage);
      }
      
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} project.`);
      
      toast({ title: 'Success', description: `Project ${isEditing ? 'updated' : 'added'}.` });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch('/api/content/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: projectId }) });
      if (!response.ok) throw new Error('Failed to delete project');
      
      toast({ title: 'Success', description: 'Project deleted.' });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleSubServiceSubmit = async (subServiceData: SubServiceDraft, isEditing: boolean, selectedImage: File | null) => {
    const url = '/api/content/subservices';
    const method = isEditing ? 'PUT' : 'POST';
    let body = { ...subServiceData };

    try {
      if (!body.title || !body.serviceId) {
        throw new Error('Title and Service ID are required.');
      }
      
      if (selectedImage) {
        body.image = await handleImageUpload(selectedImage);
      }
      
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} sub-service.`);
      
      toast({ title: 'Success', description: `Sub-service ${isEditing ? 'updated' : 'added'}.` });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleDeleteSubService = async (subServiceId: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch('/api/content/subservices', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: subServiceId }) });
      if (!response.ok) throw new Error('Failed to delete sub-service.');
      
      toast({ title: 'Success', description: 'Sub-service deleted.' });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleCategorySubmit = async (name: string, isEditing: boolean, categoryId?: number) => {
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Category name cannot be empty.' });
      return;
    }
    
    const url = '/api/content/categories';
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing ? { id: categoryId, name } : { name };

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'add'} category.`);
      }
      toast({ title: 'Success', description: `Category ${isEditing ? 'updated' : 'added'}.` });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };
  
  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure? This will also delete all associated projects.')) return;
    try {
        const response = await fetch('/api/content/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: categoryId }) });
        if (!response.ok) throw new Error('Failed to delete category.');
        toast({ title: 'Success', description: 'Category and associated projects deleted.' });
        reload();
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handlePartnerSubmit = async (partnerData: any, isEditing: boolean, selectedImage: File | null) => {
    const url = '/api/content/partners';
    const method = isEditing ? 'PUT' : 'POST';
    let body = { ...partnerData };
    
    try {
      if (selectedImage) {
        body.logoUrl = await handleImageUpload(selectedImage);
      }
      
      if (!body.logoUrl) {
        throw new Error('Logo URL is required.');
      }
      
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} partner.`);
      
      toast({ title: 'Success', description: `Partner ${isEditing ? 'updated' : 'added'}.` });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleDeletePartner = async (partnerId: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch('/api/content/partners', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: partnerId }) });
      if (!response.ok) throw new Error('Failed to delete partner');
      
      toast({ title: 'Success', description: 'Partner deleted.' });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  // Add the timeline event handlers
  const handleTimelineSubmit = async (eventData: Partial<TimelineEvent>) => {
    const isEditing = !!eventData.id;
    const url = '/api/content/timeline';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      if (!eventData.year || !eventData.title || !eventData.description) {
        throw new Error('Year, Title, and Description are required.');
      }
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} event.`);
      
      toast({ title: 'Success', description: `Timeline event ${isEditing ? 'updated' : 'added'}.` });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleDeleteTimelineEvent = async (eventId: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch('/api/content/timeline', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: eventId }) });
      if (!response.ok) throw new Error('Failed to delete timeline event.');
      
      toast({ title: 'Success', description: 'Timeline event deleted.' });
      reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return {
    isUploading,
    handleImageUpload,
    handleProjectSubmit,
    handleDeleteProject,
    handleSubServiceSubmit,
    handleDeleteSubService,
    handleCategorySubmit,
    handleDeleteCategory,
    handlePartnerSubmit,
    handleDeletePartner,
    // Return the new handlers
    handleTimelineSubmit,
    handleDeleteTimelineEvent,
  };
};