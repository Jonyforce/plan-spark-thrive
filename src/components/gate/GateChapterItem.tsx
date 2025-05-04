
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GateChapter, GateLecture } from '@/types/gate';
import { GateLectureItem } from './GateLectureItem';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export interface GateChapterItemProps {
  chapter: GateChapter;
  updateChapter: (updatedChapter: GateChapter) => void;
  readOnly?: boolean;
  onDelete?: () => void;
}

export const GateChapterItem: React.FC<GateChapterItemProps> = ({
  chapter,
  updateChapter,
  readOnly = false,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddLecture = () => {
    if (readOnly) return;
    
    const newLecture: GateLecture = {
      id: uuidv4(),
      name: 'New Lecture',
      completed: false,
      updatedAt: new Date().toISOString()
    };

    const updatedChapter = {
      ...chapter,
      lectures: [...chapter.lectures, newLecture],
      updatedAt: new Date().toISOString()
    };

    updateChapter(updatedChapter);
  };

  const handleDeleteLecture = (lectureId: string) => {
    if (readOnly) return;
    
    const updatedLectures = chapter.lectures.filter(lec => lec.id !== lectureId);
    const progress = calculateProgress(updatedLectures);
    const status = determineStatus(progress);

    updateChapter({
      ...chapter,
      lectures: updatedLectures,
      progress,
      status,
      updatedAt: new Date().toISOString()
    });
  };

  const updateLecture = (updatedLecture: GateLecture) => {
    if (readOnly) return;
    
    const updatedLectures = chapter.lectures.map(lecture => 
      lecture.id === updatedLecture.id ? updatedLecture : lecture
    );
    
    const progress = calculateProgress(updatedLectures);
    const status = determineStatus(progress);

    updateChapter({
      ...chapter,
      lectures: updatedLectures,
      progress,
      status,
      updatedAt: new Date().toISOString()
    });
  };

  const calculateProgress = (lectures: GateLecture[]): number => {
    if (lectures.length === 0) return 0;
    
    const completedCount = lectures.filter(lecture => lecture.completed).length;
    return (completedCount / lectures.length) * 100;
  };

  const determineStatus = (progress: number): "not-started" | "in-progress" | "completed" => {
    if (progress === 0) return "not-started";
    if (progress === 100) return "completed";
    return "in-progress";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    updateChapter({
      ...chapter,
      name: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const progress = chapter.lectures.length > 0 
    ? calculateProgress(chapter.lectures) 
    : chapter.progress || 0;
  
  return (
    <div className="border rounded-md mb-2">
      <div className="p-2 bg-muted/20 flex items-center justify-between">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger
            className="flex items-center space-x-2 flex-1 cursor-pointer w-full text-left"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <div className="font-medium flex-1 overflow-hidden">
              {readOnly ? (
                <div>{chapter.name}</div>
              ) : (
                <Input
                  className="h-7"
                  value={chapter.name}
                  onChange={handleNameChange}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {chapter.lectures.length} {chapter.lectures.length === 1 ? 'lecture' : 'lectures'}
            </div>
            <div className="text-xs font-medium w-12 text-right">
              {Math.round(progress)}%
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="p-3 space-y-3">
              {chapter.lectures.map((lecture) => (
                <GateLectureItem
                  key={lecture.id}
                  lecture={lecture}
                  updateLecture={updateLecture}
                  onDelete={() => handleDeleteLecture(lecture.id)}
                  readOnly={readOnly}
                />
              ))}

              {!readOnly && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={handleAddLecture}
                >
                  Add Lecture
                </Button>
              )}

              {chapter.lectures.length === 0 && (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  No lectures added yet.
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {!readOnly && onDelete && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
};
