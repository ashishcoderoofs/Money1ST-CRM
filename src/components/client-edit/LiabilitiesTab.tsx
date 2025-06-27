
import { LiabilitiesManagement } from "./LiabilitiesManagement";

interface LiabilitiesTabProps {
  form: any;
}

export function LiabilitiesTab({ form }: LiabilitiesTabProps) {
  return <LiabilitiesManagement form={form} />;
}
