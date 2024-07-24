import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import useHttp from "../hooks/useHttp";
// import { roomEndPoints } from "../service/apis";
// import { setRooms } from "../store/reducers/appData";
import useHttp from "../../hooks/useHttp";
import { roomEndPoints } from "../../service/apis";
import { setRooms } from "../../store/reducers/appData";
export default function UpdateRoom({ _id: roomId }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authUser.token);
  const { rooms } = useSelector((state) => state.appData) || [];
  const room = rooms.find((room) => room?._id === roomId);

  const { isLoading, error, data: updatedRoom, sendRequest } = useHttp();

  const [tempRoom, setTempRoom] = useState(room);

  const handleUpdateRoom = async () => {
    await sendRequest({
      url: `${roomEndPoints.UPDATE_ROOM_URL}/${roomId}`,
      method: "PUT",
      body: {
        roomName: tempRoom.roomName,
        isPrivate: tempRoom.isPrivate,
        permissions: tempRoom.permissions,
        description: tempRoom.description,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    if (updatedRoom?.success) {
      const updatedRooms = rooms.map((r) =>
        r._id === updatedRoom.room._id ? updatedRoom.room : r
      );
      dispatch(setRooms(updatedRooms));
    }
  }, [updatedRoom, rooms, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Couldn't update the room", error);
    }
  }, [error]);

  const handleChange = (field, value) => {
    setTempRoom((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionsChange = (field, value) => {
    setTempRoom((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-4 m-2 border rounded shadow-sm bg-white">
      <div>
        <label>Room Name</label>
        <input
          type="text"
          value={tempRoom.roomName}
          onChange={(e) => handleChange("roomName", e.target.value)}
        />
      </div>
      <div>
        <label>Private</label>
        <input
          type="checkbox"
          checked={tempRoom.isPrivate}
          onChange={(e) => handleChange("isPrivate", e.target.checked)}
        />
      </div>
      <div>
        <label>Chat</label>
        <input
          type="checkbox"
          checked={tempRoom.permissions.chat}
          onChange={(e) => handlePermissionsChange("chat", e.target.checked)}
        />
      </div>
      <div>
        <label>Video Call</label>
        <input
          type="checkbox"
          checked={tempRoom.permissions.videoCall}
          onChange={(e) =>
            handlePermissionsChange("videoCall", e.target.checked)
          }
        />
      </div>
      <div>
        <label>Audio Call</label>
        <input
          type="checkbox"
          checked={tempRoom.permissions.audioCall}
          onChange={(e) =>
            handlePermissionsChange("audioCall", e.target.checked)
          }
        />
      </div>
      <div>
        <label>Play List</label>
        <input
          type="checkbox"
          checked={tempRoom.permissions.playList}
          onChange={(e) =>
            handlePermissionsChange("playList", e.target.checked)
          }
        />
      </div>
      <div>
        <label>Player</label>
        <input
          type="checkbox"
          checked={tempRoom.permissions.player}
          onChange={(e) => handlePermissionsChange("player", e.target.checked)}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={tempRoom.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      <button onClick={handleUpdateRoom}>
        {isLoading ? "Updating..." : "Update Room"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
