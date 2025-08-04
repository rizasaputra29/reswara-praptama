// src/components/admin/dashboard/DashboardStats.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Users, Globe } from 'lucide-react';
import Link from 'next/link';
import { User, VisitStats } from '@/lib/types';

interface DashboardStatsProps {
  currentUser: User;
  visitStats: VisitStats | null;
  projectsCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ currentUser, visitStats, projectsCount }) => {
  if (currentUser.role !== 'ADMIN') {
    return null;
  }

  return (
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
          <div className="text-2xl font-bold text-black">{projectsCount}</div>
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
  );
};