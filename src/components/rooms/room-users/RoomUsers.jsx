import React, { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { KickUserButton } from "../RoomButtons";
import { useSocket } from "../../../socket/SocketProvider";
import { setLiveRoom, setOneRooms } from "../../../store/reducers/appData";
import useHttp from "../../../hooks/useHttp";
import { roomEndPoints } from "../../../service/apis";

export default function RoomUsers({ _id: roomId }) {
  const token = useSelector((state) => state.authUser.token);

  const { rooms } = useSelector((state) => state?.appData) || [];
  const room = rooms.find((room) => room?._id === roomId);
  //   console.log(roomId, room, rooms);

  const creator = room?.users.find((user) => user._id === room?.createdBy);
  const admins = room?.users.filter(
    (user) => room?.admins.includes(user._id) && user._id !== room?.createdBy
  );
  const users = room?.users.filter(
    (user) => !room?.admins.includes(user._id) && user._id !== room?.createdBy
  );
  const isCreator = room?.isCreatedByUser;
  const isAdmin = room?.isAdmin;

  const dispatch = useDispatch();

  const {
    isLoading: isLoadingKickUser,
    error: isErrorKickUser,
    data: dataKickUser,
    sendRequest: sendRequestKickUser,
  } = useHttp();

  const handleKickUser = async (userId) => {
    await sendRequestKickUser({
      url: `${roomEndPoints.REMOVE_MEMBER_URL}/${roomId}/${userId}`,
      method: "POST",
      body: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  useEffect(() => {
    if (dataKickUser?.success) {
      console.log(dataKickUser?.message);

      const tempRoom = {
        ...room,
        users: dataKickUser?.data,
      };
      dispatch(setOneRooms(tempRoom));
    }
  }, [dataKickUser]);
  useEffect(() => {
    if (isErrorKickUser) {
      console.error("Couldn't fetch allrooms", isErrorKickUser);
    }
  }, [isLoadingKickUser]);

  return (
    <div
      style={{ padding: "5px", border: "1px solid #ddd", borderRadius: "5px" }}
    >
      <p>Room Users</p>
      {creator && (
        <div
          style={{ marginBottom: "10px", fontWeight: "bold", color: "#1eff00" }}
        >
          <div>
            {creator.firstName} {creator.lastName} (Creator)
          </div>
        </div>
      )}
      {admins?.length > 0 && (
        <div
          style={{ marginBottom: "10px", fontWeight: "bold", color: "#00c8ff" }}
        >
          <div>Admins:</div>
          {admins.map((admin) => (
            <div>
              <div key={admin._id} style={{ marginLeft: "10px" }}>
                {admin.firstName} {admin.lastName}
              </div>
              {isCreator && (
                <KickUserButton onClick={() => handleKickUser(admin._id)}>
                  {isLoadingKickUser ? "Loading" : "Kick"}
                </KickUserButton>
              )}
            </div>
          ))}
        </div>
      )}
      {users?.length > 0 && (
        <div style={{ color: "#ff006f" }}>
          <div>Users:</div>
          {users.map((user) => (
            <div>
              <div key={user._id} style={{ marginLeft: "10px" }}>
                {user.firstName} {user.lastName}
              </div>
              {isAdmin && (
                <KickUserButton onClick={() => handleKickUser(user._id)}>
                  {isLoadingKickUser ? "Loading" : "Kick"}
                </KickUserButton>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
