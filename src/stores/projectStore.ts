
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, ProjectOrStudy, StudyPlan } from '@/types/project';
import { GateStudyPlan } from '@/types/gate';

interface ProjectStoreState {
  projects: Project[];
  studies: (StudyPlan | GateStudyPlan)[];
  addProject: (project: Project) => void;
  addStudy: (study: StudyPlan | GateStudyPlan) => void;
  updateProject: (id: string, updatedData: Partial<Project>) => void;
  updateStudy: (id: string, updatedData: Partial<StudyPlan | GateStudyPlan>) => void;
  removeProject: (id: string) => void;
  removeStudy: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  getStudyById: (id: string) => (StudyPlan | GateStudyPlan) | undefined;
  getAllItems: () => ProjectOrStudy[];
}

export const useProjectStore = create<ProjectStoreState>()(
  persist(
    (set, get) => ({
      projects: [],
      studies: [],
      
      addProject: (project) => set((state) => ({ 
        projects: [...state.projects, project] 
      })),
      
      addStudy: (study) => set((state) => ({ 
        studies: [...state.studies, study] 
      })),
      
      updateProject: (id, updatedData) => set((state) => ({
        projects: state.projects.map((project) => 
          project.id === id ? { ...project, ...updatedData } : project
        )
      })),
      
      updateStudy: (id, updatedData) => set((state) => ({
        studies: state.studies.map((study) => 
          study.id === id ? { ...study, ...updatedData } : study
        ) as (StudyPlan | GateStudyPlan)[]
      })),
      
      removeProject: (id) => set((state) => ({
        projects: state.projects.filter((project) => project.id !== id)
      })),
      
      removeStudy: (id) => set((state) => ({
        studies: state.studies.filter((study) => study.id !== id)
      })),
      
      getProjectById: (id) => get().projects.find((project) => project.id === id),
      
      getStudyById: (id) => get().studies.find((study) => study.id === id),
      
      getAllItems: () => [...get().projects, ...get().studies]
    }),
    {
      name: 'project-storage',
    }
  )
);
