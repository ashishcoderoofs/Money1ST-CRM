import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
import type { Client } from "../../types/mongodb-client";

interface ClientEditTabsProps {
  client: Client;
  setClient: (client: Client) => void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
}

export function ClientEditTabs({ client, setClient, isSubmitting, isEditMode = false }: ClientEditTabsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="text-2xl font-semibold leading-none tracking-tight flex items-center justify-between">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-5 h-5 mr-2">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            {isEditMode ? "Edit Client Information" : "New Client Information"}
          </span>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/securia/clients")}
              disabled={isSubmitting}
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <Tabs defaultValue="applicant" className="w-full">
          <TabsList className="items-center rounded-md text-muted-foreground flex flex-wrap w-full gap-1 p-2 h-auto bg-muted/50 justify-start">
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
          
          <TabsContent value="applicant" className="space-y-4 mt-6">
            <ApplicantTab client={client} setClient={setClient} />
          </TabsContent>
          <TabsContent value="coapplicant" className="space-y-4 mt-6">
            <CoApplicantTab client={client} setClient={setClient} />
          </TabsContent>
          <TabsContent value="liabilities" className="space-y-4 mt-6">
            <LiabilitiesTab client={client} setClient={setClient} />
          </TabsContent>
          <TabsContent value="mortgages" className="space-y-4 mt-6">
            <MortgagesTab client={client} />
          </TabsContent>
          <TabsContent value="underwriting" className="space-y-4 mt-6">
            <UnderwritingTab client={client} />
          </TabsContent>
          <TabsContent value="loanstatus" className="space-y-4 mt-6">
            <LoanStatusTab client={client} />
          </TabsContent>
          <TabsContent value="drivers" className="space-y-4 mt-6">
            <DriversTab client={client} />
          </TabsContent>
          <TabsContent value="homeowners" className="space-y-4 mt-6">
            <HomeownersTab client={client} />
          </TabsContent>
          <TabsContent value="renters" className="space-y-4 mt-6">
            <RentersTab client={client} />
          </TabsContent>
          <TabsContent value="incomeprotection" className="space-y-4 mt-6">
            <IncomeProtectionTab client={client} />
          </TabsContent>
          <TabsContent value="retirement" className="space-y-4 mt-6">
            <RetirementTab client={client} />
          </TabsContent>
          <TabsContent value="lineage" className="space-y-4 mt-6">
            <LineageTab client={client} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
