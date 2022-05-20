import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  id: string;
  emoji: string;
};

export interface UsersState {
  users: UserState[];
}

const initialState: UsersState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserState[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<UserState>) => {
      const newUser = action.payload;
      const otherUsers = state.users.filter((user) => user.id !== newUser.id);
      state.users = [...otherUsers, newUser];
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    resetUsers: (state) => {
      state.users = [];
    },
  },
});

export const { setUsers, addUser, removeUser, resetUsers } = usersSlice.actions;

export default usersSlice.reducer;
