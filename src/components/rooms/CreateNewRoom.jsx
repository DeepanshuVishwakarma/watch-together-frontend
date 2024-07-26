import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../UI/PopOver";
import Button from "../UI/Button";
import useHttp from "../../hooks/useHttp";
import { roomEndPoints } from "../../service/apis";
import { CreateRoomButton } from "./RoomButtons";
import { useSocket } from "../../socket/SocketProvider";

export default function CreateNewRoom({ trigger }) {
  const token = useSelector((state) => state?.authUser?.token);

  const { isLoading, error, data, sendRequest } = useHttp();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [permissions, setPermissions] = useState({
    chat: false,
    videoCall: false,
    audioCall: false,
    playList: false,
    player: false,
  });

  const handleCreateClick = async () => {
    // validate inputs
    if (!roomName) {
      alert("Room name is required");
      return;
    }
    if (description.length < 3 || description.length > 50) {
      alert("Description must be between 3 and 50 characters");
      return;
    }

    // prepare request data
    const requestData = {
      name: roomName,
      discription: description,
      isPrivate,
      permissions,
    };
    // console.log(requestData);
    // send request
    await sendRequest({
      url: `${roomEndPoints.CREATE_ROOM_URL}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: requestData,
    });

    // handle success
    if (!error) {
      // console.log("Room created successfully");
      setRoomName("");
      setDescription("");
      setIsPrivate(false);
      setPermissions({
        chat: false,
        videoCall: false,
        audioCall: false,
        playList: false,
        player: false,
      });
    }
  };
  // just for testing purposes
  // useEffect(() => {
  //   // console.log("creating Room loading ", isLoading, "data", data);
  // }, [isLoading]);

  // socket events are here

  return (
    <Popover className="relative">
      <PopoverTrigger className="h-full">
        <CreateRoomButton>create new room</CreateRoomButton>
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <div className="flex flex-col gap-2 overflow-y-auto">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
          />
          <div className="flex items-center">
            <label className="mr-2">Private</label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">Chat</label>
            <input
              type="checkbox"
              checked={permissions.chat}
              onChange={(e) =>
                setPermissions((prev) => ({ ...prev, chat: e.target.checked }))
              }
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">Video Call</label>
            <input
              type="checkbox"
              checked={permissions.videoCall}
              onChange={(e) =>
                setPermissions((prev) => ({
                  ...prev,
                  videoCall: e.target.checked,
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">Audio Call</label>
            <input
              type="checkbox"
              checked={permissions.audioCall}
              onChange={(e) =>
                setPermissions((prev) => ({
                  ...prev,
                  audioCall: e.target.checked,
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">Play List</label>
            <input
              type="checkbox"
              checked={permissions.playList}
              onChange={(e) =>
                setPermissions((prev) => ({
                  ...prev,
                  playList: e.target.checked,
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">Player</label>
            <input
              type="checkbox"
              checked={permissions.player}
              onChange={(e) =>
                setPermissions((prev) => ({
                  ...prev,
                  player: e.target.checked,
                }))
              }
            />
          </div>
          <Button onClick={handleCreateClick} className="mt-4">
            Create Room
          </Button>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
