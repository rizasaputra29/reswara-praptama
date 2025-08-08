// src/lib/api.ts

import { DashboardData, Employee, PartnerItem, TimelineEvent } from '@/lib/types'; // Import TimelineEvent

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const fetchDashboardData = async (): Promise<{ dashboard: DashboardData; employees: Employee[]; partners: PartnerItem[]; timelineEvents: TimelineEvent[] }> => {
  const [dashResponse, empResponse, partnersResponse, timelineResponse] = await Promise.all([
    fetch('/api/dashboard'),
    fetch('/api/employees'),
    fetch('/api/content/partners'),
    fetch('/api/content/timeline'), // Add fetch for timeline
  ]);

  if (!dashResponse.ok) throw new Error('Failed to fetch dashboard data');
  const dashboard = await dashResponse.json();

  if (!empResponse.ok) throw new Error('Failed to fetch employees');
  const employees = await empResponse.json();

  if (!partnersResponse.ok) throw new Error('Failed to fetch partners');
  const partners = await partnersResponse.json();

  if (!timelineResponse.ok) throw new Error('Failed to fetch timeline events'); // Add error handling
  const timelineEvents = await timelineResponse.json(); // Get timeline data

  return { dashboard, employees, partners, timelineEvents }; // Return timelineEvents
};

export const uploadImage = async (file: File): Promise<string> => {
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
  return url;
};