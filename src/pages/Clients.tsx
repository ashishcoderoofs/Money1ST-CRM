import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useSecuriaClients, useDeleteClient } from "@/hooks/useSecuriaClients";
import { toast } from "sonner";

function ClientsTable({ onAdd }: any) {
  const { data, isLoading, error } = useSecuriaClients();
  const deleteClientMutation = useDeleteClient();
  const navigate = useNavigate();

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteClientMutation.mutateAsync(id);
      toast.success("Client deleted successfully");
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  const getFullName = (firstName: string, lastName: string) => {
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Client Profiles</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-lg bg-card p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading clients: {error.message}</div>;
  }

  const clients = data?.data || [];

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Profiles</h2>
        <Button onClick={onAdd}>Add New Client</Button>
      </div>
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ClientID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Tolerance</TableHead>
              <TableHead>Entry Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-gray-500">
                    <p className="mb-4">No clients found</p>
                    <Button onClick={onAdd}>Add Your First Client</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell className="font-mono text-xs uppercase">
                    {client.clientId || `CLI${client._id.substring(client._id.length - 6)}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {getFullName(client.firstName, client.lastName)}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {client.financialInfo?.riskTolerance || 'N/A'}
                  </TableCell>
                  <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      className="bg-cyan-500 text-primary-foreground hover:bg-cyan-600"
                      onClick={() => navigate(`/securia/clients/${client._id}`)}
                    >
                      <Eye /> View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-yellow-400 text-secondary-foreground hover:bg-yellow-500"
                      onClick={() => navigate(`/securia/clients/${client._id}/edit`)}
                    >
                      <Pencil /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" disabled={deleteClientMutation.isPending}>
                          <Trash2 /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete the client "{getFullName(client.firstName, client.lastName)}" and all their associated data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(client._id, getFullName(client.firstName, client.lastName))}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={deleteClientMutation.isPending}
                          >
                            {deleteClientMutation.isPending ? "Deleting..." : "Delete Permanently"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function Clients() {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/securia/clients/new");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-2 py-2">
      <div className="w-full flex justify-center">
        <ClientsTable onAdd={handleAdd} />
      </div>
    </div>
  );
}