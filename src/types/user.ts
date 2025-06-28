export interface UserRole {
  id: number;
  title: string;
}

export interface UserDetail {
  id: number;
  user_id: number;
  image_path: string | null;
  address_line_one: string | null;
  address_line_two: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  emergency_contact_email: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_person: string | null;
  nationality: string | null;
  status: number;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  status: number;
  role: UserRole;
  user_detail: UserDetail;
}