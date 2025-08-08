// src/hooks/useAdminData.ts

import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData } from '@/lib/api';
import { DashboardData, Employee, PartnerItem, TimelineEvent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useAdminData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]); // State for timeline events
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all data including timeline events
      const { dashboard, employees, partners, timelineEvents } = await fetchDashboardData();
      setData(dashboard);
      setEmployees(employees);
      setPartners(partners);
      setTimelineEvents(timelineEvents); // Set the timeline state
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load dashboard data.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Return the new state along with existing ones
  return { data, employees, partners, timelineEvents, isLoading, loadData };
};
