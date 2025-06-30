import { useSecuriaDashboardStats } from "@/hooks/useSecuriaDashboardStats";
import { useSecuriaDashboardCharts } from "@/hooks/useSecuriaDashboardCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SecuriaDashboard() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year">("month");
  
  const { data: statsData, isLoading: statsLoading, error: statsError } = useSecuriaDashboardStats();
  const { data: chartsData, isLoading: chartsLoading, error: chartsError } = useSecuriaDashboardCharts(timeframe);

  console.log("Dashboard Debug:", {
    statsData,
    chartsData,
    statsLoading,
    chartsLoading,
    statsError,
    chartsError
  });

  if (statsLoading || chartsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (statsError || chartsError) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Using Mock Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Dashboard endpoints are not available yet. Displaying sample data.
              </p>
              <p className="text-xs text-red-600">
                Error: {(statsError || chartsError)?.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = statsData?.data;
  const charts = chartsData?.data;

  return (
    <div className="p-8 space-y-6">
      {/* Debug Info - Remove in production */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Debug Info:</strong> Data loaded successfully. Stats: {stats ? 'Available' : 'No data'}, Charts: {charts ? 'Available' : 'No data'}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Securia Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/securia/consultants">Manage Consultants</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/securia/clients">Manage Clients</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalConsultants || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeConsultants || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeClients || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.monthlyGrowth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.monthlyGrowth || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Growth rate this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentActivity?.length ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {activity.type.replace('_', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <div className="flex gap-2">
              {["week", "month", "quarter", "year"].map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf as typeof timeframe)}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Consultant Growth</h4>
                <div className="space-y-2">
                  {charts?.consultantGrowth?.length ? charts.consultantGrowth.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.period}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No growth data available</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Client Growth</h4>
                <div className="space-y-2">
                  {charts?.clientGrowth?.length ? charts.clientGrowth.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.period}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No growth data available</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Revenue by Consultant</h4>
                <div className="space-y-2">
                  {charts?.revenueByConsultant?.length ? charts.revenueByConsultant.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.consultantName}</span>
                      <span className="font-medium">${item.revenue.toLocaleString()}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No revenue data available</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Clients by Risk Tolerance</h4>
                <div className="space-y-2">
                  {charts?.clientsByRiskTolerance?.length ? charts.clientsByRiskTolerance.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="capitalize">{item.riskLevel}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No risk tolerance data available</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}