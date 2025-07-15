import React from 'react';
import type { LoanStatus } from '@/types/loan.types';

interface ProcessMilestonesProps {
  data: Partial<LoanStatus>;
  onUpdate: (updates: Partial<LoanStatus>) => void;
  isReadOnly?: boolean;
}

const inputClass =
  'h-8 w-full rounded border border-gray-300 bg-white px-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition';
const labelClass = 'block text-gray-800 text-xs font-medium mb-1';

const ProcessMilestones: React.FC<ProcessMilestonesProps> = ({ data, onUpdate, isReadOnly }) => {
  return (
    <div className="border border-green-400 bg-green-50 rounded-lg p-4 shadow-sm mb-6">
      <h4 className="text-center text-green-700 font-semibold mb-3">Process Milestones</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 mb-2">
        <div>
          <label className={labelClass}>Date Credit Pulled</label>
          <input type="date" className={inputClass} value={data.dateCreditPulled || ''} onChange={e => onUpdate({ dateCreditPulled: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Registration Date</label>
          <input type="date" className={inputClass} value={data.registrationDate || ''} onChange={e => onUpdate({ registrationDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <div className="flex-1">
            <label className={labelClass}>AUS/DU Date</label>
            <input type="date" className={inputClass} value={data.ausDuDate || ''} onChange={e => onUpdate({ ausDuDate: e.target.value })} disabled={isReadOnly || data.ausDuDateNA} />
          </div>
          <label className="flex items-center text-xs ml-2">
            <input type="checkbox" className="mr-1" checked={!!data.ausDuDateNA} onChange={e => onUpdate({ ausDuDateNA: e.target.checked })} disabled={isReadOnly} /> N/A
          </label>
        </div>
        <div>
          <label className={labelClass}>Lock Date</label>
          <input type="date" className={inputClass} value={data.lockDate || ''} onChange={e => onUpdate({ lockDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Lock Expiration Date</label>
          <input type="date" className={inputClass} value={data.lockExpirationDate || ''} onChange={e => onUpdate({ lockExpirationDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Lender Disclosures Sent</label>
          <input type="date" className={inputClass} value={data.lenderDisclosuresSent || ''} onChange={e => onUpdate({ lenderDisclosuresSent: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Lender Disclosures Signed</label>
          <input type="date" className={inputClass} value={data.lenderDisclosuresSigned || ''} onChange={e => onUpdate({ lenderDisclosuresSigned: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Broker Disclosures Sent</label>
          <input type="date" className={inputClass} value={data.brokerDisclosuresSent || ''} onChange={e => onUpdate({ brokerDisclosuresSent: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Broker Disclosures Signed</label>
          <input type="date" className={inputClass} value={data.brokerDisclosuresSigned || ''} onChange={e => onUpdate({ brokerDisclosuresSigned: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Loan Submission Date</label>
          <input type="date" className={inputClass} value={data.loanSubmissionDate || ''} onChange={e => onUpdate({ loanSubmissionDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Conditional Approval Received</label>
          <input type="date" className={inputClass} value={data.conditionalApprovalReceived || ''} onChange={e => onUpdate({ conditionalApprovalReceived: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Approval Reviewed with CRM</label>
          <input type="date" className={inputClass} value={data.approvalReviewedWithCrm || ''} onChange={e => onUpdate({ approvalReviewedWithCrm: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Submitted for Final Review</label>
          <input type="date" className={inputClass} value={data.submittedForFinalReview || ''} onChange={e => onUpdate({ submittedForFinalReview: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Cleared to Close Date</label>
          <input type="date" className={inputClass} value={data.clearedToCloseDate || ''} onChange={e => onUpdate({ clearedToCloseDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Closed Date</label>
          <input type="date" className={inputClass} value={data.closedDate || ''} onChange={e => onUpdate({ closedDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Funded Date</label>
          <input type="date" className={inputClass} value={data.fundedDate || ''} onChange={e => onUpdate({ fundedDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Disbursed Date</label>
          <input type="date" className={inputClass} value={data.disbursedDate || ''} onChange={e => onUpdate({ disbursedDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Disbursed Amount</label>
          <input type="number" className={inputClass} value={data.disbursedAmount ?? ''} onChange={e => onUpdate({ disbursedAmount: Number(e.target.value) })} disabled={isReadOnly} min={0} step={0.01} />
        </div>
        <div>
          <label className={labelClass}>Stacked Date</label>
          <input type="date" className={inputClass} value={data.stackedDate || ''} onChange={e => onUpdate({ stackedDate: e.target.value })} disabled={isReadOnly} />
        </div>
        <div>
          <label className={labelClass}>Stacked By</label>
          <input type="text" className={inputClass} value={data.stackedBy || ''} onChange={e => onUpdate({ stackedBy: e.target.value })} disabled={isReadOnly} />
        </div>
      </div>
    </div>
  );
};

export default ProcessMilestones; 