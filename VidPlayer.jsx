import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { useLocation } from "react-router-dom";
import { IconButton, Slider, Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import SpeedIcon from "@mui/icons-material/Speed";
import { useSocketEmit } from "../../hooks/useSocketEmit";
import { useSocket } from "../../socket/SocketProvider";
import { useDispatch } from "react-redux";
import {
  setRoomVideoPlayerData,
  setSync,
  setVideoPlayerData,
} from "../../store/reducers/appData";

function VideoPlayer() {
  const { videoPlayerData, roomVideoPlayerData } =
    useSelector((state) => state?.appData) || [];
  console.log(roomVideoPlayerData, videoPlayerData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const { emit: emitVideoEvent } = useSocketEmit();
  const location = useLocation();
  const sync = useSelector((state) => state.appData.sync) || [];
  const { socket, socketError } = useSocket();
  const dispatch = useDispatch();

  const isRoomPage = () => {
    return location.pathname.includes("room");
  };
  // perfect - sync   funtionality
  // call perfect sync even if sync button is  clicked ,
  const {
    emit: emitSync,
    isLoading: isSyncLoading,
    response: syncResponse,
    error: syncError,
  } = useSocketEmit();
  const {
    emit: emitVideoChange,
    isLoading: isVideoChange,
    response: videoChangeResponse,
    error: videoChangeError,
  } = useSocketEmit();

  const video = isRoomPage() ? roomVideoPlayerData : roomVideoPlayerData;

  useEffect(() => {
    if (roomVideoPlayerData) {
      const liveRoom = useSelector((state) => state.appData.liveRoom);
      const roomId = liveRoom._id;
      if (!roomId) {
        console.log("Room id is undefined");
      }

      const videoId = roomVideoPlayerData._id;
      emitVideoChange(
        "video:change",
        { roomId, roomVideoPlayerData_id },
        (response) => {
          console.log(response);

          if (response.error) {
            console.log("error changing video", error);
          }
        }
      );
    }
  }, [roomVideoPlayerData]);

  useEffect(() => {
    if (sync && isRoomPage()) {
      const syncVideoDetails = (details) => {
        setIsPlaying(details.isPlaying);
        playerRef.current.seekTo(details.seekTime);
        // setVolume(details.volume);
        // setPlaybackRate(details.playbackRate);
      };
      emitSync("video:perfect-sync", userId, (response) => {
        syncVideoDetails(response.data);
      });
    }
  }, [sync]);

  // play pause code
  const {
    emit: emitPlayPause,
    isLoading: isPlayPause,
    response: playPauseResponse,
    error: playPauseError,
  } = useSocketEmit();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    dispatch(setSync(false));
  };

  const hasPermission = (value) => {
    // expects a string value
    const perMissionOf = String(value);

    // call this function only when you are in live room
    const liveRoom = useSelector((state) => state.appData.liveRoom);
    const roomId = liveRoom?._id;

    // if roomId not found using liveRoom , then you are not in live room and u can't use this function
    if (roomId) {
      const rooms = useSelector((state) => state.appData.rooms) || [];
      const room = rooms.find((room) => room?._id === roomId);
      const permissionGrantedTo = room?.permissions?.perMissionOf;

      if (!permissionGrantedTo) {
        // if permissionGrantedTo == false , then only admins hasthepermission is granted

        // check if user is an admin or not
        const { user } = useSelector((state) => state.User);
        const userId = user._id;
        const isAdmin = room.admins.includes(userId);
        return isAdmin ? true : false;
      }

      // if permissionGrantedTo == true , then all users has the permission
      return true;
    }
  };

  useEffect(() => {
    const perMissionOf = "player";
    if (isRoomPage() && hasPermission(perMissionOf)) {
      emitPlayPause("video:playPause", isPlaying);
    }
  }, [isPlaying]);

  const handleVolumeChange = (event, newValue) => {
    setVolume(Number(newValue) * 0.01);
  };

  const handlePlaybackRateChange = (event, newValue) => {
    setPlaybackRate(Number(newValue) * 0.01);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      playerRef.current.wrapper.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const isCreator = () => {
    const liveRoom = useSelector((state) => state.appData.liveRoom);
    const roomId = liveRoom?._id;

    // if roomId not found using liveRoom , then you are not in live room and u can't use this function
    if (roomId) {
      const rooms = useSelector((state) => state.appData.rooms) || [];
      const room = rooms.find((room) => room?._id === roomId);

      const { user } = useSelector((state) => state.User);

      return room.createdBy.equals(user._id);
    }
    consol.error("can not fine room");
  };
  useEffect(() => {
    if (isRoomPage()) {
      // this effect will run only on creator's ui
      socket.on("video:changed", async (response) => {
        console.log("video changed");
        console.log("response: " + JSON.stringify(response));
        dispatch(dispatch(setRoomVideoPlayerData(response.currentVideo)));
      });
      socket.on("video:get-sync-details", async (data, callback) => {
        try {
          const syncVideoDetails = {
            isPlaying,
            seekTime: playbackRate.current.seekTime,
            playbackRate,
          };

          const response = {
            success: true,
            message: "live video details fetched successfully",
            data: syncVideoDetails,
          };
          callback(response);
        } catch (err) {
          const response = {
            success: false,
            error: err,
            message: "error fetching live video details",
          };
          callback(response);
          console.error("Error leaving room:", err.message);
        }
      });

      socket.on("video:playPause", async (data) => {
        if (sync && data?.isPlaying) {
          // change the state of the user only when the sync option is on
          setIsPlaying(data.isPlaying);
        }
      });
    }

    return () => {
      socket.off("video:get-sync-details");
      socket.off("video:playPause");
      socket.off("video:changed");
    };
  }, [socket]);

  const handleCancleVideoPlayer = () => {
    isRoomPage()
      ? dispatch(setVideoPlayerData(null))
      : dispatch(setRoomVideoPlayerData(null));
  };
  return (
    <div>
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
          <IconButton onClick={handlePlayPause}>
            {isPlaying ? (
              <PauseIcon style={{ color: "#1976d2" }} />
            ) : (
              <PlayArrowIcon style={{ color: "#1976d2" }} />
            )}
          </IconButton>
          <Slider
            style={{ color: "#1976d2" }}
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="volume-slider"
            sx={{ width: 100 }}
          />
          <VolumeUpIcon style={{ color: "#1976d2" }} />
          <IconButton onClick={toggleFullscreen}>
            <FullscreenIcon style={{ color: "#1976d2" }} />
          </IconButton>
          <Slider
            value={playbackRate}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={handlePlaybackRateChange}
            aria-labelledby="playback-rate-slider"
            sx={{ width: 100 }}
          />
          <SpeedIcon style={{ color: "#1976d2" }} />
        </Box>
      </Box>
      <button
        onClick={() => {
          handleCancleVideoPlayer;
        }}
      >
        cancel
      </button>
    </div>
  );
}

export default VideoPlayer;

// can now please systomatic my code ??
// line in companies like microsoft and google  , how to day keep their code clean

// put relavent variables together , then relavent hooks and functions also

// and please check my code it contains any logical or syntactical eorrr  , inside my video player componet the main logic to play video is that
// if user is in video page then videoPlayerdata will provde the video , if he has joined a room or created a room then roomPlayerdata , will provide url for video

// i told you that just so that u can have better understanding of my component , now check
