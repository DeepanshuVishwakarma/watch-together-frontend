import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { useLocation } from "react-router-dom";
import { IconButton, Slider, Box, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import SpeedIcon from "@mui/icons-material/Speed";
import { useDispatch, useSelector } from "react-redux";
import { useSocketEmit } from "../../hooks/useSocketEmit";
import { useSocket } from "../../socket/SocketProvider";
import {
  setRoomVideoPlayerData,
  setSync,
  setVideoPlayerData,
} from "../../store/reducers/appData";

const VideoPlayer = () => {
  // console.log("videoPlayer called");

  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const { socket } = useSocket();
  const { emit: emitVideoEvent } = useSocketEmit();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoChanged, setIsVideoChanged] = useState(false);

  const videoPlayerData = useSelector((state) => state.appData.videoPlayerData);
  const roomVideoPlayerData = useSelector(
    (state) => state.appData.roomVideoPlayerData
  );
  const sync = useSelector((state) => state.appData.sync);
  const liveRoom = useSelector((state) => state.appData.liveRoom);
  const rooms = useSelector((state) => state.appData.rooms);
  const user = useSelector((state) => state.User.user);

  const video = location.pathname.includes("room")
    ? roomVideoPlayerData
    : videoPlayerData;

  useEffect(() => {
    videoRef.current = video;
  }, [video]);

  const roomId = liveRoom && liveRoom?._id;

  const isRoomPage = () => location.pathname.includes("room");
  const isCreator = () =>
    rooms.find((room) => room._id === roomId)?.createdBy === user._id;
  const isAdmin = () =>
    rooms.find((room) => room._id === roomId)?.admins.includes(user._id);

  const handlePlayPause = () => {
    const togglePlayPause = (shouldEmit = false) => {
      console.log("togglePlayPause");
      setIsPlaying(!isPlaying);
      if (shouldEmit) {
        console.log("emitting playPause");
        emitVideoEvent(
          "video:playPause",
          { isPlaying: !isPlaying, roomId },
          (response) => {
            if (!response.success) {
              console.error(response);
            }
          }
        );
      }
    };

    const canControlPlayback = () => isCreator() || hasPermission("player");

    if (isRoomPage()) {
      if (isCreator()) {
        togglePlayPause(true);
        console.log("creator");
      } else if (canControlPlayback()) {
        if (sync) {
          console.log("here");
          togglePlayPause(true);
        } else {
          console.log("here");
          togglePlayPause();
        }
      } else if (!hasPermission("player") && !sync) {
        togglePlayPause();
      }
    }
    // else {
    //   togglePlayPause();
    // }
  };

  const handleVolumeChange = (event, newValue) =>
    setVolume(Number(newValue) * 0.01);
  const handlePlaybackRateChange = (event, newValue) =>
    setPlaybackRate(Number(newValue) * 0.01);
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      playerRef.current.wrapper.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleCancelVideoPlayer = () => {
    isRoomPage()
      ? dispatch(setRoomVideoPlayerData(null))
      : dispatch(setVideoPlayerData(null));
  };

  const hasPermission = (permission) => {
    if (!roomId) return false;
    const room = rooms.find((room) => room._id === roomId);
    if (!room) return false;
    if (room.permissions[permission]) return true;
    if (user) {
      const admins = (room && room?.admins) || [];
      return admins?.includes(user?._id);
    }
  };

  const handleSync = () => {
    if (!sync) {
      emitVideoEvent("video:perfect-sync", roomId, (response) => {
        if (response.success) {
          setIsPlaying(response.data.isPlaying);
          playerRef.current.seekTo(response.data.seekTime);
        }
      });
    }
    dispatch(setSync(!sync));
    console.log("handle sync", sync);
  };

  useEffect(() => {
    if (
      isCreator() &&
      roomVideoPlayerData &&
      roomVideoPlayerData?._id &&
      roomId &&
      !isVideoChanged
    ) {
      console.log("emitting event for change video");
      const videoId = roomVideoPlayerData._id;
      setIsVideoChanged(true);
      emitVideoEvent(
        "video:change",
        {
          roomId,
          videoId,
        },
        (response) => {
          if (response.error) {
            console.error(response);
          } else {
            setIsVideoChanged(false); // Reset the state after a successful emit
          }
        }
      );
    }
  }, [roomVideoPlayerData]);

  useEffect(() => {
    if (isRoomPage()) {
      socket.on("video:changed", (roomData) => {
        console.log("video:changed event received", roomData);
        const currentVideoId = roomData.currentVideo._id.toString();
        const playerVideoId = videoRef.current?._id.toString(); // Use ref to get the current video
        console.log(currentVideoId, videoRef.current);
        if (currentVideoId === playerVideoId) {
          console.log("The IDs are equal.");
        } else {
          console.log("The IDs are not equal.");
          dispatch(setRoomVideoPlayerData(roomData.currentVideo));
        }
      });

      socket.on("video:get-sync-details", (data, callback) => {
        console.log("video:get-sync-details event received", data);
        try {
          const syncVideoDetails = {
            isPlaying: playerRef.current.getInternalPlayer().paused === false, // Assuming getInternalPlayer returns the underlying video element
            seekTime: playerRef.current.getCurrentTime(),
            playbackRate: playerRef.current.getInternalPlayer().playbackRate,
          };
          console.log("Sync video details:", syncVideoDetails);
          callback({ success: true, data: syncVideoDetails });
        } catch (error) {
          console.error("Error getting sync details:", error);
          callback({ success: false, message: "Error getting sync details" });
        }
      });

      socket.on("video:playPause", (data) => {
        // listen to this only  if you sync option is on
        console.log("video:playPause event received", data, sync, isCreator());
        const togglePlayPause = () => {
          if (data.userId.toString() === user._id) {
            return;
          } else {
            setIsPlaying(data.isPlaying);
          }
        };
        if (isCreator()) {
          togglePlayPause();
        }
        if (!isCreator() && sync) {
          togglePlayPause();
        }
      });

      return () => {
        socket.off("video:changed");
        socket.off("video:get-sync-details");
        socket.off("video:playPause");
      };
    }
  }, [socket, sync]);

  useEffect(() => {
    console.log("sync", sync);
  }, [sync]);
  const renderControls = () => {
    const isDisabled = sync && !hasPermission("player");
    return (
      <>
        <IconButton onClick={handlePlayPause} disabled={isDisabled}>
          {isPlaying ? (
            <PauseIcon style={{ color: "#1976d2" }} />
          ) : (
            <PlayArrowIcon style={{ color: "#1976d2" }} />
          )}
        </IconButton>
        <Slider
          style={{ color: "#1976d2" }}
          value={volume * 100}
          onChange={handleVolumeChange}
          aria-labelledby="volume-slider"
          sx={{ width: 100 }}
        />
        <VolumeUpIcon style={{ color: "#1976d2" }} />
        <IconButton onClick={toggleFullscreen} disabled={isDisabled}>
          <FullscreenIcon style={{ color: "#1976d2" }} />
        </IconButton>
        <Slider
          value={playbackRate * 100}
          min={50}
          max={200}
          step={10}
          onChange={handlePlaybackRateChange}
          aria-labelledby="playback-rate-slider"
          sx={{ width: 100 }}
          disabled={isDisabled}
        />
        <SpeedIcon style={{ color: "#1976d2" }} />
      </>
    );
  };

  return video && video?.videoURL ? (
    <Box sx={{ position: "relative" }}>
      <ReactPlayer
        ref={playerRef}
        url={video?.videoURL}
        playing={isPlaying}
        volume={volume}
        playbackRate={playbackRate}
        controls={false}
        width="100%"
        height="100%"
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {renderControls()}
      </Box>
      <button onClick={handleCancelVideoPlayer}>Cancel</button>
      {!isCreator() && (
        <button onClick={handleSync}>
          {sync ? "Sync is on" : "Sync is off"}
        </button>
      )}
    </Box>
  ) : null;
};

export default VideoPlayer;
