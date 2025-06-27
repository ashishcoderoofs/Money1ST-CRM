import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tables } from "@/integrations/supabase/types";
import { UseFormReturn } from "react-hook-form";
import { ApplicantTab } from "./ApplicantTab";
import { CoApplicantTab } from "./CoApplicantTab";
import { LiabilitiesTab } from "./LiabilitiesTab";
import { MortgagesTab } from "./MortgagesTab";
import { UnderwritingTab } from "./UnderwritingTab";
import { LoanStatusTab } from "./LoanStatusTab";
import { DriversTab } from "./DriversTab";
import { VehicleCoverageTab } from "./VehicleCoverageTab";
import { HomeownersTab } from "./HomeownersTab";
import { RentersTab } from "./RentersTab";
import { IncomeProtectionTab } from "./IncomeProtectionTab";
import { RetirementTab } from "./RetirementTab";
import { LineageTab } from "./LineageTab";

interface ClientEditTabsProps {
  client: Tables<"clients">;
  form: UseFormReturn<any>;
}

export function ClientEditTabs({ client, form }: ClientEditTabsProps) {
  return (
    <Card className="w-full">
      <Tabs defaultValue="applicant" className="w-full">
        <TabsList className="flex w-full h-auto p-1 bg-gray-100 rounded-lg overflow-x-auto">
          <TabsTrigger 
            value="applicant" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Applicant
          </TabsTrigger>
          <TabsTrigger 
            value="coapplicant" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Co-Applicant
          </TabsTrigger>
          <TabsTrigger 
            value="liabilities" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Liabilities
          </TabsTrigger>
          <TabsTrigger 
            value="mortgages" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Mortgages
          </TabsTrigger>
          <TabsTrigger 
            value="underwriting" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Underwriting
          </TabsTrigger>
          <TabsTrigger 
            value="loanstatus" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Loan Status
          </TabsTrigger>
          <TabsTrigger 
            value="drivers" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Drivers
          </TabsTrigger>
          <TabsTrigger 
            value="vehiclecoverage" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Vehicle Coverage
          </TabsTrigger>
          <TabsTrigger 
            value="homeowners" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Homeowners
          </TabsTrigger>
          <TabsTrigger 
            value="renters" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Renters
          </TabsTrigger>
          <TabsTrigger 
            value="incomeprotection" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Income Protection
          </TabsTrigger>
          <TabsTrigger 
            value="retirement" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Retirement
          </TabsTrigger>
          <TabsTrigger 
            value="lineage" 
            className="flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800"
          >
            Lineage
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-white border border-gray-200 rounded-b-lg mt-2">
          <TabsContent value="applicant" className="p-6 m-0">
            <div className="bg-cyan-400 text-white px-4 py-2 font-semibold rounded-t mb-4">Primary Applicant Information</div>
            <ApplicantTab client={client} form={form} />
          </TabsContent>
          <TabsContent value="coapplicant" className="p-6 m-0">
            <div className="bg-cyan-400 text-white px-4 py-2 font-semibold rounded-t mb-4">Co-Applicant Information</div>
            <CoApplicantTab client={client} form={form} />
          </TabsContent>
          <TabsContent value="liabilities" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Liabilities</div>
            <LiabilitiesTab form={form} />
          </TabsContent>
          <TabsContent value="mortgages" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Mortgages</div>
            <MortgagesTab client={client} />
          </TabsContent>
          <TabsContent value="underwriting" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Underwriting</div>
            <UnderwritingTab client={client} form={form} />
          </TabsContent>
          <TabsContent value="loanstatus" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Loan Status</div>
            <LoanStatusTab client={client} />
          </TabsContent>
          <TabsContent value="drivers" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Drivers</div>
            <DriversTab client={client} />
          </TabsContent>
          <TabsContent value="vehiclecoverage" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Vehicle Coverage</div>
            <VehicleCoverageTab client={client} form={form} />
          </TabsContent>
          <TabsContent value="homeowners" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Homeowners</div>
            <HomeownersTab client={client} />
          </TabsContent>
          <TabsContent value="renters" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Renters</div>
            <RentersTab client={client} />
          </TabsContent>
          <TabsContent value="incomeprotection" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Income Protection</div>
            <IncomeProtectionTab client={client} />
          </TabsContent>
          <TabsContent value="retirement" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Retirement</div>
            <RetirementTab client={client} />
          </TabsContent>
          <TabsContent value="lineage" className="p-6 m-0">
            <div className="bg-gray-700 text-white px-4 py-2 font-semibold rounded-t mb-4">Lineage</div>
            <LineageTab client={client} />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
