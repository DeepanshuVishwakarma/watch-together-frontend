export const BASE_URL = "http://localhost:5173/api/v1";
export const SOCKET_URL = "http://localhost:5173";
export const endpoints = {
  // SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  TOKEN_LOGIN_API: BASE_URL + "/auth/is-auth",
  // RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  // RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

export const roomEndPoints = {
  CREATE_ROOM_URL: BASE_URL + "/app/room/create",
  GET_ALL_ROOM_URL: BASE_URL + "/app/room/getAll",
  LEAVE_ROOM_URL: BASE_URL + "/app/room/leave", // append room ID manually when calling
  UPDATE_ROOM_URL: BASE_URL + "/app/room/update", // append room ID manually when calling
  DELETE_ROOM_URL: BASE_URL + "/app/room/delete", // append room ID manually when calling
  REMOVE_MEMBER_URL: BASE_URL + "/app/room/removeMember", // append room ID and user ID manually when calling
};

export const videoEndPoints = {
  UPLOAD_VIDEO_URL: BASE_URL + "/app/video/upload",
  GET_VIDEO_BY_ID_URL: BASE_URL + "/app/video/getVideobyId", // append video ID manually when calling
  SEARCH_VIDEO_BY_TAG_URL: BASE_URL + "/app/video/search/tag", // append tag manually when calling
  SEARCH_VIDEO_BY_NAME_URL: BASE_URL + "/app/video/search", // append name manually when calling
  GET_ALL_VIDEOS_URL: BASE_URL + "/app/video/getAllVideos",
  DELETE_VIDEO_BY_ID_URL: BASE_URL + "/app/video/delete", // append video ID manually when calling
  DELETE_ALL_VIDEOS_URL: BASE_URL + "/app/video/deleteAll",
  UPDATE_VIDEO_BY_ID_URL: BASE_URL + "/app/video/update", // append video ID manually when calling
};
