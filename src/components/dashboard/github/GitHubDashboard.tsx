
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubConnector } from './GitHubConnector';
import { GitHubActivity } from './GitHubActivity';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProjectStore } from '@/stores/projectStore';

export const GitHubDashboard: React.FC = () => {
  const { toast } = useToast();
  const { projects } = useProjectStore();

  const generateReport = async () => {
    try {
      toast({
        title: "Generating Report",
        description: "Creating a progress report from your data...",
      });

      // In a real implementation, this would use actual project data
      // Here we're using a simplified approach for demonstration
      const report = {
        timestamp: new Date().toISOString(),
        projects: projects.map(project => ({
          name: project.name,
          progress: project.progress,
          status: project.status,
          updatedAt: project.updatedAt
        })),
        summary: {
          totalProjects: projects.length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          averageProgress: projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1)
        }
      };

      // Get user's connected repositories
      const { data: repositories } = await supabase
        .from('github_repositories')
        .select('*')
        .limit(1)
        .order('last_synced', { ascending: false });

      if (!repositories || repositories.length === 0) {
        toast({
          title: "No Repository Connected",
          description: "Please connect a GitHub repository first",
          variant: "destructive",
        });
        return;
      }

      const repo = repositories[0];

      // Store report in database
      const { error } = await supabase
        .from('github_reports')
        .insert({
          user_id: repo.user_id,
          repository_id: repo.id,
          report_type: 'weekly',
          content: report,
          pushed_at: new Date().toISOString()
        });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Report Generated",
        description: "Your progress report has been generated and stored",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Failed to Generate Report",
        description: "An error occurred while generating your progress report",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>GitHub Integration</CardTitle>
        <div className="flex items-center gap-2">
          <GitHubConnector />
          <Button variant="secondary" onClick={generateReport}>Generate Report</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GitHubActivity />
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 space-y-2 text-center">
                <p className="text-muted-foreground">No reports generated yet</p>
                <Button variant="outline" size="sm" onClick={generateReport}>
                  Generate Your First Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
