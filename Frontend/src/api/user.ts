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

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { headers } = getApiHeaders();
  const API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
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
