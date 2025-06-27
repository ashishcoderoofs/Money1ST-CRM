
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface SalesChartProps {
  deals: any[] | undefined;
}

export function SalesChart({ deals }: SalesChartProps) {
  const salesData = React.useMemo(() => {
    if (!deals) return [];

    const monthlyData: { [key: string]: number } = {};
    
    deals.forEach(deal => {
      if (deal.stage === 'Closed Won' && deal.amount) {
        const month = new Date(deal.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
        monthlyData[month] = (monthlyData[month] || 0) + deal.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  }, [deals]);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly revenue from closed deals
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
