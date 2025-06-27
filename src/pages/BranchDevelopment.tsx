
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrowthMetrics } from "@/components/branch-development/GrowthMetrics";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Users, TrendingUp } from "lucide-react";

export default function BranchDevelopment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-m1f-primary">Branch Development</h2>
          <p className="text-muted-foreground">
            Strategic expansion and growth management tools
          </p>
        </div>
        <Button className="bg-m1f-primary hover:bg-m1f-dark">
          <Plus className="h-4 w-4 mr-2" />
          New Branch Plan
        </Button>
      </div>

      {/* Growth Metrics */}
      <GrowthMetrics />

      {/* Development Strategy Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-m1f-primary">
              <MapPin className="h-5 w-5" />
              Territory Expansion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Strategic analysis of new market opportunities and expansion potential.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Target Markets</span>
                <span className="font-semibold">8 identified</span>
              </div>
              <div className="flex justify-between">
                <span>Market Research</span>
                <span className="font-semibold">6 completed</span>
              </div>
              <div className="flex justify-between">
                <span>Feasibility Studies</span>
                <span className="font-semibold">3 in progress</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-m1f-primary">
              <Users className="h-5 w-5" />
              Team Building
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Recruitment and development strategies for expanding teams.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Open Positions</span>
                <span className="font-semibold">12 active</span>
              </div>
              <div className="flex justify-between">
                <span>Applications</span>
                <span className="font-semibold">47 received</span>
              </div>
              <div className="flex justify-between">
                <span>Interviews Scheduled</span>
                <span className="font-semibold">15 pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-m1f-primary">
              <TrendingUp className="h-5 w-5" />
              Performance Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Monitor and optimize branch performance metrics and KPIs.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Avg. Branch Revenue</span>
                <span className="font-semibold">$85K/month</span>
              </div>
              <div className="flex justify-between">
                <span>Top Performer</span>
                <span className="font-semibold">North Branch</span>
              </div>
              <div className="flex justify-between">
                <span>Growth Target</span>
                <span className="font-semibold">25% YoY</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
