import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface KeyboardState {
  pressed: { [note: number]: string };
}

const initialState: KeyboardState = {
  pressed: [],
};

export const keyboardSlice = createSlice({
  name: "keyboard",
  initialState,
  reducers: {
    press: (state, action: PayloadAction<{ note: number; user: string }>) => {
      const note = action.payload.note;
      const user = action.payload.user;
      if (note in state.pressed) return;
      state.pressed = {
        [note]: user,
        ...state.pressed,
      };
    },
    release: (state, action: PayloadAction<{ note: number; user: string }>) => {
      const note = action.payload.note;
      const user = action.payload.user;
      const { [note]: pressingUser, ...other } = state.pressed;
      if (pressingUser !== user) return;
      state.pressed = other;
    },
    resetKeyboard: (state) => {
      state.pressed = [];
    },
  },
});

export const { press, release, resetKeyboard } = keyboardSlice.actions;

export default keyboardSlice.reducer;
