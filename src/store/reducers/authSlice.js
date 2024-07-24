import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testRedux: 1,

  isLoading: false,

  // token: localStorage.getItem("token")
  //   ? JSON.parse(localStorage.getItem("token"))
  //   : null,

  // for testing of the project
  token: null,
};

const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    setToken: (state, action) => {
      console.log(action);
      state.token = action.payload;
    },

    setIsTokenLoading: (state, action) => {
      console.log(action);
      state.isLoading = action.payload;
    },
  },
});

export const { setToken, setIsTokenLoading } = authUserSlice.actions;
export default authUserSlice.reducer;
