import React from 'react';
import { Plus, X } from 'lucide-react';

const IncomeProtectionSection = ({ formData, setFormData, isReadOnly }) => {
  const incomeProtection = formData.incomeProtection || {};

  const updateIncomeProtection = (path, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.incomeProtection) {
        newData.incomeProtection = {};
      }
      
      // Handle nested path updates
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
  };

  const addFamilyMember = () => {
    if (isReadOnly) return;
    
    const newMember = {
      name: '',
      dob: '',
      age: '',
      sex: '',
      relationship: '',
      ssn: '',
      height: '',
      weight: '',
      tobacco: false,
      quitDate: '',
      military: false,
      flyingHazard: false,
      dutyAircraft: '',
      rider: '',
      isStudent: false
    };
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        familyMembers: [...(prev.incomeProtection?.familyMembers || []), newMember]
      }
    }));
  };

  const removeFamilyMember = (index) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      incomeProtection: {
        ...prev.incomeProtection,
        familyMembers: prev.incomeProtection?.familyMembers?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const updateFamilyMember = (index, field, value) => {
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

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold mb-6">Income Protection</h2>

      {/* Applicant Information */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Applicant Information</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="First Name"
              value={incomeProtection.applicant?.firstName}
              onChange={(value) => updateIncomeProtection('applicant.firstName', value)}
              required
            />
            <InputField
              label="Middle Initial"
              value={incomeProtection.applicant?.middleInitial}
              onChange={(value) => updateIncomeProtection('applicant.middleInitial', value)}
            />
            <InputField
              label="Last Name"
              value={incomeProtection.applicant?.lastName}
              onChange={(value) => updateIncomeProtection('applicant.lastName', value)}
              required
            />
            <InputField
              label="Address"
              value={incomeProtection.applicant?.address}
              onChange={(value) => updateIncomeProtection('applicant.address', value)}
              className="md:col-span-3"
            />
            <InputField
              label="City"
              value={incomeProtection.applicant?.city}
              onChange={(value) => updateIncomeProtection('applicant.city', value)}
            />
            <InputField
              label="State"
              value={incomeProtection.applicant?.state}
              onChange={(value) => updateIncomeProtection('applicant.state', value)}
            />
            <InputField
              label="ZIP Code"
              value={incomeProtection.applicant?.zip}
              onChange={(value) => updateIncomeProtection('applicant.zip', value)}
            />
            <InputField
              label="Date In"
              type="date"
              value={incomeProtection.applicant?.dateIn}
              onChange={(value) => updateIncomeProtection('applicant.dateIn', value)}
            />
            <InputField
              label="Time In"
              type="time"
              value={incomeProtection.applicant?.timeIn}
              onChange={(value) => updateIncomeProtection('applicant.timeIn', value)}
            />
            <InputField
              label="Agent"
              value={incomeProtection.applicant?.agent}
              onChange={(value) => updateIncomeProtection('applicant.agent', value)}
            />
            <InputField
              label="Field Trainer"
              value={incomeProtection.applicant?.fieldTrainer}
              onChange={(value) => updateIncomeProtection('applicant.fieldTrainer', value)}
            />
            <InputField
              label="Referring Agent"
              value={incomeProtection.applicant?.referringAgent}
              onChange={(value) => updateIncomeProtection('applicant.referringAgent', value)}
            />
          </div>
        </div>
      </div>

      {/* Co-Applicant Information */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Co-Applicant Information</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="First Name"
              value={incomeProtection.coApplicant?.firstName}
              onChange={(value) => updateIncomeProtection('coApplicant.firstName', value)}
            />
            <InputField
              label="Middle Initial"
              value={incomeProtection.coApplicant?.middleInitial}
              onChange={(value) => updateIncomeProtection('coApplicant.middleInitial', value)}
            />
            <InputField
              label="Last Name"
              value={incomeProtection.coApplicant?.lastName}
              onChange={(value) => updateIncomeProtection('coApplicant.lastName', value)}
            />
          </div>
        </div>
      </div>

      {/* Bank Comparison */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Bank Comparison</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank A */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Bank A</h4>
              <div className="space-y-3">
                <InputField
                  label="Provider"
                  value={incomeProtection.bankComparison?.bankA?.provider}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankA.provider', value)}
                />
                <InputField
                  label="Face Amount"
                  type="number"
                  value={incomeProtection.bankComparison?.bankA?.faceAmount}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankA.faceAmount', parseFloat(value) || 0)}
                />
                <SelectField
                  label="Insurance Type"
                  value={incomeProtection.bankComparison?.bankA?.insuranceType}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankA.insuranceType', value)}
                  options={[
                    { value: 'Term', label: 'Term' },
                    { value: 'Whole', label: 'Whole Life' },
                    { value: 'Universal', label: 'Universal Life' }
                  ]}
                />
                <InputField
                  label="Term (Years)"
                  type="number"
                  value={incomeProtection.bankComparison?.bankA?.term}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankA.term', parseInt(value) || 0)}
                />
                <InputField
                  label="Monthly Premium"
                  type="number"
                 // step="0.01"
                  value={incomeProtection.bankComparison?.bankA?.monthlyPremium}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankA.monthlyPremium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Annual Premium"
                  type="number"
                 // step="0.01"
                  value={incomeProtection.bankComparison?.bankA?.annualPremium}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankA.annualPremium', parseFloat(value) || 0)}
                />
              </div>
            </div>

            {/* Bank B */}
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Bank B</h4>
              <div className="space-y-3">
                <InputField
                  label="Provider"
                  value={incomeProtection.bankComparison?.bankB?.provider}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankB.provider', value)}
                />
                <InputField
                  label="Face Amount"
                  type="number"
                  value={incomeProtection.bankComparison?.bankB?.faceAmount}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankB.faceAmount', parseFloat(value) || 0)}
                />
                <SelectField
                  label="Insurance Type"
                  value={incomeProtection.bankComparison?.bankB?.insuranceType}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankB.insuranceType', value)}
                  options={[
                    { value: 'Term', label: 'Term' },
                    { value: 'Whole', label: 'Whole Life' },
                    { value: 'Universal', label: 'Universal Life' }
                  ]}
                />
                <InputField
                  label="Term (Years)"
                  type="number"
                  value={incomeProtection.bankComparison?.bankB?.term}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankB.term', parseInt(value) || 0)}
                />
                <InputField
                  label="Monthly Premium"
                  type="number"
                 // step="0.01"
                  value={incomeProtection.bankComparison?.bankB?.monthlyPremium}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankB.monthlyPremium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Annual Premium"
                  type="number"
                 // step="0.01"
                  value={incomeProtection.bankComparison?.bankB?.annualPremium}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankB.annualPremium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Savings"
                  type="number"
                 // step="0.01"
                  value={incomeProtection.bankComparison?.bankB?.savings}
                  onChange={(value) => updateIncomeProtection('bankComparison.bankB.savings', parseFloat(value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Application Details</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Application Date"
              type="date"
              value={incomeProtection.applicationDetails?.applicationDate}
              onChange={(value) => updateIncomeProtection('applicationDetails.applicationDate', value)}
            />
            <InputField
              label="Policy Number"
              value={incomeProtection.applicationDetails?.policyNumber}
              onChange={(value) => updateIncomeProtection('applicationDetails.policyNumber', value)}
            />
            <SelectField
              label="Rating"
              value={incomeProtection.applicationDetails?.rating}
              onChange={(value) => updateIncomeProtection('applicationDetails.rating', value)}
              options={[
                { value: 'Preferred', label: 'Preferred' },
                { value: 'Standard', label: 'Standard' },
                { value: 'Substandard', label: 'Substandard' }
              ]}
            />
            <SelectField
              label="Table Rating"
              value={incomeProtection.applicationDetails?.tableRating}
              onChange={(value) => updateIncomeProtection('applicationDetails.tableRating', value)}
              options={[
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' },
                { value: 'D', label: 'D' }
              ]}
            />
            <SelectField
              label="Policy Status"
              value={incomeProtection.applicationDetails?.policyStatus}
              onChange={(value) => updateIncomeProtection('applicationDetails.policyStatus', value)}
              options={[
                { value: 'Approved', label: 'Approved' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Declined', label: 'Declined' }
              ]}
            />
            <InputField
              label="Status Date"
              type="date"
              value={incomeProtection.applicationDetails?.statusDate}
              onChange={(value) => updateIncomeProtection('applicationDetails.statusDate', value)}
            />
            <InputField
              label="Issue Date"
              type="date"
              value={incomeProtection.applicationDetails?.issueDate}
              onChange={(value) => updateIncomeProtection('applicationDetails.issueDate', value)}
            />
            <InputField
              label="Disburse Date"
              type="date"
              value={incomeProtection.applicationDetails?.disburseDate}
              onChange={(value) => updateIncomeProtection('applicationDetails.disburseDate', value)}
            />
            <InputField
              label="Number of Units"
              type="number"
              value={incomeProtection.applicationDetails?.numberOfUnits}
              onChange={(value) => updateIncomeProtection('applicationDetails.numberOfUnits', parseInt(value) || 0)}
            />
            <InputField
              label="Processing Manager"
              value={incomeProtection.applicationDetails?.processingManager}
              onChange={(value) => updateIncomeProtection('applicationDetails.processingManager', value)}
            />
            <InputField
              label="DFT"
              value={incomeProtection.applicationDetails?.dft}
              onChange={(value) => updateIncomeProtection('applicationDetails.dft', value)}
            />
            <InputField
              label="DFT No"
              value={incomeProtection.applicationDetails?.dftNo}
              onChange={(value) => updateIncomeProtection('applicationDetails.dftNo', value)}
            />
            <InputField
              label="Gross Annual Premium"
              type="number"
                 // step="0.01"
              value={incomeProtection.applicationDetails?.grossAnnualPremium}
              onChange={(value) => updateIncomeProtection('applicationDetails.grossAnnualPremium', parseFloat(value) || 0)}
            />
            <InputField
              label="GAP"
              type="number"
                 // step="0.01"
              value={incomeProtection.applicationDetails?.gap}
              onChange={(value) => updateIncomeProtection('applicationDetails.gap', parseFloat(value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Family Members</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addFamilyMember}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          {(incomeProtection.familyMembers || []).map((member, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 relative">
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeFamilyMember(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField
                  label="Name"
                  value={member.name}
                  onChange={(value) => updateFamilyMember(index, 'name', value)}
                />
                <InputField
                  label="Date of Birth"
                  type="date"
                  value={member.dob}
                  onChange={(value) => updateFamilyMember(index, 'dob', value)}
                />
                <InputField
                  label="Age"
                  type="number"
                  value={member.age}
                  onChange={(value) => updateFamilyMember(index, 'age', parseInt(value) || 0)}
                />
                <SelectField
                  label="Sex"
                  value={member.sex}
                  onChange={(value) => updateFamilyMember(index, 'sex', value)}
                  options={[
                    { value: 'M', label: 'Male' },
                    { value: 'F', label: 'Female' }
                  ]}
                />
                <InputField
                  label="Relationship"
                  value={member.relationship}
                  onChange={(value) => updateFamilyMember(index, 'relationship', value)}
                />
                <InputField
                  label="SSN"
                  value={member.ssn}
                  onChange={(value) => updateFamilyMember(index, 'ssn', value)}
                />
                <InputField
                  label="Height"
                  value={member.height}
                  onChange={(value) => updateFamilyMember(index, 'height', value)}
                />
                <InputField
                  label="Weight"
                  value={member.weight}
                  onChange={(value) => updateFamilyMember(index, 'weight', value)}
                />
                <CheckboxField
                  label="Tobacco"
                  checked={member.tobacco}
                  onChange={(value) => updateFamilyMember(index, 'tobacco', value)}
                />
                <InputField
                  label="Quit Date"
                  type="date"
                  value={member.quitDate}
                  onChange={(value) => updateFamilyMember(index, 'quitDate', value)}
                />
                <CheckboxField
                  label="Military"
                  checked={member.military}
                  onChange={(value) => updateFamilyMember(index, 'military', value)}
                />
                <CheckboxField
                  label="Flying Hazard"
                  checked={member.flyingHazard}
                  onChange={(value) => updateFamilyMember(index, 'flyingHazard', value)}
                />
                <InputField
                  label="Duty Aircraft"
                  value={member.dutyAircraft}
                  onChange={(value) => updateFamilyMember(index, 'dutyAircraft', value)}
                />
                <InputField
                  label="Rider"
                  value={member.rider}
                  onChange={(value) => updateFamilyMember(index, 'rider', value)}
                />
                <CheckboxField
                  label="Is Student"
                  checked={member.isStudent}
                  onChange={(value) => updateFamilyMember(index, 'isStudent', value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Owner Information */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Owner Information</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Name"
              value={incomeProtection.owner?.name}
              onChange={(value) => updateIncomeProtection('owner.name', value)}
            />
            <InputField
              label="Relationship"
              value={incomeProtection.owner?.relationship}
              onChange={(value) => updateIncomeProtection('owner.relationship', value)}
            />
            <InputField
              label="Address"
              value={incomeProtection.owner?.address}
              onChange={(value) => updateIncomeProtection('owner.address', value)}
              className="md:col-span-2"
            />
            <InputField
              label="SSN"
              value={incomeProtection.owner?.ssn}
              onChange={(value) => updateIncomeProtection('owner.ssn', value)}
            />
          </div>
        </div>
      </div>

      {/* Process Milestones */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Process Milestones</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <InputField
              label="Parameds Ordered"
              type="date"
              value={incomeProtection.processMilestones?.paramedsOrdered}
              onChange={(value) => updateIncomeProtection('processMilestones.paramedsOrdered', value)}
            />
            <InputField
              label="Parameds Scheduled"
              type="date"
              value={incomeProtection.processMilestones?.paramedsScheduled}
              onChange={(value) => updateIncomeProtection('processMilestones.paramedsScheduled', value)}
            />
            <InputField
              label="Parameds Decisioned"
              type="date"
              value={incomeProtection.processMilestones?.paramedsDecisioned}
              onChange={(value) => updateIncomeProtection('processMilestones.paramedsDecisioned', value)}
            />
            <InputField
              label="Parameds Completed"
              type="date"
              value={incomeProtection.processMilestones?.paramedsCompleted}
              onChange={(value) => updateIncomeProtection('processMilestones.paramedsCompleted', value)}
            />
            <InputField
              label="APS Ordered"
              type="date"
              value={incomeProtection.processMilestones?.apsOrdered}
              onChange={(value) => updateIncomeProtection('processMilestones.apsOrdered', value)}
            />
            <InputField
              label="APS Decisioned"
              type="date"
              value={incomeProtection.processMilestones?.apsDecisioned}
              onChange={(value) => updateIncomeProtection('processMilestones.apsDecisioned', value)}
            />
            <InputField
              label="Issued Date"
              type="date"
              value={incomeProtection.processMilestones?.issuedDate}
              onChange={(value) => updateIncomeProtection('processMilestones.issuedDate', value)}
            />
            <InputField
              label="Approved Rating"
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