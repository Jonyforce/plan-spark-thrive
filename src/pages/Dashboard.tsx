
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { ActivityTracker } from '@/components/dashboard/ActivityTracker';
import { GitHubDashboard } from '@/components/dashboard/github/GitHubDashboard';
import { Check, Clock, Tag, CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectStore } from '@/stores/projectStore';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { projects, studies } = useProjectStore();
  
  // Find recently updated projects and studies
  const recentItems = [...projects, ...studies].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 4);

  // Calculate total completion stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  
  const totalStudies = studies.length;
  const completedStudies = studies.filter(s => s.status === 'completed').length;
  
  // Get unique tags
  const allTags = [...projects, ...studies].flatMap(item => item.tags || []);
  const uniqueTags = new Set(allTags).size;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and stay organized.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity Tracking</TabsTrigger>
            <TabsTrigger value="github">GitHub Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardStatCard
                title="Projects"
                value={`${completedProjects}/${totalProjects}`}
                icon={<Check className="h-4 w-4" />}
                description={`${Math.round((completedProjects / (totalProjects || 1)) * 100)}% completion rate`}
              />
              
              <DashboardStatCard
                title="Studies"
                value={`${completedStudies}/${totalStudies}`}
                icon={<CalendarCheck className="h-4 w-4" />}
                description={`${Math.round((completedStudies / (totalStudies || 1)) * 100)}% completion rate`}
              />
              
              <DashboardStatCard
                title="Time Tracked"
                value="0h 0m"
                icon={<Clock className="h-4 w-4" />}
                description="No time tracked yet"
              />
              
              <DashboardStatCard
                title="Tags"
                value={uniqueTags}
                icon={<Tag className="h-4 w-4" />}
                description="Unique tags used"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/projects">View All</Link>
                    </Button>
                  </div>
                  <CardDescription>Your recently updated projects and studies</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentItems.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {recentItems.map(item => (
                        <ProjectCard key={item.id} project={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <p className="text-muted-foreground mb-4">No projects or studies yet</p>
                      <Button asChild>
                        <Link to="/import">Import Your First Project</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                  <CardDescription>Quick actions to get you going</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/projects/new">
                      <Check className="mr-2 h-4 w-4" />
                      Create New Project
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/studies/new">
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      Create Study Plan
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/import">
                      <Tag className="mr-2 h-4 w-4" />
                      Import from JSON
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/time-tracking">
                      <Clock className="mr-2 h-4 w-4" />
                      Track Time
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityTracker />
          </TabsContent>

          <TabsContent value="github">
            <GitHubDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
