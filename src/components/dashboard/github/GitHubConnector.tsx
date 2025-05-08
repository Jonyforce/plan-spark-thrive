
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github } from 'lucide-react'; // Changed from GitHubLogoIcon to Github from lucide-react
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/utils/auth';

export const GitHubConnector: React.FC = () => {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleRepositoryUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepositoryUrl(e.target.value);
  };

  const parseGitHubUrl = (url: string) => {
    try {
      // Handle various GitHub URL formats
      const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = url.match(githubRegex);
      
      if (match && match.length >= 3) {
        return {
          owner: match[1],
          repo: match[2].replace('.git', '')
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing GitHub URL:', error);
      return null;
    }
  };

  const connectRepository = async () => {
    try {
      setIsConnecting(true);
      
      // Parse GitHub repository URL
      const repoInfo = parseGitHubUrl(repositoryUrl);
      if (!repoInfo) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)",
          variant: "destructive",
        });
        setIsConnecting(false);
        return;
      }

      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to connect a repository",
          variant: "destructive",
        });
        setIsConnecting(false);
        return;
      }

      // For now, we'll mock the GitHub account connection
      // In production, this would trigger an OAuth flow
      const { data: githubAccount, error: accountError } = await supabase
        .from('github_accounts')
        .insert({
          user_id: user.id,
          username: repoInfo.owner,
          // Note: In production, you'd use the OAuth token
          // Here we're using a placeholder for demonstration
          access_token: "mock_token_placeholder_bytea_in_production",
          installation_id: "mock_installation_id"
        })
        .select()
        .single();

      if (accountError) {
        console.error('Error creating GitHub account:', accountError);
        toast({
          title: "Connection Failed",
          description: "Failed to connect GitHub account",
          variant: "destructive",
        });
        setIsConnecting(false);
        return;
      }

      // Insert repository information
      const { data: repo, error: repoError } = await supabase
        .from('github_repositories')
        .insert({
          user_id: user.id,
          github_account_id: githubAccount.id,
          repo_name: repoInfo.repo,
          owner: repoInfo.owner,
          last_synced: new Date().toISOString()
        })
        .select()
        .single();

      if (repoError) {
        console.error('Error creating repository record:', repoError);
        toast({
          title: "Repository Connection Failed",
          description: "Failed to connect repository",
          variant: "destructive",
        });
        setIsConnecting(false);
        return;
      }

      toast({
        title: "Repository Connected",
        description: `Successfully connected ${repoInfo.owner}/${repoInfo.repo}`,
      });

      setRepositoryUrl('');
      setIsConnecting(false);
    } catch (error) {
      console.error('Error connecting repository:', error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred while connecting the repository",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Github className="h-4 w-4" /> {/* Changed from GitHubLogoIcon to Github */}
          Connect GitHub Repository
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Connect GitHub Repository</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="repositoryUrl">Repository URL</Label>
            <Input 
              id="repositoryUrl"
              placeholder="https://github.com/username/repository"
              value={repositoryUrl}
              onChange={handleRepositoryUrlChange}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of the GitHub repository you want to connect
            </p>
          </div>

          <Button 
            className="w-full" 
            onClick={connectRepository} 
            disabled={isConnecting || !repositoryUrl}
          >
            {isConnecting ? 'Connecting...' : 'Connect Repository'}
          </Button>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Why connect GitHub?</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Track your GitHub activity alongside your study progress</li>
              <li>• Push study reports to your GitHub repository</li>
              <li>• Visualize your coding and learning progress together</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
