
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";

interface NewClientActionsProps {
  isSubmitting: boolean;
}

export function NewClientActions({ isSubmitting }: NewClientActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 justify-center py-6">
      <Button type="submit" disabled={isSubmitting} className="bg-gray-800 hover:bg-gray-900 px-8">
        <Save className="w-4 h-4 mr-1" />
        {isSubmitting ? "Creating..." : "Create Client"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/securia/clients")}
        disabled={isSubmitting}
        className="px-8"
      >
        <X className="w-4 h-4 mr-1" />
        Cancel
      </Button>
    </div>
  );
}
