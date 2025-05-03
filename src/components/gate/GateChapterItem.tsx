
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { GateChapter, GateLecture } from '@/types/gate';
import { ProgressBar } from '@/components/project/ProgressBar';
import { GateLectureItem } from './GateLectureItem';

interface GateChapterItemProps {
  chapter: GateChapter;
  updateChapter: (chapter: GateChapter) => void;
  onDelete: () => void;
}

export const GateChapterItem: React.FC<GateChapterItemProps> = ({
  chapter,
  updateChapter,
  onDelete
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newLectureName, setNewLectureName] = useState('');

  const handleAddLecture = () => {
    if (!newLectureName.trim()) return;
    
    const newLecture: GateLecture = {
      id: uuidv4(),
      name: newLectureName,
      completed: false
    };
    
    const updatedLectures = [...chapter.lectures, newLecture];
    updateChapter({
      ...chapter,
      lectures: updatedLectures,
      // Keep progress calculation synchronized
      progress: calculateProgress(updatedLectures)
    });
    
    setNewLectureName('');
  };

  const handleDeleteLecture = (lectureId: string) => {
    const updatedLectures = chapter.lectures.filter(lecture => lecture.id !== lectureId);
    updateChapter({
      ...chapter,
      lectures: updatedLectures,
      progress: calculateProgress(updatedLectures)
    });
  };

  const updateLecture = (updatedLecture: GateLecture) => {
    const updatedLectures = chapter.lectures.map(lecture =>
      lecture.id === updatedLecture.id ? updatedLecture : lecture
    );
    
    updateChapter({
      ...chapter,
      lectures: updatedLectures,
      progress: calculateProgress(updatedLectures)
    });
  };

  const calculateProgress = (lectures: GateLecture[]) => {
    if (lectures.length === 0) return 0;
    const completedCount = lectures.filter(lecture => lecture.completed).length;
    return Math.round((completedCount / lectures.length) * 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddLecture();
    }
  };

  return (
    <Card className="border-l-2" style={{ borderLeftColor: '#A78BFA' }}>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 mr-1 h-auto"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <h4 className="text-base font-medium">{chapter.name}</h4>
              <span className="text-xs font-normal text-muted-foreground ml-2">
                ({chapter.lectures.length} lectures)
              </span>
            </div>
            <div className="mt-2 pl-5">
              <ProgressBar value={chapter.progress} size="sm" />
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        
        {expanded && (
          <CardContent className="pt-3 px-0 pb-0">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter lecture name..."
                  value={newLectureName}
                  onChange={(e) => setNewLectureName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  size="sm"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddLecture} 
                  disabled={!newLectureName.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              
              <div className="space-y-2 pl-5">
                {chapter.lectures.map(lecture => (
                  <GateLectureItem
                    key={lecture.id}
                    lecture={lecture}
                    updateLecture={updateLecture}
                    onDelete={() => handleDeleteLecture(lecture.id)}
                  />
                ))}
                
                {chapter.lectures.length === 0 && (
                  <p className="text-sm text-muted-foreground">No lectures added yet</p>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </div>
    </Card>
  );
};
