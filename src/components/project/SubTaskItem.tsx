
import React from 'react';
import { SubTask } from '@/types/project';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface SubTaskItemProps {
  subtask: SubTask;
  onStatusChange: (id: string, status: 'not-started' | 'in-progress' | 'completed') => void;
}

export const SubTaskItem: React.FC<SubTaskItemProps> = ({ subtask, onStatusChange }) => {
  const handleStatusChange = (checked: boolean | 'indeterminate') => {
    const newStatus = checked === true ? 'completed' : 'not-started';
    onStatusChange(subtask.id, newStatus);
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="pt-0.5">
        <Checkbox 
          checked={subtask.status === 'completed'} 
          onCheckedChange={handleStatusChange}
          className="data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className={cn(
            "text-sm",
            subtask.status === 'completed' && "line-through text-muted-foreground"
          )}>
            {subtask.name}
          </span>
          {subtask.estimatedMinutes && (
            <span className="text-xs text-muted-foreground">
              {subtask.estimatedMinutes} min
            </span>
          )}
        </div>
        {subtask.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtask.description}</p>
        )}
      </div>
    </div>
  );
};
