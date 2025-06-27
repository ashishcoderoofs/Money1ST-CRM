
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Clock, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { useDeals } from "@/hooks/useDeals";
import { useTasks } from "@/hooks/useTasks";
import { KPICard } from "@/components/dashboard/KPICard";
import { TeamPerformanceChart } from "@/components/dashboard/TeamPerformanceChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  const { user } = useAuth();
  const { role } = useUserRole(user?.id ?? null);
  const { data: contacts } = useContacts();
  const { data: deals } = useDeals();
  const { data: tasks } = useTasks();

  const activeContacts = contacts?.length ?? 0;
  const openDeals = deals?.length ?? 0;
  const pipelineValue = deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) ?? 0;

  const pendingTasks = tasks?.filter((task: any) => task.status !== 'completed').length ?? 0;
  const completedTasks = tasks?.filter((task: any) => task.status === 'completed').length ?? 0;

  const totalTasks = tasks?.length ?? 0;
  const taskCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-m1f-primary">Dashboard</h1>
        {user && role && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Welcome back, {user.email}</span>
            <Badge variant="outline" className="text-m1f-primary border-m1f-primary">{role}</Badge>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Contacts"
          value={activeContacts}
          subtitle="Total contacts in system"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Pipeline Value"
          value={`$${pipelineValue.toLocaleString()}`}
          subtitle={`${openDeals} open deals`}
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Task Completion"
          value={`${taskCompletion.toFixed(0)}%`}
          subtitle={`${completedTasks}/${totalTasks} completed`}
          icon={CheckCircle2}
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="Monthly Growth"
          value="23%"
          subtitle="Revenue increase"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-8 md:grid-cols-2">
        <TeamPerformanceChart />
        <RecentActivity />
      </div>

      {/* Additional Metrics for Management */}
      <div className="grid gap-8 md:grid-cols-2">
        <KPICard
          title="Team Performance"
          value="87%"
          subtitle="Average team efficiency"
          icon={Target}
          trend={{ value: 7, isPositive: true }}
          className="md:col-span-1"
        />
        <KPICard
          title="Client Satisfaction"
          value="4.8/5"
          subtitle="Based on recent surveys"
          icon={CheckCircle2}
          trend={{ value: 3, isPositive: true }}
          className="md:col-span-1"
        />
      </div>
    </div>
  );
}
