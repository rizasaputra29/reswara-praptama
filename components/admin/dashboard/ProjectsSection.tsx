// src/components/admin/dashboard/ProjectsSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Globe } from 'lucide-react';
import Image from 'next/image';
import { ProjectItem, Category } from '@/lib/types';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  categories: Category[];
  openProjectDialog: (project: ProjectItem | null) => void;
  handleDeleteProject: (id: number) => Promise<void>;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, categories, openProjectDialog, handleDeleteProject }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Projects</CardTitle>
            <CardDescription>Add, edit, or delete projects with categories</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={() => openProjectDialog(null)}>
              <Plus className="h-4 w-4 mr-1"/>
              Add Project
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openProjectDialog(project)}>
                        <Edit className="h-4 w-4"/>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4 text-red-500"/>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{categories.find(c => c.id === project.categoryId)?.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-sm text-gray-400 mb-4">Start by adding your first project</p>
            <Button onClick={() => openProjectDialog(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};