
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { GateSubjectItem } from './GateSubjectItem';
import { GateSubject, GateStudyPlan } from '@/types/gate';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GateSubjectListProps {
  subjects: GateSubject[];
  setStudyPlan: React.Dispatch<React.SetStateAction<GateStudyPlan>>;
  readOnly?: boolean;
}

export const GateSubjectList: React.FC<GateSubjectListProps> = ({ 
  subjects = [], 
  setStudyPlan,
  readOnly = false
}) => {
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;

    const now = new Date().toISOString();
    const newSubject: GateSubject = {
      id: uuidv4(),
      name: newSubjectName,
      chapters: [],
      progress: 0,
      status: "not-started",
      createdAt: now,
      updatedAt: now
    };

    setStudyPlan(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
      updatedAt: now
    }));
    
    setNewSubjectName('');
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (readOnly) return;
    
    setStudyPlan(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject.id !== subjectId),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateSubject = (updatedSubject: GateSubject) => {
    if (readOnly) return;
    
    setStudyPlan(prev => {
      const updatedSubjects = prev.subjects.map(subject => 
        subject.id === updatedSubject.id ? updatedSubject : subject
      );
      
      const overallProgress = calculateOverallProgress(updatedSubjects);
      const status = overallProgress === 100 ? "completed" : 
                  overallProgress > 0 ? "in-progress" : 
                  "not-started";
      
      return {
        ...prev,
        subjects: updatedSubjects,
        progress: overallProgress,
        status,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const calculateOverallProgress = (subjects: GateSubject[]) => {
    if (!subjects.length) return 0;
    return subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubject();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subjects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!readOnly && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter subject name..."
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleAddSubject} disabled={!newSubjectName.trim()}>
              <Plus className="h-4 w-4 mr-2" /> Add Subject
            </Button>
          </div>
        )}
        
        {subjects.length === 0 ? (
          <Alert>
            <AlertDescription>
              {readOnly 
                ? 'No subjects in this study plan yet.'
                : 'No subjects added yet. Add your first GATE subject using the input above.'
              }
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject) => (
              <GateSubjectItem 
                key={subject.id} 
                subject={subject} 
                updateSubject={updateSubject}
                onDelete={() => handleDeleteSubject(subject.id)}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
