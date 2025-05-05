import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { cn } from '@/lib/utils';

interface DraggableTimeTrackerProps {
  isTracking: boolean;
  itemName: string;
  projectName: string;
  startTime: string;
  onStopTracking: () => void;
  onPauseTracking?: () => void;
}

export const DraggableTimeTracker: React.FC<DraggableTimeTrackerProps> = ({
  isTracking,
  itemName,
  projectName,
  startTime,
  onStopTracking,
  onPauseTracking
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elapsedTime, setElapsedTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [opacity, setOpacity] = useState(0.9);
  
  const clockRef = useRef<HTMLDivElement>(null);

  // Update elapsed time at regular intervals
  useEffect(() => {
    if (!isTracking) return;
    
    const timer = setInterval(() => {
      const elapsed = formatDistance(new Date(), new Date(startTime), { includeSeconds: true });
      setElapsedTime(elapsed);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, isTracking]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!clockRef.current) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle opacity change
  const changeOpacity = () => {
    setOpacity(opacity === 0.9 ? 0.5 : 0.9);
  };

  return (
    <div
      ref={clockRef}
      className={cn(
        "fixed z-50 shadow-lg rounded-lg overflow-hidden transition-all duration-300",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: opacity,
        backgroundColor: "rgba(26, 31, 44, 0.9)",
        borderColor: "#9b87f5",
        borderWidth: "1px",
        width: isExpanded ? "280px" : "auto",
        userSelect: 'none',
      }}
    >
      {/* Header/Draggable area */}
      <div 
        className="bg-primary/20 p-2 flex items-center justify-between"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-white">Time Tracker</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0 text-white hover:bg-primary/20"
            onClick={changeOpacity}
          >
            {opacity === 0.9 ? "○" : "●"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0 text-white hover:bg-primary/20"
            onClick={toggleExpanded}
          >
            {isExpanded ? "−" : "+"}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 text-white">
          <div className="space-y-2">
            <div className="text-xs text-gray-300">Project</div>
            <div className="text-sm font-medium truncate">{projectName}</div>
            
            <div className="text-xs text-gray-300">Item</div>
            <div className="text-sm font-medium truncate">{itemName}</div>
            
            <div className="text-xs text-gray-300">Elapsed</div>
            <div className="text-xl font-bold">{elapsedTime}</div>
            
            <div className="flex space-x-2 pt-1">
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex-1"
                onClick={onStopTracking}
              >
                <Square className="mr-1 h-4 w-4" />
                Stop
              </Button>
              {onPauseTracking && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-primary text-primary hover:bg-primary/20"
                >
                  <Pause className="mr-1 h-4 w-4" />
                  Pause
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
