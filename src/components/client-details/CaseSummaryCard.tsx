
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
            <span className="text-base">{client.client_number ?? "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded border border-green-400 mt-1">
              {client.status === "Open" ? "Open" : client.status}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Primary Applicant:</span>
            <span className="text-base">{client.applicant ?? "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Co-Applicant:</span>
            <span className="text-base">{client.co_applicant ?? "None"}</span>
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
            <span className="text-base">$0.00</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Monthly Payment:</span>
            <span className="text-base">$0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
