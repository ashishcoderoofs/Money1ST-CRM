import ClientFormTabs from "@/components/client/ClientFormTabs";
import { useParams } from "react-router-dom";
import { useSecuriaClient } from "@/hooks/useSecuriaClients";

export default function SecuriaClientDetails() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data, isLoading } = useSecuriaClient(clientId!);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.data) return <div>Client not found.</div>;

  return (
    <ClientFormTabs mode="view" client={data.data} />
  );
}
