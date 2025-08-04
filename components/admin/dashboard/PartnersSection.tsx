// src/components/admin/dashboard/PartnersSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Users } from 'lucide-react';
import Image from 'next/image';
import { PartnerItem } from '@/lib/types';

interface PartnersSectionProps {
  partners: PartnerItem[];
  openPartnerDialog: (partner: PartnerItem | null) => void;
  handleDeletePartner: (id: number) => Promise<void>;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partners, openPartnerDialog, handleDeletePartner }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Partners</CardTitle>
            <CardDescription>Manage partner logos and information</CardDescription>
          </div>
          <Button size="sm" onClick={() => openPartnerDialog(null)}>
            <Plus className="h-4 w-4 mr-1"/>
            Add Partner
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {partners.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {partners.map(partner => (
              <div key={partner.id} className="group relative border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                  <Image 
                    src={partner.logoUrl} 
                    alt="Partner Logo"
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => openPartnerDialog(partner)}>
                    <Edit className="h-4 w-4"/>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePartner(partner.id)}>
                    <Trash2 className="h-4 w-4 text-red-500"/>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No partners yet</p>
            <p className="text-sm text-gray-400 mb-4">Start by adding your first partner</p>
            <Button onClick={() => openPartnerDialog(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};