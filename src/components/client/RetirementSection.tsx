import React from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

const RetirementSection = ({ formData, setFormData, isReadOnly }) => {
  const retirement = formData.retirement || {};

  const updateRetirement = (path, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.retirement) {
        newData.retirement = {};
      }
      
      const pathArray = path.split('.');
      let current = newData.retirement;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }
      
      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });
  };

  // Generate unique account ID
  const generateAccountId = (bankIndex, accountIndex) => {
    const clientId = formData.clientId || 'CLI001';
    const bankId = `B${String(bankIndex + 1).padStart(2, '0')}`;
    const accountNum = String(accountIndex + 1).padStart(2, '0');
    return `RET${clientId}${bankId}${accountNum}`;
  };

  // Initialize default structure
  React.useEffect(() => {
    if (!retirement.banks || retirement.banks.length === 0) {
      setFormData(prev => ({
        ...prev,
        retirement: {
          ...prev.retirement,
          banks: [{
            id: 'bank-a',
            name: 'Bank A',
            accounts: [
              { 
                id: '1a', 
                accountId: generateAccountId(0, 0),
                nameOfAccount: '', 
                investmentFirm: '', 
                accountBalance: 0, 
                typeOfInvestmentAccount: '', 
                investmentType: '', 
                ownership: '', 
                remarks: '',
                processMilestones: {}
              }
            ]
          }]
        }
      }));
    }
  }, []);

  // Bank management
  const addBank = () => {
    if (isReadOnly) return;
    
    const bankCount = (retirement.banks || []).length;
    const bankLetter = String.fromCharCode(65 + bankCount);
    
    const newBank = {
      id: `bank-${bankLetter.toLowerCase()}`,
      name: `Bank ${bankLetter}`,
      accounts: [
        { 
          id: `1${bankLetter.toLowerCase()}`, 
          accountId: generateAccountId(bankCount, 0),
          nameOfAccount: '', 
          investmentFirm: '', 
          accountBalance: 0, 
          typeOfInvestmentAccount: '', 
          investmentType: '', 
          ownership: '', 
          remarks: '',
          processMilestones: {}
        }
      ]
    };
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        banks: [...(prev.retirement?.banks || []), newBank]
      }
    }));
  };

  const removeBank = (bankIndex) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        banks: prev.retirement?.banks?.filter((_, i) => i !== bankIndex) || []
      }
    }));
  };

  const addAccount = (bankIndex) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        banks: prev.retirement?.banks?.map((bank, i) => 
          i === bankIndex ? {
            ...bank,
            accounts: [...(bank.accounts || []), {
              id: `${Date.now()}`,
              accountId: generateAccountId(bankIndex, bank.accounts?.length || 0),
              nameOfAccount: '', 
              investmentFirm: '', 
              accountBalance: 0, 
              typeOfInvestmentAccount: '', 
              investmentType: '', 
              ownership: '', 
              remarks: '',
              processMilestones: {}
            }]
          } : bank
        ) || []
      }
    }));
  };

  const removeAccount = (bankIndex, accountIndex) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        banks: prev.retirement?.banks?.map((bank, i) => 
          i === bankIndex ? {
            ...bank,
            accounts: bank.accounts?.filter((_, j) => j !== accountIndex) || []
          } : bank
        ) || []
      }
    }));
  };

  const updateAccount = (bankIndex, accountIndex, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        banks: prev.retirement?.banks?.map((bank, i) => 
          i === bankIndex ? {
            ...bank,
            accounts: bank.accounts?.map((account, j) => 
              j === accountIndex ? { ...account, [field]: value } : account
            ) || []
          } : bank
        ) || []
      }
    }));
  };

  const updateProcessMilestone = (bankIndex, accountIndex, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        banks: prev.retirement?.banks?.map((bank, i) => 
          i === bankIndex ? {
            ...bank,
            accounts: bank.accounts?.map((account, j) => 
              j === accountIndex ? { 
                ...account, 
                processMilestones: {
                  ...account.processMilestones,
                  [field]: value
                }
              } : account
            ) || []
          } : bank
        ) || []
      }
    }));
  };

  // Additional Income Sources management
  const addIncomeSource = () => {
    if (isReadOnly) return;
    
    const newSource = {
      id: `income-${Date.now()}`,
      incomeSource: '',
      amount: 0,
      taxable: '',
      colaAdjusted: '',
      startAge: '',
      endAge: '',
      actions: ''
    };
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        additionalIncomeSources: [...(prev.retirement?.additionalIncomeSources || []), newSource]
      }
    }));
  };

  const removeIncomeSource = (index) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        additionalIncomeSources: prev.retirement?.additionalIncomeSources?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const updateIncomeSource = (index, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        additionalIncomeSources: prev.retirement?.additionalIncomeSources?.map((source, i) => 
          i === index ? { ...source, [field]: value } : source
        ) || []
      }
    }));
  };

  const InputField = ({ label, value, onChange, type = "text", required = false, className = "", placeholder = "", readOnly = false }) => (
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
      />
    </div>
  );

  const CurrencyField = ({ label, value, onChange, required = false, className = "" }) => (
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
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          readOnly={isReadOnly}
        />
      </div>
    </div>
  );

  const SelectField = ({ label, value, onChange, options, required = false, className = "" }) => (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium leading-none text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className="flex h-8 w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={isReadOnly}
      >
        <option value="">Select...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const CheckboxField = ({ label, checked, onChange, className = "" }) => (
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
  );

  const TextAreaField = ({ label, value, onChange, required = false, className = "" }) => (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium leading-none text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className="flex min-h-[60px] w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isReadOnly}
      />
    </div>
  );

  // Dropdown options
  const typeOfInvestmentAccountOptions = [
    { value: 'Qualified: Traditional', label: 'Qualified: Traditional' },
    { value: 'Qualified: Roth', label: 'Qualified: Roth' },
    { value: 'Non Qualified: Taxable', label: 'Non Qualified: Taxable' }
  ];

  const investmentTypeOptions = [
    { value: 'Annuities', label: 'Annuities' },
    { value: 'Brokerage Account', label: 'Brokerage Account' },
    { value: 'Mutual Funds', label: 'Mutual Funds' }
  ];

  const ownershipOptions = [
    { value: 'Client', label: 'Client' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Joint Tenancy', label: 'Joint Tenancy' }
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold mb-6">Retirement Form</h2>

      {/* Header Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          <InputField
            label="Date In"
            type="date"
            value={retirement.processing?.dateIn}
            onChange={(value) => updateRetirement('processing.dateIn', value)}
          />
          <InputField
            label="Time In"
            type="time"
            value={retirement.processing?.timeIn}
            onChange={(value) => updateRetirement('processing.timeIn', value)}
          />
          <InputField
            label="Agent"
            value={retirement.processing?.agent}
            onChange={(value) => updateRetirement('processing.agent', value)}
          />
          <InputField
            label="Field Trainer"
            value={retirement.processing?.fieldTrainer}
            onChange={(value) => updateRetirement('processing.fieldTrainer', value)}
          />
          <InputField
            label="Referring Agent"
            value={retirement.processing?.referringAgent}
            onChange={(value) => updateRetirement('processing.referringAgent', value)}
          />
        </div>
      </div>

      {/* Investment Accounts Section */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Investment Accounts</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addBank}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Bank
              </button>
            )}
          </div>
        </div>

        {(retirement.banks || []).map((bank, bankIndex) => (
          <div key={bank.id} className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-blue-700">{bank.name}</h4>
              <div className="flex gap-2">
                {!isReadOnly && (
                  <>
                    <button
                      type="button"
                      onClick={() => addAccount(bankIndex)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      <Plus className="w-3 h-3" />
                      Add Account
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBank(bankIndex)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove Bank
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Accounts Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Account ID</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Name of Account</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Investment Firm</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Account Balance</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Type of Investment Account</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Investment Type</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Ownership</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Remarks</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Actions</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {(bank.accounts || []).map((account, accountIndex) => (
                    <tr key={account.id}>
                      <td className="border border-gray-300 p-1">
                        <InputField
                          value={account.accountId}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'accountId', value)}
                          readOnly label={undefined}                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <InputField
                          value={account.nameOfAccount}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'nameOfAccount', value)} label={undefined}                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <InputField
                          value={account.investmentFirm}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'investmentFirm', value)} label={undefined}                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <CurrencyField
                          value={account.accountBalance}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'accountBalance', value)} label={undefined}                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <SelectField
                          value={account.typeOfInvestmentAccount}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'typeOfInvestmentAccount', value)}
                          options={typeOfInvestmentAccountOptions} label={undefined}                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <SelectField
                          value={account.investmentType}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'investmentType', value)}
                          options={investmentTypeOptions} label={undefined}                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <SelectField
                          value={account.ownership}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'ownership', value)}
                          options={ownershipOptions} label={undefined}                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <InputField
                          value={account.remarks}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'remarks', value)} label={undefined}                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <InputField
                          value={account.actions || ''}
                          onChange={(value) => updateAccount(bankIndex, accountIndex, 'actions', value)}
                          label={undefined}
                          readOnly={isReadOnly}
                        />
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => removeAccount(bankIndex, accountIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Pension Information */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Pension Information</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyField
              label="Pension Amount"
              value={retirement.pensionInfo?.pensionAmount}
              onChange={(value) => updateRetirement('pensionInfo.pensionAmount', value)}
            />
            <CurrencyField
              label="Total Investment Value"
              value={retirement.pensionInfo?.totalInvestmentValue}
              onChange={(value) => updateRetirement('pensionInfo.totalInvestmentValue', value)}
            />
            <CurrencyField
              label="Total Qualified Accounts"
              value={retirement.pensionInfo?.totalQualifiedAccounts}
              onChange={(value) => updateRetirement('pensionInfo.totalQualifiedAccounts', value)}
            />
            <CurrencyField
              label="Total Non-Qualified Accounts"
              value={retirement.pensionInfo?.totalNonQualifiedAccounts}
              onChange={(value) => updateRetirement('pensionInfo.totalNonQualifiedAccounts', value)}
            />
            <TextAreaField
              label="Pension Info"
              value={retirement.pensionInfo?.pensionInfo}
              onChange={(value) => updateRetirement('pensionInfo.pensionInfo', value)}
            />
            <TextAreaField
              label="Remarks"
              value={retirement.pensionInfo?.remarks}
              onChange={(value) => updateRetirement('pensionInfo.remarks', value)}
            />
          </div>
        </div>
      </div>

      {/* Additional Income Sources */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Additional Income Sources</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addIncomeSource}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Income Source
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Income Source</th>
                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Amount</th>
                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Taxable?</th>
                <th className="border border-gray-300 p-2 text-left text-xs font-medium">COLA Adjusted?</th>
                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Start Age</th>
                <th className="border border-gray-300 p-2 text-left text-xs font-medium">End Age</th>
                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Actions</th>
                {!isReadOnly && <th className="border border-gray-300 p-2 text-left text-xs font-medium">Remove</th>}
              </tr>
            </thead>
            <tbody>
              {(retirement.additionalIncomeSources || []).map((source, index) => (
                <tr key={source.id || index}>
                  <td className="border border-gray-300 p-1">
                    <InputField
                      value={source.incomeSource}
                      onChange={(value) => updateIncomeSource(index, 'incomeSource', value)} label={undefined}                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <CurrencyField
                      value={source.amount}
                      onChange={(value) => updateIncomeSource(index, 'amount', value)} label={undefined}                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <SelectField
                      value={source.taxable}
                      onChange={(value) => updateIncomeSource(index, 'taxable', value)}
                      options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' }
                      ]} label={undefined}                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <SelectField
                      value={source.colaAdjusted}
                      onChange={(value) => updateIncomeSource(index, 'colaAdjusted', value)}
                      options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' }
                      ]} label={undefined}                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <InputField
                      type="number"
                      value={source.startAge}
                      onChange={(value) => updateIncomeSource(index, 'startAge', parseInt(value) || '')}
                      placeholder="18-100" label={undefined}                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <InputField
                      type="number"
                      value={source.endAge}
                      onChange={(value) => updateIncomeSource(index, 'endAge', parseInt(value) || '')}
                      placeholder="> Start Age" label={undefined}                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <InputField
                      value={source.actions}
                      onChange={(value) => updateIncomeSource(index, 'actions', value)} label={undefined}                    />
                  </td>
                  {!isReadOnly && (
                    <td className="border border-gray-300 p-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeIncomeSource(index)}
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

      {/* Process Milestones for each account */}
      {(retirement.banks || []).map((bank, bankIndex) => 
        bank.accounts?.map((account, accountIndex) => (
          <div key={`${bank.id}-${account.id}`} className="bg-white border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Process Milestones - {bank.name} - Account {account.accountId}</h3>
            </div>
            <div className="p-4">
              {/* Process Milestones Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-left font-medium">Process Milestone</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Implementation Call */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Implementation Call</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.implementationCallDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'implementationCallDate', value)}
                          readOnly={account.processMilestones?.implementationCallNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Financial Suitability Information Completed */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Financial Suitability Information Completed</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.financialSuitabilityCompletedDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'financialSuitabilityCompletedDate', value)}
                          readOnly={account.processMilestones?.financialSuitabilityCompletedNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Application Sent to Client */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Application Sent to Client</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.applicationSentToClientDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'applicationSentToClientDate', value)}
                          readOnly={account.processMilestones?.applicationSentToClientNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Application Signed by Client and Submitted to Athene */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Application Signed by Client and Submitted to Athene</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.applicationSignedAndSubmittedDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'applicationSignedAndSubmittedDate', value)}
                          readOnly={account.processMilestones?.applicationSignedAndSubmittedNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Suitability Approved by Athene */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Suitability Approved by Athene</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.suitabilityApprovedDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'suitabilityApprovedDate', value)}
                          readOnly={account.processMilestones?.suitabilityApprovedNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Suitability Approved Email Sent to Client (by Back Office) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Suitability Approved Email Sent to Client (by Back Office)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.suitabilityEmailSentDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'suitabilityEmailSentDate', value)}
                          readOnly={account.processMilestones?.suitabilityEmailSentNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Transfer Forms Sent to Client (if applicable, by Back Office) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Transfer Forms Sent to Client (if applicable, by Back Office)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.transferFormsSentDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'transferFormsSentDate', value)}
                          readOnly={account.processMilestones?.transferFormsSentNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Medallion Signature Obtained (by Client) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Medallion Signature Obtained (by Client)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.medallionSignatureObtained}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'medallionSignatureObtained', value)}
                          readOnly={account.processMilestones?.medallionSignatureObtainedNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Wet-signed/Medallion Signature Forms Mailed (by Client to Back Office) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Wet-signed/Medallion Signature Forms Mailed (by Client to Back Office)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.wetSignedFormsMailed}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'wetSignedFormsMailed', value)}
                          readOnly={account.processMilestones?.wetSignedFormsMailedNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Wet-signed/Medallion Signature Forms Received (by Back Office) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Wet-signed/Medallion Signature Forms Received (by Back Office)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.wetSignedFormsReceived}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'wetSignedFormsReceived', value)}
                          readOnly={account.processMilestones?.wetSignedFormsReceivedNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Wet-signed/Medallion Signature Forms Sent to Athene (by Back Office) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Wet-signed/Medallion Signature Forms Sent to Athene (by Back Office)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.wetSignedFormsSentToAthene}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'wetSignedFormsSentToAthene', value)}
                          readOnly={account.processMilestones?.wetSignedFormsSentToAtheneNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Wet-signed/Medallion Signature Forms Faxed/Mailed to Current Provider (by Athene) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Wet-signed/Medallion Signature Forms Faxed/Mailed to Current Provider (by Athene)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.wetSignedFormsFaxedToProvider}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'wetSignedFormsFaxedToProvider', value)}
                          readOnly={account.processMilestones?.wetSignedFormsFaxedToProviderNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* 3 Way Client Call - WITH CHECKBOX */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <CheckboxField
                            label="3 Way Client Call w/current provider (Check if not applicable)"
                            checked={account.processMilestones?.threeWayCallChecked }
                            onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'threeWayCallChecked', value)}
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.threeWayCallDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'threeWayCallDate', value)}
                          readOnly={account.processMilestones?.threeWayCallChecked || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* 1st TSP Call - WITH CHECKBOX */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <CheckboxField
                            label="1st TSP Call - initiate transfer (Check if not applicable)"
                            checked={account.processMilestones?.firstTspCallChecked}
                            onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'firstTspCallChecked', value)}
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          type="date"
                          value={account.processMilestones?.firstTspCallDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'firstTspCallDate', value)}
                          readOnly={account.processMilestones?.firstTspCallChecked || isReadOnly} label={undefined}
                        />
                      </td>
                    </tr>

                    {/* 2nd TSP Call - WITH CHECKBOX */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <CheckboxField
                            label="2nd TSP Call (7 days later) - complete transfer (Check if not applicable)"
                            checked={account.processMilestones?.secondTspCallChecked}
                            onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'secondTspCallChecked', value)}
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          type="date"
                          value={account.processMilestones?.secondTspCallDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'secondTspCallDate', value)}
                          readOnly={account.processMilestones?.secondTspCallChecked || isReadOnly} label={undefined}
                        />
                      </td>
                    </tr>

                    {/* Account Liquidated */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Account Liquidated</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.accountLiquidated}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'accountLiquidated', value)}
                          readOnly={account.processMilestones?.accountLiquidatedNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Funds Mailed to Client/Athene */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Funds Mailed to Client/Athene</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.fundsMailedToAthene}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'fundsMailedToAthene', value)}
                          readOnly={account.processMilestones?.fundsMailedToAtheneNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Check Received by Client - WITH CHECKBOX */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <CheckboxField
                            label="Check Received by Client (Check if not applicable)"
                            checked={account.processMilestones?.checkReceivedNA}
                            onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'checkReceivedNA', value)}
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          type="date"
                          value={account.processMilestones?.checkReceivedDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'checkReceivedDate', value)}
                          readOnly={account.processMilestones?.checkReceivedNA || isReadOnly} label={undefined}
                        />
                      </td>
                    </tr>

                    {/* Funds Received by Athene */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Funds Received by Athene</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.fundsReceivedByAtheneDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'fundsReceivedByAtheneDate', value)}
                          readOnly={account.processMilestones?.fundsReceivedByAtheneNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Contract Issued */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Contract Issued</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.contractIssuedDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'contractIssuedDate', value)}
                          readOnly={account.processMilestones?.contractIssuedNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Expected Funds */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Expected Funds</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">$</span>
                          <CurrencyField
                            label=""
                            value={account.processMilestones?.expectedFunds}
                            onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'expectedFunds', value)}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Actual Received Funds */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Actual Received Funds</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">$</span>
                          <CurrencyField
                            label=""
                            value={account.processMilestones?.actualReceivedFunds}
                            onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'actualReceivedFunds', value)}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Policy Delivery Acknowledgement (by Client) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Policy Delivery Acknowledgement (by Client)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.policyDeliveryAckDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'policyDeliveryAckDate', value)}
                          readOnly={account.processMilestones?.policyDeliveryAckNA || isReadOnly}
                        />
                      </td>
                    </tr>

                    {/* Account Portal Set Up and Contract Reviewed w/Client (CRM) */}
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Account Portal Set Up and Contract Reviewed w/Client (CRM)</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <InputField
                          label=""
                          type="date"
                          value={account.processMilestones?.athenePortalSetupDate}
                          onChange={(value) => updateProcessMilestone(bankIndex, accountIndex, 'athenePortalSetupDate', value)}
                          readOnly={account.processMilestones?.athenePortalSetupNA || isReadOnly}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RetirementSection;