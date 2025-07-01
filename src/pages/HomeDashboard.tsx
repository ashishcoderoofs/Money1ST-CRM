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
  Clock,
  TrendingUp,
  Star,
  Zap
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
      color: "bg-gray-100",
      iconColor: "text-gray-700",
      borderColor: "border-gray-300"
    },
    {
      title: "Total Revenue",
      value: "$0",
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "bg-gray-100",
      iconColor: "text-gray-700",
      borderColor: "border-gray-300"
    },
    {
      title: "New Prospects",
      value: "0",
      change: "+24%",
      changeType: "positive" as const,
      icon: Eye,
      color: "bg-gray-100",
      iconColor: "text-gray-700",
      borderColor: "border-gray-300"
    },
    {
      title: "Pending Tasks",
      value: "0",
      change: "-5%",
      changeType: "negative" as const,
      icon: CheckCircle2,
      color: "bg-gray-100",
      iconColor: "text-gray-700",
      borderColor: "border-gray-300"
    }
  ];

  const quickActions = [
    {
      title: "Add Client",
      icon: Plus,
      action: () => window.location.href = "/securia/clients/new",
      color: "hover:bg-blue-50 hover:border-blue-300",
      iconColor: "text-blue-600"
    },
    {
      title: "Create FNA",
      icon: FileText,
      action: () => window.location.href = "/fna-training",
      color: "hover:bg-green-50 hover:border-green-300",
      iconColor: "text-green-600"
    },
    {
      title: "Generate Report",
      icon: BarChart3,
      action: () => window.location.href = "/reports",
      color: "hover:bg-purple-50 hover:border-purple-300",
      iconColor: "text-purple-600"
    },
    {
      title: "View Analytics",
      icon: TrendingUp,
      action: () => window.location.href = "/analytics",
      color: "hover:bg-orange-50 hover:border-orange-300",
      iconColor: "text-orange-600"
    }
  ];

  const systemAlerts = [
    {
      type: "warning",
      title: "Data Backup",
      message: "Last backup was 3 days ago",
      icon: AlertTriangle,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      type: "info",
      title: "System Update",
      message: "New features available",
      icon: Activity,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      type: "success",
      title: "Performance",
      message: "All systems operational",
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    }
  ];

  const systemStatus = [
    {
      service: "Database",
      status: "Online",
      statusColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      service: "API Services",
      status: "Healthy",
      statusColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      service: "Backup Status",
      status: "Pending",
      statusColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      service: "Security",
      status: "Secure",
      statusColor: "text-green-600",
      bgColor: "bg-green-50"
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
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl"></div>
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Home Dashboard</h1>
              </div>
              {user && (
                <div className="flex items-center gap-3">
                  <span className="text-blue-100 text-lg">Welcome back, admin. Here's your overview for today.</span>
                  {role && (
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      <Zap className="h-3 w-3 mr-1" />
                      {role}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {/* Enhanced Time Display */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
                <Clock className="h-5 w-5 text-white" />
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-blue-100">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex space-x-2 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-lg transform scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <>
          {/* Enhanced KPI Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={stat.title} className={`shadow-lg border-2 ${stat.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-gray-50`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-800">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <p className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Enhanced Quick Actions */}
            <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={action.title}
                      variant="outline"
                      className={`h-24 flex flex-col items-center justify-center space-y-2 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${action.color} text-gray-700`}
                      onClick={action.action}
                    >
                      <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                      <span className="text-sm font-medium">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced System Alerts */}
            <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl border ${alert.bgColor} hover:shadow-md transition-all duration-300`}>
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <alert.icon className={`h-5 w-5 ${alert.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {alert.title}
                        </p>
                        <p className="text-xs text-gray-600">
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
            {/* Enhanced Recent Activity */}
            <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Recent Activity
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="p-6 rounded-full bg-gray-100 mb-4">
                    <Activity className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    No recent activities
                  </p>
                  <p className="text-xs text-gray-500">
                    Activity will appear here as you use the system
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced System Status */}
            <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {systemStatus.map((service, index) => (
                    <div key={service.service} className={`flex items-center justify-between p-3 rounded-lg ${service.bgColor} border transition-all duration-300 hover:shadow-sm`}>
                      <span className="text-sm font-medium text-gray-800">{service.service}</span>
                      <span className={`text-sm font-semibold ${service.statusColor}`}>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced System Modules */}
          <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                System Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 border-2 hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-blue-50 hover:border-blue-200 text-gray-700" onClick={() => window.location.href = "/organizational-chart"}>
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="text-xs font-medium">Org Chart</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 border-2 hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-green-50 hover:border-green-200 text-gray-700" onClick={() => window.location.href = "/dashboard"}>
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <span className="text-xs font-medium">Dashboard</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 border-2 hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-purple-50 hover:border-purple-200 text-gray-700" onClick={() => window.location.href = "/securia"}>
                  <Shield className="h-6 w-6 text-purple-600" />
                  <span className="text-xs font-medium">Securia</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 border-2 hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-orange-50 hover:border-orange-200 text-gray-700" onClick={() => window.location.href = "/analytics"}>
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                  <span className="text-xs font-medium">Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 border-2 hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-red-50 hover:border-red-200 text-gray-700" onClick={() => window.location.href = "/branch-development"}>
                  <Activity className="h-6 w-6 text-red-600" />
                  <span className="text-xs font-medium">Branch Dev</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 border-2 hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-indigo-50 hover:border-indigo-200 text-gray-700" onClick={() => window.location.href = "/fna-training"}>
                  <FileText className="h-6 w-6 text-indigo-600" />
                  <span className="text-xs font-medium">FNA Training</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Enhanced Clients Tab Content */}
      {activeTab === 'clients' && (
        <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Client Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-8 rounded-full bg-blue-100 mb-6">
                <Users className="h-16 w-16 text-blue-600" />
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-3">Client Management</p>
              <p className="text-sm text-gray-500">
                Client-specific content will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="bg-purple-50 border-b">
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Analytics & Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-8 rounded-full bg-purple-100 mb-6">
                <Activity className="h-16 w-16 text-purple-600" />
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-3">Analytics Dashboard</p>
              <p className="text-sm text-gray-500">
                Detailed analytics and reporting tools will be shown here
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced System Tab Content */}
      {activeTab === 'system' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {systemStatus.map((service, index) => (
                  <div key={service.service} className={`flex items-center justify-between p-4 rounded-lg ${service.bgColor} border-2 transition-all duration-300 hover:shadow-md`}>
                    <span className="text-sm font-semibold text-gray-800">{service.service}</span>
                    <span className={`text-sm font-bold ${service.statusColor}`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Database className="h-5 w-5 text-gray-600" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-6 rounded-full bg-gray-100 mb-6">
                  <Database className="h-16 w-16 text-gray-600" />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-3">System Settings</p>
                <p className="text-sm text-gray-500">
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