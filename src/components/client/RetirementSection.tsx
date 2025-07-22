import React from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

const RetirementSection = ({ formData, setFormData, isReadOnly }) => {
  const retirement = formData.retirement || {};
  const [expandedMilestones, setExpandedMilestones] = React.useState({});

  const updateRetirement = (path, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.retirement) {
        newData.retirement = {};
      }
      
      // Handle nested path updates
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

  const addInvestmentAccount = (bank) => {
    if (isReadOnly) return;
    
    const newAccount = {
      accountId: '',
      accountName: '',
      investmentFirm: '',
      accountBalance: '',
      investmentAccountType: '',
      investmentType: '',
      ownership: '',
      remarks: ''
    };
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        investmentAccounts: {
          ...prev.retirement?.investmentAccounts,
          [bank]: [...(prev.retirement?.investmentAccounts?.[bank] || []), newAccount]
        }
      }
    }));
  };

  const removeInvestmentAccount = (bank, index) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        investmentAccounts: {
          ...prev.retirement?.investmentAccounts,
          [bank]: prev.retirement?.investmentAccounts?.[bank]?.filter((_, i) => i !== index) || []
        }
      }
    }));
  };

  const updateInvestmentAccount = (bank, index, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        investmentAccounts: {
          ...prev.retirement?.investmentAccounts,
          [bank]: prev.retirement?.investmentAccounts?.[bank]?.map((account, i) => 
            i === index ? { ...account, [field]: value } : account
          ) || []
        }
      }
    }));
  };

  const addIncomeSource = () => {
    if (isReadOnly) return;
    
    const newSource = {
      incomeSource: '',
      amount: '',
      taxable: false,
      colaAdjusted: false,
      startAge: '',
      endAge: ''
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

  const addProcessMilestone = () => {
    if (isReadOnly) return;
    
    const newMilestone = {
      accountId: '',
      accountName: '',
      investmentFirm: '',
      accountBalance: '',
      investmentAccountType: '',
      investmentType: '',
      ownership: '',
      remarks: '',
      milestones: {
        implementationCall: false,
        financialSuitabilityCompleted: false,
        applicationSentToClient: false,
        applicationSignedAndSubmitted: false,
        suitabilityApprovedByAthene: false,
        suitabilityEmailSent: false,
        transferFormsSent: false,
        medallionSignatureObtained: false,
        wetSignatureMailed: false,
        wetSignatureReceived: false,
        wetSignatureSentToAthene: false,
        wetSignatureFaxedToProvider: false,
        threeWayClientCall: false,
        tspCall1: false,
        tspCall2: false,
        accountLiquidated: false,
        fundsMailedToClient: false,
        checkReceived: false,
        fundsReceivedByAthene: false,
        contractIssued: false,
        expectedFunds: '',
        actualReceivedFunds: '',
        policyAcknowledged: false,
        athenePortalSetup: false
      }
    };
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        processMilestones: [...(prev.retirement?.processMilestones || []), newMilestone]
      }
    }));
  };

  const removeProcessMilestone = (index) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        processMilestones: prev.retirement?.processMilestones?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const updateProcessMilestone = (index, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        processMilestones: prev.retirement?.processMilestones?.map((milestone, i) => 
          i === index ? { ...milestone, [field]: value } : milestone
        ) || []
      }
    }));
  };

  const updateProcessMilestoneMilestone = (index, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      retirement: {
        ...prev.retirement,
        processMilestones: prev.retirement?.processMilestones?.map((milestone, i) => 
          i === index ? { 
            ...milestone, 
            milestones: { ...milestone.milestones, [field]: value }
          } : milestone
        ) || []
      }
    }));
  };

  const toggleMilestoneExpansion = (index) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const InputField = ({ label, value, onChange, type = "text", required = false, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isReadOnly}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, required = false, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        className="h-4 w-4 rounded border border-input"
      />
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  );

  const TextAreaField = ({ label, value, onChange, required = false, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isReadOnly}
      />
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold mb-6">Retirement Planning</h2>

      {/* Applicant Information */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Applicant Information</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="First Name"
              value={retirement.applicant?.firstName}
              onChange={(value) => updateRetirement('applicant.firstName', value)}
              required
            />
            <InputField
              label="Middle Initial"
              value={retirement.applicant?.middleInitial}
              onChange={(value) => updateRetirement('applicant.middleInitial', value)}
            />
            <InputField
              label="Last Name"
              value={retirement.applicant?.lastName}
              onChange={(value) => updateRetirement('applicant.lastName', value)}
              required
            />
            <InputField
              label="Address"
              value={retirement.applicant?.address}
              onChange={(value) => updateRetirement('applicant.address', value)}
              className="md:col-span-3"
            />
            <InputField
              label="City"
              value={retirement.applicant?.city}
              onChange={(value) => updateRetirement('applicant.city', value)}
            />
            <InputField
              label="State"
              value={retirement.applicant?.state}
              onChange={(value) => updateRetirement('applicant.state', value)}
            />
            <InputField
              label="ZIP Code"
              value={retirement.applicant?.zip}
              onChange={(value) => updateRetirement('applicant.zip', value)}
            />
            <InputField
              label="Date In"
              type="date"
              value={retirement.applicant?.dateIn}
              onChange={(value) => updateRetirement('applicant.dateIn', value)}
            />
            <InputField
              label="Time In"
              type="time"
              value={retirement.applicant?.timeIn}
              onChange={(value) => updateRetirement('applicant.timeIn', value)}
            />
            <InputField
              label="Agent"
              value={retirement.applicant?.agent}
              onChange={(value) => updateRetirement('applicant.agent', value)}
            />
            <InputField
              label="Field Trainer"
              value={retirement.applicant?.fieldTrainer}
              onChange={(value) => updateRetirement('applicant.fieldTrainer', value)}
            />
            <InputField
              label="Referring Agent"
              value={retirement.applicant?.referringAgent}
              onChange={(value) => updateRetirement('applicant.referringAgent', value)}
            />
          </div>

          {/* Co-Applicant */}
          <div className="mt-6">
            <h4 className="font-medium mb-4">Co-Applicant</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="First Name"
                value={retirement.applicant?.coApplicant?.firstName}
                onChange={(value) => updateRetirement('applicant.coApplicant.firstName', value)}
              />
              <InputField
                label="Middle Initial"
                value={retirement.applicant?.coApplicant?.middleInitial}
                onChange={(value) => updateRetirement('applicant.coApplicant.middleInitial', value)}
              />
              <InputField
                label="Last Name"
                value={retirement.applicant?.coApplicant?.lastName}
                onChange={(value) => updateRetirement('applicant.coApplicant.lastName', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Investment Accounts */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Investment Accounts</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank A Accounts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-blue-600">Bank A Accounts</h4>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => addInvestmentAccount('bankA')}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-8 px-3"
                  >
                    <Plus className="w-4 h-4" />
                    Add Account
                  </button>
                )}
              </div>
              {(retirement.investmentAccounts?.bankA || []).map((account, index) => (
                <div key={index} className="border rounded-lg p-3 relative">
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeInvestmentAccount('bankA', index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    <InputField
                      label="Account ID"
                      value={account.accountId}
                      onChange={(value) => updateInvestmentAccount('bankA', index, 'accountId', value)}
                    />
                    <InputField
                      label="Account Name"
                      value={account.accountName}
                      onChange={(value) => updateInvestmentAccount('bankA', index, 'accountName', value)}
                    />
                    <InputField
                      label="Investment Firm"
                      value={account.investmentFirm}
                      onChange={(value) => updateInvestmentAccount('bankA', index, 'investmentFirm', value)}
                    />
                    <InputField
                      label="Account Balance"
                      type="number"
                      step="0.01"
                      value={account.accountBalance}
                      onChange={(value) => updateInvestmentAccount('bankA', index, 'accountBalance', parseFloat(value) || 0)}
                    />
                    <SelectField
                      label="Account Type"
                      value={account.investmentAccountType}
                      onChange={(value) => updateInvestmentAccount('bankA', index, 'investmentAccountType', value)}
                      options={[
                        { value: 'IRA', label: 'IRA' },
                        { value: 'Roth IRA', label: 'Roth IRA' },
                        { value: '401K', label: '401K' },
                        { value: 'Cash', label: 'Cash' },
                        { value: 'Brokerage', label: 'Brokerage' }
                      ]}
                    />
                    <SelectField
                      label="Investment Type"
                      value={account.investmentType}
                      onChange={(value) => updateInvestmentAccount('bankA', index, 'investmentType', value)}
                      options={[
                        { value: 'Stocks', label: 'Stocks' },
                        { value: 'Bonds', label: 'Bonds' },
                        { value: 'Mixed', label: 'Mixed' },
                        { value: 'Money Market', label: 'Money Market' },
                        { value: 'Mutual Funds', label: 'Mutual Funds' }
                      ]}
                    />
                    <SelectField
                      label="Ownership"
                      value={account.ownership}
                      onChange={(value) => updateInvestmentAccount('bankA', index, 'ownership', value)}
                      options={[
                        { value: 'Individual', label: 'Individual' },
                        { value: 'Joint Tenancy', label: 'Joint Tenancy' },
                        { value: 'Trust', label: 'Trust' }
                      ]}
                    />
                    <TextAreaField
                      label="Remarks"
                      value={account.remarks}
                      onChange={(value) => updateInvestmentAccount('bankA', index, 'remarks', value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bank B Accounts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-green-600">Bank B Accounts</h4>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => addInvestmentAccount('bankB')}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 h-8 px-3"
                  >
                    <Plus className="w-4 h-4" />
                    Add Account
                  </button>
                )}
              </div>
              {(retirement.investmentAccounts?.bankB || []).map((account, index) => (
                <div key={index} className="border rounded-lg p-3 relative">
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeInvestmentAccount('bankB', index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    <InputField
                      label="Account ID"
                      value={account.accountId}
                      onChange={(value) => updateInvestmentAccount('bankB', index, 'accountId', value)}
                    />
                    <InputField
                      label="Account Name"
                      value={account.accountName}
                      onChange={(value) => updateInvestmentAccount('bankB', index, 'accountName', value)}
                    />
                    <InputField
                      label="Investment Firm"
                      value={account.investmentFirm}
                      onChange={(value) => updateInvestmentAccount('bankB', index, 'investmentFirm', value)}
                    />
                    <InputField
                      label="Account Balance"
                      type="number"
                      step="0.01"
                      value={account.accountBalance}
                      onChange={(value) => updateInvestmentAccount('bankB', index, 'accountBalance', parseFloat(value) || 0)}
                    />
                    <SelectField
                      label="Account Type"
                      value={account.investmentAccountType}
                      onChange={(value) => updateInvestmentAccount('bankB', index, 'investmentAccountType', value)}
                      options={[
                        { value: 'IRA', label: 'IRA' },
                        { value: 'Roth IRA', label: 'Roth IRA' },
                        { value: '401K', label: '401K' },
                        { value: 'Cash', label: 'Cash' },
                        { value: 'Brokerage', label: 'Brokerage' }
                      ]}
                    />
                    <SelectField
                      label="Investment Type"
                      value={account.investmentType}
                      onChange={(value) => updateInvestmentAccount('bankB', index, 'investmentType', value)}
                      options={[
                        { value: 'Stocks', label: 'Stocks' },
                        { value: 'Bonds', label: 'Bonds' },
                        { value: 'Mixed', label: 'Mixed' },
                        { value: 'Money Market', label: 'Money Market' },
                        { value: 'Mutual Funds', label: 'Mutual Funds' }
                      ]}
                    />
                    <SelectField
                      label="Ownership"
                      value={account.ownership}
                      onChange={(value) => updateInvestmentAccount('bankB', index, 'ownership', value)}
                      options={[
                        { value: 'Individual', label: 'Individual' },
                        { value: 'Joint Tenancy', label: 'Joint Tenancy' },
                        { value: 'Trust', label: 'Trust' }
                      ]}
                    />
                    <TextAreaField
                      label="Remarks"
                      value={account.remarks}
                      onChange={(value) => updateInvestmentAccount('bankB', index, 'remarks', value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pension Information */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Pension Information</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Pension Amount"
              type="number"
              step="0.01"
              value={retirement.pensionInformation?.pensionAmount}
              onChange={(value) => updateRetirement('pensionInformation.pensionAmount', parseFloat(value) || 0)}
            />
            <InputField
              label="Total Investment Value"
              type="number"
              step="0.01"
              value={retirement.pensionInformation?.totalInvestmentValue}
              onChange={(value) => updateRetirement('pensionInformation.totalInvestmentValue', parseFloat(value) || 0)}
            />
            <InputField
              label="Total Qualified Accounts"
              type="number"
              step="0.01"
              value={retirement.pensionInformation?.totalQualifiedAccounts}
              onChange={(value) => updateRetirement('pensionInformation.totalQualifiedAccounts', parseFloat(value) || 0)}
            />
            <InputField
              label="Total Non-Qualified Accounts"
              type="number"
              step="0.01"
              value={retirement.pensionInformation?.totalNonQualifiedAccounts}
              onChange={(value) => updateRetirement('pensionInformation.totalNonQualifiedAccounts', parseFloat(value) || 0)}
            />
            <TextAreaField
              label="Pension Info"
              value={retirement.pensionInformation?.pensionInfo}
              onChange={(value) => updateRetirement('pensionInformation.pensionInfo', value)}
              className="md:col-span-2"
            />
            <TextAreaField
              label="Remarks"
              value={retirement.pensionInformation?.remarks}
              onChange={(value) => updateRetirement('pensionInformation.remarks', value)}
              className="md:col-span-2"
            />
          </div>
        </div>
      </div>

      {/* Additional Income Sources */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Additional Income Sources</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addIncomeSource}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3"
              >
                <Plus className="w-4 h-4" />
                Add Income Source
              </button>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          {(retirement.additionalIncomeSources || []).map((source, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 relative">
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeIncomeSource(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Income Source"
                  value={source.incomeSource}
                  onChange={(value) => updateIncomeSource(index, 'incomeSource', value)}
                />
                <InputField
                  label="Amount"
                  type="number"
                  step="0.01"
                  value={source.amount}
                  onChange={(value) => updateIncomeSource(index, 'amount', parseFloat(value) || 0)}
                />
                <InputField
                  label="Start Age"
                  type="number"
                  value={source.startAge}
                  onChange={(value) => updateIncomeSource(index, 'startAge', parseInt(value) || 0)}
                />
                <InputField
                  label="End Age"
                  type="number"
                  value={source.endAge}
                  onChange={(value) => updateIncomeSource(index, 'endAge', parseInt(value) || 0)}
                />
                <CheckboxField
                  label="Taxable"
                  checked={source.taxable}
                  onChange={(value) => updateIncomeSource(index, 'taxable', value)}
                />
                <CheckboxField
                  label="COLA Adjusted"
                  checked={source.colaAdjusted}
                  onChange={(value) => updateIncomeSource(index, 'colaAdjusted', value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Milestones */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Process Milestones</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addProcessMilestone}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3"
              >
                <Plus className="w-4 h-4" />
                Add Account Milestone
              </button>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          {(retirement.processMilestones || []).map((milestone, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Account: {milestone.accountName || milestone.accountId || 'New Account'}</h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMilestoneExpansion(index)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                  >
                    {expandedMilestones[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {expandedMilestones[index] ? 'Collapse' : 'Expand'} Milestones
                  </button>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeProcessMilestone(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Account Information */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <InputField
                  label="Account ID"
                  value={milestone.accountId}
                  onChange={(value) => updateProcessMilestone(index, 'accountId', value)}
                />
                <InputField
                  label="Account Name"
                  value={milestone.accountName}
                  onChange={(value) => updateProcessMilestone(index, 'accountName', value)}
                />
                <InputField
                  label="Investment Firm"
                  value={milestone.investmentFirm}
                  onChange={(value) => updateProcessMilestone(index, 'investmentFirm', value)}
                />
                <InputField
                  label="Account Balance"
                  type="number"
                  step="0.01"
                  value={milestone.accountBalance}
                  onChange={(value) => updateProcessMilestone(index, 'accountBalance', parseFloat(value) || 0)}
                />
                <SelectField
                  label="Account Type"
                  value={milestone.investmentAccountType}
                  onChange={(value) => updateProcessMilestone(index, 'investmentAccountType', value)}
                  options={[
                    { value: 'IRA', label: 'IRA' },
                    { value: 'Roth IRA', label: 'Roth IRA' },
                    { value: '401K', label: '401K' },
                    { value: 'Cash', label: 'Cash' }
                  ]}
                />
                <SelectField
                  label="Investment Type"
                  value={milestone.investmentType}
                  onChange={(value) => updateProcessMilestone(index, 'investmentType', value)}
                  options={[
                    { value: 'Stocks', label: 'Stocks' },
                    { value: 'Bonds', label: 'Bonds' },
                    { value: 'Mixed', label: 'Mixed' },
                    { value: 'Money Market', label: 'Money Market' }
                  ]}
                />
                <SelectField
                  label="Ownership"
                  value={milestone.ownership}
                  onChange={(value) => updateProcessMilestone(index, 'ownership', value)}
                  options={[
                    { value: 'Individual', label: 'Individual' },
                    { value: 'Joint Tenancy', label: 'Joint Tenancy' },
                    { value: 'Trust', label: 'Trust' }
                  ]}
                />
                <TextAreaField
                  label="Remarks"
                  value={milestone.remarks}
                  onChange={(value) => updateProcessMilestone(index, 'remarks', value)}
                />
              </div>

              {/* Milestones Checkboxes */}
              {expandedMilestones[index] && (
                <div className="border-t pt-4">
                  <h5 className="font-medium mb-4">Process Milestones</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CheckboxField
                      label="Implementation Call"
                      checked={milestone.milestones?.implementationCall}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'implementationCall', value)}
                    />
                    <CheckboxField
                      label="Financial Suitability Completed"
                      checked={milestone.milestones?.financialSuitabilityCompleted}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'financialSuitabilityCompleted', value)}
                    />
                    <CheckboxField
                      label="Application Sent to Client"
                      checked={milestone.milestones?.applicationSentToClient}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'applicationSentToClient', value)}
                    />
                    <CheckboxField
                      label="Application Signed and Submitted"
                      checked={milestone.milestones?.applicationSignedAndSubmitted}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'applicationSignedAndSubmitted', value)}
                    />
                    <CheckboxField
                      label="Suitability Approved by Athene"
                      checked={milestone.milestones?.suitabilityApprovedByAthene}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'suitabilityApprovedByAthene', value)}
                    />
                    <CheckboxField
                      label="Suitability Email Sent"
                      checked={milestone.milestones?.suitabilityEmailSent}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'suitabilityEmailSent', value)}
                    />
                    <CheckboxField
                      label="Transfer Forms Sent"
                      checked={milestone.milestones?.transferFormsSent}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'transferFormsSent', value)}
                    />
                    <CheckboxField
                      label="Medallion Signature Obtained"
                      checked={milestone.milestones?.medallionSignatureObtained}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'medallionSignatureObtained', value)}
                    />
                    <CheckboxField
                      label="Wet Signature Mailed"
                      checked={milestone.milestones?.wetSignatureMailed}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'wetSignatureMailed', value)}
                    />
                    <CheckboxField
                      label="Wet Signature Received"
                      checked={milestone.milestones?.wetSignatureReceived}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'wetSignatureReceived', value)}
                    />
                    <CheckboxField
                      label="Wet Signature Sent to Athene"
                      checked={milestone.milestones?.wetSignatureSentToAthene}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'wetSignatureSentToAthene', value)}
                    />
                    <CheckboxField
                      label="Wet Signature Faxed to Provider"
                      checked={milestone.milestones?.wetSignatureFaxedToProvider}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'wetSignatureFaxedToProvider', value)}
                    />
                    <CheckboxField
                      label="Three Way Client Call"
                      checked={milestone.milestones?.threeWayClientCall}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'threeWayClientCall', value)}
                    />
                    <CheckboxField
                      label="TSP Call 1"
                      checked={milestone.milestones?.tspCall1}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'tspCall1', value)}
                    />
                    <CheckboxField
                      label="TSP Call 2"
                      checked={milestone.milestones?.tspCall2}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'tspCall2', value)}
                    />
                    <CheckboxField
                      label="Account Liquidated"
                      checked={milestone.milestones?.accountLiquidated}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'accountLiquidated', value)}
                    />
                    <CheckboxField
                      label="Funds Mailed to Client"
                      checked={milestone.milestones?.fundsMailedToClient}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'fundsMailedToClient', value)}
                    />
                    <CheckboxField
                      label="Check Received"
                      checked={milestone.milestones?.checkReceived}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'checkReceived', value)}
                    />
                    <CheckboxField
                      label="Funds Received by Athene"
                      checked={milestone.milestones?.fundsReceivedByAthene}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'fundsReceivedByAthene', value)}
                    />
                    <CheckboxField
                      label="Contract Issued"
                      checked={milestone.milestones?.contractIssued}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'contractIssued', value)}
                    />
                    <CheckboxField
                      label="Policy Acknowledged"
                      checked={milestone.milestones?.policyAcknowledged}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'policyAcknowledged', value)}
                    />
                    <CheckboxField
                      label="Athene Portal Setup"
                      checked={milestone.milestones?.athenePortalSetup}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'athenePortalSetup', value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <InputField
                      label="Expected Funds"
                      type="number"
                      step="0.01"
                      value={milestone.milestones?.expectedFunds}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'expectedFunds', parseFloat(value) || 0)}
                    />
                    <InputField
                      label="Actual Received Funds"
                      type="number"
                      step="0.01"
                      value={milestone.milestones?.actualReceivedFunds}
                      onChange={(value) => updateProcessMilestoneMilestone(index, 'actualReceivedFunds', parseFloat(value) || 0)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RetirementSection;