import { useDispatch, useSelector } from "react-redux";
import { AcceptRequestButton, DeleteRequestButton } from "./RoomButtons";
import { useSocketEmit } from "../../hooks/useSocketEmit";

export default function RoomRequests({ _id: roomId }) {
  const { rooms } = useSelector((state) => state?.appData) || [];
  const room = rooms.find((room) => room?._id === roomId);

  const requests = room.requests;
  const dispatch = useDispatch();

  const {
    emit: emitAcceptUser,
    isLoading: isLoadingAcceptUser,
    response: acceptUserResponse,
    error: isErrorAcceptUser,
  } = useSocketEmit();

  const handleAcceptRequest = (requestId) => {
    emitAcceptUser("room:acceptReq", { roomId, requestId }, (response) => {
      if (response.success) {
        const tempRoom = {
          ...room,
          users: acceptUserResponse.data,
        };
        dispatch(setOneRooms(tempRoom));
      }
      console.log(response.message);
    });
  };
  const handleDeleteRequest = () => {
    alert("delteing user request");
  };
  console.log("room", room, "rquest", room.requests);
  return (
    <div
      style={{ padding: "5px", border: "1px solid #ddd", borderRadius: "5px" }}
    >
      <p>Room Requests</p>

      {requests?.length > 0 && (
        <div
          style={{ marginBottom: "10px", fontWeight: "bold", color: "#00c8ff" }}
        >
          {requests.map((request, index) => (
            <div>
              <div key={request._id + index} style={{ marginLeft: "10px" }}>
                {request.firstName} {request.lastName}
              </div>

              <AcceptRequestButton
                onClick={() => handleAcceptRequest(request._id)}
              >
                {isLoadingAcceptUser ? "Loading" : "accpet"}
              </AcceptRequestButton>
              <DeleteRequestButton
                onClick={() => {
                  handleDeleteRequest();
                }}
              >
                Delete
              </DeleteRequestButton>
            </div>
          ))}
        </div>
      )}
      {isErrorAcceptUser && <p>{accpetUserResponse?.message}</p>}
    </div>
  );
}
