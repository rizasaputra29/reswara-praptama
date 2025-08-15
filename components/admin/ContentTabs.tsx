// src/components/admin/ContentTabs.tsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, ServiceItem } from '@/lib/types';
import { HeroSection } from './dashboard/HeroSection';
import { AboutSection } from './dashboard/AboutSection';
import { ServicesSection } from './dashboard/ServicesSection';
import { ProjectsSection } from './dashboard/ProjectsSection';
import { PartnersSection } from './dashboard/PartnersSection';
import { ContactSection } from './dashboard/ContactSection';
import { UsersSection } from './dashboard/UsersSection';
import { BackupSection } from './dashboard/BackupSection';
import { TimelineSection } from './dashboard/TimelineSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDialogs } from '@/hooks/useDialogs';
import { HeroContent, AboutContent, ContactContent, ServicesPageContent } from '@/lib/types';

interface ContentTabsProps {
  currentUser: User;
  data: any;
  state: {
    editingSection: string | null;
    isUploading: boolean;
    tempHero: HeroContent | null;
    tempAbout: AboutContent | null;
    tempContact: ContactContent | null;
    tempServicesContent: ServicesPageContent | null;
    tempServices: ServiceItem[] | null;
    selectedHeroImage: any;
  };
  handlers: {
    handleContentUpdate: (section: string, content: any) => Promise<void>;
    handleToggleEdit: (section: string) => void;
    handleAddEmployee: () => Promise<void>;
    handleDeleteEmployee: (id: number) => Promise<void>;
    handleExport: () => Promise<void>;
    handleImport: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDeleteProject: (id: number) => Promise<void>;
    openProjectDialog: (project: any) => void;
    handleDeleteTimelineEvent: (id: number) => Promise<void>;
    openTimelineDialog: (event: any) => void;
    openSubServiceDialog: (subService: any, serviceId?: number) => void;
    handleDeleteSubService: (id: number) => Promise<void>;
    openPartnerDialog: (partner: any) => void;
    handleDeletePartner: (id: number) => Promise<void>;
    setTempHero: (content: any) => void;
    setTempAbout: (content: any) => void;
    setTempContact: (content: any) => void;
    setTempServicesContent: (content: any) => void;
    setTempServices: (services: ServiceItem[] | null) => void;
    setSelectedHeroImage: (file: File | null) => void;
    setAddEmployeeDialogOpen: (open: boolean) => void;
  };
  dialogs: ReturnType<typeof useDialogs>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ currentUser, data, state, handlers, dialogs, activeTab, onTabChange }) => {
  const {
    heroContent, aboutContent, services, servicesPageContent, projects, partners, contactContent, employees, timelineEvents
  } = data;

  const {
    editingSection, isUploading, tempHero, tempAbout, tempContact, tempServicesContent, tempServices, selectedHeroImage,
  } = state;

  const {
    handleContentUpdate, handleToggleEdit, handleAddEmployee, handleDeleteEmployee, handleExport, handleImport,
    handleDeleteProject, openProjectDialog, handleDeleteTimelineEvent, openTimelineDialog, openSubServiceDialog,
    handleDeleteSubService, openPartnerDialog, handleDeletePartner, setTempHero, setTempAbout, setTempContact,
    setTempServicesContent, setTempServices, setSelectedHeroImage, setAddEmployeeDialogOpen,
  } = handlers;

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Content Management</CardTitle>
        <CardDescription>Manage your website content with live preview</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className={`grid w-full ${currentUser.role === 'ADMIN' ? 'grid-cols-9' : 'grid-cols-2'} bg-gray-100`}>
            {currentUser.role === 'ADMIN' && (
              <>
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </>
            )}
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
                  setTempHero={setTempHero}
                  setSelectedHeroImage={setSelectedHeroImage}
                />
              </TabsContent>
              <TabsContent value="about" className="mt-6">
                <AboutSection
                  aboutContent={aboutContent}
                  editingSection={editingSection}
                  tempAbout={tempAbout}
                  handleContentUpdate={handleContentUpdate}
                  handleToggleEdit={handleToggleEdit}
                  setTempAbout={setTempAbout}
                />
              </TabsContent>
              <TabsContent value="timeline" className="mt-6">
                <TimelineSection
                  timelineEvents={timelineEvents}
                  openTimelineDialog={openTimelineDialog}
                  handleDeleteTimelineEvent={handleDeleteTimelineEvent}
                />
              </TabsContent>
              <TabsContent value="services" className="mt-6">
                <ServicesSection
                  services={services}
                  servicesPageContent={servicesPageContent}
                  tempServicesContent={tempServicesContent}
                  setTempServicesContent={setTempServicesContent}
                  editingSection={editingSection}
                  handleToggleEdit={handleToggleEdit}
                  handleContentUpdate={handleContentUpdate}
                  openSubServiceDialog={openSubServiceDialog}
                  handleDeleteSubService={handleDeleteSubService}
                  isUploading={isUploading}
                  tempServices={tempServices}
                  setTempServices={setTempServices}
                />
              </TabsContent>
            </>
          )}

          <TabsContent value="projects" className="mt-6">
            <ProjectsSection
              projects={projects}
              services={services}
              openProjectDialog={openProjectDialog}
              handleDeleteProject={handleDeleteProject}
            />
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <PartnersSection
              partners={partners}
              openPartnerDialog={openPartnerDialog}
              handleDeletePartner={handleDeletePartner}
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
                  setTempContact={setTempContact}
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