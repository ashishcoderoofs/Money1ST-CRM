// LoanStatus and Client extension for loan tracking

export interface LoanStatus {
  // Basic Info
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lenderId: string;
  loanAmount: number;
  mortgageType: 'CONV' | 'FHA' | 'VA' | 'HELOC' | 'NON-QM';
  loanPurpose: 'PURCHASE' | 'CASH OUT' | 'RATE/TERM' | 'IRRRL' | 'STREAMLINE';
  loanStatus: 'Awaiting Submission Docs' | 'Submitted' | 'In Review' | 'Approved' | 'Awaiting Condition Docs' | 'CTC' | 'Closed' | 'Funded' | 'Disbursed' | 'CNH/TUD';
  statusDate: string;
  // Client Info
  dateIn: string;
  timeIn: string;
  mortgageBroker: string;
  loanOfficer: string;
  fieldTrainer: string;
  referringAgent: string;
  clwReviewed: string;
  clwSignedByClient: string;
  preApprovalSent: string;
  // Process Milestones
  dateCreditPulled: string;
  registrationDate: string;
  ausDuDate: string;
  ausDuDateNA: boolean;
  lockDate: string;
  lockExpirationDate: string;
  lenderDisclosuresSent: string;
  lenderDisclosuresSigned: string;
  brokerDisclosuresSent: string;
  brokerDisclosuresSigned: string;
  loanSubmissionDate: string;
  conditionalApprovalReceived: string;
  approvalReviewedWithCrm: string;
  submittedForFinalReview: string;
  clearedToCloseDate: string;
  closedDate: string;
  fundedDate: string;
  disbursedDate: string;
  disbursedAmount: number;
  stackedDate: string;
  stackedBy: string;
  // Service Milestones
  title: {
    company: string;
    ordered: string;
    feeSheetReceived: string;
    docsReceived: string;
  };
  appraisal: {
    ordered: string;
    orderedNA: boolean;
    received: string;
    company: string;
    value: number;
    avm: number;
    avmNA: boolean;
    fee: number;
    feePaid: boolean;
  };
  voe: {
    sent: string;
    sentNA: boolean;
    received: string;
    contact: string;
    phone: string;
    email: string;
    workNumber: boolean;
  };
  vom: {
    sent: string;
    sentNA: boolean;
    received: string;
    contact: string;
    phone: string;
    email: string;
  };
}

// Extend existing Client interface (for frontend usage)
import type { Client as BaseClient } from './mongodb-client';

export interface Client extends BaseClient {
  loanStatus?: LoanStatus;
} 