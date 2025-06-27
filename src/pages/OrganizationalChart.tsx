
import { OrgChart } from "@/components/org-chart";
import { TeamHierarchy } from "@/components/org-chart/TeamHierarchy";

export default function OrganizationalChart() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-m1f-primary">Organizational Chart</h2>
        <p className="text-muted-foreground">
          Company structure and hierarchy visualization
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TeamHierarchy />
        <OrgChart />
      </div>
    </div>
  );
}
