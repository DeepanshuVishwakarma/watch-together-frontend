import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Assume you have a function to get the token

// Connect to the socket server with the token
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJpbkAxMjMiLCJpYXQiOjE3MjEwNTU1OTcsImV4cCI6MTcyMTE0MTk5N30.UP0QUGxn38StkLRxpqOt43lZwrR76OasJtQxdy6hzJY";

export default function CreateRoom() {
  const [createConnection, setCreateConnection] = useState(false);

  useEffect(() => {
    // Set up the event listener for 'room:created'
    if (createConnection) {
      const socket = io("http://localhost:5173", {
        query: { token: token },
      });
      socket.on("room:created", (roomId) => {
        console.log(`Room created: ${roomId}`);
        // You can add additional logic here, like updating the UI
      });
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off("room:created");
    };
  }, []);

  const handleCreateRoom = () => {
    const roomId = "66957866c103d072cc2b4aae"; // Replace with your room ID
    socket.emit("room:goLive", roomId);
  };

  return (
    <div className="flex flex col">
      <button
        onClick={() => {
          setCreateConnection(!createConnection);
        }}
      >
        Create Connection
      </button>
      <button onClick={handleCreateRoom}>Create Room</button>;
    </div>
  );
}
