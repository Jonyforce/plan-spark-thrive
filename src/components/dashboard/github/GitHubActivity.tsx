
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GitCommit, GitPullRequest, GitMerge, GitBranch } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/utils/auth';

interface RepositoryData {
  id: string;
  repo_name: string;
  owner: string;
  commit_count: number;
  pr_count: number;
  issue_count: number;
  last_synced: string;
  description?: string;
  stars_count?: number;
}

export const GitHubActivity: React.FC = () => {
  const { data: repositories, isLoading, error } = useQuery({
    queryKey: ['github-repositories'],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('github_repositories')
        .select('*')
        .order('last_synced', { ascending: false });
      
      if (error) {
        console.error('Error fetching repositories:', error);
        throw new Error('Failed to fetch GitHub repositories');
      }
      
      return data as RepositoryData[];
    }
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Failed to load GitHub data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 space-y-2 text-center">
            <p className="text-muted-foreground">No GitHub repositories connected</p>
            <p className="text-xs text-muted-foreground">
              Connect a repository to track your GitHub activity
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repositories.map((repo) => (
            <div key={repo.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{repo.owner}/{repo.repo_name}</h3>
                <span className="text-xs text-muted-foreground">
                  Last synced: {new Date(repo.last_synced).toLocaleDateString()}
                </span>
              </div>

              {repo.description && (
                <p className="text-sm text-muted-foreground mb-4 truncate">{repo.description}</p>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <GitCommit className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">{repo.commit_count} commits</span>
                </div>
                <div className="flex items-center">
                  <GitPullRequest className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">{repo.pr_count} PRs</span>
                </div>
                <div className="flex items-center">
                  <GitMerge className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">{repo.issue_count} issues</span>
                </div>
              </div>
              
              {repo.stars_count !== undefined && (
                <div className="mt-2 flex items-center">
                  <GitBranch className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-sm">{repo.stars_count} stars</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
