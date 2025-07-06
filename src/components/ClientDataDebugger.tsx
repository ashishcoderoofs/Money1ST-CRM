// Debug component to inspect client data in the view
import React from 'react';

export function ClientDataDebugger({ client, label = "Client Data" }: { client: any, label?: string }) {
  return (
    <div className="bg-gray-100 p-4 rounded border mb-4">
      <h3 className="font-bold text-lg mb-2">{label}</h3>
      <details>
        <summary className="cursor-pointer font-semibold">Click to see raw data</summary>
        <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-96">
          {JSON.stringify(client, null, 2)}
        </pre>
      </details>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>ID:</strong> {client?._id || 'N/A'}
        </div>
        <div>
          <strong>Client Number:</strong> {client?.client_number || 'N/A'}
        </div>
        <div>
          <strong>Applicant First Name:</strong> {client?.applicant_first_name || 'N/A'}
        </div>
        <div>
          <strong>Applicant Last Name:</strong> {client?.applicant_last_name || 'N/A'}
        </div>
        <div>
          <strong>Status:</strong> {client?.status || 'N/A'}
        </div>
        <div>
          <strong>Entry Date:</strong> {client?.entry_date || 'N/A'}
        </div>
      </div>
    </div>
  );
}
