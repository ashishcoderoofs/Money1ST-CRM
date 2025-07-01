import React, { useEffect } from 'react';
import { useConsultant } from '@/hooks/useConsultantAPI';

// Debug component to inspect consultant data structure
export function ConsultantDataDebug({ consultantId }: { consultantId: string }) {
  const { data: response, isLoading } = useConsultant(consultantId);
  
  useEffect(() => {
    if (response?.data) {
      console.log('=== CONSULTANT DATA DEBUG ===');
      console.log('Raw consultant data:', response.data);
      console.log('=== FIELD BY FIELD ===');
      
      const fields = [
        // Basic Information
        'consultantId', 'entryDate', 'position', 'status', 'title',
        'firstName', 'middleInitial', 'lastName', 'suffix', 
        'comment', 'remarks',
        
        // Contact Information
        'email', 'maidenName', 'address', 'city', 'county', 'state', 
        'zipCode', 'homePhone', 'mobile', 'workPhone', 'otherPhone', 
        'fax', 'membershipType', 'amount', 'jointMemberName',
        
        // Personal Information
        'dateOfBirth', 'maritalStatus', 'sex', 'race', 'spouseName', 
        'anniversary', 'spouseOccupation', 'educationLevel', 
        'driversLicenseNumber', 'driversLicenseState', 'employmentStatus', 
        'employer', 'occupation', 'industry',
        
        // CFS Information
        'ssn', 'ein', 'hireDate', 'yearsWithFrq', 'companyName', 
        'cfsCertificationDate', 'effectiveDate', 'memberType', 
        'mbrAmt', 'payType', 'mpFee', 'cfsStatus', 'statusDate',
        
        // Emergency Contact
        'emergencyContactName', 'emergencyContactRelationship', 
        'emergencyContactPhone'
      ];
      
      fields.forEach(field => {
        const value = response.data[field];
        const type = typeof value;
        const isEmpty = value === undefined || value === null || value === '';
        console.log(`${field}: ${value} (${type}) ${isEmpty ? '❌ EMPTY' : '✅'}`);
      });
      
      console.log('=== DATE FIELDS CONVERSION TEST ===');
      const dateFields = ['entryDate', 'dateOfBirth', 'anniversary', 'hireDate', 'cfsCertificationDate', 'effectiveDate', 'statusDate'];
      dateFields.forEach(field => {
        const value = response.data[field];
        if (value) {
          const asString = typeof value === 'string' ? value.split('T')[0] : value instanceof Date ? value.toISOString().split('T')[0] : '';
          console.log(`${field}: "${value}" -> "${asString}"`);
        }
      });
    }
  }, [response]);
  
  if (isLoading) return <div>Loading debug data...</div>;
  if (!response?.data) return <div>No consultant data</div>;
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Consultant Data Debug</h3>
      <p>Check browser console for detailed output</p>
      <pre className="text-xs overflow-auto max-h-96">
        {JSON.stringify(response.data, null, 2)}
      </pre>
    </div>
  );
}
