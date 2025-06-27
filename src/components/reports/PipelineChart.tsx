
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface PipelineChartProps {
  deals: any[] | undefined;
}

export function PipelineChart({ deals }: PipelineChartProps) {
  const pipelineData = React.useMemo(() => {
    if (!deals) return [];

    const stageOrder = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const stageData: { [key: string]: { count: number; value: number } } = {};

    stageOrder.forEach(stage => {
      stageData[stage] = { count: 0, value: 0 };
    });

    deals.forEach(deal => {
      if (stageData[deal.stage]) {
        stageData[deal.stage].count++;
        stageData[deal.stage].value += deal.amount || 0;
      }
    });

    return stageOrder.map(stage => ({
      stage,
      count: stageData[stage].count,
      value: stageData[stage].value,
    }));
  }, [deals]);

  const chartConfig = {
    value: {
      label: "Pipeline Value",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Pipeline</CardTitle>
        <p className="text-sm text-muted-foreground">
          Deal value distribution across pipeline stages
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={pipelineData}>
            <XAxis dataKey="stage" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-value)" 
              fill="var(--color-value)" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
