import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { GateSubject, GateChapter } from '@/types/gate';
import { GateChapterItem } from './GateChapterItem';
import { ProgressBar } from '@/components/project/ProgressBar';

interface GateSubjectItemProps {
  subject: GateSubject;
  updateSubject: (subject: GateSubject) => void;
  onDelete: () => void;
}

export const GateSubjectItem: React.FC<GateSubjectItemProps> = ({
  subject,
  updateSubject,
  onDelete
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');

  const handleAddChapter = () => {
    if (!newChapterName.trim()) return;
    
    const now = new Date().toISOString();
    const newChapter: GateChapter = {
      id: uuidv4(),
      name: newChapterName,
      lectures: [],
      progress: 0,
      status: "not-started",
      createdAt: now,
      updatedAt: now
    };
    
    const updatedChapters = [...subject.chapters, newChapter];
    updateSubject({
      ...subject,
      chapters: updatedChapters,
      updatedAt: now
    });
    
    setNewChapterName('');
  };

  const handleDeleteChapter = (chapterId: string) => {
    const updatedChapters = subject.chapters.filter(chapter => chapter.id !== chapterId);
    updateSubject({
      ...subject,
      chapters: updatedChapters,
      updatedAt: new Date().toISOString()
    });
  };

  const updateChapter = (updatedChapter: GateChapter) => {
    const updatedChapters = subject.chapters.map(chapter =>
      chapter.id === updatedChapter.id ? updatedChapter : chapter
    );
    
    // Recalculate subject progress based on chapters
    const progress = updatedChapters.length 
      ? updatedChapters.reduce((sum, chapter) => sum + chapter.progress, 0) / updatedChapters.length
      : 0;
    
    const now = new Date().toISOString();
    // Update the chapter status based on progress
    const status = progress === 100 ? "completed" : 
                  progress > 0 ? "in-progress" : 
                  "not-started";
      
    updateSubject({
      ...subject,
      chapters: updatedChapters,
      progress,
      status,
      updatedAt: now
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddChapter();
    }
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: '#8B5CF6' }}>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 mr-1 h-auto"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
              {subject.name}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({subject.chapters.length} chapters)
              </span>
            </CardTitle>
            <div className="mt-2">
              <ProgressBar value={subject.progress} size="sm" />
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-0 px-4 pb-3">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter chapter name..."
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleAddChapter} 
                disabled={!newChapterName.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Chapter
              </Button>
            </div>
            
            <div className="space-y-3 pl-4">
              {subject.chapters.map(chapter => (
                <GateChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  updateChapter={updateChapter}
                  onDelete={() => handleDeleteChapter(chapter.id)}
                />
              ))}
              
              {subject.chapters.length === 0 && (
                <p className="text-sm text-muted-foreground">No chapters added yet</p>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
