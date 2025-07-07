
import React from "react";

/**
 * Blue header summary card, edge-to-edge, like the reference screenshot.
 * Renders core client info in a two-row grid layout.
 */
export default function CaseSummaryCard({ client }: { client: any }) {
  return (
    <div className="rounded-none mb-0 w-full shadow-sm border-0 bg-white overflow-hidden">
      {/* CASE SUMMARY HEADER */}
      <div className="bg-blue-600 text-white text-lg font-semibold px-4 py-2 border-b-2 border-blue-700">
        Case Summary
      </div>
      {/* CASE SUMMARY TABLE CONTENT */}
      <div className="bg-white pb-1 pt-4 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Entry Date:</span>
            <span className="text-base">{client.entry_date ? new Date(client.entry_date).toLocaleDateString() : "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Client ID:</span>
            <span className="text-base">{client.client_number ?? client._id?.slice(-6).toUpperCase() ?? "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <span className={`inline-block text-xs font-semibold px-2 py-1 rounded border mt-1 ${
              client.status === "Active" 
                ? "bg-green-100 text-green-800 border-green-400"
                : client.status === "Inactive"
                ? "bg-red-100 text-red-800 border-red-400"
                : client.status === "Pending"
                ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                : "bg-gray-100 text-gray-800 border-gray-400"
            }`}>
              {client.status || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Primary Applicant:</span>
            <span className="text-base">
              {client.applicant_first_name || client.applicant_last_name 
                ? `${client.applicant_first_name || ''} ${client.applicant_last_name || ''}`.trim()
                : "N/A"
              }
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Co-Applicant:</span>
            <span className="text-base">
              {client.coapplicant_first_name || client.coapplicant_last_name 
                ? `${client.coapplicant_first_name || ''} ${client.coapplicant_last_name || ''}`.trim()
                : "None"
              }
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Total Debt:</span>
            <span className="text-base">${Number(client.total_debt ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Consultant:</span>
            <span className="text-base">{client.consultant_name || "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Processor:</span>
            <span className="text-base">{client.processor_name || "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Payoff Amount:</span>
            <span className="text-base">${Number(client.payoff_amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
