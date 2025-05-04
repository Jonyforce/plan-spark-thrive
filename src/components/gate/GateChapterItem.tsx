
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updateChapter({
      ...chapter,
      lectures: [...chapter.lectures, newLecture]
    });
  };

  const handleDeleteLecture = (lectureId: string) => {
    if (readOnly) return;
    
    updateChapter({
      ...chapter,
      lectures: chapter.lectures.filter(lec => lec.id !== lectureId)
    });
  };

  const updateLecture = (updatedLecture: GateLecture) => {
    if (readOnly) return;
    
    updateChapter({
      ...chapter,
      lectures: chapter.lectures.map(lecture => 
        lecture.id === updatedLecture.id ? updatedLecture : lecture
      )
    });
  };

  const calculateChapterProgress = (): number => {
    if (chapter.lectures.length === 0) return 0;
    
    // Since GateLecture doesn't have progress or status properties,
    // we'll return the chapter's progress directly
    return chapter.progress;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    updateChapter({
      ...chapter,
      name: e.target.value
    });
  };

  const progress = calculateChapterProgress();
  
  return (
    <div className="border rounded-md mb-2">
      <div className="p-2 bg-muted/20 flex items-center justify-between">
        <CollapsibleTrigger
          onClick={() => setIsOpen(prev => !prev)}
          className="flex items-center space-x-2 flex-1 cursor-pointer"
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
            {progress}%
          </div>
        </CollapsibleTrigger>
      </div>

      <Collapsible open={isOpen}>
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
    </div>
  );
};
