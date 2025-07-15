import React from 'react';
import { TITLE_OPTIONS, SUFFIX_OPTIONS } from '@/constants';

interface NameInformationSectionProps {
  formData: any;
  isReadOnly: boolean;
  isCreate?: boolean;
  errors?: Record<string, string>;
  clientId?: string;
  entryDate?: string;
  handleNestedInputChange: (path: string[], value: any) => void;
}

const NameInformationSection: React.FC<NameInformationSectionProps> = ({ formData, isReadOnly, isCreate, errors = {}, clientId, entryDate, handleNestedInputChange }) => (
  <div className=" p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Name Information</h3>
    {/* Removed Client ID and Entry Date fields */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label htmlFor="title" className="text-sm font-medium text-gray-600">Title</label>
        <select
          value={formData.title || ''}
          onChange={e => handleNestedInputChange(['title'], e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        >
          <option value="">Select...</option>
          {TITLE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
      </div>
      <div>
        <label htmlFor="first_name" className="text-sm font-medium text-gray-600">First Name *</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name || ''}
          onChange={e => handleNestedInputChange(['first_name'], e.target.value)}
          placeholder={!isReadOnly ? 'Enter first name' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
        {errors.first_name && <div className="text-red-500 text-xs mt-1">{errors.first_name}</div>}
      </div>
      <div>
        <label htmlFor="middle_initial" className="text-sm font-medium text-gray-600">Middle Initial</label>
        <input
          type="text"
          id="middle_initial"
          name="middle_initial"
          value={formData.middle_initial || ''}
          onChange={e => handleNestedInputChange(['middle_initial'], e.target.value)}
          placeholder={!isReadOnly ? 'Enter middle initial' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
        {errors.middle_initial && <div className="text-red-500 text-xs mt-1">{errors.middle_initial}</div>}
      </div>
      <div>
        <label htmlFor="last_name" className="text-sm font-medium text-gray-600">Last Name *</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name || ''}
          onChange={e => handleNestedInputChange(['last_name'], e.target.value)}
          placeholder={!isReadOnly ? 'Enter last name' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
        {errors.last_name && <div className="text-red-500 text-xs mt-1">{errors.last_name}</div>}
      </div>
     
      <div>
        <label htmlFor="suffix" className="text-sm font-medium text-gray-600">Suffix</label>
        <select
          value={formData.suffix || ''}
          onChange={e => handleNestedInputChange(['suffix'], e.target.value)}
          disabled={isReadOnly}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base md:text-sm"
        >
          <option value="">Select...</option>
          {SUFFIX_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errors.suffix && <div className="text-red-500 text-xs mt-1">{errors.suffix}</div>}
      </div>
      <div>
        <label htmlFor="maiden_name" className="text-sm font-medium text-gray-600">Maiden Name</label>
        <input
          type="text"
          id="maiden_name"
          name="maiden_name"
          value={formData.maiden_name || ''}
          onChange={e => handleNestedInputChange(['maiden_name'], e.target.value)}
          placeholder={!isReadOnly ? 'Enter maiden name' : undefined}
          className="bg-white flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          readOnly={isReadOnly}
        />
        {errors.maiden_name && <div className="text-red-500 text-xs mt-1">{errors.maiden_name}</div>}
      </div>
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="is_consultant"
          checked={!!formData.is_consultant}
          onChange={e => handleNestedInputChange(['is_consultant'], e.target.checked)}
          disabled={isReadOnly}
          className="mr-2"
        />
        <label htmlFor="is_consultant" className="text-sm font-medium text-gray-600">Is Consultant</label>
      </div>
    </div>
  </div>
);

export default NameInformationSection; 