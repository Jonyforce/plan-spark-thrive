
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, BookOpen, Clock } from 'lucide-react';
import { GateStudyPlan, GateChapter, GateLecture } from '@/types/gate';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const StudyLearningPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id, subjectId, chapterId } = useParams<{ id: string; subjectId: string; chapterId: string }>();
  const { getStudyById, updateStudy } = useProjectStore();
  
  const [studyPlan, setStudyPlan] = useState<GateStudyPlan | null>(null);
  const [currentSubject, setCurrentSubject] = useState<any>(null);
  const [currentChapter, setCurrentChapter] = useState<GateChapter | null>(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const plan = getStudyById(id);
      if (plan && 'subjects' in plan) {
        setStudyPlan(plan as GateStudyPlan);
        
        // Find the current subject and chapter
        if (subjectId && chapterId) {
          const subject = plan.subjects.find(s => s.id === subjectId);
          if (subject) {
            setCurrentSubject(subject);
            const chapter = subject.chapters.find(c => c.id === chapterId);
            if (chapter) {
              setCurrentChapter(chapter);
              // Initialize notes if available
              if (chapter.lectures && chapter.lectures.length > 0 && chapter.lectures[0].notes) {
                setNotes(chapter.lectures[0].notes);
              }
            } else {
              toast({
                title: 'Chapter not found',
                description: 'The specified chapter could not be found in this study plan.',
                variant: 'destructive',
              });
              navigate(`/studies/${id}`);
            }
          } else {
            toast({
              title: 'Subject not found',
              description: 'The specified subject could not be found in this study plan.',
              variant: 'destructive',
            });
            navigate(`/studies/${id}`);
          }
        }
      } else {
        navigate('/studies');
      }
    }
    
    // Start the timer when the component mounts
    setStartTime(Date.now());
    const timer = setInterval(() => {
      if (startTime) {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [id, subjectId, chapterId, getStudyById, navigate, toast, startTime]);

  const saveProgress = () => {
    if (!studyPlan || !currentSubject || !currentChapter) return;
    
    // Calculate elapsed time since start
    const timeSpent = elapsedTime;
    
    // Update the current lecture
    const updatedLectures = [...currentChapter.lectures];
    
    // Create lecture if it doesn't exist
    if (currentLectureIndex >= updatedLectures.length) {
      updatedLectures.push({
        id: uuidv4(),
        name: `Lecture ${currentLectureIndex + 1}`,
        completed: false,
        timeSpent: '00:00:00',
        updatedAt: new Date().toISOString()
      });
    }
    
    // Update current lecture
    updatedLectures[currentLectureIndex] = {
      ...updatedLectures[currentLectureIndex],
      notes: notes,
      timeSpent: timeSpent,
      updatedAt: new Date().toISOString()
    };
    
    // Update chapter
    const updatedChapters = currentSubject.chapters.map(chapter => 
      chapter.id === currentChapter.id 
        ? { ...chapter, lectures: updatedLectures, status: 'in-progress' } 
        : chapter
    );
    
    // Update subject
    const updatedSubjects = studyPlan.subjects.map(subject => 
      subject.id === currentSubject.id 
        ? { ...subject, chapters: updatedChapters, status: 'in-progress' } 
        : subject
    );
    
    // Calculate new progress
    const updatedStudyPlan = {
      ...studyPlan,
      subjects: updatedSubjects,
      status: 'in-progress',
      updatedAt: new Date().toISOString()
    };
    
    // Update the study plan
    if (id) {
      updateStudy(id, updatedStudyPlan);
      setStudyPlan(updatedStudyPlan);
      
      toast({
        title: 'Progress saved',
        description: 'Your study progress has been saved successfully.',
      });
    }
  };

  const markLectureComplete = (complete: boolean) => {
    if (!currentChapter || !currentLectureIndex) return;
    
    const updatedLectures = [...currentChapter.lectures];
    
    // Create lecture if it doesn't exist
    if (currentLectureIndex >= updatedLectures.length) {
      updatedLectures.push({
        id: uuidv4(),
        name: `Lecture ${currentLectureIndex + 1}`,
        completed: complete,
        timeSpent: elapsedTime,
        notes: notes,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Update existing lecture
      updatedLectures[currentLectureIndex] = {
        ...updatedLectures[currentLectureIndex],
        completed: complete,
        timeSpent: elapsedTime,
        notes: notes,
        updatedAt: new Date().toISOString()
      };
    }
    
    // Check if all lectures are completed
    const allCompleted = updatedLectures.every(lecture => lecture.completed);
    
    // Update the study plan
    if (studyPlan && currentSubject) {
      // Update chapter
      const updatedChapters = currentSubject.chapters.map(chapter => 
        chapter.id === currentChapter.id 
          ? { 
              ...chapter, 
              lectures: updatedLectures, 
              status: allCompleted ? 'completed' : 'in-progress',
              progress: Math.round((updatedLectures.filter(l => l.completed).length / updatedLectures.length) * 100)
            } 
          : chapter
      );
      
      // Check if all chapters are completed
      const allChaptersCompleted = updatedChapters.every(chapter => chapter.status === 'completed');
      
      // Update subject
      const updatedSubjects = studyPlan.subjects.map(subject => 
        subject.id === currentSubject.id 
          ? { 
              ...subject, 
              chapters: updatedChapters, 
              status: allChaptersCompleted ? 'completed' : 'in-progress',
              progress: Math.round((updatedChapters.reduce((acc, chapter) => acc + chapter.progress, 0) / updatedChapters.length))
            } 
          : subject
      );
      
      // Check if all subjects are completed
      const allSubjectsCompleted = updatedSubjects.every(subject => subject.status === 'completed');
      
      // Calculate new overall progress
      const overallProgress = Math.round((updatedSubjects.reduce((acc, subject) => acc + subject.progress, 0) / updatedSubjects.length));
      
      // Update the study plan
      const updatedStudyPlan = {
        ...studyPlan,
        subjects: updatedSubjects,
        status: allSubjectsCompleted ? 'completed' : 'in-progress',
        progress: overallProgress,
        updatedAt: new Date().toISOString()
      };
      
      if (id) {
        updateStudy(id, updatedStudyPlan);
        setStudyPlan(updatedStudyPlan);
        
        toast({
          title: complete ? 'Lecture completed' : 'Lecture marked as incomplete',
          description: complete ? 'Great job! Your progress has been updated.' : 'Lecture status updated.',
        });
        
        // Move to next lecture if completed
        if (complete && currentLectureIndex < updatedLectures.length - 1) {
          setCurrentLectureIndex(currentLectureIndex + 1);
          setNotes(updatedLectures[currentLectureIndex + 1]?.notes || '');
        }
      }
    }
  };

  // Get current lecture
  const currentLecture = currentChapter?.lectures?.[currentLectureIndex] || null;

  if (!studyPlan || !currentSubject || !currentChapter) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p>Loading study content...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => {
              saveProgress();
              navigate(`/studies/${id}`);
            }}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{currentSubject.name}</h1>
              <p className="text-muted-foreground">
                Chapter: {currentChapter.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm font-mono">{elapsedTime}</span>
            </div>
            <Button onClick={saveProgress} variant="outline">Save Progress</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar - Chapter progress */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Chapter Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{currentChapter.progress || 0}%</span>
                    </div>
                    <Progress value={currentChapter.progress || 0} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Lectures</h3>
                    <div className="space-y-1">
                      {currentChapter.lectures && currentChapter.lectures.length > 0 ? (
                        currentChapter.lectures.map((lecture, index) => (
                          <Button
                            key={lecture.id}
                            variant={currentLectureIndex === index ? "default" : "outline"}
                            className="w-full justify-start text-left"
                            onClick={() => {
                              saveProgress();
                              setCurrentLectureIndex(index);
                              setNotes(lecture.notes || '');
                            }}
                          >
                            <div className="flex items-center w-full">
                              <span className="mr-2">{index + 1}.</span>
                              <span className="flex-1 truncate">{lecture.name}</span>
                              {lecture.completed && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                            </div>
                          </Button>
                        ))
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <div className="flex items-center w-full">
                            <span className="mr-2">1.</span>
                            <span className="flex-1 truncate">Lecture 1</span>
                          </div>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {currentLecture?.name || `Lecture ${currentLectureIndex + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="notes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes" className="space-y-4 pt-4">
                    <Textarea
                      placeholder="Take your notes here..."
                      className="min-h-[300px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="insights" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                          <CardTitle className="text-lg">Learning Tips</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Break down complex topics into smaller, manageable parts.</li>
                          <li>Use active recall by testing yourself on what you've learned.</li>
                          <li>Explain concepts in your own words to deepen understanding.</li>
                          <li>Connect new information to topics you already know.</li>
                          <li>Take regular breaks to improve focus and retention.</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => markLectureComplete(false)}
                  className="flex items-center"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Mark Incomplete
                </Button>
                <Button
                  onClick={() => markLectureComplete(true)}
                  className="bg-green-600 hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudyLearningPage;
