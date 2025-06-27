import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Securia() {
  return (
    <div className="space-y-8">
      <div className="bg-gray-800 text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold">SECURIA</h1>
        <p className="text-xl mt-2">Welcome to the Total Financial Solution Portal</p>
        <p className="mt-1">Streamline consultant and client management in one integrated system</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Consultant Management */}
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-sky-700 text-white rounded-t-lg">
            <CardTitle>Consultant Management</CardTitle>
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
            <CardTitle>Client Management</CardTitle>
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
    </div>
  );
}
