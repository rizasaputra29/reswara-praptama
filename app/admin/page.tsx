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
import { Edit, Save, Plus, Trash2, Eye, Users, UserPlus, Upload, Loader2, Globe, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';
import Image from 'next/image';

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
interface PartnerItem { id: number; logoUrl: string; }
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
  const [partners, setPartners] = useState<PartnerItem[]>([]);
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

  const [isPartnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [newPartner, setNewPartner] = useState({ logoUrl: '' });

  // --- Image Upload States ---
  const [isUploading, setIsUploading] = useState(false);
  const [selectedHeroImage, setSelectedHeroImage] = useState<File | null>(null);
  const [selectedProjectImage, setSelectedProjectImage] = useState<File | null>(null);
  const [selectedSubServiceImage, setSelectedSubServiceImage] = useState<File | null>(null);
  const [selectedPartnerImage, setSelectedPartnerImage] = useState<File | null>(null);

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
      const [dashResponse, empResponse, partnersResponse] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/employees'),
        fetch('/api/content/partners')
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

      if (partnersResponse.ok) {
        setPartners(await partnersResponse.json());
      } else { throw new Error("Failed to fetch partners"); }

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

  // --- Partner Handlers ---
  const handlePartnerSubmit = async () => {
    const isEditing = !!editingPartner;
    const url = '/api/content/partners';
    const method = isEditing ? 'PUT' : 'POST';
    let body = isEditing ? { ...editingPartner } : { ...newPartner };

    try {
      if (selectedPartnerImage) {
        const imageUrl = await handleImageUpload(selectedPartnerImage);
        body.logoUrl = imageUrl;
      }
      
      if (!body.logoUrl) {
        throw new Error("Logo URL is required.");
      }
      
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} partner.`);
      
      toast({ title: "Success", description: `Partner ${isEditing ? 'updated' : 'added'}.` });
      setPartnerDialogOpen(false);
      setEditingPartner(null);
      setNewPartner({ logoUrl: '' });
      setSelectedPartnerImage(null);
      await loadDashboardData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDeletePartner = async (partnerId: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch('/api/content/partners', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: partnerId }) });
      if (!response.ok) throw new Error("Failed to delete partner");
      
      toast({ title: "Success", description: "Partner deleted." });
      await loadDashboardData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openPartnerDialog = (partner: PartnerItem | null) => {
    setEditingPartner(partner);
    if (!partner) {
      setNewPartner({ logoUrl: '' });
    }
    setSelectedPartnerImage(null);
    setPartnerDialogOpen(true);
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

  // --- Preview Component ---
  const PreviewCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
        {children}
      </div>
    </div>
  );

  // --- RENDER LOGIC --- //
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Toaster />
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
            <p className="text-gray-600 mt-2">Sign in to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <Input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="h-12"
                  placeholder="Enter your username"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="h-12"
                  placeholder="Enter your password"
                  required 
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-semibold">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">{currentUser.username} ({currentUser.role})</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'ADMIN' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-black font-medium opacity-90">Total Visits</CardTitle>
                <Eye className="h-4 w-4 text-black opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-black font-bold">{visitStats?.totalVisits ?? 'N/A'}</div>
              </CardContent>
            </Card>
            <Card className="text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-black font-medium opacity-90">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-black opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-black font-bold">{visitStats?.uniqueVisitors ?? 'N/A'}</div>
              </CardContent>
            </Card>
            <Card className="text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-black font-medium opacity-90">Total Projects</CardTitle>
                <Globe className="h-4 w-4 text-black opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{projects?.length ?? 0}</div>
              </CardContent>
            </Card>
            <Card className="text-blcak border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">View Website</CardTitle>
                <Globe className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <Link href="/" passHref>
                  <Button className="w-full bg-black/100 hover:bg-black/80 text-white border-0">
                    Go to Homepage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        )}

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Content Management</CardTitle>
            <CardDescription>Manage your website content with live preview</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={currentUser.role === 'ADMIN' ? 'hero' : 'projects'}>
              <TabsList className={`grid w-full ${currentUser.role === 'ADMIN' ? 'grid-cols-4 md:grid-cols-8' : 'grid-cols-2'} bg-gray-100`}>
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
                    <TabsTrigger value="partners">Partners</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="backup">Backup</TabsTrigger>
                  </>
                )}
              </TabsList>

              {currentUser.role === 'ADMIN' && (
                <>
                  <TabsContent value="hero" className="mt-6">
                    <div className="space-y-6">
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
                              disabled={isUploading}
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
                            
                            {/* Preview */}
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
                    </div>
                  </TabsContent>

                  <TabsContent value="about" className="mt-6">
                    <div className="space-y-6">
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
                              disabled={isUploading}
                              className="flex items-center space-x-2"
                            >
                              {editingSection === 'about' ? (
                                isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />
                              ) : <Edit className="h-4 w-4" />}
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
                            
                            {/* Preview */}
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
                    </div>
                  </TabsContent>
                </>
              )}

              <TabsContent value="services" className="mt-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">Services & Sub-Services</CardTitle>
                        <CardDescription>Manage main service categories and their detailed sub-services</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {services.map(service => (
                        <AccordionItem value={`service-${service.id}`} key={service.id} className="border border-gray-200 rounded-lg mb-4 px-4">
                          <div className="flex items-center justify-between">
                            <AccordionTrigger className="font-semibold flex-1 pr-4 hover:no-underline">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-gray-600" />
                                </div>
                                <span>{service.title}</span>
                              </div>
                            </AccordionTrigger>
                            <div className="flex items-center gap-2 pr-4">
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openSubServiceDialog(null, service.id); }}>
                                    <Plus className="h-4 w-4 text-gray-500" />
                                    <span className="ml-1 text-sm">Add Sub-Service</span>
                                </Button>
                            </div>
                          </div>
                          <AccordionContent className="pl-4 pb-4">
                            <div className="space-y-3 mt-4">
                              {service.subServices?.length > 0 ? service.subServices.map(sub => (
                                <div key={sub.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                                  <div className="flex items-center space-x-3">
                                    {sub.image && (
                                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                        <Image src={sub.image} alt={sub.title} width={48} height={48} className="object-cover" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-semibold text-gray-900">{sub.title}</p>
                                      <p className="text-sm text-gray-600">{sub.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openSubServiceDialog(sub, service.id)} disabled={isUploading}>
                                      <Edit className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSubService(sub.id)}>
                                      <Trash2 className="h-4 w-4 text-red-500"/>
                                    </Button>
                                  </div>
                                </div>
                              )) : (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                  <p className="text-sm">No sub-services yet.</p>
                                  <p className="text-xs text-gray-400">Click "Add Sub-Service" to get started.</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="projects" className="mt-6">
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
              </TabsContent>

              {currentUser.role === 'ADMIN' && (
                <>
                  <TabsContent value="partners" className="mt-6">
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
                  </TabsContent>

                  <TabsContent value="contact" className="mt-6">
                    <div className="space-y-6">
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
                              {Object.keys(contactContent || {}).filter(k => !['id', 'title', 'subtitle'].includes(k)).map(key => (
                                <div key={key}>
                                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                                  {editingSection === 'contact' ? (
                                    <Input 
                                      value={(tempContact as any)?.[key] || ''} 
                                      onChange={(e) => setTempContact({...tempContact!, [key]: e.target.value})}
                                      placeholder={`Enter ${key}...`}
                                    />
                                  ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                      <p className="text-gray-900">{(contactContent as any)?.[key]}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {/* Preview */}
                            <PreviewCard title="Live Preview">
                              <div className="space-y-3">
                                <div className="text-center mb-4">
                                  <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-start space-x-2">
                                    <span className="font-medium text-gray-700">Address:</span>
                                    <span className="text-gray-600">{(editingSection === 'contact' ? tempContact?.address : contactContent?.address) || 'Address...'}</span>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <span className="font-medium text-gray-700">Phone:</span>
                                    <span className="text-gray-600">{(editingSection === 'contact' ? tempContact?.phone : contactContent?.phone) || 'Phone...'}</span>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <span className="font-medium text-gray-700">Email:</span>
                                    <span className="text-gray-600">{(editingSection === 'contact' ? tempContact?.email : contactContent?.email) || 'Email...'}</span>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <span className="font-medium text-gray-700">Hours:</span>
                                    <span className="text-gray-600">{(editingSection === 'contact' ? tempContact?.hours : contactContent?.hours) || 'Hours...'}</span>
                                  </div>
                                </div>
                              </div>
                            </PreviewCard>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="users" className="mt-6">
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-xl">User Management</CardTitle>
                            <CardDescription>Manage employee accounts and permissions</CardDescription>
                          </div>
                          <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setAddEmployeeDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <UserPlus className="h-4 w-4 mr-1"/>
                                Add Employee
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {employees.length > 0 ? (
                          <div className="space-y-2">
                            {employees.map(emp => (
                              <div key={emp.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{emp.username}</p>
                                    <p className="text-sm text-gray-500">Employee</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(emp.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500"/>
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No employees yet</p>
                            <p className="text-sm text-gray-400 mb-4">Start by adding your first employee</p>
                            <Button onClick={() => setAddEmployeeDialogOpen(true)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Employee
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="backup" className="mt-6">
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-xl">Backup & Restore Content</CardTitle>
                        <CardDescription>Export your site's data to a JSON file or import a backup file to restore content</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-6 border border-gray-200 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Export Content</h3>
                            <p className="text-sm text-gray-600 mb-4">Download all your website content as a backup file</p>
                            <Button onClick={handleExport} className="w-full">
                              <Upload className="h-4 w-4 mr-2" /> Export All Content
                            </Button>
                          </div>
                          <div className="p-6 border border-gray-200 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Import Content</h3>
                            <p className="text-sm text-gray-600 mb-4">Restore content from a previously exported backup file</p>
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
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* DIALOGS */}
        <Dialog open={isProjectDialogOpen} onOpenChange={setProjectDialogOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">{editingProject ? 'Edit' : 'Add'} Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <Input placeholder="Project title" 
                               value={editingProject ? editingProject.title : newProject.title} 
                               onChange={(e) => editingProject ? setEditingProject({...editingProject, title: e.target.value}) : setNewProject({...newProject, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <Select defaultValue={editingProject ? String(editingProject.categoryId) : newProject.categoryId} 
                                onValueChange={(value) => editingProject ? setEditingProject({...editingProject, categoryId: Number(value)}) : setNewProject({...newProject, categoryId: value})}>
                            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                            <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Textarea placeholder="Project description" 
                                value={editingProject ? editingProject.description : newProject.description} 
                                onChange={(e) => editingProject ? setEditingProject({...editingProject, description: e.target.value}) : setNewProject({...newProject, description: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <div className="space-y-2">
                        <Input placeholder="Image URL"
                               value={editingProject ? editingProject.image : newProject.image}
                               onChange={(e) => editingProject ? setEditingProject({...editingProject, image: e.target.value}) : setNewProject({...newProject, image: e.target.value})} />
                        <div className="flex items-center space-x-2">
                            <Input type="file" onChange={(e) => setSelectedProjectImage(e.target.files?.[0] || null)} />
                            {selectedProjectImage && <span className="text-sm text-gray-500">{selectedProjectImage.name}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                        <Input placeholder="Client name" 
                               value={editingProject ? (editingProject.client || '') : newProject.client} 
                               onChange={(e) => editingProject ? setEditingProject({...editingProject, client: e.target.value}) : setNewProject({...newProject, client: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Completed Date</label>
                        <Input placeholder="Completion date" 
                               value={editingProject ? (editingProject.completedDate || '') : newProject.completedDate} 
                               onChange={(e) => editingProject ? setEditingProject({...editingProject, completedDate: e.target.value}) : setNewProject({...newProject, completedDate: e.target.value})} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingSubService?.id ? 'Edit' : 'Add'} Sub-Service</DialogTitle>
            </DialogHeader>
            {editingSubService && (
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input placeholder="Sub-service title" value={editingSubService.title} onChange={(e) => setEditingSubService({...editingSubService as SubServiceDraft, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Textarea placeholder="Sub-service description" value={editingSubService.description} onChange={(e) => setEditingSubService({...editingSubService as SubServiceDraft, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="space-y-2">
                    <Input placeholder="Image URL (optional)" value={editingSubService.image || ''} onChange={(e) => setEditingSubService({...editingSubService as SubServiceDraft, image: e.target.value})} />
                    <div className="flex items-center space-x-2">
                        <Input type="file" onChange={(e) => setSelectedSubServiceImage(e.target.files?.[0] || null)} />
                        {selectedSubServiceImage && <span className="text-sm text-gray-500">{selectedSubServiceImage.name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
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
                <DialogHeader>
                  <DialogTitle className="text-xl">{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                      <Input placeholder="Enter category name" value={tempCategoryName} onChange={(e) => setTempCategoryName(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCategorySubmit}>Save Category</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={isPartnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">{editingPartner ? 'Edit' : 'Add'} Partner</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                      <Input placeholder="Partner logo URL" 
                             value={editingPartner ? editingPartner.logoUrl : newPartner.logoUrl} 
                             onChange={(e) => editingPartner ? setEditingPartner({...editingPartner, logoUrl: e.target.value}) : setNewPartner({...newPartner, logoUrl: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Image</label>
                      <div className="flex items-center space-x-2">
                          <Input type="file" onChange={(e) => setSelectedPartnerImage(e.target.files?.[0] || null)} />
                          {selectedPartnerImage && <span className="text-sm text-gray-500">{selectedPartnerImage.name}</span>}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setPartnerDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePartnerSubmit} disabled={isUploading}>
                          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Save Partner
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setAddEmployeeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <Input placeholder="Enter username" value={newEmployee.username} onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <Input type="password" placeholder="Enter password" value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleAddEmployee}>Create Employee</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}