import { getApiHeaders } from "./task";
import { authenticatedFetch } from "./authenticatedFetch";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginRegisterResponse {
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

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<LoginRegisterResponse> => {
  try {
    const { headers } = getApiHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to create new user (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
      );
    }
    return response.json();
  } catch (error) {
    throw new Error("Error while creating new user", { cause: error });
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginRegisterResponse> => {
  try {
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
  } catch (error) {
    throw new Error("Error while logging in", { cause: error });
  }
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Login failed (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
      );
    }
    return response.json();
  } catch (error) {
    throw new Error("Error while getting current user", { cause: error });
  }
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
