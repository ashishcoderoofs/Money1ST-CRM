
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NewClientActionsProps {
  isSubmitting: boolean;
}

export function NewClientActions({ isSubmitting }: NewClientActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-2 justify-end p-6">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/securia/clients")}
        disabled={isSubmitting}
        className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSubmitting ? "Creating..." : "Create Client"}
      </Button>
    </div>
  );
}
