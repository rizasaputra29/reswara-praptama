// src/components/admin/ContentTabs.tsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/lib/types';
import { HeroSection } from './dashboard/HeroSection';
import { AboutSection } from './dashboard/AboutSection';
import { ServicesSection } from './dashboard/ServicesSection';
import { ProjectsSection } from './dashboard/ProjectsSection';
import { PartnersSection } from './dashboard/PartnersSection';
import { ContactSection } from './dashboard/ContactSection';
import { UsersSection } from './dashboard/UsersSection';
import { BackupSection } from './dashboard/BackupSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentTabsProps {
  currentUser: User;
  data: any;
  state: any;
  handlers: {
    handleContentUpdate: (section: string, content: any) => Promise<void>;
    handleToggleEdit: (section: string) => void;
    handleAddEmployee: () => Promise<void>;
    handleDeleteEmployee: (id: number) => Promise<void>;
    handleExport: () => Promise<void>;
    handleImport: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDeleteCategory: (id: number) => Promise<void>;
    handleDeleteProject: (id: number) => Promise<void>;
    openProjectDialog: (project: any) => void;
  }; 
  dialogs: any;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ currentUser, data, state, handlers, dialogs }) => {
  const { 
    heroContent, aboutContent, services, projects, partners, contactContent, categories, employees 
  } = data;
  
  const { 
    editingSection, isUploading, tempHero, tempAbout, tempContact, selectedHeroImage, setSelectedHeroImage,
    setAddEmployeeDialogOpen
  } = state;

  const {
    handleContentUpdate, handleToggleEdit, handleAddEmployee, handleDeleteEmployee, handleExport, handleImport,
    handleDeleteProject,
    openProjectDialog
  } = handlers;

  const {
    openSubServiceDialog, handleDeleteSubService, openPartnerDialog, handleDeletePartner, 
  } = dialogs;

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Content Management</CardTitle>
        <CardDescription>Manage your website content with live preview</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentUser.role === 'ADMIN' ? 'hero' : 'projects'}>
          <TabsList className={`grid w-full ${currentUser.role === 'ADMIN' ? 'grid-cols-8' : 'grid-cols-3'} bg-gray-100`}>
            {currentUser.role === 'ADMIN' && (
              <>
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </>
            )}
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            {currentUser.role === 'ADMIN' && (
              <>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="backup">Backup</TabsTrigger>
              </>
            )}
          </TabsList>

          {currentUser.role === 'ADMIN' && (
            <>
              <TabsContent value="hero" className="mt-6">
                <HeroSection
                  heroContent={heroContent}
                  editingSection={editingSection}
                  isUploading={isUploading}
                  tempHero={tempHero}
                  selectedHeroImage={selectedHeroImage}
                  handleContentUpdate={handleContentUpdate}
                  handleToggleEdit={handleToggleEdit}
                  setTempHero={state.setTempHero}
                  setSelectedHeroImage={state.setSelectedHeroImage}
                />
              </TabsContent>
              <TabsContent value="about" className="mt-6">
                <AboutSection
                  aboutContent={aboutContent}
                  editingSection={editingSection}
                  tempAbout={tempAbout}
                  handleContentUpdate={handleContentUpdate}
                  handleToggleEdit={handleToggleEdit}
                  setTempAbout={state.setTempAbout}
                />
              </TabsContent>
            </>
          )}

          <TabsContent value="services" className="mt-6">
            <ServicesSection
              services={services}
              openSubServiceDialog={openSubServiceDialog}
              handleDeleteSubService={dialogs.handleDeleteSubService}
              isUploading={isUploading}
            />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectsSection
              projects={projects}
              categories={categories}
              openProjectDialog={openProjectDialog}
              handleDeleteProject={handleDeleteProject}
            />
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <PartnersSection
              partners={partners}
              openPartnerDialog={openPartnerDialog}
              handleDeletePartner={dialogs.handleDeletePartner}
            />
          </TabsContent>

          {currentUser.role === 'ADMIN' && (
            <>
              <TabsContent value="contact" className="mt-6">
                <ContactSection
                  contactContent={contactContent}
                  editingSection={editingSection}
                  tempContact={tempContact}
                  handleContentUpdate={handleContentUpdate}
                  handleToggleEdit={handleToggleEdit}
                  setTempContact={state.setTempContact}
                />
              </TabsContent>
              <TabsContent value="users" className="mt-6">
                <UsersSection
                  employees={employees}
                  handleAddEmployee={handleAddEmployee}
                  handleDeleteEmployee={handleDeleteEmployee}
                  setAddEmployeeDialogOpen={setAddEmployeeDialogOpen}
                />
              </TabsContent>
              <TabsContent value="backup" className="mt-6">
                <BackupSection
                  handleExport={handleExport}
                  handleImport={handleImport}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};