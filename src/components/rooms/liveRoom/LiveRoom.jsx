import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setLiveRoom } from "../../../store/reducers/appData";
import { useSocketEmit } from "../../../hooks/useSocketEmit";
import { useSocket } from "../../../socket/SocketProvider";
import VideoPlayer from "../../videos/VideoPlayer";
import VideoList from "../../videos/VideoList";
import ReactPlayer from "react-player";
import PeerService from "../../../wrtc/peer";
export default function LiveRoom() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authUser?.token);
  const { id: roomId } = useParams();

  const { socket, socketError } = useSocket();

  const user = useSelector((state) => state.User.user);
  const rooms = useSelector((state) => state.appData.rooms) || [];
  const videos = useSelector((state) => state.appData.videos) || [];
  const liveRoom = useSelector((state) => state.appData.liveRoom);

  const video = videos[0];
  const room = rooms.find((room) => room?._id === roomId);

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

  const [remoteStreams, setRemoteStreams] = useState([]);
  const [myStream, setMyStream] = useState();

  const startCall = async (mediaConstraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    setMyStream(stream);

    stream.getTracks().forEach((track) => {
      peerService.peer.addTrack(track, stream);
    });

    const offer = await peerService.getOffer();
    socket.emit("user:offer", { roomId, offer }, (response) => {
      if (response.success) {
        console.log("Answer received", response.data);
        console.log(peerService);
        peerService.setLocalDescription(response.data);
      } else {
        console.log("Error establishing connection with WebRTC");
      }
    });
  };

  const [audiocall, setAudio] = useState(false);
  const [videocall, setVideo] = useState(false);

  const handleAudioCall = () => {
    setAudio(!audiocall);
    startCall({ video: videocall, audio: !audiocall });
  };

  const handleVideoCall = () => {
    setVideo(!videocall);
    startCall({ audio: audiocall, video: !videocall });
  };

  useEffect(() => {
    peerService.peer.ontrack = (event) => {
      setRemoteStreams((prevStreams) => [...prevStreams, event.streams[0]]);
    };

    socket.on("answer", (answer) => {
      peerService.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", (candidate) => {
      console.log("candidate", candidate);
      peerService.peer.addIceCandidate(
        new RTCIceCandidate(candidate.candidate)
      );
    });

    return () => {
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [socket]);

  const handleText = (e) => {
    setMsg(e.target.value);
  };

  // const isRoomPage = () => location.pathname.includes("room");
  const isCreator = () => {
    return rooms.find((room) => room._id === roomId)?.createdBy === user._id;
  };

  return (
    <div>
      <button onClick={handleAudioCall}>Start Audio Call</button>
      <button onClick={handleVideoCall}>Start Video Call</button>
      {myStream && (
        <div>
          <h2>My Stream</h2>
          <video
            autoPlay
            muted
            ref={(video) => video && (video.srcObject = myStream)}
          />
        </div>
      )}

      {remoteStreams.map((stream, index) => (
        <div key={index}>
          <h2>Remote Stream {index + 1}</h2>
          <video
            autoPlay
            ref={(video) => video && (video.srcObject = stream)}
          />
        </div>
      ))}

      <div className="chat-component">
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
      {/* <div className="videoPlayer compoent">
            <VideoPlayer></VideoPlayer>
      </div> */}

      {isCreator() && <VideoList />}
    </div>
  );
}
