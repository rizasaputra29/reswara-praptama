// src/components/admin/dashboard/ContactSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save } from 'lucide-react';
import { ContactContent } from '@/lib/types';
import { PreviewCard } from '@/components/PreviewCard';

interface ContactSectionProps {
  contactContent: ContactContent | null;
  editingSection: string | null;
  tempContact: ContactContent | null;
  handleContentUpdate: (section: string, content: any) => void;
  handleToggleEdit: (section: string) => void;
  setTempContact: (content: ContactContent | null) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactContent,
  editingSection,
  tempContact,
  handleContentUpdate,
  handleToggleEdit,
  setTempContact,
}) => {
  const contactFields = [
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'hours', label: 'Hours' },
  ];

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Contact Information</CardTitle>
            <CardDescription>Company contact details and information</CardDescription>
          </div>
          <Button 
            variant={editingSection === 'contact' ? 'default' : 'outline'}
            onClick={() => editingSection === 'contact' ? handleContentUpdate('contact', tempContact) : handleToggleEdit('contact')}
            className="flex items-center space-x-2"
          >
            {editingSection === 'contact' ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            <span>{editingSection === 'contact' ? 'Save Changes' : 'Edit Content'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {contactFields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                {editingSection === 'contact' ? (
                  <Input 
                    value={(tempContact as any)?.[key] || ''} 
                    onChange={(e) => setTempContact({...tempContact!, [key]: e.target.value})}
                    placeholder={`Enter ${label}...`}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-gray-900">{(contactContent as any)?.[key]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <PreviewCard title="Live Preview">
            <div className="space-y-3">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
              </div>
              <div className="space-y-2 text-sm">
                {contactFields.map(({ key, label }) => (
                  <div key={key} className="flex items-start space-x-2">
                    <span className="font-medium text-gray-700">{label}:</span>
                    <span className="text-gray-600">{(editingSection === 'contact' ? (tempContact as any)?.[key] : (contactContent as any)?.[key]) || `${label}...`}</span>
                  </div>
                ))}
              </div>
            </div>
          </PreviewCard>
        </div>
      </CardContent>
    </Card>
  );
};