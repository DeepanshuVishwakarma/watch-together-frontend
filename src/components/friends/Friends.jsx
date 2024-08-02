import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocketEmit } from "../../hooks/useSocketEmit";
import { useSocket } from "../../socket/SocketProvider";
import { deleteFriend } from "../../store/reducers/user";

export default function Friends() {
  const user = useSelector((state) => state.User.user);
  const friends = user?.friends || [];
  const isActive = user?.active || false;
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const {
    emit: emitDeleteFriend,
    isLoading: isLoadingDeleteFriend,
    response: responseDeleteFriend,
    error: errorDeleteFriend,
  } = useSocketEmit();

  const handleDeleteFriend = (id) => {
    console.log("user frriends", user?.friends, id);
    emitDeleteFriend("deleteFriend", id, (response) => {
      if (response.success) {
        // Update the redux state to remove the deleted friend
        console.log("friend-deleted", response);
        dispatch(deleteFriend(response.data));
      } else {
        console.error(response.message);
      }
    });
  };

  useEffect(() => {
    socket?.on("friend-deleted", (data) => {
      console.log("friend-deleted", data);
      data && data._id && dispatch(deleteFriend(data));
    });
  }, [socket, dispatch]);

  return (
    <div>
      <div>Friends</div>
      {friends &&
        friends.length > 0 &&
        friends.map((friend) => (
          <div key={friend._id}>
            <div>{friend.firstName}</div>
            <div>{friend.lastName}</div>
            <div>{isActive ? "online" : "offline"}</div>
            {isLoadingDeleteFriend ? (
              <div>Loading...</div>
            ) : (
              <button onClick={() => handleDeleteFriend(friend._id)}>
                Delete
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
