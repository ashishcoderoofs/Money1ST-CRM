import React, { useEffect } from 'react';

interface LiabilitiesSectionProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  isReadOnly: boolean;
  clientId: string; // <-- Add clientId prop
}

const liabilityFields = [
  { key: 'debtor', label: 'Debtor', type: 'text' },
  { key: 'debtName', label: 'Debt Name', type: 'text' },
  { key: 'balance', label: 'Balance', type: 'number' },
  { key: 'payment', label: 'Payment', type: 'number' },
  { key: 'payOff', label: 'Pay Off', type: 'checkbox' },
  { key: 'propertyAddress', label: 'Property Address', type: 'text' },
  { key: 'propertyValue', label: 'Property Value', type: 'number' },
  { key: 'grossRent', label: 'Gross Rent', type: 'number' },
  { key: 'escrow', label: 'Escrow', type: 'text' },
  { key: 'taxes', label: 'Taxes', type: 'number' },
  { key: 'hoi', label: 'HOI', type: 'number' },
  { key: 'netRent', label: 'Net Rent', type: 'number' },
];

const LiabilitiesSection: React.FC<LiabilitiesSectionProps> = ({ formData, setFormData, isReadOnly, clientId }) => {
  const liabilities = formData.liabilities || [];

  // Add one empty row by default on mount if none exist
  useEffect(() => {
    if (!liabilities || liabilities.length === 0) {
      setFormData((prev: any) => ({
        ...prev,
        liabilities: [
          {
            clientId,
            debtor: '', debtName: '', balance: '', payment: '', payOff: false, propertyAddress: '', propertyValue: '', grossRent: '', escrow: '', taxes: '', hoi: '', netRent: '', totalEsc: '0'
          }
        ]
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLiabilityChange = (idx: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = [...(prev.liabilities || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      // Always recalculate totalEsc
      if (field === 'taxes' || field === 'hoi') {
        const taxes = Number(updated[idx].taxes) || 0;
        const hoi = Number(updated[idx].hoi) || 0;
        updated[idx].totalEsc = (taxes + hoi).toString();
      }
      return { ...prev, liabilities: updated };
    });
  };

  const handleDeleteLiability = (idx: number) => {
    setFormData((prev: any) => {
      const updated = [...(prev.liabilities || [])];
      updated.splice(idx, 1);
      return { ...prev, liabilities: updated };
    });
  };

  // Calculate totals
  const totalBalance = liabilities.reduce((sum, l) => sum + (parseFloat(l.balance) || 0), 0);
  const totalPayment = liabilities.reduce((sum, l) => sum + (parseFloat(l.payment) || 0), 0);
  const payoffTotal = liabilities.reduce((sum, l) => sum + ((l.payOff ? (parseFloat(l.balance) || 0) : 0)), 0);
  const currency = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-blue-100 p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-blue-800 text-xl">Liabilities Information</h3>
        {!isReadOnly && (
          <button
            type="button"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-base font-semibold flex items-center gap-2"
            onClick={() => {
              setFormData((prev: any) => ({
                ...prev,
                liabilities: [
                  ...(prev.liabilities || []),
                  {
                    clientId, debtor: '', debtName: '', balance: '', payment: '', payOff: false, propertyAddress: '', propertyValue: '', grossRent: '', escrow: '', taxes: '', hoi: '', netRent: '', totalEsc: '0'
                  }
                ]
              }));
            }}
          >
            <span className="text-xl font-bold">+</span> Add Row
          </button>
        )}
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm align-middle rounded-lg overflow-hidden border border-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-1 py-3 w-24 text-center align-bottom text-base font-semibold text-blue-900 border-b border-gray-200">Client#</th>
              {liabilityFields.map(f => (
                <th key={f.key} className="px-1 py-3 w-24 text-center align-bottom text-base font-semibold text-blue-900 border-b border-gray-200">{f.label}</th>
              ))}
              <th className="px-1 py-3 w-20 text-center align-bottom text-base font-semibold text-blue-900 border-b border-gray-200">Total Esc.</th>
              <th className="px-1 py-3 w-20 text-center align-bottom text-base font-semibold text-blue-900 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {liabilities.map((liability: any, idx: number) => (
              <tr key={idx} className="bg-white border-b border-gray-200">
                <td className="px-1 w-24 text-left text-sm text-blue-900">{clientId}</td>
                {liabilityFields.map(f => (
                  <td key={f.key} className="px-1 w-24 text-left text-sm">
                    {f.key === 'debtor' ? (
                      <select
                        className="border rounded px-1 py-2 w-full text-sm bg-white"
                        value={liability.debtor || ''}
                        onChange={e => handleLiabilityChange(idx, 'debtor', e.target.value)}
                        disabled={isReadOnly}
                      >
                        <option value="">Select</option>
                        <option value="Applicant">Applicant</option>
                        <option value="Co-Applicant">Co-Applicant</option>
                        <option value="Joint">Joint</option>
                      </select>
                    ) : f.key === 'escrow' ? (
                      <select
                        className="border rounded px-1 py-2 w-full text-sm bg-white"
                        value={liability.escrow || ''}
                        onChange={e => handleLiabilityChange(idx, 'escrow', e.target.value)}
                        disabled={isReadOnly}
                      >
                        <option value="">Type</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Partial">Partial</option>
                      </select>
                    ) : f.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={!!liability[f.key]}
                        onChange={e => handleLiabilityChange(idx, f.key, e.target.checked)}
                        disabled={isReadOnly}
                        className="w-5 h-5 w-24 mx-auto"
                      />
                    ) : (
                      <input
                        type={f.type}
                        placeholder={f.label}
                        className="border rounded px-1 py-2 w-full text-sm bg-white"
                        value={liability[f.key] || ''}
                        onChange={e => handleLiabilityChange(idx, f.key, e.target.value)}
                        disabled={isReadOnly}
                      />
                    )}
                  </td>
                ))}
                <td className="px-1 font-semibold text-blue-700 w-20 text-right">
                  <span className="block text-sm">{currency(Number(liability.taxes || 0) + Number(liability.hoi || 0))}</span>
                </td>
                <td className="px-1 w-20 text-center">
                  {!isReadOnly && (
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      onClick={() => handleDeleteLiability(idx)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {/* Totals row directly below Balance and Payment */}
            <tr className="bg-blue-50">
              <td className="px-1 text-right text-sm text-blue-900 font-semibold" colSpan={liabilityFields.findIndex(f => f.key === 'balance') + 1}>Totals:</td>
              <td className="px-1 text-right text-blue-700 text-sm font-normal">{currency(totalBalance)}</td>
              <td className="px-1 text-right text-blue-700 text-sm font-normal">{currency(totalPayment)}</td>
              {/* Empty cells for other columns */}
              {liabilityFields.slice(liabilityFields.findIndex(f => f.key === 'payment') + 1).map((_, i) => <td key={i} className="px-1"></td>)}
              <td className="px-1"></td>
            </tr>
            {/* Payoff Total row directly below Balance total */}
            <tr className="bg-green-50">
              <td className="px-1" colSpan={liabilityFields.findIndex(f => f.key === 'balance')}> </td>
              <td className="px-1 text-green-700 text-right font-semibold">Payoff Total:</td>
              <td className="px-1 text-green-700 text-right font-semibold">{currency(payoffTotal)}</td>
              {/* Empty cells for the rest of the row */}
              {liabilityFields.slice(liabilityFields.findIndex(f => f.key === 'balance') + 1).map((_, i) => <td key={i} className="px-1"></td>)}
              <td className="px-1"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-900">
        <b>Information:</b> Total Escrow automatically calculates as Taxes + HOI for each row
      </div>
    </div>
  );
};

export default LiabilitiesSection; 