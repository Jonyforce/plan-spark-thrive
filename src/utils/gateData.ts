
import { v4 as uuidv4 } from 'uuid';
import { GateSubject, GateChapter, GateLecture } from '@/types/gate';

export const parseGateJsonData = (jsonData: Record<string, Record<string, number>>): GateSubject[] => {
  const now = new Date().toISOString();
  
  return Object.entries(jsonData).map(([subjectName, chapters]) => {
    const chaptersList: GateChapter[] = Object.entries(chapters).map(([chapterName, lectureCount]) => {
      const lectures: GateLecture[] = Array.from({ length: lectureCount }, (_, i) => ({
        id: uuidv4(),
        name: `Lecture ${i + 1}`,
        completed: false,
        timeSpent: "00:00:00:00", // Initialize with zero time spent
        updatedAt: now
      }));
      
      return {
        id: uuidv4(),
        name: chapterName,
        lectures,
        progress: 0,
        status: "not-started",
        createdAt: now,
        updatedAt: now
      };
    });
    
    return {
      id: uuidv4(),
      name: subjectName,
      chapters: chaptersList,
      progress: 0,
      status: "not-started",
      createdAt: now,
      updatedAt: now
    };
  });
};
