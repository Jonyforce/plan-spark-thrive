
import { ProjectOrStudy } from "@/types/project";

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateJsonSchema(data: any): ValidationResult {
  // Check if it's a base object with required fields
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'JSON must be an object' };
  }

  // Check required base fields
  const requiredBaseFields = ['id', 'name', 'status', 'progress', 'createdAt', 'updatedAt'];
  for (const field of requiredBaseFields) {
    if (!(field in data)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  // Check progress is between 0-100
  if (typeof data.progress !== 'number' || data.progress < 0 || data.progress > 100) {
    return { valid: false, error: 'Progress must be a number between 0 and 100' };
  }

  // Check status has valid value
  if (!['not-started', 'in-progress', 'completed'].includes(data.status)) {
    return { valid: false, error: 'Status must be one of: not-started, in-progress, completed' };
  }

  // Check if it's a project or study type
  if (!data.type || !['project', 'study'].includes(data.type)) {
    return { valid: false, error: 'Type must be either "project" or "study"' };
  }

  // Additional validation based on type
  if (data.type === 'project') {
    if (!Array.isArray(data.phases)) {
      return { valid: false, error: 'Project must have a phases array' };
    }
    
    // We could go deeper and validate each phase, step, task, but for brevity we'll stop here
  } else if (data.type === 'study') {
    if (!Array.isArray(data.subjects)) {
      return { valid: false, error: 'Study plan must have a subjects array' };
    }
    
    // Similarly, we could validate deeper here
  }

  // If we made it here, the JSON is valid for our basic requirements
  return { valid: true };
}

// Helper function to calculate progress based on child items
export function calculateProgress(items: { progress: number }[]): number {
  if (!items.length) return 0;
  
  const totalProgress = items.reduce((sum, item) => sum + item.progress, 0);
  return Math.round(totalProgress / items.length);
}

// Function to update progress automatically
export function updateProgressRecursively(project: ProjectOrStudy): ProjectOrStudy {
  if (project.type === 'project') {
    // Update phases
    if (project.phases) {
      project.phases = project.phases.map(phase => {
        // Update steps in phase
        if (phase.steps) {
          phase.steps = phase.steps.map(step => {
            // Update tasks in step
            if (step.tasks) {
              step.tasks = step.tasks.map(task => {
                // Calculate task progress based on subtasks
                if (task.subtasks && task.subtasks.length > 0) {
                  const completedSubtasks = task.subtasks.filter(
                    subtask => subtask.status === 'completed'
                  ).length;
                  task.progress = (completedSubtasks / task.subtasks.length) * 100;
                }
                return task;
              });
              
              // Calculate step progress based on tasks
              step.progress = calculateProgress(step.tasks);
            }
            return step;
          });
          
          // Calculate phase progress based on steps
          phase.progress = calculateProgress(phase.steps);
        }
        return phase;
      });
      
      // Calculate project progress based on phases
      project.progress = calculateProgress(project.phases);
    }
  } else if (project.type === 'study') {
    // Similar logic for study plan progress calculation
    // Would follow the subjects > chapters > topics hierarchy
  }
  
  return project;
}
