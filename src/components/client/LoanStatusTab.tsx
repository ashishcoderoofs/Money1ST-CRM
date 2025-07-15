import React from 'react';
import type { LoanStatus } from '@/types/loan.types';
import LoanBasicInfo from './loan-sections/LoanBasicInfo';
import ClientInfoSection from './loan-sections/ClientInfoSection';
import ProcessMilestones from './loan-sections/ProcessMilestones';
import ServiceMilestones from './loan-sections/ServiceMilestones';

interface LoanStatusTabProps {
  data: Partial<LoanStatus>;
  onUpdate: (updates: Partial<LoanStatus>) => void;
  isReadOnly?: boolean;
}

const LoanStatusTab: React.FC<LoanStatusTabProps> = ({ data, onUpdate, isReadOnly }) => {
  return (
    <div className="bg-green-200 border border-green-400 p-6 rounded-lg">
      <h3 className="font-semibold text-green-800 text-lg mb-4">Loan Status</h3>
      <LoanBasicInfo data={data} onUpdate={onUpdate} isReadOnly={isReadOnly} />
      <ClientInfoSection data={data} onUpdate={onUpdate} isReadOnly={isReadOnly} />
      <div className="grid grid-cols-2 gap-6">
        <ProcessMilestones data={data} onUpdate={onUpdate} isReadOnly={isReadOnly} />
        <ServiceMilestones data={data} onUpdate={onUpdate} isReadOnly={isReadOnly} />
      </div>
    </div>
  );
};

export default LoanStatusTab; 