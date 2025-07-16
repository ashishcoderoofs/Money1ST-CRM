import React from 'react';
import { US_STATES } from './ClientFormTabs';

interface AddressSectionProps {
  formData: any;
  isReadOnly: boolean;
  isCreate?: boolean;
  handleNestedInputChange: (path: string[], value: any) => void;
  errors?: { [key: string]: string };
}

const AddressSection: React.FC<AddressSectionProps> = ({ formData, isReadOnly, isCreate, handleNestedInputChange, errors = {} }) => (
  <div className=" p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Current Address</h3>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label htmlFor="address" className="text-sm font-medium text-gray-600">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.contact?.address || ''}
          onChange={e => handleNestedInputChange(['contact', 'address'], e.target.value)}
          placeholder={!isReadOnly ? 'street address' : undefined}
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
          value={formData.contact?.city || ''}
          onChange={e => handleNestedInputChange(['contact', 'city'], e.target.value)}
          placeholder={!isReadOnly ? 'city' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="state" className="text-sm font-medium text-gray-600">State</label>
        <select
          id="state"
          name="state"
          value={formData.contact?.state || ''}
          onChange={e => handleNestedInputChange(['contact', 'state'], e.target.value)}
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
        <label htmlFor="zipCode" className="text-sm font-medium text-gray-600">Zip Code</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={formData.contact?.zip_code || ''}
          onChange={e => handleNestedInputChange(['contact', 'zip_code'], e.target.value)}
          placeholder={!isReadOnly ? 'zip code' : undefined}
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
          value={formData.contact?.county || ''}
          onChange={e => handleNestedInputChange(['contact', 'county'], e.target.value)}
          placeholder={!isReadOnly ? 'county' : undefined}
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
          value={formData.contact?.home_phone || ''}
          onChange={e => handleNestedInputChange(['contact', 'home_phone'], e.target.value)}
          placeholder={!isReadOnly ? 'home phone' : undefined}
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
          value={formData.contact?.work_phone || ''}
          onChange={e => handleNestedInputChange(['contact', 'work_phone'], e.target.value)}
          placeholder={!isReadOnly ? 'work phone' : undefined}
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
          value={formData.contact?.cell_phone || ''}
          onChange={e => handleNestedInputChange(['contact', 'cell_phone'], e.target.value)}
          placeholder={!isReadOnly ? 'cell phone' : undefined}
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
          value={formData.contact?.other_phone || ''}
          onChange={e => handleNestedInputChange(['contact', 'other_phone'], e.target.value)}
          placeholder={!isReadOnly ? 'other phone' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.contact?.email || ''}
          onChange={e => handleNestedInputChange(['contact', 'email'], e.target.value)}
          placeholder={!isReadOnly ? 'email' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
          required
        />
        {(errors.email || errors['contact.email']) && (
          <div className="text-red-500 text-xs mt-1">
            {errors.email || errors['contact.email']}
          </div>
        )}
      </div>
      <div>
        <label htmlFor="fax" className="text-sm font-medium text-gray-600">Fax</label>
        <input
          type="text"
          id="fax"
          name="fax"
          value={formData.contact?.fax || ''}
          onChange={e => handleNestedInputChange(['contact', 'fax'], e.target.value)}
          placeholder={!isReadOnly ? 'fax' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-black">How Long at Current Address</label>
        <div className="flex gap-4">
          <input
            type="number"
            name="currentAddressYears"
            min={0}
            value={formData.current_address?.years ?? ''}
            onChange={e => handleNestedInputChange(['current_address', 'years'], e.target.value === '' ? '' : Number(e.target.value))}
            disabled={isReadOnly}
            className="bg-white flex h-10 rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-40"
            placeholder="Years"
          />
          <input
            type="number"
            name="currentAddressMonths"
            min={0}
            max={11}
            value={formData.current_address?.months ?? ''}
            onChange={e => handleNestedInputChange(['current_address', 'months'], e.target.value === '' ? '' : Number(e.target.value))}
            disabled={isReadOnly}
            className="bg-white flex h-10 rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-40"
            placeholder="Months (0-11)"
          />
        </div>
      </div>
    </div>
  </div>
);

export default AddressSection; 