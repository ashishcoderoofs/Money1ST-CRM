import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesChart } from "@/components/reports/SalesChart";
import { PipelineChart } from "@/components/reports/PipelineChart";
import { TaskChart } from "@/components/reports/TaskChart";
import { ContactsGrowthChart } from "@/components/reports/ContactsGrowthChart";
import { ReportsMetrics } from "@/components/reports/ReportsMetrics";
import { DealsByStageChart } from "@/components/reports/DealsByStageChart";
import { ActivityChart } from "@/components/reports/ActivityChart";
import { ExportTools } from "@/components/reports/ExportTools";

export default function Reports() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-8 text-center">Please log in to view reports.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-m1f-primary">Reports & Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into your CRM performance
        </p>
      </div>

      {/* Export Tools */}
      <ExportTools />

      <ReportsMetrics contacts={[]} deals={[]} tasks={[]} />

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-m1f-light">
          <TabsTrigger value="sales" className="data-[state=active]:bg-m1f-primary data-[state=active]:text-white">Sales</TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-m1f-primary data-[state=active]:text-white">Pipeline</TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-m1f-primary data-[state=active]:text-white">Tasks</TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-m1f-primary data-[state=active]:text-white">Contacts</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-m1f-primary data-[state=active]:text-white">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SalesChart deals={[]} />
            <DealsByStageChart deals={[]} />
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <PipelineChart deals={[]} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <TaskChart tasks={[]} />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <ContactsGrowthChart contacts={[]} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityChart contacts={[]} deals={[]} tasks={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
