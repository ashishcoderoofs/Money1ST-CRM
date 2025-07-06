import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactFormDialog } from "@/components/contacts/ContactFormDialog";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { useContacts } from "@/hooks/useContacts";
import { useCreateContact, useUpdateContact, useDeleteContact, ContactFormData } from "@/hooks/useContactMutations";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Plus, Users } from "lucide-react";

export default function Contacts() {
  const { user } = useAuth();
  const { role } = useUserRole(user?.id ?? null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);

  const { data: contacts = [], isLoading: contactsLoading } = useContacts();
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();

  if (!user) {
    return <div className="p-8 text-center">Please log in to view contacts.</div>;
  }

  // Use isAdmin for admin checks
  if (user.isAdmin) {
    // Admin logic here
  }

  const handleCreateContact = async (values: ContactFormData) => {
    try {
      await createMutation.mutateAsync(values);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create contact:", error);
    }
  };

  const handleUpdateContact = async (values: ContactFormData) => {
    if (!editingContact) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingContact.id,
        ...values,
      });
      setEditingContact(null);
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteMutation.mutateAsync(contactId);
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const handleEditContact = (contact: any) => {
    setEditingContact(contact);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Contact Management
          </h2>
          <p className="text-muted-foreground">
            Manage your contacts and relationships
          </p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <ContactsTable
        contacts={contacts}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        isLoading={contactsLoading}
      />

      <ContactFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateContact}
        isLoading={createMutation.isPending}
        title="Create New Contact"
      />

      {editingContact && (
        <ContactFormDialog
          open={!!editingContact}
          onOpenChange={() => setEditingContact(null)}
          onSubmit={handleUpdateContact}
          initialValues={{
            first_name: editingContact.first_name,
            last_name: editingContact.last_name,
            email: editingContact.email || "",
            phone: editingContact.phone || "",
            address: editingContact.address || "",
            notes: editingContact.notes || "",
          }}
          isLoading={updateMutation.isPending}
          title="Edit Contact"
        />
      )}
    </div>
  );
}
