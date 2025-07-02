import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Briefcase, BarChart3, FileText, Video, BookOpen, AlertCircle, LogOut } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSecuriaDashboardStats } from "@/hooks/useSecuriaDashboardStats";
import { useSecuriaSession } from "@/hooks/useSecuriaSession";
import { toast } from "@/hooks/use-toast";

export default function Securia() {
  const { data: statsData, isLoading, error } = useSecuriaDashboardStats();
  const { logoutSecuria } = useSecuriaSession();
  const [showAll, setShowAll] = useState(false);

  const handleSecuriaLogout = async () => {
    try {
      await logoutSecuria();
      toast({
        title: "Logged out of Securia",
        description: "You have been logged out of the Securia portal",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout of Securia",
        variant: "destructive",
      });
    }
  };

  // Show error state if API fails
  if (error && !isLoading) {
    return (
      <div className="p-8">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Dashboard</h3>
              <p className="text-sm text-gray-600 mb-4">
                Could not connect to the Securia API. Please check your connection and try again.
              </p>
              <p className="text-xs text-red-600 mb-4">
                Error: {error.message}
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get stats from API
  const stats = statsData?.data || {
    totalConsultants: 0,
    activeConsultants: 0,
    totalClients: 0,
    activeClients: 0,
    recentActivity: []
  };

  return (
    <div className="space-y-10">
      {/* Header with Date & Time */}
<div className="bg-gray-800 text-white p-8 rounded-lg shadow-md">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    {/* Left - Title & Subtitle */}
    <div>
      <h1 className="text-4xl font-bold tracking-wide">SECURIA Dashboard</h1>
      <p className="text-lg mt-1 text-gray-300">Welcome to the Total Financial Solution Portal</p>
      <p className="text-sm text-gray-400">Streamline consultant and client management in one integrated system</p>
      {isLoading && (
        <p className="text-sm text-gray-300 mt-2">Loading dashboard data...</p>
      )}
    </div>

    {/* Right - Date & Time & Logout */}
    <div className="flex flex-col items-end gap-4">
      {/* Logout Button */}
      <Button
        onClick={handleSecuriaLogout}
        variant="outline"
        size="sm"
        className="bg-red-600 border-red-500 text-white hover:bg-red-700 hover:border-red-600"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout from Securia
      </Button>
      
      {/* Date & Time */}
      <div className="bg-gray-700 rounded-md p-4 text-right shadow-inner">
        <p className="text-sm text-gray-200 font-medium flex items-center justify-end gap-2">
          <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 7V3M16 7V3M3 11h18M5 19h14a2 2 0 002-2V7H3v10a2 2 0 002 2z" />
          </svg>
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="text-sm text-gray-200 font-medium flex items-center justify-end gap-2 mt-1">
          <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 6v6l4 2M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10-10 10z" />
          </svg>
          {new Date().toLocaleTimeString('en-IN')}
        </p>
      </div>
    </div>
  </div>
</div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <Users className="text-sky-700" />
          <div>
            <p className="text-sm text-gray-500">Total Consultants</p>
            <p className="text-xl font-bold text-blue-950">
              {isLoading ? "..." : stats.totalConsultants}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <Briefcase className="text-emerald-600" />
          <div>
            <p className="text-sm text-gray-500">Total Clients</p>
            <p className="text-xl font-bold text-blue-950">
              {isLoading ? "..." : stats.totalClients}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <BarChart3 className="text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Active Consultants</p>
            <p className="text-xl font-bold text-blue-950">
              {isLoading ? "..." : stats.activeConsultants}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <UserPlus className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Active Clients</p>
            <p className="text-xl font-bold text-blue-950">
              {isLoading ? "..." : stats.activeClients}
            </p>
          </div>
        </Card>
      </div>

      {/* Management Cards */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Consultant Management */}
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-sky-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Users size={20} /> Consultant Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col flex-1 justify-between">
            <div>
              <p>Manage consultant profiles with comprehensive information organized in tabs:</p>
              <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                <li>Main information section</li>
                <li>Contact information</li>
                <li>Personal details</li>
                <li>CFS information</li>
                <li>Lineage tracking</li>
              </ul>
              <p className="mt-2">Track dependents, licenses, and payment records for each consultant.</p>
              <div className="mt-4">
                <Progress value={72} className="h-2 bg-gray-200" />
                <p className="text-xs text-gray-500 mt-1">72% profile completion</p>
              </div>
            </div>
            <div className="flex gap-4 pt-8">
              <Button asChild className="flex-1 font-semibold text-base py-6 bg-[#10182D] hover:bg-[#10182D]/90">
                <Link to="/securia/consultants">View All Consultants</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 font-semibold text-base py-6">
                <Link to="/securia/consultants/new">Add New Consultant</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Client Management */}
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Briefcase size={20} /> Client Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col flex-1 justify-between">
            <div>
              <p>Track and efficiently manage client debt resolution with a tabbed interface for organization:</p>
              <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                <li>Applicant information</li>
                <li>Co-applicant details</li>
                <li>Liabilities tracking</li>
                <li>Mortgage information</li>
                <li>Client notes and documentation</li>
              </ul>
              <p className="mt-2">Associate clients with consultants and track financial progress.</p>
              <div className="mt-4">
                <Progress value={54} className="h-2 bg-gray-200" />
                <p className="text-xs text-gray-500 mt-1">54% onboarding progress</p>
              </div>
            </div>
            <div className="flex gap-4 pt-8">
              <Button asChild className="flex-1 font-semibold text-base py-6 bg-[#10182D] hover:bg-[#10182D]/90">
                <Link to="/securia/clients">View All Clients</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 font-semibold text-base py-6">
                <Link to="/securia/clients/new">Create New Client</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
<div className="space-y-4">
  <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
  <Card>
    <CardContent className="pt-6">
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-200">
            {(showAll ? stats.recentActivity : stats.recentActivity.slice(0, 5)).map((activity) => {
              const [mainAction, module] = activity.description.split(" - ");
              const formattedTime = new Date(activity.timestamp).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });

              const icon = {
                consultant_added: "👤",
                client_added: "✅",
                status_changed: "📥",
                dashboard_viewed: "📊",
                reauth_success: "🔐",
              }[activity.type] || "ℹ️";

              return (
                <li key={activity.id} className="flex items-start gap-4 py-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-lg">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {mainAction}
                      {module && (
                        <span className="text-blue-600 font-normal"> - {module}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formattedTime}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {stats.recentActivity.length > 5 && (
            <div className="pt-4 text-center">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showAll ? "View Less" : "View More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center py-4">No recent activity to display</p>
      )}
    </CardContent>
  </Card>
</div>

      {/* Resources Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Quick Resources</h2>
        <ul className="grid md:grid-cols-3 gap-4 text-sm">
          <li className="flex items-center gap-2 bg-gray-100 p-3 rounded-md shadow-sm">
            <BookOpen size={16} className="text-indigo-500" /> 
            <a href="#" className="hover:underline">Consultant Handbook</a>
          </li>
          <li className="flex items-center gap-2 bg-gray-100 p-3 rounded-md shadow-sm">
            <FileText size={16} className="text-green-600" />
            <a href="#" className="hover:underline">Client Intake Form</a>
          </li>
          <li className="flex items-center gap-2 bg-gray-100 p-3 rounded-md shadow-sm">
            <Video size={16} className="text-red-500" />
            <a href="#" className="hover:underline">Training Video Library</a>
          </li>
        </ul>
      </div>
    </div>
  );
}