
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { parseGateJsonData } from '@/utils/gateData';
import { useToast } from '@/hooks/use-toast';
import { GateStudyPlan } from '@/types/gate';

interface GateImportModalProps {
  onImport: (subjects: GateStudyPlan['subjects']) => void;
}

export const GateImportModal: React.FC<GateImportModalProps> = ({ onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleImport = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      
      if (!jsonData.Subjects) {
        throw new Error('Invalid JSON structure. Expected a "Subjects" property.');
      }
      
      const parsedSubjects = parseGateJsonData(jsonData.Subjects);
      onImport(parsedSubjects);
      
      toast({
        title: 'Import successful',
        description: `Imported ${parsedSubjects.length} subjects with their chapters and lectures.`,
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Invalid JSON format',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import GATE Subjects</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import GATE Study Structure</DialogTitle>
          <DialogDescription>
            Paste your GATE subjects JSON data to import the structure into your study plan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder={`Paste JSON data here...\nExample: { "Subjects": { "Math": { "Algebra": 5, "Calculus": 8 } } }`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="h-64"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!jsonInput.trim()}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
