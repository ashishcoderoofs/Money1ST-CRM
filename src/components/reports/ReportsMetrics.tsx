
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, CheckCircle2 } from "lucide-react";

interface ReportsMetricsProps {
  contacts: any[] | undefined;
  deals: any[] | undefined;
  tasks: any[] | undefined;
}

export function ReportsMetrics({ contacts, deals, tasks }: ReportsMetricsProps) {
  const totalContacts = contacts?.length || 0;
  const totalDeals = deals?.length || 0;
  const totalRevenue = deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;
  const closedWonDeals = deals?.filter(deal => deal.stage === 'Closed Won').length || 0;
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  
  const winRate = totalDeals > 0 ? ((closedWonDeals / totalDeals) * 100).toFixed(1) : "0";
  const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            From {totalDeals} deals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{winRate}%</div>
          <p className="text-xs text-muted-foreground">
            {closedWonDeals} of {totalDeals} deals won
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalContacts}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Total in database
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{taskCompletionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {completedTasks} of {totalTasks} completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
