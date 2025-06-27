
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Users, DollarSign } from "lucide-react";

const growthMetrics = [
  {
    title: "Branch Expansion",
    current: 12,
    target: 15,
    unit: "locations",
    progress: 80,
    icon: TrendingUp
  },
  {
    title: "Team Growth",
    current: 85,
    target: 100,
    unit: "members",
    progress: 85,
    icon: Users
  },
  {
    title: "Revenue Target",
    current: 750000,
    target: 1000000,
    unit: "dollars",
    progress: 75,
    icon: DollarSign
  },
  {
    title: "Training Completion",
    current: 92,
    target: 100,
    unit: "percent",
    progress: 92,
    icon: Target
  }
];

export function GrowthMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {growthMetrics.map((metric) => (
        <Card key={metric.title} className="shadow-m1f border-m1f-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-m1f-primary">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-m1f-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-m1f-primary">
              {metric.unit === 'dollars' 
                ? `$${(metric.current / 1000).toFixed(0)}K`
                : metric.unit === 'percent'
                ? `${metric.current}%`
                : metric.current
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Target: {metric.unit === 'dollars' 
                ? `$${(metric.target / 1000).toFixed(0)}K`
                : metric.unit === 'percent'
                ? `${metric.target}%`
                : metric.target
              } {metric.unit !== 'percent' && metric.unit !== 'dollars' ? metric.unit : ''}
            </p>
            <div className="mt-2">
              <Badge variant={metric.progress >= 90 ? 'default' : 'secondary'}>
                {metric.progress}% Complete
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
