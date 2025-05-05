
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Link, FileText } from 'lucide-react';
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
  onNotesChange?: (notes: string) => void;
  notes?: string;
}

export const DraggableTimeTracker: React.FC<DraggableTimeTrackerProps> = ({
  isTracking,
  itemName,
  projectName,
  startTime,
  onStopTracking,
  onPauseTracking,
  onNotesChange,
  notes = ''
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elapsedTime, setElapsedTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [opacity, setOpacity] = useState(0.9);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(notes);
  const [fileLink, setFileLink] = useState('');
  const [externalLink, setExternalLink] = useState('');
  
  const clockRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update notes in parent component when text changes
  useEffect(() => {
    if (onNotesChange && noteText !== notes) {
      onNotesChange(noteText);
    }
  }, [noteText, notes, onNotesChange]);

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

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a local URL for the file to display
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    
    // Update notes with file information
    const fileInfo = `[File: ${fileName}](${fileUrl})`;
    setNoteText(prev => prev ? `${prev}\n${fileInfo}` : fileInfo);
    setFileLink(fileUrl);
  };

  // Handle adding external link
  const handleAddLink = () => {
    if (!externalLink) return;
    
    const linkInfo = `[Link: ${externalLink}](${externalLink})`;
    setNoteText(prev => prev ? `${prev}\n${linkInfo}` : linkInfo);
    setExternalLink('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
            
            {/* Notes toggle button */}
            <Button 
              variant="outline" 
              size="sm"
              className="w-full border-gray-600 text-gray-300 hover:bg-primary/20 mt-2"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? "Hide Notes" : "Show Notes"}
            </Button>
            
            {/* Notes section */}
            {showNotes && (
              <div className="space-y-2 pt-2">
                <textarea 
                  className="w-full bg-gray-800/50 border border-gray-700 rounded p-2 text-white text-sm resize-none"
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add notes about this task..."
                />
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-primary/20"
                    onClick={triggerFileInput}
                  >
                    <FileText className="mr-1 h-4 w-4" />
                    File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  
                  <div className="flex flex-1">
                    <input 
                      type="text" 
                      className="flex-1 bg-gray-800/50 border-y border-l border-gray-700 rounded-l p-1 text-white text-xs"
                      placeholder="URL..."
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                    />
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-primary/20 rounded-l-none"
                      onClick={handleAddLink}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
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
