
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { JsonImport } from '@/components/import/JsonImport';
import { ProjectOrStudy, Project, StudyPlan } from '@/types/project';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { updateProgressRecursively } from '@/utils/jsonValidator';

const ImportPage = () => {
  const navigate = useNavigate();
  const { addProject, addStudy } = useProjectStore();

  const handleImport = (data: ProjectOrStudy) => {
    // Process the imported data and update progress calculations
    const processed = updateProgressRecursively(data);
    
    if (processed.type === 'project') {
      addProject(processed as Project);
      navigate('/projects');
    } else {
      addStudy(processed as StudyPlan);
      navigate('/studies');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import from JSON</h1>
          <p className="text-muted-foreground">Import your project or study structure from JSON.</p>
        </div>
        
        <JsonImport onImport={handleImport} />
      </div>
    </AppLayout>
  );
};

export default ImportPage;
