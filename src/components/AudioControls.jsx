import { useRef, useState, useEffect } from "react";
import { usePlayingSong } from "../context/playingSong";
import {
  MdSkipNext,
  MdSkipPrevious,
  MdVolumeMute,
  MdVolumeUp,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
} from "react-icons/md";
import { HiPause, HiPlay, HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";

const stopPropagationWrapper = (fn) => {
  return (e) => {
    e.stopPropagation();
    fn();
  };
};

export const PlayButton = ({ size = 44, className = "" }) => {
  const { isPlaying, togglePlaying, isLoading } = usePlayingSong();
  if (isLoading) {
    return <ImSpinner2 size={size-2} className={`animate-spin`} />;
  }
  return isPlaying ? (
    <MdOutlinePauseCircleFilled
      size={size}
      onClick={stopPropagationWrapper(togglePlaying)}
      className={className}
    />
  ) : (
    <MdOutlinePlayCircleFilled
      size={size}
      onClick={stopPropagationWrapper(togglePlaying)}
      className={className}
    />
  );
};

export const PrevButton = ({ size = 44 }) => {
  const { prevSong } = usePlayingSong();
  return (
    <MdSkipPrevious size={size} onClick={stopPropagationWrapper(prevSong)} />
  );
};

export const NextButton = ({ size = 44 }) => {
  const { nextSong } = usePlayingSong();
  return <MdSkipNext size={size} onClick={stopPropagationWrapper(nextSong)} />;
};

export const VolumeBar = ({ size = 32 }) => {
  const { audioRef, playingSong } = usePlayingSong();
  const vRef = useRef();
  const [currentVol, setCurrentVol] = useState(0);
  const [vOff, setVOff] = useState(false);

  const handleVClick = (e) => {
    e.stopPropagation();
    if (!vOff) {
      audioRef.current.volume = 0;
      vRef.current.value = 0;
    } else {
      audioRef.current.volume = currentVol;
      vRef.current.value = currentVol;
    }
    setVOff((old) => !old);
    audioRef.current.muted = !audioRef.current.muted;
  };

  useEffect(() => {
    if (!vRef.current || !audioRef.current) {
      return;
    }
    if (playingSong) {
      vRef.current.value = audioRef.current.volume;
    }
  }, [vRef.current, audioRef.current]);

  const handleChange = (e) => {
    e.stopPropagation();
    console.log("Volume change", e.target.value);
    audioRef.current.volume = e.target.value;
    setCurrentVol(e.target.value);
  };

  return (
    <div className="group w-full flex items-center gap-4 ">
      {/* <button className="peer active:bg-purple-300">
        {audioRef.current &&
          (audioRef.current.muted ? (
            <HiVolumeOff size={size} onClick={handleVClick} className="" />
          ) : (
            <HiVolumeUp size={size} onClick={handleVClick} />
          ))}
      </button> */}
      {/* <div className="w-0 group-hover:w-1/2 transition-all duration-300 overflow-hidden"> */}
      <div className="w-full flex items-center transition-all duration-300 overflow-hidden gap-2">
        {/* <MdVolumeMute
          size={size}
          className="flex-none"
          onClick={handleVClick}
        /> */}
        <MdVolumeUp size={size} className="flex-none" />
        <input
          ref={vRef}
          type="range"
          className="min-w-[0] h-1 flex-1 bg-slate-400 appearance-none rounded-full"
          onChange={handleChange}
          min="0"
          max="1"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default function AudioControls({ size = 44, className = "" }) {
  return (
    <div className={"flex justify-center items-center " + className}>
      <div className="flex gap-4 items-center">
        <PrevButton size={size} />
        <PlayButton size={size} />
        <NextButton size={size} />
      </div>
    </div>
  );
}
