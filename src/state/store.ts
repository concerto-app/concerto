import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "./slices/code";
import usersReducer from "./slices/users";

export const store = configureStore({
  reducer: {
    code: codeReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
