import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Target, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign,
  Activity,
  FileText,
  BarChart3
} from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { useDeals } from "@/hooks/useDeals";
import { useTasks } from "@/hooks/useTasks";

// Enhanced KPI Card Component
const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  className = "" 
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) => (
  <Card className={`shadow-lg border-2 border-gray-300 hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-gray-50 ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold text-gray-800">
        {title}
      </CardTitle>
      <div className="p-3 rounded-xl bg-gray-100 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-5 w-5 text-gray-700" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-xs text-gray-600 mb-2">{subtitle}</p>
      {trend && (
        <p className={`text-sm font-medium ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.isPositive ? '+' : '-'}{trend.value}% from last month
        </p>
      )}
    </CardContent>
  </Card>
);

// Enhanced Team Performance Chart Component (keeping original chart model)
const TeamPerformanceChart = () => (
  <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
    <CardHeader className="bg-gray-50 border-b">
      <CardTitle className="text-gray-800 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        Team Performance by Role
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      {/* Bar Chart Container */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>20</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full flex items-end justify-between gap-4">
          {[
            { role: "Admin", current: 0, target: 0 },
            { role: "Field Builder", current: 15, target: 20 },
            { role: "Field Trainer", current: 12, target: 15 },
            { role: "Senior BMA", current: 8, target: 10 },
            { role: "BMA", current: 5, target: 8 },
            { role: "IBA", current: 3, target: 5 }
          ].map((item, index) => (
            <div key={item.role} className="flex flex-col items-center flex-1">
              {/* Bars */}
              <div className="flex gap-1 items-end h-48 mb-2">
                {/* Current performance bar (blue) */}
                <div 
                  className="bg-blue-600 w-6 transition-all duration-1000 hover:bg-blue-700"
                  style={{ height: `${(item.current / 20) * 100}%` }}
                ></div>
                {/* Target performance bar (yellow) */}
                <div 
                  className="bg-yellow-400 w-6 transition-all duration-1000 hover:bg-yellow-500"
                  style={{ height: `${(item.target / 20) * 100}%` }}
                ></div>
              </div>
              {/* Role label */}
              <span className="text-xs text-gray-600 text-center font-medium">
                {item.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Enhanced Recent Activity Component
const RecentActivity = () => (
  <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
    <CardHeader className="bg-gray-50 border-b">
      <CardTitle className="text-gray-800 flex items-center gap-2">
        <Activity className="h-5 w-5 text-green-600" />
        Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        {[
          {
            title: "New Client",
            description: "John Doe added as new client",
            time: "2 hours ago",
            status: "success",
            icon: Users
          },
          {
            title: "Mortgage Application",
            description: "Application #1234 submitted",
            time: "4 hours ago",
            status: "pending",
            icon: FileText
          },
          {
            title: "Commission Payment",
            description: "$2,500 commission processed",
            time: "1 day ago",
            status: "success",
            icon: DollarSign
          },
          {
            title: "Training Completed",
            description: "FNA Training Module 1 completed",
            time: "2 days ago",
            status: "info",
            icon: CheckCircle2
          }
        ].map((activity, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className={`p-2 rounded-lg ${
              activity.status === 'success' ? 'bg-green-100' :
              activity.status === 'pending' ? 'bg-yellow-100' :
              activity.status === 'info' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <activity.icon className={`h-4 w-4 ${
                activity.status === 'success' ? 'text-green-600' :
                activity.status === 'pending' ? 'text-yellow-600' :
                activity.status === 'info' ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{activity.title}</p>
              <p className="text-xs text-gray-600">{activity.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">{activity.time}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activity.status === 'success' ? 'bg-green-100 text-green-800' :
                activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                activity.status === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

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
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl"></div>
        <div className="relative p-6 text-white">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          {user && role && (
            <div className="flex items-center gap-3">
              <span className="text-blue-100">Welcome back, {user.email}</span>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {role}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced KPI Cards with Light Black Shading */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Enhanced Charts and Analytics */}
      <div className="grid gap-8 md:grid-cols-2">
        <TeamPerformanceChart />
        <RecentActivity />
      </div>

      {/* Enhanced Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <KPICard
          title="Team Performance"
          value="87%"
          subtitle="Average team efficiency"
          icon={Target}
          trend={{ value: 7, isPositive: true }}
        />
        <KPICard
          title="Client Satisfaction"
          value="4.8/5"
          subtitle="Based on recent surveys"
          icon={CheckCircle2}
          trend={{ value: 3, isPositive: true }}
        />
      </div>
    </div>
  );
}