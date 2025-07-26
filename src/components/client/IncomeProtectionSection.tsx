import React from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

const IncomeProtectionSection = ({ formData, setFormData, isReadOnly }) => {
  const incomeProtection = formData.incomeProtection || {};

  const updateIncomeProtection = React.useCallback((path, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.incomeProtection) {
        newData.incomeProtection = {};
      }
      
      const pathArray = path.split('.');
      let current = newData.incomeProtection;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }
      
      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });
  }, [isReadOnly, setFormData]);

  // Initialize default structure if none exists
  React.useEffect(() => {
    if (!incomeProtection.bankAccounts || incomeProtection.bankAccounts.length === 0) {
      setFormData(prev => ({
        ...prev,
        incomeProtection: {
          ...prev.incomeProtection,
          bankAccounts: [{
            id: 'account-1',
            name: 'Bank A',
            currentProtection: {
              provider: '',
              faceAmount: 0,
              insuranceType: '',
              term: '',
              monthlyPremium: 0,
              annualPremium: 0,
              savings: 0
            },
            proposedProtections: []
          }]
        }
      }));
    }
  }, []);

  // Bank Account management
  const addBankAccount = React.useCallback(() => {
    if (isReadOnly) return;
    
    const accountCount = (incomeProtection.bankAccounts || []).length;
    const bankLetter = String.fromCharCode(65 + accountCount); // A, B, C, etc.
    
    const newBankAccount = {
      id: `account-${Date.now()}`,
      name: `Bank ${bankLetter}`,
      currentProtection: {
        provider: '',
        faceAmount: 0,
        insuranceType: '',
        term: '',
        monthlyPremium: 0,
        annualPremium: 0,
        savings: 0
      },
      proposedProtections: []
    };
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        bankAccounts: [...(prev.incomeProtection?.bankAccounts || []), newBankAccount]
      }
    }));
  }, [isReadOnly, incomeProtection.bankAccounts, setFormData]);

  const removeBankAccount = React.useCallback((accountIndex) => {
    if (isReadOnly || accountIndex === 0) return; // Don't allow removing first account
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        bankAccounts: prev.incomeProtection?.bankAccounts?.filter((_, i) => i !== accountIndex) || []
      }
    }));
  }, [isReadOnly, setFormData]);

  // Proposed Protection management
  const addProposedProtection = React.useCallback((accountIndex) => {
    if (isReadOnly) return;
    
    const newProposed = {
      id: `proposed-${Date.now()}`,
      provider: '',
      faceAmount: 0,
      insuranceType: '',
      term: '',
      monthlyPremium: 0,
      annualPremium: 0
    };
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        bankAccounts: prev.incomeProtection?.bankAccounts?.map((account, i) => 
          i === accountIndex ? {
            ...account,
            proposedProtections: [...(account.proposedProtections || []), newProposed]
          } : account
        ) || []
      }
    }));
  }, [isReadOnly, setFormData]);

  const removeProposedProtection = React.useCallback((accountIndex, proposedIndex) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        bankAccounts: prev.incomeProtection?.bankAccounts?.map((account, i) => 
          i === accountIndex ? {
            ...account,
            proposedProtections: account.proposedProtections?.filter((_, j) => j !== proposedIndex) || []
          } : account
        ) || []
      }
    }));
  }, [isReadOnly, setFormData]);

  // Update protection data
  const updateCurrentProtection = React.useCallback((accountIndex, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        bankAccounts: prev.incomeProtection?.bankAccounts?.map((account, i) => 
          i === accountIndex ? {
            ...account,
            currentProtection: {
              ...account.currentProtection,
              [field]: value
            }
          } : account
        ) || []
      }
    }));
  }, [isReadOnly, setFormData]);

  const updateProposedProtection = React.useCallback((accountIndex, proposedIndex, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        bankAccounts: prev.incomeProtection?.bankAccounts?.map((account, i) => 
          i === accountIndex ? {
            ...account,
            proposedProtections: account.proposedProtections?.map((proposed, j) => 
              j === proposedIndex ? { ...proposed, [field]: value } : proposed
            ) || []
          } : account
        ) || []
      }
    }));
  }, [isReadOnly, setFormData]);

  // Family member functions
  // Helper to calculate age from DOB
  const calculateAge = React.useCallback((dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : '';
  }, []);

  const addFamilyMember = React.useCallback(() => {
    if (isReadOnly) return;
    
    const newMember = {
      id: `member-${Date.now()}`,
      name: '',
      dob: '',
      age: '',
      sex: '',
      relationship: '',
      ssn: '',
      height: '',
      weight: '',
      tobacco: 'No',
      quitDate: '',
      military: 'N/A',
      flyingHazard: 'N/A',
      dutyAircraft: '',
      rider: '',
      isStudent: 'No'
    };
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        familyMembers: [...(prev.incomeProtection?.familyMembers || []), newMember]
      }
    }));
  }, [isReadOnly, setFormData]);

  const removeFamilyMember = React.useCallback((index) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        familyMembers: prev.incomeProtection?.familyMembers?.filter((_, i) => i !== index) || []
      }
    }));
  }, [isReadOnly, setFormData]);

  const updateFamilyMember = React.useCallback((index, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        familyMembers: prev.incomeProtection?.familyMembers?.map((member, i) => 
          i === index ? { ...member, [field]: value } : member
        ) || []
      }
    }));
  }, [isReadOnly, setFormData]);

  const InputField = React.useCallback(({ label, value, onChange, type = "text", required = false, className = "", placeholder = "", readOnly = false, min = undefined }) => (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium leading-none text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isReadOnly || readOnly}
        placeholder={placeholder}
        min={min}
      />
    </div>
  ), [isReadOnly]);

  const CurrencyField = React.useCallback(({ label, value, onChange, required = false, className = "" }) => (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium leading-none text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">$</span>
        <input
          className="flex h-8 w-full rounded border border-gray-300 bg-white pl-6 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          type="number"
          step="0.01"
          min="0"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          readOnly={isReadOnly}
        />
      </div>
    </div>
  ), [isReadOnly]);

  const SelectField = React.useCallback(({ label, value, onChange, options, required = false, className = "", disabled = false }) => (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium leading-none text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={isReadOnly || disabled}
      >
        <option value="">Select...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ), [isReadOnly]);

  const CheckboxField = React.useCallback(({ label, checked, onChange, className = "" }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e) => onChange(e.target.checked)}
        disabled={isReadOnly}
        className="h-4 w-4 rounded border border-gray-300"
      />
      <label className="text-xs font-medium leading-none text-gray-700">
        {label}
      </label>
    </div>
  ), [isReadOnly]);

  // Options for dropdowns
  const stateOptions = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
  ];

  const insuranceTypeOptions = [
    { value: 'VA', label: 'VA' },
    { value: 'TERM', label: 'TERM' },
    { value: 'Whole Life', label: 'Whole Life' },
    { value: 'UL', label: 'UL' },
    { value: 'GUL', label: 'GUL' }
  ];

  const tableRatingOptions = [
    { value: '1 or A', label: '1 or A' }, { value: '2 or B', label: '2 or B' },
    { value: '3 or C', label: '3 or C' }, { value: '4 or D', label: '4 or D' },
    { value: '5 or E', label: '5 or E' }, { value: '6 or F', label: '6 or F' },
    { value: '7 or G', label: '7 or G' }, { value: '8 or H', label: '8 or H' },
    { value: '9 or I', label: '9 or I' }, { value: '10 or J', label: '10 or J' }
  ];

  const termOptions = [
    { value: '10', label: '10' }, { value: '15', label: '15' },
    { value: '20', label: '20' }, { value: '25', label: '25' },
    { value: '30', label: '30' }
  ];

  const ratingOptions = [
    { value: 'Preferred Best (NTB)', label: 'Preferred Best (NTB)' },
    { value: 'Preferred (NTB)', label: 'Preferred (NTB)' },
    { value: 'Standard Plus (NTB)', label: 'Standard Plus (NTB)' },
    { value: 'Standard (NTB)', label: 'Standard (NTB)' },
    { value: 'Preferred (TB)', label: 'Preferred (TB)' },
    { value: 'Standard (TB)', label: 'Standard (TB)' }
  ];

  const policyStatusOptions = [
    { value: 'Disbursed', label: 'Disbursed' },
    { value: 'Issued', label: 'Issued' },
    { value: 'Pending', label: 'Pending' },
    { value: 'CNH', label: 'CNH' },
    { value: 'TUD', label: 'TUD' }
  ];

  const relationshipOptions = [
    { value: 'Applicant', label: 'Applicant' },
    { value: 'Co-applicant', label: 'Co-applicant' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Partner', label: 'Partner' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' }
  ];

  const riderOptions = [
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Child', label: 'Child' }
  ];

  return (
    <div className="space-y-6 p-6 bg-green-50">
      <h2 className="text-2xl font-semibold mb-6">Income Protection Form</h2>

      {/* Header Section - Date In, Time In, Agent, etc. */}
      <div className="bg-green-100 p-4 rounded-lg">
        <div className="grid grid-cols-5 gap-4">
          <InputField
            label="Date In"
            type="date"
            value={incomeProtection.processing?.dateIn}
            onChange={(value) => updateIncomeProtection('processing.dateIn', value)}
          />
          <InputField
            label="Time In"
            type="time"
            value={incomeProtection.processing?.timeIn}
            onChange={(value) => updateIncomeProtection('processing.timeIn', value)}
          />
          <InputField
            label="Agent"
            value={incomeProtection.processing?.agent}
            onChange={(value) => updateIncomeProtection('processing.agent', value)}
          />
          <InputField
            label="Field Trainer"
            value={incomeProtection.processing?.fieldTrainer}
            onChange={(value) => updateIncomeProtection('processing.fieldTrainer', value)}
          />
          <InputField
            label="Referring Agent"
            value={incomeProtection.processing?.referringAgent}
            onChange={(value) => updateIncomeProtection('processing.referringAgent', value)}
          />
        </div>
      </div>

      {/* Bank Accounts and Protection Comparison */}
      <div className="space-y-6">
        {!isReadOnly && (
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Bank Account Protection</h3>
            <button
              type="button"
              onClick={addBankAccount}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Bank Account
            </button>
          </div>
        )}

        {(incomeProtection.bankAccounts || []).map((bankAccount, accountIndex) => (
          <div key={bankAccount.id} className="bg-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">{bankAccount.name}</h4>
              {accountIndex > 0 && !isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeBankAccount(accountIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Table Layout for Current and Proposed Protections */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-green-300 bg-white rounded">
                <thead>
                  <tr>
                    <th className="border p-2 bg-green-200 text-center">Current Bank</th>
                    {(bankAccount.proposedProtections || []).map((_, idx) => (
                      <th key={idx} className="border p-2 bg-green-100 text-center">
                        Proposed Bank {idx + 1}
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => removeProposedProtection(accountIndex, idx)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3 inline" />
                          </button>
                        )}
                      </th>
                    ))}
                    {!isReadOnly && (
                      <th className="border p-2 bg-green-50 text-center">
                        <button
                          type="button"
                          onClick={() => addProposedProtection(accountIndex)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Plus className="w-4 h-4 inline" /> Add Proposed
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Provider Row */}
                  <tr>
                    <td className="border p-2">
                      <InputField
                        label="Provider"
                        value={bankAccount.currentProtection?.provider}
                        onChange={(value) => updateCurrentProtection(accountIndex, 'provider', value)}
                      />
                    </td>
                    {(bankAccount.proposedProtections || []).map((proposed, proposedIndex) => (
                      <td key={proposed.id} className="border p-2">
                        <InputField
                          label="Provider"
                          value={proposed.provider}
                          onChange={(value) => updateProposedProtection(accountIndex, proposedIndex, 'provider', value)}
                        />
                      </td>
                    ))}
                    {!isReadOnly && (
                      <td className="border p-2"></td>
                    )}
                  </tr>
                  {/* Face Amount Row */}
                  <tr>
                    <td className="border p-2">
                      <CurrencyField
                        label="Face Amount"
                        value={bankAccount.currentProtection?.faceAmount}
                        onChange={(value) => updateCurrentProtection(accountIndex, 'faceAmount', value)}
                      />
                    </td>
                    {(bankAccount.proposedProtections || []).map((proposed, proposedIndex) => (
                      <td key={proposed.id} className="border p-2">
                        <CurrencyField
                          label="Face Amount"
                          value={proposed.faceAmount}
                          onChange={(value) => updateProposedProtection(accountIndex, proposedIndex, 'faceAmount', value)}
                        />
                      </td>
                    ))}
                    {!isReadOnly && (
                      <td className="border p-2"></td>
                    )}
                  </tr>
                  {/* Insurance Type Row */}
                  <tr>
                    <td className="border p-2">
                      <SelectField
                        label="Insurance Type"
                        value={bankAccount.currentProtection?.insuranceType}
                        onChange={(value) => updateCurrentProtection(accountIndex, 'insuranceType', value)}
                        options={insuranceTypeOptions}
                      />
                    </td>
                    {(bankAccount.proposedProtections || []).map((proposed, proposedIndex) => (
                      <td key={proposed.id} className="border p-2">
                        <SelectField
                          label="Insurance Type"
                          value={proposed.insuranceType}
                          onChange={(value) => updateProposedProtection(accountIndex, proposedIndex, 'insuranceType', value)}
                          options={insuranceTypeOptions}
                        />
                      </td>
                    ))}
                    {!isReadOnly && (
                      <td className="border p-2"></td>
                    )}
                  </tr>
                  {/* Term Row */}
                  <tr>
                    <td className="border p-2">
                      <SelectField
                        label="Term"
                        value={bankAccount.currentProtection?.term}
                        onChange={(value) => updateCurrentProtection(accountIndex, 'term', value)}
                        options={termOptions}
                      />
                    </td>
                    {(bankAccount.proposedProtections || []).map((proposed, proposedIndex) => (
                      <td key={proposed.id} className="border p-2">
                        <SelectField
                          label="Term"
                          value={proposed.term}
                          onChange={(value) => updateProposedProtection(accountIndex, proposedIndex, 'term', value)}
                          options={termOptions}
                        />
                      </td>
                    ))}
                    {!isReadOnly && (
                      <td className="border p-2"></td>
                    )}
                  </tr>
                  {/* Monthly Premium Row */}
                  <tr>
                    <td className="border p-2">
                      <CurrencyField
                        label="Monthly Premium"
                        value={bankAccount.currentProtection?.monthlyPremium}
                        onChange={(value) => updateCurrentProtection(accountIndex, 'monthlyPremium', value)}
                      />
                    </td>
                    {(bankAccount.proposedProtections || []).map((proposed, proposedIndex) => (
                      <td key={proposed.id} className="border p-2">
                        <CurrencyField
                          label="Monthly Premium"
                          value={proposed.monthlyPremium}
                          onChange={(value) => updateProposedProtection(accountIndex, proposedIndex, 'monthlyPremium', value)}
                        />
                      </td>
                    ))}
                    {!isReadOnly && (
                      <td className="border p-2"></td>
                    )}
                  </tr>
                  {/* Annual Premium Row */}
                  <tr>
                    <td className="border p-2">
                      <CurrencyField
                        label="Annual Premium"
                        value={bankAccount.currentProtection?.annualPremium}
                        onChange={(value) => updateCurrentProtection(accountIndex, 'annualPremium', value)}
                      />
                    </td>
                    {(bankAccount.proposedProtections || []).map((proposed, proposedIndex) => (
                      <td key={proposed.id} className="border p-2">
                        <CurrencyField
                          label="Annual Premium"
                          value={proposed.annualPremium}
                          onChange={(value) => updateProposedProtection(accountIndex, proposedIndex, 'annualPremium', value)}
                        />
                      </td>
                    ))}
                    {!isReadOnly && (
                      <td className="border p-2"></td>
                    )}
                  </tr>
                  {/* Savings Row (spans all columns) */}
                  <tr>
                    <td colSpan={(bankAccount.proposedProtections?.length || 0) + 1 + (!isReadOnly ? 1 : 0)} className="border p-2 bg-green-50 text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        Savings:
                        <CurrencyField
                          label={undefined}
                          value={bankAccount.currentProtection?.savings}
                          onChange={(value) => updateCurrentProtection(accountIndex, 'savings', value)}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Details Section */}
      <div className="bg-green-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Policy Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="Application Date"
            type="date"
            value={incomeProtection.policyDetails?.applicationDate}
            onChange={(value) => updateIncomeProtection('policyDetails.applicationDate', value)}
          />
          <InputField
            label="Policy Number"
            value={incomeProtection.policyDetails?.policyNumber}
            onChange={(value) => updateIncomeProtection('policyDetails.policyNumber', value)}
          />
          <SelectField
            label="Rating"
            value={incomeProtection.policyDetails?.rating}
            onChange={(value) => updateIncomeProtection('policyDetails.rating', value)}
            options={ratingOptions}
          />
          <SelectField
            label="Table Rating"
            value={incomeProtection.policyDetails?.tableRating}
            onChange={(value) => updateIncomeProtection('policyDetails.tableRating', value)}
            options={tableRatingOptions}
          />
          <SelectField
            label="Policy Status"
            value={incomeProtection.policyDetails?.policyStatus}
            onChange={(value) => updateIncomeProtection('policyDetails.policyStatus', value)}
            options={policyStatusOptions}
          />
          <InputField
            label="Status Date"
            type="date"
            value={incomeProtection.policyDetails?.statusDate}
            onChange={(value) => updateIncomeProtection('policyDetails.statusDate', value)}
          />
          <InputField
            label="Processing Manager"
            value={incomeProtection.policyDetails?.processingManager}
            onChange={(value) => updateIncomeProtection('policyDetails.processingManager', value)}
          />
          <InputField
            label="DFT"
            value={incomeProtection.policyDetails?.dft}
            onChange={(value) => updateIncomeProtection('policyDetails.dft', value)}
          />
          <SelectField
            label="DFT No"
            value={incomeProtection.policyDetails?.dftNo}
            onChange={(value) => updateIncomeProtection('policyDetails.dftNo', value)}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' }
            ]}
          />
          <InputField
            label="Issue Date"
            type="date"
            value={incomeProtection.policyDetails?.issueDate}
            onChange={(value) => updateIncomeProtection('policyDetails.issueDate', value)}
          />
          <InputField
            label="Disburse Date"
            type="date"
            value={incomeProtection.policyDetails?.disburseDate}
            onChange={(value) => updateIncomeProtection('policyDetails.disburseDate', value)}
          />
          <InputField
            label="# of Units"
            type="number"
            min="0"
            value={incomeProtection.policyDetails?.numberOfUnits}
            onChange={(value) => updateIncomeProtection('policyDetails.numberOfUnits', parseInt(value) || 0)}
          />
          <CurrencyField
            label="Gross Annual Premium (GAP)"
            value={incomeProtection.policyDetails?.grossAnnualPremium}
            onChange={(value) => updateIncomeProtection('policyDetails.grossAnnualPremium', value)}
          />
          <InputField
            label="GAP"
            type="number"
            min="0"
            value={incomeProtection.policyDetails?.gap}
            onChange={(value) => updateIncomeProtection('policyDetails.gap', value)}
          />
        </div>
      </div>

      {/* Family Members Section */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Family Members Proposed for Coverage</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addFamilyMember}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            )}
          </div>
        </div>
        
        {/* Family Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-xs">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">DOB</th>
                <th className="border p-2 text-left">Age</th>
                <th className="border p-2 text-left">Sex</th>
                <th className="border p-2 text-left">Relationship</th>
                <th className="border p-2 text-left">SSN</th>
                <th className="border p-2 text-left">Ht</th>
                <th className="border p-2 text-left">Wt</th>
                <th className="border p-2 text-left">Tobacco</th>
                <th className="border p-2 text-left">Quit Date</th>
                <th className="border p-2 text-left">Military</th>
                <th className="border p-2 text-left">Flying/Hazard</th>
                <th className="border p-2 text-left">Duty/Aircraft</th>
                <th className="border p-2 text-left">Rider</th>
                <th className="border p-2 text-left">Student</th>
                {!isReadOnly && <th className="border p-2 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {(incomeProtection.familyMembers || []).map((member, index) => (
                <tr key={member.id || index}>
                  <td className="border p-1">
                    <InputField
                      value={member.name}
                      onChange={(value) => updateFamilyMember(index, 'name', value)} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <InputField
                      type="date"
                      value={member.dob}
                      onChange={(value) => updateFamilyMember(index, 'dob', value)} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <InputField
                      type="number"
                      value={calculateAge(member.dob)}
                      onChange={() => {}}
                      readOnly={true}
                      label={undefined}
                    />
                  </td>
                  <td className="border p-1">
                    <SelectField
                      value={member.sex}
                      onChange={(value) => updateFamilyMember(index, 'sex', value)}
                      options={[
                        { value: 'M', label: 'M' },
                        { value: 'F', label: 'F' }
                      ]} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <SelectField
                      value={member.relationship}
                      onChange={(value) => updateFamilyMember(index, 'relationship', value)}
                      options={relationshipOptions} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <InputField
                      value={member.ssn}
                      onChange={(value) => updateFamilyMember(index, 'ssn', value)}
                      placeholder="XXX-XX-XXXX" label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <InputField
                      value={member.height}
                      onChange={(value) => updateFamilyMember(index, 'height', value)}
                      placeholder="5'10&quot;" label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <InputField
                      type="number"
                      min="0"
                      value={member.weight}
                      onChange={(value) => updateFamilyMember(index, 'weight', value)} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <InputField
                      value={member.tobacco}
                      onChange={(value) => updateFamilyMember(index, 'tobacco', value)}
                      label={undefined}
                    />
                  </td>
                  <td className="border p-1">
                    <InputField
                      type="date"
                      value={member.quitDate}
                      onChange={(value) => updateFamilyMember(index, 'quitDate', value)} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <SelectField
                      value={member.military}
                      onChange={(value) => updateFamilyMember(index, 'military', value)}
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Retired', label: 'Retired' },
                        { value: 'N/A', label: 'N/A' }
                      ]} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <SelectField
                      value={member.flyingHazard}
                      onChange={(value) => updateFamilyMember(index, 'flyingHazard', value)}
                      options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                        { value: 'N/A', label: 'N/A' }
                      ]} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <InputField
                      value={member.dutyAircraft}
                      onChange={(value) => updateFamilyMember(index, 'dutyAircraft', value)} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <SelectField
                      value={member.rider}
                      onChange={(value) => updateFamilyMember(index, 'rider', value)}
                      options={riderOptions} label={undefined}                    />
                  </td>
                  <td className="border p-1">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={member.isStudent === 'Yes'}
                        onChange={(e) => updateFamilyMember(index, 'isStudent', e.target.checked ? 'Yes' : 'No')}
                        disabled={isReadOnly}
                        className="h-4 w-4"
                      />
                    </div>
                  </td>
                  {!isReadOnly && (
                    <td className="border p-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Owner Information Section */}
      <div className="bg-green-100 p-4 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <h3 className="text-lg font-semibold">Owner, if different than applicant or if under age 15</h3>
          <CheckboxField
            label="Show checkbox if its true, (true=Enable Fields)"
            checked={incomeProtection.owner?.isDifferent}
            onChange={(value) => updateIncomeProtection('owner.isDifferent', value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Owner"
            value={incomeProtection.owner?.name}
            onChange={(value) => updateIncomeProtection('owner.name', value)}
            readOnly={!incomeProtection.owner?.isDifferent}
          />
          <SelectField
            label="Relationship"
            value={incomeProtection.owner?.relationship}
            onChange={(value) => updateIncomeProtection('owner.relationship', value)}
            options={relationshipOptions}
            disabled={!incomeProtection.owner?.isDifferent}
          />
          <InputField
            label="Address"
            value={incomeProtection.owner?.address}
            onChange={(value) => updateIncomeProtection('owner.address', value)}
            readOnly={!incomeProtection.owner?.isDifferent}
          />
          <InputField
            label="SSN"
            value={incomeProtection.owner?.ssn}
            onChange={(value) => updateIncomeProtection('owner.ssn', value)}
            placeholder="XXX-XX-XXXX"
            readOnly={!incomeProtection.owner?.isDifferent}
          />
        </div>
      </div>

      {/* Process Milestones Section */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Process Milestones</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputField
              label="Implementation"
              type="date"
              value={incomeProtection.processMilestones?.implementation}
              onChange={(value) => updateIncomeProtection('processMilestones.implementation', value)}
            />
            <InputField
              label="Application Signed"
              type="date"
              value={incomeProtection.processMilestones?.applicationSigned}
              onChange={(value) => updateIncomeProtection('processMilestones.applicationSigned', value)}
            />
            <InputField
              label="Personal History Interview Completed"
              type="date"
              value={incomeProtection.processMilestones?.personalHistoryInterviewCompleted}
              onChange={(value) => updateIncomeProtection('processMilestones.personalHistoryInterviewCompleted', value)}
            />
            <InputField
              label="App Submission"
              type="date"
              value={incomeProtection.processMilestones?.appSubmission}
              onChange={(value) => updateIncomeProtection('processMilestones.appSubmission', value)}
            />
            
            {/* Paramed Ordered - with checkbox */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <InputField
                  label="Paramed Ordered"
                  type="date"
                  value={incomeProtection.processMilestones?.paramedsOrdered}
                  onChange={(value) => updateIncomeProtection('processMilestones.paramedsOrdered', value)}
                  readOnly={incomeProtection.processMilestones?.paramedsOrderedNA}
                />
                <div className="mt-5">
                  <CheckboxField
                    label="N/A"
                    checked={incomeProtection.processMilestones?.paramedsOrderedNA}
                    onChange={(value) => updateIncomeProtection('processMilestones.paramedsOrderedNA', value)}
                  />
                </div>
              </div>
            </div>

            <InputField
              label="Paramed Scheduled"
              type="date"
              value={incomeProtection.processMilestones?.paramedsScheduled}
              onChange={(value) => updateIncomeProtection('processMilestones.paramedsScheduled', value)}
            />

            {/* Paramed Decisioned - with checkbox */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <InputField
                  label="Paramed Decisioned (if applicable)"
                  type="date"
                  value={incomeProtection.processMilestones?.paramedsDecisioned}
                  onChange={(value) => updateIncomeProtection('processMilestones.paramedsDecisioned', value)}
                  readOnly={incomeProtection.processMilestones?.paramedsDecisionedNA}
                />
                <div className="mt-5">
                  <CheckboxField
                    label="N/A"
                    checked={incomeProtection.processMilestones?.paramedsDecisionedNA}
                    onChange={(value) => updateIncomeProtection('processMilestones.paramedsDecisionedNA', value)}
                  />
                </div>
              </div>
            </div>

            <InputField
              label="Paramed Completed"
              type="date"
              value={incomeProtection.processMilestones?.paramedsCompleted}
              onChange={(value) => updateIncomeProtection('processMilestones.paramedsCompleted', value)}
            />

            {/* APS Ordered - with checkbox */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <InputField
                  label="APS Ordered"
                  type="date"
                  value={incomeProtection.processMilestones?.apsOrdered}
                  onChange={(value) => updateIncomeProtection('processMilestones.apsOrdered', value)}
                  readOnly={incomeProtection.processMilestones?.apsOrderedNA}
                />
                <div className="mt-5">
                  <CheckboxField
                    label="N/A"
                    checked={incomeProtection.processMilestones?.apsOrderedNA}
                    onChange={(value) => updateIncomeProtection('processMilestones.apsOrderedNA', value)}
                  />
                </div>
              </div>
            </div>

            {/* APS Decisioned - with checkbox */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <InputField
                  label="APS Decisioned (if applicable)"
                  type="date"
                  value={incomeProtection.processMilestones?.apsDecisioned}
                  onChange={(value) => updateIncomeProtection('processMilestones.apsDecisioned', value)}
                  readOnly={incomeProtection.processMilestones?.apsDecisionedNA}
                />
                <div className="mt-5">
                  <CheckboxField
                    label="N/A"
                    checked={incomeProtection.processMilestones?.apsDecisionedNA}
                    onChange={(value) => updateIncomeProtection('processMilestones.apsDecisionedNA', value)}
                  />
                </div>
              </div>
            </div>

            <InputField
              label="Issued Date"
              type="date"
              value={incomeProtection.processMilestones?.issuedDate}
              onChange={(value) => updateIncomeProtection('processMilestones.issuedDate', value)}
            />
            <InputField
              label="Approved Rating"
              type="date"
              value={incomeProtection.processMilestones?.approvedRating}
              onChange={(value) => updateIncomeProtection('processMilestones.approvedRating', value)}
            />
            <InputField
              label="Date Policy Mailed to Client"
              type="date"
              value={incomeProtection.processMilestones?.datePolicyMailedToClient}
              onChange={(value) => updateIncomeProtection('processMilestones.datePolicyMailedToClient', value)}
            />
            <InputField
              label="Delivery Requirements Received"
              type="date"
              value={incomeProtection.processMilestones?.deliveryRequirementsReceived}
              onChange={(value) => updateIncomeProtection('processMilestones.deliveryRequirementsReceived', value)}
            />
            <InputField
              label="Commissions Received"
              type="date"
              value={incomeProtection.processMilestones?.commissionsReceived}
              onChange={(value) => updateIncomeProtection('processMilestones.commissionsReceived', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeProtectionSection;