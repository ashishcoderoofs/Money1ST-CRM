
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "Admin" | "Field Builder" | "Field Trainer" | "Sr. BMA" | "BMA" | "IBA";
  status: string;
  can_access_securia: boolean;
  has_access: boolean;
  manager_id?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = "Admin" | "Field Builder" | "Field Trainer" | "Sr. BMA" | "BMA" | "IBA";

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
