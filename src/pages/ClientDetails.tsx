import { useParams } from "react-router-dom";
import ClientForm from "@/components/client/ClientFormTabs";
import { useClient } from "@/hooks/useSecuriaClients";
import React, { useState } from "react";

export default function ClientDetails() {
  const { clientId } = useParams<{ clientId: string }>();
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

  const handleEdit = () => setMode("edit");
  const handleSave = (updatedClient: any) => {
    setClient(updatedClient);
    setMode("view");
  };
  const handleCancel = () => setMode("view");

  return (
    <div>
      <ClientForm
        mode={mode}
        clientData={client}
        onSave={(updatedClient) => handleSave(updatedClient)}
        onCancel={() => handleCancel()}
        onBack={() => {}}
      />
      {mode === "view" && (
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
