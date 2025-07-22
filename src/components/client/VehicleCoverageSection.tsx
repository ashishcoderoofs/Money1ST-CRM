import React from 'react';
import { Plus, X } from 'lucide-react';

const VehicleCoverageSection = ({ formData, setFormData, isReadOnly }) => {
  const vehicleCoverage = formData.vehicleCoverage || {};

  const updateVehicleCoverage = (path, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.vehicleCoverage) {
        newData.vehicleCoverage = {};
      }
      
      // Handle nested path updates
      const pathArray = path.split('.');
      let current = newData.vehicleCoverage;
      
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

  const addHouseholdMember = () => {
    if (isReadOnly) return;
    
    const newMember = {
      firstName: '',
      middleInitial: '',
      lastName: '',
      sex: '',
      dob: '',
      age: '',
      ssn: '',
      relationship: '',
      maritalStatus: '',
      drivingStatus: '',
      licenseNumber: '',
      state: '',
      accidentsOrViolations: ''
    };
    
    setFormData(prev => ({
      ...prev,
      vehicleCoverage: {
        ...prev.vehicleCoverage,
        householdMembers: [...(prev.vehicleCoverage?.householdMembers || []), newMember]
      }
    }));
  };

  const removeHouseholdMember = (index) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      vehicleCoverage: {
        ...prev.vehicleCoverage,
        householdMembers: prev.vehicleCoverage?.householdMembers?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const updateHouseholdMember = (index, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      vehicleCoverage: {
        ...prev.vehicleCoverage,
        householdMembers: prev.vehicleCoverage?.householdMembers?.map((member, i) => 
          i === index ? { ...member, [field]: value } : member
        ) || []
      }
    }));
  };

  const addVehicle = (section) => {
    if (isReadOnly) return;
    
    const newVehicle = {
      year: '',
      make: '',
      model: '',
      vin: '',
      premium: '',
      comprehensive: '',
      collision: '',
      bodilyInjury: '',
      propertyDamage: '',
      medicalPayment: '',
      towing: '',
      rental: ''
    };
    
    setFormData(prev => ({
      ...prev,
      vehicleCoverage: {
        ...prev.vehicleCoverage,
        [section]: {
          ...prev.vehicleCoverage?.[section],
          bankA: section === 'currentVehicleCoverage' ? [...(prev.vehicleCoverage?.[section]?.bankA || []), newVehicle] : prev.vehicleCoverage?.[section]?.bankA,
          bankB: section === 'proposedVehicleCoverage' ? [...(prev.vehicleCoverage?.[section]?.bankB || []), newVehicle] : prev.vehicleCoverage?.[section]?.bankB
        }
      }
    }));
  };

  const removeVehicle = (section, bank, index) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      vehicleCoverage: {
        ...prev.vehicleCoverage,
        [section]: {
          ...prev.vehicleCoverage?.[section],
          [bank]: prev.vehicleCoverage?.[section]?.[bank]?.filter((_, i) => i !== index) || []
        }
      }
    }));
  };

  const updateVehicle = (section, bank, index, field, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      vehicleCoverage: {
        ...prev.vehicleCoverage,
        [section]: {
          ...prev.vehicleCoverage?.[section],
          [bank]: prev.vehicleCoverage?.[section]?.[bank]?.map((vehicle, i) => 
            i === index ? { ...vehicle, [field]: value } : vehicle
          ) || []
        }
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
      <h2 className="text-2xl font-semibold mb-6">Vehicle Coverage</h2>

      {/* Applicant Information */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Applicant Information</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="First Name"
              value={vehicleCoverage.applicant?.firstName}
              onChange={(value) => updateVehicleCoverage('applicant.firstName', value)}
              required
            />
            <InputField
              label="Middle Initial"
              value={vehicleCoverage.applicant?.middleInitial}
              onChange={(value) => updateVehicleCoverage('applicant.middleInitial', value)}
            />
            <InputField
              label="Last Name"
              value={vehicleCoverage.applicant?.lastName}
              onChange={(value) => updateVehicleCoverage('applicant.lastName', value)}
              required
            />
            <InputField
              label="Address"
              value={vehicleCoverage.applicant?.address}
              onChange={(value) => updateVehicleCoverage('applicant.address', value)}
              className="md:col-span-3"
            />
            <InputField
              label="City"
              value={vehicleCoverage.applicant?.city}
              onChange={(value) => updateVehicleCoverage('applicant.city', value)}
            />
            <InputField
              label="State"
              value={vehicleCoverage.applicant?.state}
              onChange={(value) => updateVehicleCoverage('applicant.state', value)}
            />
            <InputField
              label="ZIP Code"
              value={vehicleCoverage.applicant?.zip}
              onChange={(value) => updateVehicleCoverage('applicant.zip', value)}
            />
            <InputField
              label="Date In"
              type="date"
              value={vehicleCoverage.applicant?.dateIn}
              onChange={(value) => updateVehicleCoverage('applicant.dateIn', value)}
            />
            <InputField
              label="Time In"
              type="time"
              value={vehicleCoverage.applicant?.timeIn}
              onChange={(value) => updateVehicleCoverage('applicant.timeIn', value)}
            />
            <InputField
              label="Field Trainer"
              value={vehicleCoverage.applicant?.fieldTrainer}
              onChange={(value) => updateVehicleCoverage('applicant.fieldTrainer', value)}
            />
            <InputField
              label="BMA"
              value={vehicleCoverage.applicant?.bma}
              onChange={(value) => updateVehicleCoverage('applicant.bma', value)}
            />
            <SelectField
              label="State Licensed"
              value={vehicleCoverage.applicant?.stateLicensed}
              onChange={(value) => updateVehicleCoverage('applicant.stateLicensed', value)}
              options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' }
              ]}
            />
          </div>

          {/* Co-Applicant */}
          <div className="mt-6">
            <h4 className="font-medium mb-4">Co-Applicant</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="First Name"
                value={vehicleCoverage.applicant?.coApplicant?.firstName}
                onChange={(value) => updateVehicleCoverage('applicant.coApplicant.firstName', value)}
              />
              <InputField
                label="Middle Initial"
                value={vehicleCoverage.applicant?.coApplicant?.middleInitial}
                onChange={(value) => updateVehicleCoverage('applicant.coApplicant.middleInitial', value)}
              />
              <InputField
                label="Last Name"
                value={vehicleCoverage.applicant?.coApplicant?.lastName}
                onChange={(value) => updateVehicleCoverage('applicant.coApplicant.lastName', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Details */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Insurance Comparison</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank A */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Current Provider (Bank A)</h4>
              <div className="space-y-3">
                <InputField
                  label="Carrier"
                  value={vehicleCoverage.insuranceDetails?.bankA?.carrier}
                  onChange={(value) => updateVehicleCoverage('insuranceDetails.bankA.carrier', value)}
                />
                <InputField
                  label="Six Month Premium"
                  type="number"
                 // step="0.01"
                  value={vehicleCoverage.insuranceDetails?.bankA?.sixMonthPremium}
                  onChange={(value) => updateVehicleCoverage('insuranceDetails.bankA.sixMonthPremium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Annual Premium"
                  type="number"
                 // step="0.01"
                  value={vehicleCoverage.insuranceDetails?.bankA?.annualPremium}
                  onChange={(value) => updateVehicleCoverage('insuranceDetails.bankA.annualPremium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Savings"
                  type="number"
                 // step="0.01"
                  value={vehicleCoverage.insuranceDetails?.bankA?.savings}
                  onChange={(value) => updateVehicleCoverage('insuranceDetails.bankA.savings', parseFloat(value) || 0)}
                />
              </div>
            </div>

            {/* Bank B */}
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Proposed Provider (Bank B)</h4>
              <div className="space-y-3">
                <InputField
                  label="Carrier"
                  value={vehicleCoverage.insuranceDetails?.bankB?.carrier}
                  onChange={(value) => updateVehicleCoverage('insuranceDetails.bankB.carrier', value)}
                />
                <InputField
                  label="Six Month Premium"
                  type="number"
                 // step="0.01"
                  value={vehicleCoverage.insuranceDetails?.bankB?.sixMonthPremium}
                  onChange={(value) => updateVehicleCoverage('insuranceDetails.bankB.sixMonthPremium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Annual Premium"
                  type="number"
                 // step="0.01"
                  value={vehicleCoverage.insuranceDetails?.bankB?.annualPremium}
                  onChange={(value) => updateVehicleCoverage('insuranceDetails.bankB.annualPremium', parseFloat(value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="mt-6">
            <h4 className="font-medium mb-4">Application Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Application Date"
                type="date"
                value={vehicleCoverage.insuranceDetails?.application?.applicationDate}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.applicationDate', value)}
              />
              <SelectField
                label="Status"
                value={vehicleCoverage.insuranceDetails?.application?.status}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.status', value)}
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Declined', label: 'Declined' }
                ]}
              />
              <InputField
                label="Status Date"
                type="date"
                value={vehicleCoverage.insuranceDetails?.application?.statusDate}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.statusDate', value)}
              />
              <InputField
                label="Issue Date"
                type="date"
                value={vehicleCoverage.insuranceDetails?.application?.issueDate}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.issueDate', value)}
              />
              <InputField
                label="Disburse Date"
                type="date"
                value={vehicleCoverage.insuranceDetails?.application?.disburseDate}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.disburseDate', value)}
              />
              <InputField
                label="DFT"
                value={vehicleCoverage.insuranceDetails?.application?.dft}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.dft', value)}
              />
              <InputField
                label="DFT No"
                value={vehicleCoverage.insuranceDetails?.application?.dftNo}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.dftNo', value)}
              />
              <InputField
                label="Number of Units"
                type="number"
                value={vehicleCoverage.insuranceDetails?.application?.numberOfUnits}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.numberOfUnits', parseInt(value) || 0)}
              />
              <InputField
                label="Expiration Date"
                type="date"
                value={vehicleCoverage.insuranceDetails?.application?.expirationDate}
                onChange={(value) => updateVehicleCoverage('insuranceDetails.application.expirationDate', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Household Members */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Household Members (Drivers)</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addHouseholdMember}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3"
              >
                <Plus className="w-4 h-4" />
                Add Driver
              </button>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          {(vehicleCoverage.householdMembers || []).map((member, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 relative">
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeHouseholdMember(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField
                  label="First Name"
                  value={member.firstName}
                  onChange={(value) => updateHouseholdMember(index, 'firstName', value)}
                />
                <InputField
                  label="Middle Initial"
                  value={member.middleInitial}
                  onChange={(value) => updateHouseholdMember(index, 'middleInitial', value)}
                />
                <InputField
                  label="Last Name"
                  value={member.lastName}
                  onChange={(value) => updateHouseholdMember(index, 'lastName', value)}
                />
                <SelectField
                  label="Sex"
                  value={member.sex}
                  onChange={(value) => updateHouseholdMember(index, 'sex', value)}
                  options={[
                    { value: 'M', label: 'Male' },
                    { value: 'F', label: 'Female' }
                  ]}
                />
                <InputField
                  label="Date of Birth"
                  type="date"
                  value={member.dob}
                  onChange={(value) => updateHouseholdMember(index, 'dob', value)}
                />
                <InputField
                  label="Age"
                  type="number"
                  value={member.age}
                  onChange={(value) => updateHouseholdMember(index, 'age', parseInt(value) || 0)}
                />
                <InputField
                  label="SSN"
                  value={member.ssn}
                  onChange={(value) => updateHouseholdMember(index, 'ssn', value)}
                />
                <InputField
                  label="Relationship"
                  value={member.relationship}
                  onChange={(value) => updateHouseholdMember(index, 'relationship', value)}
                />
                <SelectField
                  label="Marital Status"
                  value={member.maritalStatus}
                  onChange={(value) => updateHouseholdMember(index, 'maritalStatus', value)}
                  options={[
                    { value: 'Single', label: 'Single' },
                    { value: 'Married', label: 'Married' },
                    { value: 'Divorced', label: 'Divorced' },
                    { value: 'Widowed', label: 'Widowed' }
                  ]}
                />
                <SelectField
                  label="Driving Status"
                  value={member.drivingStatus}
                  onChange={(value) => updateHouseholdMember(index, 'drivingStatus', value)}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                    { value: 'Suspended', label: 'Suspended' }
                  ]}
                />
                <InputField
                  label="License Number"
                  value={member.licenseNumber}
                  onChange={(value) => updateHouseholdMember(index, 'licenseNumber', value)}
                />
                <InputField
                  label="State"
                  value={member.state}
                  onChange={(value) => updateHouseholdMember(index, 'state', value)}
                />
                <InputField
                  label="Accidents or Violations"
                  value={member.accidentsOrViolations}
                  onChange={(value) => updateHouseholdMember(index, 'accidentsOrViolations', value)}
                  className="md:col-span-4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Vehicle Coverage */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Current Vehicle Coverage (Bank A)</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => addVehicle('currentVehicleCoverage')}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3"
              >
                <Plus className="w-4 h-4" />
                Add Vehicle
              </button>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="mb-4">
            <InputField
              label="Number of Vehicles"
              type="number"
              value={vehicleCoverage.currentVehicleCoverage?.numberOfVehicles}
              onChange={(value) => updateVehicleCoverage('currentVehicleCoverage.numberOfVehicles', parseInt(value) || 0)}
              className="w-32"
            />
          </div>
          {(vehicleCoverage.currentVehicleCoverage?.bankA || []).map((vehicle, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 relative">
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeVehicle('currentVehicleCoverage', 'bankA', index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField
                  label="Year"
                  type="number"
                  value={vehicle.year}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'year', parseInt(value) || 0)}
                />
                <InputField
                  label="Make"
                  value={vehicle.make}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'make', value)}
                />
                <InputField
                  label="Model"
                  value={vehicle.model}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'model', value)}
                />
                <InputField
                  label="VIN"
                  value={vehicle.vin}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'vin', value)}
                />
                <InputField
                  label="Premium"
                  type="number"
                 // step="0.01"
                  value={vehicle.premium}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'premium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Comprehensive"
                  type="number"
                 // step="0.01"
                  value={vehicle.comprehensive}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'comprehensive', parseFloat(value) || 0)}
                />
                <InputField
                  label="Collision"
                  type="number"
                 // step="0.01"
                  value={vehicle.collision}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'collision', parseFloat(value) || 0)}
                />
                <InputField
                  label="Bodily Injury"
                  type="number"
                  value={vehicle.bodilyInjury}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'bodilyInjury', parseInt(value) || 0)}
                />
                <InputField
                  label="Property Damage"
                  type="number"
                  value={vehicle.propertyDamage}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'propertyDamage', parseInt(value) || 0)}
                />
                <InputField
                  label="Medical Payment"
                  type="number"
                  value={vehicle.medicalPayment}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'medicalPayment', parseInt(value) || 0)}
                />
                <InputField
                  label="Towing"
                  type="number"
                 // step="0.01"
                  value={vehicle.towing}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'towing', parseFloat(value) || 0)}
                />
                <InputField
                  label="Rental"
                  type="number"
                 // step="0.01"
                  value={vehicle.rental}
                  onChange={(value) => updateVehicle('currentVehicleCoverage', 'bankA', index, 'rental', parseFloat(value) || 0)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposed Vehicle Coverage */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Proposed Vehicle Coverage (Bank B)</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => addVehicle('proposedVehicleCoverage')}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 h-9 px-3"
              >
                <Plus className="w-4 h-4" />
                Add Vehicle
              </button>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="mb-4">
            <InputField
              label="Number of Vehicles"
              type="number"
              value={vehicleCoverage.proposedVehicleCoverage?.numberOfVehicles}
              onChange={(value) => updateVehicleCoverage('proposedVehicleCoverage.numberOfVehicles', parseInt(value) || 0)}
              className="w-32"
            />
          </div>
          {(vehicleCoverage.proposedVehicleCoverage?.bankB || []).map((vehicle, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 relative">
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeVehicle('proposedVehicleCoverage', 'bankB', index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField
                  label="Year"
                  type="number"
                  value={vehicle.year}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'year', parseInt(value) || 0)}
                />
                <InputField
                  label="Make"
                  value={vehicle.make}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'make', value)}
                />
                <InputField
                  label="Model"
                  value={vehicle.model}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'model', value)}
                />
                <InputField
                  label="VIN"
                  value={vehicle.vin}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'vin', value)}
                />
                <InputField
                  label="Premium"
                  type="number"
                 // step="0.01"
                  value={vehicle.premium}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'premium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Comprehensive"
                  type="number"
                 // step="0.01"
                  value={vehicle.comprehensive}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'comprehensive', parseFloat(value) || 0)}
                />
                <InputField
                  label="Collision"
                  type="number"
                 // step="0.01"
                  value={vehicle.collision}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'collision', parseFloat(value) || 0)}
                />
                <InputField
                  label="Bodily Injury"
                  type="number"
                  value={vehicle.bodilyInjury}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'bodilyInjury', parseInt(value) || 0)}
                />
                <InputField
                  label="Property Damage"
                  type="number"
                  value={vehicle.propertyDamage}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'propertyDamage', parseInt(value) || 0)}
                />
                <InputField
                  label="Medical Payment"
                  type="number"
                  value={vehicle.medicalPayment}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'medicalPayment', parseInt(value) || 0)}
                />
                <InputField
                  label="Towing"
                  type="number"
                 // step="0.01"
                  value={vehicle.towing}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'towing', parseFloat(value) || 0)}
                />
                <InputField
                  label="Rental"
                  type="number"
                 // step="0.01"
                  value={vehicle.rental}
                  onChange={(value) => updateVehicle('proposedVehicleCoverage', 'bankB', index, 'rental', parseFloat(value) || 0)}
                />
              </div>
            </div>
          ))}
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
              label="Final Quote Sent to UW"
              type="date"
              value={vehicleCoverage.processMilestones?.finalQuoteSentToUW}
              onChange={(value) => updateVehicleCoverage('processMilestones.finalQuoteSentToUW', value)}
            />
            <InputField
              label="Final Quote Received"
              type="date"
              value={vehicleCoverage.processMilestones?.finalQuoteReceived}
              onChange={(value) => updateVehicleCoverage('processMilestones.finalQuoteReceived', value)}
            />
            <InputField
              label="Final Quote Expires"
              type="date"
              value={vehicleCoverage.processMilestones?.finalQuoteExpires}
              onChange={(value) => updateVehicleCoverage('processMilestones.finalQuoteExpires', value)}
            />
            <InputField
              label="Final Quote Client Review Date"
              type="date"
              value={vehicleCoverage.processMilestones?.finalQuoteClientReviewDate}
              onChange={(value) => updateVehicleCoverage('processMilestones.finalQuoteClientReviewDate', value)}
            />
            <SelectField
              label="Client Decision"
              value={vehicleCoverage.processMilestones?.clientDecision}
              onChange={(value) => updateVehicleCoverage('processMilestones.clientDecision', value)}
              options={[
                { value: 'Accepted', label: 'Accepted' },
                { value: 'Declined', label: 'Declined' },
                { value: 'Pending', label: 'Pending' }
              ]}
            />
            <InputField
              label="Date Binded"
              type="date"
              value={vehicleCoverage.processMilestones?.dateBinded}
              onChange={(value) => updateVehicleCoverage('processMilestones.dateBinded', value)}
            />
            <InputField
              label="Net Annual Premium"
              type="number"
                 // step="0.01"
              value={vehicleCoverage.processMilestones?.netAnnualPremium}
              onChange={(value) => updateVehicleCoverage('processMilestones.netAnnualPremium', parseFloat(value) || 0)}
            />
            <InputField
              label="Total Annual Premium"
              type="number"
                 // step="0.01"
              value={vehicleCoverage.processMilestones?.totalAnnualPremium}
              onChange={(value) => updateVehicleCoverage('processMilestones.totalAnnualPremium', parseFloat(value) || 0)}
            />
            <CheckboxField
              label="Binded Premium Paid"
              checked={vehicleCoverage.processMilestones?.bindedPremiumPaid}
              onChange={(value) => updateVehicleCoverage('processMilestones.bindedPremiumPaid', value)}
            />
            <CheckboxField
              label="Auto Premium Paid"
              checked={vehicleCoverage.processMilestones?.autoPremiumPaid}
              onChange={(value) => updateVehicleCoverage('processMilestones.autoPremiumPaid', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCoverageSection;