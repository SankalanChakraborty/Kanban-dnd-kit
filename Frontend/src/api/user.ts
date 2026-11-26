import { getApiHeaders } from "../utils/getApiHeaders";
import type {
  AuthErrorResponse,
  CurrentUserResponse,
  LoginRegisterResponse,
} from "../interface";
import { authenticatedFetch } from "./authenticatedFetch";

const API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL;

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<LoginRegisterResponse | AuthErrorResponse> => {
  try {
    const { headers } = getApiHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  } catch (error) {
    throw new Error("Error while creating new user", { cause: error });
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginRegisterResponse | AuthErrorResponse> => {
  try {
    const { headers } = getApiHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  } catch (error) {
    throw new Error("Error while logging in", { cause: error });
  }
};

export const forgotPassword = async (
  email: string,
): Promise<{ status: string; message: string }> => {
  try {
    const { headers } = getApiHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ email }),
    });
    return response.json();
  } catch (error) {
    throw new Error("Error while requesting password reset", { cause: error });
  }
};

export const resendVerifyMail = async (
  email: string,
): Promise<{
  status: string;
  code: string;
  retryAfter: number;
  message: string;
}> => {
  try {
    const { headers } = getApiHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/resend-email`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ email }),
    });
    return response.json();
  } catch (error) {
    throw new Error("Error while resending verification mail", {
      cause: error,
    });
  }
};

export const resetPassword = async (
  token: string | null,
  newPassword: string,
): Promise<{ status: string; message: string }> => {
  if (!token) {
    throw new Error("Token is required for password reset");
  }
  if (!newPassword) {
    throw new Error("New password is required for password reset");
  }
  try {
    const { headers } = getApiHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ token, password: newPassword }),
    });
    return response.json();
  } catch (error) {
    throw new Error("Error while resetting password", { cause: error });
  }
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Fetching current user failed (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
    );
  }

  return response.json();
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Error while loggin out (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
      );
    }
    return response.json();
  } catch (error) {
    throw new Error("Error while logging out", { cause: error });
  }
};
