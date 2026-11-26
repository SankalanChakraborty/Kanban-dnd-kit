export type TaskType = "to do" | "in progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export interface ColumnType {
  id: string;
  title: TaskType;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskType;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: { name: string; avatarColor: string };
  createdAt: string;
  columnId: ColumnType["id"];
}

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface WorkspaceMember {
  user: { id: string; name: string; email: string };
  role: WorkspaceRole;
  email: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner: { id: string; name: string; email: string };
  members: WorkspaceMember[];
  teams: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  workspace: string[];
  teams: string[];
  role: string[];
  lastActiveWorkspaceId: string | null;
}

export interface LoginRegisterResponse {
  status: "success";
  message: string;
  user: User | null;
}

export interface AuthErrorResponse {
  status: "error";
  message: string;
}

export interface CurrentUserResponse {
  status: string;
  isAuthenticated: boolean;
  user: User;
}

export interface CreateWorkspaceRes {
  status: "success";
  code: string;
  workspace: Workspace;
  message: string;
}

export interface GetMyWorkspaceRes {
  status: "success";
  myWorkspace: Workspace[];
  message: string;
}

export interface ApiErrorRes {
  status: "error";
  message: string;
  code?: string;
}

export interface TasksResponse {
  status: string;
  message: string;
  tasks: Task[];
}

export interface TaskResponse {
  status: string;
  message: string;
  task: Task;
}

export interface CreateTaskResponse {
  status: string;
  message: string;
  task: Task;
}

export interface UserContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export interface ToastState {
  message: string;
  type: ToastType;
}

export interface ModalProps {
  isEditCardModalOpen: boolean;
  setIsEditCardModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addTaskColumn: ColumnType | null;
  setAddTaskColumn: React.Dispatch<React.SetStateAction<ColumnType | null>>;
  isCreateWorkSpaceModalOpen: boolean;
  setIsCreateWorkspaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CardProps {
  task: Task;
}

export interface ColumnProps {
  column: ColumnType;
}

export interface AddTaskModalProps {
  column: ColumnType;
}

export interface MemberListProps {
  memberName: string;
  email: string;
  isOwner: boolean;
}

export interface ActionRowProps {
  idx: number;
  title: string;
  description: string;
  buttonPrimary: boolean;
  buttonLabel: string;
  border: string;
}

export interface UserDropDownProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ButtonStyle = "primary" | "secondary" | "tertiary" | "disabled";
export type ButtonType = "submit" | "button";

export interface ButtonProps {
  buttonStyle: ButtonStyle;
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  buttonTertiary?: boolean;
  additionalStyles?: string;
  type: ButtonType;
  onClick?: () => void;
}

export type ToastType = "info" | "success" | "error";

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export interface SignInErrors {
  emailOrUser?: string;
  password?: string;
}

export interface SignUpErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export interface WorkspaceThunkResult {
  workspace: Workspace;
  message: string;
  code: string;
}

export interface WorkspaceThunkError {
  code?: string;
  message: string;
}

export interface WorkspaceState {
  list: Workspace[];
  activeWorkspaceId: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: WorkspaceThunkError | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: WorkspaceThunkError | null;
}

export interface UserState {
  status: "idle" | "pending" | "succeeded" | "failed";
  isAuthenticated: boolean;
  user: User | null;
}
