import React from 'react';
import { US_STATES } from './ClientFormTabs';

interface PreviousEmploymentSectionProps {
  formData: any;
  isReadOnly: boolean;
  handleNestedInputChange: (path: string[], value: any) => void;
}

const PreviousEmploymentSection: React.FC<PreviousEmploymentSectionProps> = ({ formData, isReadOnly, handleNestedInputChange }) => (
  <div className=" p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Previous Employment Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label htmlFor="prevEmployerName" className="block text-sm font-medium text-black">Employer Name</label>
        <input
          type="text"
          id="prevEmployerName"
          name="prevEmployerName"
          value={formData.previous_employment?.employer_name || ''}
          onChange={e => handleNestedInputChange(['previous_employment', 'employer_name'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder={!isReadOnly ? 'Employer name' : undefined}
        />
      </div>
      <div>
        <label htmlFor="prevEmployerAddress" className="block text-sm font-medium text-black">Employer Address</label>
        <input
          type="text"
          id="prevEmployerAddress"
          name="prevEmployerAddress"
          value={formData.previous_employment?.employer_address || ''}
          onChange={e => handleNestedInputChange(['previous_employment', 'employer_address'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder="Employer address"
        />
      </div>
      <div>
        <label htmlFor="prevEmployerCity" className="block text-sm font-medium text-black">City</label>
        <input
          type="text"
          id="prevEmployerCity"
          name="prevEmployerCity"
          value={formData.previous_employment?.city || ''}
          onChange={e => handleNestedInputChange(['previous_employment', 'city'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder="City"
        />
      </div>
      <div>
        <label htmlFor="prevEmployerState" className="block text-sm font-medium text-black">State</label>
        <select
          id="prevEmployerState"
          name="prevEmployerState"
          value={formData.previous_employment?.state || ''}
          onChange={e => handleNestedInputChange(['previous_employment', 'state'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          disabled={isReadOnly}
        >
          <option value="">Select State</option>
          {US_STATES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="prevEmployerZipCode" className="block text-sm font-medium text-black">Zip Code</label>
        <input
          type="text"
          id="prevEmployerZipCode"
          name="prevEmployerZipCode"
          value={formData.previous_employment?.zip_code || ''}
          onChange={e => handleNestedInputChange(['previous_employment', 'zip_code'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder="Zip code"
        />
      </div>
      <div>
        <label htmlFor="prevFromDate" className="block text-sm font-medium text-black">From Date</label>
        <input
          type="date"
          id="prevFromDate"
          name="prevFromDate"
          value={formData.previous_employment?.from_date || ''}
          onChange={e => handleNestedInputChange(['previous_employment', 'from_date'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder="From date"
        />
      </div>
      <div>
        <label htmlFor="prevToDate" className="block text-sm font-medium text-black">To Date</label>
        <input
          type="date"
          id="prevToDate"
          name="prevToDate"
          value={formData.previous_employment?.to_date || ''}
          onChange={e => handleNestedInputChange(['previous_employment', 'to_date'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder="To date"
        />
      </div>
      <div>
        <label htmlFor="prevOccupation" className="block text-sm font-medium text-black">Occupation</label>
        <input
          type="text"
          id="prevOccupation"
          name="prevOccupation"
          value={formData.previous_employment?.occupation || ''}
          onChange={e => handleNestedInputChange(['previous_employment', 'occupation'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder="Occupation"
        />
      </div>
    </div>
  </div>
);

export default PreviousEmploymentSection; 