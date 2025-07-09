import React from 'react';

interface HouseholdMembersSectionProps {
  formData: any;
  isReadOnly: boolean;
  handleNestedInputChange: (path: string[], value: any) => void;
  updateHouseholdMember: (index: number, field: string, value: any) => void;
  removeHouseholdMember: (index: number) => void;
  handleAddHouseholdMember: () => void;
}

const HouseholdMembersSection: React.FC<HouseholdMembersSectionProps> = ({
  formData,
  isReadOnly,
  updateHouseholdMember,
  removeHouseholdMember,
  handleAddHouseholdMember
}) => (
  <div className="bg-gray-200 p-6 rounded-lg mb-6">
    <h3 className="font-semibold text-green-800 mb-4">Household Members</h3>
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-green-600 text-white px-4 py-2 hidden lg:block">
        <div className="grid grid-cols-9 gap-3 text-sm font-medium">
          <div>First Name</div>
          <div>MI</div>
          <div>Last Name</div>
          <div>Relationship</div>
          <div>Date of Birth</div>
          <div>Age</div>
          <div>Sex</div>
          <div>Marital Status</div>
          <div>SSN</div>
        </div>
      </div>
      <div className="p-4">
        {formData.household_members && formData.household_members.length > 0 ? (
          formData.household_members.map((member, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg last:mb-0">
              <div className="mb-4 flex items-center justify-between">
                <h5 className="font-medium text-gray-900">Member {index + 1}</h5>
                {!isReadOnly && (
                  <button
                    type="button"
                    className="text-red-600 hover:underline text-xs"
                    onClick={() => removeHouseholdMember(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-9 gap-3">
                <div>
                  <label className="block text-xs font-medium text-black">First Name</label>
                  <input
                    type="text"
                    value={member.first_name || ''}
                    onChange={e => updateHouseholdMember(index, 'first_name', e.target.value)}
                    disabled={isReadOnly}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">MI</label>
                  <input
                    type="text"
                    value={member.middle_initial || ''}
                    onChange={e => updateHouseholdMember(index, 'middle_initial', e.target.value)}
                    disabled={isReadOnly}
                    maxLength={1}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                    placeholder="MI"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">Last Name</label>
                  <input
                    type="text"
                    value={member.last_name || ''}
                    onChange={e => updateHouseholdMember(index, 'last_name', e.target.value)}
                    disabled={isReadOnly}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">Relationship</label>
                  <input
                    type="text"
                    value={member.relationship || ''}
                    onChange={e => updateHouseholdMember(index, 'relationship', e.target.value)}
                    disabled={isReadOnly}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                    placeholder="Relationship"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">Date of Birth</label>
                  <input
                    type="date"
                    value={member.dob || ''}
                    onChange={e => updateHouseholdMember(index, 'dob', e.target.value)}
                    disabled={isReadOnly}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">Age</label>
                  <input
                    type="number"
                    value={member.age || ''}
                    onChange={e => updateHouseholdMember(index, 'age', e.target.value)}
                    disabled={isReadOnly}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">Sex</label>
                  <select
                    value={member.sex || ''}
                    onChange={e => updateHouseholdMember(index, 'sex', e.target.value)}
                    disabled={isReadOnly}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                  >
                    <option value="">Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">Marital Status</label>
                  <select
                    value={member.marital_status || ''}
                    onChange={e => updateHouseholdMember(index, 'marital_status', e.target.value)}
                    disabled={isReadOnly}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                  >
                    <option value="">Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">SSN</label>
                  <input
                    type="text"
                    value={member.ssn || ''}
                    onChange={e => updateHouseholdMember(index, 'ssn', e.target.value)}
                    disabled={isReadOnly}
                    className="p-2 bg-gray-50 rounded border text-sm w-full"
                    placeholder="SSN"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No household members added.</div>
        )}
        {!isReadOnly && (
          <button
            type="button"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleAddHouseholdMember}
          >
            Add Member
          </button>
        )}
      </div>
    </div>
  </div>
);

export default HouseholdMembersSection; 