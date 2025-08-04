// src/components/admin/dashboard/BackupSection.tsx
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Save } from 'lucide-react';

interface BackupSectionProps {
  handleExport: () => Promise<void>;
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const BackupSection: React.FC<BackupSectionProps> = ({ handleExport, handleImport }) => {
  const importFileRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Backup & Restore Content</CardTitle>
        <CardDescription>Export all your website content or import a backup file to restore content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Export Content</h3>
            <p className="text-sm text-gray-600 mb-4">Download all your website content as a backup file.</p>
            <Button onClick={handleExport} className="w-full">
              <Upload className="h-4 w-4 mr-2" /> Export All Content
            </Button>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Import Content</h3>
            <p className="text-sm text-gray-600 mb-4">Restore content from a previously exported backup file.</p>
            <div className="relative">
              <Input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImport}
                ref={importFileRef}
                accept="application/json"
              />
              <Button className="w-full" variant="outline" onClick={() => importFileRef.current?.click()}>
                <Save className="h-4 w-4 mr-2" /> Import Content
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};