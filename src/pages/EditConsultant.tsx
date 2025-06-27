
import { useNavigate, useParams } from "react-router-dom";
import { useConsultant, useUpdateConsultant } from "@/hooks/consultant";
import { ConsultantForm, type ConsultantFormValues } from "@/components/ConsultantForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditConsultant() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: consultant, isLoading: isLoadingConsultant } = useConsultant(id ?? null);
  const updateConsultantMutation = useUpdateConsultant();

  const handleSubmit = (values: ConsultantFormValues) => {
    if (!id) return;
    
    console.log("Submitting form values:", values);
    
    // Clean and prepare the data for submission with better manager_id handling
    const cleanedData = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone || null,
      role: values.role,
      // More careful handling of manager_id
      manager_id: (() => {
        if (!values.manager_id || values.manager_id === 'no-manager' || values.manager_id === 'placeholder') {
          return null;
        }
        // Ensure we're not setting a manager to themselves
        if (values.manager_id === id) {
          console.warn("Cannot set manager to self, setting to null");
          return null;
        }
        return values.manager_id;
      })(),
      comment: values.comment || null,
      remarks: values.remarks || null,
      maiden_name: values.maiden_name || null,
      address: values.address || null,
      city: values.city || null,
      county: values.county || null,
      state: values.state || null,
      zip_code: values.zip_code || null,
      mobile_phone: values.mobile_phone || null,
      work_phone: values.work_phone || null,
      other_phone: values.other_phone || null,
      fax: values.fax || null,
      membership_type: values.membership_type || null,
      amount: values.amount || null,
      joint_member_name: values.joint_member_name || null,
      emergency_contact_name: values.emergency_contact_name || null,
      emergency_contact_relationship: values.emergency_contact_relationship || null,
      emergency_contact_phone: values.emergency_contact_phone || null,
      status: values.status,
      // Personal information fields
      dob: values.dob || null,
      marital_status: values.marital_status || null,
      sex: values.sex || null,
      race: values.race || null,
      spouse_name: values.spouse_name || null,
      anniversary: values.anniversary || null,
      spouse_occupation: values.spouse_occupation || null,
      education_level: values.education_level || null,
      drivers_license_number: values.drivers_license_number || null,
      drivers_license_state: values.drivers_license_state || null,
      employment_status: values.employment_status || null,
      employer: values.employer || null,
      occupation: values.occupation || null,
      industry: values.industry || null,
      // CFS Information fields
      ssn: values.ssn || null,
      ein: values.ein || null,
      hire_date: values.hire_date || null,
      years_with_frq: values.years_with_frq || null,
      company_name: values.company_name || null,
      cfs_certification_date: values.cfs_certification_date || null,
      effective_date: values.effective_date || null,
      member_type: values.member_type || null,
      mbr_amt: values.mbr_amt || null,
      pay_type: values.pay_type || null,
      mp_fee: values.mp_fee || null,
      cfs_status: values.cfs_status || null,
      status_date: values.status_date || null,
      // New fields
      title: values.title || null,
      mi: values.mi || null,
      suffix: values.suffix || null,
    };
    
    console.log("Cleaned data for submission:", cleanedData);
    
    updateConsultantMutation.mutate(
      { 
        id,
        ...cleanedData
      },
      {
        onSuccess: () => {
          console.log("Update successful, navigating back");
          navigate("/securia/consultants");
        },
        onError: (error) => {
          console.error("Update failed:", error);
        },
      }
    );
  };

  if (isLoadingConsultant) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Edit Consultant Profile</h2>
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  if (!consultant) {
    return <div>Consultant not found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Edit Consultant Profile</h2>
      <ConsultantForm
        onSubmit={handleSubmit}
        isLoading={updateConsultantMutation.isPending}
        defaultValues={consultant}
        isEditMode={true}
      />
    </div>
  );
}
