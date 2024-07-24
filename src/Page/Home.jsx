import { Outlet } from "react-router-dom";
// SocketComponent.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CreateRoom from "./CreateRoom";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getLocalStorage } from "../functions/localStorage";
import SideBar from "../components/sidebar/SideBar";
const socket = io("http://localhost:5173"); // URL of your server

const Home = () => {
  // const key = "users";
  // const users = getLocalStorage(key);

  return (
    <div className="home-container">
      <SideBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
