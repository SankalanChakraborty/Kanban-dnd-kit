import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser } from "../../api/user";
import type { User, UserState } from "../../interface";

export const fetchCurrentUser = createAsyncThunk<User>(
  "user/fetchCurrentUser",
  async () => {
    const response = await getCurrentUser();
    return response.user;
  },
);

const initialState: UserState = {
  status: "idle",
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: () => initialState,
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = "succeeded";
      state.isAuthenticated = true;
    },
    setLastActiveWorkspace(state, action) {
      if (state.user) state.user.lastActiveWorkspaceId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.status = "failed";
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export default userSlice.reducer;
export const { clearUser, setUser, setLastActiveWorkspace } = userSlice.actions;
