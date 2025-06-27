
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDependents, useCreateDependent, useUpdateDependent, useDeleteDependent } from "@/hooks/useDependents";
import { Trash2, Plus, Edit, Save, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Dependent = Database["public"]["Tables"]["dependents"]["Row"];

interface DependentsManagerProps {
  consultantId: string;
}

export function DependentsManager({ consultantId }: DependentsManagerProps) {
  const { data: dependents = [], isLoading } = useDependents(consultantId);
  const createDependentMutation = useCreateDependent();
  const updateDependentMutation = useUpdateDependent();
  const deleteDependentMutation = useDeleteDependent();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDependent, setNewDependent] = useState({
    name: "",
    dob: "",
    relationship: "",
  });
  const [editingDependent, setEditingDependent] = useState<Partial<Dependent>>({});

  const handleAdd = () => {
    if (!newDependent.name.trim()) return;
    
    createDependentMutation.mutate({
      consultant_id: consultantId,
      name: newDependent.name,
      dob: newDependent.dob || null,
      relationship: newDependent.relationship || null,
    });
    
    setNewDependent({ name: "", dob: "", relationship: "" });
    setShowAddForm(false);
  };

  const handleEdit = (dependent: Dependent) => {
    setEditingId(dependent.id);
    setEditingDependent({
      name: dependent.name,
      dob: dependent.dob || "",
      relationship: dependent.relationship || "",
    });
  };

  const handleSave = () => {
    if (!editingId || !editingDependent.name?.trim()) return;
    
    updateDependentMutation.mutate({
      id: editingId,
      consultant_id: consultantId,
      name: editingDependent.name,
      dob: editingDependent.dob || null,
      relationship: editingDependent.relationship || null,
    });
    
    setEditingId(null);
    setEditingDependent({});
  };

  const handleDelete = (id: string) => {
    deleteDependentMutation.mutate({ id, consultant_id: consultantId });
  };

  const relationshipOptions = [
    "Spouse", "Child", "Parent", "Sibling", "Other"
  ];

  if (isLoading) {
    return <div>Loading dependents...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dependents</CardTitle>
        <Button
          onClick={() => setShowAddForm(true)}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Dependent
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={newDependent.name}
                  onChange={(e) => setNewDependent({ ...newDependent, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={newDependent.dob}
                  onChange={(e) => setNewDependent({ ...newDependent, dob: e.target.value })}
                />
              </div>
              <div>
                <Label>Relationship</Label>
                <Select onValueChange={(value) => setNewDependent({ ...newDependent, relationship: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((rel) => (
                      <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Add
              </Button>
              <Button onClick={() => setShowAddForm(false)} size="sm" variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {dependents.map((dependent) => (
          <div key={dependent.id} className="border rounded-lg p-4">
            {editingId === dependent.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={editingDependent.name || ""}
                      onChange={(e) => setEditingDependent({ ...editingDependent, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={editingDependent.dob || ""}
                      onChange={(e) => setEditingDependent({ ...editingDependent, dob: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Relationship</Label>
                    <Select onValueChange={(value) => setEditingDependent({ ...editingDependent, relationship: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={editingDependent.relationship || "Select relationship"} />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipOptions.map((rel) => (
                          <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div>
                    <strong>{dependent.name}</strong>
                  </div>
                  <div>
                    {dependent.dob ? new Date(dependent.dob).toLocaleDateString() : "No DOB"}
                  </div>
                  <div>
                    {dependent.relationship || "No relationship specified"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(dependent)} size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(dependent.id)} size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {dependents.length === 0 && !showAddForm && (
          <p className="text-muted-foreground text-center py-4">No dependents added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
