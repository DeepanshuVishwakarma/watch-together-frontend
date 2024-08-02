import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/lazy";

import {
  UpdateVideoButton,
  DeleteVideoButton,
  VideoPlayButton,
  VideoLikeButton,
  VideoRatingButton,
  VideoAddToPlayListButton,
  VideoRemoveFromPlayListButton,
} from "./VideoButtons";
import { useDispatch, useSelector } from "react-redux";
import {
  setRoomVideoPlayerData,
  setVideoPlayerData,
} from "../../store/reducers/appData";
import { useLocation } from "react-router-dom";

function VideoCard({ video }) {
  const {
    name,
    isPrivate,
    videoDescription,
    videoURL,
    uploadedBy,
    tags,
    likes,
    ratings,
  } = video;
  // console.log("inside vid card component", video);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const playerRef = useRef(null);
  const location = useLocation();
  const videoPlayerData = useSelector((state) => state.appData.videoPlayerData);
  const roomVideoPlayerData = useSelector(
    (state) => state.appData.roomVideoPlayerData
  );
  const dispatch = useDispatch();

  const isRoomPage = () => {
    return location.pathname.includes("room");
  };

  const handlePlay = () => {
    if (isRoomPage()) {
      roomVideoPlayerData &&
      roomVideoPlayerData?._id.toString() === video._id.toString()
        ? alert("video is already being played")
        : dispatch(setRoomVideoPlayerData(video));
    }
    dispatch(setVideoPlayerData(video));
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add your like logic here
  };

  const handleRating = (rating) => {
    setCurrentRating(rating);
    // Add your rating logic here
  };

  const handleAddToPlaylist = () => {
    // Add your add to playlist logic here
  };

  const handleRemoveFromPlaylist = () => {
    // Add your remove from playlist logic here
  };

  return (
    <div className="video-card">
      <h3>{name}</h3>
      <p>{videoDescription}</p>

      {/* <ReactPlayer
          ref={playerRef}
          url={videoURL}
          playing={isPlaying}
          controls={false} // disable default controls to use custom ones
          width="100%"
          height="100%"
        /> */}

      <VideoPlayButton onClick={handlePlay} isPlaying={isPlaying}>
        Play the video
      </VideoPlayButton>
    </div>
  );
}

export default VideoCard;
