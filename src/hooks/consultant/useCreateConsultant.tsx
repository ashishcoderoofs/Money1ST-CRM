
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { ConsultantFormValues } from "@/components/ConsultantForm";

// Hook to create a new consultant
export function useCreateConsultant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consultant: ConsultantFormValues & { manager_id: string | null }) => {
      console.log("Creating consultant with data:", consultant);
      
      // This creates the auth user. A trigger (`handle_new_user`) will then create the profile.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: consultant.email,
        password: 'password123', // This is a placeholder and insecure.
        options: {
          data: {
            first_name: consultant.first_name,
            last_name: consultant.last_name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed in Auth.");

      // Now, update the profile that the trigger created with the rest of the form data.
      const { data, error } = await supabase
        .from("profiles")
        .update({
          phone: consultant.phone,
          role: consultant.role,
          manager_id: consultant.manager_id,
          status: 'Active',
          comment: consultant.comment,
          remarks: consultant.remarks,
          maiden_name: consultant.maiden_name,
          address: consultant.address,
          city: consultant.city,
          county: consultant.county,
          state: consultant.state,
          zip_code: consultant.zip_code,
          mobile_phone: consultant.mobile_phone,
          work_phone: consultant.work_phone,
          other_phone: consultant.other_phone,
          fax: consultant.fax,
          membership_type: consultant.membership_type,
          amount: consultant.amount,
          joint_member_name: consultant.joint_member_name,
          emergency_contact_name: consultant.emergency_contact_name,
          emergency_contact_relationship: consultant.emergency_contact_relationship,
          emergency_contact_phone: consultant.emergency_contact_phone,
          // Personal information fields
          dob: consultant.dob || null,
          marital_status: consultant.marital_status,
          sex: consultant.sex,
          race: consultant.race,
          spouse_name: consultant.spouse_name,
          anniversary: consultant.anniversary || null,
          spouse_occupation: consultant.spouse_occupation,
          education_level: consultant.education_level,
          drivers_license_number: consultant.drivers_license_number,
          drivers_license_state: consultant.drivers_license_state,
          employment_status: consultant.employment_status,
          employer: consultant.employer,
          occupation: consultant.occupation,
          industry: consultant.industry,
          // CFS Information fields
          ssn: consultant.ssn,
          ein: consultant.ein,
          hire_date: consultant.hire_date || null,
          years_with_frq: consultant.years_with_frq,
          company_name: consultant.company_name,
          cfs_certification_date: consultant.cfs_certification_date || null,
          effective_date: consultant.effective_date || null,
          member_type: consultant.member_type,
          mbr_amt: consultant.mbr_amt,
          pay_type: consultant.pay_type,
          mp_fee: consultant.mp_fee,
          cfs_status: consultant.cfs_status,
          status_date: consultant.status_date || null,
        })
        .eq("id", authData.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"] });
      toast.success("Consultant created successfully.");
    },
    onError: (error) => {
      console.error("Create consultant error:", error);
      toast.error(`Failed to create consultant: ${error.message}`);
    },
  });
}
