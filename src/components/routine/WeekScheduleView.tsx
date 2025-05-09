
import React from 'react';
import { DaySchedule, RoutineTask } from '@/types/routine';
import { Card } from '@/components/ui/card';
import DayScheduleCard from './DayScheduleCard';
import { startOfWeek, addDays, format } from 'date-fns';

interface WeekScheduleViewProps {
  weekSchedule: DaySchedule[];
  isLoading: boolean;
  onTaskClick?: (task: RoutineTask) => void;
  onAddTask?: (dayOfWeek: number) => void;
}

const WeekScheduleView: React.FC<WeekScheduleViewProps> = ({
  weekSchedule,
  isLoading,
  onTaskClick,
  onAddTask
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 h-full">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="h-[400px] animate-pulse bg-muted"></Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekSchedule.map((daySchedule) => (
        <DayScheduleCard
          key={daySchedule.date}
          daySchedule={daySchedule}
          onTaskClick={onTaskClick}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
};

export default WeekScheduleView;
