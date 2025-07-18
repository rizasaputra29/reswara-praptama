"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Users, TrendingUp, Edit, Save } from 'lucide-react';

interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const [content, setContent] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const [visitRes, contentRes] = await Promise.all([
        fetch('/api/visits'),
        fetch('/api/content')
      ]);
      
      const visitData = await visitRes.json();
      const contentData = await contentRes.json();
      
      setVisitStats(visitData);
      setContent(contentData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('adminToken', token);
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  const handleContentUpdate = async (section: string, updatedContent: any) => {
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content: updatedContent })
      });

      if (response.ok) {
        setContent({ ...content, [section]: updatedContent });
        setEditingSection(null);
        alert('Content updated successfully');
      } else {
        alert('Failed to update content');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('adminToken');
                setIsAuthenticated(false);
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Visits</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {visitStats?.totalVisits || 0}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique Visitors</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {visitStats?.uniqueVisitors || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {visitStats ? Math.round((visitStats.uniqueVisitors / visitStats.totalVisits) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="hero" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="hero" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Hero Section</h3>
                  <Button
                    variant="outline"
                    onClick={() => setEditingSection(editingSection === 'hero' ? null : 'hero')}
                  >
                    {editingSection === 'hero' ? 'Cancel' : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
                {editingSection === 'hero' && content?.hero ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={content.hero.title}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, title: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subtitle</label>
                      <Input
                        value={content.hero.subtitle}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, subtitle: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Text</label>
                      <Input
                        value={content.hero.buttonText}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, buttonText: e.target.value }
                        })}
                      />
                    </div>
                    <Button onClick={() => handleContentUpdate('hero', content.hero)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {content?.hero?.title}</p>
                    <p><strong>Subtitle:</strong> {content?.hero?.subtitle}</p>
                    <p><strong>Button Text:</strong> {content?.hero?.buttonText}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Services Section</h3>
                  <Button
                    variant="outline"
                    onClick={() => setEditingSection(editingSection === 'services' ? null : 'services')}
                  >
                    {editingSection === 'services' ? 'Cancel' : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
                {editingSection === 'services' && content?.services ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={content.services.title}
                        onChange={(e) => setContent({
                          ...content,
                          services: { ...content.services, title: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subtitle</label>
                      <Input
                        value={content.services.subtitle}
                        onChange={(e) => setContent({
                          ...content,
                          services: { ...content.services, subtitle: e.target.value }
                        })}
                      />
                    </div>
                    <Button onClick={() => handleContentUpdate('services', content.services)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {content?.services?.title}</p>
                    <p><strong>Subtitle:</strong> {content?.services?.subtitle}</p>
                    <p><strong>Services Count:</strong> {content?.services?.items?.length || 0}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Projects Section</h3>
                  <Button
                    variant="outline"
                    onClick={() => setEditingSection(editingSection === 'projects' ? null : 'projects')}
                  >
                    {editingSection === 'projects' ? 'Cancel' : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
                {editingSection === 'projects' && content?.projects ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={content.projects.title}
                        onChange={(e) => setContent({
                          ...content,
                          projects: { ...content.projects, title: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subtitle</label>
                      <Input
                        value={content.projects.subtitle}
                        onChange={(e) => setContent({
                          ...content,
                          projects: { ...content.projects, subtitle: e.target.value }
                        })}
                      />
                    </div>
                    <Button onClick={() => handleContentUpdate('projects', content.projects)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {content?.projects?.title}</p>
                    <p><strong>Subtitle:</strong> {content?.projects?.subtitle}</p>
                    <p><strong>Projects Count:</strong> {content?.projects?.items?.length || 0}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="statistics" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Statistics Section</h3>
                </div>
                <div className="space-y-2">
                  <p><strong>Stats Count:</strong> {content?.statistics?.items?.length || 0}</p>
                  {content?.statistics?.items?.map((stat: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p><strong>{stat.label}:</strong> {stat.number}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">About Section</h3>
                  <Button
                    variant="outline"
                    onClick={() => setEditingSection(editingSection === 'about' ? null : 'about')}
                  >
                    {editingSection === 'about' ? 'Cancel' : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
                {editingSection === 'about' && content?.about ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={content.about.title}
                        onChange={(e) => setContent({
                          ...content,
                          about: { ...content.about, title: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <Input
                        value={content.about.content}
                        onChange={(e) => setContent({
                          ...content,
                          about: { ...content.about, content: e.target.value }
                        })}
                      />
                    </div>
                    <Button onClick={() => handleContentUpdate('about', content.about)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {content?.about?.title}</p>
                    <p><strong>Content:</strong> {content?.about?.content?.substring(0, 100)}...</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}