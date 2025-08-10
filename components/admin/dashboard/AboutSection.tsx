// src/components/admin/dashboard/AboutSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save } from 'lucide-react';
import { AboutContent } from '@/lib/types';
import { PreviewCard } from '@/components/PreviewCard';

interface AboutSectionProps {
  aboutContent: AboutContent | null;
  editingSection: string | null;
  tempAbout: AboutContent | null;
  handleContentUpdate: (section: string, content: any) => void;
  handleToggleEdit: (section: string) => void;
  setTempAbout: (content: AboutContent | null) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  aboutContent,
  editingSection,
  tempAbout,
  handleContentUpdate,
  handleToggleEdit,
  setTempAbout,
}) => {
  const isSaveDisabled = !tempAbout?.title || !tempAbout?.content || !tempAbout?.mission || !tempAbout?.vision;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">About Section</CardTitle>
            <CardDescription>Company information and values</CardDescription>
          </div>
          <Button 
            variant={editingSection === 'about' ? 'default' : 'outline'}
            onClick={() => editingSection === 'about' ? handleContentUpdate('about', tempAbout) : handleToggleEdit('about')} 
            className="flex items-center space-x-2"
            disabled={editingSection === 'about' && isSaveDisabled}
          >
            {editingSection === 'about' ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            <span>{editingSection === 'about' ? 'Save Changes' : 'Edit Content'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              {editingSection === 'about' ? (
                <Input 
                  value={tempAbout?.title || ''} 
                  onChange={(e) => setTempAbout({...tempAbout!, title: e.target.value})}
                  placeholder="Enter about title..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-900">{aboutContent?.title}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              {editingSection === 'about' ? (
                <Textarea 
                  rows={5} 
                  value={tempAbout?.content || ''} 
                  onChange={(e) => setTempAbout({...tempAbout!, content: e.target.value})}
                  placeholder="Enter about content..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-600">{aboutContent?.content}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
              {editingSection === 'about' ? (
                <Textarea 
                  value={tempAbout?.mission || ''} 
                  onChange={(e) => setTempAbout({...tempAbout!, mission: e.target.value})}
                  placeholder="Enter mission statement..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-600">{aboutContent?.mission}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
              {editingSection === 'about' ? (
                <Textarea 
                  value={tempAbout?.vision || ''} 
                  onChange={(e) => setTempAbout({...tempAbout!, vision: e.target.value})}
                  placeholder="Enter vision statement..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-600">{aboutContent?.vision}</p>
                </div>
              )}
            </div>
          </div>
          
          <PreviewCard title="Live Preview">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 text-center">
                {(editingSection === 'about' ? tempAbout?.title : aboutContent?.title) || 'About Title'}
              </h2>
              <p className="text-gray-600 text-sm">
                {(editingSection === 'about' ? tempAbout?.content : aboutContent?.content) || 'About content will appear here...'}
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-white border rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Visi</h3>
                  <p className="text-xs text-gray-600">
                    {(editingSection === 'about' ? tempAbout?.vision : aboutContent?.vision) || 'Vision statement...'}
                  </p>
                </div>
                <div className="bg-white border rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Misi</h3>
                  <p className="text-xs text-gray-600">
                    {(editingSection === 'about' ? tempAbout?.mission : aboutContent?.mission) || 'Mission statement...'}
                  </p>
                </div>
              </div>
            </div>
          </PreviewCard>
        </div>
      </CardContent>
    </Card>
  );
};