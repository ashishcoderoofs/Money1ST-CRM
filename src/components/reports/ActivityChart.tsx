
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ActivityChartProps {
  contacts: any[] | undefined;
  deals: any[] | undefined;
  tasks: any[] | undefined;
}

export function ActivityChart({ contacts, deals, tasks }: ActivityChartProps) {
  const activityData = React.useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    return last30Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const contactsCreated = contacts?.filter(c => 
        c.created_at.startsWith(dateStr)
      ).length || 0;

      const dealsCreated = deals?.filter(d => 
        d.created_at.startsWith(dateStr)
      ).length || 0;

      const tasksCreated = tasks?.filter(t => 
        t.created_at.startsWith(dateStr)
      ).length || 0;

      return {
        date: dayStr,
        contacts: contactsCreated,
        deals: dealsCreated,
        tasks: tasksCreated,
        total: contactsCreated + dealsCreated + tasksCreated,
      };
    });
  }, [contacts, deals, tasks]);

  const chartConfig = {
    total: {
      label: "Total Activity",
      color: "hsl(var(--chart-1))",
    },
    contacts: {
      label: "Contacts",
      color: "hsl(var(--chart-2))",
    },
    deals: {
      label: "Deals",
      color: "hsl(var(--chart-3))",
    },
    tasks: {
      label: "Tasks",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <p className="text-sm text-muted-foreground">
          Daily activity across all CRM modules (last 30 days)
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={activityData}>
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="var(--color-total)" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="contacts" 
              stroke="var(--color-contacts)" 
              strokeWidth={1}
            />
            <Line 
              type="monotone" 
              dataKey="deals" 
              stroke="var(--color-deals)" 
              strokeWidth={1}
            />
            <Line 
              type="monotone" 
              dataKey="tasks" 
              stroke="var(--color-tasks)" 
              strokeWidth={1}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
