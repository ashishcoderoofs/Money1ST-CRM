
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart, LineChart, Users, DollarSign } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesMetricsChart } from "@/components/analytics/SalesMetricsChart";
import { RegionalPerformance } from "@/components/analytics/RegionalPerformance";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-m1f-primary">Analytics & Market Intelligence</h1>
        <p className="text-muted-foreground">Comprehensive business insights</p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value="$1.2M"
          subtitle="This fiscal year"
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
        />
        <KPICard
          title="Market Share"
          value="18.5%"
          subtitle="Regional market position"
          icon={TrendingUp}
          trend={{ value: 4, isPositive: true }}
        />
        <KPICard
          title="Client Acquisition"
          value="156"
          subtitle="New clients this quarter"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Conversion Rate"
          value="73.4%"
          subtitle="Lead to client conversion"
          icon={BarChart3}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 md:grid-cols-2">
        <SalesMetricsChart />
        <RegionalPerformance />
      </div>

      {/* Market Analysis */}
      <Card className="shadow-m1f border-m1f-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-m1f-primary">
            <LineChart className="h-5 w-5" />
            Market Analysis & Competitive Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <h3 className="font-semibold text-m1f-primary mb-2">Market Position</h3>
              <div className="text-2xl font-bold text-green-600">#3</div>
              <p className="text-sm text-muted-foreground">In regional rankings</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-m1f-primary mb-2">Growth Rate</h3>
              <div className="text-2xl font-bold text-blue-600">+27%</div>
              <p className="text-sm text-muted-foreground">Year over year</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-m1f-primary mb-2">Customer Retention</h3>
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <p className="text-sm text-muted-foreground">12-month retention rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
