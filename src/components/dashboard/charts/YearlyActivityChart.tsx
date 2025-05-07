
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Sample data - in a real app, this would come from the database
const data = [
  { month: 'Jan', activity: 65 },
  { month: 'Feb', activity: 90 },
  { month: 'Mar', activity: 75 },
  { month: 'Apr', activity: 95 },
  { month: 'May', activity: 60 },
  { month: 'Jun', activity: 78 },
  { month: 'Jul', activity: 82 },
  { month: 'Aug', activity: 65 },
];

const activityChartConfig = {
  activity: {
    label: 'Activity',
    color: '#8B5CF6',
  },
};

export const YearlyActivityChart: React.FC = () => {
  return (
    <ChartContainer className="h-[240px]" config={activityChartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={true}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={30}
          />
          <ChartTooltip
            content={(props) => (
              <ChartTooltipContent
                className="rounded-lg border bg-background p-2 shadow-md"
                {...props}
              />
            )}
          />
          <Bar
            dataKey="activity"
            fill="var(--color-activity, #8B5CF6)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
