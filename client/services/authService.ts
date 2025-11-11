// services/authService.ts
import API from "../lib/api"; // ✅ use your shared axios instance

// -------------------- Types --------------------
interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Login
export const loginUser = async (data: LoginData): Promise<UserResponse> => {
  const res = await API.post<UserResponse>("/auth/login", data);
  return res.data;
};

// Signup
export const signupUser = async (data: SignupData): Promise<UserResponse> => {
  const res = await API.post<UserResponse>("/auth/signup", data);
  return res.data;
};

// Logout
export const logoutUser = async (): Promise<void> => {
  await API.post("/auth/logout"); // cookie cleared by backend
};
