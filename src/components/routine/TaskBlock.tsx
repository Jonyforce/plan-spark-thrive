
import React from 'react';
import { RoutineTask } from '@/types/routine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, RotateCcw, Hourglass } from 'lucide-react';
import { formatMinutesToTime } from '@/utils/timeUtils';

interface TaskBlockProps {
  task: RoutineTask & { completion?: any };
  onClick?: () => void;
  isDraggable?: boolean;
}

const TaskBlock: React.FC<TaskBlockProps> = ({
  task,
  onClick,
  isDraggable = false
}) => {
  const isCompleted = task.completion?.isCompleted;
  const isSkipped = task.completion?.isSkipped;
  
  // Calculate task height based on duration (1 min = 1px)
  const taskHeight = Math.max(60, task.duration / 2);
  
  const getTaskTypeColor = () => {
    switch (task.taskType) {
      case 'break':
        return 'bg-green-100 border-green-300 dark:bg-green-950/30 dark:border-green-800';
      case 'custom':
        return 'bg-purple-100 border-purple-300 dark:bg-purple-950/30 dark:border-purple-800';
      case 'disruption':
        return 'bg-red-100 border-red-300 dark:bg-red-950/30 dark:border-red-800';
      case 'pending':
        return 'bg-amber-100 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800';
      default:
        return `bg-${task.color || 'blue'}-100 border-${task.color || 'blue'}-300 dark:bg-${task.color || 'blue'}-950/30 dark:border-${task.color || 'blue'}-800`;
    }
  };
  
  return (
    <Card
      className={`
        relative cursor-pointer transition-all
        ${getTaskTypeColor()}
        ${isCompleted ? 'opacity-60' : ''}
        ${isSkipped ? 'opacity-40 line-through' : ''}
        hover:shadow-md
        ${isDraggable ? 'cursor-move' : ''}
      `}
      style={{ 
        height: `${taskHeight}px`,
        borderLeft: `4px solid var(--${task.color || 'brand'}-500)`
      }}
      onClick={onClick}
    >
      <CardContent className="p-2 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{task.name}</h3>
            <div className="flex items-center gap-1">
              {task.isRecurring && (
                <RotateCcw className="h-3 w-3 text-muted-foreground" />
              )}
              {isCompleted && (
                <Check className="h-3 w-3 text-green-500" />
              )}
              {isSkipped && (
                <Badge variant="outline" className="text-xs py-0 h-4">Skipped</Badge>
              )}
            </div>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground truncate">{task.description}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatMinutesToTime(task.startTime)} - {formatMinutesToTime(task.startTime + task.duration)}
          </div>
          <div className="text-xs text-muted-foreground">
            <Hourglass className="h-3 w-3 inline mr-1" />
            {task.duration}m
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskBlock;
