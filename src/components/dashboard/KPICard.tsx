
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, className }: KPICardProps) {
  return (
    <Card className={cn("shadow-m1f border-m1f-primary/20", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-m1f-primary">{title}</CardTitle>
        <Icon className="h-4 w-4 text-m1f-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-m1f-primary">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={cn(
            "text-xs mt-2 flex items-center",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <span className="mr-1">{trend.isPositive ? "↗" : "↘"}</span>
            {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
