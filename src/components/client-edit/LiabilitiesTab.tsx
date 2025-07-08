
import { LiabilitiesManagement } from "./LiabilitiesManagement";
import type { Client } from "@/types/mongodb-client";

interface LiabilitiesTabProps {
  client: Client;
  setClient: (client: Client) => void;
}

export function LiabilitiesTab(props: LiabilitiesTabProps) {
  return <LiabilitiesManagement form={undefined} {...props} />;
}
