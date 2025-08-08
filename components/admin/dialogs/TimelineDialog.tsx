// components/admin/dialogs/TimelineDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { TimelineEvent } from '@/lib/types';

interface TimelineDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent: Partial<TimelineEvent> | null;
  setEditingEvent: (event: Partial<TimelineEvent> | null) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export const TimelineDialog: React.FC<TimelineDialogProps> = ({
  isOpen, onOpenChange, editingEvent, setEditingEvent, onSubmit, isSubmitting
}) => {
  const isEditing = !!editingEvent?.id;

  if (!editingEvent) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingEvent({ ...editingEvent, [name]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{isEditing ? 'Edit' : 'Add'} Timeline Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <Input name="year" placeholder="e.g., 2023" value={editingEvent.year || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input name="title" placeholder="Event title" value={editingEvent.title || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Textarea name="description" placeholder="Event description" value={editingEvent.description || ''} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};