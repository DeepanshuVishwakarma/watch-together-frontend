import React, { useEffect, useState } from "react";
import SocketHandler from "./SocketHandler";
import { useSelector } from "react-redux";
import { SocketProvider } from "./socket/SocketProvider";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState();

  const { token } = useSelector((state) => state.authUser);
  useEffect(() => {
    setIsAuthenticated(Boolean(token));
  }, [token]);
  return (
    <SocketProvider token={token}>
      <SocketHandler></SocketHandler>
    </SocketProvider>
  );
}
