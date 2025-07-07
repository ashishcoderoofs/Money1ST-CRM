import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFormSchema } from "./clientFormSchema";
import { useCreateClient, useUpdateClient } from "./useClientMutations";
import { useEffect } from "react";
import { MongoClient } from "@/types/mongodb-client";

export function useClientForm(client?: MongoClient | null) {
  const form = useForm({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      applicant: "",
      co_applicant: "",
      consultant_name: "",
      processor_name: "",
      total_debt: 0,
      payoff_amount: 0,
      status: "Active" as const,
      entry_date: new Date().toISOString().split('T')[0],
      applicant_contact: "",
      applicant_email: "",
      applicant_cell_phone: "",
      coapplicant_contact: "",
      coapplicant_email: "",
      coapplicant_cell_phone: "",
      co_applicant_total_debt: 0,
      household_members: [],
      coapplicant_household_members: [],
      liabilities: [],
      applicant_title: "",
      applicant_first_name: "",
      applicant_mi: "",
      applicant_last_name: "",
      applicant_suffix: "",
      applicant_maiden_name: "",
      applicant_is_consultant: false,
      applicant_address: "",
      applicant_city: "",
      applicant_county: "",
      applicant_state: "",
      applicant_zip_code: "",
      applicant_time_at_address: "",
      applicant_previous_address: "",
      applicant_previous_address_time: "",
      applicant_home_phone: "",
      applicant_work_phone: "",
      applicant_other_phone: "",
      applicant_fax: "",
      applicant_employment_status: "",
      applicant_business_owner: "",
      applicant_employer_name: "",
      applicant_employer_address: "",
      applicant_employer_city: "",
      applicant_employer_state: "",
      applicant_employer_zip: "",
      applicant_occupation: "",
      applicant_monthly_salary: 0,
      applicant_employer_phone: "",
      applicant_start_date: "",
      applicant_end_date: "",
      applicant_additional_income: 0,
      applicant_additional_income_source: "",
      applicant_previous_employer: "",
      applicant_previous_employer_address: "",
      applicant_previous_occupation: "",
      applicant_previous_employment_from: "",
      applicant_previous_employment_to: "",
      applicant_supervisor: "",
      applicant_dob: "",
      applicant_ssn: "",
      applicant_birth_place: "",
      applicant_race: "",
      applicant_marital_status: "",
      applicant_anniversary: "",
      applicant_spouse_name: "",
      applicant_spouse_occupation: "",
      applicant_dependents_count: 0,
      coapplicant_title: "",
      coapplicant_first_name: "",
      coapplicant_mi: "",
      coapplicant_last_name: "",
      coapplicant_suffix: "",
      coapplicant_maiden_name: "",
      coapplicant_is_consultant: false,
      coapplicant_address: "",
      coapplicant_city: "",
      coapplicant_county: "",
      coapplicant_state: "",
      coapplicant_zip_code: "",
      coapplicant_current_address_years: "0",
      coapplicant_current_address_months: "0",
      coapplicant_previous_address: "",
      coapplicant_previous_address_years: "0",
      coapplicant_previous_address_months: "0",
      coapplicant_home_phone: "",
      coapplicant_other_phone: "",
      coapplicant_fax: "",
      coapplicant_employment_status: "",
      coapplicant_business_owner: "",
      coapplicant_employer_name: "",
      coapplicant_employer_address: "",
      coapplicant_employer_city: "",
      coapplicant_employer_state: "",
      coapplicant_employer_zip: "",
      coapplicant_occupation: "",
      coapplicant_monthly_salary: 0,
      coapplicant_employer_phone: "",
      coapplicant_start_date: "",
      coapplicant_end_date: "",
      coapplicant_additional_income: 0,
      coapplicant_additional_income_source: "",
      coapplicant_previous_employer: "",
      coapplicant_previous_employer_address: "",
      coapplicant_previous_employer_city: "",
      coapplicant_previous_employer_state: "",
      coapplicant_previous_employer_zip: "",
      coapplicant_previous_occupation: "",
      coapplicant_previous_employment_from: "",
      coapplicant_previous_employment_to: "",
      coapplicant_supervisor_name: "",
      coapplicant_supervisor_phone: "",
      coapplicant_work_phone: "",
      coapplicant_previous_city: "",
      coapplicant_previous_state: "",
      coapplicant_previous_zip_code: "",
      coapplicant_dob: "",
      coapplicant_ssn: "",
      coapplicant_birth_place: "",
      coapplicant_race: "",
      coapplicant_marital_status: "",
      coapplicant_anniversary: "",
      coapplicant_spouse_name: "",
      coapplicant_spouse_occupation: "",
      coapplicant_dependents_count: 0,
      // Vehicle Coverage fields
      vehicle_carrier: "",
      vehicle_6_month_premium: 0,
      vehicle_expiration_date: "",
      vehicle_annual_premium: 0,
      vehicle_6_month_premium_proposed: 0,
      vehicle_savings: 0,
      vehicle_app_date: "",
      vehicle_status: "",
      vehicle_status_date: "",
      vehicle_issue_date: "",
      vehicle_disburse_date: "",
      vehicle_dft: "",
      vehicle_dft_number: "",
      vehicle_units: false,
      // Homeowners fields
      homeowners_address: "",
      homeowners_city: "",
      homeowners_state: "",
      homeowners_property_value: 0,
      homeowners_year_built: 0,
      homeowners_square_footage: 0,
      homeowners_construction: "",
      homeowners_roof: "",
      homeowners_foundation: "",
      homeowners_current_provider: "",
      homeowners_current_premium: 0,
      homeowners_proposed_premium: 0,
      homeowners_savings: 0,
      homeowners_current_deductible: "",
      homeowners_proposed_deductible: "",
      homeowners_smoke_detector: "",
      homeowners_fire_extinguisher: "",
      homeowners_monitored_burglar_alarm: "",
      homeowners_monitored_fire_alarm: "",
      homeowners_deadbolt_locks: "",
      homeowners_24_hour_security_guard: "",
    },
  });

  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  // Reset form when client data is available
  useEffect(() => {
    if (client) {
      console.log("Resetting form with client data:", client);
      
      // Parse household members from JSON with proper type checking
      let householdMembers = [];
      let coapplicantHouseholdMembers = [];
      
      try {
        if (client.household_members_json) {
          if (typeof client.household_members_json === 'string') {
            householdMembers = JSON.parse(client.household_members_json);
          } else if (Array.isArray(client.household_members_json)) {
            householdMembers = client.household_members_json;
          }
        }
      } catch (error) {
        console.error("Error parsing household_members_json:", error);
      }
      
      try {
        if (client.coapplicant_household_members_json) {
          if (typeof client.coapplicant_household_members_json === 'string') {
            coapplicantHouseholdMembers = JSON.parse(client.coapplicant_household_members_json as string);
          } else if (Array.isArray(client.coapplicant_household_members_json)) {
            coapplicantHouseholdMembers = client.coapplicant_household_members_json;
          }
        }
      } catch (error) {
        console.error("Error parsing coapplicant_household_members_json:", error);
      }

      // Helper function to safely convert values to appropriate types
      const safeString = (value: any): string => {
        if (value === null || value === undefined) return "";
        return String(value);
      };

      const safeNumber = (value: any): number => {
        if (value === null || value === undefined) return 0;
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      };

      const safeBoolean = (value: any): boolean => {
        if (value === null || value === undefined) return false;
        return Boolean(value);
      };

      const safeDate = (value: any): string => {
        if (!value) return "";
        try {
          return new Date(value).toISOString().split('T')[0];
        } catch {
          return "";
        }
      };

      const safeStatus = (value: any): "Active" | "Inactive" | "Pending" => {
        if (!value) return "Active";
        const statusValue = String(value).toLowerCase();
        
        // Map legacy status values to new enum values
        switch (statusValue) {
          case "active":
            return "Active";
          case "inactive":
            return "Inactive";
          case "pending":
          case "draft":
          case "submitted":
            return "Pending";
          default:
            return "Active"; // Default fallback
        }
      };

      const formData = {
        // ... keep existing code (all basic, applicant, and coapplicant fields)
        applicant: safeString(client.applicant),
        co_applicant: safeString(client.co_applicant),
        consultant_name: safeString(client.consultant_name),
        processor_name: safeString(client.processor_name),
        total_debt: safeNumber(client.total_debt),
        payoff_amount: safeNumber(client.payoff_amount),
        status: safeStatus(client.status),
        entry_date: safeDate(client.entry_date),
        applicant_contact: safeString(client.applicant_contact),
        applicant_email: safeString(client.applicant_email),
        applicant_cell_phone: safeString(client.applicant_cell_phone),
        coapplicant_contact: safeString(client.coapplicant_contact),
        coapplicant_email: safeString(client.coapplicant_email),
        co_applicant_total_debt: safeNumber(client.co_applicant_total_debt),
        applicant_title: safeString(client.applicant_title),
        applicant_first_name: safeString(client.applicant_first_name),
        applicant_mi: safeString(client.applicant_mi),
        applicant_last_name: safeString(client.applicant_last_name),
        applicant_suffix: safeString(client.applicant_suffix),
        applicant_maiden_name: safeString(client.applicant_maiden_name),
        applicant_is_consultant: safeBoolean(client.applicant_is_consultant),
        applicant_address: safeString(client.applicant_address),
        applicant_city: safeString(client.applicant_city),
        applicant_county: safeString(client.applicant_county),
        applicant_state: safeString(client.applicant_state),
        applicant_zip_code: safeString(client.applicant_zip_code),
        applicant_time_at_address: safeString(client.applicant_time_at_address),
        applicant_previous_address: safeString(client.applicant_previous_address),
        applicant_previous_address_time: safeString(client.applicant_previous_address_time),
        applicant_home_phone: safeString(client.applicant_home_phone),
        applicant_work_phone: safeString(client.applicant_work_phone),
        applicant_other_phone: safeString(client.applicant_other_phone),
        applicant_fax: safeString(client.applicant_fax),
        applicant_employment_status: safeString(client.applicant_employment_status),
        applicant_business_owner: safeString(client.applicant_business_owner),
        applicant_employer_name: safeString(client.applicant_employer_name),
        applicant_employer_address: safeString(client.applicant_employer_address),
        applicant_employer_city: safeString(client.applicant_employer_city),
        applicant_employer_state: safeString(client.applicant_employer_state),
        applicant_employer_zip: safeString(client.applicant_employer_zip),
        applicant_occupation: safeString(client.applicant_occupation),
        applicant_monthly_salary: safeNumber(client.applicant_monthly_salary),
        applicant_employer_phone: safeString(client.applicant_employer_phone),
        applicant_start_date: safeDate(client.applicant_start_date),
        applicant_end_date: safeDate(client.applicant_end_date),
        applicant_additional_income: safeNumber(client.applicant_additional_income),
        applicant_additional_income_source: safeString(client.applicant_additional_income_source),
        applicant_previous_employer: safeString(client.applicant_previous_employer),
        applicant_previous_employer_address: safeString(client.applicant_previous_employer_address),
        applicant_previous_occupation: safeString(client.applicant_previous_occupation),
        applicant_previous_employment_from: safeDate(client.applicant_previous_employment_from),
        applicant_previous_employment_to: safeDate(client.applicant_previous_employment_to),
        applicant_supervisor: safeString(client.applicant_supervisor),
        applicant_dob: safeDate(client.applicant_dob),
        applicant_ssn: safeString(client.applicant_ssn),
        applicant_birth_place: safeString(client.applicant_birth_place),
        applicant_race: safeString(client.applicant_race),
        applicant_marital_status: safeString(client.applicant_marital_status),
        applicant_anniversary: safeDate(client.applicant_anniversary),
        applicant_spouse_name: safeString(client.applicant_spouse_name),
        applicant_spouse_occupation: safeString(client.applicant_spouse_occupation),
        applicant_dependents_count: safeNumber(client.applicant_dependents_count),
        coapplicant_title: safeString(client.coapplicant_title),
        coapplicant_first_name: safeString(client.coapplicant_first_name),
        coapplicant_mi: safeString(client.coapplicant_mi),
        coapplicant_last_name: safeString(client.coapplicant_last_name),
        coapplicant_suffix: safeString(client.coapplicant_suffix),
        coapplicant_maiden_name: safeString(client.coapplicant_maiden_name),
        coapplicant_is_consultant: safeBoolean(client.coapplicant_is_consultant),
        coapplicant_address: safeString(client.coapplicant_address),
        coapplicant_city: safeString(client.coapplicant_city),
        coapplicant_county: safeString(client.coapplicant_county),
        coapplicant_state: safeString(client.coapplicant_state),
        coapplicant_zip_code: safeString(client.coapplicant_zip_code),
        coapplicant_current_address_years: safeString(client.coapplicant_current_address_years) || "0",
        coapplicant_current_address_months: safeString(client.coapplicant_current_address_months) || "0",
        coapplicant_previous_address: safeString(client.coapplicant_previous_address),
        coapplicant_previous_address_years: safeString(client.coapplicant_previous_address_years) || "0",
        coapplicant_previous_address_months: safeString(client.coapplicant_previous_address_months) || "0",
        coapplicant_home_phone: safeString(client.coapplicant_home_phone),
        coapplicant_work_phone: safeString(client.coapplicant_work_phone),
        coapplicant_cell_phone: safeString(client.coapplicant_cell_phone),
        coapplicant_other_phone: safeString(client.coapplicant_other_phone),
        coapplicant_fax: safeString(client.coapplicant_fax),
        coapplicant_employment_status: safeString(client.coapplicant_employment_status),
        coapplicant_business_owner: safeString(client.coapplicant_business_owner),
        coapplicant_employer_name: safeString(client.coapplicant_employer_name),
        coapplicant_employer_address: safeString(client.coapplicant_employer_address),
        coapplicant_employer_city: safeString(client.coapplicant_employer_city),
        coapplicant_employer_state: safeString(client.coapplicant_employer_state),
        coapplicant_employer_zip: safeString(client.coapplicant_employer_zip),
        coapplicant_occupation: safeString(client.coapplicant_occupation),
        coapplicant_monthly_salary: safeNumber(client.coapplicant_monthly_salary),
        coapplicant_employer_phone: safeString(client.coapplicant_employer_phone),
        coapplicant_start_date: safeDate(client.coapplicant_start_date),
        coapplicant_end_date: safeDate(client.coapplicant_end_date),
        coapplicant_additional_income: safeNumber(client.coapplicant_additional_income),
        coapplicant_additional_income_source: safeString(client.coapplicant_additional_income_source),
        coapplicant_previous_employer: safeString(client.coapplicant_previous_employer),
        coapplicant_previous_employer_address: safeString(client.coapplicant_previous_employer_address),
        coapplicant_previous_occupation: safeString(client.coapplicant_previous_occupation),
        coapplicant_previous_employment_from: safeDate(client.coapplicant_previous_employment_from),
        coapplicant_previous_employment_to: safeDate(client.coapplicant_previous_employment_to),
        coapplicant_dob: safeDate(client.coapplicant_dob),
        coapplicant_ssn: safeString(client.coapplicant_ssn),
        coapplicant_birth_place: safeString(client.coapplicant_birth_place),
        coapplicant_race: safeString(client.coapplicant_race),
        coapplicant_marital_status: safeString(client.coapplicant_marital_status),
        coapplicant_anniversary: safeDate(client.coapplicant_anniversary),
        coapplicant_spouse_name: safeString(client.coapplicant_spouse_name),
        coapplicant_spouse_occupation: safeString(client.coapplicant_spouse_occupation),
        coapplicant_dependents_count: safeNumber(client.coapplicant_dependents_count),
        household_members: householdMembers,
        coapplicant_household_members: coapplicantHouseholdMembers,
        liabilities: [], // Will be populated from separate query
        // Vehicle Coverage fields
        vehicle_carrier: safeString(client.vehicle_carrier),
        vehicle_6_month_premium: safeNumber(client.vehicle_6_month_premium),
        vehicle_expiration_date: safeDate(client.vehicle_expiration_date),
        vehicle_annual_premium: safeNumber(client.vehicle_annual_premium),
        vehicle_6_month_premium_proposed: safeNumber(client.vehicle_6_month_premium_proposed),
        vehicle_savings: safeNumber(client.vehicle_savings),
        vehicle_app_date: safeDate(client.vehicle_app_date),
        vehicle_status: safeString(client.vehicle_status),
        vehicle_status_date: safeDate(client.vehicle_status_date),
        vehicle_issue_date: safeDate(client.vehicle_issue_date),
        vehicle_disburse_date: safeDate(client.vehicle_disburse_date),
        vehicle_dft: safeString(client.vehicle_dft),
        vehicle_dft_number: safeString(client.vehicle_dft_number),
        vehicle_units: safeBoolean(client.vehicle_units),
        // Homeowners fields
        homeowners_address: safeString(client.homeowners_address),
        homeowners_city: safeString(client.homeowners_city),
        homeowners_state: safeString(client.homeowners_state),
        homeowners_property_value: safeNumber(client.homeowners_property_value),
        homeowners_year_built: safeNumber(client.homeowners_year_built),
        homeowners_square_footage: safeNumber(client.homeowners_square_footage),
        homeowners_construction: safeString(client.homeowners_construction),
        homeowners_roof: safeString(client.homeowners_roof),
        homeowners_foundation: safeString(client.homeowners_foundation),
        homeowners_current_provider: safeString(client.homeowners_current_provider),
        homeowners_current_premium: safeNumber(client.homeowners_current_premium),
        homeowners_proposed_premium: safeNumber(client.homeowners_proposed_premium),
        homeowners_savings: safeNumber(client.homeowners_savings),
        homeowners_current_deductible: safeString(client.homeowners_current_deductible),
        homeowners_proposed_deductible: safeString(client.homeowners_proposed_deductible),
        homeowners_smoke_detector: safeString(client.homeowners_smoke_detector),
        homeowners_fire_extinguisher: safeString(client.homeowners_fire_extinguisher),
        homeowners_monitored_burglar_alarm: safeString(client.homeowners_monitored_burglar_alarm),
        homeowners_monitored_fire_alarm: safeString(client.homeowners_monitored_fire_alarm),
        homeowners_deadbolt_locks: safeString(client.homeowners_deadbolt_locks),
        homeowners_24_hour_security_guard: safeString(client.homeowners_24_hour_security_guard),
      };

      console.log("Form data being set:", formData);
      form.reset(formData as any);
    }
  }, [client, form]);

  return {
    form,
    mutation: client ? updateMutation : createMutation,
  };
}
