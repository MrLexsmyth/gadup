export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
