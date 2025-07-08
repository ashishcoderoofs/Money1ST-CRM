
import { TabsContent } from "@/components/ui/tabs";
import type { Client } from "@/types/mongodb-client";
import { ApplicantTab } from "./ApplicantTab";
import { CoApplicantTab } from "./CoApplicantTab";
import { HouseholdMembersTab } from "./HouseholdMembersTab";
import { LiabilitiesTab } from "./LiabilitiesTab";
import { MortgagesTab } from "./MortgagesTab";
import { UnderwritingTab } from "./UnderwritingTab";
import { NotesTab } from "./NotesTab";
import { LoanStatusTab } from "./LoanStatusTab";
import { DriversTab } from "./DriversTab";
import { VehicleCoverageTab } from "./VehicleCoverageTab";
import { HomeownersTab } from "./HomeownersTab";
import { RentersTab } from "./RentersTab";
import { IncomeProtectionTab } from "./IncomeProtectionTab";
import { RetirementTab } from "./RetirementTab";
import { LineageTab } from "./LineageTab";

interface TabsContentContainerProps {
  client: Client;
  setClient: (client: Client) => void;
}

export function TabsContentContainer({ client, setClient }: TabsContentContainerProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-b-lg mt-2">
      <TabsContent value="applicant" className="p-6 m-0">
        <ApplicantTab client={client} setClient={setClient} />
      </TabsContent>
      
      <TabsContent value="co-applicant" className="p-6 m-0">
        <CoApplicantTab client={client} setClient={setClient} />
      </TabsContent>
      
      <TabsContent value="household-members" className="p-6 m-0">
        <HouseholdMembersTab client={client} setClient={setClient} />
      </TabsContent>
      
      <TabsContent value="liabilities" className="p-6 m-0">
        <LiabilitiesTab client={client} setClient={setClient} />
      </TabsContent>
      
      <TabsContent value="mortgages" className="p-6 m-0">
        <MortgagesTab client={client} />
      </TabsContent>
      
      <TabsContent value="underwriting" className="p-6 m-0">
        <UnderwritingTab client={client} />
      </TabsContent>
      
      <TabsContent value="loanstatus" className="p-6 m-0">
        <LoanStatusTab client={client} />
      </TabsContent>
      
      <TabsContent value="drivers" className="p-6 m-0">
        <DriversTab client={client} />
      </TabsContent>
      
      <TabsContent value="vehiclecoverage" className="p-6 m-0">
        <VehicleCoverageTab client={client} setClient={setClient} />
      </TabsContent>
      
      <TabsContent value="homeowners" className="p-6 m-0">
        <HomeownersTab client={client} />
      </TabsContent>
      
      <TabsContent value="renters" className="p-6 m-0">
        <RentersTab client={client} />
      </TabsContent>
      
      <TabsContent value="incomeprotection" className="p-6 m-0">
        <IncomeProtectionTab client={client} />
      </TabsContent>
      
      <TabsContent value="retirement" className="p-6 m-0">
        <RetirementTab client={client} />
      </TabsContent>
      
      <TabsContent value="lineage" className="p-6 m-0">
        <LineageTab client={client} />
      </TabsContent>
    </div>
  );
}
