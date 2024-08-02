import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  liveRoom: {}, // exectes the roomId which was returned from the server
  videos: {},
  rooms: [],

  searchUserResults: [],

  sync: false, // sync options is being used inside video player component , this option is used only for users and admins
  // syncing will be performed over creator's player state , that's why creator of the room doesn not need any sync option , syncing is dependent on the creator not creator on the syncing,

  // video player file , VideoPlayer will contain any one of these ,
  videoPlayerData: null, // contains the video object
  roomVideoPlayerData: null,
};

const appDataSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    setSearchUserResults: (state, action) => {
      console.log(action.payload);
      state.searchUserResults = action.payload;
    },

    // this is the data that is being returned from server ,
    // we don't need to worry about filteration here ,
    // cuz server will send isRequested field inside the response.data ,
    // on sending request it will becom true automatically
    // and on unsending requ it will become false automatically
    setOneSearchRequest: (state, action) => {
      const updatedUser = action.payload;
      console.log(state.searchUserResults);
      const newSearchUserResults = state.searchUserResults.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
      console.log(newSearchUserResults);
      state.searchUserResults = newSearchUserResults;
      console.log(state.searchUserResults);
    },

    setVideos: (state, action) => {
      // console.log(action);
      state.videos = action.payload;
    },

    setOneRooms: (state, action) => {
      const tempRoom = action.payload;
      const tempRooms = state.rooms.map((room) =>
        room._id === tempRoom._id ? tempRoom : room
      );
      state.rooms = tempRooms;
    },

    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    setLiveRoom: (state, action) => {
      console.log(action.payload);

      state.liveRoom = action.payload;
    },
    setSync: (state, action) => {
      state.sync = action.payload;
    },
    setVideoPlayerData: (state, action) => {
      state.videoPlayerData = action.payload;
      console.log("setting video player data ", action.payload);
    },
    setRoomVideoPlayerData: (state, action) => {
      state.roomVideoPlayerData = action.payload;
      console.log("setting room video player data ", action.payload);
    },
  },
});

export const {
  setVideos,
  setRooms,
  setLiveRoom,
  setOneRooms,
  setSync,
  setVideoPlayerData,
  setRoomVideoPlayerData,
  setSearchUserResults,
  setOneSearchRequest,
} = appDataSlice.actions;
export default appDataSlice.reducer;
