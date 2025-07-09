import React from 'react';

interface CaseInformationSectionProps {
  client_id: string;
  entry_date: string;
  payoff_amount: number;
  status: string;
  consultant_name: string;
  processor_name: string;
  isReadOnly: boolean;
  isCreate?: boolean;
  errors?: Record<string, string>;
  handleInputChange: (field: string, value: any) => void;
}

const statusOptions = ['Active', 'Pending', 'Inactive'];
const consultantOptions = ['Select...', 'Consultant A', 'Consultant B', 'Consultant C']; // Replace with dynamic if needed

const CaseInformationSection: React.FC<CaseInformationSectionProps> = ({ client_id, entry_date, payoff_amount, status, consultant_name, processor_name, isReadOnly, isCreate, errors = {}, handleInputChange }) => (
  <div className="bg-gray-200 p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Case Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div>
        <label className="block text-sm font-medium text-black">Client ID *</label>
        <input
          type="text"
          value={isCreate ? 'Auto-Generated' : client_id || ''}
          readOnly
          className="bg-gray-100 flex h-10 w-full rounded-md border border-input px-3 py-2 text-base text-gray-700 md:text-sm"
        />
        {errors.client_id && <div className="text-red-500 text-xs mt-1">{errors.client_id}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-black">Entry Date *</label>
        <input
          type="text"
          value={entry_date || ''}
          readOnly
          className="bg-gray-100 flex h-10 w-full rounded-md border border-input px-3 py-2 text-base text-gray-700 md:text-sm"
        />
        {errors.entry_date && <div className="text-red-500 text-xs mt-1">{errors.entry_date}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-black">Payoff Amount</label>
        <input
          type="number"
          value={payoff_amount || 0}
          onChange={e => handleInputChange('payoff_amount', e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        />
        {errors.payoff_amount && <div className="text-red-500 text-xs mt-1">{errors.payoff_amount}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-black">Status</label>
        <select
          value={status || ''}
          onChange={e => handleInputChange('status', e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        >
          {statusOptions.map(opt => <option key={opt} value={opt === 'Select...' ? '' : opt}>{opt}</option>)}
        </select>
        {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-black">Consultant</label>
        <select
          value={consultant_name || ''}
          onChange={e => handleInputChange('consultant_name', e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        >
          {consultantOptions.map(opt => <option key={opt} value={opt === 'Select...' ? '' : opt}>{opt}</option>)}
        </select>
        {errors.consultant_name && <div className="text-red-500 text-xs mt-1">{errors.consultant_name}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-black">Processor</label>
        <input
          type="text"
          value={processor_name || ''}
          onChange={e => handleInputChange('processor_name', e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        />
        {errors.processor_name && <div className="text-red-500 text-xs mt-1">{errors.processor_name}</div>}
      </div>
    </div>
   
  </div>
);

export default CaseInformationSection; 