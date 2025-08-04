// src/hooks/useAdminData.ts

import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData } from '@/lib/api';
import { DashboardData, Employee, PartnerItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useAdminData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { dashboard, employees, partners } = await fetchDashboardData();
      setData(dashboard);
      setEmployees(employees);
      setPartners(partners);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load dashboard data.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, employees, partners, isLoading, loadData };
};