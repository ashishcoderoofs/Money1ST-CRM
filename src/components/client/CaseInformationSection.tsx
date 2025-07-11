import React from 'react';

interface CaseInformationSectionProps {
  clientId: string;
  entryDate: string;
  payoffAmount: number;
  status: string;
  consultantName: string;
  processorName: string;
  isReadOnly: boolean;
  isCreate?: boolean;
  errors?: Record<string, string>;
  handleInputChange: (field: string, value: any) => void;
}

const statusOptions = ['Active', 'Pending', 'Inactive'];
const consultantOptions = ['Select...', 'Consultant A', 'Consultant B', 'Consultant C']; // Replace with dynamic if needed

const CaseInformationSection: React.FC<CaseInformationSectionProps> = ({ clientId, entryDate, payoffAmount, status, consultantName, processorName, isReadOnly, isCreate, errors = {}, handleInputChange }) => (
  <div className=" p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Case Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div>
        <label className="block text-sm font-medium text-black">Client ID *</label>
        <input
          type="text"
          value={isCreate ? 'Auto-Generated' : clientId || ''}
          readOnly
          className="bg-gray-100 flex h-10 w-full rounded-md border border-input px-3 py-2 text-base text-gray-700 md:text-sm"
        />
        {errors.clientId && <div className="text-red-500 text-xs mt-1">{errors.clientId}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-black">Entry Date *</label>
        <input
          type="text"
          value={entryDate ? entryDate.slice(0,10) : ''}
          readOnly
          className="bg-gray-100 flex h-10 w-full rounded-md border border-input px-3 py-2 text-base text-gray-700 md:text-sm"
        />
        {errors.entryDate && <div className="text-red-500 text-xs mt-1">{errors.entryDate}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-black">Payoff Amount</label>
        <input
          type="number"
          value={payoffAmount || 0}
          onChange={e => handleInputChange('payoffAmount', e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        />
        {errors.payoffAmount && <div className="text-red-500 text-xs mt-1">{errors.payoffAmount}</div>}
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
          value={consultantName || ''}
          onChange={e => handleInputChange('consultantName', e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        >
          {consultantOptions.map(opt => <option key={opt} value={opt === 'Select...' ? '' : opt}>{opt}</option>)}
        </select>
        {errors.consultantName && <div className="text-red-500 text-xs mt-1">{errors.consultantName}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium text-black">Processor</label>
        <input
          type="text"
          value={processorName || ''}
          onChange={e => handleInputChange('processorName', e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        />
        {errors.processorName && <div className="text-red-500 text-xs mt-1">{errors.processorName}</div>}
      </div>
    </div>
   
  </div>
);

export default CaseInformationSection; 

/*

variable : 

*/