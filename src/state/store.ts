import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "./slices/code";
import usersReducer from "./slices/users";
import keyboardReducer from "./slices/keyboard";

export const store = configureStore({
  reducer: {
    code: codeReducer,
    users: usersReducer,
    keyboard: keyboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
