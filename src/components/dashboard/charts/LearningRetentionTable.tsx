
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Sample data - in a real app, this would come from the database
const data = [
  { item: 'Project', status: 'Not-started', confidenceLevel: '—' },
  { item: 'Study', status: 'In-progress', confidenceLevel: '—' },
  { item: 'Gate', status: 'Completed', confidenceLevel: '—' },
];

export const LearningRetentionTable: React.FC = () => {
  return (
    <div className="max-h-[240px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Study item</TableHead>
            <TableHead>Confidence Level</TableHead>
            <TableHead className="text-right">Status</TableHead>
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
