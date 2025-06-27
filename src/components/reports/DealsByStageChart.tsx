
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DealsByStageChartProps {
  deals: any[] | undefined;
}

export function DealsByStageChart({ deals }: DealsByStageChartProps) {
  const stageData = React.useMemo(() => {
    if (!deals) return [];

    const stageOrder = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const stageCounts: { [key: string]: number } = {};

    stageOrder.forEach(stage => {
      stageCounts[stage] = 0;
    });

    deals.forEach(deal => {
      if (stageCounts.hasOwnProperty(deal.stage)) {
        stageCounts[deal.stage]++;
      }
    });

    return stageOrder.map(stage => ({
      stage: stage.replace(' ', '\n'),
      count: stageCounts[stage],
      fullStage: stage,
    }));
  }, [deals]);

  const chartConfig = {
    count: {
      label: "Deals",
      color: "hsl(var(--chart-5))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals by Stage</CardTitle>
        <p className="text-sm text-muted-foreground">
          Number of deals in each pipeline stage
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={stageData}>
            <XAxis dataKey="stage" />
            <YAxis />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item?.fullStage || label;
              }}
            />
            <Bar dataKey="count" fill="var(--color-count)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
