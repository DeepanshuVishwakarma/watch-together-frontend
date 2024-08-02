import { Outlet, UNSAFE_LocationContext, useLocation } from "react-router-dom";
// SocketComponent.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CreateRoom from "./CreateRoom";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getLocalStorage } from "../functions/localStorage";
import SideBar from "../components/sidebar/SideBar";
import VideoPlayer from "../components/videos/VideoPlayer";
const socket = io("http://localhost:5173"); // URL of your server

const Home = () => {
  // const key = "users";
  // const users = getLocalStorage(key);
  const user = useSelector((state) => state.User.user);
  const videoPlayerData = useSelector((state) => state.appData.videoPlayerData);
  const roomVideoPlayerData = useSelector(
    (state) => state.appData.roomVideoPlayerData
  );

  useEffect(() => {
    console.log(
      "Inside Home Page , roomVideoPlayerData " +
        roomVideoPlayerData +
        "videoPlayerData",
      videoPlayerData
    );
  }, [roomVideoPlayerData, videoPlayerData]);
  const location = useLocation();
  const isRoomPage = () => location.pathname.includes("room");
  const isVideoPage = () => location.pathname.includes("videos");
  return (
    <div className="home-container">
      <SideBar />
      {user && user._id && isRoomPage() && <VideoPlayer />}
      {user && user._id && isVideoPage() && <VideoPlayer />}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
