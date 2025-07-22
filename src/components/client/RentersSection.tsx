import React from 'react';

const RentersSection = ({ formData, setFormData, isReadOnly }) => {
  const renters = formData.renters || {};

  const updateRenters = (path, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.renters) {
        newData.renters = {};
      }
      
      // Handle nested path updates
      const pathArray = path.split('.');
      let current = newData.renters;
      
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
      <h2 className="text-2xl font-semibold mb-6">Renters Insurance</h2>

      {/* Applicant Information */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Applicant Information</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant */}
            <div className="space-y-4">
              <h4 className="font-medium">Applicant</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="First Name"
                  value={renters.applicant?.firstName}
                  onChange={(value) => updateRenters('applicant.firstName', value)}
                  required
                />
                <InputField
                  label="Middle Initial"
                  value={renters.applicant?.middleInitial}
                  onChange={(value) => updateRenters('applicant.middleInitial', value)}
                />
                <InputField
                  label="Last Name"
                  value={renters.applicant?.lastName}
                  onChange={(value) => updateRenters('applicant.lastName', value)}
                  required
                />
              </div>
            </div>

            {/* Co-Applicant */}
            <div className="space-y-4">
              <h4 className="font-medium">Co-Applicant</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="First Name"
                  value={renters.coApplicant?.firstName}
                  onChange={(value) => updateRenters('coApplicant.firstName', value)}
                />
                <InputField
                  label="Middle Initial"
                  value={renters.coApplicant?.middleInitial}
                  onChange={(value) => updateRenters('coApplicant.middleInitial', value)}
                />
                <InputField
                  label="Last Name"
                  value={renters.coApplicant?.lastName}
                  onChange={(value) => updateRenters('coApplicant.lastName', value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6">
            <h4 className="font-medium mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InputField
                label="Address"
                value={renters.contactInfo?.address}
                onChange={(value) => updateRenters('contactInfo.address', value)}
                className="md:col-span-2"
              />
              <InputField
                label="City"
                value={renters.contactInfo?.city}
                onChange={(value) => updateRenters('contactInfo.city', value)}
              />
              <InputField
                label="State"
                value={renters.contactInfo?.state}
                onChange={(value) => updateRenters('contactInfo.state', value)}
              />
              <InputField
                label="ZIP Code"
                value={renters.contactInfo?.zip}
                onChange={(value) => updateRenters('contactInfo.zip', value)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6">
            <h4 className="font-medium mb-4">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Date In"
                type="date"
                value={renters.additionalInfo?.dateIn}
                onChange={(value) => updateRenters('additionalInfo.dateIn', value)}
              />
              <InputField
                label="Time In"
                type="time"
                value={renters.additionalInfo?.timeIn}
                onChange={(value) => updateRenters('additionalInfo.timeIn', value)}
              />
              <InputField
                label="Field Trainer"
                value={renters.additionalInfo?.fieldTrainer}
                onChange={(value) => updateRenters('additionalInfo.fieldTrainer', value)}
              />
              <InputField
                label="BMA"
                value={renters.additionalInfo?.BMA}
                onChange={(value) => updateRenters('additionalInfo.BMA', value)}
              />
              <SelectField
                label="State Licensed"
                value={renters.additionalInfo?.stateLicensed}
                onChange={(value) => updateRenters('additionalInfo.stateLicensed', value)}
                options={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bank Information & Comparison */}
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
                  value={renters.bankInfo?.bankA?.carrier}
                  onChange={(value) => updateRenters('bankInfo.bankA.carrier', value)}
                />
                <InputField
                  label="Premium"
                  type="number"
                  step="0.01"
                  value={renters.bankInfo?.bankA?.premium}
                  onChange={(value) => updateRenters('bankInfo.bankA.premium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Expiration Date"
                  type="date"
                  value={renters.bankInfo?.bankA?.expirationDate}
                  onChange={(value) => updateRenters('bankInfo.bankA.expirationDate', value)}
                />
                <InputField
                  label="Savings"
                  type="number"
                  step="0.01"
                  value={renters.bankInfo?.bankA?.savings}
                  onChange={(value) => updateRenters('bankInfo.bankA.savings', parseFloat(value) || 0)}
                />
              </div>
            </div>

            {/* Bank B */}
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Proposed Provider (Bank B)</h4>
              <div className="space-y-3">
                <InputField
                  label="Carrier"
                  value={renters.bankInfo?.bankB?.carrier}
                  onChange={(value) => updateRenters('bankInfo.bankB.carrier', value)}
                />
                <InputField
                  label="Premium"
                  type="number"
                  step="0.01"
                  value={renters.bankInfo?.bankB?.premium}
                  onChange={(value) => updateRenters('bankInfo.bankB.premium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Expiration Date"
                  type="date"
                  value={renters.bankInfo?.bankB?.expirationDate}
                  onChange={(value) => updateRenters('bankInfo.bankB.expirationDate', value)}
                />
                <InputField
                  label="Savings"
                  type="number"
                  step="0.01"
                  value={renters.bankInfo?.bankB?.savings}
                  onChange={(value) => updateRenters('bankInfo.bankB.savings', parseFloat(value) || 0)}
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
              value={renters.applicationDetails?.applicationDate}
              onChange={(value) => updateRenters('applicationDetails.applicationDate', value)}
            />
            <SelectField
              label="Rent Status"
              value={renters.applicationDetails?.rentStatus}
              onChange={(value) => updateRenters('applicationDetails.rentStatus', value)}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Declined', label: 'Declined' },
                { value: 'In Review', label: 'In Review' }
              ]}
            />
            <InputField
              label="Status Date"
              type="date"
              value={renters.applicationDetails?.statusDate}
              onChange={(value) => updateRenters('applicationDetails.statusDate', value)}
            />
            <InputField
              label="Issue Date"
              type="date"
              value={renters.applicationDetails?.issueDate}
              onChange={(value) => updateRenters('applicationDetails.issueDate', value)}
            />
            <InputField
              label="Policy Number"
              value={renters.applicationDetails?.policyNumber}
              onChange={(value) => updateRenters('applicationDetails.policyNumber', value)}
            />
            <InputField
              label="Disburse Date"
              type="date"
              value={renters.applicationDetails?.disburseDate}
              onChange={(value) => updateRenters('applicationDetails.disburseDate', value)}
            />
            <InputField
              label="DFT"
              value={renters.applicationDetails?.DFT}
              onChange={(value) => updateRenters('applicationDetails.DFT', value)}
            />
            <InputField
              label="DFT No"
              value={renters.applicationDetails?.DFTNo}
              onChange={(value) => updateRenters('applicationDetails.DFTNo', value)}
            />
            <InputField
              label="GAP"
              type="number"
              step="0.01"
              value={renters.applicationDetails?.GAP}
              onChange={(value) => updateRenters('applicationDetails.GAP', parseFloat(value) || 0)}
            />
            <InputField
              label="Number of Units"
              type="number"
              value={renters.applicationDetails?.numberOfUnits}
              onChange={(value) => updateRenters('applicationDetails.numberOfUnits', parseInt(value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Property Characteristics */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Property Characteristics</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Year Built"
              type="number"
              value={renters.propertyCharacteristics?.yearBuilt}
              onChange={(value) => updateRenters('propertyCharacteristics.yearBuilt', parseInt(value) || 0)}
            />
            <InputField
              label="Years at Current Address"
              type="number"
              value={renters.propertyCharacteristics?.yearsAtCurrentAddress}
              onChange={(value) => updateRenters('propertyCharacteristics.yearsAtCurrentAddress', parseInt(value) || 0)}
            />
            <SelectField
              label="Housing Type"
              value={renters.propertyCharacteristics?.housingType}
              onChange={(value) => updateRenters('propertyCharacteristics.housingType', value)}
              options={[
                { value: 'Apartment', label: 'Apartment' },
                { value: 'Townhouse', label: 'Townhouse' },
                { value: 'Condo', label: 'Condo' },
                { value: 'Single Family', label: 'Single Family' },
                { value: 'Duplex', label: 'Duplex' },
                { value: 'Mobile Home', label: 'Mobile Home' }
              ]}
            />
            <SelectField
              label="Style"
              value={renters.propertyCharacteristics?.style}
              onChange={(value) => updateRenters('propertyCharacteristics.style', value)}
              options={[
                { value: 'Ranch', label: 'Ranch' },
                { value: 'Colonial', label: 'Colonial' },
                { value: 'Cape Cod', label: 'Cape Cod' },
                { value: 'Contemporary', label: 'Contemporary' },
                { value: 'Victorian', label: 'Victorian' },
                { value: 'Split Level', label: 'Split Level' }
              ]}
            />
            <InputField
              label="Number of Stories"
              type="number"
              value={renters.propertyCharacteristics?.numberOfStories}
              onChange={(value) => updateRenters('propertyCharacteristics.numberOfStories', parseInt(value) || 0)}
            />
            <InputField
              label="Square Footage"
              type="number"
              value={renters.propertyCharacteristics?.squareFootage}
              onChange={(value) => updateRenters('propertyCharacteristics.squareFootage', parseInt(value) || 0)}
            />
            <SelectField
              label="Construction"
              value={renters.propertyCharacteristics?.construction}
              onChange={(value) => updateRenters('propertyCharacteristics.construction', value)}
              options={[
                { value: 'Frame', label: 'Frame' },
                { value: 'Masonry', label: 'Masonry' },
                { value: 'Brick', label: 'Brick' },
                { value: 'Stone', label: 'Stone' },
                { value: 'Concrete', label: 'Concrete' }
              ]}
            />
            <SelectField
              label="Roof"
              value={renters.propertyCharacteristics?.roof}
              onChange={(value) => updateRenters('propertyCharacteristics.roof', value)}
              options={[
                { value: 'Asphalt Shingle', label: 'Asphalt Shingle' },
                { value: 'Wood Shingle', label: 'Wood Shingle' },
                { value: 'Tile', label: 'Tile' },
                { value: 'Metal', label: 'Metal' },
                { value: 'Slate', label: 'Slate' },
                { value: 'Flat', label: 'Flat' }
              ]}
            />
            <SelectField
              label="Garage"
              value={renters.propertyCharacteristics?.garage}
              onChange={(value) => updateRenters('propertyCharacteristics.garage', value)}
              options={[
                { value: 'Attached', label: 'Attached' },
                { value: 'Detached', label: 'Detached' },
                { value: 'Carport', label: 'Carport' },
                { value: 'None', label: 'None' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Coverage Comparison */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Coverage Comparison</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Coverage */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Current Coverage</h4>
              <div className="space-y-3">
                <InputField
                  label="Deductible"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.current?.deductible}
                  onChange={(value) => updateRenters('coverage.current.deductible', parseFloat(value) || 0)}
                />
                <InputField
                  label="Liability"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.current?.liability}
                  onChange={(value) => updateRenters('coverage.current.liability', parseFloat(value) || 0)}
                />
                <InputField
                  label="Contents"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.current?.contents}
                  onChange={(value) => updateRenters('coverage.current.contents', parseFloat(value) || 0)}
                />
                <InputField
                  label="Medical Payments"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.current?.medicalPayments}
                  onChange={(value) => updateRenters('coverage.current.medicalPayments', parseFloat(value) || 0)}
                />
                <InputField
                  label="Scheduled Property"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.current?.scheduledProperty}
                  onChange={(value) => updateRenters('coverage.current.scheduledProperty', parseFloat(value) || 0)}
                />
                <TextAreaField
                  label="Property Type and Value"
                  value={renters.coverage?.current?.propertyTypeAndValue}
                  onChange={(value) => updateRenters('coverage.current.propertyTypeAndValue', value)}
                />
              </div>
            </div>

            {/* Proposed Coverage */}
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Proposed Coverage</h4>
              <div className="space-y-3">
                <InputField
                  label="Deductible"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.proposed?.deductible}
                  onChange={(value) => updateRenters('coverage.proposed.deductible', parseFloat(value) || 0)}
                />
                <InputField
                  label="Liability"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.proposed?.liability}
                  onChange={(value) => updateRenters('coverage.proposed.liability', parseFloat(value) || 0)}
                />
                <InputField
                  label="Contents"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.proposed?.contents}
                  onChange={(value) => updateRenters('coverage.proposed.contents', parseFloat(value) || 0)}
                />
                <InputField
                  label="Medical Payments"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.proposed?.medicalPayments}
                  onChange={(value) => updateRenters('coverage.proposed.medicalPayments', parseFloat(value) || 0)}
                />
                <InputField
                  label="Scheduled Property"
                  type="number"
                  step="0.01"
                  value={renters.coverage?.proposed?.scheduledProperty}
                  onChange={(value) => updateRenters('coverage.proposed.scheduledProperty', parseFloat(value) || 0)}
                />
                <TextAreaField
                  label="Property Type and Value"
                  value={renters.coverage?.proposed?.propertyTypeAndValue}
                  onChange={(value) => updateRenters('coverage.proposed.propertyTypeAndValue', value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentersSection;