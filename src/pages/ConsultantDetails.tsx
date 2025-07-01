
import { useParams } from "react-router-dom";
import { useConsultant } from "@/hooks/useConsultantAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultantHeader } from "@/components/consultant-details/ConsultantHeader";
import { MainInformationSection } from "@/components/consultant-details/MainInformationSection";
import { ContactTab } from "@/components/consultant-details/ContactTab";
import { PersonalTab } from "@/components/consultant-details/PersonalTab";
import { CFSInformationTab } from "@/components/consultant-details/CFSInformationTab";
import { LineageTab } from "@/components/consultant-details/LineageTab";
import { LicensesTab } from "@/components/consultant-details/LicensesTab";
import { PaymentsTab } from "@/components/consultant-details/PaymentsTab";
import { DependentsTab } from "@/components/consultant-details/DependentsTab";

export default function ConsultantDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, error } = useConsultant(id ?? null);
  
  const consultant = response?.data;
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return <div>Error: Consultant not found.</div>;
  }

  return (
    <div className="space-y-6">
      <ConsultantHeader consultant={consultant} consultantId={id!} />
      
      <MainInformationSection consultant={consultant} />

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="cfs">CFS Information</TabsTrigger>
          <TabsTrigger value="lineage">Lineage</TabsTrigger>
          <TabsTrigger value="dependents">Dependents</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <ContactTab consultant={consultant} />
        </TabsContent>

        <TabsContent value="personal">
          <PersonalTab consultant={consultant} />
        </TabsContent>

        <TabsContent value="cfs">
          <CFSInformationTab consultant={consultant} />
        </TabsContent>

        <TabsContent value="lineage">
          <LineageTab 
            consultant={consultant}
          />
        </TabsContent>

        <TabsContent value="dependents">
          <DependentsTab consultantId={id!} />
        </TabsContent>

        <TabsContent value="licenses">
          <LicensesTab consultantId={id!} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab consultantId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
