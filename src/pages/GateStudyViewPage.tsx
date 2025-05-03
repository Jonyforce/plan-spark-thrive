
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { GateStudyPlan } from '@/types/gate';
import { GateSubjectList } from '@/components/gate/GateSubjectList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/project/ProgressBar';
import { formatDistance } from 'date-fns';

const GateStudyViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getStudyById } = useProjectStore();
  const [studyPlan, setStudyPlan] = useState<GateStudyPlan | null>(null);

  useEffect(() => {
    if (id) {
      const existingPlan = getStudyById(id);
      if (existingPlan && 'subjects' in existingPlan) {
        setStudyPlan(existingPlan as GateStudyPlan);
      } else {
        navigate('/studies');
      }
    }
  }, [id, getStudyById, navigate]);

  if (!studyPlan) {
    return null;
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/studies')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{studyPlan.name}</h1>
              <p className="text-muted-foreground">
                Last updated {getTimeAgo(studyPlan.updatedAt)}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate(`/gate-study/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Plan
          </Button>
        </div>

        <div className="space-y-4">
          {studyPlan.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{studyPlan.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <ProgressBar value={studyPlan.progress} size="lg" />
                </div>
                <span className="text-xl font-medium">{Math.round(studyPlan.progress)}%</span>
              </div>

              <div className="flex gap-2 items-center">
                <span 
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(studyPlan.status)}`}
                >
                  {studyPlan.status.toUpperCase()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {studyPlan.subjects.length} subjects, {studyPlan.subjects.reduce((acc, subject) => acc + subject.chapters.length, 0)} chapters
                </span>
              </div>
            </CardContent>
          </Card>

          <GateSubjectList 
            subjects={studyPlan.subjects} 
            setStudyPlan={setStudyPlan as React.Dispatch<React.SetStateAction<GateStudyPlan>>}
            readOnly={true}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default GateStudyViewPage;
