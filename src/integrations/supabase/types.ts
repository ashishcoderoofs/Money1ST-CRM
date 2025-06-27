export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          contact_id: string | null
          created_at: string
          deal_id: string | null
          description: string | null
          id: string
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          id?: string
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_liabilities: {
        Row: {
          client_id: string
          created_at: string
          creditor_name: string | null
          current_balance: number | null
          debtor_type: string
          escrow: string | null
          gross_rent: number | null
          hoi: number | null
          id: string
          liability_type: string | null
          monthly_payment: number | null
          pay_off: boolean | null
          property_address: string | null
          property_value: number | null
          taxes: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          creditor_name?: string | null
          current_balance?: number | null
          debtor_type: string
          escrow?: string | null
          gross_rent?: number | null
          hoi?: number | null
          id?: string
          liability_type?: string | null
          monthly_payment?: number | null
          pay_off?: boolean | null
          property_address?: string | null
          property_value?: number | null
          taxes?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          creditor_name?: string | null
          current_balance?: number | null
          debtor_type?: string
          escrow?: string | null
          gross_rent?: number | null
          hoi?: number | null
          id?: string
          liability_type?: string | null
          monthly_payment?: number | null
          pay_off?: boolean | null
          property_address?: string | null
          property_value?: number | null
          taxes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_liabilities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          applicant: string
          applicant_additional_income: number | null
          applicant_additional_income_source: string | null
          applicant_address: string | null
          applicant_anniversary: string | null
          applicant_birth_place: string | null
          applicant_business_owner: string | null
          applicant_city: string | null
          applicant_contact: string | null
          applicant_county: string | null
          applicant_dependents_count: number | null
          applicant_dob: string | null
          applicant_email: string | null
          applicant_employer_address: string | null
          applicant_employer_city: string | null
          applicant_employer_name: string | null
          applicant_employer_phone: string | null
          applicant_employer_state: string | null
          applicant_employer_zip: string | null
          applicant_employment_status: string | null
          applicant_end_date: string | null
          applicant_fax: string | null
          applicant_first_name: string | null
          applicant_home_phone: string | null
          applicant_is_consultant: boolean | null
          applicant_last_name: string | null
          applicant_maiden_name: string | null
          applicant_marital_status: string | null
          applicant_mi: string | null
          applicant_monthly_salary: number | null
          applicant_occupation: string | null
          applicant_other_phone: string | null
          applicant_previous_address: string | null
          applicant_previous_address_time: string | null
          applicant_previous_employer: string | null
          applicant_previous_employer_address: string | null
          applicant_previous_employment_from: string | null
          applicant_previous_employment_to: string | null
          applicant_previous_occupation: string | null
          applicant_race: string | null
          applicant_spouse_name: string | null
          applicant_spouse_occupation: string | null
          applicant_ssn: string | null
          applicant_start_date: string | null
          applicant_state: string | null
          applicant_suffix: string | null
          applicant_supervisor: string | null
          applicant_time_at_address: string | null
          applicant_title: string | null
          applicant_zip_code: string | null
          client_number: number
          co_applicant: string | null
          co_applicant_total_debt: number | null
          coapplicant_additional_income: number | null
          coapplicant_additional_income_source: string | null
          coapplicant_address: string | null
          coapplicant_anniversary: string | null
          coapplicant_birth_place: string | null
          coapplicant_business_owner: string | null
          coapplicant_city: string | null
          coapplicant_contact: string | null
          coapplicant_county: string | null
          coapplicant_dependents_count: number | null
          coapplicant_dob: string | null
          coapplicant_email: string | null
          coapplicant_employer_address: string | null
          coapplicant_employer_city: string | null
          coapplicant_employer_name: string | null
          coapplicant_employer_phone: string | null
          coapplicant_employer_state: string | null
          coapplicant_employer_zip: string | null
          coapplicant_employment_status: string | null
          coapplicant_end_date: string | null
          coapplicant_fax: string | null
          coapplicant_first_name: string | null
          coapplicant_home_phone: string | null
          coapplicant_household_members_json: Json | null
          coapplicant_is_consultant: boolean | null
          coapplicant_last_name: string | null
          coapplicant_maiden_name: string | null
          coapplicant_marital_status: string | null
          coapplicant_mi: string | null
          coapplicant_monthly_salary: number | null
          coapplicant_occupation: string | null
          coapplicant_other_phone: string | null
          coapplicant_previous_address: string | null
          coapplicant_previous_address_time: string | null
          coapplicant_previous_employer: string | null
          coapplicant_previous_employer_address: string | null
          coapplicant_previous_employment_from: string | null
          coapplicant_previous_employment_to: string | null
          coapplicant_previous_occupation: string | null
          coapplicant_race: string | null
          coapplicant_spouse_name: string | null
          coapplicant_spouse_occupation: string | null
          coapplicant_ssn: string | null
          coapplicant_start_date: string | null
          coapplicant_state: string | null
          coapplicant_suffix: string | null
          coapplicant_time_at_address: string | null
          coapplicant_title: string | null
          coapplicant_zip_code: string | null
          consultant_name: string | null
          created_at: string
          entry_date: string
          homeowners_24_hour_security_guard: string | null
          homeowners_account_credit: number | null
          homeowners_address: string | null
          homeowners_app_date: string | null
          homeowners_business_operated: string | null
          homeowners_car_garage_count: number | null
          homeowners_city: string | null
          homeowners_claims_amount: number | null
          homeowners_claims_past_5_years: number | null
          homeowners_construction: string | null
          homeowners_current_deductible: string | null
          homeowners_current_premium: number | null
          homeowners_current_provider: string | null
          homeowners_deadbolt_locks: string | null
          homeowners_deck_sq_footage: number | null
          homeowners_dft: string | null
          homeowners_dft_number: string | null
          homeowners_disclosure_date: string | null
          homeowners_enclosed_porch_sq_ft: number | null
          homeowners_fire_extinguisher: string | null
          homeowners_fireplace_count: number | null
          homeowners_flood_policy: string | null
          homeowners_foundation: string | null
          homeowners_foundation_percent: number | null
          homeowners_full_bath_count: number | null
          homeowners_garage: string | null
          homeowners_half_bath_count: number | null
          homeowners_hm_assoc_fee: number | null
          homeowners_housing_type: string | null
          homeowners_issue_date: string | null
          homeowners_liability_current: string | null
          homeowners_liability_proposed: string | null
          homeowners_medical_payments_current: number | null
          homeowners_medical_payments_proposed: number | null
          homeowners_mo_rental_income: number | null
          homeowners_monitored_burglar_alarm: string | null
          homeowners_monitored_fire_alarm: string | null
          homeowners_mortgage_balance: number | null
          homeowners_non_smoking_household: string | null
          homeowners_offered_for_sale: string | null
          homeowners_open_porch_sq_ft: number | null
          homeowners_owner_occupied: string | null
          homeowners_payment: number | null
          homeowners_pets_count: number | null
          homeowners_policy_number: string | null
          homeowners_pool: string | null
          homeowners_property_description: string | null
          homeowners_property_value: number | null
          homeowners_proposed_deductible: string | null
          homeowners_proposed_premium: number | null
          homeowners_purchase_date: string | null
          homeowners_refinanced: string | null
          homeowners_roof: string | null
          homeowners_savings: number | null
          homeowners_self_loading_gate: string | null
          homeowners_smoke_detector: string | null
          homeowners_sq_ft_general_features: number | null
          homeowners_square_footage: number | null
          homeowners_state: string | null
          homeowners_status: string | null
          homeowners_status_date: string | null
          homeowners_style: string | null
          homeowners_tenant_occupied: string | null
          homeowners_trampoline: string | null
          homeowners_units: boolean | null
          homeowners_year_built: number | null
          household_members_json: Json | null
          id: string
          owner_id: string
          payoff_amount: number | null
          processor_name: string | null
          status: string
          total_debt: number | null
          underwriting_address: string | null
          underwriting_city: string | null
          underwriting_client_id: string | null
          underwriting_cnh_option: string | null
          underwriting_credit_scores: Json | null
          underwriting_notes: string | null
          underwriting_programs: string | null
          underwriting_state: string | null
          underwriting_terms: string | null
          underwriting_tud_option: string | null
          updated_at: string
          vehicle_6_month_premium: number | null
          vehicle_6_month_premium_proposed: number | null
          vehicle_annual_premium: number | null
          vehicle_app_date: string | null
          vehicle_carrier: string | null
          vehicle_dft: string | null
          vehicle_dft_number: string | null
          vehicle_disburse_date: string | null
          vehicle_expiration_date: string | null
          vehicle_issue_date: string | null
          vehicle_savings: number | null
          vehicle_status: string | null
          vehicle_status_date: string | null
          vehicle_units: boolean | null
        }
        Insert: {
          applicant: string
          applicant_additional_income?: number | null
          applicant_additional_income_source?: string | null
          applicant_address?: string | null
          applicant_anniversary?: string | null
          applicant_birth_place?: string | null
          applicant_business_owner?: string | null
          applicant_city?: string | null
          applicant_contact?: string | null
          applicant_county?: string | null
          applicant_dependents_count?: number | null
          applicant_dob?: string | null
          applicant_email?: string | null
          applicant_employer_address?: string | null
          applicant_employer_city?: string | null
          applicant_employer_name?: string | null
          applicant_employer_phone?: string | null
          applicant_employer_state?: string | null
          applicant_employer_zip?: string | null
          applicant_employment_status?: string | null
          applicant_end_date?: string | null
          applicant_fax?: string | null
          applicant_first_name?: string | null
          applicant_home_phone?: string | null
          applicant_is_consultant?: boolean | null
          applicant_last_name?: string | null
          applicant_maiden_name?: string | null
          applicant_marital_status?: string | null
          applicant_mi?: string | null
          applicant_monthly_salary?: number | null
          applicant_occupation?: string | null
          applicant_other_phone?: string | null
          applicant_previous_address?: string | null
          applicant_previous_address_time?: string | null
          applicant_previous_employer?: string | null
          applicant_previous_employer_address?: string | null
          applicant_previous_employment_from?: string | null
          applicant_previous_employment_to?: string | null
          applicant_previous_occupation?: string | null
          applicant_race?: string | null
          applicant_spouse_name?: string | null
          applicant_spouse_occupation?: string | null
          applicant_ssn?: string | null
          applicant_start_date?: string | null
          applicant_state?: string | null
          applicant_suffix?: string | null
          applicant_supervisor?: string | null
          applicant_time_at_address?: string | null
          applicant_title?: string | null
          applicant_zip_code?: string | null
          client_number?: number
          co_applicant?: string | null
          co_applicant_total_debt?: number | null
          coapplicant_additional_income?: number | null
          coapplicant_additional_income_source?: string | null
          coapplicant_address?: string | null
          coapplicant_anniversary?: string | null
          coapplicant_birth_place?: string | null
          coapplicant_business_owner?: string | null
          coapplicant_city?: string | null
          coapplicant_contact?: string | null
          coapplicant_county?: string | null
          coapplicant_dependents_count?: number | null
          coapplicant_dob?: string | null
          coapplicant_email?: string | null
          coapplicant_employer_address?: string | null
          coapplicant_employer_city?: string | null
          coapplicant_employer_name?: string | null
          coapplicant_employer_phone?: string | null
          coapplicant_employer_state?: string | null
          coapplicant_employer_zip?: string | null
          coapplicant_employment_status?: string | null
          coapplicant_end_date?: string | null
          coapplicant_fax?: string | null
          coapplicant_first_name?: string | null
          coapplicant_home_phone?: string | null
          coapplicant_household_members_json?: Json | null
          coapplicant_is_consultant?: boolean | null
          coapplicant_last_name?: string | null
          coapplicant_maiden_name?: string | null
          coapplicant_marital_status?: string | null
          coapplicant_mi?: string | null
          coapplicant_monthly_salary?: number | null
          coapplicant_occupation?: string | null
          coapplicant_other_phone?: string | null
          coapplicant_previous_address?: string | null
          coapplicant_previous_address_time?: string | null
          coapplicant_previous_employer?: string | null
          coapplicant_previous_employer_address?: string | null
          coapplicant_previous_employment_from?: string | null
          coapplicant_previous_employment_to?: string | null
          coapplicant_previous_occupation?: string | null
          coapplicant_race?: string | null
          coapplicant_spouse_name?: string | null
          coapplicant_spouse_occupation?: string | null
          coapplicant_ssn?: string | null
          coapplicant_start_date?: string | null
          coapplicant_state?: string | null
          coapplicant_suffix?: string | null
          coapplicant_time_at_address?: string | null
          coapplicant_title?: string | null
          coapplicant_zip_code?: string | null
          consultant_name?: string | null
          created_at?: string
          entry_date?: string
          homeowners_24_hour_security_guard?: string | null
          homeowners_account_credit?: number | null
          homeowners_address?: string | null
          homeowners_app_date?: string | null
          homeowners_business_operated?: string | null
          homeowners_car_garage_count?: number | null
          homeowners_city?: string | null
          homeowners_claims_amount?: number | null
          homeowners_claims_past_5_years?: number | null
          homeowners_construction?: string | null
          homeowners_current_deductible?: string | null
          homeowners_current_premium?: number | null
          homeowners_current_provider?: string | null
          homeowners_deadbolt_locks?: string | null
          homeowners_deck_sq_footage?: number | null
          homeowners_dft?: string | null
          homeowners_dft_number?: string | null
          homeowners_disclosure_date?: string | null
          homeowners_enclosed_porch_sq_ft?: number | null
          homeowners_fire_extinguisher?: string | null
          homeowners_fireplace_count?: number | null
          homeowners_flood_policy?: string | null
          homeowners_foundation?: string | null
          homeowners_foundation_percent?: number | null
          homeowners_full_bath_count?: number | null
          homeowners_garage?: string | null
          homeowners_half_bath_count?: number | null
          homeowners_hm_assoc_fee?: number | null
          homeowners_housing_type?: string | null
          homeowners_issue_date?: string | null
          homeowners_liability_current?: string | null
          homeowners_liability_proposed?: string | null
          homeowners_medical_payments_current?: number | null
          homeowners_medical_payments_proposed?: number | null
          homeowners_mo_rental_income?: number | null
          homeowners_monitored_burglar_alarm?: string | null
          homeowners_monitored_fire_alarm?: string | null
          homeowners_mortgage_balance?: number | null
          homeowners_non_smoking_household?: string | null
          homeowners_offered_for_sale?: string | null
          homeowners_open_porch_sq_ft?: number | null
          homeowners_owner_occupied?: string | null
          homeowners_payment?: number | null
          homeowners_pets_count?: number | null
          homeowners_policy_number?: string | null
          homeowners_pool?: string | null
          homeowners_property_description?: string | null
          homeowners_property_value?: number | null
          homeowners_proposed_deductible?: string | null
          homeowners_proposed_premium?: number | null
          homeowners_purchase_date?: string | null
          homeowners_refinanced?: string | null
          homeowners_roof?: string | null
          homeowners_savings?: number | null
          homeowners_self_loading_gate?: string | null
          homeowners_smoke_detector?: string | null
          homeowners_sq_ft_general_features?: number | null
          homeowners_square_footage?: number | null
          homeowners_state?: string | null
          homeowners_status?: string | null
          homeowners_status_date?: string | null
          homeowners_style?: string | null
          homeowners_tenant_occupied?: string | null
          homeowners_trampoline?: string | null
          homeowners_units?: boolean | null
          homeowners_year_built?: number | null
          household_members_json?: Json | null
          id?: string
          owner_id: string
          payoff_amount?: number | null
          processor_name?: string | null
          status?: string
          total_debt?: number | null
          underwriting_address?: string | null
          underwriting_city?: string | null
          underwriting_client_id?: string | null
          underwriting_cnh_option?: string | null
          underwriting_credit_scores?: Json | null
          underwriting_notes?: string | null
          underwriting_programs?: string | null
          underwriting_state?: string | null
          underwriting_terms?: string | null
          underwriting_tud_option?: string | null
          updated_at?: string
          vehicle_6_month_premium?: number | null
          vehicle_6_month_premium_proposed?: number | null
          vehicle_annual_premium?: number | null
          vehicle_app_date?: string | null
          vehicle_carrier?: string | null
          vehicle_dft?: string | null
          vehicle_dft_number?: string | null
          vehicle_disburse_date?: string | null
          vehicle_expiration_date?: string | null
          vehicle_issue_date?: string | null
          vehicle_savings?: number | null
          vehicle_status?: string | null
          vehicle_status_date?: string | null
          vehicle_units?: boolean | null
        }
        Update: {
          applicant?: string
          applicant_additional_income?: number | null
          applicant_additional_income_source?: string | null
          applicant_address?: string | null
          applicant_anniversary?: string | null
          applicant_birth_place?: string | null
          applicant_business_owner?: string | null
          applicant_city?: string | null
          applicant_contact?: string | null
          applicant_county?: string | null
          applicant_dependents_count?: number | null
          applicant_dob?: string | null
          applicant_email?: string | null
          applicant_employer_address?: string | null
          applicant_employer_city?: string | null
          applicant_employer_name?: string | null
          applicant_employer_phone?: string | null
          applicant_employer_state?: string | null
          applicant_employer_zip?: string | null
          applicant_employment_status?: string | null
          applicant_end_date?: string | null
          applicant_fax?: string | null
          applicant_first_name?: string | null
          applicant_home_phone?: string | null
          applicant_is_consultant?: boolean | null
          applicant_last_name?: string | null
          applicant_maiden_name?: string | null
          applicant_marital_status?: string | null
          applicant_mi?: string | null
          applicant_monthly_salary?: number | null
          applicant_occupation?: string | null
          applicant_other_phone?: string | null
          applicant_previous_address?: string | null
          applicant_previous_address_time?: string | null
          applicant_previous_employer?: string | null
          applicant_previous_employer_address?: string | null
          applicant_previous_employment_from?: string | null
          applicant_previous_employment_to?: string | null
          applicant_previous_occupation?: string | null
          applicant_race?: string | null
          applicant_spouse_name?: string | null
          applicant_spouse_occupation?: string | null
          applicant_ssn?: string | null
          applicant_start_date?: string | null
          applicant_state?: string | null
          applicant_suffix?: string | null
          applicant_supervisor?: string | null
          applicant_time_at_address?: string | null
          applicant_title?: string | null
          applicant_zip_code?: string | null
          client_number?: number
          co_applicant?: string | null
          co_applicant_total_debt?: number | null
          coapplicant_additional_income?: number | null
          coapplicant_additional_income_source?: string | null
          coapplicant_address?: string | null
          coapplicant_anniversary?: string | null
          coapplicant_birth_place?: string | null
          coapplicant_business_owner?: string | null
          coapplicant_city?: string | null
          coapplicant_contact?: string | null
          coapplicant_county?: string | null
          coapplicant_dependents_count?: number | null
          coapplicant_dob?: string | null
          coapplicant_email?: string | null
          coapplicant_employer_address?: string | null
          coapplicant_employer_city?: string | null
          coapplicant_employer_name?: string | null
          coapplicant_employer_phone?: string | null
          coapplicant_employer_state?: string | null
          coapplicant_employer_zip?: string | null
          coapplicant_employment_status?: string | null
          coapplicant_end_date?: string | null
          coapplicant_fax?: string | null
          coapplicant_first_name?: string | null
          coapplicant_home_phone?: string | null
          coapplicant_household_members_json?: Json | null
          coapplicant_is_consultant?: boolean | null
          coapplicant_last_name?: string | null
          coapplicant_maiden_name?: string | null
          coapplicant_marital_status?: string | null
          coapplicant_mi?: string | null
          coapplicant_monthly_salary?: number | null
          coapplicant_occupation?: string | null
          coapplicant_other_phone?: string | null
          coapplicant_previous_address?: string | null
          coapplicant_previous_address_time?: string | null
          coapplicant_previous_employer?: string | null
          coapplicant_previous_employer_address?: string | null
          coapplicant_previous_employment_from?: string | null
          coapplicant_previous_employment_to?: string | null
          coapplicant_previous_occupation?: string | null
          coapplicant_race?: string | null
          coapplicant_spouse_name?: string | null
          coapplicant_spouse_occupation?: string | null
          coapplicant_ssn?: string | null
          coapplicant_start_date?: string | null
          coapplicant_state?: string | null
          coapplicant_suffix?: string | null
          coapplicant_time_at_address?: string | null
          coapplicant_title?: string | null
          coapplicant_zip_code?: string | null
          consultant_name?: string | null
          created_at?: string
          entry_date?: string
          homeowners_24_hour_security_guard?: string | null
          homeowners_account_credit?: number | null
          homeowners_address?: string | null
          homeowners_app_date?: string | null
          homeowners_business_operated?: string | null
          homeowners_car_garage_count?: number | null
          homeowners_city?: string | null
          homeowners_claims_amount?: number | null
          homeowners_claims_past_5_years?: number | null
          homeowners_construction?: string | null
          homeowners_current_deductible?: string | null
          homeowners_current_premium?: number | null
          homeowners_current_provider?: string | null
          homeowners_deadbolt_locks?: string | null
          homeowners_deck_sq_footage?: number | null
          homeowners_dft?: string | null
          homeowners_dft_number?: string | null
          homeowners_disclosure_date?: string | null
          homeowners_enclosed_porch_sq_ft?: number | null
          homeowners_fire_extinguisher?: string | null
          homeowners_fireplace_count?: number | null
          homeowners_flood_policy?: string | null
          homeowners_foundation?: string | null
          homeowners_foundation_percent?: number | null
          homeowners_full_bath_count?: number | null
          homeowners_garage?: string | null
          homeowners_half_bath_count?: number | null
          homeowners_hm_assoc_fee?: number | null
          homeowners_housing_type?: string | null
          homeowners_issue_date?: string | null
          homeowners_liability_current?: string | null
          homeowners_liability_proposed?: string | null
          homeowners_medical_payments_current?: number | null
          homeowners_medical_payments_proposed?: number | null
          homeowners_mo_rental_income?: number | null
          homeowners_monitored_burglar_alarm?: string | null
          homeowners_monitored_fire_alarm?: string | null
          homeowners_mortgage_balance?: number | null
          homeowners_non_smoking_household?: string | null
          homeowners_offered_for_sale?: string | null
          homeowners_open_porch_sq_ft?: number | null
          homeowners_owner_occupied?: string | null
          homeowners_payment?: number | null
          homeowners_pets_count?: number | null
          homeowners_policy_number?: string | null
          homeowners_pool?: string | null
          homeowners_property_description?: string | null
          homeowners_property_value?: number | null
          homeowners_proposed_deductible?: string | null
          homeowners_proposed_premium?: number | null
          homeowners_purchase_date?: string | null
          homeowners_refinanced?: string | null
          homeowners_roof?: string | null
          homeowners_savings?: number | null
          homeowners_self_loading_gate?: string | null
          homeowners_smoke_detector?: string | null
          homeowners_sq_ft_general_features?: number | null
          homeowners_square_footage?: number | null
          homeowners_state?: string | null
          homeowners_status?: string | null
          homeowners_status_date?: string | null
          homeowners_style?: string | null
          homeowners_tenant_occupied?: string | null
          homeowners_trampoline?: string | null
          homeowners_units?: boolean | null
          homeowners_year_built?: number | null
          household_members_json?: Json | null
          id?: string
          owner_id?: string
          payoff_amount?: number | null
          processor_name?: string | null
          status?: string
          total_debt?: number | null
          underwriting_address?: string | null
          underwriting_city?: string | null
          underwriting_client_id?: string | null
          underwriting_cnh_option?: string | null
          underwriting_credit_scores?: Json | null
          underwriting_notes?: string | null
          underwriting_programs?: string | null
          underwriting_state?: string | null
          underwriting_terms?: string | null
          underwriting_tud_option?: string | null
          updated_at?: string
          vehicle_6_month_premium?: number | null
          vehicle_6_month_premium_proposed?: number | null
          vehicle_annual_premium?: number | null
          vehicle_app_date?: string | null
          vehicle_carrier?: string | null
          vehicle_dft?: string | null
          vehicle_dft_number?: string | null
          vehicle_disburse_date?: string | null
          vehicle_expiration_date?: string | null
          vehicle_issue_date?: string | null
          vehicle_savings?: number | null
          vehicle_status?: string | null
          vehicle_status_date?: string | null
          vehicle_units?: boolean | null
        }
        Relationships: []
      }
      compensation: {
        Row: {
          amount: number
          calculated_at: string
          compensation_type: string
          deal_id: string | null
          id: string
          period_end: string
          period_start: string
          user_id: string
        }
        Insert: {
          amount: number
          calculated_at?: string
          compensation_type: string
          deal_id?: string | null
          id?: string
          period_end: string
          period_start: string
          user_id: string
        }
        Update: {
          amount?: number
          calculated_at?: string
          compensation_type?: string
          deal_id?: string | null
          id?: string
          period_end?: string
          period_start?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compensation_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compensation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          owner_id: string
          phone: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          owner_id: string
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          amount: number | null
          contact_id: string | null
          created_at: string
          expected_close_date: string | null
          id: string
          owner_id: string
          probability: number | null
          stage: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          contact_id?: string | null
          created_at?: string
          expected_close_date?: string | null
          id?: string
          owner_id: string
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          contact_id?: string | null
          created_at?: string
          expected_close_date?: string | null
          id?: string
          owner_id?: string
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dependents: {
        Row: {
          consultant_id: string
          created_at: string
          dob: string | null
          id: string
          name: string
          relationship: string | null
          updated_at: string
        }
        Insert: {
          consultant_id: string
          created_at?: string
          dob?: string | null
          id?: string
          name: string
          relationship?: string | null
          updated_at?: string
        }
        Update: {
          consultant_id?: string
          created_at?: string
          dob?: string | null
          id?: string
          name?: string
          relationship?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependents_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_metrics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_value: number
          period_end: string
          period_start: string
          period_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_value: number
          period_end: string
          period_start: string
          period_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: number
          period_end?: string
          period_start?: string
          period_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          consultant_id: string
          created_at: string
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          license_number: string | null
          license_type: string
          updated_at: string
        }
        Insert: {
          consultant_id: string
          created_at?: string
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          license_number?: string | null
          license_type: string
          updated_at?: string
        }
        Update: {
          consultant_id?: string
          created_at?: string
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          license_number?: string | null
          license_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mortgages: {
        Row: {
          admin_fee: number | null
          app_amt: number | null
          applicant_id_ref: string | null
          appraisal_company: string | null
          appraisal_fee: number | null
          appraisal_invoice: string | null
          appraisal_ordered: string | null
          appraisal_paid: number | null
          appraisal_received: string | null
          arm_10_1_payment: number | null
          arm_10_1_payment_field: number | null
          arm_10_1_rate: number | null
          arm_10_1_rate_field: number | null
          arm_5_1_payment: number | null
          arm_5_1_payment_field: number | null
          arm_5_1_rate: number | null
          arm_5_1_rate_field: number | null
          arm_7_1_payment: number | null
          arm_7_1_payment_field: number | null
          arm_7_1_rate: number | null
          arm_7_1_rate_field: number | null
          cash_to_borrower: number | null
          cleared_date: string | null
          client_id: string
          closed_date: string | null
          closing_cost: number | null
          closing_cost_field: number | null
          clw_rec: string | null
          clw_sent: string | null
          consult_id: string | null
          contract_cc: string | null
          contract_pf: string | null
          courier_fee: number | null
          created_at: string
          current_balance: number | null
          date_in: string | null
          disburse_date: string | null
          dti_percent: number | null
          dti_percent_field: number | null
          estimated_fees_amount: number | null
          estimated_fees_percent: number | null
          existing_balance: number | null
          field_trainer: string | null
          final_rec_d: string | null
          final_sent: string | null
          first_mortgage_balance: number | null
          first_mortgage_lienholder: string | null
          first_mortgage_payment: number | null
          first_mortgage_rate: number | null
          first_mortgage_term: string | null
          fixed_15_payment: number | null
          fixed_15_payment_field: number | null
          fixed_15_rate: number | null
          fixed_15_rate_field: number | null
          fixed_30_payment: number | null
          fixed_30_payment_field: number | null
          fixed_30_rate: number | null
          fixed_30_rate_field: number | null
          floan_id: string | null
          funded_amt: number | null
          funded_date: string | null
          homeowner_insurance: number | null
          homeowner_insurance_included_select: string | null
          id: string
          insurance_included_in_payment: string | null
          interest_rate: number | null
          interest_rate_field: number | null
          lender_id: string | null
          lender_id_field: string | null
          lender_name: string | null
          loan_status: string | null
          loan_volume: number | null
          ltv_percent: number | null
          ltv_secondary: number | null
          market_value: number | null
          modified_by: string | null
          modified_date: string | null
          monthly_payment: number | null
          monthly_payment_field: number | null
          mortgage_id: number | null
          mortgage_type: string | null
          occupancy_type: string | null
          original_loan_amount: number | null
          original_loan_amount_field: number | null
          origination_amount: number | null
          origination_percent: number | null
          pa_rec_d: string | null
          pa_sent: string | null
          processor_id: string | null
          property_address: string | null
          property_city: string | null
          property_state: string | null
          property_taxes: number | null
          property_zip: string | null
          proposed_first_int_term: string | null
          proposed_first_loan_amount: number | null
          proposed_first_payment: number | null
          proposed_first_rate: number | null
          proposed_first_term: string | null
          proposed_second_int_term: string | null
          proposed_second_loan_amount: number | null
          proposed_second_payment: number | null
          proposed_second_rate: number | null
          proposed_second_term: string | null
          purpose_of_loan: string | null
          sales_support: string | null
          second_mortgage_balance: number | null
          second_mortgage_lienholder: string | null
          second_mortgage_payment: number | null
          second_mortgage_rate: number | null
          second_mortgage_term: string | null
          spr_amount: number | null
          spr_percent: number | null
          ss_auditor: string | null
          status_date: string | null
          taxes_included_in_payment: string | null
          taxes_included_in_payment_select: string | null
          time_in: string | null
          title_binder: string | null
          title_co_name: string | null
          title_ordered: string | null
          title_pld: string | null
          title_rec_d: string | null
          updated_at: string
          voe_contact: string | null
          voe_phone: string | null
          voe_rec: string | null
          voe_sent: string | null
          vom_contact: string | null
          vom_phone: string | null
          vom_rec: string | null
          vom_sent: string | null
          zip_code: string | null
        }
        Insert: {
          admin_fee?: number | null
          app_amt?: number | null
          applicant_id_ref?: string | null
          appraisal_company?: string | null
          appraisal_fee?: number | null
          appraisal_invoice?: string | null
          appraisal_ordered?: string | null
          appraisal_paid?: number | null
          appraisal_received?: string | null
          arm_10_1_payment?: number | null
          arm_10_1_payment_field?: number | null
          arm_10_1_rate?: number | null
          arm_10_1_rate_field?: number | null
          arm_5_1_payment?: number | null
          arm_5_1_payment_field?: number | null
          arm_5_1_rate?: number | null
          arm_5_1_rate_field?: number | null
          arm_7_1_payment?: number | null
          arm_7_1_payment_field?: number | null
          arm_7_1_rate?: number | null
          arm_7_1_rate_field?: number | null
          cash_to_borrower?: number | null
          cleared_date?: string | null
          client_id: string
          closed_date?: string | null
          closing_cost?: number | null
          closing_cost_field?: number | null
          clw_rec?: string | null
          clw_sent?: string | null
          consult_id?: string | null
          contract_cc?: string | null
          contract_pf?: string | null
          courier_fee?: number | null
          created_at?: string
          current_balance?: number | null
          date_in?: string | null
          disburse_date?: string | null
          dti_percent?: number | null
          dti_percent_field?: number | null
          estimated_fees_amount?: number | null
          estimated_fees_percent?: number | null
          existing_balance?: number | null
          field_trainer?: string | null
          final_rec_d?: string | null
          final_sent?: string | null
          first_mortgage_balance?: number | null
          first_mortgage_lienholder?: string | null
          first_mortgage_payment?: number | null
          first_mortgage_rate?: number | null
          first_mortgage_term?: string | null
          fixed_15_payment?: number | null
          fixed_15_payment_field?: number | null
          fixed_15_rate?: number | null
          fixed_15_rate_field?: number | null
          fixed_30_payment?: number | null
          fixed_30_payment_field?: number | null
          fixed_30_rate?: number | null
          fixed_30_rate_field?: number | null
          floan_id?: string | null
          funded_amt?: number | null
          funded_date?: string | null
          homeowner_insurance?: number | null
          homeowner_insurance_included_select?: string | null
          id?: string
          insurance_included_in_payment?: string | null
          interest_rate?: number | null
          interest_rate_field?: number | null
          lender_id?: string | null
          lender_id_field?: string | null
          lender_name?: string | null
          loan_status?: string | null
          loan_volume?: number | null
          ltv_percent?: number | null
          ltv_secondary?: number | null
          market_value?: number | null
          modified_by?: string | null
          modified_date?: string | null
          monthly_payment?: number | null
          monthly_payment_field?: number | null
          mortgage_id?: number | null
          mortgage_type?: string | null
          occupancy_type?: string | null
          original_loan_amount?: number | null
          original_loan_amount_field?: number | null
          origination_amount?: number | null
          origination_percent?: number | null
          pa_rec_d?: string | null
          pa_sent?: string | null
          processor_id?: string | null
          property_address?: string | null
          property_city?: string | null
          property_state?: string | null
          property_taxes?: number | null
          property_zip?: string | null
          proposed_first_int_term?: string | null
          proposed_first_loan_amount?: number | null
          proposed_first_payment?: number | null
          proposed_first_rate?: number | null
          proposed_first_term?: string | null
          proposed_second_int_term?: string | null
          proposed_second_loan_amount?: number | null
          proposed_second_payment?: number | null
          proposed_second_rate?: number | null
          proposed_second_term?: string | null
          purpose_of_loan?: string | null
          sales_support?: string | null
          second_mortgage_balance?: number | null
          second_mortgage_lienholder?: string | null
          second_mortgage_payment?: number | null
          second_mortgage_rate?: number | null
          second_mortgage_term?: string | null
          spr_amount?: number | null
          spr_percent?: number | null
          ss_auditor?: string | null
          status_date?: string | null
          taxes_included_in_payment?: string | null
          taxes_included_in_payment_select?: string | null
          time_in?: string | null
          title_binder?: string | null
          title_co_name?: string | null
          title_ordered?: string | null
          title_pld?: string | null
          title_rec_d?: string | null
          updated_at?: string
          voe_contact?: string | null
          voe_phone?: string | null
          voe_rec?: string | null
          voe_sent?: string | null
          vom_contact?: string | null
          vom_phone?: string | null
          vom_rec?: string | null
          vom_sent?: string | null
          zip_code?: string | null
        }
        Update: {
          admin_fee?: number | null
          app_amt?: number | null
          applicant_id_ref?: string | null
          appraisal_company?: string | null
          appraisal_fee?: number | null
          appraisal_invoice?: string | null
          appraisal_ordered?: string | null
          appraisal_paid?: number | null
          appraisal_received?: string | null
          arm_10_1_payment?: number | null
          arm_10_1_payment_field?: number | null
          arm_10_1_rate?: number | null
          arm_10_1_rate_field?: number | null
          arm_5_1_payment?: number | null
          arm_5_1_payment_field?: number | null
          arm_5_1_rate?: number | null
          arm_5_1_rate_field?: number | null
          arm_7_1_payment?: number | null
          arm_7_1_payment_field?: number | null
          arm_7_1_rate?: number | null
          arm_7_1_rate_field?: number | null
          cash_to_borrower?: number | null
          cleared_date?: string | null
          client_id?: string
          closed_date?: string | null
          closing_cost?: number | null
          closing_cost_field?: number | null
          clw_rec?: string | null
          clw_sent?: string | null
          consult_id?: string | null
          contract_cc?: string | null
          contract_pf?: string | null
          courier_fee?: number | null
          created_at?: string
          current_balance?: number | null
          date_in?: string | null
          disburse_date?: string | null
          dti_percent?: number | null
          dti_percent_field?: number | null
          estimated_fees_amount?: number | null
          estimated_fees_percent?: number | null
          existing_balance?: number | null
          field_trainer?: string | null
          final_rec_d?: string | null
          final_sent?: string | null
          first_mortgage_balance?: number | null
          first_mortgage_lienholder?: string | null
          first_mortgage_payment?: number | null
          first_mortgage_rate?: number | null
          first_mortgage_term?: string | null
          fixed_15_payment?: number | null
          fixed_15_payment_field?: number | null
          fixed_15_rate?: number | null
          fixed_15_rate_field?: number | null
          fixed_30_payment?: number | null
          fixed_30_payment_field?: number | null
          fixed_30_rate?: number | null
          fixed_30_rate_field?: number | null
          floan_id?: string | null
          funded_amt?: number | null
          funded_date?: string | null
          homeowner_insurance?: number | null
          homeowner_insurance_included_select?: string | null
          id?: string
          insurance_included_in_payment?: string | null
          interest_rate?: number | null
          interest_rate_field?: number | null
          lender_id?: string | null
          lender_id_field?: string | null
          lender_name?: string | null
          loan_status?: string | null
          loan_volume?: number | null
          ltv_percent?: number | null
          ltv_secondary?: number | null
          market_value?: number | null
          modified_by?: string | null
          modified_date?: string | null
          monthly_payment?: number | null
          monthly_payment_field?: number | null
          mortgage_id?: number | null
          mortgage_type?: string | null
          occupancy_type?: string | null
          original_loan_amount?: number | null
          original_loan_amount_field?: number | null
          origination_amount?: number | null
          origination_percent?: number | null
          pa_rec_d?: string | null
          pa_sent?: string | null
          processor_id?: string | null
          property_address?: string | null
          property_city?: string | null
          property_state?: string | null
          property_taxes?: number | null
          property_zip?: string | null
          proposed_first_int_term?: string | null
          proposed_first_loan_amount?: number | null
          proposed_first_payment?: number | null
          proposed_first_rate?: number | null
          proposed_first_term?: string | null
          proposed_second_int_term?: string | null
          proposed_second_loan_amount?: number | null
          proposed_second_payment?: number | null
          proposed_second_rate?: number | null
          proposed_second_term?: string | null
          purpose_of_loan?: string | null
          sales_support?: string | null
          second_mortgage_balance?: number | null
          second_mortgage_lienholder?: string | null
          second_mortgage_payment?: number | null
          second_mortgage_rate?: number | null
          second_mortgage_term?: string | null
          spr_amount?: number | null
          spr_percent?: number | null
          ss_auditor?: string | null
          status_date?: string | null
          taxes_included_in_payment?: string | null
          taxes_included_in_payment_select?: string | null
          time_in?: string | null
          title_binder?: string | null
          title_co_name?: string | null
          title_ordered?: string | null
          title_pld?: string | null
          title_rec_d?: string | null
          updated_at?: string
          voe_contact?: string | null
          voe_phone?: string | null
          voe_rec?: string | null
          voe_sent?: string | null
          vom_contact?: string | null
          vom_phone?: string | null
          vom_rec?: string | null
          vom_sent?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mortgages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      page_permissions: {
        Row: {
          can_access: boolean
          created_at: string
          id: string
          page_name: string
          role_name: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          can_access?: boolean
          created_at?: string
          id?: string
          page_name: string
          role_name: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          can_access?: boolean
          created_at?: string
          id?: string
          page_name?: string
          role_name?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          consultant_id: string
          created_at: string
          description: string | null
          id: string
          payment_date: string
          payment_type: string
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          consultant_id: string
          created_at?: string
          description?: string | null
          id?: string
          payment_date: string
          payment_type: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          consultant_id?: string
          created_at?: string
          description?: string | null
          id?: string
          payment_date?: string
          payment_type?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          amount: number | null
          anniversary: string | null
          can_access_securia: boolean
          cfs_certification_date: string | null
          cfs_status: string | null
          city: string | null
          comment: string | null
          company_name: string | null
          county: string | null
          created_at: string
          dob: string | null
          drivers_license_number: string | null
          drivers_license_state: string | null
          education_level: string | null
          effective_date: string | null
          ein: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employer: string | null
          employment_status: string | null
          fax: string | null
          first_name: string | null
          has_access: boolean
          hire_date: string | null
          id: string
          industry: string | null
          joint_member_name: string | null
          last_name: string | null
          maiden_name: string | null
          manager_id: string | null
          marital_status: string | null
          mbr_amt: number | null
          member_type: string | null
          membership_type: string | null
          mi: string | null
          mobile_phone: string | null
          mp_fee: number | null
          occupation: string | null
          other_phone: string | null
          pay_type: string | null
          phone: string | null
          race: string | null
          remarks: string | null
          role: Database["public"]["Enums"]["user_role"]
          sex: string | null
          spouse_name: string | null
          spouse_occupation: string | null
          ssn: string | null
          state: string | null
          status: Database["public"]["Enums"]["consultant_status"]
          status_date: string | null
          suffix: string | null
          title: string | null
          updated_at: string
          work_phone: string | null
          years_with_frq: number | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          amount?: number | null
          anniversary?: string | null
          can_access_securia?: boolean
          cfs_certification_date?: string | null
          cfs_status?: string | null
          city?: string | null
          comment?: string | null
          company_name?: string | null
          county?: string | null
          created_at?: string
          dob?: string | null
          drivers_license_number?: string | null
          drivers_license_state?: string | null
          education_level?: string | null
          effective_date?: string | null
          ein?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer?: string | null
          employment_status?: string | null
          fax?: string | null
          first_name?: string | null
          has_access?: boolean
          hire_date?: string | null
          id: string
          industry?: string | null
          joint_member_name?: string | null
          last_name?: string | null
          maiden_name?: string | null
          manager_id?: string | null
          marital_status?: string | null
          mbr_amt?: number | null
          member_type?: string | null
          membership_type?: string | null
          mi?: string | null
          mobile_phone?: string | null
          mp_fee?: number | null
          occupation?: string | null
          other_phone?: string | null
          pay_type?: string | null
          phone?: string | null
          race?: string | null
          remarks?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sex?: string | null
          spouse_name?: string | null
          spouse_occupation?: string | null
          ssn?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["consultant_status"]
          status_date?: string | null
          suffix?: string | null
          title?: string | null
          updated_at?: string
          work_phone?: string | null
          years_with_frq?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          amount?: number | null
          anniversary?: string | null
          can_access_securia?: boolean
          cfs_certification_date?: string | null
          cfs_status?: string | null
          city?: string | null
          comment?: string | null
          company_name?: string | null
          county?: string | null
          created_at?: string
          dob?: string | null
          drivers_license_number?: string | null
          drivers_license_state?: string | null
          education_level?: string | null
          effective_date?: string | null
          ein?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer?: string | null
          employment_status?: string | null
          fax?: string | null
          first_name?: string | null
          has_access?: boolean
          hire_date?: string | null
          id?: string
          industry?: string | null
          joint_member_name?: string | null
          last_name?: string | null
          maiden_name?: string | null
          manager_id?: string | null
          marital_status?: string | null
          mbr_amt?: number | null
          member_type?: string | null
          membership_type?: string | null
          mi?: string | null
          mobile_phone?: string | null
          mp_fee?: number | null
          occupation?: string | null
          other_phone?: string | null
          pay_type?: string | null
          phone?: string | null
          race?: string | null
          remarks?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sex?: string | null
          spouse_name?: string | null
          spouse_occupation?: string | null
          ssn?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["consultant_status"]
          status_date?: string | null
          suffix?: string | null
          title?: string | null
          updated_at?: string
          work_phone?: string | null
          years_with_frq?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string
          contact_id: string | null
          created_at: string
          created_by: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to: string
          contact_id?: string | null
          created_at?: string
          created_by: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string
          contact_id?: string | null
          created_at?: string
          created_by?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      team_lineage: {
        Row: {
          effective_from: string
          effective_to: string | null
          id: string
          level: number
          manager_id: string | null
          path: string[] | null
          user_id: string
        }
        Insert: {
          effective_from?: string
          effective_to?: string | null
          id?: string
          level?: number
          manager_id?: string | null
          path?: string[] | null
          user_id: string
        }
        Update: {
          effective_from?: string
          effective_to?: string | null
          id?: string
          level?: number
          manager_id?: string | null
          path?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_lineage_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_lineage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_user_data: {
        Args: Record<PropertyKey, never> | { target_user_id: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: string
      }
    }
    Enums: {
      activity_type:
        | "Call"
        | "Email"
        | "Meeting"
        | "Note"
        | "Task"
        | "Deal Update"
      consultant_status: "Active" | "Inactive" | "Pending"
      deal_stage:
        | "Lead"
        | "Qualified"
        | "Proposal"
        | "Negotiation"
        | "Closed Won"
        | "Closed Lost"
      task_priority: "Low" | "Medium" | "High" | "Critical"
      task_status: "Pending" | "In Progress" | "Completed" | "Cancelled"
      user_role:
        | "Admin"
        | "Field Builder"
        | "Field Trainer"
        | "Sr. BMA"
        | "BMA"
        | "IBA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "Call",
        "Email",
        "Meeting",
        "Note",
        "Task",
        "Deal Update",
      ],
      consultant_status: ["Active", "Inactive", "Pending"],
      deal_stage: [
        "Lead",
        "Qualified",
        "Proposal",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ],
      task_priority: ["Low", "Medium", "High", "Critical"],
      task_status: ["Pending", "In Progress", "Completed", "Cancelled"],
      user_role: [
        "Admin",
        "Field Builder",
        "Field Trainer",
        "Sr. BMA",
        "BMA",
        "IBA",
      ],
    },
  },
} as const
