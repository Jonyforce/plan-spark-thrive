
import { v4 as uuidv4 } from 'uuid';
import { GateSubject, GateChapter, GateLecture } from '@/types/gate';

export const parseGateJsonData = (jsonData: Record<string, Record<string, number>>): GateSubject[] => {
  return Object.entries(jsonData).map(([subjectName, chapters]) => {
    const chaptersList: GateChapter[] = Object.entries(chapters).map(([chapterName, lectureCount]) => {
      const lectures: GateLecture[] = Array.from({ length: lectureCount }, (_, i) => ({
        id: uuidv4(),
        name: `Lecture ${i + 1}`,
        completed: false
      }));
      
      return {
        id: uuidv4(),
        name: chapterName,
        lectures,
        progress: 0
      };
    });
    
    return {
      id: uuidv4(),
      name: subjectName,
      chapters: chaptersList,
      progress: 0
    };
  });
};
