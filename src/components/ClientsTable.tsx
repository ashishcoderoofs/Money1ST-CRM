
import { useState } from "react";
import { useClientsQuery } from "@/hooks/clients/useClientsQuery";
import { useDeleteClient } from "@/hooks/clients/useClientMutations";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientsTable({
  onEdit,
  onView,
  onAdd,
}: {
  onEdit: (client: any) => void;
  onView: (client: any) => void;
  onAdd: () => void;
}) {
  const { data: clients = [], isLoading } = useClientsQuery();
  const { mutate: deleteClient, isPending: deleting } = useDeleteClient();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredClients = clients.filter((client: any) => {
    if (
      search &&
      !(
        client.applicant?.toLowerCase().includes(search.toLowerCase()) ||
        client.co_applicant?.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  const handleDelete = (client: any) => {
    if (window.confirm("Delete this client?")) {
      deleteClient(client.id, {
        onSuccess: () => {
          toast.success("Client deleted");
        },
        onError: (err: any) => {
          toast.error(err.message || "Delete failed");
        },
      });
    }
  };

  const handleEdit = (client: any) => {
    navigate(`/securia/clients/${client.id}/edit`);
  };

  return (
    <div
      className="border border-gray-200 bg-white p-4 w-full mt-0"
      style={{ minWidth: 0, marginTop: 0 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-0">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">Client Management</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto justify-end">
          <input
            className="border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicant/co-applicant"
            style={{ minWidth: 220 }}
          />
          <Button
            onClick={onAdd}
            size="sm"
            className="bg-[#1a2233] text-white text-sm font-medium rounded-lg px-4 py-1.5 hover:bg-[#222a3c] transition-all min-w-[150px]"
            style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,.07)" }}
          >
            Add New Client
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">ClientID</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Entry Date</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Email</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Consultant</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Processor</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-600 whitespace-nowrap">Total Debt</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-5 text-center text-gray-500">Loading clients...</td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-5 text-center text-gray-500">No clients found.</td>
              </tr>
            ) : (
              filteredClients.map((client: any, idx: number) => (
                <tr
                  key={client.id}
                  className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 font-mono text-sm uppercase whitespace-nowrap">{String(client.client_number).padStart(7, "0")}</td>
                  <td className="px-4 py-3 font-bold text-[#222a3c] whitespace-nowrap">
                    {client.applicant}
                    <span className="block text-xs font-normal text-gray-500 whitespace-nowrap">{client.co_applicant ?? ""}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${client.status === "Open"
                      ? "bg-[#232c3c] text-white"
                      : "bg-gray-300 text-gray-700"
                    }`}>
                      {client.status === "Open" ? "Active" : client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{client.entry_date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{client.applicant_email ?? <span className="text-xs text-gray-400">-</span>}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{client.consultant_name || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{client.processor_name || "-"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">${Number(client.total_debt ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/securia/clients/${client.id}`)}
                        className="bg-cyan-400 hover:bg-cyan-500 text-white font-semibold px-3 py-1.5 rounded shadow inline-flex items-center justify-center text-xs"
                        title="View"
                        style={{ minWidth: 36, width: 36, height: 36, padding: 0 }}
                      >
                        <Eye size={18} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(client)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-3 py-1.5 rounded shadow inline-flex items-center justify-center text-xs"
                        title="Edit"
                        style={{ minWidth: 36, width: 36, height: 36, padding: 0 }}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(client)}
                        disabled={deleting}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded shadow inline-flex items-center justify-center text-xs"
                        title="Delete"
                        style={{ minWidth: 36, width: 36, height: 36, padding: 0 }}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
