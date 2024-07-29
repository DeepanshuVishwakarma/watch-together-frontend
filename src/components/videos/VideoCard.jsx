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
  console.log("inside vid card component", video);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const playerRef = useRef(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
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
      <div className="video-player-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={videoURL}
          playing={isPlaying}
          controls={false} // Disable default controls to use custom ones
          width="100%"
          height="100%"
        />
        <div className="custom-controls">
          <VideoPlayButton onClick={handlePlayPause} isPlaying={isPlaying}>
            Play the video{" "}
          </VideoPlayButton>
          {/* <VideoLikeButton onClick={handleLike} isLiked={isLiked} ></VideoLikeButton>
          <VideoRatingButton
            onRate={handleRating}
            currentRating={currentRating}
          ></VideoRatingButton>
          <VideoAddToPlayListButton onClick={handleAddToPlaylist} ></VideoAddToPlayListButton>
          <VideoRemoveFromPlayListButton onClick={handleRemoveFromPlaylist} ></VideoRemoveFromPlayListButton> */}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
