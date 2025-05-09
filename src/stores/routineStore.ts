
import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import { 
  RoutineTemplate, 
  RoutineTask, 
  RoutineDailyInstance, 
  RoutineTaskCompletion, 
  RoutinePendingTask,
  RoutineReflection,
  DaySchedule
} from "@/types/routine";
import { toast } from "@/hooks/use-toast";
import { endOfWeek, format, addDays, parseISO, startOfDay, isToday } from 'date-fns';

interface RoutineState {
  templates: RoutineTemplate[];
  activeTemplate?: RoutineTemplate;
  tasks: RoutineTask[];
  dailyInstances: RoutineDailyInstance[];
  taskCompletions: RoutineTaskCompletion[];
  pendingTasks: RoutinePendingTask[];
  reflections: RoutineReflection[];
  weekView: DaySchedule[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTemplates: () => Promise<void>;
  fetchActiveTemplate: () => Promise<void>;
  fetchTasksForTemplate: (templateId: string) => Promise<void>;
  fetchWeekSchedule: (startDate?: Date) => Promise<void>;
  createTemplate: (template: Partial<RoutineTemplate>) => Promise<void>;
  createTask: (task: Partial<RoutineTask>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<RoutineTask>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string, completion: Partial<RoutineTaskCompletion>) => Promise<void>;
  addPendingTask: (task: Partial<RoutinePendingTask>) => Promise<void>;
  resolveTask: (taskId: string) => Promise<void>;
  saveReflection: (reflection: Partial<RoutineReflection>) => Promise<void>;
}

export const useRoutineStore = create<RoutineState>((set, get) => ({
  templates: [],
  tasks: [],
  dailyInstances: [],
  taskCompletions: [],
  pendingTasks: [],
  reflections: [],
  weekView: [],
  isLoading: false,
  error: null,
  
  fetchTemplates: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('routine_templates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      set({
        templates: data.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          isActive: t.is_active || false,
          createdAt: t.created_at,
          updatedAt: t.updated_at
        })),
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
      set({ error: 'Failed to fetch templates', isLoading: false });
    }
  },
  
  fetchActiveTemplate: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('routine_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        // No active template, not an error
        if (error.code === 'PGRST116') {
          set({ activeTemplate: undefined, isLoading: false });
          return;
        }
        throw error;
      }
      
      const template: RoutineTemplate = {
        id: data.id,
        name: data.name,
        description: data.description,
        isActive: data.is_active || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set({
        activeTemplate: template,
        isLoading: false
      });
      
      // Fetch tasks for this template
      await get().fetchTasksForTemplate(template.id);
      
    } catch (error) {
      console.error('Error fetching active template:', error);
      set({ error: 'Failed to fetch active template', isLoading: false });
    }
  },
  
  fetchTasksForTemplate: async (templateId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('routine_tasks')
        .select('*')
        .eq('template_id', templateId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      
      set({
        tasks: data.map(t => ({
          id: t.id,
          templateId: t.template_id,
          name: t.name,
          description: t.description,
          dayOfWeek: t.day_of_week,
          startTime: t.start_time,
          duration: t.duration,
          taskType: t.task_type,
          taskOrder: t.task_order,
          isRecurring: t.is_recurring || false,
          color: t.color,
          icon: t.icon,
          createdAt: t.created_at,
          updatedAt: t.updated_at
        })),
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },
  
  fetchWeekSchedule: async (startDate = new Date()) => {
    try {
      set({ isLoading: true, error: null });
      
      // Create week view array (7 days starting from startDate)
      const weekDates: DaySchedule[] = [];
      const now = startOfDay(new Date());
      
      // Get active template first if not already loaded
      if (!get().activeTemplate) {
        await get().fetchActiveTemplate();
      }
      
      const templateId = get().activeTemplate?.id;
      
      // If no template, just return empty week structure
      if (!templateId) {
        const emptyWeek = Array.from({ length: 7 }).map((_, idx) => {
          const date = addDays(startDate, idx);
          return {
            date: format(date, 'yyyy-MM-dd'),
            dayName: format(date, 'EEEE'),
            tasks: [],
            pendingTasks: [],
            isToday: isToday(date)
          };
        });
        
        set({ weekView: emptyWeek, isLoading: false });
        return;
      }
      
      // 1. Get tasks for the template
      const { data: taskData, error: taskError } = await supabase
        .from('routine_tasks')
        .select('*')
        .eq('template_id', templateId)
        .order('start_time', { ascending: true });
        
      if (taskError) throw taskError;

      // Map tasks to correct type
      const allTasks: RoutineTask[] = taskData.map(t => ({
        id: t.id,
        templateId: t.template_id,
        name: t.name,
        description: t.description,
        dayOfWeek: t.day_of_week,
        startTime: t.start_time,
        duration: t.duration,
        taskType: t.task_type,
        taskOrder: t.task_order,
        isRecurring: t.is_recurring || false,
        color: t.color,
        icon: t.icon,
        createdAt: t.created_at,
        updatedAt: t.updated_at
      }));
      
      // 2. Get date range for the week
      const endDate = endOfWeek(startDate, { weekStartsOn: 0 });
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      
      // 3. Get task completions for this week
      const { data: completionData, error: completionError } = await supabase
        .from('routine_task_completions')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr);
        
      if (completionError) throw completionError;

      // Map completions to correct type
      const completions: RoutineTaskCompletion[] = completionData.map(c => ({
        id: c.id,
        taskId: c.task_id || undefined,
        dailyInstanceId: c.daily_instance_id || undefined,
        date: c.date,
        actualStartTime: c.actual_start_time,
        actualEndTime: c.actual_end_time,
        isCompleted: c.is_completed || false,
        isSkipped: c.is_skipped || false,
        skipReason: c.skip_reason,
        mood: c.mood,
        energyLevel: c.energy_level,
        notes: c.notes,
        createdAt: c.created_at,
        updatedAt: c.updated_at
      }));
      
      // 4. Get pending tasks
      const { data: pendingData, error: pendingError } = await supabase
        .from('routine_pending_tasks')
        .select('*')
        .eq('is_resolved', false)
        .order('priority', { ascending: false });
        
      if (pendingError) throw pendingError;

      // Map pending tasks to correct type
      const pendingTasks: RoutinePendingTask[] = pendingData.map(p => ({
        id: p.id,
        taskId: p.task_id || undefined,
        originalDate: p.original_date,
        rescheduleDate: p.reschedule_date,
        priority: p.priority || 1,
        isResolved: p.is_resolved || false,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));
      
      // Build week view
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(startDate, i);
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Filter tasks for this day of week
        const dayTasks = allTasks.filter(task => task.dayOfWeek === dayOfWeek);
        
        // Add completion data to each task
        const tasksWithCompletions = dayTasks.map(task => {
          const completion = completions.find(c => 
            c.taskId === task.id && 
            c.date === dateStr
          );
          
          return {
            ...task,
            completion
          };
        });
        
        // Filter pending tasks for this day
        const dayPendingTasks = pendingTasks.filter(task => 
          task.rescheduleDate === dateStr || 
          (task.originalDate === dateStr && !task.rescheduleDate)
        );
        
        weekDates.push({
          date: dateStr,
          dayName: format(currentDate, 'EEEE'),
          tasks: tasksWithCompletions,
          pendingTasks: dayPendingTasks,
          isToday: isToday(currentDate)
        });
      }
      
      set({ 
        weekView: weekDates, 
        taskCompletions: completions,
        pendingTasks: pendingTasks,
        isLoading: false 
      });
      
    } catch (error) {
      console.error('Error fetching week schedule:', error);
      set({ error: 'Failed to load week schedule', isLoading: false });
    }
  },
  
  createTemplate: async (template: Partial<RoutineTemplate>) => {
    try {
      set({ isLoading: true, error: null });
      
      // If setting this template as active, deactivate others first
      if (template.isActive) {
        await supabase
          .from('routine_templates')
          .update({ is_active: false })
          .neq('id', 'placeholder');
      }
      
      const { data, error } = await supabase
        .from('routine_templates')
        .insert({
          name: template.name || 'My Routine',
          description: template.description,
          is_active: template.isActive
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newTemplate: RoutineTemplate = {
        id: data.id,
        name: data.name,
        description: data.description,
        isActive: data.is_active || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set(state => ({ 
        templates: [newTemplate, ...state.templates],
        activeTemplate: template.isActive ? newTemplate : state.activeTemplate,
        isLoading: false 
      }));
      
      toast({
        title: "Routine template created",
        description: `${newTemplate.name} has been created successfully.`,
      });
      
    } catch (error) {
      console.error('Error creating template:', error);
      set({ error: 'Failed to create template', isLoading: false });
      toast({
        title: "Error creating template",
        description: "There was a problem creating your routine template.",
        variant: "destructive"
      });
    }
  },
  
  createTask: async (task: Partial<RoutineTask>) => {
    try {
      if (!task.templateId) {
        throw new Error("Template ID is required");
      }
      
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('routine_tasks')
        .insert({
          template_id: task.templateId,
          name: task.name || 'New Task',
          description: task.description,
          day_of_week: task.dayOfWeek || 0,
          start_time: task.startTime || 0,
          duration: task.duration || 30,
          task_type: task.taskType || 'regular',
          task_order: task.taskOrder || 0,
          is_recurring: task.isRecurring || false,
          color: task.color,
          icon: task.icon
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newTask: RoutineTask = {
        id: data.id,
        templateId: data.template_id,
        name: data.name,
        description: data.description,
        dayOfWeek: data.day_of_week,
        startTime: data.start_time,
        duration: data.duration,
        taskType: data.task_type,
        taskOrder: data.task_order,
        isRecurring: data.is_recurring || false,
        color: data.color,
        icon: data.icon,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set(state => ({ 
        tasks: [...state.tasks, newTask],
        isLoading: false 
      }));
      
      // Refresh week schedule to include the new task
      await get().fetchWeekSchedule();
      
      toast({
        title: "Task created",
        description: `${newTask.name} has been added to your routine.`,
      });
      
    } catch (error) {
      console.error('Error creating task:', error);
      set({ error: 'Failed to create task', isLoading: false });
      toast({
        title: "Error creating task",
        description: "There was a problem creating your task.",
        variant: "destructive"
      });
    }
  },
  
  updateTask: async (taskId: string, updates: Partial<RoutineTask>) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('routine_tasks')
        .update({
          name: updates.name,
          description: updates.description,
          day_of_week: updates.dayOfWeek,
          start_time: updates.startTime,
          duration: updates.duration,
          task_type: updates.taskType,
          task_order: updates.taskOrder,
          is_recurring: updates.isRecurring,
          color: updates.color,
          icon: updates.icon
        })
        .eq('id', taskId);
        
      if (error) throw error;
      
      set(state => ({ 
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
        ),
        isLoading: false 
      }));
      
      // Refresh week schedule to reflect changes
      await get().fetchWeekSchedule();
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
      
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task', isLoading: false });
      toast({
        title: "Error updating task",
        description: "There was a problem updating your task.",
        variant: "destructive"
      });
    }
  },
  
  deleteTask: async (taskId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('routine_tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      set(state => ({ 
        tasks: state.tasks.filter(task => task.id !== taskId),
        isLoading: false 
      }));
      
      // Refresh week schedule to reflect changes
      await get().fetchWeekSchedule();
      
      toast({
        title: "Task deleted",
        description: "Your task has been removed from your routine.",
      });
      
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task', isLoading: false });
      toast({
        title: "Error deleting task",
        description: "There was a problem deleting your task.",
        variant: "destructive"
      });
    }
  },
  
  completeTask: async (taskId: string, completion: Partial<RoutineTaskCompletion>) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('routine_task_completions')
        .insert({
          task_id: taskId,
          date: completion.date || format(new Date(), 'yyyy-MM-dd'),
          actual_start_time: completion.actualStartTime,
          actual_end_time: completion.actualEndTime,
          is_completed: completion.isCompleted !== undefined ? completion.isCompleted : true,
          is_skipped: completion.isSkipped || false,
          skip_reason: completion.skipReason,
          mood: completion.mood,
          energy_level: completion.energyLevel,
          notes: completion.notes
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newCompletion: RoutineTaskCompletion = {
        id: data.id,
        taskId: data.task_id,
        dailyInstanceId: data.daily_instance_id,
        date: data.date,
        actualStartTime: data.actual_start_time,
        actualEndTime: data.actual_end_time,
        isCompleted: data.is_completed || false,
        isSkipped: data.is_skipped || false,
        skipReason: data.skip_reason,
        mood: data.mood,
        energyLevel: data.energy_level,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set(state => ({ 
        taskCompletions: [...state.taskCompletions, newCompletion],
        isLoading: false 
      }));
      
      // Refresh week schedule to reflect completion
      await get().fetchWeekSchedule();
      
      toast({
        title: completion.isCompleted ? "Task completed" : "Task updated",
        description: completion.isCompleted 
          ? "Great job! Your task has been marked as completed." 
          : "Your task status has been updated.",
      });
      
    } catch (error) {
      console.error('Error completing task:', error);
      set({ error: 'Failed to update task status', isLoading: false });
      toast({
        title: "Error updating task",
        description: "There was a problem updating your task status.",
        variant: "destructive"
      });
    }
  },
  
  addPendingTask: async (task: Partial<RoutinePendingTask>) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('routine_pending_tasks')
        .insert({
          task_id: task.taskId,
          original_date: task.originalDate || format(new Date(), 'yyyy-MM-dd'),
          reschedule_date: task.rescheduleDate,
          priority: task.priority || 1,
          is_resolved: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newPendingTask: RoutinePendingTask = {
        id: data.id,
        taskId: data.task_id,
        originalDate: data.original_date,
        rescheduleDate: data.reschedule_date,
        priority: data.priority || 1,
        isResolved: data.is_resolved || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set(state => ({ 
        pendingTasks: [...state.pendingTasks, newPendingTask],
        isLoading: false 
      }));
      
      // Refresh week schedule to reflect changes
      await get().fetchWeekSchedule();
      
      toast({
        title: "Task moved to pending",
        description: "Your task has been added to your pending tasks list.",
      });
      
    } catch (error) {
      console.error('Error adding pending task:', error);
      set({ error: 'Failed to add pending task', isLoading: false });
      toast({
        title: "Error moving task",
        description: "There was a problem moving your task to pending.",
        variant: "destructive"
      });
    }
  },
  
  resolveTask: async (taskId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('routine_pending_tasks')
        .update({
          is_resolved: true
        })
        .eq('id', taskId);
        
      if (error) throw error;
      
      set(state => ({ 
        pendingTasks: state.pendingTasks.filter(task => task.id !== taskId),
        isLoading: false 
      }));
      
      // Refresh week schedule to reflect resolution
      await get().fetchWeekSchedule();
      
      toast({
        title: "Task resolved",
        description: "Your pending task has been resolved.",
      });
      
    } catch (error) {
      console.error('Error resolving task:', error);
      set({ error: 'Failed to resolve task', isLoading: false });
      toast({
        title: "Error resolving task",
        description: "There was a problem resolving your pending task.",
        variant: "destructive"
      });
    }
  },
  
  saveReflection: async (reflection: Partial<RoutineReflection>) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('routine_reflections')
        .upsert({
          date: reflection.date || format(new Date(), 'yyyy-MM-dd'),
          daily_instance_id: reflection.dailyInstanceId,
          productivity_rating: reflection.productivityRating,
          mood_rating: reflection.moodRating,
          energy_rating: reflection.energyRating,
          blockers: reflection.blockers,
          achievements: reflection.achievements,
        }, {
          onConflict: 'user_id, date'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const savedReflection: RoutineReflection = {
        id: data.id,
        date: data.date,
        dailyInstanceId: data.daily_instance_id,
        productivityRating: data.productivity_rating,
        blockers: data.blockers,
        moodRating: data.mood_rating,
        energyRating: data.energy_rating,
        achievements: data.achievements,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set(state => ({ 
        reflections: [...state.reflections.filter(r => r.date !== savedReflection.date), savedReflection],
        isLoading: false 
      }));
      
      toast({
        title: "Reflection saved",
        description: "Your daily reflection has been saved.",
      });
      
    } catch (error) {
      console.error('Error saving reflection:', error);
      set({ error: 'Failed to save reflection', isLoading: false });
      toast({
        title: "Error saving reflection",
        description: "There was a problem saving your reflection.",
        variant: "destructive"
      });
    }
  }
}));
