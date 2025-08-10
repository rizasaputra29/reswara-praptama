// components/admin/dashboard/ServicesSection.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Edit, Plus, Trash2, Users, ImageIcon, Save } from 'lucide-react';
import Image from 'next/image';
import { ServiceItem, SubService } from '@/lib/types';

interface ServicesSectionProps {
  services: ServiceItem[];
  servicesPageContent: { title: string; subtitle: string };
  tempServicesContent: { title: string; subtitle: string } | null;
  setTempServicesContent: (content: { title: string; subtitle: string }) => void;
  editingSection: string | null;
  handleToggleEdit: (section: string) => void;
  handleContentUpdate: (section: string, content: any) => void;
  openSubServiceDialog: (subService: SubService | null, serviceId?: number) => void;
  handleDeleteSubService: (id: number) => Promise<void>;
  isUploading: boolean;
  tempServices: ServiceItem[] | null;
  setTempServices: (services: ServiceItem[] | null) => void;
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
  tempServices,
  setTempServices,
}) => {
  const isEditingHeader = editingSection === 'services-page';
  const isEditingServices = editingSection === 'services';

  const isHeaderSaveDisabled = !tempServicesContent?.title || !tempServicesContent?.subtitle;

  const handleServiceChange = (id: number, field: string, value: string) => {
    if (tempServices) {
      setTempServices(
        tempServices.map((service) =>
          service.id === id ? { ...service, [field]: value } : service
        )
      );
    }
  };
  
  const handleSaveServices = () => {
    if (tempServices) {
      handleContentUpdate('services', tempServices);
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Services Page Content</CardTitle>
            <CardDescription>Manage the main page header and the list of services.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isEditingHeader ? 'default' : 'outline'}
              onClick={() => isEditingHeader ? handleContentUpdate('page-content', { pageName: 'services', ...tempServicesContent }) : handleToggleEdit('services-page')}
              disabled={isEditingHeader && isHeaderSaveDisabled}
            >
              {isEditingHeader ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditingHeader ? 'Save Header' : 'Edit Header'}
            </Button>
            <Button
              variant={isEditingServices ? 'default' : 'outline'}
              onClick={() => isEditingServices ? handleSaveServices() : handleToggleEdit('services')}
            >
              {isEditingServices ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditingServices ? 'Save Services' : 'Edit Services'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                {isEditingHeader ? (
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
                {isEditingHeader ? (
                    <Textarea
                    value={tempServicesContent?.subtitle || ''}
                    onChange={(e) => setTempServicesContent({ ...tempServicesContent!, subtitle: e.target.value })}
                    />
                ) : (
                    <p className="p-2 bg-white rounded-md border">{servicesPageContent.subtitle}</p>
                )}
            </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {services.map(service => (
            <AccordionItem value={`service-${service.id}`} key={service.id} className="border border-gray-200 rounded-lg mb-4 px-4">
              <div className="flex items-center justify-between">
                <AccordionTrigger className="font-semibold flex-1 pr-4 hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-600" />
                    {isEditingServices ? (
                      <Input
                        value={(tempServices?.find(s => s.id === service.id)?.title || '')}
                        onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span>{service.title}</span>
                    )}
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
                {isEditingServices && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
                    <Textarea
                      value={(tempServices?.find(s => s.id === service.id)?.description || '')}
                      onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                    />
                  </div>
                )}
                {service.subServices && service.subServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {service.subServices.map((subService) => (
                      <div key={subService.id} className="relative flex items-center p-3 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                        {subService.image && (
                          <div className="relative w-32 h-20 mr-4 flex-shrink-0 overflow-hidden rounded-md">
                            <Image src={subService.image} alt={subService.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-2">
                              <h4 className="font-semibold text-white text-sm truncate">{subService.title}</h4>
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{subService.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{subService.description}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openSubServiceDialog(subService); }}>
                            <Edit className="h-4 w-4"/>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteSubService(subService.id); }}>
                            <Trash2 className="h-4 w-4 text-red-500"/>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No sub-services available yet.</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};