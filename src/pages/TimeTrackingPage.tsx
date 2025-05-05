import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProjectStore } from '@/stores/projectStore';
import { ProjectOrStudy, TimeTracking } from '@/types/project';
import { Play, Pause, Clock, Calendar, TimerOff, Timer, Check } from 'lucide-react';
import { format, differenceInMinutes, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { GateStudyPlan } from '@/types/gate';
import { Checkbox } from '@/components/ui/checkbox';
import { DraggableTimeTracker } from '@/components/time-tracking/DraggableTimeTracker';

// Update the time tracking page component to fix status type issues
const TimeTrackingPage: React.FC = () => {
  const { projects, studies, updateStudy } = useProjectStore();
  const allItems: ProjectOrStudy[] = [...projects, ...studies];
  const { toast } = useToast();
  
  const [timeEntries, setTimeEntries] = useState<TimeTracking[]>([]);
  const [activeTracking, setActiveTracking] = useState<TimeTracking | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [projectItems, setProjectItems] = useState<Array<{ id: string; name: string; completed?: boolean }>>([]);

  // Load time entries from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem('time-entries');
    if (storedEntries) {
      setTimeEntries(JSON.parse(storedEntries));
    }
    
    const activeTrackingData = localStorage.getItem('active-tracking');
    if (activeTrackingData) {
      setActiveTracking(JSON.parse(activeTrackingData));
    }
  }, []);

  // Save time entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('time-entries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  // Save active tracking to localStorage when it changes
  useEffect(() => {
    if (activeTracking) {
      localStorage.setItem('active-tracking', JSON.stringify(activeTracking));
    } else {
      localStorage.removeItem('active-tracking');
    }
  }, [activeTracking]);

  // Update project items when selected project changes
  useEffect(() => {
    if (!selectedProject) {
      setProjectItems([]);
      setSelectedItem('');
      return;
    }

    const project = allItems.find(p => p.id === selectedProject);
    if (!project) return;

    if ('phases' in project) {
      // Project type
      let items: Array<{ id: string; name: string; completed?: boolean }> = [];
      project.phases.forEach(phase => {
        phase.steps.forEach(step => {
          step.tasks.forEach(task => {
            items.push({ 
              id: task.id, 
              name: `${phase.name} > ${step.name} > ${task.name}`,
              completed: task.status === 'completed'
            });
          });
        });
      });
      setProjectItems(items);
    } else if ('subjects' in project) {
      // Study plan type
      let items: Array<{ id: string; name: string; completed?: boolean }> = [];
      project.subjects.forEach(subject => {
        if ('chapters' in subject) {
          subject.chapters.forEach(chapter => {
            if ('topics' in chapter) {
              // Regular study plan
              chapter.topics.forEach(topic => {
                items.push({ 
                  id: topic.id, 
                  name: `${subject.name} > ${chapter.name} > ${topic.name}`,
                  completed: topic.status === 'completed'
                });
              });
            } else if ('lectures' in chapter) {
              // GATE study plan
              chapter.lectures.forEach(lecture => {
                items.push({ 
                  id: lecture.id, 
                  name: `${subject.name} > ${chapter.name} > ${lecture.name}`,
                  completed: lecture.completed
                });
              });
            }
          });
        }
      });
      setProjectItems(items);
    }
  }, [selectedProject, allItems]);

  const startTracking = () => {
    if (!selectedProject || !selectedItem) {
      toast({
        title: "Missing information",
        description: "Please select both a project and an item to track.",
        variant: "destructive"
      });
      return;
    }

    if (activeTracking) {
      toast({
        title: "Already tracking",
        description: "Please stop the current tracking first.",
        variant: "destructive"
      });
      return;
    }

    const projectName = allItems.find(p => p.id === selectedProject)?.name || 'Unknown Project';
    const itemName = projectItems.find(item => item.id === selectedItem)?.name || 'Unknown Item';

    const newTracking: TimeTracking = {
      id: uuidv4(),
      projectId: selectedProject,
      itemId: selectedItem,
      startTime: new Date().toISOString(),
      durationMinutes: 0,
      notes: notes
    };

    setActiveTracking(newTracking);
    toast({
      title: "Tracking started",
      description: `Now tracking time for ${itemName}`,
    });
  };

  const stopTracking = () => {
    if (!activeTracking) return;

    const endTime = new Date().toISOString();
    const durationMinutes = differenceInMinutes(
      new Date(),
      parseISO(activeTracking.startTime)
    );

    const completedTracking: TimeTracking = {
      ...activeTracking,
      endTime,
      durationMinutes
    };

    setTimeEntries(prev => [completedTracking, ...prev]);
    setActiveTracking(null);
    
    // Update timeSpent for the selected item if it's a GATE lecture
    updateTimeSpentForItem(activeTracking.projectId, activeTracking.itemId, durationMinutes);
    
    toast({
      title: "Tracking stopped",
      description: `Tracked for ${durationMinutes} minutes`,
    });
  };

  // Helper function to format duration in Day:HH:MM:SS format
  const formatDurationToDHMS = (minutes: number): string => {
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = Math.floor(minutes % 60);
    const secs = 0; // We don't track seconds in our timeEntries

    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Function to update timeSpent property in GATE lectures
  const updateTimeSpentForItem = (projectId: string, itemId: string, durationMinutes: number) => {
    const project = allItems.find(p => p.id === projectId);
    if (!project || !('subjects' in project) || project.type !== 'study') return;

    const gateStudyPlan = project as GateStudyPlan;
    let lectureFound = false;

    const updatedSubjects = gateStudyPlan.subjects.map(subject => {
      const updatedChapters = subject.chapters.map(chapter => {
        const updatedLectures = chapter.lectures.map(lecture => {
          if (lecture.id === itemId) {
            lectureFound = true;
            // Parse existing timeSpent
            if (!lecture.timeSpent) {
              return {
                ...lecture,
                timeSpent: formatDurationToDHMS(durationMinutes),
                updatedAt: new Date().toISOString()
              };
            }
            
            const [days, hours, mins, secs] = lecture.timeSpent.split(':').map(Number);
            const existingMinutes = (days * 24 * 60) + (hours * 60) + mins;
            const totalMinutes = existingMinutes + durationMinutes;
            
            return {
              ...lecture,
              timeSpent: formatDurationToDHMS(totalMinutes),
              updatedAt: new Date().toISOString()
            };
          }
          return lecture;
        });

        if (lectureFound) {
          return {
            ...chapter,
            lectures: updatedLectures,
            updatedAt: new Date().toISOString()
          };
        }
        return chapter;
      });

      if (lectureFound) {
        return {
          ...subject,
          chapters: updatedChapters,
          updatedAt: new Date().toISOString()
        };
      }
      return subject;
    });

    if (lectureFound) {
      updateStudy(projectId, {
        ...gateStudyPlan,
        subjects: updatedSubjects,
        updatedAt: new Date().toISOString()
      });
    }
  };

  // Function to mark item as completed
  const toggleItemCompletion = (projectId: string, itemId: string, isCompleted: boolean) => {
    const project = allItems.find(p => p.id === projectId);
    if (!project) return;

    if ('phases' in project) {
      // Project type - implementation for projects would go here
      // This is more complex and would require updating task status
      toast({
        title: "Not fully implemented",
        description: "Marking project tasks as completed from the time tracking page is not yet fully implemented.",
      });
    } else if ('subjects' in project && project.type === 'study') {
      // GATE study plan
      const gateStudyPlan = project as GateStudyPlan;
      let lectureFound = false;

      const updatedSubjects = gateStudyPlan.subjects.map(subject => {
        const updatedChapters = subject.chapters.map(chapter => {
          if ('lectures' in chapter) {
            const updatedLectures = chapter.lectures.map(lecture => {
              if (lecture.id === itemId) {
                lectureFound = true;
                return {
                  ...lecture,
                  completed: isCompleted,
                  updatedAt: new Date().toISOString()
                };
              }
              return lecture;
            });

            // Recalculate chapter progress
            const completedCount = updatedLectures.filter(l => l.completed).length;
            const progress = updatedLectures.length > 0 ? 
              (completedCount / updatedLectures.length) * 100 : 0;
            
            const status = progress === 0 ? "not-started" as const : 
                          progress === 100 ? "completed" as const : "in-progress" as const;

            return {
              ...chapter,
              lectures: updatedLectures,
              progress,
              status,
              updatedAt: new Date().toISOString()
            };
          }
          return chapter;
        });

        // Recalculate subject progress
        const chapterProgress = updatedChapters.reduce((sum, chapter) => sum + chapter.progress, 0);
        const subjectProgress = updatedChapters.length > 0 ? 
          chapterProgress / updatedChapters.length : 0;
        
        const subjectStatus = subjectProgress === 0 ? "not-started" as const : 
                            subjectProgress === 100 ? "completed" as const : "in-progress" as const;

        return {
          ...subject,
          chapters: updatedChapters,
          progress: subjectProgress,
          status: subjectStatus,
          updatedAt: new Date().toISOString()
        };
      });

      if (lectureFound) {
        // Recalculate overall progress
        const overallProgress = updatedSubjects.reduce((sum, subject) => sum + subject.progress, 0) / 
                               (updatedSubjects.length || 1);
        
        const overallStatus = overallProgress === 0 ? "not-started" as const : 
                             overallProgress === 100 ? "completed" as const : "in-progress" as const;

        updateStudy(projectId, {
          ...gateStudyPlan,
          subjects: updatedSubjects,
          progress: overallProgress,
          status: overallStatus,
          updatedAt: new Date().toISOString()
        });
        
        // Also update the local projectItems state
        setProjectItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, completed: isCompleted } : item
          )
        );

        toast({
          title: isCompleted ? "Marked as completed" : "Marked as incomplete",
          description: `Item has been updated successfully`,
        });
      }
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTotalTimeForProject = (projectId: string): number => {
    return timeEntries
      .filter(entry => entry.projectId === projectId)
      .reduce((total, entry) => total + entry.durationMinutes, 0);
  };

  const getTotalTimeForItem = (itemId: string): number => {
    return timeEntries
      .filter(entry => entry.itemId === itemId)
      .reduce((total, entry) => total + entry.durationMinutes, 0);
  };

  const getProjectNameById = (id: string): string => {
    return allItems.find(project => project.id === id)?.name || 'Unknown Project';
  };

  const getItemNameById = (projectId: string, itemId: string): string => {
    const project = allItems.find(p => p.id === projectId);
    if (!project) return 'Unknown Item';

    // Implement a function to find the item name based on project type
    if ('phases' in project) {
      // Project type
      for (const phase of project.phases) {
        for (const step of phase.steps) {
          for (const task of step.tasks) {
            if (task.id === itemId) {
              return `${phase.name} > ${step.name} > ${task.name}`;
            }
          }
        }
      }
    } else if ('subjects' in project) {
      // Study plan type
      for (const subject of project.subjects) {
        if ('chapters' in subject) {
          for (const chapter of subject.chapters) {
            if ('topics' in chapter) {
              // Regular study plan
              for (const topic of chapter.topics) {
                if (topic.id === itemId) {
                  return `${subject.name} > ${chapter.name} > ${topic.name}`;
                }
              }
            } else if ('lectures' in chapter) {
              // GATE study plan
              for (const lecture of chapter.lectures) {
                if (lecture.id === itemId) {
                  return `${subject.name} > ${chapter.name} > ${lecture.name}`;
                }
              }
            }
          }
        }
      }
    }
    
    return 'Unknown Item';
  };

  // Add the function to check if item is completed
  const isItemCompleted = (projectId: string, itemId: string): boolean => {
    const project = allItems.find(p => p.id === projectId);
    if (!project) return false;

    if ('phases' in project) {
      // Project type
      for (const phase of project.phases) {
        for (const step of phase.steps) {
          for (const task of step.tasks) {
            if (task.id === itemId) {
              return task.status === 'completed';
            }
          }
        }
      }
    } else if ('subjects' in project) {
      // Study plan type
      for (const subject of project.subjects) {
        if ('chapters' in subject) {
          for (const chapter of subject.chapters) {
            if ('topics' in chapter) {
              // Regular study plan
              for (const topic of chapter.topics) {
                if (topic.id === itemId) {
                  return topic.status === 'completed';
                }
              }
            } else if ('lectures' in chapter) {
              // GATE study plan
              for (const lecture of chapter.lectures) {
                if (lecture.id === itemId) {
                  return lecture.completed;
                }
              }
            }
          }
        }
      }
    }
    
    return false;
  };

  
  return (
    <AppLayout>
      {activeTracking && (
        <DraggableTimeTracker 
          isTracking={true}
          projectName={getProjectNameById(activeTracking.projectId)}
          itemName={getItemNameById(activeTracking.projectId, activeTracking.itemId)}
          startTime={activeTracking.startTime}
          onStopTracking={stopTracking}
        />
      )}
      
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
            <p className="text-muted-foreground">Track time spent on your projects and studies</p>
          </div>
        </div>

        {/* Time Tracking Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {activeTracking ? 'Currently Tracking' : 'Start Tracking'}
            </CardTitle>
            <CardDescription>
              {activeTracking ? 'Time is being tracked' : 'Select a project and item to start tracking your time'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTracking ? (
                <div className="space-y-4 col-span-full">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Project</span>
                    <span>{getProjectNameById(activeTracking.projectId)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Item</span>
                    <span>{getItemNameById(activeTracking.projectId, activeTracking.itemId)}</span>
                  </div>
                  {activeTracking.notes && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium mb-1">Notes</span>
                      <span>{activeTracking.notes}</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Started</span>
                    <span>{format(parseISO(activeTracking.startTime), 'PPp')}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="project">Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {allItems.length === 0 && (
                          <SelectItem value="empty" disabled>
                            No projects available
                          </SelectItem>
                        )}
                        {allItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="item">Item</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem} disabled={!selectedProject}>
                      <SelectTrigger id="item">
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {projectItems.length === 0 && (
                          <SelectItem value="empty" disabled>
                            {selectedProject ? 'No items available' : 'Select a project first'}
                          </SelectItem>
                        )}
                        {projectItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5 col-span-1 md:col-span-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes about this time entry"
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {activeTracking ? (
              <Button onClick={stopTracking} variant="destructive">
                <Pause className="mr-2 h-4 w-4" />
                Stop Tracking
              </Button>
            ) : (
              <Button onClick={startTracking}>
                <Play className="mr-2 h-4 w-4" />
                Start Tracking
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Recent Time Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Time Entries
            </CardTitle>
            <CardDescription>
              View and manage your recent time tracking entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timeEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <TimerOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No time entries yet</h3>
                <p className="text-muted-foreground mt-2">
                  Start tracking time on your projects and they will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeEntries.map((entry) => {
                      const isCompleted = isItemCompleted(entry.projectId, entry.itemId);
                      
                      return (
                        <TableRow key={entry.id}>
                          <TableCell>{getProjectNameById(entry.projectId)}</TableCell>
                          <TableCell>{getItemNameById(entry.projectId, entry.itemId)}</TableCell>
                          <TableCell>{format(parseISO(entry.startTime), 'PP')}</TableCell>
                          <TableCell>{formatDuration(entry.durationMinutes)}</TableCell>
                          <TableCell>{entry.notes || '-'}</TableCell>
                          <TableCell>
                            <Checkbox 
                              checked={isCompleted}
                              onCheckedChange={(checked) => {
                                toggleItemCompletion(entry.projectId, entry.itemId, checked === true);
                              }}
                              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {timeEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Time Summary
              </CardTitle>
              <CardDescription>
                Overview of time spent on your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Projects</h3>
                  <div className="space-y-4">
                    {Array.from(new Set(timeEntries.map(entry => entry.projectId))).map(projectId => {
                      const totalTime = getTotalTimeForProject(projectId);
                      return (
                        <div key={projectId} className="flex justify-between items-center">
                          <span>{getProjectNameById(projectId)}</span>
                          <span className="font-medium">{formatDuration(totalTime)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Items</h3>
                  <div className="space-y-4">
                    {Array.from(new Set(timeEntries.map(entry => entry.itemId)))
                      .sort((a, b) => {
                        return getTotalTimeForItem(b) - getTotalTimeForItem(a);
                      })
                      .slice(0, 5)
                      .map(itemId => {
                        const entry = timeEntries.find(e => e.itemId === itemId)!;
                        const totalTime = getTotalTimeForItem(itemId);
                        return (
                          <div key={itemId} className="flex justify-between items-center">
                            <span className="truncate pr-4">{getItemNameById(entry.projectId, itemId)}</span>
                            <span className="font-medium">{formatDuration(totalTime)}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default TimeTrackingPage;
