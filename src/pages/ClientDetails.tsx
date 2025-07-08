import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CaseSummaryCard from "@/components/client-details/CaseSummaryCard";
import DetailsTabSection from "@/components/client-details/DetailsTabSection";
import { LiabilitiesViewTable } from "@/components/client-details/LiabilitiesViewTable";
import { MortgagesViewTable } from "@/components/client-details/MortgagesViewTable";
import { VehicleCoverageViewTable } from "@/components/client-details/VehicleCoverageViewTable";
import { HomeownersViewTable } from "@/components/client-details/HomeownersViewTable";
import { RentersViewTable } from "@/components/client-details/RentersViewTable";
import { IncomeProtectionViewTable } from "@/components/client-details/IncomeProtectionViewTable";
import { RetirementViewTable } from "@/components/client-details/RetirementViewTable";
import { LineageViewTable } from "@/components/client-details/LineageViewTable";
import { DriversViewTable } from "@/components/client-details/DriversViewTable";
import PlaceholderTab from "@/components/client-details/PlaceholderTab";
import ClientDetailsSkeleton from "@/components/client-details/ClientDetailsSkeleton";
import { Edit, ArrowLeft } from "lucide-react";
import { useSecuriaClient } from "@/hooks/useSecuriaClients";

export default function ClientDetails() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSecuriaClient(clientId || "");
  const client = data?.data;

  if (isLoading) {
    return <ClientDetailsSkeleton />;
  }
  if (error || !client) {
    return <div className="p-8">Client not found.</div>;
  }

  return (
    <div className="w-full px-6 py-6 space-y-6">
      {/* Header - Same structure as New Client and Edit Mode */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">View Client: {client.clientId || client._id}</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/securia/clients/${client._id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Client
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/securia/clients")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Clients
          </Button>
        </div>
      </div>
      {/* Case Summary */}
      <div className="px-0 w-full">
        <CaseSummaryCard client={client} />
      </div>
      {/* Tabs Navigation */}
      <div className="mt-4">
        <Tabs defaultValue="applicant" className="w-full">
          <TabsList className="flex w-full h-auto p-1 bg-gray-100 rounded-lg overflow-x-auto">
            <TabsTrigger value="applicant" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Applicant</TabsTrigger>
            <TabsTrigger value="coapplicant" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Co-Applicant</TabsTrigger>
            <TabsTrigger value="liabilities" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Liabilities</TabsTrigger>
            <TabsTrigger value="mortgages" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Mortgages</TabsTrigger>
            <TabsTrigger value="underwriting" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Underwriting</TabsTrigger>
            <TabsTrigger value="loanstatus" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Loan Status</TabsTrigger>
            <TabsTrigger value="drivers" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Drivers</TabsTrigger>
            <TabsTrigger value="vehiclecoverage" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Vehicle Coverage</TabsTrigger>
            <TabsTrigger value="homeowners" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Homeowners</TabsTrigger>
            <TabsTrigger value="renters" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Renters</TabsTrigger>
            <TabsTrigger value="incomeprotection" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Income Protection</TabsTrigger>
            <TabsTrigger value="retirement" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Retirement</TabsTrigger>
            <TabsTrigger value="lineage" className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800">Lineage</TabsTrigger>
          </TabsList>
          <div className="bg-white border border-gray-200 rounded-b-lg mt-2">
            <TabsContent value="applicant" className="p-6 m-0">
              <div className="bg-cyan-400 text-white px-4 py-2 font-semibold rounded-t">Primary Applicant Information</div>
              <DetailsTabSection client={client} role="applicant" />
            </TabsContent>
            <TabsContent value="coapplicant" className="p-6 m-0">
              <div className="bg-cyan-400 text-white px-4 py-2 font-semibold rounded-t">Co-Applicant Information</div>
              <DetailsTabSection client={client} role="coapplicant" />
            </TabsContent>
            <TabsContent value="liabilities" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Liabilities</div>
              <LiabilitiesViewTable client={client} />
            </TabsContent>
            <TabsContent value="mortgages" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Mortgages</div>
              <MortgagesViewTable client={client} />
            </TabsContent>
            <TabsContent value="underwriting" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Underwriting</div>
              <PlaceholderTab label="Underwriting" />
            </TabsContent>
            <TabsContent value="loanstatus" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Loan Status</div>
              <PlaceholderTab label="Loan Status" />
            </TabsContent>
            <TabsContent value="drivers" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Drivers</div>
              <DriversViewTable client={client} />
            </TabsContent>
            <TabsContent value="vehiclecoverage" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Vehicle Coverage</div>
              <VehicleCoverageViewTable client={client} />
            </TabsContent>
            <TabsContent value="homeowners" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Homeowners</div>
              <HomeownersViewTable client={client} />
            </TabsContent>
            <TabsContent value="renters" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Renters</div>
              <RentersViewTable client={client} />
            </TabsContent>
            <TabsContent value="incomeprotection" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Income Protection</div>
              <IncomeProtectionViewTable client={client} />
            </TabsContent>
            <TabsContent value="retirement" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Retirement</div>
              <RetirementViewTable client={client} />
            </TabsContent>
            <TabsContent value="lineage" className="p-6 m-0">
              <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t">Lineage</div>
              <LineageViewTable client={client} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
