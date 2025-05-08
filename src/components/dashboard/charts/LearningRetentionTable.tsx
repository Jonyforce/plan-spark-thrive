
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Sample data - in a real app, this would come from the database
const sampleData = [
  { item: 'Project', status: 'Not-started', confidenceLevel: '—' },
  { item: 'Study', status: 'In-progress', confidenceLevel: '—' },
  { item: 'Gate', status: 'Completed', confidenceLevel: '—' },
];

export const LearningRetentionTable: React.FC = () => {
  const { data = sampleData, isLoading } = useQuery({
    queryKey: ['learning-retention'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('learning_retention')
          .select('*')
          .order('last_reviewed_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          return data.map(item => ({
            item: item.study_item_name,
            status: item.review_count > 0 ? 'Reviewed' : 'Not reviewed',
            confidenceLevel: item.confidence_level ? `${item.confidence_level}/5` : '—'
          }));
        }
        
        return sampleData;
      } catch (error) {
        console.error('Error fetching learning retention data:', error);
        return sampleData;
      }
    },
    placeholderData: sampleData
  });

  return (
    <div className="max-h-[240px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Study item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Confidence Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.item}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell className="text-right">{row.confidenceLevel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
