import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocketEmit } from "../../hooks/useSocketEmit";
import { useSocket } from "../../socket/SocketProvider";
import {
  setFriendRequestAccepting,
  setDeletingFriendRequest,
  setFriendRequestAccepted,
  setRecievedFriendRequest,
  unsetRecievedFriendRequest,
} from "../../store/reducers/user";
import { setSearchUserResults } from "../../store/reducers/appData";

export default function FriendRequest() {
  const user = useSelector((state) => state.User.user);
  const { searchUserResults } = useSelector((state) => state.appData);
  const appData = useSelector((state) => state.appData);
  const requests = user?.requestFrom || [];
  useEffect(() => {
    console.log(searchUserResults, appData);
  }, [appData]);
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const {
    emit: emitDeleteFriendReq,
    isLoading: isLoadingDeleteFriendReq,
    response: responseDeleteFriendReq,
    error: errorDeleteFriendReq,
  } = useSocketEmit();

  const {
    emit: emitAcceptFriendReq,
    isLoading: isLoadingAcceptFriendReq,
    response: responseAcceptFriendReq,
    error: errorAcceptFriendReq,
  } = useSocketEmit();

  const handleDeleteFriendReq = (id) => {
    emitDeleteFriendReq("deleteFriendReq", id, (response) => {
      if (response.success) {
        console.log(response);
        const data = response?.data;
        if (data && data._id) dispatch(setDeletingFriendRequest(data));
      } else {
        console.error(response.message);
      }
    });
  };

  const handleAcceptFriendReq = (id) => {
    emitAcceptFriendReq("acceptFriendReq", id, (response) => {
      if (response.success) {
        console.log(response.message);
        const data = response.data;
        data && data._id && dispatch(setFriendRequestAccepting(data));
      } else {
        console.error(response.message);
      }
    });
  };

  useEffect(() => {
    socket?.on("friend-request-accepted", (data) => {
      console.log("friend-request-accepted", data);
      if (data && data._id) {
        dispatch(setFriendRequestAccepted(data));
        const updatedResults = searchUserResults?.map((result) => {
          return result._id.toString() === data._id.toString()
            ? {
                ...result,
                isRequest: false,
              }
            : result;
        });
        dispatch(setSearchUserResults(updatedResults));
      } else {
        console.error("dataId is not available");
      }
    });

    socket?.on("friend-request-deleted", (data) => {
      console.log("friend-request-deleted event received", data);

      if (data && data._id) {
        console.log("Data ID is available:", data._id);

        if (searchUserResults) {
          console.log("searchUserResults before update:", searchUserResults);

          const updatedResults = searchUserResults.map((result) => {
            return result._id.toString() === data._id.toString()
              ? {
                  ...result,
                  isRequest: false,
                }
              : result;
          });

          console.log("Updated Results:", updatedResults);
          dispatch(setSearchUserResults(updatedResults));
        } else {
          console.error("searchUserResults is undefined");
        }
      } else {
        console.error("dataId is not available");
      }
    });

    // these are called inside search user
    socket?.on("friend-request", (data) => {
      if (data && data._id) {
        dispatch(setRecievedFriendRequest(data));
      } else {
        console.error("dataId is not available");
      }

      console.log("friend-request", data);
    });

    socket?.on("friend-request-unsend", (data) => {
      if (data && data._id) {
        dispatch(unsetRecievedFriendRequest(data));
      } else {
        console.error("dataId is not available");
      }

      console.log("friend-request-unsend", data);
    });

    return () => {
      socket?.off("friend-request-unsend");
      socket?.off("friend-request-accepted");
      socket?.off("friend-request-deleted");
      socket?.off("friend-request");
    };
  }, [socket, dispatch]);

  return (
    <div>
      <div>Friend Requests</div>
      {requests &&
        requests.length > 0 &&
        requests.map((request) => (
          <div key={request._id}>
            <div>{request.firstName}</div>
            <div>{request.lastName}</div>
            <div>{request.isActive ? "online" : "offline"}</div>
            {isLoadingAcceptFriendReq ? (
              <div>Loading...</div>
            ) : (
              <button onClick={() => handleAcceptFriendReq(request._id)}>
                Accept
              </button>
            )}
            {isLoadingDeleteFriendReq ? (
              <div>Loading...</div>
            ) : (
              <button onClick={() => handleDeleteFriendReq(request._id)}>
                Delete
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
