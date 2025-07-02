
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useCreateMortgage, useUpdateMortgage } from "@/hooks/clients/useMortgages";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import { useMortgageForm } from "@/hooks/useMortgageForm";
import {
  MortgageBasicInfoSection,
  MortgageExistingSection,
  MortgageProposedSection,
  MortgageLoanOptionsSection,
  MortgageFormDialogProps
} from "@/components/mortgage-form";

interface Props extends MortgageFormDialogProps {}

export function MortgageFormDialog({ client, mortgage, isOpen, onClose }: Props) {
  const createMutation = useCreateMortgage();
  const updateMutation = useUpdateMortgage();
  const { formData, updateField } = useMortgageForm(client, mortgage);

  const handleSave = async () => {
    try {
      if (mortgage?.id) {
        await updateMutation.mutateAsync(formData);
        toast.success("Mortgage updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Mortgage created successfully");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save mortgage");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="bg-gray-600 text-white px-4 py-2 rounded">
            📝 Mortgage Form - Edit Selected
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <MortgageBasicInfoSection formData={formData} updateField={updateField} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Existing Mortgages */}
            <MortgageExistingSection formData={formData} updateField={updateField} />

            {/* Right Column - Proposed Loan Section */}
            <MortgageProposedSection formData={formData} updateField={updateField} />
          </div>

          {/* Loan Options Section */}
          <MortgageLoanOptionsSection formData={formData} updateField={updateField} />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              💾 Save Mortgage & Loan Options
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              <X className="w-4 h-4 mr-2" />
              ✖ Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
