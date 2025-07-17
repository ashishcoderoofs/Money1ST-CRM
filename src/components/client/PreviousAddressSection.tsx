import React from 'react';
import { US_STATES } from '../../constants';

interface PreviousAddressSectionProps {
  formData: any;
  isReadOnly: boolean;
  handleNestedInputChange: (path: string[], value: any) => void;
}

const PreviousAddressSection: React.FC<PreviousAddressSectionProps> = ({ formData, isReadOnly, handleNestedInputChange }) => (
  <div className=" p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Previous Address Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label htmlFor="prevAddress" className="text-sm font-medium text-black">Address</label>
        <input
          type="text"
          id="prevAddress"
          name="prevAddress"
          value={formData.previous_address?.address || ''}
          onChange={e => handleNestedInputChange(['previous_address', 'address'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder={!isReadOnly ? 'Previous address' : undefined}
        />
      </div>
      <div>
        <label htmlFor="prevCity" className="text-sm font-medium text-black">City</label>
        <input
          type="text"
          id="prevCity"
          name="prevCity"
          value={formData.previous_address?.city || ''}
          onChange={e => handleNestedInputChange(['previous_address', 'city'], e.target.value)}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder={!isReadOnly ? 'Previous city' : undefined}
        />
      </div>
      <div>
        <label htmlFor="prevState" className="text-sm font-medium text-black">State</label>
        <select
          id="prevState"
          name="prevState"
          value={formData.previous_address?.state || ''}
          onChange={e => handleNestedInputChange(['previous_address', 'state'], e.target.value)}
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
        <label htmlFor="prevZipCode" className="text-sm font-medium text-black">Zip Code</label>
        <input
          type="text"
          id="prevZipCode"
          name="prevZipCode"
          value={formData.previous_address?.zip_code || ''}
          onChange={e => {
            const val = e.target.value;
            if (/^\d{0,5}$/.test(val)) handleNestedInputChange(['previous_address', 'zip_code'], val);
          }}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          placeholder={!isReadOnly ? 'Zip Code' : undefined}
          maxLength={5}
          pattern="^\d{5}$"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label className="block text-sm font-medium text-black">How Long at Previous Address</label>
        <div className="flex gap-4">
          <input
            type="number"
            name="prevAddressYears"
            min={0}
            value={formData.previous_address?.years ?? ''}
            onChange={e => handleNestedInputChange(['previous_address', 'years'], e.target.value === '' ? '' : Number(e.target.value))}
            className="bg-white flex h-10 rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-40"
            placeholder="Years"
            readOnly={isReadOnly}
          />
          <select
            id="prevAddressMonths"
            name="prevAddressMonths"
            value={formData.previous_address?.months ?? ''}
            onChange={e => handleNestedInputChange(['previous_address', 'months'], e.target.value === '' ? '' : Number(e.target.value))}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={isReadOnly}
          >
            <option value="">Months (0-11)</option>
            {[...Array(12).keys()].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default PreviousAddressSection; 