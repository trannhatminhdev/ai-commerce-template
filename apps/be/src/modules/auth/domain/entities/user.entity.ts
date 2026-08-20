export interface User {
  id: number;
  email: string;
}

export interface LoginResult {
  accessToken: string;
  user: User;
}
