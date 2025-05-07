
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyProductivityChart } from './charts/DailyProductivityChart';
import { StudyHeatmap } from './charts/StudyHeatmap';
import { YearlyActivityChart } from './charts/YearlyActivityChart';
import { LearningRetentionTable } from './charts/LearningRetentionTable';
import { ActivityTable } from './charts/ActivityTable';
import { MoodTracking } from './charts/MoodTracking';

export const ActivityTracker: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">User Activity Tracking</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Productivity Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Daily Productivity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyProductivityChart />
          </CardContent>
        </Card>
        
        {/* Study Progress Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Study Progress Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyHeatmap />
          </CardContent>
        </Card>
        
        {/* Yearly Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Yearly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyActivityChart />
          </CardContent>
        </Card>
        
        {/* Learning Retention */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Learning Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningRetentionTable />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTable />
          </CardContent>
        </Card>
        
        {/* Mood and Energy Tracking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodTracking />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
