import React from 'react';

interface DemographicsSectionProps {
  formData: any;
  isReadOnly: boolean;
  isCreate?: boolean;
  handleNestedInputChange: (path: string[], value: any) => void;
}

const DemographicsSection: React.FC<DemographicsSectionProps> = ({ formData, isReadOnly, isCreate, handleNestedInputChange }) => (
  <div className="bg-gray-200 p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Demographics</h3>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label htmlFor="birthPlace" className="block text-sm font-medium text-black">Birth Place</label>
        <input
          type="text"
          id="birthPlace"
          name="birthPlace"
          value={formData.birth_place || ''}
          onChange={e => handleNestedInputChange(['birth_place'], e.target.value)}
          placeholder="Birth place"
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-black">Date of Birth</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dob || ''}
          onChange={e => handleNestedInputChange(['date_of_birth'], e.target.value)}
          placeholder="dd-mm-yyyy"
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="race" className="block text-sm font-medium text-black">Race</label>
        <input
          type="text"
          id="race"
          name="race"
          value={formData.race || ''}
          onChange={e => handleNestedInputChange(['race'], e.target.value)}
          placeholder="Select race"
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="maritalStatus" className="block text-sm font-medium text-black">Marital Status</label>
        <input
          type="text"
          id="maritalStatus"
          name="maritalStatus"
          value={formData.marital_status || ''}
          onChange={e => handleNestedInputChange(['marital_status'], e.target.value)}
          placeholder="Select status"
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="anniversary" className="block text-sm font-medium text-black">Anniversary</label>
        <input
          type="date"
          id="anniversary"
          name="anniversary"
          value={formData.anniversary || ''}
          onChange={e => handleNestedInputChange(['anniversary'], e.target.value)}
          placeholder="dd-mm-yyyy"
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="spouseName" className="block text-sm font-medium text-black">Spouse Name</label>
        <input
          type="text"
          id="spouseName"
          name="spouseName"
          value={formData.spouse_name || ''}
          onChange={e => handleNestedInputChange(['spouse_name'], e.target.value)}
          placeholder="Spouse name"
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="spouseOccupation" className="block text-sm font-medium text-black">Spouse Occupation</label>
        <input
          type="text"
          id="spouseOccupation"
          name="spouseOccupation"
          value={formData.spouse_occupation || ''}
          onChange={e => handleNestedInputChange(['spouse_occupation'], e.target.value)}
          placeholder="Spouse occupation"
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="numDependents" className="block text-sm font-medium text-black">Number of Dependents</label>
        <input
          type="text"
          id="numDependents"
          name="numDependents"
          value={formData.number_of_dependents || ''}
          onChange={e => handleNestedInputChange(['number_of_dependents'], e.target.value)}
          placeholder="0"
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
    </div>
  </div>
);

export default DemographicsSection; 