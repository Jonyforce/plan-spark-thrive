
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Phase, Step } from '@/types/project';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react';
import { StepBuilder } from './StepBuilder';
import { calculateProgress } from '@/utils/jsonValidator';

interface PhaseBuilderProps {
  phase: Phase;
  onUpdate: (phase: Phase) => void;
  onDelete: () => void;
  isDeleteAllowed: boolean;
  phaseNumber: number;
}

export const PhaseBuilder: React.FC<PhaseBuilderProps> = ({
  phase,
  onUpdate,
  onDelete,
  isDeleteAllowed,
  phaseNumber
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...phase,
      name: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...phase,
      description: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddStep = () => {
    const newStep: Step = {
      id: uuidv4(),
      name: `Step ${phase.steps.length + 1}`,
      description: '',
      status: 'not-started',
      progress: 0,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onUpdate({
      ...phase,
      steps: [...phase.steps, newStep],
      updatedAt: new Date().toISOString()
    });
  };

  const handleUpdateStep = (updatedStep: Step) => {
    const updatedSteps = phase.steps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    );
    
    const updatedPhase = {
      ...phase,
      steps: updatedSteps,
      progress: calculateProgress(updatedSteps),
      updatedAt: new Date().toISOString()
    };
    
    onUpdate(updatedPhase);
  };

  const handleDeleteStep = (stepId: string) => {
    onUpdate({
      ...phase,
      steps: phase.steps.filter(step => step.id !== stepId),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <Card>
      <Collapsible open={isOpen}>
        <CardHeader className="px-4 py-3 bg-muted/50">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger 
              onClick={() => setIsOpen(!isOpen)} 
              className="flex items-center hover:text-primary cursor-pointer"
            >
              {isOpen ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              <h3 className="font-medium">Phase {phaseNumber}: {phase.name || 'Untitled'}</h3>
            </CollapsibleTrigger>
            
            {isDeleteAllowed && (
              <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive h-8 w-8">
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phase Name</label>
              <Input
                value={phase.name}
                onChange={handleNameChange}
                placeholder="Enter phase name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phase Description (Optional)</label>
              <Textarea
                value={phase.description || ''}
                onChange={handleDescriptionChange}
                placeholder="Enter phase description"
                rows={2}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Steps</h4>
                <Button variant="outline" size="sm" onClick={handleAddStep}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
              
              <div className="space-y-3">
                {phase.steps.map((step, index) => (
                  <StepBuilder
                    key={step.id}
                    step={step}
                    onUpdate={handleUpdateStep}
                    onDelete={() => handleDeleteStep(step.id)}
                    stepNumber={index + 1}
                  />
                ))}
                
                {phase.steps.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm border border-dashed rounded-md">
                    No steps yet. Click "Add Step" to create one.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
