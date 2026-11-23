import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, type User } from "../../api/user";

type Status = "idle" | "pending" | "succeeded" | "failed";

interface UserState {
  status: Status;
  isAuthenticated: boolean;
  user: User | null;
}

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
  reducers: { clearUser: () => initialState },
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
