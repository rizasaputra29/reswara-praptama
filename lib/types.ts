// src/lib/types.ts

export interface SubService {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  serviceId: number;
}

export interface SubServiceDraft extends Omit<SubService, 'id'> {
  id?: number | null;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  subServices: SubService[];
}

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface Category {
  id: number;
  name: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  image: string;
  client?: string | null;
  completedDate?: string | null;
  categoryId: number;
}

export interface PartnerItem {
  id: number;
  logoUrl: string;
}

export interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
}

export interface HeroContent {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
}

export interface AboutContent {
  id: number;
  title: string;
  content: string;
  mission: string;
  vision: string;
  values: string[];
}

export interface ContactContent {
  id: number;
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface Employee {
  id: number;
  username: string;
  createdAt: string;
}

// Define the type for the new services page content
export interface ServicesPageContent {
  title: string;
  subtitle: string;
}

export interface DashboardData {
  visits: VisitStats;
  hero: HeroContent;
  about: AboutContent;
  services: ServiceItem[];
  projects: ProjectItem[];
  contact: ContactContent;
  categories: Category[];
  timelineEvents: TimelineEvent[];
  servicesPage: ServicesPageContent; // Add this property
}

export interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
}
