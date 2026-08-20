export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AdminLoginResponse extends AdminAuthTokens {
  user: AdminUser;
}

export interface AdminLogoutResponse {
  success: boolean;
}
