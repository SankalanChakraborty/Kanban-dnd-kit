import { getApiHeaders } from "../utils/getApiHeaders";

type WorkspaceRole = "owner" | "admin" | "member" | "viewer"; // roles you use; widen if you add more

interface WorkspaceMember {
  user: string; // ObjectId arrives as a string in JSON
  role: WorkspaceRole;
}

export interface Workspace {
  id: string;
  name: string;
  owner: string; // user id of the creator
  members: WorkspaceMember[]; // objects with a role, not plain ids
  teams: string[]; // empty for now; ids once teams exist
  createdAt: string; // dates are ISO strings in JSON, not Date objects
  updatedAt: string;
}

interface CreateWorkspaceRes {
  status: "success";
  code: string;
  workspace: Workspace;
  message: string;
}

interface GetMyWorkspaceRes {
  status: "success";
  myWorkspace: Workspace[]; // matches the key the server sends
  message: string;
}

interface ApiErrorRes {
  status: "error";
  message: string;
  code?: string; // only if your error responses include it
}

const API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL;

export const createWorkspace = async (
  workspaceName: string,
): Promise<CreateWorkspaceRes | ApiErrorRes> => {
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

export const getMyWorkspace = async (): Promise<
  GetMyWorkspaceRes | ApiErrorRes
> => {
  const { headers } = getApiHeaders();
  try {
    const response = await fetch(`${API_BASE_URL}/get-workspace`, {
      method: "GET",
      headers,
    });
    return response.json();
  } catch (error) {
    throw new Error("Error while fetching user workspace", { cause: error });
  }
};
