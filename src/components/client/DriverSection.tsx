import React, { useState } from 'react';

const RELATIONSHIP_OPTIONS = [
  { value: 'applicant', label: 'Applicant' },
  { value: 'co-applicant', label: 'Co-Applicant' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'son', label: 'Son' },
  { value: 'other', label: 'Other' },
];
const SEX_OPTIONS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
];
const MARITAL_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];
const DRIVING_STATUS_OPTIONS = [
  { value: 'licensed', label: 'Licensed' },
  { value: 'unlicensed', label: 'Unlicensed' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'expired', label: 'Expired' },
  { value: 'revoked', label: 'Revoked' },
  { value: 'restricted', label: 'Restricted' },
  { value: 'learners-permit', label: "Learner's Permit" },
  { value: 'international', label: 'International License' },
  { value: 'pending', label: 'Pending' },
  { value: 'not-applicable', label: 'Not Applicable' },
];
const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'DC', label: 'District of Columbia' }, { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' }, { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
];

function calculateAge(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const emptyDriver = {
  fullName: '',
  dateOfBirth: '',
  age: '',
  relationship: '',
  ssn: '',
  sex: '',
  maritalStatus: '',
  drivingStatus: '',
  licenseNumber: '',
  state: '',
  accidentsViolations: '0',
};

const nameRegex = /^[A-Za-z\s\-']+$/;
const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;

function validateDriver(driver) {
  const errors = {};
  if (!driver.fullName || !nameRegex.test(driver.fullName)) {
    errors.fullName = 'Full Name is required and can only contain letters, spaces, hyphens, and apostrophes.';
  }
  if (!driver.dateOfBirth) {
    errors.dateOfBirth = 'DOB is required.';
  } else {
    const age = calculateAge(driver.dateOfBirth);
    if (isNaN(age) || age < 16 || age > 99) {
      errors.dateOfBirth = 'Driver must be at least 16 years old.';
    }
  }
  if (!driver.age || isNaN(driver.age) || driver.age < 16 || driver.age > 99) {
    errors.age = 'Age must be between 16 and 99.';
  }
  if (!driver.relationship) {
    errors.relationship = 'Relationship is required.';
  }
  if (!driver.ssn || !ssnRegex.test(driver.ssn)) {
    errors.ssn = 'SSN must be in the format XXX-XX-XXXX.';
  }
  if (!driver.sex) {
    errors.sex = 'Sex is required.';
  }
  if (!driver.maritalStatus) {
    errors.maritalStatus = 'Marital Status is required.';
  }
  if (!driver.drivingStatus) {
    errors.drivingStatus = 'Driving Status is required.';
  }
  if (driver.drivingStatus === 'licensed' && !driver.licenseNumber) {
    errors.licenseNumber = 'License Number is required for licensed drivers.';
  }
  if (!driver.state) {
    errors.state = 'State is required.';
  }
  if (
    driver.accidentsViolations === '' ||
    isNaN(Number(driver.accidentsViolations)) ||
    Number(driver.accidentsViolations) < 0 ||
    Number(driver.accidentsViolations) > 99
  ) {
    errors.accidentsViolations = 'Accidents/Violations must be a number between 0 and 99.';
  }
  return errors;
}

const DriverSection = ({ drivers, setDrivers, isReadOnly }) => {
  const [touched, setTouched] = useState(drivers.map(() => ({})));
  const [errors, setErrors] = useState(drivers.map(validateDriver));

  React.useEffect(() => {
    setErrors(drivers.map(validateDriver));
  }, [drivers]);

  const handleChange = (idx, field, value) => {
    const updated = drivers.map((d, i) =>
      i === idx ? { ...d, [field]: value, ...(field === 'dateOfBirth' ? { age: calculateAge(value) } : {}) } : d
    );
    setDrivers(updated);
    setTouched(t => t.map((row, i) => i === idx ? { ...row, [field]: true } : row));
  };
  const handleAdd = () => {
    setDrivers([...drivers, { ...emptyDriver }]);
    setTouched([...touched, {}]);
  };
  const handleRemove = idx => {
    if (drivers.length > 1) {
      setDrivers(drivers.filter((_, i) => i !== idx));
      setTouched(touched.filter((_, i) => i !== idx));
    }
  };

  if (isReadOnly) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Full Name</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Age</th>
              <th className="p-2">Relationship</th>
              <th className="p-2">SSN</th>
              <th className="p-2">Sex</th>
              <th className="p-2">Marital Status</th>
              <th className="p-2">Driving Status</th>
              <th className="p-2">License #</th>
              <th className="p-2">State</th>
              <th className="p-2">Accidents/Violations</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{driver.fullName}</td>
                <td className="p-2">{driver.dateOfBirth}</td>
                <td className="p-2">{driver.age}</td>
                <td className="p-2">{RELATIONSHIP_OPTIONS.find(opt => opt.value === driver.relationship)?.label || driver.relationship}</td>
                <td className="p-2">{driver.ssn}</td>
                <td className="p-2">{SEX_OPTIONS.find(opt => opt.value === driver.sex)?.label || driver.sex}</td>
                <td className="p-2">{MARITAL_OPTIONS.find(opt => opt.value === driver.maritalStatus)?.label || driver.maritalStatus}</td>
                <td className="p-2">{DRIVING_STATUS_OPTIONS.find(opt => opt.value === driver.drivingStatus)?.label || driver.drivingStatus}</td>
                <td className="p-2">{driver.licenseNumber}</td>
                <td className="p-2">{US_STATES.find(opt => opt.value === driver.state)?.label || driver.state}</td>
                <td className="p-2">{driver.accidentsViolations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1200px] w-full border border-gray-300 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Full Name *</th>
            <th className="p-2">DOB *</th>
            <th className="p-2">Age *</th>
            <th className="p-2">Relationship *</th>
            <th className="p-2">SSN *</th>
            <th className="p-2">Sex *</th>
            <th className="p-2">Marital Status *</th>
            <th className="p-2">Driving Status *</th>
            <th className="p-2">License #</th>
            <th className="p-2">State *</th>
            <th className="p-2">Accidents/Violations *</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">
                <input type="text" className="w-36" placeholder="Full Name" value={driver.fullName} onChange={e => handleChange(idx, 'fullName', e.target.value)} required />
                {touched[idx]?.fullName && errors[idx]?.fullName && <div className="text-xs text-red-600">{errors[idx].fullName}</div>}
              </td>
              <td className="p-2">
                <input type="date" className="w-32" value={driver.dateOfBirth} onChange={e => handleChange(idx, 'dateOfBirth', e.target.value)} required />
                {touched[idx]?.dateOfBirth && errors[idx]?.dateOfBirth && <div className="text-xs text-red-600">{errors[idx].dateOfBirth}</div>}
              </td>
              <td className="p-2">
                <input type="number" className="w-16" placeholder="Age" value={driver.age} onChange={e => handleChange(idx, 'age', e.target.value)} disabled readOnly />
                {touched[idx]?.age && errors[idx]?.age && <div className="text-xs text-red-600">{errors[idx].age}</div>}
              </td>
              <td className="p-2">
                <select className="w-32" value={driver.relationship} onChange={e => handleChange(idx, 'relationship', e.target.value)} required>
                  <option value="">Relationship</option>
                  {RELATIONSHIP_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {touched[idx]?.relationship && errors[idx]?.relationship && <div className="text-xs text-red-600">{errors[idx].relationship}</div>}
              </td>
              <td className="p-2">
                <input type="text" className="w-32" placeholder="###-##-####" value={driver.ssn} onChange={e => handleChange(idx, 'ssn', e.target.value)} required pattern="^\d{3}-\d{2}-\d{4}$" />
                {touched[idx]?.ssn && errors[idx]?.ssn && <div className="text-xs text-red-600">{errors[idx].ssn}</div>}
              </td>
              <td className="p-2">
                <select className="w-24" value={driver.sex} onChange={e => handleChange(idx, 'sex', e.target.value)} required>
                  <option value="">Sex</option>
                  {SEX_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {touched[idx]?.sex && errors[idx]?.sex && <div className="text-xs text-red-600">{errors[idx].sex}</div>}
              </td>
              <td className="p-2">
                <select className="w-28" value={driver.maritalStatus} onChange={e => handleChange(idx, 'maritalStatus', e.target.value)} required>
                  <option value="">Status</option>
                  {MARITAL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {touched[idx]?.maritalStatus && errors[idx]?.maritalStatus && <div className="text-xs text-red-600">{errors[idx].maritalStatus}</div>}
              </td>
              <td className="p-2">
                <select className="w-36" value={driver.drivingStatus} onChange={e => handleChange(idx, 'drivingStatus', e.target.value)} required>
                  <option value="">Status</option>
                  {DRIVING_STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {touched[idx]?.drivingStatus && errors[idx]?.drivingStatus && <div className="text-xs text-red-600">{errors[idx].drivingStatus}</div>}
              </td>
              <td className="p-2">
                <input type="text" className="w-28" placeholder="License #" value={driver.licenseNumber} onChange={e => handleChange(idx, 'licenseNumber', e.target.value)} disabled={driver.drivingStatus !== 'licensed'} required={driver.drivingStatus === 'licensed'} />
                {touched[idx]?.licenseNumber && errors[idx]?.licenseNumber && <div className="text-xs text-red-600">{errors[idx].licenseNumber}</div>}
              </td>
              <td className="p-2">
                <select className="w-28" value={driver.state} onChange={e => handleChange(idx, 'state', e.target.value)} required>
                  <option value="">State</option>
                  {US_STATES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {touched[idx]?.state && errors[idx]?.state && <div className="text-xs text-red-600">{errors[idx].state}</div>}
              </td>
              <td className="p-2">
                <input type="number" className="w-16" placeholder="0" value={driver.accidentsViolations} onChange={e => handleChange(idx, 'accidentsViolations', e.target.value)} min={0} max={99} required />
                {touched[idx]?.accidentsViolations && errors[idx]?.accidentsViolations && <div className="text-xs text-red-600">{errors[idx].accidentsViolations}</div>}
              </td>
              <td className="p-2">
                <button type="button" className="text-red-600 font-bold px-2" onClick={() => handleRemove(idx)} disabled={drivers.length === 1}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleAdd}>
        + Add Driver
      </button>
    </div>
  );
};

export default DriverSection; 