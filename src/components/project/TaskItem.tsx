
import React, { useState } from 'react';
import { Task } from '@/types/project';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressBar } from './ProgressBar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubTaskItem } from './SubTaskItem';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: 'not-started' | 'in-progress' | 'completed') => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);

  const handleStatusChange = (checked: boolean | 'indeterminate') => {
    const newStatus = checked === true ? 'completed' : 'not-started';
    onStatusChange(task.id, newStatus);
  };

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div className="border rounded-md p-3 mb-2 transition-all bg-card">
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <Checkbox 
            checked={task.status === 'completed'}
            onCheckedChange={handleStatusChange}
            className="data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div 
              className={cn(
                "font-medium cursor-pointer flex items-center",
                task.status === 'completed' && "line-through text-muted-foreground"
              )}
              onClick={() => hasSubtasks && setExpanded(!expanded)}
            >
              {hasSubtasks && (
                <span className="mr-2">
                  {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
              )}
              {task.name}
            </div>
            {task.estimatedMinutes && (
              <span className="text-xs text-muted-foreground">
                {task.estimatedMinutes} min
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}
          <div className="mt-2">
            <ProgressBar value={task.progress} size="sm" />
          </div>
        </div>
      </div>
      {expanded && hasSubtasks && (
        <div className="mt-3 ml-6 pl-3 border-l">
          {task.subtasks.map((subtask) => (
            <SubTaskItem 
              key={subtask.id} 
              subtask={subtask} 
              onStatusChange={onStatusChange} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
