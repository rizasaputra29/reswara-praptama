// src/components/admin/dashboard/HeroSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, Loader2 } from 'lucide-react';
import { HeroContent } from '@/lib/types';
import { PreviewCard } from '@/components/PreviewCard';

interface HeroSectionProps {
  heroContent: HeroContent | null;
  editingSection: string | null;
  isUploading: boolean;
  tempHero: HeroContent | null;
  selectedHeroImage: File | null;
  handleContentUpdate: (section: string, content: any) => void;
  handleToggleEdit: (section: string) => void;
  setTempHero: (content: HeroContent | null) => void;
  setSelectedHeroImage: (file: File | null) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroContent,
  editingSection,
  isUploading,
  tempHero,
  selectedHeroImage,
  handleContentUpdate,
  handleToggleEdit,
  setTempHero,
  setSelectedHeroImage,
}) => {
  const isSaveDisabled = !tempHero?.title || !tempHero?.subtitle || !tempHero?.buttonText;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Hero Section</CardTitle>
            <CardDescription>Main banner content for your homepage</CardDescription>
          </div>
          <Button
            variant={editingSection === 'hero' ? 'default' : 'outline'}
            onClick={() => editingSection === 'hero' ? handleContentUpdate('hero', tempHero) : handleToggleEdit('hero')}
            disabled={isUploading || (editingSection === 'hero' && isSaveDisabled)}
            className="flex items-center space-x-2"
          >
            {editingSection === 'hero' ? (
              isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />
            ) : <Edit className="h-4 w-4" />}
            <span>{editingSection === 'hero' ? 'Save Changes' : 'Edit Content'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              {editingSection === 'hero' ? (
                <Textarea
                  value={tempHero?.title || ''}
                  onChange={(e) => setTempHero({...tempHero!, title: e.target.value})}
                  className="min-h-[80px]"
                  placeholder="Enter hero title..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-900">{heroContent?.title}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              {editingSection === 'hero' ? (
                <Textarea
                  value={tempHero?.subtitle || ''}
                  onChange={(e) => setTempHero({...tempHero!, subtitle: e.target.value})}
                  className="min-h-[100px]"
                  placeholder="Enter hero subtitle..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-600">{heroContent?.subtitle}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              {editingSection === 'hero' ? (
                <Input
                  value={tempHero?.buttonText || ''}
                  onChange={(e) => setTempHero({...tempHero!, buttonText: e.target.value})}
                  placeholder="Enter button text..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-900">{heroContent?.buttonText}</p>
                </div>
              )}
            </div>
          </div>

          <PreviewCard title="Live Preview">
            <div className="text-center space-y-4">
              <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                CV. Reswara Praptama • Preview
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {(editingSection === 'hero' ? tempHero?.title : heroContent?.title) || 'Hero Title'}
              </h1>
              <p className="text-gray-600 text-sm">
                {(editingSection === 'hero' ? tempHero?.subtitle : heroContent?.subtitle) || 'Hero subtitle will appear here...'}
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                {(editingSection === 'hero' ? tempHero?.buttonText : heroContent?.buttonText) || 'Button Text'}
              </Button>
            </div>
          </PreviewCard>
        </div>
      </CardContent>
    </Card>
  );
};