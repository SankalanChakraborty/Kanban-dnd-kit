import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  createWorkspace,
  getMyWorkspace,
  type Workspace,
} from "../../api/workspace";

interface CreateWorkspaceResult {
  workspace: Workspace;
  message: string;
  code: string;
}

interface ApiError {
  code?: string;
  message: string;
}

export const fetchMyWorkspace = createAsyncThunk<
  Workspace[], // what the thunk returns on success
  void, // the argument you pass to dispatch (none here)
  { rejectValue: ApiError } // the type of what rejectWithValue carries
>("workspace/fetch", async (_, { rejectWithValue }) => {
  const response = await getMyWorkspace();
  if (response.status !== "success") {
    return rejectWithValue({
      code: response.code || "",
      message: response.message,
    }); // error branch: only the error fields exist here
  }

  return response.myWorkspace;
});

export const createWorkspaceThunk = createAsyncThunk<
  CreateWorkspaceResult, // the new workspace on success
  string, // the argument: the workspace name
  { rejectValue: ApiError }
>("workspace/create", async (workspaceName, { rejectWithValue }) => {
  const response = await createWorkspace(workspaceName); // your API function
  if (response.status !== "success")
    return rejectWithValue({
      code: response.code || "",
      message: response.message,
    });

  // this is action.payload
  return {
    workspace: response.workspace,
    message: response.message,
    code: response.code,
  };
});

interface WorkspaceState {
  list: Workspace[]; // every workspace the user belongs to; empty is a valid value
  activeWorkspaceId: string | null; // which one is open right now
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: ApiError | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed"; // idle = never fetched
  fetchError: ApiError | null; // message to show if the fetch failed
}

const initialState: WorkspaceState = {
  list: [],
  activeWorkspaceId: null,
  createStatus: "idle",
  createError: null,
  fetchStatus: "idle",
  fetchError: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveWorkspace(state, action: PayloadAction<string>) {
      state.activeWorkspaceId = action.payload; // used by the switcher
    },
  },
  extraReducers: (builder) => {
    //create
    builder.addCase(createWorkspaceThunk.pending, (state) => {
      state.createStatus = "loading";
      state.createError = null;
    });
    builder.addCase(createWorkspaceThunk.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
      state.list.push(action.payload.workspace);
      state.activeWorkspaceId = action.payload.workspace.id;
    });
    builder.addCase(createWorkspaceThunk.rejected, (state, action) => {
      state.createStatus = "failed";
      state.createError = action.payload ?? {
        message: action.error.message || "Workspace cannot be created",
      };
    });

    //fetch
    builder.addCase(fetchMyWorkspace.pending, (state) => {
      state.fetchStatus = "loading";
      state.fetchError = null;
    });
    builder.addCase(fetchMyWorkspace.fulfilled, (state, action) => {
      state.fetchStatus = "succeeded";
      state.list = action.payload;
    });
    builder.addCase(fetchMyWorkspace.rejected, (state, action) => {
      state.fetchStatus = "failed";
      state.fetchError = action.payload ?? {
        message: action.error.message || "Could not load workspaces",
      };
    });
  },
});

export const { setActiveWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
