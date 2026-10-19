const USER_API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL;
export const AUTH_EXPIRED_EVENT = "auth:expired";

const refreshSession = async (): Promise<boolean> => {
  const response = await fetch(`${USER_API_BASE_URL}/auth/refresh`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) return false;
  if (!response.ok) {
    throw new Error(`Session refresh failed (${response.status})`);
  }

  return true;
};

export const authenticatedFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  console.log("Init>>>>>>>", init, "Input>>>>>>>>", input);
  const requestInit: RequestInit = { ...init, credentials: "include" };
  const response = await fetch(input, requestInit);

  if (response.status !== 401) {
    return response;
  }

  if (!(await refreshSession())) {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    return response;
  }

  const retryResponse = await fetch(input, requestInit);

  if (retryResponse.status === 401) {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }

  return retryResponse;
};
