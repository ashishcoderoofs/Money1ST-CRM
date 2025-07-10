import React, { useEffect } from 'react';

interface UnderwritingSectionProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  isReadOnly: boolean;
}

const usStates = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const chmOptions = [
  { value: 'credit', label: 'Credit' },
  { value: 'equity', label: 'Equity' },
  { value: 'ltv', label: 'LTV' },
  { value: 'bankrupt', label: 'Bankrupt' },
  { value: 'no_benefit', label: 'No Benefit' },
  { value: 'suspend_fu_date', label: 'Suspend - FU Date' },
  { value: 'collateral', label: 'Collateral' },
  { value: 'dti', label: 'DTI' }
];

const tudOptions = [
  { value: 'no_interest', label: 'No Interest' },
  { value: 'rate', label: 'Rate' },
  { value: 'terms_payment', label: 'Terms/Payment' },
  { value: 'fee', label: 'Fee' },
  { value: 'no_value', label: 'No Value' },
  { value: 'went_elsewhere', label: 'Went Elsewhere' }
];

const termsOptions = [
  { value: '15_year', label: '15' },
  { value: '20_year', label: '20' },
  { value: '30_year', label: '30' },
  { value: '3_27', label: '3/27' },
  { value: '2_28', label: '2/28' }
];

const programsOptions = [
  { value: 'pay_option_arm', label: 'Pay Option ARM' },
  { value: 'secure_option_arm', label: 'Secure Option ARM' },
  { value: 'interest_only', label: 'Interest Only' },
  { value: 'principle_interest', label: 'Principle Interest' }
];

const UnderwritingSection: React.FC<UnderwritingSectionProps> = ({ formData, setFormData, isReadOnly }) => {
  // Helper to update nested underwriting data
  const updateUnderwritingField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      underwriting: {
        ...prev.underwriting,
        [field]: value
      }
    }));
  };

  const underwriting = formData.underwriting || {};

  // Auto-set client_id when component mounts or formData changes
  useEffect(() => {
    if (formData.clientId && !underwriting.client_id) {
      updateUnderwritingField('client_id', formData.clientId);
    }
  }, [formData.clientId, underwriting.client_id]);

  return (
    <div className="bg-gray-200 border border-purple-400 p-6 rounded-lg">
      <h3 className="font-semibold text-purple-800 text-lg mb-4">Underwriting</h3>
      
      {/* Basic Information Fields */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-purple-800">Client ID</label>
          <input 
            type="text" 
            className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
            placeholder="103" 
            value={formData.clientId || underwriting.client_id || ''} 
            onChange={e => updateUnderwritingField('client_id', e.target.value)} 
            disabled={true} 
            required 
            pattern="^[0-9]+$"
          />
        </div>
        <div>
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-purple-800">Address</label>
          <input 
            type="text" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
            placeholder="Enter Address" 
            value={underwriting.address || ''} 
            onChange={e => updateUnderwritingField('address', e.target.value)} 
            disabled={isReadOnly} 
            minLength={10}
            required 
          />
        </div>
        <div>
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-purple-800">City</label>
          <input 
            type="text" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
            placeholder="Enter City" 
            value={underwriting.city || ''} 
            onChange={e => updateUnderwritingField('city', e.target.value)} 
            disabled={isReadOnly} 
            pattern="^[A-Za-z ]+$"
            required 
          />
        </div>
        <div>
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-purple-800">State</label>
          <select 
            className="flex h-10 w-16 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
            value={underwriting.state || ''} 
            onChange={e => updateUnderwritingField('state', e.target.value)} 
            disabled={isReadOnly} 
            required
          >
            <option value="">IL</option>
            {usStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* CHM and Credit Scores Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* CHM Section */}
        <div className="border border-gray-400 p-4">
          <h4 className="font-medium text-purple-800 mb-3">CHM</h4>
          <div className="space-y-2 text-sm">
            {chmOptions.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="chm_selection"
                  id={`chm_${option.value}`}
                  value={option.value}
                  checked={underwriting.chm_selection === option.value}
                  onChange={e => updateUnderwritingField('chm_selection', e.target.value)}
                  disabled={isReadOnly}
                  className="mr-2"
                />
                <label htmlFor={`chm_${option.value}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Scores Section */}
        <div className="border border-gray-400 p-4">
          <h4 className="font-medium text-purple-800 mb-3">Credit Scores</h4>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-xs">
                <th className="border border-gray-300 p-1 text-left">Bureau</th>
                <th className="border border-gray-300 p-1 text-center">Applicant</th>
                <th className="border border-gray-300 p-1 text-center">Co-Applicant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-1 font-medium text-xs">Equifax</td>
                <td className="border border-gray-300 p-1">
                  <input 
                    type="number" 
                    className="w-16 h-6 text-center text-xs border-0 bg-transparent" 
                    placeholder="300-850" 
                    value={underwriting.equifax_applicant || ''} 
                    onChange={e => updateUnderwritingField('equifax_applicant', e.target.value)} 
                    disabled={isReadOnly} 
                    min={300} 
                    max={850}
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input 
                    type="number" 
                    className="w-16 h-6 text-center text-xs border-0 bg-transparent" 
                    placeholder="300-850" 
                    value={underwriting.equifax_co_applicant || ''} 
                    onChange={e => updateUnderwritingField('equifax_co_applicant', e.target.value)} 
                    disabled={isReadOnly} 
                    min={300} 
                    max={850}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1 font-medium text-xs">Experian</td>
                <td className="border border-gray-300 p-1">
                  <input 
                    type="number" 
                    className="w-16 h-6 text-center text-xs border-0 bg-transparent" 
                    placeholder="300-850" 
                    value={underwriting.experian_applicant || ''} 
                    onChange={e => updateUnderwritingField('experian_applicant', e.target.value)} 
                    disabled={isReadOnly} 
                    min={300} 
                    max={850}
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input 
                    type="number" 
                    className="w-16 h-6 text-center text-xs border-0 bg-transparent" 
                    placeholder="300-850" 
                    value={underwriting.experian_co_applicant || ''} 
                    onChange={e => updateUnderwritingField('experian_co_applicant', e.target.value)} 
                    disabled={isReadOnly} 
                    min={300} 
                    max={850}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1 font-medium text-xs">TransUnion</td>
                <td className="border border-gray-300 p-1">
                  <input 
                    type="number" 
                    className="w-16 h-6 text-center text-xs border-0 bg-transparent" 
                    placeholder="300-850" 
                    value={underwriting.transunion_applicant || ''} 
                    onChange={e => updateUnderwritingField('transunion_applicant', e.target.value)} 
                    disabled={isReadOnly} 
                    min={300} 
                    max={850}
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input 
                    type="number" 
                    className="w-16 h-6 text-center text-xs border-0 bg-transparent" 
                    placeholder="300-850" 
                    value={underwriting.transunion_co_applicant || ''} 
                    onChange={e => updateUnderwritingField('transunion_co_applicant', e.target.value)} 
                    disabled={isReadOnly} 
                    min={300} 
                    max={850}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Notes Field */}
          <div className="mt-3">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-medium text-purple-800">Notes</label>
            <textarea 
              className="w-full h-16 p-1 text-xs border-0 resize-none bg-transparent" 
              placeholder="Enter notes..." 
              value={underwriting.underwriting_notes || ''} 
              onChange={e => updateUnderwritingField('underwriting_notes', e.target.value)} 
              disabled={isReadOnly} 
              maxLength={500}
            />
          </div>

          {/* Dropdown Fields */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-medium text-purple-800">Terms</label>
              <select 
                className="h-7 text-xs w-full" 
                value={underwriting.terms || ''} 
                onChange={e => updateUnderwritingField('terms', e.target.value)} 
                disabled={isReadOnly}
              >
                <option value="">Select terms</option>
                {termsOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-medium text-purple-800">Programs</label>
              <select 
                className="h-7 text-xs w-full" 
                value={underwriting.programs || ''} 
                onChange={e => updateUnderwritingField('programs', e.target.value)} 
                disabled={isReadOnly}
              >
                <option value="">Select programs</option>
                {programsOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TUD Section */}
      <div className="border border-gray-400 p-4">
        <h4 className="font-medium text-purple-800 mb-3">TUD</h4>
        <div className="space-y-2 text-sm">
          {tudOptions.map(option => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                name="tud_selection"
                id={`tud_${option.value}`}
                value={option.value}
                checked={underwriting.tud_selection === option.value}
                onChange={e => updateUnderwritingField('tud_selection', e.target.value)}
                disabled={isReadOnly}
                className="mr-2"
              />
              <label htmlFor={`tud_${option.value}`} className="text-sm">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnderwritingSection; 