import { BaseEntity } from './index';

export type UserRole = 'customer' | 'admin' | 'staff';

export interface IUser extends BaseEntity {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  image?: string;
  phone?: string;
  emailVerified: boolean;
  firebaseUid?: string;
  isActive: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  image?: File;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileInput {
  name?: string;
  image?: string;
  phone?: string;
}

export interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthResponse {
  user: IUser;
  token?: string;
}
