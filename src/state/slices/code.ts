import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CodeState {
  code?: Code;
}

const initialState: CodeState = {
  code: undefined,
};

export const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<Code>) => {
      state.code = action.payload;
    },
    resetCode: (state) => {
      state.code = [];
    },
  },
});

export const { setCode, resetCode } = codeSlice.actions;

export default codeSlice.reducer;
