
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Sample data - in a real app, this would come from the database
const data = [
  { day: '05/01', productivity: 30 },
  { day: '05/02', productivity: 60 },
  { day: '05/03', productivity: 45 },
  { day: '05/04', productivity: 75 },
  { day: '05/05', productivity: 58 },
  { day: '05/06', productivity: 70 },
  { day: '05/07', productivity: 80 },
];

const productivityChartConfig = {
  productivity: {
    label: 'Productivity',
    color: '#8B5CF6',
  },
};

export const DailyProductivityChart: React.FC = () => {
  return (
    <ChartContainer className="h-[300px]" config={productivityChartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            padding={{ left: 10, right: 10 }}
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
          <Line
            type="monotone"
            dataKey="productivity"
            stroke="var(--color-productivity, #8B5CF6)"
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
            dot={{ r: 4, strokeWidth: 0, fill: "var(--color-productivity, #8B5CF6)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
