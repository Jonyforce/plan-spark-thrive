
export interface GateLecture {
  id: string;
  name: string;
  completed: boolean;
  notes?: string;
}

export interface GateChapter {
  id: string;
  name: string;
  lectures: GateLecture[];
  progress: number; // 0-100
  status?: "not-started" | "in-progress" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

export interface GateSubject {
  id: string;
  name: string;
  chapters: GateChapter[];
  progress: number; // 0-100
  status: "not-started" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface GateStudyPlan {
  id: string;
  name: string;
  description?: string;
  subjects: GateSubject[];
  progress: number; // 0-100
  type: "study";
  status: "not-started" | "in-progress" | "completed";
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
