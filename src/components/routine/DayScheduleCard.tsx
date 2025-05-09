
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DaySchedule, RoutineTask } from '@/types/routine';
import { formatMinutesToTime } from '@/utils/timeUtils';
import TaskBlock from './TaskBlock';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DayScheduleCardProps {
  daySchedule: DaySchedule;
  onTaskClick?: (task: RoutineTask) => void;
  onAddTask?: (dayOfWeek: number) => void;
}

const DayScheduleCard: React.FC<DayScheduleCardProps> = ({
  daySchedule,
  onTaskClick,
  onAddTask
}) => {
  const dayOfWeek = new Date(daySchedule.date).getDay();
  
  return (
    <Card className={`h-full ${daySchedule.isToday ? 'ring-2 ring-brand-500' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {daySchedule.dayName}
            <span className="text-sm text-muted-foreground ml-2">
              {new Date(daySchedule.date).toLocaleDateString()}
            </span>
          </CardTitle>
          {daySchedule.isToday && (
            <Badge variant="default" className="bg-brand-500">Today</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[calc(100vh-250px)]" type="always">
          <div className="space-y-2 p-2">
            {daySchedule.tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <p>No tasks scheduled</p>
                <button 
                  className="mt-2 text-sm text-brand-500 hover:underline"
                  onClick={() => onAddTask && onAddTask(dayOfWeek)}
                >
                  Add task
                </button>
              </div>
            ) : (
              daySchedule.tasks.map(task => (
                <TaskBlock 
                  key={task.id} 
                  task={task}
                  onClick={() => onTaskClick && onTaskClick(task)} 
                />
              ))
            )}
            
            {daySchedule.pendingTasks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Pending Tasks</h4>
                {daySchedule.pendingTasks.map(pendingTask => (
                  <div 
                    key={pendingTask.id}
                    className="border border-dashed border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg mb-2"
                  >
                    <div className="text-sm">{pendingTask.id}</div>
                    <div className="text-xs text-muted-foreground">
                      Priority: {pendingTask.priority}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-4 flex justify-end">
          <button 
            className="text-xs text-brand-500 hover:underline"
            onClick={() => onAddTask && onAddTask(dayOfWeek)}
          >
            + Add task
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayScheduleCard;
