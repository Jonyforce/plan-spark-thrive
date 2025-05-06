
import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectOrStudy, StudyPlan, Task } from "@/types/project";
import { GateStudyPlan } from "@/types/gate";
import { toast } from "@/hooks/use-toast";

// Function to sync a project to the database
export const syncProject = async (project: Project | StudyPlan | GateStudyPlan): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("User not authenticated. Unable to sync project.");
      return false;
    }

    // First record the activity
    const { error: activityError } = await supabase
      .from('user_activity')
      .insert({
        user_id: session.user.id,
        project_id: project.id,
        activity_type: getActivityType(project),
        item_id: project.id,
        item_name: project.name,
        status: project.status,
        progress: project.progress,
        time_spent: 0, // This will be updated with time tracking data
        metadata: {
          description: project.description,
          tags: project.tags
        }
      });

    if (activityError) {
      console.error("Error recording activity:", activityError);
      toast({
        title: "Sync Error",
        description: "Failed to sync project data",
        variant: "destructive",
      });
      return false;
    }

    // Update successful
    toast({
      title: "Sync Complete",
      description: "Project data has been saved to the cloud",
    });
    return true;
  } catch (error) {
    console.error("Error syncing project:", error);
    toast({
      title: "Sync Error",
      description: "An unexpected error occurred while syncing",
      variant: "destructive",
    });
    return false;
  }
};

// Function to sync user activity for tasks
export const syncTaskActivity = async (
  projectId: string,
  task: Task,
  parentName: string
): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("User not authenticated. Unable to sync task.");
      return false;
    }

    // Record task activity
    const { error } = await supabase
      .from('user_activity')
      .insert({
        user_id: session.user.id,
        project_id: projectId,
        activity_type: 'project', // Tasks are always part of projects
        item_id: task.id,
        item_name: task.name,
        status: task.status,
        progress: task.progress,
        time_spent: task.estimatedMinutes || 0,
        metadata: {
          description: task.description,
          notes: task.notes,
          parentName: parentName,
          subtaskCount: task.subtasks.length
        }
      });

    if (error) {
      console.error("Error recording task activity:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error syncing task activity:", error);
    return false;
  }
};

// Function to record daily summary
export const recordDailySummary = async (
  summary: {
    totalTimeSpent: number;
    completedItems: number;
    mood?: string;
    energyLevel?: number;
    motivationLevel?: number;
    notes?: string;
  }
): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("User not authenticated. Unable to record summary.");
      return false;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Upsert daily summary (insert if not exists, update if exists)
    const { error } = await supabase
      .from('daily_summaries')
      .upsert({
        user_id: session.user.id,
        date: today,
        total_time_spent: summary.totalTimeSpent,
        completed_items: summary.completedItems,
        mood: summary.mood,
        energy_level: summary.energyLevel,
        motivation_level: summary.motivationLevel,
        notes: summary.notes
      }, {
        onConflict: 'user_id, date'
      });

    if (error) {
      console.error("Error recording daily summary:", error);
      toast({
        title: "Error",
        description: "Failed to update your daily summary",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Summary Updated",
      description: "Your daily progress has been recorded",
    });
    return true;
  } catch (error) {
    console.error("Error recording daily summary:", error);
    return false;
  }
};

// Function to record learning retention data
export const recordLearningRetention = async (
  studyItemId: string,
  studyItemName: string,
  confidenceLevel: number
): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("User not authenticated. Unable to record retention data.");
      return false;
    }

    const now = new Date();
    const nextReview = calculateNextReview(confidenceLevel, 0);

    // Upsert learning retention (insert if not exists, update if exists)
    const { error } = await supabase
      .from('learning_retention')
      .upsert({
        user_id: session.user.id,
        study_item_id: studyItemId,
        study_item_name: studyItemName,
        confidence_level: confidenceLevel,
        review_count: 1,
        last_reviewed_at: now.toISOString(),
        next_review_at: nextReview.toISOString()
      }, {
        onConflict: 'user_id, study_item_id'
      });

    if (error) {
      console.error("Error recording learning retention:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error recording learning retention:", error);
    return false;
  }
};

// Helper function to calculate next review date based on spaced repetition algorithm
const calculateNextReview = (confidenceLevel: number, reviewCount: number): Date => {
  const now = new Date();
  let daysToAdd = 1;
  
  // Simple spaced repetition algorithm based on confidence level and review count
  // For confidence levels: 1 = Not confident, 5 = Very confident
  if (reviewCount === 0) {
    // First review
    daysToAdd = 1;
  } else {
    // Subsequent reviews
    switch (confidenceLevel) {
      case 1: // Not confident at all
        daysToAdd = 1;
        break;
      case 2: // Barely confident
        daysToAdd = 2;
        break;
      case 3: // Somewhat confident
        daysToAdd = 4;
        break;
      case 4: // Confident
        daysToAdd = 7;
        break;
      case 5: // Very confident
        daysToAdd = 14;
        break;
      default:
        daysToAdd = 1;
    }
    
    // Increase interval with each successful review
    daysToAdd = daysToAdd * (1 + (Math.min(reviewCount, 5) * 0.5));
  }
  
  const nextReview = new Date(now);
  nextReview.setDate(now.getDate() + Math.round(daysToAdd));
  
  return nextReview;
};

// Helper function to determine activity type
const getActivityType = (item: Project | StudyPlan | GateStudyPlan): 'project' | 'study' | 'gate' => {
  if ('type' in item) {
    if (item.type === 'project') {
      return 'project';
    } else if (item.type === 'study') {
      return 'study';
    }
  }
  
  // Check if it's a GateStudyPlan by checking for subjects property
  if ('subjects' in item && !('phases' in item)) {
    return 'gate';
  }
  
  return 'project'; // Default fallback
};

// Function to sync user session information
export const recordUserSession = async (deviceInfo?: any): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("User not authenticated. Unable to record session.");
      return false;
    }
    
    // Get basic browser and OS info
    const browser = navigator.userAgent;
    const os = navigator.platform;
    
    const { error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: session.user.id,
        device_info: deviceInfo || {},
        browser,
        os,
        login_at: new Date().toISOString(),
        is_active: true
      });
      
    if (error) {
      console.error("Error recording user session:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error recording user session:", error);
    return false;
  }
};

// Function to end a user session
export const endUserSession = async (): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("User not authenticated. No session to end.");
      return false;
    }
    
    // Update active sessions to inactive
    const { error } = await supabase
      .from('user_sessions')
      .update({ 
        is_active: false,
        logout_at: new Date().toISOString()
      })
      .eq('user_id', session.user.id)
      .eq('is_active', true);
      
    if (error) {
      console.error("Error ending user session:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error ending user session:", error);
    return false;
  }
};
