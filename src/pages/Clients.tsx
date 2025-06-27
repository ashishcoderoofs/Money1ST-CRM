
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientsTable from "@/components/ClientsTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function ClientModal({ open, onClose, client, mode }: any) {
  // For simplicity, just display the client info. In a real app you'd use a form.
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "view" ? "View Client" : "Edit Client"}
          </DialogTitle>
        </DialogHeader>
        <pre className="text-xs bg-muted p-2 rounded max-h-80 overflow-auto">
          {JSON.stringify(client, null, 2)}
        </pre>
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

export default function Clients() {
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modalClient, setModalClient] = useState<any>(null);
  const navigate = useNavigate();

  const handleView = (client: any) => {
    setModalClient(client);
    setShowView(true);
  };
  
  const handleEdit = (client: any) => {
    setModalClient(client);
    setShowEdit(true);
  };
  
  const handleAdd = () => {
    navigate("/securia/clients/new");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-2 py-2">
      <div className="w-full flex justify-center">
        <ClientsTable onEdit={handleEdit} onView={handleView} onAdd={handleAdd} />
        {showView && (
          <ClientModal open={showView} onClose={() => setShowView(false)} client={modalClient} mode="view" />
        )}
        {showEdit && (
          <ClientModal open={showEdit} onClose={() => setShowEdit(false)} client={modalClient} mode="edit" />
        )}
      </div>
    </div>
  );
}
