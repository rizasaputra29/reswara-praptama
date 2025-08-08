// components/admin/dashboard/ServicesSection.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Edit, Plus, Trash2, Users, ImageIcon, Save } from 'lucide-react'; // Import Save icon
import Image from 'next/image';
import { ServiceItem, SubService } from '@/lib/types';

interface ServicesSectionProps {
  services: ServiceItem[];
  servicesPageContent: { title: string; subtitle: string }; // Add this
  tempServicesContent: { title: string; subtitle: string } | null; // Add this
  setTempServicesContent: (content: { title: string; subtitle: string }) => void; // Add this
  editingSection: string | null; // Add this
  handleToggleEdit: (section: string) => void; // Add this
  handleContentUpdate: (section: string, content: any) => void; // Add this
  openSubServiceDialog: (subService: SubService | null, serviceId?: number) => void;
  handleDeleteSubService: (id: number) => Promise<void>;
  isUploading: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  servicesPageContent,
  tempServicesContent,
  setTempServicesContent,
  editingSection,
  handleToggleEdit,
  handleContentUpdate,
  openSubServiceDialog,
  handleDeleteSubService,
  isUploading,
}) => {
  const isEditing = editingSection === 'services-page';

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Services Page Content</CardTitle>
            <CardDescription>Manage the main page header and the list of services.</CardDescription>
          </div>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => isEditing ? handleContentUpdate('page-content', { pageName: 'services', ...tempServicesContent }) : handleToggleEdit('services-page')}
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'Save Header' : 'Edit Header'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Editing fields for page header */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                {isEditing ? (
                    <Input
                    value={tempServicesContent?.title || ''}
                    onChange={(e) => setTempServicesContent({ ...tempServicesContent!, title: e.target.value })}
                    />
                ) : (
                    <p className="p-2 bg-white rounded-md border">{servicesPageContent.title}</p>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
                {isEditing ? (
                    <Textarea
                    value={tempServicesContent?.subtitle || ''}
                    onChange={(e) => setTempServicesContent({ ...tempServicesContent!, subtitle: e.target.value })}
                    />
                ) : (
                    <p className="p-2 bg-white rounded-md border">{servicesPageContent.subtitle}</p>
                )}
            </div>
        </div>

        {/* Accordion for individual services */}
        <Accordion type="single" collapsible className="w-full">
          {services.map(service => (
            <AccordionItem value={`service-${service.id}`} key={service.id} className="border border-gray-200 rounded-lg mb-4 px-4">
              <div className="flex items-center justify-between">
                <AccordionTrigger className="font-semibold flex-1 pr-4 hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span>{service.title}</span>
                  </div>
                </AccordionTrigger>
                <div className="flex items-center gap-2 pr-4">
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openSubServiceDialog(null, service.id); }}>
                    <Plus className="h-4 w-4 text-gray-500" />
                    <span className="ml-1 text-sm">Add Sub-Service</span>
                  </Button>
                </div>
              </div>
              <AccordionContent className="pl-4 pb-4">
                <div className="space-y-3">
                  {service.subServices.length > 0 ? (
                    service.subServices.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                            {sub.image ? (
                              <Image src={sub.image} alt={sub.title} width={48} height={48} className="object-cover rounded-md" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{sub.title}</p>
                            <p className="text-sm text-gray-500">{sub.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openSubServiceDialog(sub, service.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSubService(sub.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No sub-services yet.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};