import React from 'react';
import type { LoanStatus } from '@/types/loan.types';

interface ServiceMilestonesProps {
  data: Partial<LoanStatus>;
  onUpdate: (updates: Partial<LoanStatus>) => void;
  isReadOnly?: boolean;
}

const inputClass =
  'h-8 w-full rounded border border-gray-300 bg-white px-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition';
const labelClass = 'block text-gray-800 text-xs font-medium mb-1';

const ServiceMilestones: React.FC<ServiceMilestonesProps> = ({ data, onUpdate, isReadOnly }) => {
  return (
    <div className="border border-green-400 bg-green-50 rounded-lg p-4 shadow-sm mb-6">
      <h4 className="text-green-700 font-semibold mb-3">Service Milestones</h4>
      {/* Title Section */}
      <div className="mb-6">
        <h5 className="text-green-700 font-semibold mb-2">Title</h5>
        <div className="grid grid-cols-4 gap-x-4 gap-y-5">
          <div>
            <label className={labelClass}>Company</label>
            <input type="text" className={inputClass} value={data.title?.company || ''} onChange={e => onUpdate({ title: { ...data.title, company: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div>
            <label className={labelClass}>Ordered</label>
            <input type="date" className={inputClass} value={data.title?.ordered || ''} onChange={e => onUpdate({ title: { ...data.title, ordered: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div>
            <label className={labelClass}>Fee Sheet Received</label>
            <input type="date" className={inputClass} value={data.title?.feeSheetReceived || ''} onChange={e => onUpdate({ title: { ...data.title, feeSheetReceived: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div>
            <label className={labelClass}>Docs Received</label>
            <input type="date" className={inputClass} value={data.title?.docsReceived || ''} onChange={e => onUpdate({ title: { ...data.title, docsReceived: e.target.value } })} disabled={isReadOnly} />
          </div>
        </div>
      </div>
      {/* Appraisal Section */}
      <div className="mb-6">
        <h5 className="text-green-700 font-semibold mb-2">Appraisal</h5>
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 mb-2">
          <div>
            <label className={labelClass}>Ordered</label>
            <input type="date" className={inputClass} value={data.appraisal?.ordered || ''} onChange={e => onUpdate({ appraisal: { ...data.appraisal, ordered: e.target.value } })} disabled={isReadOnly || data.appraisal?.orderedNA} />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" className="mr-1" checked={!!data.appraisal?.orderedNA} onChange={e => onUpdate({ appraisal: { ...data.appraisal, orderedNA: e.target.checked } })} disabled={isReadOnly} />
            <span className="text-xs">N/A</span>
          </div>
          <div>
            <label className={labelClass}>Received</label>
            <input type="date" className={inputClass} value={data.appraisal?.received || ''} onChange={e => onUpdate({ appraisal: { ...data.appraisal, received: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input type="text" className={inputClass} value={data.appraisal?.company || ''} onChange={e => onUpdate({ appraisal: { ...data.appraisal, company: e.target.value } })} disabled={isReadOnly} />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-5">
          <div>
            <label className={labelClass}>Value</label>
            <input type="number" className={inputClass} value={data.appraisal?.value ?? ''} onChange={e => onUpdate({ appraisal: { ...data.appraisal, value: Number(e.target.value) } })} disabled={isReadOnly} min={0} step={0.01} />
          </div>
          <div>
            <label className={labelClass}>AVM</label>
            <input type="number" className={inputClass} value={data.appraisal?.avm ?? ''} onChange={e => onUpdate({ appraisal: { ...data.appraisal, avm: Number(e.target.value) } })} disabled={isReadOnly || data.appraisal?.avmNA} min={0} step={0.01} />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" className="mr-1" checked={!!data.appraisal?.avmNA} onChange={e => onUpdate({ appraisal: { ...data.appraisal, avmNA: e.target.checked } })} disabled={isReadOnly} />
            <span className="text-xs">N/A</span>
          </div>
          <div>
            <label className={labelClass}>Fee</label>
            <input type="number" className={inputClass} value={data.appraisal?.fee ?? ''} onChange={e => onUpdate({ appraisal: { ...data.appraisal, fee: Number(e.target.value) } })} disabled={isReadOnly} min={0} step={0.01} />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" className="mr-1" checked={!!data.appraisal?.feePaid} onChange={e => onUpdate({ appraisal: { ...data.appraisal, feePaid: e.target.checked } })} disabled={isReadOnly} />
            <span className="text-xs">Fee Paid</span>
          </div>
        </div>
      </div>
      {/* VOE Section */}
      <div className="mb-6">
        <h5 className="text-green-700 font-semibold mb-2">VOE</h5>
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 mb-2">
          <div>
            <label className={labelClass}>Sent</label>
            <input type="date" className={inputClass} value={data.voe?.sent || ''} onChange={e => onUpdate({ voe: { ...data.voe, sent: e.target.value } })} disabled={isReadOnly || data.voe?.sentNA} />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" className="mr-1" checked={!!data.voe?.sentNA} onChange={e => onUpdate({ voe: { ...data.voe, sentNA: e.target.checked } })} disabled={isReadOnly} />
            <span className="text-xs">N/A</span>
          </div>
          <div>
            <label className={labelClass}>Received</label>
            <input type="date" className={inputClass} value={data.voe?.received || ''} onChange={e => onUpdate({ voe: { ...data.voe, received: e.target.value } })} disabled={isReadOnly} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-5">
          <div>
            <label className={labelClass}>Contact</label>
            <input type="text" className={inputClass} value={data.voe?.contact || ''} onChange={e => onUpdate({ voe: { ...data.voe, contact: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="text" className={inputClass} value={data.voe?.phone || ''} onChange={e => onUpdate({ voe: { ...data.voe, phone: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={data.voe?.email || ''} onChange={e => onUpdate({ voe: { ...data.voe, email: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" className="mr-1" checked={!!data.voe?.workNumber} onChange={e => onUpdate({ voe: { ...data.voe, workNumber: e.target.checked } })} disabled={isReadOnly} />
            <span className="text-xs">Work Number</span>
          </div>
        </div>
      </div>
      {/* VOM Section */}
      <div>
        <h5 className="text-green-700 font-semibold mb-2">VOM</h5>
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 mb-2">
          <div>
            <label className={labelClass}>Sent</label>
            <input type="date" className={inputClass} value={data.vom?.sent || ''} onChange={e => onUpdate({ vom: { ...data.vom, sent: e.target.value } })} disabled={isReadOnly || data.vom?.sentNA} />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" className="mr-1" checked={!!data.vom?.sentNA} onChange={e => onUpdate({ vom: { ...data.vom, sentNA: e.target.checked } })} disabled={isReadOnly} />
            <span className="text-xs">N/A</span>
          </div>
          <div>
            <label className={labelClass}>Received</label>
            <input type="date" className={inputClass} value={data.vom?.received || ''} onChange={e => onUpdate({ vom: { ...data.vom, received: e.target.value } })} disabled={isReadOnly} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-5">
          <div>
            <label className={labelClass}>Contact</label>
            <input type="text" className={inputClass} value={data.vom?.contact || ''} onChange={e => onUpdate({ vom: { ...data.vom, contact: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="text" className={inputClass} value={data.vom?.phone || ''} onChange={e => onUpdate({ vom: { ...data.vom, phone: e.target.value } })} disabled={isReadOnly} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={data.vom?.email || ''} onChange={e => onUpdate({ vom: { ...data.vom, email: e.target.value } })} disabled={isReadOnly} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMilestones; 