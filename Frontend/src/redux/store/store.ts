import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";

export const store = configureStore({
  reducer: { user: userReducer },
});

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
