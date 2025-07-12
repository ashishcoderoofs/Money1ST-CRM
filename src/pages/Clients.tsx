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
import { useClients, useDeleteClient } from "@/hooks/useSecuriaClients";
import { toast } from "sonner";
import { useState, useRef } from "react";
import ClientManagementHeader from '@/components/client/ClientManagementHeader';
import { Search } from "lucide-react";
import Loader from '@/components/ui/Loader';

function ClientsTable({ onAdd, data, isSearching, onDeleteSuccess }: any) {
  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: clientsData, isLoading, error } = useClients({ page, limit });
  const deleteClientMutation = useDeleteClient();
  const navigate = useNavigate();

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteClientMutation.mutateAsync(id);
      toast.success("Client deleted successfully");
      if (onDeleteSuccess) onDeleteSuccess(id);
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  const getFullName = (client: any) => {
    return [client.applicant?.firstName, client.applicant?.lastName].filter(Boolean).join(" ") || "N/A";
  };

  const getBadgeVariant = (status: string | undefined) => {
    if (!status) return 'secondary';
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

  const clients = data || clientsData?.data || [];
  const pagination = clientsData?.pagination || { page: 1, pages: 1, total: 0 };

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
              <TableHead>Client ID</TableHead>
              <TableHead>Entry Date</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Co-Applicant</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead>Processor</TableHead>
              <TableHead>Total Debt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="text-gray-500">
                    <p className="mb-4">No clients found</p>
                    <Button onClick={onAdd}>Add Your First Client</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client: any) => (
                <TableRow key={client.clientId}>
                  <TableCell className="font-mono text-xs uppercase">{client.clientId}</TableCell>
                  <TableCell>{client.entryDate ? new Date(client.entryDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{client.applicantName || 'N/A'}</TableCell>
                  <TableCell>{client.coApplicantName || 'N/A'}</TableCell>
                  <TableCell>{client.consultant || client.consultant_name || 'N/A'}</TableCell>
                  <TableCell>{client.processor || client.processor_name || 'N/A'}</TableCell>
                  <TableCell>{client.totalDebt !== undefined ? client.totalDebt : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(client.status)}>
                      {client.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" className="bg-cyan-500 text-primary-foreground hover:bg-cyan-600" onClick={() => navigate(`/securia/clients/${client.clientId}`)}>
                      <Eye /> View
                    </Button>
                    <Button size="sm" className="bg-yellow-400 text-secondary-foreground hover:bg-yellow-500" onClick={() => navigate(`/securia/clients/${client.clientId}/edit`)}>
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
                            This action will permanently delete the client "{client.applicantName || 'N/A'}" and all their associated data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(client.clientId || client._id, client.applicantName || 'N/A')}
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
      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-4 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={pagination.page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {pagination.page} of {pagination.pages}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
          disabled={pagination.page >= pagination.pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function Clients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleAdd = () => {
    navigate("/securia/clients/new");
  };

  const handleRemoveFromSearchResults = (id: string) => {
    setSearchResults(results => results.filter(client => (client.clientId || client._id) !== id));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/clients/search?query=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSearchResults(data.data || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  return (
    <div>
      <ClientManagementHeader />
      <div className="flex flex-col items-center justify-start min-h-screen w-full px-2 py-2">
        <div className="w-full max-w-3xl mx-auto mb-6">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="w-full border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search by Client ID, Applicant Name, or Consultant"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="w-full flex justify-center">
          {isSearching ? (
            <Loader />
          ) : (
            <ClientsTable onAdd={handleAdd} data={search ? searchResults : undefined} isSearching={isSearching} onDeleteSuccess={handleRemoveFromSearchResults} />
          )}
        </div>
      </div>
    </div>
  );
}