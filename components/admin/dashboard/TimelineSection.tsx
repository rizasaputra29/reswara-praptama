// components/admin/dashboard/TimelineSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';
import { TimelineEvent } from '@/lib/types';

interface TimelineSectionProps {
  timelineEvents: TimelineEvent[];
  openTimelineDialog: (event: Partial<TimelineEvent> | null) => void;
  handleDeleteTimelineEvent: (id: number) => Promise<void>;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timelineEvents, openTimelineDialog, handleDeleteTimelineEvent }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Timeline</CardTitle>
            <CardDescription>Manage the events on your company timeline</CardDescription>
          </div>
          <Button size="sm" onClick={() => openTimelineDialog({})}>
            <Plus className="h-4 w-4 mr-1"/>
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {timelineEvents.length > 0 ? (
          <div className="space-y-3">
            {timelineEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-blue-600">{event.year}</p>
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openTimelineDialog(event)}>
                    <Edit className="h-4 w-4"/>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTimelineEvent(event.id)}>
                    <Trash2 className="h-4 w-4 text-red-500"/>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No timeline events yet</p>
            <p className="text-sm text-gray-400 mb-4">Start by adding your first event</p>
            <Button onClick={() => openTimelineDialog({})}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};