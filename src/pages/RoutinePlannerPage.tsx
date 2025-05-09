
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRoutineStore } from '@/stores/routineStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  LayoutTemplate,
} from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, isToday } from 'date-fns';
import WeekScheduleView from '@/components/routine/WeekScheduleView';
import TemplateForm from '@/components/routine/TemplateForm';
import TaskForm from '@/components/routine/TaskForm';
import ReflectionForm from '@/components/routine/ReflectionForm';
import { RoutineTask } from '@/types/routine';

const RoutinePlannerPage: React.FC = () => {
  const {
    templates,
    activeTemplate,
    tasks,
    weekView,
    isLoading,
    error,
    fetchTemplates,
    fetchTasksForTemplate,
    fetchActiveTemplate,
    fetchWeekSchedule,
    createTemplate,
    createTask,
    updateTask,
    deleteTask,
    saveReflection,
  } = useRoutineStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  
  const [selectedTab, setSelectedTab] = useState('schedule');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isReflectionDialogOpen, setIsReflectionDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<RoutineTask | null>(null);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(null);

  useEffect(() => {
    fetchTemplates();
    fetchActiveTemplate();
  }, [fetchTemplates, fetchActiveTemplate]);

  useEffect(() => {
    if (activeTemplate) {
      fetchTasksForTemplate(activeTemplate.id);
      fetchWeekSchedule(currentWeekStart);
    } else {
      fetchWeekSchedule(currentWeekStart);
    }
  }, [activeTemplate, currentWeekStart, fetchTasksForTemplate, fetchWeekSchedule]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleCreateTemplate = (values: any) => {
    createTemplate(values);
    setIsTemplateDialogOpen(false);
  };

  const handleCreateTask = (values: any) => {
    createTask(values);
    setIsTaskDialogOpen(false);
    setSelectedDayOfWeek(null);
  };

  const handleTaskClick = (task: RoutineTask) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleAddTask = (dayOfWeek: number) => {
    setSelectedDayOfWeek(dayOfWeek);
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };
  
  const handleSaveReflection = (values: any) => {
    saveReflection(values);
    setIsReflectionDialogOpen(false);
  };

  const currentWeekFormatted = `${format(currentWeekStart, 'MMMM d')} - ${format(
    addWeeks(currentWeekStart, 1),
    'MMMM d, yyyy'
  )}`;
  
  const todayIsInView = weekView.some(day => day.isToday);

  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Routine Planner</h1>
            <p className="text-muted-foreground">
              Optimize your time and boost productivity
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
            
            <Button
              onClick={() => setIsReflectionDialogOpen(true)}
              variant="default"
              className="flex items-center"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Daily Reflection
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <CardTitle>
                  {activeTemplate ? activeTemplate.name : 'Weekly Schedule'}
                </CardTitle>
                <CardDescription>
                  {activeTemplate ? activeTemplate.description : 'No active routine template'}
                </CardDescription>
              </div>
              
              <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full md:w-auto mt-4 md:mt-0"
              >
                <TabsList>
                  <TabsTrigger value="schedule" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="flex items-center">
                    <LayoutTemplate className="w-4 h-4 mr-2" />
                    Templates
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent>
            <TabsContent value="schedule" className="mt-4">
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={handlePreviousWeek}
                  className="p-2 h-auto"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                  <span className="font-medium">{currentWeekFormatted}</span>
                  {!todayIsInView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeekStart(startOfWeek(new Date()))}
                    >
                      Today
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  onClick={handleNextWeek}
                  className="p-2 h-auto"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <WeekScheduleView
                weekSchedule={weekView}
                isLoading={isLoading}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            </TabsContent>
            
            <TabsContent value="templates" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      template.isActive ? 'ring-2 ring-brand-500' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between">
                        {template.name}
                        {template.isActive && (
                          <span className="text-xs bg-brand-100 text-brand-800 px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        {!template.isActive && (
                          <Button size="sm">Set Active</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card 
                  className="cursor-pointer border-dashed hover:bg-accent/50 transition-colors"
                  onClick={() => setIsTemplateDialogOpen(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center h-full py-12">
                    <Plus className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Create New Template</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>

      {/* Template Creation Dialog */}
      <Dialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Routine Template</DialogTitle>
          </DialogHeader>
          <TemplateForm
            onSubmit={handleCreateTemplate}
            onCancel={() => setIsTemplateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Task Creation/Edit Dialog */}
      <Dialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          {activeTemplate && (
            <TaskForm
              task={selectedTask || undefined}
              templateId={activeTemplate.id}
              onSubmit={handleCreateTask}
              onCancel={() => {
                setIsTaskDialogOpen(false);
                setSelectedTask(null);
                setSelectedDayOfWeek(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Daily Reflection Dialog */}
      <Dialog
        open={isReflectionDialogOpen}
        onOpenChange={setIsReflectionDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Daily Reflection</DialogTitle>
          </DialogHeader>
          <ReflectionForm
            onSubmit={handleSaveReflection}
            onCancel={() => setIsReflectionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default RoutinePlannerPage;
