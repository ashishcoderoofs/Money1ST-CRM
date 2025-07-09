import ClientFormTabs from "@/components/client/ClientFormTabs";
import { useParams } from "react-router-dom";
import { useClient } from "@/hooks/useSecuriaClients";
import ClientForm from "@/components/client/ClientFormTabs";

export default function SecuriaClientDetails() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data, isLoading } = useClient(clientId!);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.data) return <div>Client not found.</div>;

  return (
      <ClientForm mode="view" clientData={data.data} />  
    );
}
