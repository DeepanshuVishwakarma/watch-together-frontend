import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testRedux: 1,
  user: null,
  isLoading: false,
  error: null,
  isSignedIn: false,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // console.log(action);
      state.user = action.payload;
    },
    setIsUserLoading: (state, action) => {
      // console.log(action);
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      // console.log("setError", action);
      state.error = action.payload;
    },
    setIsSignedIn: (state, action) => {
      // console.log("payload for login error", action.payload);
      state.isSignedIn = action.payload;
    },
  },
});

export const { setUser, setIsUserLoading, setError, setIsSignedIn } =
  userSlice.actions;
export default userSlice.reducer;
