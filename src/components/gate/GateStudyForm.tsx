
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { StudyPlan } from '@/types/project';

interface GateStudyFormProps {
  studyPlan: StudyPlan;
  setStudyPlan: React.Dispatch<React.SetStateAction<StudyPlan>>;
}

export const GateStudyForm: React.FC<GateStudyFormProps> = ({ studyPlan, setStudyPlan }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudyPlan(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GATE Study Plan Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Study Plan Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="E.g., GATE ECE 2025 Preparation"
            value={studyPlan.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Add details about your GATE preparation goals..."
            value={studyPlan.description || ''}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
