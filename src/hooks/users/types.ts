
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "Admin" | "Field Builder" | "Field Trainer" | "Senior BMA" | "BMA" | "IBA";
  status: string;
  can_access_securia: boolean;
  has_access: boolean;
  manager_id?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  // Additional fields from consultant system
  consultant_id?: string;
  entry_date?: string;
  position?: string;
  title?: string;
  middle_initial?: string;
  suffix?: string;
  mobile?: string;
  home_phone?: string;
  work_phone?: string;
  other_phone?: string;
  fax?: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zip_code?: string;
  comment?: string;
  remarks?: string;
}

export type UserRole = "Admin" | "Field Builder" | "Field Trainer" | "Senior BMA" | "BMA" | "IBA";

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  manager_id?: string;
  phone?: string;
  can_access_securia: boolean;
  has_access: boolean;
}

export interface UpdateUserData {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  manager_id?: string;
  phone?: string;
  can_access_securia: boolean;
  has_access: boolean;
}
