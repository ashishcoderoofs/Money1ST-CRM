
import { Client } from "../types";

export function getBasicFormDefaults(existingClient?: Client) {
  return {
    applicant: existingClient?.applicant || "",
    co_applicant: existingClient?.co_applicant || "",
    consultant_name: existingClient?.consultant_name || "",
    processor_name: existingClient?.processor_name || "",
    total_debt: existingClient?.total_debt || 0,
    payoff_amount: (existingClient as any)?.payoff_amount || 0,
    status: (existingClient?.status as "Open" | "Closed") || "Open",
    entry_date: existingClient?.entry_date || new Date().toISOString().split('T')[0],
    applicant_contact: existingClient?.applicant_contact || "",
    applicant_email: existingClient?.applicant_email || "",
    coapplicant_contact: existingClient?.coapplicant_contact || "",
    coapplicant_email: existingClient?.coapplicant_email || "",
    co_applicant_total_debt: existingClient?.co_applicant_total_debt || 0,
  };
}
