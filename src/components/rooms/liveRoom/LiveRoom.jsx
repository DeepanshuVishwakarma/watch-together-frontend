import React from "react";
import { useParams } from "react-router-dom";

export default function LiveRoom({ liveRoomData }) {
  // is component par aap , roomcard me "GoLive" ,agar roomcreator ho to,  ya "JoinLive"  ,agar user or admint ho to , ki button par click karke pahuch sakte hai
  // room ka validation bhi backend me room:"Join/goLive" even ke andar hogi ,  agar response success hai
  // to navgiage(`room/:${roomId}`) ;

  //live room data must provide information about the romo :
  // createdBy , current users , these fields are inside backend which we are creating on GoLive , rooms = {roomId : {data}}
  // apart from this , thhis component will collect the roomInformation which is inside redux state.appData.rooms

  const room = rooms.find((room) => room._id == roomId); // or use method some for matching Mongoose ObjectId;
  const token = useSelector((state) => state?.authUser?.token);
  const { id } = useParam();

  return <div></div>;
}
