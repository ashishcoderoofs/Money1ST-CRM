import { useParams, useNavigate } from "react-router-dom";
import ClientForm from "@/components/client/ClientFormTabs";
import { useClient } from "@/hooks/useSecuriaClients";
import React, { useState } from "react";

export default function ClientDetails() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useClient(clientId || "");
  const [mode, setMode] = useState<'view' | 'edit'>("view");
  const [client, setClient] = useState<any>(null);

  React.useEffect(() => {
    if (data?.data) setClient(data.data);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !client) {
    return <div className="p-8">Client not found.</div>;
  }

  const handleSave = (updatedClient: any) => {
    console.log(updatedClient)
    if (updatedClient === 'edit') {
      setMode('edit');
      return;
    }
    setClient(updatedClient);
    setMode("view");
  };
  const handleCancel = () => setMode("view");

  return (
    <div>
      <ClientForm
        mode={mode}
        clientData={client}
        onSave={handleSave}
        onCancel={handleCancel}
        onBack={() => navigate("/securia/clients")}
      />
    </div>
  );
}
