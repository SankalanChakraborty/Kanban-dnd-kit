import { getApiHeaders } from "../utils/getApiHeaders";

interface Workspace {
  id: string;
  name: string;
}

interface CreateWorkspaceRes {
  status: string;
  code: string;
  workspace: Workspace;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL;

export const createWorkspace = async (
  workspaceName: string,
): Promise<CreateWorkspaceRes> => {
  const { headers } = getApiHeaders();
  try {
    const response = await fetch(`${API_BASE_URL}/create-workspace`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ workspaceName }),
    });
    return response.json();
  } catch (error) {
    throw new Error("Error while creating new workspace", { cause: error });
  }
};
