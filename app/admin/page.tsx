"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, Plus, Trash2, Eye, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// --- Type Definitions ---
interface Category { id: number; name: string; }
interface ProjectItem { id: number; title: string; description: string; image: string; client?: string | null; completedDate?: string | null; categoryId: number; }
interface VisitStats { totalVisits: number; uniqueVisitors: number; }
interface HeroContent { id: number; title: string; subtitle: string; buttonText: string; }
interface AboutContent { id: number; title: string; content: string; mission: string; vision: string; values: string[]; }
interface ServiceItem { id: number; title: string; description: string; icon: string; }
interface ContactContent { id: number; title: string; subtitle: string; address: string; phone: string; email: string; hours: string; }

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // --- States for each section ---
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // --- Temporary states for edits ---
  const [tempHero, setTempHero] = useState<HeroContent | null>(null);
  const [tempAbout, setTempAbout] = useState<AboutContent | null>(null);
  const [tempServices, setTempServices] = useState<ServiceItem[]>([]);
  const [tempContact, setTempContact] = useState<ContactContent | null>(null);

  // --- State for Add Project Dialog ---
  const [isAddProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', client: '', completedDate: '', categoryId: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setVisitStats(data.visits);
        setHeroContent(data.hero);
        setTempHero(data.hero);
        setAboutContent(data.about);
        setTempAbout(data.about);
        setServices(data.services);
        setTempServices(data.services);
        setProjects(data.projects);
        setContactContent(data.contact);
        setTempContact(data.contact);
        setCategories(data.categories);
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not load dashboard data." });
    } finally {
      setIsLoading(false);
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
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid username or password." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Login Error", description: "An unexpected error occurred." });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleContentUpdate = async (section: string, updatedContent: any) => {
    try {
      const response = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent)
      });
      if (response.ok) {
        toast({ title: "Success", description: `${section.charAt(0).toUpperCase() + section.slice(1)} content updated.` });
        await loadDashboardData(); // Refresh data
        setEditingSection(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update ${section}`);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message || `Could not update ${section} content.` });
    }
  };
  
  const handleToggleEdit = (section: string) => {
    if (editingSection === section) {
      setEditingSection(null);
      // Reset temp states
      setTempHero(heroContent);
      setTempAbout(aboutContent);
      setTempServices(services);
      setTempContact(contactContent);
    } else {
      setEditingSection(section);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.categoryId) {
        toast({ variant: "destructive", title: "Validation Error", description: "Title and Category are required." });
        return;
    }
    try {
        const response = await fetch('/api/content/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProject)
        });
        if (response.ok) {
            toast({ title: "Success", description: "New project added." });
            setAddProjectDialogOpen(false);
            setNewProject({ title: '', description: '', image: '', client: '', completedDate: '', categoryId: '' });
            await loadDashboardData();
        } else {
            throw new Error("Failed to add project");
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not add new project." });
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
        return;
    }
    try {
        const response = await fetch(`/api/content/projects`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: projectId })
        });
        if (response.ok) {
            toast({ title: "Success", description: "Project deleted." });
            await loadDashboardData();
        } else {
            throw new Error("Failed to delete project");
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete project." });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading Admin Dashboard...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Toaster />
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Toaster />
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </header>
      
      <main>
        {/* Statistics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{visitStats?.totalVisits ?? 'N/A'}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{visitStats?.uniqueVisitors ?? 'N/A'}</div>
                </CardContent>
            </Card>
        </section>

        {/* Content Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Edit content for various sections of your website.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="hero">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              {/* Hero Tab */}
              <TabsContent value="hero" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Hero Section</CardTitle>
                       <Button variant="ghost" size="sm" onClick={() => handleToggleEdit('hero')}>
                          {editingSection === 'hero' ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                          {editingSection === 'hero' ? 'Save' : 'Edit'}
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                        <label className="font-semibold">Title</label>
                        {editingSection === 'hero' ? (
                            <Input value={tempHero?.title} onChange={(e) => setTempHero({...tempHero!, title: e.target.value})} />
                        ) : (
                            <p className="text-muted-foreground">{heroContent?.title}</p>
                        )}
                    </div>
                     <div>
                        <label className="font-semibold">Subtitle</label>
                        {editingSection === 'hero' ? (
                            <Textarea value={tempHero?.subtitle} onChange={(e) => setTempHero({...tempHero!, subtitle: e.target.value})} />
                        ) : (
                            <p className="text-muted-foreground">{heroContent?.subtitle}</p>
                        )}
                    </div>
                     <div>
                        <label className="font-semibold">Button Text</label>
                        {editingSection === 'hero' ? (
                            <Input value={tempHero?.buttonText} onChange={(e) => setTempHero({...tempHero!, buttonText: e.target.value})} />
                        ) : (
                            <p className="text-muted-foreground">{heroContent?.buttonText}</p>
                        )}
                    </div>
                     {editingSection === 'hero' && (
                        <div className="flex gap-2">
                            <Button onClick={() => handleContentUpdate('hero', tempHero)}>Save Changes</Button>
                            <Button variant="outline" onClick={() => handleToggleEdit('hero')}>Cancel</Button>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>About Section</CardTitle>
                       <Button variant="ghost" size="sm" onClick={() => handleToggleEdit('about')}>
                          {editingSection === 'about' ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                          {editingSection === 'about' ? 'Save' : 'Edit'}
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                        <label className="font-semibold">Title</label>
                         {editingSection === 'about' ? (
                           <Input value={tempAbout?.title} onChange={(e) => setTempAbout({...tempAbout!, title: e.target.value})} />
                         ) : (
                           <p className="text-muted-foreground">{aboutContent?.title}</p>
                         )}
                    </div>
                     <div>
                        <label className="font-semibold">Content</label>
                         {editingSection === 'about' ? (
                           <Textarea rows={5} value={tempAbout?.content} onChange={(e) => setTempAbout({...tempAbout!, content: e.target.value})} />
                         ) : (
                           <p className="text-muted-foreground">{aboutContent?.content}</p>
                         )}
                    </div>
                     {editingSection === 'about' && (
                        <div className="flex gap-2">
                            <Button onClick={() => handleContentUpdate('about', tempAbout)}>Save Changes</Button>
                            <Button variant="outline" onClick={() => handleToggleEdit('about')}>Cancel</Button>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="mt-4">
                <Card>
                  <CardHeader>
                     <div className="flex justify-between items-center">
                        <CardTitle>Services</CardTitle>
                         <Button variant="ghost" size="sm" onClick={() => handleToggleEdit('services')}>
                          {editingSection === 'services' ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                          {editingSection === 'services' ? 'Save' : 'Edit'}
                        </Button>
                    </div>
                    <CardDescription>Manage the services offered.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tempServices.map((service, index) => (
                      <div key={service.id} className="p-4 border rounded-md">
                        <label className="font-semibold">Service #{index + 1}</label>
                        {editingSection === 'services' ? (
                          <div className="space-y-2 mt-2">
                             <Input placeholder="Title" value={service.title} onChange={(e) => {
                                 const newServices = [...tempServices];
                                 newServices[index].title = e.target.value;
                                 setTempServices(newServices);
                             }} />
                              <Textarea placeholder="Description" value={service.description} onChange={(e) => {
                                 const newServices = [...tempServices];
                                 newServices[index].description = e.target.value;
                                 setTempServices(newServices);
                             }} />
                          </div>
                        ) : (
                          <>
                            <p className="font-medium">{service.title}</p>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </>
                        )}
                      </div>
                    ))}
                     {editingSection === 'services' && (
                        <div className="flex gap-2">
                            <Button onClick={() => handleContentUpdate('services', {items: tempServices})}>Save Changes</Button>
                            <Button variant="outline" onClick={() => handleToggleEdit('services')}>Cancel</Button>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Projects Tab */}
              <TabsContent value="projects" className="mt-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Projects</CardTitle>
                            <Dialog open={isAddProjectDialogOpen} onOpenChange={setAddProjectDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm"><Plus className="mr-2 h-4 w-4"/>Add Project</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Project</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Input placeholder="Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} />
                                        <Textarea placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
                                        <Input placeholder="Image URL" value={newProject.image} onChange={(e) => setNewProject({...newProject, image: e.target.value})} />
                                        <Input placeholder="Client" value={newProject.client} onChange={(e) => setNewProject({...newProject, client: e.target.value})} />
                                        <Input placeholder="Completed Date (e.g., 23/5/2023)" value={newProject.completedDate} onChange={(e) => setNewProject({...newProject, completedDate: e.target.value})} />
                                        <Select onValueChange={(value) => setNewProject({...newProject, categoryId: value})}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex justify-end gap-2">
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleAddProject}>Add Project</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <CardDescription>Add, edit, or delete projects.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {projects.map(project => (
                            <div key={project.id} className="flex items-center justify-between p-3 border rounded-md">
                                <div>
                                    <p className="font-semibold">{project.title}</p>
                                    <p className="text-sm text-muted-foreground">{categories.find(c => c.id === project.categoryId)?.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Contact Information</CardTitle>
                       <Button variant="ghost" size="sm" onClick={() => handleToggleEdit('contact')}>
                          {editingSection === 'contact' ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                          {editingSection === 'contact' ? 'Save' : 'Edit'}
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.keys(contactContent || {}).filter(k => k !== 'id').map(key => (
                        <div key={key}>
                            <label className="font-semibold capitalize">{key}</label>
                            {editingSection === 'contact' ? (
                                <Input 
                                    value={(tempContact as any)?.[key] || ''} 
                                    onChange={(e) => setTempContact({...tempContact!, [key]: e.target.value})} 
                                />
                            ) : (
                                <p className="text-muted-foreground">{(contactContent as any)?.[key]}</p>
                            )}
                        </div>
                    ))}
                     {editingSection === 'contact' && (
                        <div className="flex gap-2">
                            <Button onClick={() => handleContentUpdate('contact', tempContact)}>Save Changes</Button>
                            <Button variant="outline" onClick={() => handleToggleEdit('contact')}>Cancel</Button>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
