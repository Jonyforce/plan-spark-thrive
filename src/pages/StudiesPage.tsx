
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useProjectStore } from '@/stores/projectStore';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { GateStudyPlan } from '@/types/gate';

const StudiesPage = () => {
  const { studies } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Filter and sort studies
  const filteredStudies = studies
    .filter(study => 
      study.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (study.description && study.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (study.tags && study.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress-asc':
          return a.progress - b.progress;
        case 'progress-desc':
          return b.progress - a.progress;
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  // Determine correct link path based on study type
  const getStudyPath = (study: any) => {
    // Check if it's a GATE study plan
    if (study.tags?.includes('GATE')) {
      return `/studies/${study.id}`;
    }
    // For regular study plans
    return `/studies/${study.id}`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Plans</h1>
            <p className="text-muted-foreground">Manage and track your educational goals.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/gate-study">
                <Plus className="mr-2 h-4 w-4" /> GATE Study Plan
              </Link>
            </Button>
            <Button asChild>
              <Link to="/studies/new">
                <Plus className="mr-2 h-4 w-4" /> New Study Plan
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search studies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="progress-desc">Progress (High to Low)</SelectItem>
              <SelectItem value="progress-asc">Progress (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredStudies.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudies.map(study => (
              <Link key={study.id} to={getStudyPath(study)}>
                <ProjectCard project={study} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">No study plans found</h3>
            {searchTerm ? (
              <p className="text-muted-foreground mt-2">
                No study plans match your search criteria. Try different keywords.
              </p>
            ) : (
              <div className="space-y-3 mt-3">
                <p className="text-muted-foreground">
                  You haven't created any study plans yet.
                </p>
                <Button asChild>
                  <Link to="/studies/new">Create Your First Study Plan</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default StudiesPage;
