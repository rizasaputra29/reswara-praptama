// src/components/admin/dashboard/ServicesSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Edit, Plus, Trash2, Users, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ServiceItem, SubService } from '@/lib/types';

interface ServicesSectionProps {
  services: ServiceItem[];
  openSubServiceDialog: (subService: SubService | null, serviceId?: number) => void;
  handleDeleteSubService: (id: number) => Promise<void>;
  isUploading: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  openSubServiceDialog,
  handleDeleteSubService,
  isUploading,
}) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Services & Sub-Services</CardTitle>
            <CardDescription>Manage main service categories and their detailed sub-services</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {services.map(service => (
            <AccordionItem value={`service-${service.id}`} key={service.id} className="border border-gray-200 rounded-lg mb-4 px-4">
              <div className="flex items-center justify-between">
                <AccordionTrigger className="font-semibold flex-1 pr-4 hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
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
                <div className="space-y-3 mt-4">
                  {service.subServices?.length > 0 ? service.subServices.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        {sub.image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                            <Image src={sub.image} alt={sub.title} width={48} height={48} className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{sub.title}</p>
                          <p className="text-sm text-gray-600">{sub.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openSubServiceDialog(sub, service.id)} disabled={isUploading}>
                          <Edit className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSubService(sub.id)}>
                          <Trash2 className="h-4 w-4 text-red-500"/>
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No sub-services yet.</p>
                      <p className="text-xs text-gray-400">Click "Add Sub-Service" to get started.</p>
                    </div>
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