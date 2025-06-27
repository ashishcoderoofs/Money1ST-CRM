
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NewClientHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Create New Client</h1>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/securia/clients")}
        >
          Back to Clients
        </Button>
      </div>
    </div>
  );
}
