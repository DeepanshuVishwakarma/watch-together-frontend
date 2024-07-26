import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../service/apis";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ token, children }) => {
  const socketRef = useRef();
  const [socketError, setSocketError] = useState(false);

  useEffect(() => {
    if (token) {
      socketRef.current = io(SOCKET_URL, {
        query: { token },
      });

      socketRef.current.on("connect", () => {
        // console.log("Socket connected:", socketRef.current.id);
        setSocketError(false);
      });

      socketRef.current.on("connect_error", (err) => {
        // console.error("Socket connection error:", err);
        setSocketError(true);
      });

      return () => {
        socketRef.current.disconnect();
        // console.log("Socket disconnected");
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, socketError }}>
      {children}
    </SocketContext.Provider>
  );
};
