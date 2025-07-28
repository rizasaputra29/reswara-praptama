"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Edit, Save, Plus, Trash2, Eye, Users, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// --- Helper Functions ---
function parseJwt(token: string) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
}

// --- Type Definitions ---
interface SubService { id: number; title: string; description: string; image?: string | null; serviceId: number; }
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

  // --- Dialog & Form States ---
  const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', client: '', completedDate: '', categoryId: '' });
  
  const [isSubServiceDialogOpen, setSubServiceDialogOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null);
  
  const [isAddEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ username: '', password: '' });

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
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  };
  
  const handleToggleEdit = (section: string) => {
    if (editingSection === section) {
      setEditingSection(null);
      // Reset temporary states on cancel
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
    const body = isEditing ? editingProject : newProject;

    try {
      if (!body.title || !body.categoryId) {
        throw new Error("Title and Category are required.");
      }
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} project.`);
      
      toast({ title: "Success", description: `Project ${isEditing ? 'updated' : 'added'}.` });
      setProjectDialogOpen(false);
      setEditingProject(null);
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
    setProjectDialogOpen(true);
  };
  
  // --- Sub-Service Handlers ---
  const handleSubServiceSubmit = async () => {
    const isEditing = !!editingSubService?.id;
    const url = '/api/content/subservices';
    const method = isEditing ? 'PUT' : 'POST';
    const body = editingSubService;
    
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} sub-service.`);
      
      toast({ title: "Success", description: `Sub-service ${isEditing ? 'updated' : 'added'}.` });
      setSubServiceDialogOpen(false);
      setEditingSubService(null);
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
      setEditingSubService({ id: 0, title: '', description: '', image: '', serviceId });
    }
    setSubServiceDialogOpen(true);
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
          </section>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={currentUser.role === 'ADMIN' ? 'hero' : 'projects'}>
              <TabsList className={`grid w-full ${currentUser.role === 'ADMIN' ? 'grid-cols-3 md:grid-cols-6' : 'grid-cols-2'}`}>
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
                           <Button variant="ghost" size="sm" onClick={() => editingSection === 'hero' ? handleContentUpdate('hero', tempHero) : handleToggleEdit('hero')}>
                             {editingSection === 'hero' ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                             {editingSection === 'hero' ? 'Save' : 'Edit'}
                           </Button>
                         </div>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div><label className="font-semibold">Title</label>{editingSection === 'hero' ? (<Input value={tempHero?.title || ''} onChange={(e) => setTempHero({...tempHero!, title: e.target.value})} />) : (<p className="text-muted-foreground">{heroContent?.title}</p>)}</div>
                         <div><label className="font-semibold">Subtitle</label>{editingSection === 'hero' ? (<Textarea value={tempHero?.subtitle || ''} onChange={(e) => setTempHero({...tempHero!, subtitle: e.target.value})} />) : (<p className="text-muted-foreground">{heroContent?.subtitle}</p>)}</div>
                         <div><label className="font-semibold">Button Text</label>{editingSection === 'hero' ? (<Input value={tempHero?.buttonText || ''} onChange={(e) => setTempHero({...tempHero!, buttonText: e.target.value})} />) : (<p className="text-muted-foreground">{heroContent?.buttonText}</p>)}</div>
                         <div><label className="font-semibold">Image URL</label>{editingSection === 'hero' ? (<Input value={tempHero?.image || ''} onChange={(e) => setTempHero({...tempHero!, image: e.target.value})} />) : (<p className="text-muted-foreground">{heroContent?.image}</p>)}</div>
                       </CardContent>
                     </Card>
                  </TabsContent>

                  <TabsContent value="about" className="mt-4">
                    <Card>
                       <CardHeader>
                         <div className="flex justify-between items-center">
                           <CardTitle>About Section</CardTitle>
                           <Button variant="ghost" size="sm" onClick={() => editingSection === 'about' ? handleContentUpdate('about', tempAbout) : handleToggleEdit('about')}>
                            {editingSection === 'about' ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
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
                    <CardTitle>Services & Sub-Services</CardTitle>
                    <CardDescription>Manage main service categories and their detailed sub-services.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {services.map(service => (
                        <AccordionItem value={`service-${service.id}`} key={service.id}>
                          <AccordionTrigger className="font-semibold">{service.title}</AccordionTrigger>
                          <AccordionContent className="pl-4">
                            <div className="flex justify-end mb-4">
                              <Button size="sm" onClick={() => openSubServiceDialog(null, service.id)}>
                                <Plus className="mr-2 h-4 w-4"/> Add Sub-Service
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {service.subServices?.length > 0 ? service.subServices.map(sub => (
                                <div key={sub.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                                  <div>
                                    <p className="font-semibold">{sub.title}</p>
                                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => openSubServiceDialog(sub, service.id)}><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSubService(sub.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
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
                    <Input placeholder="Image URL" 
                           value={editingProject ? editingProject.image : newProject.image} 
                           onChange={(e) => editingProject ? setEditingProject({...editingProject, image: e.target.value}) : setNewProject({...newProject, image: e.target.value})} />
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
                        <Button onClick={handleProjectSubmit}>Save Changes</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        
        <Dialog open={isSubServiceDialogOpen} onOpenChange={setSubServiceDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingSubService?.id ? 'Edit' : 'Add'} Sub-Service</DialogTitle></DialogHeader>
            {editingSubService && (
              <div className="space-y-4 py-4">
                <Input placeholder="Title" value={editingSubService.title} onChange={(e) => setEditingSubService({...editingSubService, title: e.target.value})} />
                <Textarea placeholder="Description" value={editingSubService.description} onChange={(e) => setEditingSubService({...editingSubService, description: e.target.value})} />
                <Input placeholder="Image URL (optional)" value={editingSubService.image || ''} onChange={(e) => setEditingSubService({...editingSubService, image: e.target.value})} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSubServiceDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubServiceSubmit}>Save</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}