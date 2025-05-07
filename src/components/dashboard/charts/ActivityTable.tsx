
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
  { date: '03/24', type: 'project', item: 'Task 1', status: 'Not-started' },
  { date: '03/25', type: 'study', item: 'Task test', status: 'In-progress' },
  { date: '03/26', type: 'gate', item: 'Test top 1', status: 'Completed' },
  { date: '03/27', type: 'project', item: 'Task 2', status: 'Completed' },
  { date: '03/28', type: 'study', item: 'Task review', status: 'Not-started' },
];

export const ActivityTable: React.FC = () => {
  return (
    <div className="max-h-[300px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Activity Type</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.item}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
