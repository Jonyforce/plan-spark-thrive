
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjectStore } from '@/stores/projectStore';
import { GitHubInfo, Project } from '@/types/project';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { syncProject } from '@/utils/dbSync';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectFormInput {
  name: string;
  description?: string;
  githubEnabled?: boolean;
  githubRepoUrl?: string;
}

export const ProjectCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProject, getAllItems } = useProjectStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<ProjectFormInput>({
    defaultValues: {
      name: '',
      description: '',
      githubEnabled: false,
      githubRepoUrl: '',
    }
  });
  
  const watchGithubEnabled = form.watch('githubEnabled', false);

  const extractGitHubInfo = (repoUrl: string): GitHubInfo | null => {
    try {
      // Handle various GitHub URL formats
      const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
      const matches = repoUrl.match(githubRegex);
      
      if (matches && matches.length >= 3) {
        const owner = matches[1];
        let repo = matches[2];
        
        // Remove .git suffix if present
        repo = repo.replace(/\.git$/, '');
        
        // Remove any query parameters or fragments
        repo = repo.split('?')[0].split('#')[0];
        
        return {
          repoUrl,
          owner,
          repo,
          lastSynced: new Date().toISOString(),
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error parsing GitHub URL:", error);
      return null;
    }
  };
  
  const onSubmit = async (data: ProjectFormInput) => {
    setIsSubmitting(true);
    
    try {
      // Check for duplicate project name
      const allItems = getAllItems();
      const isDuplicate = allItems.some(item => 
        item.name.toLowerCase() === data.name.toLowerCase()
      );
      
      if (isDuplicate) {
        toast({
          title: "Error",
          description: "A project or study with this name already exists",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Process GitHub repo if enabled
      let githubInfo: GitHubInfo | undefined;
      if (data.githubEnabled && data.githubRepoUrl) {
        githubInfo = extractGitHubInfo(data.githubRepoUrl);
        
        if (!githubInfo) {
          toast({
            title: "Error",
            description: "Invalid GitHub repository URL. Please enter a valid URL.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Create Project
      const timestamp = new Date().toISOString();
      
      const newProject: Project = {
        id: uuidv4(),
        name: data.name,
        description: data.description || '',
        type: 'project',
        status: 'not-started',
        progress: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        github: githubInfo,
        phases: [
          {
            id: uuidv4(),
            name: 'Phase 1',
            status: 'not-started',
            progress: 0,
            createdAt: timestamp,
            updatedAt: timestamp,
            steps: [
              {
                id: uuidv4(),
                name: 'Step 1',
                status: 'not-started',
                progress: 0,
                createdAt: timestamp,
                updatedAt: timestamp,
                tasks: [
                  {
                    id: uuidv4(),
                    name: 'Task 1',
                    status: 'not-started',
                    progress: 0,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                    subtasks: []
                  }
                ]
              }
            ]
          }
        ]
      };
      
      // Add to local store
      addProject(newProject);
      
      toast({
        title: "Project Created",
        description: `Successfully created project "${data.name}"`,
      });
      
      // Attempt to sync with database
      setIsSyncing(true);
      await syncProject(newProject);
      setIsSyncing(false);
      
      setIsSubmitting(false);
      navigate(`/projects/${newProject.id}/view`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Something went wrong while creating the project",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setIsSyncing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Project</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="github">GitHub Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ 
                    required: "Project name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters"
                    },
                    maxLength: {
                      value: 50,
                      message: "Name cannot exceed 50 characters"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter project name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter project description" 
                          rows={4} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="github" className="space-y-4 pt-4">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="githubEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable GitHub Integration</FormLabel>
                        <FormDescription>
                          Sync with a GitHub repository to track commits, issues, and PRs
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {watchGithubEnabled && (
                  <FormField
                    control={form.control}
                    name="githubRepoUrl"
                    rules={{ 
                      required: watchGithubEnabled ? "GitHub Repository URL is required" : false
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub Repository URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://github.com/username/repository" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the full URL to your GitHub repository
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-between space-x-2">
            <div>
              {activeTab === "github" && (
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setActiveTab("basic")}
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate('/projects')}
              >
                Cancel
              </Button>
              {activeTab === "basic" ? (
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("github")}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isSyncing}
                >
                  {isSubmitting ? 'Creating...' : isSyncing ? 'Syncing...' : 'Create Project'}
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
