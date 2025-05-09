
import { Database } from "@/integrations/supabase/types";

export type RoutineTaskType = Database["public"]["Enums"]["routine_task_type"];

export interface RoutineTemplate {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineTask {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  dayOfWeek: number; // 0-6, Sunday to Saturday
  startTime: number; // Minutes from midnight (0-1439)
  duration: number; // In minutes
  taskType: RoutineTaskType;
  taskOrder: number;
  isRecurring: boolean;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineDailyInstance {
  id: string;
  date: string;
  templateId?: string;
  isOverride: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineTaskCompletion {
  id: string;
  taskId?: string;
  dailyInstanceId?: string;
  date: string;
  actualStartTime?: string;
  actualEndTime?: string;
  isCompleted: boolean;
  isSkipped: boolean;
  skipReason?: string;
  mood?: number;
  energyLevel?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutinePendingTask {
  id: string;
  taskId?: string;
  originalDate: string;
  rescheduleDate?: string;
  priority: number;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineReflection {
  id: string;
  date: string;
  dailyInstanceId?: string;
  productivityRating?: number;
  blockers?: string;
  moodRating?: number;
  energyRating?: number;
  achievements?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DaySchedule {
  date: string;
  dayName: string;
  tasks: (RoutineTask & { completion?: RoutineTaskCompletion })[];
  pendingTasks: RoutinePendingTask[];
  isToday: boolean;
}
