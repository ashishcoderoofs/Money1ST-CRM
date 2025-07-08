
import React from "react";

/**
 * Blue header summary card, edge-to-edge, like the reference screenshot.
 * Renders core client info in a two-row grid layout.
 */
export default function CaseSummaryCard({ client }: { client: any }) {
  // Helper to show N/A for missing values
  const showNA = (val: any) => (val === undefined || val === null || val === "" ? "N/A" : val);
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
            <span className="text-base">{client.entryDate ? new Date(client.entryDate).toLocaleDateString() : "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Client ID:</span>
            <span className="text-base">{showNA(client.clientId || (client._id ? client._id.slice(-6).toUpperCase() : undefined))}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <span className={`inline-block text-xs font-semibold px-2 py-1 rounded border mt-1 ${
              client.status === "active" || client.status === "Active"
                ? "bg-green-100 text-green-800 border-green-400"
                : client.status === "inactive" || client.status === "Inactive"
                ? "bg-red-100 text-red-800 border-red-400"
                : client.status === "pending" || client.status === "Pending"
                ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                : "bg-gray-100 text-gray-800 border-gray-400"
            }`}>
              {showNA(client.status)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Primary Applicant:</span>
            <span className="text-base">
              {client.applicant?.firstName || client.applicant?.lastName
                ? `${showNA(client.applicant?.firstName)} ${showNA(client.applicant?.lastName)}`.trim()
                : "N/A"
              }
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Co-Applicant:</span>
            <span className="text-base">
              {client.coApplicant?.firstName || client.coApplicant?.lastName
                ? `${showNA(client.coApplicant?.firstName)} ${showNA(client.coApplicant?.lastName)}`.trim()
                : "None"
              }
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Total Debt:</span>
            <span className="text-base">{client.liabilities && Array.isArray(client.liabilities) && client.liabilities.length > 0
              ? `$${client.liabilities.reduce((sum: number, l: any) => sum + (l.currentBalance || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Consultant:</span>
            <span className="text-base">{showNA(client.consultant)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Processor:</span>
            <span className="text-base">{showNA(client.processor)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Payoff Amount:</span>
            <span className="text-base">{client.payoffAmount !== undefined && client.payoffAmount !== null
              ? `$${Number(client.payoffAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
