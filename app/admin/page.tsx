"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, Plus, Trash2, Eye, Users, TrendingUp } from 'lucide-react';

// --- Tipe Data ---
interface Category { id: number; name: string; }
interface ProjectItem { id: number; title: string; description: string; image: string; client?: string | null; completedDate?: string | null; categoryId: number; }
interface VisitStats { totalVisits: number; uniqueVisitors: number; }
interface HeroContent { id: number; title: string; subtitle: string; buttonText: string; }
interface AboutContent { id: number; title: string; content: string; mission: string; vision: string; }
interface ServiceItem { id: number; title: string; description: string; icon: string; }
interface ContactContent { id: number; title: string; subtitle: string; address: string; phone: string; email: string; hours: string; }

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State loading baru

  // --- States untuk setiap section ---
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', categoryId: '' });
  const [isAddProjectDialogOpen, setAddProjectDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true); // Mulai loading
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setVisitStats(data.visits);
        setHeroContent(data.hero);
        setAboutContent(data.about);
        setServices(data.services);
        setProjects(data.projects);
        setContactContent(data.contact);
        setCategories(data.categories);
      } else {
          throw new Error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
        setIsLoading(false); // Selesai loading
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
      alert('Login failed');
    }
  };

  const handleContentUpdate = async (section: string, updatedContent: any) => {
    // ... (logika ini tidak perlu diubah)
  };

  const handleToggleEdit = (section: string) => {
    // ... (logika ini tidak perlu diubah)
  };
  
  const handleItemChange = (section: 'services' | 'projects', index: number, field: string, value: string | number) => {
    // ... (logika ini tidak perlu diubah)
  };
  
  const handleAddProject = async () => {
      // ... (logika ini tidak perlu diubah)
  };

  // Tampilkan loading indicator jika data belum siap
  if (isLoading && isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin Dashboard...</div>;
  }
  
    // Login form...
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
                   <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2">Password</label>
                   <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                 </div>
                 <Button type="submit" className="w-full">Login</Button>
               </form>
             </CardContent>
           </Card>
         </div>
       );
     }
  
  // Tampilkan dasbor jika sudah login dan data sudah termuat
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ... (Seluruh JSX dasbor Anda dari langkah sebelumnya bisa ditempel di sini) ... */}
      {/* Pastikan Anda tidak mengubah bagian JSX, hanya logika pengambilan datanya */}
    </div>
  );
}