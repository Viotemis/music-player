import { usePlayingSong } from "../context/playingSong";
import { ImShuffle, ImLoop, ImLoop2 } from "react-icons/im";
import IconContainer from "./icons/IconContainer";

export default function PlayModeBottom({ className = "" }) {
  const {
    playingSong,
    setPlayingSong,
    // togglePlaying,
    // isPlaying,
    setQueue,
    audioRef,
    playMode,
    handleClickPlayMode,
  } = usePlayingSong();

  const play_mode_to_icon = {
    0: <ImLoop size={22} className={className} />,
    1: (
      <div className={"relative " + className}>
        <ImLoop2 size={22} />
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <span className="text-xs font-medium select-none">1</span>
        </div>
      </div>
    ),
    2: <ImShuffle size={22} className={className} />,
  };

  return (
    <IconContainer
      onClick={(e) => {
        e.stopPropagation();
        handleClickPlayMode();
      }}
    >
      {play_mode_to_icon[playMode]}
    </IconContainer>
  );
}
