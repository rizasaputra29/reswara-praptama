// app/admin/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Edit, Save, Plus, Trash2, Eye, Users, UserPlus, Upload, Loader2, Globe } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';

// --- Helper Functions ---
function parseJwt(token: string) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
}

// --- Type Definitions ---
interface SubService { id: number; title: string; description: string; image?: string | null; serviceId: number; }
interface SubServiceDraft extends Omit<SubService, 'id'> {
  id?: number | null;
}
interface ServiceItem { id: number; title: string; description: string; icon: string; subServices: SubService[]; }
interface User { id: number; username: string; role: 'ADMIN' | 'EMPLOYEE'; }
interface Category { id: number; name: string; }
interface ProjectItem { id: number; title: string; description: string; image: string; client?: string | null; completedDate?: string | null; categoryId: number; }
interface VisitStats { totalVisits: number; uniqueVisitors: number; }
interface HeroContent { id: number; title: string; subtitle: string; buttonText: string; image: string; }
interface AboutContent { id: number; title: string; content: string; mission: string; vision: string; values: string[]; }
interface ContactContent { id: number; title: string; subtitle: string; address: string; phone: string; email: string; hours: string; }
interface Employee { id: number; username: string; createdAt: string; }

export default function Admin() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // --- Data States ---
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // --- Temporary Edit States ---
  const [tempHero, setTempHero] = useState<HeroContent | null>(null);
  const [tempAbout, setTempAbout] = useState<AboutContent | null>(null);
  const [tempContact, setTempContact] = useState<ContactContent | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState<string>('');

  // --- Dialog & Form States ---
  const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', client: '', completedDate: '', categoryId: '' });
  
  const [isSubServiceDialogOpen, setSubServiceDialogOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState<SubServiceDraft | null>(null);
  
  const [isAddEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ username: '', password: '' });
  
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // --- Image Upload States ---
  const [isUploading, setIsUploading] = useState(false);
  const [selectedHeroImage, setSelectedHeroImage] = useState<File | null>(null);
  const [selectedProjectImage, setSelectedProjectImage] = useState<File | null>(null);
  const [selectedSubServiceImage, setSelectedSubServiceImage] = useState<File | null>(null);

  const importFileRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      const userData = parseJwt(token);
      if (userData) {
        setCurrentUser(userData);
        loadDashboardData();
      } else {
        handleLogout();
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // --- Data Fetching ---
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashResponse, empResponse] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/employees')
      ]);

      if (!dashResponse.ok) throw new Error("Failed to fetch dashboard data");
      const data = await dashResponse.json();
      setVisitStats(data.visits);
      setHeroContent(data.hero); setTempHero(data.hero);
      setAboutContent(data.about); setTempAbout(data.about);
      setServices(data.services);
      setProjects(data.projects);
      setContactContent(data.contact); setTempContact(data.contact);
      setCategories(data.categories);

      if (empResponse.ok) {
        setEmployees(await empResponse.json());
      } else { throw new Error("Failed to fetch employees"); }

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not load dashboard data." });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Image Upload Handler ---
  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image upload failed.');
      }

      const { url } = await response.json();
      toast({ title: "Success", description: "Image uploaded successfully." });
      return url;
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
      throw error; 
    } finally {
      setIsUploading(false);
    }
  };

  // --- Auth Handlers ---
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
        setCurrentUser(parseJwt(token));
        await loadDashboardData();
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid credentials." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Login Error", description: "An unexpected error occurred." });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setCurrentUser(null);
  };

  // --- Generic Content Update ---
  const handleContentUpdate = async (section: string, updatedContent: any) => {
    try {
      if (section === 'hero' && selectedHeroImage) {
        updatedContent.image = await handleImageUpload(selectedHeroImage);
      }
      
      const response = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update ${section}`);
      }
      
      toast({ title: "Success", description: `${section.charAt(0).toUpperCase() + section.slice(1)} content updated.` });
      await loadDashboardData();
      setEditingSection(null);
      setSelectedHeroImage(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  };
  
  const handleToggleEdit = (section: string) => {
    if (editingSection === section) {
      setEditingSection(null);
      setTempHero(heroContent);
      setTempAbout(aboutContent);
      setTempContact(contactContent);
    } else {
      setEditingSection(section);
    }
  };

  // --- Project Handlers ---
  const handleProjectSubmit = async () => {
    const isEditing = !!editingProject;
    const url = '/api/content/projects';
    const method = isEditing ? 'PUT' : 'POST';
    let body = isEditing ? { ...editingProject } : { ...newProject };

    try {
      if (!body.title || !body.categoryId) {
        throw new Error("Title and Category are required.");
      }
      
      if (selectedProjectImage) {
        const imageUrl = await handleImageUpload(selectedProjectImage);
        body.image = imageUrl;
      }
      
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} project.`);
      
      toast({ title: "Success", description: `Project ${isEditing ? 'updated' : 'added'}.` });
      setProjectDialogOpen(false);
      setEditingProject(null);
      setSelectedProjectImage(null);
      await loadDashboardData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch('/api/content/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: projectId }) });
      if (!response.ok) throw new Error("Failed to delete project");
      
      toast({ title: "Success", description: "Project deleted." });
      await loadDashboardData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openProjectDialog = (project: ProjectItem | null) => {
    setEditingProject(project);
    if (!project) {
      setNewProject({ title: '', description: '', image: '', client: '', completedDate: '', categoryId: '' });
    }
    setSelectedProjectImage(null);
    setProjectDialogOpen(true);
  };
  
  // --- Sub-Service Handlers ---
  const handleSubServiceSubmit = async () => {
    if (!editingSubService?.title || !editingSubService.serviceId) {
        toast({ variant: "destructive", title: "Error", description: "Title and Service ID are required." });
        return;
    }

    const isEditing = !!editingSubService?.id;
    const url = '/api/content/subservices';
    const method = isEditing ? 'PUT' : 'POST';
    let body = { ...editingSubService };
    
    try {
      if (selectedSubServiceImage) {
        const imageUrl = await handleImageUpload(selectedSubServiceImage);
        body.image = imageUrl;
      }
      
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} sub-service.`);
      
      toast({ title: "Success", description: `Sub-service ${isEditing ? 'updated' : 'added'}.` });
      setSubServiceDialogOpen(false);
      setEditingSubService(null);
      setSelectedSubServiceImage(null);
      await loadDashboardData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDeleteSubService = async (subServiceId: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch('/api/content/subservices', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: subServiceId }) });
      if (!response.ok) throw new Error("Failed to delete sub-service.");
      
      toast({ title: "Success", description: "Sub-service deleted." });
      await loadDashboardData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openSubServiceDialog = (subService: SubService | null, serviceId?: number) => {
    if (subService) {
      setEditingSubService(subService);
    } else if (serviceId) {
      setEditingSubService({ id: undefined, title: '', description: '', image: '', serviceId });
    }
    setSelectedSubServiceImage(null);
    setSubServiceDialogOpen(true);
  };

  // --- Category Handlers ---
  const handleCategorySubmit = async () => {
    if (!tempCategoryName.trim()) {
        toast({ variant: "destructive", title: "Error", description: "Category name cannot be empty." });
        return;
    }

    const isEditing = !!editingCategory;
    const url = '/api/content/categories';
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing ? { id: editingCategory?.id, name: tempCategoryName } : { name: tempCategoryName };

    try {
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'add'} category.`);
        }
        toast({ title: "Success", description: `Category ${isEditing ? 'updated' : 'added'}.` });
        setCategoryDialogOpen(false);
        setEditingCategory(null);
        setTempCategoryName('');
        await loadDashboardData();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };
  
  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Are you sure? This will also delete all associated projects.")) return;
    try {
        const response = await fetch('/api/content/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: categoryId }) });
        if (!response.ok) throw new Error("Failed to delete category.");
        toast({ title: "Success", description: "Category and associated projects deleted." });
        await loadDashboardData();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openCategoryDialog = (category: Category | null) => {
    setEditingCategory(category);
    setTempCategoryName(category ? category.name : '');
    setCategoryDialogOpen(true);
  };
  
  // --- Employee Handlers ---
  const handleAddEmployee = async () => {
    try {
        const response = await fetch('/api/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newEmployee) });
        if (!response.ok) { const err = await response.json(); throw new Error(err.error); }
        toast({ title: "Success", description: "New employee created." });
        setAddEmployeeDialogOpen(false);
        setNewEmployee({ username: '', password: '' });
        await loadDashboardData();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch('/api/employees', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: employeeId }) });
      if (!response.ok) throw new Error("Failed to delete employee.");
      toast({ title: "Success", description: "Employee deleted." });
      await loadDashboardData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // --- Backup/Import Handlers ---
  const handleExport = async () => {
    try {
        const response = await fetch('/api/content/backup');
        if (!response.ok) {
            throw new Error('Failed to fetch backup data');
        }
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resawara-backup-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Success", description: "Content exported successfully." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        const response = await fetch('/api/content/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content),
        });
        if (!response.ok) {
          throw new Error('Failed to import content.');
        }
        toast({ title: "Success", description: "Content imported successfully. Reloading dashboard..." });
        await loadDashboardData();
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // --- RENDER LOGIC --- //
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Toaster />
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="text-center">Admin Login</CardTitle></CardHeader>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-muted-foreground">Logged in as {currentUser.username} ({currentUser.role})</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </header>
      
      <main>
        {currentUser.role === 'ADMIN' && (
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">View Website</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Link href="/" passHref>
                        <Button className="w-full">Go to Homepage</Button>
                    </Link>
                </CardContent>
            </Card>
          </section>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={currentUser.role === 'ADMIN' ? 'hero' : 'projects'}>
              <TabsList className={`grid w-full ${currentUser.role === 'ADMIN' ? 'grid-cols-3 md:grid-cols-7' : 'grid-cols-2'}`}>
                {currentUser.role === 'ADMIN' && (
                  <>
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                  </>
                )}
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                {currentUser.role === 'ADMIN' && (
                  <>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="backup">Backup</TabsTrigger>
                  </>
                )}
              </TabsList>

              {currentUser.role === 'ADMIN' && (
                <>
                  <TabsContent value="hero" className="mt-4">
                     <Card>
                       <CardHeader>
                         <div className="flex justify-between items-center">
                           <CardTitle>Hero Section</CardTitle>
                           <Button variant="ghost" size="sm" onClick={() => editingSection === 'hero' ? handleContentUpdate('hero', tempHero) : handleToggleEdit('hero')} disabled={isUploading}>
                             {editingSection === 'hero' ? (isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />) : <Edit className="mr-2 h-4 w-4" />}
                             {editingSection === 'hero' ? 'Save' : 'Edit'}
                           </Button>
                         </div>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div><label className="font-semibold">Title</label>{editingSection === 'hero' ? (<Input value={tempHero?.title || ''} onChange={(e) => setTempHero({...tempHero!, title: e.target.value})} />) : (<p className="text-muted-foreground">{heroContent?.title}</p>)}</div>
                         <div><label className="font-semibold">Subtitle</label>{editingSection === 'hero' ? (<Textarea value={tempHero?.subtitle || ''} onChange={(e) => setTempHero({...tempHero!, subtitle: e.target.value})} />) : (<p className="text-muted-foreground">{heroContent?.subtitle}</p>)}</div>
                         <div><label className="font-semibold">Button Text</label>{editingSection === 'hero' ? (<Input value={tempHero?.buttonText || ''} onChange={(e) => setTempHero({...tempHero!, buttonText: e.target.value})} />) : (<p className="text-muted-foreground">{heroContent?.buttonText}</p>)}</div>
                       </CardContent>
                     </Card>
                  </TabsContent>

                  <TabsContent value="about" className="mt-4">
                    <Card>
                       <CardHeader>
                         <div className="flex justify-between items-center">
                           <CardTitle>About Section</CardTitle>
                           <Button variant="ghost" size="sm" onClick={() => editingSection === 'about' ? handleContentUpdate('about', tempAbout) : handleToggleEdit('about')} disabled={isUploading}>
                            {editingSection === 'about' ? (isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />) : <Edit className="mr-2 h-4 w-4" />}
                            {editingSection === 'about' ? 'Save' : 'Edit'}
                           </Button>
                         </div>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div><label className="font-semibold">Title</label>{editingSection === 'about' ? (<Input value={tempAbout?.title || ''} onChange={(e) => setTempAbout({...tempAbout!, title: e.target.value})} />) : (<p className="text-muted-foreground">{aboutContent?.title}</p>)}</div>
                         <div><label className="font-semibold">Content</label>{editingSection === 'about' ? (<Textarea rows={5} value={tempAbout?.content || ''} onChange={(e) => setTempAbout({...tempAbout!, content: e.target.value})} />) : (<p className="text-muted-foreground">{aboutContent?.content}</p>)}</div>
                         <div><label className="font-semibold">Mission</label>{editingSection === 'about' ? (<Textarea value={tempAbout?.mission || ''} onChange={(e) => setTempAbout({...tempAbout!, mission: e.target.value})} />) : (<p className="text-muted-foreground">{aboutContent?.mission}</p>)}</div>
                         <div><label className="font-semibold">Vision</label>{editingSection === 'about' ? (<Textarea value={tempAbout?.vision || ''} onChange={(e) => setTempAbout({...tempAbout!, vision: e.target.value})} />) : (<p className="text-muted-foreground">{aboutContent?.vision}</p>)}</div>
                       </CardContent>
                     </Card>
                  </TabsContent>
                </>
              )}

              <TabsContent value="services" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Services & Sub-Services</CardTitle>
                      <Button size="sm" onClick={() => openCategoryDialog(null)}><Plus className="mr-2 h-4 w-4"/> Add Category</Button>
                    </div>
                    <CardDescription>Manage main service categories and their detailed sub-services.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {services.map(service => (
                        <AccordionItem value={`service-${service.id}`} key={service.id}>
                          <div className="flex items-center justify-between">
                            <AccordionTrigger className="font-semibold flex-1 pr-4">
                              {service.title}
                            </AccordionTrigger>
                            <div className="flex items-center gap-2 pr-4">
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openSubServiceDialog(null, service.id); }}>
                                    <Plus className="h-4 w-4 text-gray-500" />
                                </Button>
                            </div>
                          </div>
                          <AccordionContent className="pl-4">
                            <div className="space-y-2">
                              {service.subServices?.length > 0 ? service.subServices.map(sub => (
                                <div key={sub.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                                  <div>
                                    <p className="font-semibold">{sub.title}</p>
                                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => openSubServiceDialog(sub, service.id)} disabled={isUploading}>
                                      <Edit className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSubService(sub.id)}>
                                      <Trash2 className="h-4 w-4 text-red-500"/>
                                    </Button>
                                  </div>
                                </div>
                              )) : <p className="text-sm text-muted-foreground text-center py-4">No sub-services yet.</p>}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="projects" className="mt-4">
                  <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Projects</CardTitle>
                          <Button size="sm" onClick={() => openProjectDialog(null)}><Plus className="mr-2 h-4 w-4"/>Add Project</Button>
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
                                <Button variant="ghost" size="icon" onClick={() => openProjectDialog(project)}><Edit className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                              </div>
                            </div>
                          ))}
                      </CardContent>
                  </Card>
              </TabsContent>
              
              {currentUser.role === 'ADMIN' && (
                <>
                  <TabsContent value="contact" className="mt-4">
                     <Card>
                       <CardHeader>
                         <div className="flex justify-between items-center">
                           <CardTitle>Contact Information</CardTitle>
                           <Button variant="ghost" size="sm" onClick={() => editingSection === 'contact' ? handleContentUpdate('contact', tempContact) : handleToggleEdit('contact')}>
                             {editingSection === 'contact' ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                             {editingSection === 'contact' ? 'Save' : 'Edit'}
                           </Button>
                         </div>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         {Object.keys(contactContent || {}).filter(k => !['id', 'title', 'subtitle'].includes(k)).map(key => (
                             <div key={key}>
                                 <label className="font-semibold capitalize">{key}</label>
                                 {editingSection === 'contact' ? (<Input value={(tempContact as any)?.[key] || ''} onChange={(e) => setTempContact({...tempContact!, [key]: e.target.value})} />) : (<p className="text-muted-foreground">{(contactContent as any)?.[key]}</p>)}
                             </div>
                         ))}
                       </CardContent>
                     </Card>
                  </TabsContent>
                  <TabsContent value="users" className="mt-4">
                     <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>User Management</CardTitle>
                            <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setAddEmployeeDialogOpen}>
                              <DialogTrigger asChild><Button size="sm"><UserPlus className="mr-2 h-4 w-4"/>Add Employee</Button></DialogTrigger>
                              <DialogContent>
                                <DialogHeader><DialogTitle>Add New Employee</DialogTitle></DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Input placeholder="Username" value={newEmployee.username} onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})} />
                                  <Input type="password" placeholder="Password" value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} />
                                  <div className="flex justify-end gap-2">
                                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                    <Button onClick={handleAddEmployee}>Create Employee</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <CardDescription>Manage employee accounts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {employees.map(emp => (
                            <div key={emp.id} className="flex items-center justify-between p-2 border rounded-md">
                              <p className="font-medium">{emp.username}</p>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(emp.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                            </div>
                          ))}
                        </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="backup" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Backup & Restore Content</CardTitle>
                        <CardDescription>Export your site's data to a JSON file or import a backup file to restore content.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <Button onClick={handleExport} className="w-full">
                            <Upload className="mr-2 h-4 w-4" /> Export All Content
                          </Button>
                          <div className="relative mt-4">
                            <Input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleImport}
                              ref={importFileRef}
                              accept="application/json"
                            />
                            <Button className="w-full" variant="outline" onClick={() => importFileRef.current?.click()}>
                              <Save className="mr-2 h-4 w-4" /> Import Content
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* DIALOGS */}
        <Dialog open={isProjectDialogOpen} onOpenChange={setProjectDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>{editingProject ? 'Edit' : 'Add'} Project</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <Input placeholder="Title" 
                           value={editingProject ? editingProject.title : newProject.title} 
                           onChange={(e) => editingProject ? setEditingProject({...editingProject, title: e.target.value}) : setNewProject({...newProject, title: e.target.value})} />
                    <Textarea placeholder="Description" 
                              value={editingProject ? editingProject.description : newProject.description} 
                              onChange={(e) => editingProject ? setEditingProject({...editingProject, description: e.target.value}) : setNewProject({...newProject, description: e.target.value})} />
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Image URL or Upload</label>
                      <Input placeholder="Image URL"
                             value={editingProject ? editingProject.image : newProject.image}
                             onChange={(e) => editingProject ? setEditingProject({...editingProject, image: e.target.value}) : setNewProject({...newProject, image: e.target.value})} />
                      <div className="flex items-center space-x-2">
                          <Input type="file" onChange={(e) => setSelectedProjectImage(e.target.files?.[0] || null)} />
                          {selectedProjectImage && <span className="text-sm text-gray-500">{selectedProjectImage.name}</span>}
                      </div>
                    </div>
                    <Input placeholder="Client" 
                           value={editingProject ? (editingProject.client || '') : newProject.client} 
                           onChange={(e) => editingProject ? setEditingProject({...editingProject, client: e.target.value}) : setNewProject({...newProject, client: e.target.value})} />
                    <Input placeholder="Completed Date" 
                           value={editingProject ? (editingProject.completedDate || '') : newProject.completedDate} 
                           onChange={(e) => editingProject ? setEditingProject({...editingProject, completedDate: e.target.value}) : setNewProject({...newProject, completedDate: e.target.value})} />
                    <Select defaultValue={editingProject ? String(editingProject.categoryId) : newProject.categoryId} 
                            onValueChange={(value) => editingProject ? setEditingProject({...editingProject, categoryId: Number(value)}) : setNewProject({...newProject, categoryId: value})}>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleProjectSubmit} disabled={isUploading}>
                          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        
        <Dialog open={isSubServiceDialogOpen} onOpenChange={setSubServiceDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingSubService?.id ? 'Edit' : 'Add'} Sub-Service</DialogTitle></DialogHeader>
            {editingSubService && (
              <div className="space-y-4 py-4">
                <Input placeholder="Title" value={editingSubService.title} onChange={(e) => setEditingSubService({...editingSubService as SubServiceDraft, title: e.target.value})} />
                <Textarea placeholder="Description" value={editingSubService.description} onChange={(e) => setEditingSubService({...editingSubService as SubServiceDraft, description: e.target.value})} />
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Image URL or Upload</label>
                    <Input placeholder="Image URL (optional)" value={editingSubService.image || ''} onChange={(e) => setEditingSubService({...editingSubService as SubServiceDraft, image: e.target.value})} />
                    <div className="flex items-center space-x-2">
                        <Input type="file" onChange={(e) => setSelectedSubServiceImage(e.target.files?.[0] || null)} />
                        {selectedSubServiceImage && <span className="text-sm text-gray-500">{selectedSubServiceImage.name}</span>}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSubServiceDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubServiceSubmit} disabled={isUploading}>
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isCategoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <Input placeholder="Category Name" value={tempCategoryName} onChange={(e) => setTempCategoryName(e.target.value)} />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCategorySubmit}>Save Category</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}