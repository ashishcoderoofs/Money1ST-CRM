
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";

interface TaskChartProps {
  tasks: any[] | undefined;
}

export function TaskChart({ tasks }: TaskChartProps) {
  const taskData = React.useMemo(() => {
    if (!tasks) return [];

    const statusCounts: { [key: string]: number } = {};
    tasks.forEach(task => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [tasks]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const chartConfig = {
    count: {
      label: "Tasks",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown of tasks by current status
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <PieChart>
            <Pie
              data={taskData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {taskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
