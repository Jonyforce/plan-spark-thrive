
import React from 'react';

// Helper to generate random data - in a real app, this would come from the database
const generateData = () => {
  const cells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const intensity = Math.floor(Math.random() * 5); // 0-4 intensity
      cells.push({ row, col, intensity });
    }
  }
  return cells;
};

const getIntensityClass = (intensity: number) => {
  const classes = [
    'bg-gray-100',
    'bg-purple-100',
    'bg-purple-200',
    'bg-purple-300',
    'bg-purple-400',
  ];
  return classes[intensity] || classes[0];
};

export const StudyHeatmap: React.FC = () => {
  const cells = generateData();
  
  return (
    <div className="h-[240px] flex items-center justify-center">
      <div className="w-full max-w-md grid grid-cols-6 gap-1">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`aspect-square rounded ${getIntensityClass(cell.intensity)}`}
            title={`Row ${cell.row + 1}, Column ${cell.col + 1}: Activity Level ${cell.intensity + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
