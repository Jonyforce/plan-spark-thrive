
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash, Clock } from 'lucide-react';
import { GateLecture } from '@/types/gate';
import { cn } from '@/lib/utils';

interface GateLectureItemProps {
  lecture: GateLecture;
  updateLecture: (lecture: GateLecture) => void;
  onDelete: () => void;
  readOnly?: boolean;
}

export const GateLectureItem: React.FC<GateLectureItemProps> = ({
  lecture,
  updateLecture,
  onDelete,
  readOnly = false
}) => {
  const handleToggleComplete = () => {
    if (readOnly) return;
    
    updateLecture({
      ...lecture,
      completed: !lecture.completed,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="flex items-center gap-2 group">
      <Checkbox 
        checked={lecture.completed}
        onCheckedChange={() => handleToggleComplete()}
        disabled={readOnly}
        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
      />
      <span 
        className={cn(
          "flex-1 text-sm",
          lecture.completed && "line-through text-muted-foreground"
        )}
      >
        {lecture.name}
      </span>
      {lecture.timeSpent && lecture.timeSpent !== "00:00:00:00" && (
        <div className="flex items-center text-xs text-muted-foreground mr-2">
          <Clock className="h-3 w-3 mr-1" />
          {lecture.timeSpent}
        </div>
      )}
      {!readOnly && (
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          onClick={onDelete}
        >
          <Trash className="h-3 w-3 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
};
