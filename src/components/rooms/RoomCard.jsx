import React, { useEffect, useState, useRef } from "react";
import {
  DeleteRoomButton,
  GoLiveButton,
  JoinLiveButton,
  UpdateRoomButton,
  SendRequestButton,
  EndLiveButton,
  RequestsRoomButton,
} from "./RoomButtons";
import Button from "../UI/Button";
import useHttp from "../../hooks/useHttp";
import { roomEndPoints, SOCKET_URL } from "../../service/apis";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { useSocket } from "../../socket/SocketProvider";
import RoomUsersPopover from "./room-users/RoomUsersPopover";
import RoomUsers from "./room-users/RoomUsers";
import { useNavigate } from "react-router-dom";
import { setLiveRoom, setOneRooms } from "../../store/reducers/appData";
import { useSocketEmit } from "../../hooks/useSocketEmit";
import UpdateRoom from "./UpdateRoom";
import RoomRequests from "./RoomRequests";

const RoomCard = ({ room }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.authUser.token);
  // const { rooms } = useSelector((state) => state?.appData) || [];
  // const room = rooms.find((room) => room?._id === roomId);
  const {
    _id,
    roomName,
    isLive,
    isPrivate,
    permissions,
    description,
    isJoined,
    isCreatedByUser,
    isAdmin,
    isRequested,
  } = room;

  const { isDeleteLoading, errorDelete, deleteData, sendDeleteRequest } =
    useHttp();

  // http request for different actions

  const { isUpdateLoading, errorUpdate, updatedata, sendUpdateRequest } =
    useHttp();
  // delete request
  const handleDeleteRoom = async () => {
    await sendDeleteRequest({
      url: `${roomEndPoints.DELETE_ROOM_URL}/${_id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  useEffect(() => {
    if (deleteData?.success) {
      console.log("Rooms", deleteData?.data);

      //   dispatch(setRooms(deleteData?.rooms));
      // dispatch(setRooms(deleteData.rooms)); // for testing purposes
    }
  }, [deleteData]);
  useEffect(() => {
    if (errorDelete) {
      console.error("Couldn't fetch allrooms", errorDelete);
    }
  }, [isDeleteLoading]);

  // socket requests are here

  const {
    emit: emitGoLive,
    isLoading: isGoLiveLoading,
    response: goLiveResponse,
    error: goLiveError,
  } = useSocketEmit();

  const handleGoLive = () => {
    emitGoLive("room:goLive", _id, (response) => {
      if (response.success) {
        dispatch(setLiveRoom(response?.data));
      }
      console.log(response?.message);
    });
  };

  const {
    emit: emitEndLive,
    isLoading: isEndLiveLoading,
    response: endLiveResponse,
    error: endLiveError,
  } = useSocketEmit();

  const handleEndLive = () => {
    emitEndLive("room:endLive", _id, (response) => {
      if (response?.success) {
        dispatch(setLiveRoom(response?.data));
      }
      console.log(response?.message);
    });
  };

  const {
    emit: emitJoinLive,
    isLoading: isJoinLiveLoading,
    response: joinLiveResponse,
    error: joinLiveError,
  } = useSocketEmit();

  const handleJoinLive = () => {
    emitJoinLive("room:join", _id, (response) => {
      if (response?.success) {
        dispatch(setLiveRoom(response?.data));
        navigate(`room/${_id}`);
      }
      console.log(response?.message);
    });
  };

  const {
    emit: emitSendJoinReq,
    isLoading: isSendJoinReqLoading,
    response: sendJoinReqResponse,
    error: sendJoinReqError,
  } = useSocketEmit();

  const handleSendJoinReq = () => {
    emitSendJoinReq("room:sendJoinReq", _id, async (response) => {
      if (response?.success) {
        let tempRoom = {
          ...room,
        };
        if (response.state === "requested") {
          tempRoom[users] = response.data;
        } else if (response.state === "joined") {
          tempRoom[isRequested] = false;
        }
        dispatch(setOneRooms(tempRoom));
      }
    });
  };

  const {
    emit: emitUnsendJoinReq,
    isLoading: isUnsendJoinReqLoading,
    response: unSendJoinReqResponse,
    error: unsendJoinReqError,
  } = useSocketEmit();
  const handleUnsendJoinReq = () => {
    emitUnsendJoinReq("room:unsendJoinReq", room._id, (response) => {
      if (response.success) {
        const tempRoom = {
          ...room,
          isRequested: false,
        };
        dispatch(setOneRoom(tempRoom));
      }
    });
  };

  return (
    <div
      className="p-4 m-2 border rounded shadow-sm bg-white"
      style={{ padding: "5px", borderRadius: "5px", margin: "0px" }}
    >
      <div className="text-lg font-bold">{roomName}</div>
      <div className="text-sm">{isLive ? "Live" : "Not Live"}</div>
      <div className="text-sm">{isPrivate ? "Private" : "Public"}</div>
      <div className="text-sm">{description}</div>

      <div className="mt-2">
        <p>permissions</p>
        <ul>
          <p>chat : {permissions?.chat ? "All Users" : "Admins only"}</p>
          <p>
            videoCall : {permissions?.videoCall ? "All Users" : "Admins only"}
          </p>
          <p>
            audioCall : {permissions?.audioCall ? "All Users" : "Admins only"}
          </p>
          <p>
            playList : {permissions?.playList ? "All Users" : "Admins only"}
          </p>
          <p>player : {permissions?.player ? "All Users" : "Admins only"}</p>
        </ul>
      </div>

      {isCreatedByUser && (
        <div className="mt-2">
          <RoomUsersPopover
            trigger={<UpdateRoomButton>Update</UpdateRoomButton>}
          >
            <UpdateRoom _id={_id} />
          </RoomUsersPopover>

          <RoomUsersPopover
            trigger={<RequestsRoomButton>Requests</RequestsRoomButton>}
          >
            <RoomRequests _id={_id} />
          </RoomUsersPopover>
          <DeleteRoomButton onClick={handleDeleteRoom}>
            {isDeleteLoading ? "loading" : "Delete"}
          </DeleteRoomButton>

          {isLive ? (
            <EndLiveButton onClick={handleEndLive}>
              {isEndLiveLoading ? "Loading" : "End Live"}
            </EndLiveButton>
          ) : (
            <GoLiveButton onClick={handleGoLive}>
              {isGoLiveLoading ? "loading" : "Go Live"}
            </GoLiveButton>
          )}
        </div>
      )}
      {isJoined && isAdmin && (
        <div className="mt-2">
          <RoomUsersPopover trigger={<Button>Users</Button>}>
            <RoomUsers _id={_id} />
          </RoomUsersPopover>
        </div>
      )}
      {isJoined && !isCreatedByUser && (
        <div className="mt-2">
          <JoinLiveButton onClick={handleJoinLive}>
            {isJoinLiveLoading ? "Loading" : "Join Live"}
          </JoinLiveButton>
        </div>
      )}
      {room.isPrivate && !room.isJoined && (
        <div className="mt-2">
          {room.isRequested ? (
            <div>
              <div>Request Sent</div>
              <UnsendRequestButton onClick={handleUnsendJoinReq}>
                {isUnsendJoinReqLoading ? "Loading" : "Unsend Request"}
              </UnsendRequestButton>
            </div>
          ) : (
            <SendRequestButton onClick={handleSendJoinReq}>
              {isSendJoinReqLoading ? "Loading" : "Send Request"}
            </SendRequestButton>
          )}
        </div>
      )}
      {!isPrivate && !isJoined && (
        <div className="mt-2">
          {!room.isCreatedByUser && (
            <JoinLiveButton onClick={handleJoinLive}>
              {isJoinLiveLoading ? "Loading" : "Join Live"}
            </JoinLiveButton>
          )}
          {isRequested ? (
            <div>Request Sent</div>
          ) : (
            <SendRequestButton onClick={handleSendJoinReq}>
              {isSendJoinReqLoading ? "Loading" : "Send Request"}
            </SendRequestButton>
          )}
        </div>
      )}
      <div>
        {goLiveError && goLiveResponse?.message && (
          <p>{goLiveResponse?.message}</p>
        )}
        {endLiveError && endLiveResponse?.message && (
          <p>{endLiveResponse?.message}</p>
        )}
        {sendJoinReqError && sendJoinReqResponse?.message && (
          <p>{sendJoinReqResponse?.message}</p>
        )}
        {joinLiveError && joinLiveResponse?.message && (
          <p>{joinLiveResponse?.message}</p>
        )}
        {unsendJoinReqError && unSendJoinReqResponse?.message && (
          <p>{unSendJoinReqResponse?.message}</p>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
