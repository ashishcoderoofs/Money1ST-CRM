
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ContactsGrowthChartProps {
  contacts: any[] | undefined;
}

export function ContactsGrowthChart({ contacts }: ContactsGrowthChartProps) {
  const growthData = React.useMemo(() => {
    if (!contacts) return [];

    const monthlyGrowth: { [key: string]: number } = {};
    
    contacts.forEach(contact => {
      const month = new Date(contact.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
    });

    let cumulative = 0;
    return Object.entries(monthlyGrowth)
      .map(([month, count]) => {
        cumulative += count;
        return { month, contacts: cumulative, newContacts: count };
      })
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-12); // Last 12 months
  }, [contacts]);

  const chartConfig = {
    contacts: {
      label: "Total Contacts",
      color: "hsl(var(--chart-3))",
    },
    newContacts: {
      label: "New Contacts",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts Growth</CardTitle>
        <p className="text-sm text-muted-foreground">
          Contact database growth over time
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={growthData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="contacts" 
              stroke="var(--color-contacts)" 
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
