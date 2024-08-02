import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocketEmit } from "../../hooks/useSocketEmit";
import { userEndpoints } from "../../service/apis";
import useHttp from "../../hooks/useHttp";
import { useSocket } from "../../socket/SocketProvider";
import {
  setOneSearchRequest,
  setSearchUserResults,
} from "../../store/reducers/appData";

export default function SearchUser() {
  const { user } = useSelector((state) => state.User);
  const { token } = useSelector((state) => state.authUser);
  const { searchUserResults } = useSelector((state) => state.appData);

  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const { socket } = useSocket();

  const {
    emit: emitSendFriendRequest,
    isLoading: isLoadingSendFriendRequest,
    response: responseSendFriendRequest,
    error: errorSendFriendRequest,
  } = useSocketEmit();

  const {
    emit: emitUnsendFriendRequest,
    isLoading: isLoadingUnsendFriendRequest,
    response: responseUnsendFriendRequest,
    error: errorUnsendFriendRequest,
  } = useSocketEmit();

  const {
    isLoading: isLoadingSearchUser,
    error: isErrorSearchUser,
    data: dataSearchUser,
    sendRequest: sendRequestSearchUser,
    setError: setErrorSearchUser,
  } = useHttp();

  const handleSearch = () => {
    sendRequestSearchUser({
      url: `${userEndpoints.SEARCH_USER_BY_NAME_URL}/${name}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  useEffect(() => {
    if (dataSearchUser && dataSearchUser.success) {
      console.log(dataSearchUser.data);
      dispatch(setSearchUserResults(dataSearchUser.data));
    } else if (isErrorSearchUser) {
      console.log(isErrorSearchUser);
    }
  }, [isLoadingSearchUser]);

  const handleUnsendRequest = (id) => {
    emitUnsendFriendRequest("unsendFriendReq", id, (response) => {
      if (response.success) {
        console.log(response);
        dispatch(setOneSearchRequest(response.data));
      } else {
        console.error(response.message);
      }
    });
  };

  const handleSendRequest = (id) => {
    emitSendFriendRequest("sendFriendReq", id, (response) => {
      if (response.success) {
        console.log(response);
        dispatch(setOneSearchRequest(response.data));
      } else {
        console.error(response.message);
      }
    });
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <div>Search Users</div>
      <input
        type="text"
        name="search"
        placeholder="search"
        id="search"
        value={name}
        onChange={handleInputChange}
      />
      <button type="button" onClick={handleSearch}>
        Search
      </button>
      {searchUserResults &&
        searchUserResults.length > 0 &&
        searchUserResults.map((user) => (
          <div key={user._id}>
            <div>{user.firstName}</div>
            <div>{user.lastName}</div>
            {user.isRequested ? (
              isLoadingUnsendFriendRequest ? (
                <div>Loading...</div>
              ) : (
                <button onClick={() => handleUnsendRequest(user._id)}>
                  Unsend Request
                </button>
              )
            ) : isLoadingSendFriendRequest ? (
              <div>Loading...</div>
            ) : (
              <button onClick={() => handleSendRequest(user._id)}>
                Send Request
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
