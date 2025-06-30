import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';

import { 
  Users, 
  DollarSign, 
  Eye, 
  CheckCircle2, 
  Plus, 
  FileText, 
  BarChart3, 
  AlertTriangle,
  Database,
  Shield,
  Activity,
  Clock
} from "lucide-react";

export default function ModernDashboard() {
  const { user } = useAuth();
  const { role } = useUserRole(user?.id ?? null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Active Clients",
      value: "0",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-blue-100"
    },
    {
      title: "Total Revenue",
      value: "$0",
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "bg-green-100"
    },
    {
      title: "New Prospects",
      value: "0",
      change: "+24%",
      changeType: "positive" as const,
      icon: Eye,
      color: "bg-purple-100"
    },
    {
      title: "Pending Tasks",
      value: "0",
      change: "-5%",
      changeType: "negative" as const,
      icon: CheckCircle2,
      color: "bg-orange-100"
    }
  ];

  const quickActions = [
    {
      title: "Add Client",
      icon: Plus,
      action: () => window.location.href = "/securia/clients/new"
    },
    {
      title: "Create FNA",
      icon: FileText,
      action: () => window.location.href = "/fna-training"
    },
    {
      title: "Generate Report",
      icon: BarChart3,
      action: () => window.location.href = "/reports"
    },
    {
      title: "View Analytics",
      icon: BarChart3,
      action: () => window.location.href = "/analytics"
    }
  ];

  const systemAlerts = [
    {
      type: "warning",
      title: "Data Backup",
      message: "Last backup was 3 days ago",
      icon: AlertTriangle
    },
    {
      type: "info",
      title: "System Update",
      message: "New features available",
      icon: Activity
    },
    {
      type: "success",
      title: "Performance",
      message: "All systems operational",
      icon: CheckCircle2
    }
  ];

  const systemStatus = [
    {
      service: "Database",
      status: "Online",
      statusColor: "text-green-600"
    },
    {
      service: "API Services",
      status: "Healthy",
      statusColor: "text-green-600"
    },
    {
      service: "Backup Status",
      status: "Pending",
      statusColor: "text-orange-500"
    },
    {
      service: "Security",
      status: "Secure",
      statusColor: "text-green-600"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <div className="space-y-8">
      {/* Header with Time and Tabs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-m1f-primary">Home Dashboard</h1>
            {user && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Welcome back, admin. Here's your overview for today.</span>
                {role && (
                  <Badge variant="outline" className="text-m1f-primary border-m1f-primary">
                    {role}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Current Time Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-m1f-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <>
          {/* KPI Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="shadow-m1f border-m1f-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-m1f-primary">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-m1f-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-m1f-primary">{stat.value}</div>
                  <p className={`text-xs ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Quick Actions */}
            <Card className="shadow-m1f border-m1f-primary/20">
              <CardHeader>
                <CardTitle className="text-m1f-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Button
                      key={action.title}
                      variant="outline"
                      className="h-20 flex flex-col items-center space-y-2"
                      onClick={action.action}
                    >
                      <action.icon className="h-6 w-6 text-m1f-primary" />
                      <span className="text-sm">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="shadow-m1f border-m1f-primary/20">
              <CardHeader>
                <CardTitle className="text-m1f-primary">System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        alert.type === 'warning' ? 'bg-orange-100' :
                        alert.type === 'info' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <alert.icon className={`h-4 w-4 ${
                          alert.type === 'warning' ? 'text-orange-600' :
                          alert.type === 'info' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-m1f-primary">
                          {alert.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Recent Activity */}
            <Card className="shadow-m1f border-m1f-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-m1f-primary">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-m1f-primary">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="p-4 rounded-full bg-gray-100 mb-4">
                    <Activity className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    No recent activities
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Activity will appear here as you use the system
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="shadow-m1f border-m1f-primary/20">
              <CardHeader>
                <CardTitle className="text-m1f-primary">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemStatus.map((service) => (
                    <div key={service.service} className="flex items-center justify-between">
                      <span className="text-sm text-m1f-primary">{service.service}</span>
                      <span className={`text-sm font-medium ${service.statusColor}`}>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Modules */}
          <Card className="shadow-m1f border-m1f-primary/20">
            <CardHeader>
              <CardTitle className="text-m1f-primary">System Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Button variant="outline" className="h-16 flex flex-col space-y-1" onClick={() => window.location.href = "/organizational-chart"}>
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Org Chart</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col space-y-1" onClick={() => window.location.href = "/dashboard"}>
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Dashboard</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col space-y-1" onClick={() => window.location.href = "/securia"}>
                  <Shield className="h-5 w-5" />
                  <span className="text-xs">Securia</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col space-y-1" onClick={() => window.location.href = "/analytics"}>
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Analytics</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col space-y-1" onClick={() => window.location.href = "/branch-development"}>
                  <Activity className="h-5 w-5" />
                  <span className="text-xs">Branch Dev</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col space-y-1" onClick={() => window.location.href = "/fna-training"}>
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">FNA Training</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Clients Tab Content */}
      {activeTab === 'clients' && (
        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader>
            <CardTitle className="text-m1f-primary">Client Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Client Management</p>
              <p className="text-sm text-muted-foreground">
                Client-specific content will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader>
            <CardTitle className="text-m1f-primary">Analytics & Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Analytics Dashboard</p>
              <p className="text-sm text-muted-foreground">
                Detailed analytics and reporting tools will be shown here
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Tab Content */}
      {activeTab === 'system' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-m1f border-m1f-primary/20">
            <CardHeader>
              <CardTitle className="text-m1f-primary">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((service) => (
                  <div key={service.service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-m1f-primary">{service.service}</span>
                    <span className={`text-sm font-medium ${service.statusColor}`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-m1f border-m1f-primary/20">
            <CardHeader>
              <CardTitle className="text-m1f-primary">System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Database className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">System Settings</p>
                <p className="text-sm text-muted-foreground">
                  System configuration options will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}