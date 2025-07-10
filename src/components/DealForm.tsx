
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateDeal, useUpdateDeal } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";

type DealStage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";

interface DealFormProps {
  deal?: any;
  onClose?: () => void;
}

export function DealForm({ deal, onClose }: DealFormProps) {
  const [formData, setFormData] = useState({
    title: deal?.title || "",
    amount: deal?.amount?.toString() || "",
    expected_close_date: deal?.expected_close_date || "",
    contact_id: deal?.contact_id || "",
    stage: (deal?.stage || "Lead") as DealStage,
    probability: deal?.probability?.toString() || "",
  });

  const { data: contacts } = useContacts();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dealData = {
      title: formData.title,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      expected_close_date: formData.expected_close_date || undefined,
      contact_id: formData.contact_id || undefined,
      stage: formData.stage,
      probability: formData.probability ? parseInt(formData.probability) : undefined,
    };

    if (deal) {
      await updateDeal.mutateAsync({ id: deal.id, ...dealData });
    } else {
      await createDeal.mutateAsync(dealData);
    }
    
    onClose?.();
  };

  const isLoading = createDeal.isPending || updateDeal.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Deal Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="expected_close_date">Expected Close Date</Label>
        <Input
          id="expected_close_date"
          type="date"
          value={formData.expected_close_date}
          onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="stage">Stage</Label>
        <Select
          value={formData.stage}
          onValueChange={(value: DealStage) => setFormData({ ...formData, stage: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lead">Lead</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Proposal">Proposal</SelectItem>
            <SelectItem value="Negotiation">Negotiation</SelectItem>
            <SelectItem value="Closed Won">Closed Won</SelectItem>
            <SelectItem value="Closed Lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="contact_id">Contact</Label>
        <Select
          value={formData.contact_id}
          onValueChange={(value) => setFormData({ ...formData, contact_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a contact" />
          </SelectTrigger>
          <SelectContent>
            {contacts?.map((contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                {contact.first_name} {contact.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
