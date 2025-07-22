import React from 'react';

const HomeownersSection = ({ formData, setFormData, isReadOnly }) => {
  const homeowners = formData.homeowners || {};

  const updateHomeowners = (path, value) => {
    if (isReadOnly) return;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.homeowners) {
        newData.homeowners = {};
      }
      
      // Handle nested path updates
      const pathArray = path.split('.');
      let current = newData.homeowners;
      
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
      <h2 className="text-2xl font-semibold mb-6">Homeowners Insurance</h2>

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
                  value={homeowners.applicant?.firstName}
                  onChange={(value) => updateHomeowners('applicant.firstName', value)}
                  required
                />
                <InputField
                  label="Middle Initial"
                  value={homeowners.applicant?.middleInitial}
                  onChange={(value) => updateHomeowners('applicant.middleInitial', value)}
                />
                <InputField
                  label="Last Name"
                  value={homeowners.applicant?.lastName}
                  onChange={(value) => updateHomeowners('applicant.lastName', value)}
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
                  value={homeowners.coApplicant?.firstName}
                  onChange={(value) => updateHomeowners('coApplicant.firstName', value)}
                />
                <InputField
                  label="Middle Initial"
                  value={homeowners.coApplicant?.middleInitial}
                  onChange={(value) => updateHomeowners('coApplicant.middleInitial', value)}
                />
                <InputField
                  label="Last Name"
                  value={homeowners.coApplicant?.lastName}
                  onChange={(value) => updateHomeowners('coApplicant.lastName', value)}
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
                value={homeowners.contactInfo?.address}
                onChange={(value) => updateHomeowners('contactInfo.address', value)}
                className="md:col-span-2"
              />
              <InputField
                label="City"
                value={homeowners.contactInfo?.city}
                onChange={(value) => updateHomeowners('contactInfo.city', value)}
              />
              <InputField
                label="State"
                value={homeowners.contactInfo?.state}
                onChange={(value) => updateHomeowners('contactInfo.state', value)}
              />
              <InputField
                label="ZIP Code"
                value={homeowners.contactInfo?.zip}
                onChange={(value) => updateHomeowners('contactInfo.zip', value)}
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
                value={homeowners.additionalInfo?.dateIn}
                onChange={(value) => updateHomeowners('additionalInfo.dateIn', value)}
              />
              <InputField
                label="Time In"
                type="time"
                value={homeowners.additionalInfo?.timeIn}
                onChange={(value) => updateHomeowners('additionalInfo.timeIn', value)}
              />
              <InputField
                label="Field Trainer"
                value={homeowners.additionalInfo?.fieldTrainer}
                onChange={(value) => updateHomeowners('additionalInfo.fieldTrainer', value)}
              />
              <InputField
                label="BMA"
                value={homeowners.additionalInfo?.BMA}
                onChange={(value) => updateHomeowners('additionalInfo.BMA', value)}
              />
              <SelectField
                label="State Licensed"
                value={homeowners.additionalInfo?.stateLicensed}
                onChange={(value) => updateHomeowners('additionalInfo.stateLicensed', value)}
                options={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Property */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Scheduled Property & Insurance Comparison</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="mb-6">
            <TextAreaField
              label="Property Description"
              value={homeowners.scheduledProperty?.propertyDescription}
              onChange={(value) => updateHomeowners('scheduledProperty.propertyDescription', value)}
            />
            <div className="mt-4">
              <InputField
                label="Property Value"
                type="number"
                step="0.01"
                value={homeowners.scheduledProperty?.value}
                onChange={(value) => updateHomeowners('scheduledProperty.value', parseFloat(value) || 0)}
                className="w-48"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank A */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Current Provider (Bank A)</h4>
              <div className="space-y-3">
                <InputField
                  label="Carrier"
                  value={homeowners.scheduledProperty?.bankA?.carrier}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankA.carrier', value)}
                />
                <InputField
                  label="Premium"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankA?.premium}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankA.premium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Deductible"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankA?.deductible}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankA.deductible', parseFloat(value) || 0)}
                />
                <InputField
                  label="Medical Payments"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankA?.medicalPayments}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankA.medicalPayments', parseFloat(value) || 0)}
                />
                <InputField
                  label="Liability"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankA?.liability}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankA.liability', parseFloat(value) || 0)}
                />
                <InputField
                  label="Savings"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankA?.savings}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankA.savings', parseFloat(value) || 0)}
                />
              </div>
            </div>

            {/* Bank B */}
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Proposed Provider (Bank B)</h4>
              <div className="space-y-3">
                <InputField
                  label="Carrier"
                  value={homeowners.scheduledProperty?.bankB?.carrier}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankB.carrier', value)}
                />
                <InputField
                  label="Premium"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankB?.premium}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankB.premium', parseFloat(value) || 0)}
                />
                <InputField
                  label="Deductible"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankB?.deductible}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankB.deductible', parseFloat(value) || 0)}
                />
                <InputField
                  label="Medical Payments"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankB?.medicalPayments}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankB.medicalPayments', parseFloat(value) || 0)}
                />
                <InputField
                  label="Liability"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankB?.liability}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankB.liability', parseFloat(value) || 0)}
                />
                <InputField
                  label="Savings"
                  type="number"
                  step="0.01"
                  value={homeowners.scheduledProperty?.bankB?.savings}
                  onChange={(value) => updateHomeowners('scheduledProperty.bankB.savings', parseFloat(value) || 0)}
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
              value={homeowners.applicationDetails?.applicationDate}
              onChange={(value) => updateHomeowners('applicationDetails.applicationDate', value)}
            />
            <SelectField
              label="Status"
              value={homeowners.applicationDetails?.status}
              onChange={(value) => updateHomeowners('applicationDetails.status', value)}
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
              value={homeowners.applicationDetails?.statusDate}
              onChange={(value) => updateHomeowners('applicationDetails.statusDate', value)}
            />
            <InputField
              label="Issue Date"
              type="date"
              value={homeowners.applicationDetails?.issueDate}
              onChange={(value) => updateHomeowners('applicationDetails.issueDate', value)}
            />
            <InputField
              label="Policy Number"
              value={homeowners.applicationDetails?.policyNumber}
              onChange={(value) => updateHomeowners('applicationDetails.policyNumber', value)}
            />
            <InputField
              label="Disburse Date"
              type="date"
              value={homeowners.applicationDetails?.disburseDate}
              onChange={(value) => updateHomeowners('applicationDetails.disburseDate', value)}
            />
            <InputField
              label="DFT"
              value={homeowners.applicationDetails?.DFT}
              onChange={(value) => updateHomeowners('applicationDetails.DFT', value)}
            />
            <InputField
              label="DFT No"
              value={homeowners.applicationDetails?.DFTNo}
              onChange={(value) => updateHomeowners('applicationDetails.DFTNo', value)}
            />
            <InputField
              label="Number of Units"
              type="number"
              value={homeowners.applicationDetails?.numberOfUnits}
              onChange={(value) => updateHomeowners('applicationDetails.numberOfUnits', parseInt(value) || 0)}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputField
              label="Year Built"
              type="number"
              value={homeowners.propertyCharacteristics?.yearBuilt}
              onChange={(value) => updateHomeowners('propertyCharacteristics.yearBuilt', parseInt(value) || 0)}
            />
            <InputField
              label="Mortgage Balance"
              type="number"
              step="0.01"
              value={homeowners.propertyCharacteristics?.mortgageBalance}
              onChange={(value) => updateHomeowners('propertyCharacteristics.mortgageBalance', parseFloat(value) || 0)}
            />
            <SelectField
              label="Housing Type"
              value={homeowners.propertyCharacteristics?.housingType}
              onChange={(value) => updateHomeowners('propertyCharacteristics.housingType', value)}
              options={[
                { value: 'Single Family', label: 'Single Family' },
                { value: 'Townhouse', label: 'Townhouse' },
                { value: 'Condo', label: 'Condo' },
                { value: 'Mobile Home', label: 'Mobile Home' }
              ]}
            />
            <SelectField
              label="Style"
              value={homeowners.propertyCharacteristics?.style}
              onChange={(value) => updateHomeowners('propertyCharacteristics.style', value)}
              options={[
                { value: 'Ranch', label: 'Ranch' },
                { value: 'Colonial', label: 'Colonial' },
                { value: 'Cape Cod', label: 'Cape Cod' },
                { value: 'Contemporary', label: 'Contemporary' },
                { value: 'Victorian', label: 'Victorian' }
              ]}
            />
            <CheckboxField
              label="Owner Occupied"
              checked={homeowners.propertyCharacteristics?.ownerOccupied}
              onChange={(value) => updateHomeowners('propertyCharacteristics.ownerOccupied', value)}
            />
            <CheckboxField
              label="Tenant Occupied"
              checked={homeowners.propertyCharacteristics?.tenantOccupied}
              onChange={(value) => updateHomeowners('propertyCharacteristics.tenantOccupied', value)}
            />
            <InputField
              label="Monthly Rental Income"
              type="number"
              step="0.01"
              value={homeowners.propertyCharacteristics?.monthlyRentalIncome}
              onChange={(value) => updateHomeowners('propertyCharacteristics.monthlyRentalIncome', parseFloat(value) || 0)}
            />
            <InputField
              label="Square Footage"
              type="number"
              value={homeowners.propertyCharacteristics?.squareFootage}
              onChange={(value) => updateHomeowners('propertyCharacteristics.squareFootage', parseInt(value) || 0)}
            />
            <SelectField
              label="Foundation"
              value={homeowners.propertyCharacteristics?.foundation}
              onChange={(value) => updateHomeowners('propertyCharacteristics.foundation', value)}
              options={[
                { value: 'Basement', label: 'Basement' },
                { value: 'Slab', label: 'Slab' },
                { value: 'Crawl Space', label: 'Crawl Space' },
                { value: 'Pier/Post', label: 'Pier/Post' }
              ]}
            />
            <InputField
              label="Foundation Percent"
              type="number"
              value={homeowners.propertyCharacteristics?.foundationPercent}
              onChange={(value) => updateHomeowners('propertyCharacteristics.foundationPercent', parseInt(value) || 0)}
            />
            <SelectField
              label="Construction"
              value={homeowners.propertyCharacteristics?.construction}
              onChange={(value) => updateHomeowners('propertyCharacteristics.construction', value)}
              options={[
                { value: 'Frame', label: 'Frame' },
                { value: 'Masonry', label: 'Masonry' },
                { value: 'Brick', label: 'Brick' },
                { value: 'Stone', label: 'Stone' }
              ]}
            />
            <SelectField
              label="Roof"
              value={homeowners.propertyCharacteristics?.roof}
              onChange={(value) => updateHomeowners('propertyCharacteristics.roof', value)}
              options={[
                { value: 'Asphalt Shingle', label: 'Asphalt Shingle' },
                { value: 'Wood Shingle', label: 'Wood Shingle' },
                { value: 'Tile', label: 'Tile' },
                { value: 'Metal', label: 'Metal' },
                { value: 'Slate', label: 'Slate' }
              ]}
            />
            <InputField
              label="Purchase Date"
              type="date"
              value={homeowners.propertyCharacteristics?.purchaseDate}
              onChange={(value) => updateHomeowners('propertyCharacteristics.purchaseDate', value)}
            />
            <CheckboxField
              label="New Purchase"
              checked={homeowners.propertyCharacteristics?.newPurchase}
              onChange={(value) => updateHomeowners('propertyCharacteristics.newPurchase', value)}
            />
            <InputField
              label="Payment"
              type="number"
              step="0.01"
              value={homeowners.propertyCharacteristics?.payment}
              onChange={(value) => updateHomeowners('propertyCharacteristics.payment', parseFloat(value) || 0)}
            />
            <CheckboxField
              label="Offered for Sale Last 12 Months"
              checked={homeowners.propertyCharacteristics?.offeredSaleLast12Months}
              onChange={(value) => updateHomeowners('propertyCharacteristics.offeredSaleLast12Months', value)}
            />
            <CheckboxField
              label="Refinanced Last 12 Months"
              checked={homeowners.propertyCharacteristics?.refinancedLast12Months}
              onChange={(value) => updateHomeowners('propertyCharacteristics.refinancedLast12Months', value)}
            />
            <CheckboxField
              label="Business on Premises"
              checked={homeowners.propertyCharacteristics?.businessOnPremises}
              onChange={(value) => updateHomeowners('propertyCharacteristics.businessOnPremises', value)}
            />
            <InputField
              label="Percent Basement Finished"
              type="number"
              value={homeowners.propertyCharacteristics?.percentBasementFinished}
              onChange={(value) => updateHomeowners('propertyCharacteristics.percentBasementFinished', parseInt(value) || 0)}
            />
            <InputField
              label="Deck Sq Footage"
              type="number"
              value={homeowners.propertyCharacteristics?.deckSqFootage}
              onChange={(value) => updateHomeowners('propertyCharacteristics.deckSqFootage', parseInt(value) || 0)}
            />
            <InputField
              label="Open Porch Sq Ft"
              type="number"
              value={homeowners.propertyCharacteristics?.openPorchSqFt}
              onChange={(value) => updateHomeowners('propertyCharacteristics.openPorchSqFt', parseInt(value) || 0)}
            />
            <InputField
              label="Enclosed Porch Sq Ft"
              type="number"
              value={homeowners.propertyCharacteristics?.enclosedPorchSqFt}
              onChange={(value) => updateHomeowners('propertyCharacteristics.enclosedPorchSqFt', parseInt(value) || 0)}
            />
            <SelectField
              label="Garage"
              value={homeowners.propertyCharacteristics?.garage}
              onChange={(value) => updateHomeowners('propertyCharacteristics.garage', value)}
              options={[
                { value: 'Attached', label: 'Attached' },
                { value: 'Detached', label: 'Detached' },
                { value: 'None', label: 'None' }
              ]}
            />
            <InputField
              label="Number of Cars Garage Can Hold"
              type="number"
              value={homeowners.propertyCharacteristics?.numCarsGarageCanHold}
              onChange={(value) => updateHomeowners('propertyCharacteristics.numCarsGarageCanHold', parseInt(value) || 0)}
            />
            <InputField
              label="Number of Full Baths"
              type="number"
              value={homeowners.propertyCharacteristics?.numFullBaths}
              onChange={(value) => updateHomeowners('propertyCharacteristics.numFullBaths', parseInt(value) || 0)}
            />
            <InputField
              label="Number of Half Baths"
              type="number"
              value={homeowners.propertyCharacteristics?.numHalfBaths}
              onChange={(value) => updateHomeowners('propertyCharacteristics.numHalfBaths', parseInt(value) || 0)}
            />
            <InputField
              label="Number of Fireplaces"
              type="number"
              value={homeowners.propertyCharacteristics?.numFireplaces}
              onChange={(value) => updateHomeowners('propertyCharacteristics.numFireplaces', parseInt(value) || 0)}
            />
            <CheckboxField
              label="Pool"
              checked={homeowners.propertyCharacteristics?.pool}
              onChange={(value) => updateHomeowners('propertyCharacteristics.pool', value)}
            />
            <CheckboxField
              label="Trampoline"
              checked={homeowners.propertyCharacteristics?.trampoline}
              onChange={(value) => updateHomeowners('propertyCharacteristics.trampoline', value)}
            />
            <InputField
              label="Number of Pets"
              type="number"
              value={homeowners.propertyCharacteristics?.numPets}
              onChange={(value) => updateHomeowners('propertyCharacteristics.numPets', parseInt(value) || 0)}
            />
            <CheckboxField
              label="Self-Locking Gate"
              checked={homeowners.propertyCharacteristics?.selfLockingGate}
              onChange={(value) => updateHomeowners('propertyCharacteristics.selfLockingGate', value)}
            />
            <InputField
              label="Number of Claims Last 5 Years"
              type="number"
              value={homeowners.propertyCharacteristics?.numClaimsLast5Years}
              onChange={(value) => updateHomeowners('propertyCharacteristics.numClaimsLast5Years', parseInt(value) || 0)}
            />
            <InputField
              label="Amount of Claims"
              type="number"
              step="0.01"
              value={homeowners.propertyCharacteristics?.amtOfClaims}
              onChange={(value) => updateHomeowners('propertyCharacteristics.amtOfClaims', parseFloat(value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Credits & Discounts</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Home Association Fee"
              type="number"
              step="0.01"
              value={homeowners.credits?.homeAssocFee}
              onChange={(value) => updateHomeowners('credits.homeAssocFee', parseFloat(value) || 0)}
            />
            <CheckboxField
              label="Flood Policy"
              checked={homeowners.credits?.floodPolicy}
              onChange={(value) => updateHomeowners('credits.floodPolicy', value)}
            />
            <CheckboxField
              label="Monitored Burglar Alarm"
              checked={homeowners.credits?.monitoredBurglarAlarm}
              onChange={(value) => updateHomeowners('credits.monitoredBurglarAlarm', value)}
            />
            <CheckboxField
              label="Monitored Fire Alarm"
              checked={homeowners.credits?.monitoredFireAlarm}
              onChange={(value) => updateHomeowners('credits.monitoredFireAlarm', value)}
            />
            <CheckboxField
              label="24-Hour Security"
              checked={homeowners.credits?.twentyFourHrSecurity}
              onChange={(value) => updateHomeowners('credits.twentyFourHrSecurity', value)}
            />
            <CheckboxField
              label="Fire Extinguisher"
              checked={homeowners.credits?.fireExtinguisher}
              onChange={(value) => updateHomeowners('credits.fireExtinguisher', value)}
            />
            <CheckboxField
              label="Smoke Protector"
              checked={homeowners.credits?.smokeProtector}
              onChange={(value) => updateHomeowners('credits.smokeProtector', value)}
            />
            <CheckboxField
              label="Non-Smoking Household"
              checked={homeowners.credits?.nonSmokingHousehold}
              onChange={(value) => updateHomeowners('credits.nonSmokingHousehold', value)}
            />
            <CheckboxField
              label="Deadbolt Locks"
              checked={homeowners.credits?.deadboltLocks}
              onChange={(value) => updateHomeowners('credits.deadboltLocks', value)}
            />
            <InputField
              label="Account Credit"
              type="number"
              step="0.01"
              value={homeowners.credits?.accountCredit}
              onChange={(value) => updateHomeowners('credits.accountCredit', parseFloat(value) || 0)}
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
              label="Final Quote Sent to UW"
              type="date"
              value={homeowners.processMilestones?.finalQuoteSentToUW}
              onChange={(value) => updateHomeowners('processMilestones.finalQuoteSentToUW', value)}
            />
            <InputField
              label="Final Quote Received"
              type="date"
              value={homeowners.processMilestones?.finalQuoteReceived}
              onChange={(value) => updateHomeowners('processMilestones.finalQuoteReceived', value)}
            />
            <InputField
              label="Final Quote Expires"
              type="date"
              value={homeowners.processMilestones?.finalQuoteExpires}
              onChange={(value) => updateHomeowners('processMilestones.finalQuoteExpires', value)}
            />
            <InputField
              label="Final Quote Client Review Date"
              type="date"
              value={homeowners.processMilestones?.finalQuoteClientReviewDate}
              onChange={(value) => updateHomeowners('processMilestones.finalQuoteClientReviewDate', value)}
            />
            <SelectField
              label="Client Decision"
              value={homeowners.processMilestones?.clientDecision}
              onChange={(value) => updateHomeowners('processMilestones.clientDecision', value)}
              options={[
                { value: 'Accepted', label: 'Accepted' },
                { value: 'Declined', label: 'Declined' },
                { value: 'Pending', label: 'Pending' }
              ]}
            />
            <InputField
              label="Date Binded"
              type="date"
              value={homeowners.processMilestones?.dateBinded}
              onChange={(value) => updateHomeowners('processMilestones.dateBinded', value)}
            />
            <InputField
              label="Net Annual Premium"
              type="number"
              step="0.01"
              value={homeowners.processMilestones?.netAnnualPremium}
              onChange={(value) => updateHomeowners('processMilestones.netAnnualPremium', parseFloat(value) || 0)}
            />
            <InputField
              label="Total Annual Premium"
              type="number"
              step="0.01"
              value={homeowners.processMilestones?.totalAnnualPremium}
              onChange={(value) => updateHomeowners('processMilestones.totalAnnualPremium', parseFloat(value) || 0)}
            />
            <CheckboxField
              label="Binded Premium Paid"
              checked={homeowners.processMilestones?.bindedPremiumPaid}
              onChange={(value) => updateHomeowners('processMilestones.bindedPremiumPaid', value)}
            />
            <CheckboxField
              label="Home Premium Paid"
              checked={homeowners.processMilestones?.homePremiumPaid}
              onChange={(value) => updateHomeowners('processMilestones.homePremiumPaid', value)}
            />
          </div>
        </div>
      </div>

      {/* Binding Milestones */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold">Binding Milestones</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CheckboxField
              label="Front/Rear/Side Photos Provided"
              checked={homeowners.bindingMilestones?.frontRearSidePhotosProvided}
              onChange={(value) => updateHomeowners('bindingMilestones.frontRearSidePhotosProvided', value)}
            />
            <CheckboxField
              label="Photos Received"
              checked={homeowners.bindingMilestones?.photosReceived}
              onChange={(value) => updateHomeowners('bindingMilestones.photosReceived', value)}
            />
            <InputField
              label="New Mortgage Clause"
              value={homeowners.bindingMilestones?.newMortgageClause}
              onChange={(value) => updateHomeowners('bindingMilestones.newMortgageClause', value)}
            />
            <InputField
              label="New Loan Number"
              value={homeowners.bindingMilestones?.newLoanNumber}
              onChange={(value) => updateHomeowners('bindingMilestones.newLoanNumber', value)}
            />
            <CheckboxField
              label="Payment Sent Form"
              checked={homeowners.bindingMilestones?.paymentSentForm}
              onChange={(value) => updateHomeowners('bindingMilestones.paymentSentForm', value)}
            />
            <CheckboxField
              label="Payment Form Received"
              checked={homeowners.bindingMilestones?.paymentFormReceived}
              onChange={(value) => updateHomeowners('bindingMilestones.paymentFormReceived', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownersSection;