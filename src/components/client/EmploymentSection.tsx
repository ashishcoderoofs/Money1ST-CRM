import React from 'react';
import { US_STATES } from '../../constants';

interface EmploymentSectionProps {
  formData: any;
  isReadOnly: boolean;
  handleNestedInputChange: (path: string[], value: any) => void;
}

const EmploymentSection: React.FC<EmploymentSectionProps> = ({ formData, isReadOnly, handleNestedInputChange }) => (
  <div className=" p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Current Employment Information</h3>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="employmentStatus" className="block text-sm font-medium text-black">Employment Status</label>
            <select
              id="employmentStatus"
              name="employmentStatus"
              value={formData.employment?.status || ''}
              onChange={e => handleNestedInputChange(['employment', 'status'], e.target.value)}
              className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">Select status</option>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
              <option value="Part time">Part time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="flex-shrink-0 flex items-end">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={formData.employment?.is_business_owner || false}
                onChange={e => handleNestedInputChange(['employment', 'is_business_owner'], e.target.checked)}
                className="rounded"
                disabled={isReadOnly}
              />
              <span className="text-sm">Business Owner</span>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-black">Occupation</label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.employment?.occupation || ''}
            onChange={e => handleNestedInputChange(['employment', 'occupation'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="Occupation"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label htmlFor="employerName" className="block text-sm font-medium text-black">Employer Name</label>
          <input
            type="text"
            id="employerName"
            name="employerName"
            value={formData.employment?.employer_name || ''}
            onChange={e => handleNestedInputChange(['employment', 'employer_name'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder={!isReadOnly ? 'Employer name' : undefined}
          />
        </div>
        <div>
          <label htmlFor="employerAddress" className="block text-sm font-medium text-black">Employer Address</label>
          <input
            type="text"
            id="employerAddress"
            name="employerAddress"
            value={formData.employment?.employer_address || ''}
            onChange={e => handleNestedInputChange(['employment', 'employer_address'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder={!isReadOnly ? 'Employer address' : undefined}
          />
        </div>
        <div>
          <label htmlFor="employerCity" className="block text-sm font-medium text-black">City</label>
          <input
            type="text"
            id="employerCity"
            name="employerCity"
            value={formData.employment?.employer_city || ''}
            onChange={e => handleNestedInputChange(['employment', 'employer_city'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="City"
          />
        </div>
        <div>
          <label htmlFor="employerState" className="block text-sm font-medium text-black">State</label>
          <select
            id="employerState"
            name="employerState"
            value={formData.employment?.employer_state || ''}
            onChange={e => handleNestedInputChange(['employment', 'employer_state'], e.target.value)}
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
          <label htmlFor="employerZipCode" className="block text-sm font-medium text-black">Zip Code</label>
          <input
            type="text"
            id="employerZipCode"
            name="employerZipCode"
            value={formData.employment?.employer_zip_code || ''}
            onChange={e => {
              const val = e.target.value;
              if (/^\d{0,5}$/.test(val)) handleNestedInputChange(['employment', 'employer_zip_code'], val);
            }}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="Zip code"
            maxLength={5}
            pattern="^\d{5}$"
          />
        </div>
        <div>
          <label htmlFor="grossMonthlySalary" className="block text-sm font-medium text-black">Gross Monthly Salary (USD)</label>
          <input
            type="text"
            id="grossMonthlySalary"
            name="grossMonthlySalary"
            value={formData.employment?.gross_monthly_salary || ''}
            onChange={e => handleNestedInputChange(['employment', 'gross_monthly_salary'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="$0.00"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-black">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.employment?.start_date || ''}
            onChange={e => handleNestedInputChange(['employment', 'start_date'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="dd-mm-yyyy"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-black">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.employment?.end_date || ''}
            onChange={e => handleNestedInputChange(['employment', 'end_date'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="dd-mm-yyyy"
          />
        </div>
        <div>
          <label htmlFor="supervisor" className="block text-sm font-medium text-black">Supervisor</label>
          <input
            type="text"
            id="supervisor"
            name="supervisor"
            value={formData.employment?.supervisor || ''}
            onChange={e => handleNestedInputChange(['employment', 'supervisor'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="Supervisor name"
          />
        </div>
        <div>
          <label htmlFor="supervisorPhone" className="block text-sm font-medium text-black">Supervisor Phone</label>
          <input
            type="text"
            id="supervisorPhone"
            name="supervisorPhone"
            value={formData.employment?.supervisor_phone || ''}
            onChange={e => handleNestedInputChange(['employment', 'supervisor_phone'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="Supervisor phone"
          />
        </div>
        <div>
          <label htmlFor="additionalIncome" className="block text-sm font-medium text-black">Additional Income (USD)</label>
          <input
            type="text"
            id="additionalIncome"
            name="additionalIncome"
            value={formData.employment?.additional_income || ''}
            onChange={e => handleNestedInputChange(['employment', 'additional_income'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="$0.00"
          />
        </div>
        <div>
          <label htmlFor="incomeSource" className="block text-sm font-medium text-black">Source</label>
          <input
            type="text"
            id="incomeSource"
            name="incomeSource"
            value={formData.employment?.source || ''}
            onChange={e => handleNestedInputChange(['employment', 'source'], e.target.value)}
            className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            readOnly={isReadOnly}
            placeholder="Source"
          />
        </div>
      </div>
    </div>
  </div>
);

export default EmploymentSection; 