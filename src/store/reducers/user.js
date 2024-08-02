import { createSlice } from "@reduxjs/toolkit";
import { unstable_HistoryRouter } from "react-router-dom";

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
      // console.log(action);achha
      state.user = action.payload;
    },
    setFriendRequestAccepted: (state, action) => {
      const data = action.payload;
      state.user.friends.push(action.payload);
    },

    // setFriendRequestDeleted: (state, action) => {
    //   const data = action.payload;

    // },
    setRecievedFriendRequest: (state, action) => {
      state.user.requestFrom.push(action.payload);
    },

    unsetRecievedFriendRequest: (state, action) => {
      console.log("before", state.user.requestFrom);
      state.user.requestFrom = state.user.requestFrom.filter(
        (user) => user._id !== action.payload._id
      );
      console.log("after", state.user.requestFrom);
    },

    setDeletingFriendRequest: (state, action) => {
      const data = action.payload; // request sender
      console.log(
        " deleting friend request reduceer",
        state.user.requestFrom,
        "data",
        data
      );

      state.user.requestFrom = state.user.requestFrom.filter(
        (user) => user._id !== data._id
      );
      console.log(state.user.requestFrom);
    },
    setFriendRequestAccepting: (state, action) => {
      const data = action.payload; // request sender

      state.user.requestFrom = state.user.requestFrom.filter(
        (user) => user._id !== data._id
      );

      state.user.friends.push(data);
    },
    deleteFriend: (state, action) => {
      const data = action.payload; // request sender
      state.user.friends = state.user.friends.filter(
        (user) => user._id !== data._id
      );
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

export const {
  setUser,
  setIsUserLoading,
  setError,
  setIsSignedIn,
  setDeletingFriendRequest,
  setFriendRequestAccepting,
  deleteFriend,
  setFriendRequestAccepted,
  setFriendRequestDeleted,

  setRecievedFriendRequest,
  unsetRecievedFriendRequest,
} = userSlice.actions;
export default userSlice.reducer;
