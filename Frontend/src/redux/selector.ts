import type { RootState } from "./store/store";

export const selectActiveWorkspace = (s: RootState) => {
  const workspaces = s.workspace.list;
  const user = s.user.user;
  const preferredId = user?.lastActiveWorkspaceId;
  return workspaces.find((w) => w.id === preferredId) ?? workspaces[0] ?? null;
};
