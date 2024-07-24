import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  liveRoom: {}, // exectes the roomId which was returned from the server
  videos: [],
  rooms: [],
};

const appDataSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    setVideos: (state, action) => {
      // console.log(action);
      state.videos = action.payload;
    },
    setOneRooms: (state, action) => {
      const tempRoom = action.payload;
      const tempRooms = state.rooms.filter((room) => room._id === tempRoom._id);
      tempRooms.push(tempRoom);
      state.rooms = tempRooms;
    },
    setRooms: (state, action) => {
      // console.log(action);
      state.rooms = action.payload;
    },
    setLiveRoom: (state, action) => {
      state.liveRoom = action.payload;
    },
  },
});

export const { setVideos, setRooms, setLiveRoom, setOneRooms } =
  appDataSlice.actions;
export default appDataSlice.reducer;
