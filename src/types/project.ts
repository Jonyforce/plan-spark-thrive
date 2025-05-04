
export type TaskStatus = 'not-started' | 'in-progress' | 'completed';

export interface BaseItem {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  progress: number; // 0-100
  notes?: string; // Added notes field for user input
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubTask extends BaseItem {
  estimatedMinutes?: number;
}

export interface Task extends BaseItem {
  subtasks: SubTask[];
  estimatedMinutes?: number;
}

export interface Step extends BaseItem {
  tasks: Task[];
}

export interface Phase extends BaseItem {
  steps: Step[];
}

export interface Project extends BaseItem {
  phases: Phase[];
  type: 'project' | 'study';
}

export interface StudyTopic extends BaseItem {
  estimatedMinutes?: number;
}

export interface StudyChapter extends BaseItem {
  topics: StudyTopic[];
}

export interface StudySubject extends BaseItem {
  chapters: StudyChapter[];
}

export interface StudyPlan extends BaseItem {
  subjects: StudySubject[];
  type: 'study';
}

// Import the GateStudyPlan directly in the project types file to avoid circular dependencies
import { GateStudyPlan } from './gate';

// Updated to explicitly include GateStudyPlan
export type ProjectOrStudy = Project | StudyPlan | GateStudyPlan;

export interface TimeTracking {
  id: string;
  projectId: string;
  itemId: string; // ID of the task/topic being tracked
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  notes?: string;
}
