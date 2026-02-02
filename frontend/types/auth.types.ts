// types/auth.types.ts
export interface RegisterData {
  email: string;
  password: string;
  account_type: "individual" | "business";
  full_name?: string; // For individual
  business_name?: string; // For business
  business_type?: string; // For business
  business_address?: string; // For business
  phone_number?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  email: string;
  account_type: "individual" | "business";
  user_id: string;
  full_name?: string;
  business_name?: string;
}

export interface UserProfile {
  user_id: string;
  email: string;
  account_type: "individual" | "business";
  full_name?: string;
  business_name?: string;
  phone_number?: string;
  created_at: string;
}
