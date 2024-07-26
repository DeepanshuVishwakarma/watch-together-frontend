import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { KickUserButton } from "../RoomButtons";
import { setOneRooms } from "../../../store/reducers/appData";
import useHttp from "../../../hooks/useHttp";
import { roomEndPoints } from "../../../service/apis";
import RoomLists from "../RoomLists";

export default function RoomUsers({ _id: roomId }) {
  const token = useSelector((state) => state.authUser.token);
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.appData.rooms) || [];

  const room = rooms.find((room) => room?._id === roomId);

  const isCreator = room.isCreatedByUser;
  const isAdmin = room.isAdmin;
  const creator = room.users.find((user) => user._id === room.createdBy);
  const admins = room.users.filter(
    (user) => room.admins.includes(user._id) && user._id !== room.createdBy
  );
  const users = room.users.filter(
    (user) => !room.admins.includes(user._id) && user._id !== room.createdBy
  );

  // useEffect(() => {
  //   if (room?.users) {
  //     const updatedRoomUsers = {
  //     };
  //     setRoomUsers(updatedRoomUsers);
  //   }
  // }, [room]);

  useEffect(() => {
    if (room.users) {
      console.log("room", room);
      console.log(isCreator, isAdmin, creator, admins, users);
    }
  }, [room]);

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
      dispatch(setOneRooms(dataKickUser.data));
    } else if (isErrorKickUser) {
      console.error("Couldn't fetch all rooms", isErrorKickUser);
    }
  }, [dataKickUser, isErrorKickUser]);

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
      {admins.length > 0 && (
        <div
          style={{ marginBottom: "10px", fontWeight: "bold", color: "#00c8ff" }}
        >
          <div>Admins:</div>
          {admins.map((admin) => (
            <div key={admin._id}>
              <div style={{ marginLeft: "10px" }}>
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
      {users.length > 0 && (
        <div style={{ color: "#ff006f" }}>
          <div>Users:</div>
          {users.map((user) => (
            <div key={user._id}>
              <div style={{ marginLeft: "10px" }}>
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
