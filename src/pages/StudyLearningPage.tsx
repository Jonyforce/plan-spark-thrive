
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookCheck, BookOpen, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { GateChapter, GateStudyPlan, GateLecture } from '@/types/gate';
import { StudyPlan, StudyChapter, TaskStatus } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { recordLearningRetention } from '@/utils/dbSync';

const StudyLearningPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id, subjectId, chapterId } = useParams<{ id: string; subjectId: string; chapterId: string }>();
  const { getStudyById, updateStudy } = useProjectStore();
  
  // State for the current study
  const [studyPlan, setStudyPlan] = useState<GateStudyPlan | StudyPlan | null>(null);
  const [currentChapter, setCurrentChapter] = useState<GateChapter | null>(null);
  const [currentSubject, setCurrentSubject] = useState<any>(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [notes, setNotes] = useState("");
  
  // Check if the plan is a GateStudyPlan by checking for subjects property
  const isGateStudyPlan = (plan: any): plan is GateStudyPlan => {
    return 'subjects' in plan;
  };

  // Load the study plan and find the current chapter
  useEffect(() => {
    if (id && subjectId && chapterId) {
      const plan = getStudyById(id);
      
      if (plan) {
        setStudyPlan(plan);
        
        if (isGateStudyPlan(plan)) {
          const subject = plan.subjects.find(s => s.id === subjectId);
          if (subject) {
            setCurrentSubject(subject);
            const chapter = subject.chapters.find(c => c.id === chapterId);
            if (chapter) {
              setCurrentChapter(chapter as GateChapter);
            }
          }
        }
      }
    }
  }, [id, subjectId, chapterId, getStudyById]);

  // If no data is loaded yet, show a loading state
  if (!studyPlan || !currentChapter || !currentSubject) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </AppLayout>
    );
  }

  // Get the current lecture (GateStudyPlan) or use chapter content for StudyPlan
  const currentLecture = 'lectures' in currentChapter ? 
    currentChapter.lectures[currentLectureIndex] : null;

  // Handle navigation between lectures
  const goToNextLecture = () => {
    if ('lectures' in currentChapter && currentLectureIndex < currentChapter.lectures.length - 1) {
      setCurrentLectureIndex(currentLectureIndex + 1);
    } else {
      // Mark chapter as completed when reaching the end
      handleCompleteChapter();
    }
  };

  const goToPrevLecture = () => {
    if (currentLectureIndex > 0) {
      setCurrentLectureIndex(currentLectureIndex - 1);
    }
  };

  // Handle marking a chapter as completed
  const handleCompleteChapter = () => {
    if (!studyPlan || !currentSubject || !currentChapter) return;

    if (isGateStudyPlan(studyPlan)) {
      // Create a deep copy of the study plan
      const updatedPlan = JSON.parse(JSON.stringify(studyPlan)) as GateStudyPlan;
      
      // Find and update the chapter
      const subjectIndex = updatedPlan.subjects.findIndex(s => s.id === subjectId);
      if (subjectIndex >= 0) {
        const chapterIndex = updatedPlan.subjects[subjectIndex].chapters.findIndex(c => c.id === chapterId);
        if (chapterIndex >= 0) {
          // Mark chapter as completed
          updatedPlan.subjects[subjectIndex].chapters[chapterIndex].status = 'completed' as TaskStatus;
          updatedPlan.subjects[subjectIndex].chapters[chapterIndex].progress = 100;
          
          // Check if all chapters in the subject are completed, if so mark subject as completed
          const allChaptersCompleted = updatedPlan.subjects[subjectIndex].chapters.every(c => c.status === 'completed');
          if (allChaptersCompleted) {
            updatedPlan.subjects[subjectIndex].status = 'completed' as TaskStatus;
            updatedPlan.subjects[subjectIndex].progress = 100;
          } else {
            // Update subject progress
            const totalProgress = updatedPlan.subjects[subjectIndex].chapters
              .reduce((sum, chapter) => sum + chapter.progress, 0);
            const avgProgress = totalProgress / updatedPlan.subjects[subjectIndex].chapters.length;
            updatedPlan.subjects[subjectIndex].progress = avgProgress;
            updatedPlan.subjects[subjectIndex].status = 'in-progress' as TaskStatus;
          }
          
          // Update overall study plan progress
          const totalSubjectsProgress = updatedPlan.subjects
            .reduce((sum, subject) => sum + subject.progress, 0);
          updatedPlan.progress = totalSubjectsProgress / updatedPlan.subjects.length;
          
          // Check if all subjects are completed
          const allSubjectsCompleted = updatedPlan.subjects.every(s => s.status === 'completed');
          if (allSubjectsCompleted) {
            updatedPlan.status = 'completed' as TaskStatus;
          } else {
            updatedPlan.status = 'in-progress' as TaskStatus;
          }
          
          updatedPlan.updatedAt = new Date().toISOString();
          
          // Update the study plan in the store
          updateStudy(id!, updatedPlan);
          setStudyPlan(updatedPlan);

          // Record learning retention for this chapter
          const confidenceLevel = 3; // Medium confidence by default
          recordLearningRetention(
            chapterId as string,
            updatedPlan.subjects[subjectIndex].chapters[chapterIndex].name,
            confidenceLevel
          );
          
          toast({
            title: "Chapter completed",
            description: "Your progress has been updated",
          });
        }
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/studies/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Study Plan
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Sidebar with chapter info */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Study Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">{currentSubject.name}</h3>
                <div className="text-sm text-muted-foreground">
                  Chapter: {currentChapter.name}
                </div>
                {('lectures' in currentChapter && currentChapter.lectures.length > 0) && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Lecture {currentLectureIndex + 1} of {currentChapter.lectures.length}
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleCompleteChapter}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </Button>
            </CardContent>
          </Card>
          
          {/* Main content area */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {currentLecture ? currentLecture.name : currentChapter.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display lecture content or chapter content */}
              <div className="prose max-w-none">
                <div className="min-h-[200px] p-4 border rounded-md bg-gray-50">
                  {currentLecture ? (
                    <div>
                      <p>{currentLecture.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentLecture.timeSpent ? `Time spent: ${currentLecture.timeSpent}` : 'Not started yet'}
                      </p>
                      {currentLecture.notes && <p>{currentLecture.notes}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-muted-foreground">No lecture content available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Notes section */}
              <div className="space-y-2">
                <h3 className="font-medium">Your Notes</h3>
                <Textarea 
                  placeholder="Add your notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                />
              </div>
              
              {/* Navigation buttons */}
              {'lectures' in currentChapter && currentChapter.lectures.length > 0 && (
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={goToPrevLecture}
                    disabled={currentLectureIndex === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    onClick={goToNextLecture}
                  >
                    {currentLectureIndex < (currentChapter.lectures?.length || 0) - 1 ? (
                      <>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Complete
                        <BookCheck className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudyLearningPage;
