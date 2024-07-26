import { useEffect, useState } from "react";
import Home from "./Page/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./Page/Auth/SignUp";
import Login from "./Page/Auth/Login";
import CreateRoom from "./Page/CreateRoom";
import Navbar from "./components/navbar/NavBar";
import RoomLists from "./components/rooms/RoomLists";
import Video from "./components/videos/Video";
import { SocketProvider, useSocket } from "./socket/SocketProvider";
import LiveRoom from "./components/rooms/liveRoom/LiveRoom";

function SocketHandler() {
  // is component ke andar useSocket use karna tha isliye , inside app .js , first humne socket context provide karba diya uske bad ,
  // yaha par humne routing ki
  const { socket, socketError } = useSocket();

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socket && socket.connected) {
        socket.emit("room:endlive");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (socket && socket.connected) {
        socket.emit("room:endlive");
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket]);
  useEffect(() => {
    return () => {
      if (socket && socket.connected) {
        socket.emit("room:endlive");
      }
    };
  }, [socket]);

  if (socketError) {
    return <div>Socket connection error</div>;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="rooms" element={<RoomLists />} />
          <Route path="room/:id" element={<LiveRoom />} />
          <Route path="videos" element={<Video />} />
        </Route>
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default SocketHandler;
