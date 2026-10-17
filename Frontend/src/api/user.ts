import { getApiHeaders } from "./task";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  status: string;
  message: string;
  user: User;
}

interface CurrentUserResponse {
  status: string;
  isAuthenticated: boolean;
  user: User;
}

const API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL;

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { headers } = getApiHeaders();
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Login failed (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
    );
  }
  return response.json();
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Login failed (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
    );
  }
  return response.json();
};
