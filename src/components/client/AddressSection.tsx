import React from 'react';

interface AddressSectionProps {
  formData: any;
  isReadOnly: boolean;
  isCreate?: boolean;
  handleNestedInputChange: (path: string[], value: any) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({ formData, isReadOnly, isCreate, handleNestedInputChange }) => (
  <div className="bg-gray-200 p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Current Address</h3>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label htmlFor="address" className="text-sm font-medium text-gray-600">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.current_address?.address || ''}
          onChange={e => handleNestedInputChange(['current_address', 'address'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'street address' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="city" className="text-sm font-medium text-gray-600">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.current_address?.city || ''}
          onChange={e => handleNestedInputChange(['current_address', 'city'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'city' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="state" className="text-sm font-medium text-gray-600">State</label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.current_address?.state || ''}
          onChange={e => handleNestedInputChange(['current_address', 'state'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'state' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="zipCode" className="text-sm font-medium text-gray-600">Zip Code</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={formData.current_address?.zip_code || ''}
          onChange={e => handleNestedInputChange(['current_address', 'zip_code'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'zip code' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="county" className="text-sm font-medium text-gray-600">County</label>
        <input
          type="text"
          id="county"
          name="county"
          value={formData.current_address?.county || ''}
          onChange={e => handleNestedInputChange(['current_address', 'county'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'county' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="homePhone" className="text-sm font-medium text-gray-600">Home Phone</label>
        <input
          type="text"
          id="homePhone"
          name="homePhone"
          value={formData.current_address?.home_phone || ''}
          onChange={e => handleNestedInputChange(['current_address', 'home_phone'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'home phone' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="workPhone" className="text-sm font-medium text-gray-600">Work Phone</label>
        <input
          type="text"
          id="workPhone"
          name="workPhone"
          value={formData.current_address?.work_phone || ''}
          onChange={e => handleNestedInputChange(['current_address', 'work_phone'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'work phone' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="cellPhone" className="text-sm font-medium text-gray-600">Cell Phone</label>
        <input
          type="text"
          id="cellPhone"
          name="cellPhone"
          value={formData.current_address?.cell_phone || ''}
          onChange={e => handleNestedInputChange(['current_address', 'cell_phone'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'cell phone' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="otherPhone" className="text-sm font-medium text-gray-600">Other Phone</label>
        <input
          type="text"
          id="otherPhone"
          name="otherPhone"
          value={formData.current_address?.other_phone || ''}
          onChange={e => handleNestedInputChange(['current_address', 'other_phone'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'other phone' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.current_address?.email || ''}
          onChange={e => handleNestedInputChange(['current_address', 'email'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'email' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="fax" className="text-sm font-medium text-gray-600">Fax</label>
        <input
          type="text"
          id="fax"
          name="fax"
          value={formData.current_address?.fax || ''}
          onChange={e => handleNestedInputChange(['current_address', 'fax'], e.target.value)}
          placeholder={isCreate && !isReadOnly ? 'fax' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div className="col-span-2">
        <label className="text-sm font-medium text-gray-600">How Long at Current Address</label>
        <div className="flex gap-4">
          <label htmlFor="years" className="text-sm font-medium text-gray-600">Years</label>
          <select
            id="years"
            value={formData.current_address?.years_at_address || ''}
            onChange={e => handleNestedInputChange(['current_address', 'years_at_address'], e.target.value)}
            disabled={isReadOnly}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
          >
            <option value="">Select...</option>
            {[...Array(31).keys()].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <label htmlFor="months" className="text-sm font-medium text-gray-600">Months</label>
          <select
            id="months"
            value={formData.current_address?.months_at_address || ''}
            onChange={e => handleNestedInputChange(['current_address', 'months_at_address'], e.target.value)}
            disabled={isReadOnly}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
          >
            <option value="">Select...</option>
            {[...Array(12).keys()].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default AddressSection; 