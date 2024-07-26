import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setLiveRoom } from "../../../store/reducers/appData";
import { useSocketEmit } from "../../../hooks/useSocketEmit";
import { useSocket } from "../../../socket/SocketProvider";

export default function LiveRoom() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authUser?.token);
  const { id: roomId } = useParams();

  const { socket, socketError } = useSocket();

  const rooms = useSelector((state) => state.appData.rooms) || [];
  const room = rooms.find((room) => room?._id === roomId);

  const liveRoom = useSelector((state) => state.appData.liveRoom); // Fixed the return issue

  const [msg, setMsg] = useState("");

  const {
    emit: emitMessageSend,
    isLoading: isMessageSendLoading,
    response: messageSendResponse,
    error: messageSendError,
  } = useSocketEmit();

  useEffect(() => {
    if (socket) {
      socket.on("room:message", (newMessage) => {
        console.log("New message received:", newMessage);

        if (liveRoom?.messages) {
          let tempLiveRoom = liveRoom;
          let tempMessages = [...liveRoom.messages];
          tempMessages.push(newMessage);
          tempLiveRoom = {
            ...tempLiveRoom,
            messages: tempMessages,
          };
          dispatch(setLiveRoom(tempLiveRoom));
        }
        // dispatch(
        //   setLiveRoom((prevLiveRoom) => ({
        //     ...prevLiveRoom,
        //     messages: [...prevLiveRoom.messages, newMessage],
        //   }))
        // );
      });
      return () => {
        socket.off("room:message");
      };
    }
  }, [socket, dispatch]);

  const handleSend = () => {
    emitMessageSend("room:message", { roomId, message: msg }, (response) => {
      if (response?.success) {
        setMsg("");
        console.log(
          "Response from sending message:",
          JSON.stringify(response.data)
        );
      } else if (response?.error) {
        console.error(response.message);
      }
    });
  };

  const handleText = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div>
      <div>
        <div>Chat Component</div>
        <div>
          {liveRoom?.messages &&
            liveRoom?.messages.length > 0 &&
            liveRoom?.messages.map((obj) => (
              <div key={obj.sentAt}>
                <strong>
                  {obj.sender.firstName} {obj.sender.lastName}:
                </strong>{" "}
                {obj.message} <em>({obj.sentAt})</em>
              </div>
            ))}
        </div>
        <input
          type="text"
          placeholder="Welcome in chat"
          value={msg}
          onChange={handleText}
        />
        <button onClick={handleSend}>
          {isMessageSendLoading ? "Sending..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
