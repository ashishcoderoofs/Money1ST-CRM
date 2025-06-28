import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Briefcase, BarChart3, FileText, Video, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Securia() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold">SECURIA</h1>
        <p className="text-xl mt-2">Welcome to the Total Financial Solution Portal</p>
        <p className="mt-1">Streamline consultant and client management in one integrated system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <Users className="text-sky-700" />
          <div>
            <p className="text-sm text-gray-500">Total Consultants</p>
            <p className="text-xl font-bold text-blue-950">0</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <Briefcase className="text-emerald-600" />
          <div>
            <p className="text-sm text-gray-500">Total Clients</p>
            <p className="text-xl font-bold text-blue-950">0</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <BarChart3 className="text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Active Consultants</p>
            <p className="text-xl font-bold text-blue-950">0</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <UserPlus className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">New This Week</p>
            <p className="text-xl font-bold text-blue-950">0</p>
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

      {/* 🔽 Bottom Section 🔽 */}

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
        <ul className="bg-white p-4 rounded-md shadow-sm space-y-2 text-sm">
          <li>👤 John added a new client: Anna Smith <span className="text-gray-400">(2 hours ago)</span></li>
          <li>✅ Consultant Michael updated his CFS details <span className="text-gray-400">(Today)</span></li>
          <li>📥 New application submitted by Emily Jones <span className="text-gray-400">(Yesterday)</span></li>
        </ul>
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
