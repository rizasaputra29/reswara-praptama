// src/app/admin/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ContentTabs } from '@/components/admin/ContentTabs';
import { useAuth } from '@/hooks/useAuth';
import { useAdminData } from '@/hooks/useAdminData';
import { useContentManagement } from '@/hooks/useContentManagement';
import { useDialogs } from '@/hooks/useDialogs';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { HeroContent, AboutContent, ContactContent } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"; // <-- Tambahkan import useToast

import { AddEmployeeDialog } from '@/components/admin/dialogs/AddEmployeeDialog';
import { CategoryDialog } from '@/components/admin/dialogs/CategoryDialog';
import { PartnerDialog } from '@/components/admin/dialogs/PartnerDialog';
import { ProjectDialog } from '@/components/admin/dialogs/ProjectDialog';
import { SubServiceDialog } from '@/components/admin/dialogs/SubServiceDialog';

export default function Admin() {
  const { data, employees, partners, isLoading, loadData } = useAdminData();
  const { toast } = useToast(); // <-- Panggil hook useToast di sini

  const handleAuthSuccess = useCallback(() => {
    loadData();
  }, [loadData]);
  const { currentUser, username, setUsername, password, setPassword, handleLogin, handleLogout } = useAuth(handleAuthSuccess);

  const contentManagement = useContentManagement(loadData);
  const dialogs = useDialogs();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempHero, setTempHero] = useState<HeroContent | null>(null);
  const [tempAbout, setTempAbout] = useState<AboutContent | null>(null);
  const [tempContact, setTempContact] = useState<ContactContent | null>(null);

  const [isAddEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ username: '', password: '' });
  const [isEmployeeSubmitting, setIsEmployeeSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setTempHero(data.hero);
      setTempAbout(data.about);
      setTempContact(data.contact);
    }
  }, [data]);

  const handleContentUpdate = useCallback(async (section: string, updatedContent: any) => {
    try {
      if (section === 'hero' && dialogs.selectedProjectImage) {
        updatedContent.image = await contentManagement.handleImageUpload(dialogs.selectedProjectImage);
      }
      
      const response = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent)
      });
      if (!response.ok) {
        throw new Error(`Failed to update ${section}`);
      }
      
      setEditingSection(null);
      loadData();
      toast({ title: "Success", description: `${section.charAt(0).toUpperCase() + section.slice(1)} content updated.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  }, [loadData, dialogs.selectedProjectImage, contentManagement, toast]);

  const handleToggleEdit = useCallback((section: string) => {
    if (editingSection === section) {
      setEditingSection(null);
      setTempHero(data?.hero || null);
      setTempAbout(data?.about || null);
      setTempContact(data?.contact || null);
    } else {
      setEditingSection(section);
    }
  }, [editingSection, data]);
  
  const handleAddEmployee = useCallback(async () => {
    setIsEmployeeSubmitting(true);
    try {
      const response = await fetch('/api/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newEmployee) });
      if (!response.ok) { const err = await response.json(); throw new Error(err.error); }
      setAddEmployeeDialogOpen(false);
      setNewEmployee({ username: '', password: '' });
      await loadData();
      toast({ title: "Success", description: "New employee created." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsEmployeeSubmitting(false);
    }
  }, [newEmployee, loadData, toast]);

  const handleDeleteEmployee = useCallback(async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch('/api/employees', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) });
      if (!response.ok) throw new Error("Failed to delete employee.");
      await loadData();
      toast({ title: "Success", description: "Employee deleted." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  }, [loadData, toast]);

  // --- Backup/Import Handlers ---
  const handleExport = useCallback(async () => {
    try {
      const response = await fetch('/api/content/backup');
      if (!response.ok) {
          throw new Error('Failed to fetch backup data');
      }
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resawara-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Success", description: "Content exported successfully." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  }, [toast]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        const response = await fetch('/api/content/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content),
        });
        if (!response.ok) {
          throw new Error('Failed to import content.');
        }
        toast({ title: "Success", description: "Content imported successfully. Reloading dashboard..." });
        await loadData(); // <-- Perbaikan: Gunakan loadData
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  }, [loadData, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AdminLogin
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    );
  }

  if (!data || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <AdminHeader currentUser={currentUser} handleLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats
          currentUser={currentUser}
          visitStats={data.visits}
          projectsCount={data.projects.length}
        />
        
        <ContentTabs
          currentUser={currentUser}
          data={{
            heroContent: data.hero,
            aboutContent: data.about,
            services: data.services,
            projects: data.projects,
            partners: partners,
            contactContent: data.contact,
            categories: data.categories,
            employees: employees,
          }}
          state={{
            editingSection, setEditingSection,
            isUploading: contentManagement.isUploading,
            tempHero, setTempHero,
            tempAbout, setTempAbout,
            tempContact, setTempContact,
            selectedHeroImage: dialogs.selectedProjectImage,
            setSelectedHeroImage: dialogs.setSelectedProjectImage,
            setAddEmployeeDialogOpen,
            tempCategoryName: dialogs.tempCategoryName,
            openCategoryDialog: dialogs.openCategoryDialog,
          }}
          handlers={{
            handleContentUpdate, 
            handleToggleEdit, 
            handleAddEmployee, 
            handleDeleteEmployee, 
            handleExport, 
            handleImport,
            handleDeleteCategory: contentManagement.handleDeleteCategory,
            handleDeleteProject: contentManagement.handleDeleteProject,
            openProjectDialog: dialogs.openProjectDialog,
          }}
          dialogs={dialogs}
        />
        
        <ProjectDialog
          isOpen={dialogs.isProjectDialogOpen}
          onOpenChange={dialogs.setProjectDialogOpen}
          editingProject={dialogs.editingProject}
          newProject={dialogs.newProject}
          selectedImage={dialogs.selectedProjectImage}
          setSelectedImage={dialogs.setSelectedProjectImage}
          categories={data.categories}
          onSubmit={contentManagement.handleProjectSubmit}
          isUploading={contentManagement.isUploading}
        />

        <SubServiceDialog
          isOpen={dialogs.isSubServiceDialogOpen}
          onOpenChange={dialogs.setSubServiceDialogOpen}
          editingSubService={dialogs.editingSubService}
          setEditingSubService={dialogs.setEditingSubService}
          selectedImage={dialogs.selectedSubServiceImage}
          setSelectedImage={dialogs.setSelectedSubServiceImage}
          onSubmit={contentManagement.handleSubServiceSubmit}
          isUploading={contentManagement.isUploading}
        />
        
        <PartnerDialog
          isOpen={dialogs.isPartnerDialogOpen}
          onOpenChange={dialogs.setPartnerDialogOpen}
          editingPartner={dialogs.editingPartner}
          newPartner={dialogs.newPartner}
          setNewPartner={dialogs.setNewPartner}
          selectedImage={dialogs.selectedPartnerImage}
          setSelectedImage={dialogs.setSelectedPartnerImage}
          onSubmit={contentManagement.handlePartnerSubmit}
          isUploading={contentManagement.isUploading}
        />

        <AddEmployeeDialog
          isOpen={isAddEmployeeDialogOpen}
          onOpenChange={setAddEmployeeDialogOpen}
          username={newEmployee.username}
          setUsername={(username) => setNewEmployee({ ...newEmployee, username })}
          password={newEmployee.password}
          setPassword={(password) => setNewEmployee({ ...newEmployee, password })}
          onSubmit={handleAddEmployee}
          isSubmitting={isEmployeeSubmitting}
        />
        
        <CategoryDialog
          isOpen={dialogs.isCategoryDialogOpen}
          onOpenChange={dialogs.setCategoryDialogOpen}
          editingCategory={dialogs.editingCategory}
          tempCategoryName={dialogs.tempCategoryName}
          setTempCategoryName={dialogs.setTempCategoryName}
          onSubmit={contentManagement.handleCategorySubmit}
        />
      </main>
    </div>
  );
}