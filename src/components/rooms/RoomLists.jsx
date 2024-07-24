import React, { useEffect, useState } from "react";
// import { rooms as seed_rooms } from "../../seeders/rooms";
import RoomCard from "./RoomCard";
import { roomEndPoints } from "../../service/apis";
import { useDispatch, useSelector } from "react-redux";
import { setRooms } from "../../store/reducers/appData";
import useHttp from "../../hooks/useHttp";
import CreateNewRoom from "./CreateNewRoom";
import { CreateRoomButton } from "./RoomButtons";
import { useSocket } from "../../socket/SocketProvider";

export default function RoomLists() {
  const dispatch = useDispatch();

  // create room
  console.log("ROOMLIST COMPONENT IS BEING RENDERED");
  // get all rooms   // ------------------ //
  const token = useSelector((state) => state?.authUser?.token);
  const rooms = useSelector((state) => state?.appData?.rooms);
  const {
    isLoading: isLoadingAllRooms,
    error: isErrorAllRooms,
    data: dataAllRooms,
    sendRequest: sendRequestAllRooms,
    setError: setErrorAllRooms,
  } = useHttp();

  useEffect(() => {
    console.log("callinjg api to get all rooms");
    sendRequestAllRooms({
      url: `${roomEndPoints.GET_ALL_ROOM_URL}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  useEffect(() => {
    if (dataAllRooms?.rooms) {
      console.log("Rooms", dataAllRooms?.rooms);
      //   dispatch(setRooms(dataAllRooms?.rooms));
      dispatch(setRooms(dataAllRooms.rooms)); // for testing purposes
    }
  }, [dataAllRooms]);
  useEffect(() => {
    if (isErrorAllRooms) {
      console.error("Couldn't fetch allrooms", dataAllRooms);
    }
  }, [isLoadingAllRooms]);

  // ------------------ //

  const [createdByUser, setCreatedByUser] = useState([]);
  const [joinedByUser, setJoinedByUser] = useState([]);
  const [liveRooms, setLiveRooms] = useState([]);
  const [nonLiveRooms, setNonLiveRooms] = useState([]);
  const [sortedRooms, setSortedRooms] = useState([]);

  useEffect(() => {
    let cu = [];
    let ju = [];
    let lr = [];
    let nlr = [];
    let sr = [];

    rooms.forEach((room) => {
      console.log("room ", room);
      if (room.isCreatedByUser) {
        cu.push(room);
      }
      if (
        room.isJoined &&
        !nlr.includes(room) &&
        !nlr.includes(room) &&
        !cu.includes(room)
      ) {
        ju.push(room);
      }
      if (
        room.isLive &&
        !ju.includes(room) &&
        !cu.includes(room) &&
        !nlr.includes(room)
      ) {
        lr.push(room);
      }
      if (!lr.includes(room) && !ju.includes(room) && !cu.includes(room)) {
        nlr.push(room);
      }
    });

    sr = [...lr, ...nlr];

    setCreatedByUser(cu);
    setJoinedByUser(ju);
    setLiveRooms(lr);
    setNonLiveRooms(nlr);
    setSortedRooms(sr);
  }, [rooms]);

  // Now use sortedRooms as needed

  // const createdByUser = rooms?.filter((room) => room.isCreatedByUser);
  // const joinedByUser = rooms?.filter(
  //   (room) => room.isJoined && !createdByUser.includes(room)
  // );
  // const liveRooms = rooms
  //   .filter((room) => room.isLive )
  //   .sort((a, b) => b.usersCount - a.usersCount);

  // const nonLiveRooms = joinedByUser
  //   .filter((room) => !room.isLive)
  //   .sort((a, b) => b.usersCount - a.usersCount);

  // const sortedRooms = [...liveRooms, ...nonLiveRooms];
  // console.log(sortedRooms, nonLiveRooms, liveRooms);

  // socket events are here

  // ------------------ //

  return (
    <div className="p-4 ">
      <div className="mb-4 flex flex-row">
        <h3 className="text-xl font-bold mb-2 text-blue-600">Created By You</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "20px",
            flexWrap: "wrap",
            justifyContent: "space-between",
            // alignItems: "space-between",
          }}
          className="flex "
        >
          <CreateNewRoom />
          {createdByUser.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Joined By You</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "20px",
            // justifyContent: "space-between",
            // alignItems: "space-between",
            flexWrap: "wrap",
          }}
          className=" flex flex-row "
        >
          {joinedByUser.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Live</h3>
        <div
          className="flex"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "20px",
            flexWrap: "wrap",
            // alignItems: "space-between",
          }}
        >
          {sortedRooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}
