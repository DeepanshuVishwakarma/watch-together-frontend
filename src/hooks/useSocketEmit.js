import { useState, useCallback } from "react";
import { useSocket } from "../socket/SocketProvider";

export const useSocketEmit = () => {
  console.log("useSocketEmit called");
  const { socket, error: socketError } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const emit = useCallback(
    (event, data, callback) => {
      if (socket && !socketError) {
        console.log("emitting event");
        setIsLoading(true);
        setError(null);
        setResponse(null);

        socket.emit(event, data, (responseData) => {
          setIsLoading(false);
          setResponse(responseData);
          if (callback) {
            console.log("ack received", responseData);
            callback(responseData);
          }
        });
      } else {
        console.log("Socket connection error");
        setError("Socket connection error");
        setIsLoading(false);
      }
    },
    [socket, socketError]
  );

  return { emit, isLoading, response, error };
};
