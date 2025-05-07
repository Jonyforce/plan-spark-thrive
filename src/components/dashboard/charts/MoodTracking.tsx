
import React from 'react';
import { Separator } from '@/components/ui/separator';

const LevelIndicator: React.FC<{ level: number; max: number; label: string }> = ({ level, max, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <h4 className="text-sm font-medium">{label}</h4>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-purple-400 rounded-full" 
        style={{ width: `${(level/max) * 100}%` }}
      />
    </div>
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>1</span>
      {max > 1 && max <= 10 && <span>{Math.floor(max/2)}</span>}
      <span>{max}</span>
    </div>
  </div>
);

export const MoodTracking: React.FC = () => {
  // Sample data - in a real app, this would come from the database
  const moodLevel = 3; // 1-5
  const energyLevel = 7; // 1-10
  const motivationLevel = 6; // 1-10
  
  // Example of additional metrics that could be tracked
  const metrics = [
    { name: 'Focus', value: 70 },
    { name: 'Stress', value: 40 },
    { name: 'Sleep', value: 60 },
    { name: 'Exercise', value: 30 },
  ];
  
  return (
    <div className="space-y-6">
      <LevelIndicator level={moodLevel} max={5} label="Mood" />
      
      <Separator />
      
      <LevelIndicator level={energyLevel} max={10} label="Energy Level" />
      
      <Separator />
      
      <LevelIndicator level={motivationLevel} max={10} label="Motivation Level" />
      
      <Separator />
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-200 rounded-full" 
                style={{ width: `${metric.value}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{metric.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
