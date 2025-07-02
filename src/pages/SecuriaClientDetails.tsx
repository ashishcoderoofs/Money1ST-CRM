import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSecuriaClient } from "@/hooks/useSecuriaClients";
import { Edit, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientDetails() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { data: clientResponse, isLoading } = useSecuriaClient(clientId!);
  const client = clientResponse?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!client) {
    return <div className="p-8">Client not found.</div>;
  }

  return (
    <div className="w-full px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">View Client: {client.firstName} {client.lastName}</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/securia/clients/${client._id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Client
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/securia/clients")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Clients
          </Button>
        </div>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="text-sm font-medium">{client.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-sm font-medium">{client.lastName}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Client ID</label>
              <p className="text-sm font-mono font-medium">{client.clientId || `CLI${client._id.slice(-6).toUpperCase()}`}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Created Date</label>
              <p className="text-sm">{new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-600">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm">{client.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-sm">{client.phone}</p>
            </div>
            
            {client.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="text-sm">
                  <p>{client.address.street}</p>
                  <p>{client.address.city}, {client.address.state} {client.address.zipCode}</p>
                  <p>{client.address.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Information */}
        {client.financialInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-purple-600">Financial Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Annual Income</label>
                  <p className="text-sm font-medium">${client.financialInfo.annualIncome?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Net Worth</label>
                  <p className="text-sm font-medium">${client.financialInfo.netWorth?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Risk Tolerance</label>
                <p className="text-sm capitalize">{client.financialInfo.riskTolerance || 'N/A'}</p>
              </div>
              
              {client.financialInfo.investmentGoals && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Investment Goals</label>
                  <p className="text-sm">{client.financialInfo.investmentGoals}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-orange-600">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-sm">{new Date(client.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
