import React, { useState } from 'react';

// Types for props
export type ClientFormMode = 'view' | 'edit' | 'create' | 'update';

interface ClientFormTabsProps {
  mode: ClientFormMode;
  client?: any; // Replace 'any' with your Client type
  onSave?: (data: any) => void;
}

export default function ClientFormTabs({ mode, client, onSave }: ClientFormTabsProps) {
  const [activeTab, setActiveTab] = useState<'applicant' | 'coapplicant'>('applicant');
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create');
  // Form state for both applicant and coapplicant
  const [form, setForm] = useState({
    applicant: {
      firstName: client?.applicant?.firstName || '',
      lastName: client?.applicant?.lastName || '',
      email: client?.applicant?.email || '',
      cellPhone: client?.applicant?.cellPhone || '',
      homePhone: client?.applicant?.homePhone || '',
      workPhone: client?.applicant?.workPhone || '',
      otherPhone: client?.applicant?.otherPhone || '',
    },
    coapplicant: {
      firstName: client?.coapplicant?.firstName || '',
      lastName: client?.coapplicant?.lastName || '',
      email: client?.coapplicant?.email || '',
      cellPhone: client?.coapplicant?.cellPhone || '',
      homePhone: client?.coapplicant?.homePhone || '',
      workPhone: client?.coapplicant?.workPhone || '',
      otherPhone: client?.coapplicant?.otherPhone || '',
    },
  });

  const handleTabChange = (tab: 'applicant' | 'coapplicant') => setActiveTab(tab);

  const handleChange = (tab: 'applicant' | 'coapplicant', e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [tab]: {
        ...form[tab],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleEditToggle = () => setIsEditing((prev) => !prev);
  const handleSave = () => onSave?.(form);

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div>
        <div className="min-h-screen bg-gray-50">
          <div className="text-white p-6 shadow-lg bg-[#34495e]">
            <div className="flex items-center justify-between mb-4">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 px-4 py-2 text-white hover:bg-gray-700">
                {/* Back icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left w-4 h-4 mr-2"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                Back to Clients
              </button>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-green-100 text-green-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-3 h-3 mr-1"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                Authenticated
              </div>
            </div>
            <h1 className="text-3xl font-bold">Client Details</h1>
            <p className="text-gray-300 mt-2">Viewing comprehensive client information</p>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="text-2xl font-semibold leading-none tracking-tight flex items-center justify-between">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-5 h-5 mr-2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    {form.applicant.firstName} {form.applicant.lastName}
                  </span>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2" onClick={isEditing ? handleSave : handleEditToggle}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen w-4 h-4 mr-2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>
                      {isEditing ? 'Save' : 'Edit Client'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="w-full">
                  <div role="tablist" aria-orientation="horizontal" className="items-center rounded-md text-muted-foreground flex flex-wrap w-full gap-1 p-2 h-auto bg-muted/50 justify-start">
                    <button type="button" role="tab" aria-selected={activeTab === 'applicant'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'applicant' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => handleTabChange('applicant')}>Applicant</button>
                    <button type="button" role="tab" aria-selected={activeTab === 'coapplicant'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'coapplicant' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => handleTabChange('coapplicant')}>Co-Applicant</button>
                  </div>
                  <div className="mt-6">
                    {activeTab === 'applicant' && (
                      <ApplicantTab
                        data={form.applicant}
                        isEditing={isEditing}
                        onChange={e => handleChange('applicant', e)}
                      />
                    )}
                    {activeTab === 'coapplicant' && (
                      <CoApplicantTab
                        data={form.coapplicant}
                        isEditing={isEditing}
                        onChange={e => handleChange('coapplicant', e)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Applicant Tab Component
function ApplicantTab({ data, isEditing, onChange }: { data: any; isEditing: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="bg-gray-300 p-4 rounded-lg">
      <h3 className="font-semibold text-green-800 mb-4">Primary Applicant Information</h3>
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Name Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">First Name</label>
            <input name="firstName" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.firstName} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Last Name</label>
            <input name="lastName" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.lastName} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Email</label>
            <input name="email" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.email} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Cell Phone</label>
            <input name="cellPhone" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.cellPhone} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Home Phone</label>
            <input name="homePhone" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.homePhone} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Work Phone</label>
            <input name="workPhone" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.workPhone} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Other Phone</label>
            <input name="otherPhone" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.otherPhone} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Co-Applicant Tab Component
function CoApplicantTab({ data, isEditing, onChange }: { data: any; isEditing: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="bg-blue-200 border border-blue-400 p-6 rounded-lg">
      <h3 className="font-semibold text-blue-800 text-lg mb-4">Co-Applicant Information</h3>
      <div className="mb-6">
        <h4 className="font-medium text-green-700 mb-3">Name Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">First Name</label>
            <input name="firstName" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.firstName} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Last Name</label>
            <input name="lastName" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.lastName} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Email</label>
            <input name="email" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.email} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Cell Phone</label>
            <input name="cellPhone" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.cellPhone} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Home Phone</label>
            <input name="homePhone" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.homePhone} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Work Phone</label>
            <input name="workPhone" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.workPhone} onChange={onChange} />
          </div>
          <div>
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-600">Other Phone</label>
            <input name="otherPhone" className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-50" readOnly={!isEditing} value={data.otherPhone} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
} 