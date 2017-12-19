import React, { useState, useEffect, useRef } from "react";

const PlayingSongContext = React.createContext();

const play_mode_values = ["loop_queue", "loop_single", "shuffle"];
const usePlayMode = () => {
  const [playMode, setPlayMode] = useState(0);

  const handleClickPlayMode = () => {
    if (playMode === play_mode_values.length - 1) {
      setPlayMode(() => 0);
    } else {
      setPlayMode((old) => old + 1);
    }
  };

  return { playMode, setPlayMode, handleClickPlayMode };
};

export const PlayingSongWrapper = ({ children }) => {
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState([]);
  const [duration, setDuration] = useState(0);

  const { playMode, handleClickPlayMode } = usePlayMode();

  const audioRef = useRef();

  const togglePlaying = () => {
    if (!playingSong) {
      return;
    }
    console.log("toggle play", { playingSong, isPlaying });
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying((old) => !old);
  };

  const getCurrentSongQueueIndex = () => {
    const i = queue.reduce(
      (prev, cur, curI) => (playingSong.id === cur.id ? curI : prev),
      -1
    );
    return i;
  };

  const playNextSongInQueue = () => {
    if (queue.length === 0) {
      return;
    }
    const i = getCurrentSongQueueIndex();
    if (i === queue.length - 1) {
      setPlayingSong(() => queue[0]);
    } else {
      setPlayingSong(() => queue[i + 1]);
    }
  };

  const nextSong = () => {
    if (queue.length === 0) {
      return;
    }

    if (playMode === 2) {
      const i = Math.round(Math.random() * queue.length);
      setPlayingSong(() => queue[i]);
    } else {
      playNextSongInQueue();
    }
  };

  const prevSong = () => {
    if (queue.length === 0) {
      return;
    }
    const i = getCurrentSongQueueIndex();
    console.log("prev song, cur i = ", i);
    if (i === 0) {
      setPlayingSong(() => queue[queue.length - 1]);
    } else {
      setPlayingSong(() => queue[i - 1]);
    }
  };

  const playQueue = (songs) => {
    console.log("start playing queue: ", songs);
    setQueue(() => songs);
    setPlayingSong(songs[0]);
  };

  const playAudioSong = (song) => {
    console.log("playing itunes song");
    audioRef.current.querySelector("source").src = song.previewUrl;
    console.log("set preview url", song.previewUrl);
    audioRef.current.load();
    audioRef.current.play();
  };

  useEffect(() => {
    console.log("playing song changed", playingSong);
    if (playingSong) {
      playAudioSong(playingSong);
      setIsLoading(() => true);
    } else {
      audioRef.current.pause();
      setIsPlaying(() => false);
    }
  }, [playingSong]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("ended", () => {
      console.log("song ended");
      console.log("play mode", playMode);
      if (playMode === 1) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
        nextSong();
      }
    });
  }, [audioRef.current, queue, playingSong]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("loadedmetadata", () => {
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setIsLoading(false);
        setIsPlaying(true);
      }
    });
  }, [audioRef.current]);

  return (
    <PlayingSongContext.Provider
      value={{
        togglePlaying,
        audioRef,
        playingSong,
        setPlayingSong,
        isPlaying,
        setIsPlaying,
        isLoading,
        setIsLoading,
        queue,
        setQueue,
        prevSong,
        nextSong,
        playQueue,
        getCurrentSongQueueIndex,
        playMode,
        handleClickPlayMode,
      }}
    >
      {children}
      <audio ref={audioRef} className="hidden">
        <source src="" />
      </audio>
    </PlayingSongContext.Provider>
  );
};

export const usePlayingSong = () => {
  return React.useContext(PlayingSongContext);
};
