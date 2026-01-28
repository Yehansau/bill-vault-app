export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  error?: string;
}
