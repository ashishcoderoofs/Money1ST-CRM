import React from 'react';
import type { LoanStatus } from '@/types/loan.types';

interface LoanBasicInfoProps {
  data: Partial<LoanStatus>;
  onUpdate: (updates: Partial<LoanStatus>) => void;
  isReadOnly?: boolean;
}

const mortgageTypes = [
  { value: 'CONV', label: 'Conventional' },
  { value: 'FHA', label: 'FHA' },
  { value: 'VA', label: 'VA' },
  { value: 'HELOC', label: 'HELOC' },
  { value: 'NON-QM', label: 'Non-QM' },
];

const loanPurposes = [
  { value: 'PURCHASE', label: 'Purchase' },
  { value: 'CASH OUT', label: 'Cash Out' },
  { value: 'RATE/TERM', label: 'Rate/Term' },
  { value: 'IRRRL', label: 'IRRRL' },
  { value: 'STREAMLINE', label: 'Streamline' },
];

const loanStatuses = [
  'Awaiting Submission Docs',
  'Submitted',
  'In Review',
  'Approved',
  'Awaiting Condition Docs',
  'CTC',
  'Closed',
  'Funded',
  'Disbursed',
  'CNH/TUD',
];

const LoanBasicInfo: React.FC<LoanBasicInfoProps> = ({ data, onUpdate, isReadOnly }) => {
  return (
    <div className="mb-6">
      <h4 className="text-green-700 font-semibold mb-2">Basic Loan Information</h4>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Address *</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.address || ''}
            onChange={e => onUpdate({ address: e.target.value })}
            disabled={isReadOnly}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">City *</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.city || ''}
            onChange={e => onUpdate({ city: e.target.value })}
            disabled={isReadOnly}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">State *</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.state || ''}
            onChange={e => onUpdate({ state: e.target.value })}
            disabled={isReadOnly}
            maxLength={2}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Zip Code *</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.zipCode || ''}
            onChange={e => onUpdate({ zipCode: e.target.value })}
            disabled={isReadOnly}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Lender ID *</label>
          <input
            type="text"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.lenderId || ''}
            onChange={e => onUpdate({ lenderId: e.target.value })}
            disabled={isReadOnly}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Loan Amount *</label>
          <input
            type="number"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.loanAmount ?? ''}
            onChange={e => onUpdate({ loanAmount: Number(e.target.value) })}
            disabled={isReadOnly}
            min={0}
            step={0.01}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Mortgage Type *</label>
          <select
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.mortgageType || ''}
            onChange={e => onUpdate({ mortgageType: e.target.value as LoanStatus['mortgageType'] })}
            disabled={isReadOnly}
            required
          >
            <option value="">Select</option>
            {mortgageTypes.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Loan Purpose *</label>
          <select
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.loanPurpose || ''}
            onChange={e => onUpdate({ loanPurpose: e.target.value as LoanStatus['loanPurpose'] })}
            disabled={isReadOnly}
            required
          >
            <option value="">Select</option>
            {loanPurposes.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Loan Status *</label>
          <select
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.loanStatus || ''}
            onChange={e => onUpdate({ loanStatus: e.target.value as LoanStatus['loanStatus'] })}
            disabled={isReadOnly}
            required
          >
            <option value="">Select</option>
            {loanStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Status Date *</label>
          <input
            type="date"
            className="h-8 w-full rounded border-gray-300 px-2"
            value={data.statusDate || ''}
            onChange={e => onUpdate({ statusDate: e.target.value })}
            disabled={isReadOnly}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default LoanBasicInfo; 