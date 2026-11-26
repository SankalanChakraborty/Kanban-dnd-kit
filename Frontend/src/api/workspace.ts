import { getApiHeaders } from "../utils/getApiHeaders";
import { authenticatedFetch } from "./authenticatedFetch";
import type {
  ApiErrorRes,
  CreateWorkspaceRes,
  GetMyWorkspaceRes,
} from "../interface";

const API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL;

export const createWorkspace = async (
  workspaceName: string,
): Promise<CreateWorkspaceRes | ApiErrorRes> => {
  const { headers } = getApiHeaders();
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/create-workspace`,
      {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ workspaceName }),
      },
    );
    return response.json();
  } catch (error) {
    throw new Error("Error while creating new workspace", { cause: error });
  }
};

export const getMyWorkspace = async (): Promise<
  GetMyWorkspaceRes | ApiErrorRes
> => {
  const { headers } = getApiHeaders();
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/get-workspace`, {
      method: "GET",
      headers,
    });
    return response.json();
  } catch (error) {
    throw new Error("Error while fetching user workspace", { cause: error });
  }
};
