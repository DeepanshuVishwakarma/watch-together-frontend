// hello chatgpt , now i am going to work on playing videos ,
// so tell me one thing ,
// when i am importing any react video player  or simple video tag , can i change those buttons with my own buttons ??
// suppose i want to have a diff vid button then ?? and also suppose i want to place it somewhere else , can i do it ?

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../hooks/useHttp";
import { videoEndPoints } from "../../service/apis";
import { setVideos } from "../../store/reducers/appData";
import VideoCard from "./VideoCard";

export default function VideoList() {
  const dispatch = useDispatch();

  // console.log("VideoLIST COMPONENT IS BEING RENDERED");

  const token = useSelector((state) => state?.authUser?.token);
  const videos = useSelector((state) => state?.appData?.videos) || [];
  console.log(videos);

  const {
    isLoading: isLoadingAllVideos,
    error: isErrorAllVideos,
    data: dataAllVideos,
    sendRequest: sendRequestAllVideos,
    setError: setErrorAllVideos,
  } = useHttp();

  useEffect(() => {
    // console.log("callinjg api to get all rooms");
    sendRequestAllVideos({
      url: `${videoEndPoints.GET_ALL_VIDEOS_URL}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);
  useEffect(() => {
    console.log("callinjg api to get all videos");
    if (dataAllVideos?.success) {
      console.log("all-videos", dataAllVideos.data);
      dispatch(setVideos(dataAllVideos.data));
    }
    if (isErrorAllVideos) {
      console.log(dataAllVideos?.message);
    }
  }, [isLoadingAllVideos]);

  return (
    <div>
      {videos?.length &&
        videos.map((vid) => {
          return <VideoCard key={vid._id} video={vid} />;
        })}
    </div>
  );
}
