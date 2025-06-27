
import { DependentsManager } from "@/components/DependentsManager";

interface DependentsTabProps {
  consultantId: string;
}

export function DependentsTab({ consultantId }: DependentsTabProps) {
  return (
    <div className="mt-4">
      <DependentsManager consultantId={consultantId} />
    </div>
  );
}
