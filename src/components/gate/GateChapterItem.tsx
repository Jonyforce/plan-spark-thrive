
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { GateChapter, GateLecture } from '@/types/gate';
import { cn } from '@/lib/utils';
import { GateLectureItem } from './GateLectureItem';

interface GateChapterItemProps {
  chapter: GateChapter;
  updateChapter: (chapter: GateChapter) => void;
  onDeleteChapter: () => void;
  readOnly?: boolean;
}

export const GateChapterItem: React.FC<GateChapterItemProps> = ({
  chapter,
  updateChapter,
  onDeleteChapter,
  readOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLecture, setNewLecture] = useState('');
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLecture.trim()) return;
    
    const newLectureItem: GateLecture = {
      id: crypto.randomUUID(),
      name: newLecture,
      completed: false
    };
    
    updateChapter({
      ...chapter,
      lectures: [...chapter.lectures, newLectureItem]
    });
    
    setNewLecture('');
  };
  
  const updateLecture = (updatedLecture: GateLecture) => {
    updateChapter({
      ...chapter,
      lectures: chapter.lectures.map((lecture) => 
        lecture.id === updatedLecture.id ? updatedLecture : lecture
      ),
    });
  };
  
  const deleteLecture = (lectureId: string) => {
    updateChapter({
      ...chapter,
      lectures: chapter.lectures.filter((lecture) => lecture.id !== lectureId)
    });
  };
  
  const calculateProgress = (): number => {
    if (chapter.lectures.length === 0) return 0;
    
    const completedLectures = chapter.lectures.filter(lecture => lecture.completed).length;
    return Math.round((completedLectures / chapter.lectures.length) * 100);
  };
  
  const progress = calculateProgress();
  
  return (
    <div className="border rounded-md p-4 mb-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="p-0 h-6 w-6"
            onClick={toggleOpen}
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
          <span className="font-medium">{chapter.name}</span>
          <span className="text-xs text-muted-foreground ml-2">
            ({chapter.lectures.filter(l => l.completed).length}/{chapter.lectures.length} lectures)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm">{progress}%</div>
          {!readOnly && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onDeleteChapter}>
              <span className="sr-only">Delete Chapter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        <Progress value={progress} className="h-2" />
      </div>
      
      {isOpen && (
        <div className="mt-4 pl-6 space-y-2">
          {chapter.lectures.map((lecture) => (
            <GateLectureItem
              key={lecture.id}
              lecture={lecture}
              updateLecture={updateLecture}
              onDelete={() => deleteLecture(lecture.id)}
              readOnly={readOnly}
            />
          ))}
          
          {!readOnly && chapter.lectures.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No lectures added.</p>
          )}
          
          {!readOnly && (
            <form onSubmit={handleAddLecture} className={cn("flex items-center gap-2 mt-4", chapter.lectures.length === 0 ? "mt-2" : "")}>
              <Input
                type="text"
                value={newLecture}
                onChange={(e) => setNewLecture(e.target.value)}
                placeholder="Add new lecture..."
                className="h-8 text-sm"
              />
              <Button type="submit" size="sm" className="h-8 px-2">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
