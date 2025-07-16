import React from 'react';
import { US_STATES } from './ClientFormTabs';

interface MortgageApplicationSectionProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  isReadOnly: boolean;
}

const occupancyTypes = [
  'Primary Residence',
  'Secondary Residence', 
  'Investment Property',
  'Vacation Home'
];

const armOptions = ['5/1', '7/1', '10/1'];
const fixedOptions = [15, 30];

const MortgageApplicationSection: React.FC<MortgageApplicationSectionProps> = ({ formData, setFormData, isReadOnly }) => {
  // Helper to update nested mortgage data
  const updateMortgageField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      mortgage: {
        ...prev.mortgage,
        [field]: value
      }
    }));
  };

  // Helper for array fields (ARM, Fixed options)
  const updateMortgageArrayField = (field: string, index: number, value: any) => {
    setFormData((prev: any) => {
      const arr = Array.isArray(prev.mortgage?.[field]) ? [...prev.mortgage[field]] : [];
      arr[index] = value;
      return {
        ...prev,
        mortgage: {
          ...prev.mortgage,
          [field]: arr
        }
      };
    });
  };

  const mortgage = formData.mortgage || {};

  return (
    <div className="bg-blue-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Mortgages</h3>
      
      {/* Property Information Section */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-blue-700 mb-2">Property Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Address</label>
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              placeholder={!isReadOnly ? 'Enter property address' : undefined} 
              value={mortgage.address || ''} 
              onChange={e => updateMortgageField('address', e.target.value)} 
              disabled={isReadOnly} 
              minLength={10} 
              required 
            />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">City</label>
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              placeholder={!isReadOnly ? 'Enter city' : undefined} 
              value={mortgage.city || ''} 
              onChange={e => updateMortgageField('city', e.target.value)} 
              disabled={isReadOnly} 
              pattern="^[A-Za-z ]+$" 
              required 
            />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">State</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              value={mortgage.state || ''} 
              onChange={e => updateMortgageField('state', e.target.value)} 
              disabled={isReadOnly} 
              required
            >
              <option value="">Select state</option>
              {US_STATES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Zip Code</label>
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              placeholder="Enter zip code" 
              value={mortgage.zip_code || ''} 
              onChange={e => updateMortgageField('zip_code', e.target.value)} 
              disabled={isReadOnly} 
              pattern="^\d{5}(-\d{4})?$" 
              required 
            />
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            {/* Existing Mortgages Section */}
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-blue-900 mb-2">Existing Mortgages</h4>
              <div>
                                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800 mr-2">Occupancy Type</label>
                <select 
                  className="items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8 w-40 inline-block" 
                  value={mortgage.occupancy_type || ''} 
                  onChange={e => updateMortgageField('occupancy_type', e.target.value)} 
                  disabled={isReadOnly} 
                  required
                >
                  <option value="">Select type</option>
                  {occupancyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium black mb-2">1st Mortgage</h5>
              <div className="space-y-2">
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Balance</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder={!isReadOnly ? '$0.00' : undefined} 
                    value={mortgage.first_mortgage_balance || ''} 
                    onChange={e => updateMortgageField('first_mortgage_balance', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Rate</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0.000%" 
                    value={mortgage.first_mortgage_rate || ''} 
                    onChange={e => updateMortgageField('first_mortgage_rate', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Term</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0" 
                    value={mortgage.first_mortgage_term || ''} 
                    onChange={e => updateMortgageField('first_mortgage_term', e.target.value)} 
                    disabled={isReadOnly} 
                    min={1} 
                    max={40} 
                  />
                </div>
              </div>
              <div className="pt-[70px]">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Payment</label>
                <input 
                  type="number" 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                  placeholder="$0.00" 
                  value={mortgage.first_mortgage_payment || ''} 
                  onChange={e => updateMortgageField('first_mortgage_payment', e.target.value)} 
                  disabled={isReadOnly} 
                  min={0} 
                  step="0.01" 
                />
              </div>
              <div>
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Lienholder 1</label>
                <input 
                  type="text" 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                  placeholder="Enter lienholder" 
                  value={mortgage.lienholder_1 || ''} 
                  onChange={e => updateMortgageField('lienholder_1', e.target.value)} 
                  disabled={isReadOnly} 
                  maxLength={100} 
                />
              </div>
            </div>

            <div className="pt-16">
              <h5 className="text-sm font-medium black mb-2">2nd Mortgage</h5>
              <div className="space-y-2">
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Balance</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$0.00" 
                    value={mortgage.second_mortgage_balance || ''} 
                    onChange={e => updateMortgageField('second_mortgage_balance', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Rate</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0.000%" 
                    value={mortgage.second_mortgage_rate || ''} 
                    onChange={e => updateMortgageField('second_mortgage_rate', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Term</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0" 
                    value={mortgage.second_mortgage_term || ''} 
                    onChange={e => updateMortgageField('second_mortgage_term', e.target.value)} 
                    disabled={isReadOnly} 
                    min={1} 
                    max={40} 
                  />
                </div>
                <div className="pt-[65px]">
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Payment</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$0.00" 
                    value={mortgage.second_mortgage_payment || ''} 
                    onChange={e => updateMortgageField('second_mortgage_payment', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Lienholder 2</label>
                  <input 
                    type="text" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="Enter lienholder" 
                    value={mortgage.lienholder_2 || ''} 
                    onChange={e => updateMortgageField('lienholder_2', e.target.value)} 
                    disabled={isReadOnly} 
                    maxLength={100} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Proposed Loan Section */}
            <h4 className="text-md font-medium text-blue-700 mb-2">Proposed Loan</h4>
            <div>
              <h5 className="text-sm font-medium black mb-2">1st Loan</h5>
              <div className="space-y-2">
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Loan Amount</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$350,000.00" 
                    value={mortgage.first_loan_amount || ''} 
                    onChange={e => updateMortgageField('first_loan_amount', e.target.value)} 
                    disabled={isReadOnly} 
                    min={1000} 
                    step="0.01" 
                    required 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Rate</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0.000%" 
                    value={mortgage.first_loan_rate || ''} 
                    onChange={e => updateMortgageField('first_loan_rate', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Term</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0" 
                    value={mortgage.first_loan_term || ''} 
                    onChange={e => updateMortgageField('first_loan_term', e.target.value)} 
                    disabled={isReadOnly} 
                    min={1} 
                    max={40} 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Int. Term</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0" 
                    value={mortgage.first_loan_int_term || ''} 
                    onChange={e => updateMortgageField('first_loan_int_term', e.target.value)} 
                    disabled={isReadOnly} 
                    min={1} 
                    max={mortgage.first_loan_term || 40} 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">New Payment</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$0.00" 
                    value={mortgage.first_loan_new_payment || ''} 
                    onChange={e => updateMortgageField('first_loan_new_payment', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-[120px]">
              <h5 className="text-sm font-medium black mb-2">2nd Loan</h5>
              <div className="space-y-2">
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Loan Amount</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$0.00" 
                    value={mortgage.second_loan_amount || ''} 
                    onChange={e => updateMortgageField('second_loan_amount', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Rate</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0.000%" 
                    value={mortgage.second_loan_rate || ''} 
                    onChange={e => updateMortgageField('second_loan_rate', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Term</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0" 
                    value={mortgage.second_loan_term || ''} 
                    onChange={e => updateMortgageField('second_loan_term', e.target.value)} 
                    disabled={isReadOnly} 
                    min={1} 
                    max={40} 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Int. Term</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="0" 
                    value={mortgage.second_loan_int_term || ''} 
                    onChange={e => updateMortgageField('second_loan_int_term', e.target.value)} 
                    disabled={isReadOnly} 
                    min={1} 
                    max={mortgage.second_loan_term || 40} 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">New Payment</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$0.00" 
                    value={mortgage.second_loan_new_payment || ''} 
                    onChange={e => updateMortgageField('second_loan_new_payment', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Financial Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Existing Balance</label>
            <input 
              type="number" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              placeholder="$0.00" 
              value={mortgage.existing_balance || ''} 
              onChange={e => updateMortgageField('existing_balance', e.target.value)} 
              disabled={isReadOnly} 
              min={0} 
              step="0.01" 
            />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Property Taxes</label>
            <input 
              type="number" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              placeholder="$0.00" 
              value={mortgage.property_taxes || ''} 
              onChange={e => updateMortgageField('property_taxes', e.target.value)} 
              disabled={isReadOnly} 
              min={0} 
              step="0.01" 
            />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Homeowners Insurance</label>
            <input 
              type="number" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              placeholder="$0.00" 
              value={mortgage.homeowners_insurance || ''} 
              onChange={e => updateMortgageField('homeowners_insurance', e.target.value)} 
              disabled={isReadOnly} 
              min={0} 
              step="0.01" 
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <button 
              type="button" 
              role="checkbox" 
              aria-checked={!!mortgage.taxes_included} 
              data-state={mortgage.taxes_included ? "checked" : "unchecked"} 
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" 
              onClick={() => updateMortgageField('taxes_included', !mortgage.taxes_included)}
              disabled={isReadOnly}
            >
              {mortgage.taxes_included && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              )}
            </button>
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm black">Taxes included in payment?</label>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              type="button" 
              role="checkbox" 
              aria-checked={!!mortgage.hoi_included} 
              data-state={mortgage.hoi_included ? "checked" : "unchecked"} 
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" 
              onClick={() => updateMortgageField('hoi_included', !mortgage.hoi_included)}
              disabled={isReadOnly}
            >
              {mortgage.hoi_included && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              )}
            </button>
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm black">HOI included in payment?</label>
          </div>
        </div>

        <div className="mt-4">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Purpose of Loan</label>
          <textarea 
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1" 
            placeholder="Enter purpose of loan" 
            rows={3}
            value={mortgage.loan_purpose || ''} 
            onChange={e => updateMortgageField('loan_purpose', e.target.value)} 
            disabled={isReadOnly} 
            maxLength={500}
          />
        </div>
      </div>

      {/* Loan Details Section */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-blue-700 mb-2">Loan Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Market Value</label>
              <input 
                type="number" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
                placeholder="$475,000.00" 
                value={mortgage.market_value || ''} 
                onChange={e => updateMortgageField('market_value', e.target.value)} 
                disabled={isReadOnly} 
                min={10000} 
                step="0.01" 
                required 
              />
            </div>
            <div>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Cash to Close</label>
              <input 
                type="number" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
                placeholder="$0.00" 
                value={mortgage.cash_to_close || ''} 
                onChange={e => updateMortgageField('cash_to_close', e.target.value)} 
                disabled={isReadOnly} 
                min={0} 
                step="0.01" 
              />
            </div>
            <div>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Loan Volume</label>
              <input 
                type="number" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
                placeholder="$350,000.00" 
                value={mortgage.loan_volume || ''} 
                onChange={e => updateMortgageField('loan_volume', e.target.value)} 
                disabled={isReadOnly} 
                min={0} 
                max={mortgage.market_value || 10000000} 
                step="0.01" 
                required 
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Est. Fees</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="number" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1" 
                  placeholder="1.300%" 
                  value={mortgage.estimated_fees || ''} 
                  onChange={e => updateMortgageField('estimated_fees', e.target.value)} 
                  disabled={isReadOnly} 
                  min={0} 
                  max={10} 
                  step="0.001" 
                />
                <input 
                  type="number" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1" 
                  placeholder="$0.00" 
                  value={mortgage.estimated_fees_amount || ''} 
                  onChange={e => updateMortgageField('estimated_fees_amount', e.target.value)} 
                  disabled={isReadOnly} 
                  min={0} 
                  step="0.01"
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Appraisal/Report Fee</label>
              <input 
                type="number" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
                placeholder="$0.00" 
                value={mortgage.appraisal_fee || ''} 
                onChange={e => updateMortgageField('appraisal_fee', e.target.value)} 
                disabled={isReadOnly} 
                min={0} 
                step="0.01" 
              />
            </div>
            <div>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">LTV</label>
              <input 
                type="text" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
                placeholder="74 / 0" 
                value={mortgage.ltv || ''} 
                onChange={e => updateMortgageField('ltv', e.target.value)} 
                disabled={isReadOnly} 
                pattern="^\d+\s*/\s*\d+$"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loan Options Section */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-blue-700 mb-2">Loan Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium black mb-2">ARM</h5>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Option</label>
                  <div className="text-xs black py-1 px-2 bg-gray-100 rounded">5/1</div>
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Rate</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="4.250%" 
                    value={mortgage.arm_rate_0 || ''} 
                    onChange={e => updateMortgageField('arm_rate_0', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Payment</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$900.00" 
                    value={mortgage.arm_payment_0 || ''} 
                    onChange={e => updateMortgageField('arm_payment_0', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs black py-1 px-2 bg-gray-100 rounded">7/1</div>
                </div>
                <div>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="4.500%" 
                    value={mortgage.arm_rate_1 || ''} 
                    onChange={e => updateMortgageField('arm_rate_1', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$900.00" 
                    value={mortgage.arm_payment_1 || ''} 
                    onChange={e => updateMortgageField('arm_payment_1', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs black py-1 px-2 bg-gray-100 rounded">10/1</div>
                </div>
                <div>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="5.000%" 
                    value={mortgage.arm_rate_2 || ''} 
                    onChange={e => updateMortgageField('arm_rate_2', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$1,000.00" 
                    value={mortgage.arm_payment_2 || ''} 
                    onChange={e => updateMortgageField('arm_payment_2', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium black mb-2">FIXED</h5>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Option</label>
                  <div className="text-xs black py-1 px-2 bg-gray-100 rounded">15</div>
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Rate</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="3.250%" 
                    value={mortgage.fixed_rate_0 || ''} 
                    onChange={e => updateMortgageField('fixed_rate_0', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-gray-800">Payment</label>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$1,600.00" 
                    value={mortgage.fixed_payment_0 || ''} 
                    onChange={e => updateMortgageField('fixed_payment_0', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs black py-1 px-2 bg-gray-100 rounded">30</div>
                </div>
                <div>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="2.850%" 
                    value={mortgage.fixed_rate_1 || ''} 
                    onChange={e => updateMortgageField('fixed_rate_1', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0.001} 
                    max={30} 
                    step="0.001" 
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8" 
                    placeholder="$1,447.45" 
                    value={mortgage.fixed_payment_1 || ''} 
                    onChange={e => updateMortgageField('fixed_payment_1', e.target.value)} 
                    disabled={isReadOnly} 
                    min={0} 
                    step="0.01" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">Closing Cost</label>
            <input 
              type="number" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              placeholder="$4,000.00" 
              value={mortgage.closing_cost || ''} 
              onChange={e => updateMortgageField('closing_cost', e.target.value)} 
              disabled={isReadOnly} 
              min={0} 
              step="0.01" 
            />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium black">DTI</label>
            <input 
              type="number" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1" 
              placeholder="75.00%" 
              value={mortgage.dti || ''} 
              onChange={e => updateMortgageField('dti', e.target.value)} 
              disabled={isReadOnly} 
              min={0} 
              max={100} 
              step="0.01" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageApplicationSection;
