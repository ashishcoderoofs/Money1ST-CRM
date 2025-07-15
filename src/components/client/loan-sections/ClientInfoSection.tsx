import React from 'react';
import type { LoanStatus } from '@/types/loan.types';

interface ClientInfoSectionProps {
  data: Partial<LoanStatus>;
  onUpdate: (updates: Partial<LoanStatus>) => void;
  isReadOnly?: boolean;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ data, onUpdate, isReadOnly }) => {
  return (
    <div className="mb-6">
      <h4 className="text-green-700 font-semibold mb-2">Client Information</h4>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Date In</label>
          <input
            type="date"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.dateIn || ''}
            onChange={e => onUpdate({ dateIn: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Time In</label>
          <input
            type="time"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.timeIn || ''}
            onChange={e => onUpdate({ timeIn: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Mortgage Broker</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.mortgageBroker || ''}
            onChange={e => onUpdate({ mortgageBroker: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Loan Officer</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.loanOfficer || ''}
            onChange={e => onUpdate({ loanOfficer: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Field Trainer</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.fieldTrainer || ''}
            onChange={e => onUpdate({ fieldTrainer: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Referring Agent</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.referringAgent || ''}
            onChange={e => onUpdate({ referringAgent: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">CLW Reviewed</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.clwReviewed || ''}
            onChange={e => onUpdate({ clwReviewed: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">CLW Signed by Client</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.clwSignedByClient || ''}
            onChange={e => onUpdate({ clwSignedByClient: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Pre-Approval Sent</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.preApprovalSent || ''}
            onChange={e => onUpdate({ preApprovalSent: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoSection; 