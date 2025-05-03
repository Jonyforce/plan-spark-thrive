
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { GateStudyForm } from '@/components/gate/GateStudyForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GateSubjectList } from '@/components/gate/GateSubjectList';
import { GateStudyPlan, GateSubject } from '@/types/gate';
import { GateImportModal } from '@/components/gate/GateImportModal';

const GateStudyPlanPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id?: string }>();
  const { getStudyById, addStudy, updateStudy } = useProjectStore();
  
  const [studyPlan, setStudyPlan] = useState<GateStudyPlan>({
    id: id || uuidv4(),
    name: '',
    description: '',
    type: 'study',
    status: 'not-started',
    progress: 0,
    tags: ['GATE', 'exam'],
    subjects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    if (id) {
      const existingPlan = getStudyById(id);
      if (existingPlan) {
        setStudyPlan(existingPlan as GateStudyPlan);
      }
    }
  }, [id, getStudyById]);

  const handleImport = (subjects: GateSubject[]) => {
    setStudyPlan(prev => ({
      ...prev,
      subjects: [...prev.subjects, ...subjects]
    }));
  };

  const handleSave = () => {
    const updatedPlan = {
      ...studyPlan,
      updatedAt: new Date().toISOString()
    };

    if (id) {
      updateStudy(id, updatedPlan);
      toast({
        title: "Study plan updated",
        description: "Your GATE study plan has been updated successfully",
      });
    } else {
      addStudy(updatedPlan);
      toast({
        title: "Study plan created",
        description: "Your GATE study plan has been created successfully",
      });
    }
    
    navigate('/studies');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/studies')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {id ? 'Edit GATE Study Plan' : 'Create GATE Study Plan'}
            </h1>
          </div>
          <GateImportModal onImport={handleImport} />
        </div>

        <div className="space-y-8">
          <GateStudyForm 
            studyPlan={studyPlan} 
            setStudyPlan={setStudyPlan} 
          />
          
          <GateSubjectList 
            subjects={studyPlan.subjects} 
            setStudyPlan={setStudyPlan}
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate('/studies')}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {id ? 'Update Study Plan' : 'Create Study Plan'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GateStudyPlanPage;
