const USER_API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL;

let refreshInFlight: Promise<boolean> | null = null;

const refreshSession = (): Promise<boolean> => {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${USER_API_BASE_URL}/auth/refresh`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.ok)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
};

export const authenticatedFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  const requestInit: RequestInit = { ...init, credentials: "include" };
  const response = await fetch(input, requestInit);

  if (response.status !== 401) {
    return response;
  }

  if (!(await refreshSession())) {
    return response;
  }

  return fetch(input, requestInit);
};
