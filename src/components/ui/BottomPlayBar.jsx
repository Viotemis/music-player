import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayingSong } from "../../context/playingSong";
import AudioControls, { VolumeBar } from "../AudioControls";
import Image from "next/image";
import { SongLikeButton } from "../LikeButton";
import IconContainer from "../icons/IconContainer";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { BiAlbum } from "react-icons/bi";
import ArtistText from "./ArtistText";
import { seconds_format } from "../../util";
import MediaProgressInputWrapper from "../MediaProgressInputWrapper";
import PlayModeBottom from "../PlayModeBottom";
import { ArtistLink } from "./Link";
import { InteractiveMiniProgressLine } from "../MiniProgressLine";

const bottom_play_bar_transition = {
  duration: 0.3,
};

const bottom_play_bar_variants = {
  hidden: {
    y: "100%",
    opacity: 0,
    transition: bottom_play_bar_transition,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: bottom_play_bar_transition,
  },
};

const MediaProgressBar = ({ className }) => {
  return (
    <div className="w-full flex flex-col items-stretch">
      <MediaProgressInputWrapper>
        {({ currentProgress, durationStr, ref, changeRangeInput }) => (
          <>
            <input
              ref={ref}
              type="range"
              defaultValue="0"
              step="0.1"
              onChange={changeRangeInput}
              className={`w-full appearance-none h-1 bg-slate-300 rounded-full ${className}`}
            />
            <div className="mt-4 flex justify-between text-slate-300">
              <span className="">{seconds_format(currentProgress)}</span>
              <span className="">{durationStr}</span>
            </div>
          </>
        )}
      </MediaProgressInputWrapper>
    </div>
  );
};

const PlayingSongSpinningImage = ({ className }) => {
  const { playingSong, isPlaying } = usePlayingSong();

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.animationPlayState = isPlaying ? "running" : "paused";
    }
  }, [isPlaying, ref]);
  return (
    <div
      className={`relative flex-none rounded-full overflow-hidden animate-spin ${className}`}
      ref={ref}
      style={{
        animationDuration: "18s",
        animationName: "spinning",
        animationIterationCount: "infinite",
      }}
    >
      <Image
        src={playingSong.artworkUrl100.replace("100x100", "270x270")}
        alt={playingSong.trackName}
        layout="fill"
      />
    </div>
  );
};

const AlbumLink = ({ className = "", children }) => {
  const { playingSong } = usePlayingSong();
  const router = useRouter();
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/album/${playingSong.collectionId}`);
      }}
    >
      {children}
    </div>
  );
};

const TrackInfo = ({ song, className = "" }) => {
  return (
    <div className="w-full flex items-center gap-2">
      <div className="min-w-[0] flex-1 flex flex-col gap-1">
        <div className="text-white text-2xl font-medium line-clamp-2">
          {song.trackName}
        </div>
        <ArtistText data={song} className="text-slate-300" />
      </div>
      <SongLikeButton size={28} song={song} className="text-white" />
    </div>
  );
};

const PlayerLayer = ({ visible, close }) => {
  const { playingSong, togglePlaying, isPlaying, audioRef, setPlayingSong } =
    usePlayingSong();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed z-[999] inset-0 "
          variants={bottom_play_bar_variants}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <div className="relative w-full h-full">
            {/* background */}
            <div className="absolute inset-0">
              <div className="relative flex-none h-full w-full overflow-hidden ">
                <Image
                  src={playingSong.imgSrcMd}
                  alt={playingSong.trackName}
                  layout="fill"
                />
              </div>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-3xl"></div>
              <div className="absolute top-0 left-0 w-full p-8 z-10">
                <IconContainer>
                  <HiChevronDown
                    size={28}
                    className="text-white"
                    onClick={close}
                  />
                </IconContainer>
              </div>
            </div>
            {/* actual content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
              <div className="flex-1 px-8 md:px-0 w-full md:max-w-md lg:max-w-xl max-h-[75%] sm:max-h-[90%] flex flex-col items-center justify-center">
                {/* Image */}
                <PlayingSongSpinningImage
                  className={`w-64 h-64 sm:h-80 sm:w-80 md:h-96 md:w-96`}
                />

                <div className="flex-1 min-h-[1rem] max-h-[3rem]"></div>

                <div className="w-full sm:mt-8 flex flex-col gap-6 sm:gap-6">
                  {/* Track name, artist, and like button */}
                  <TrackInfo song={playingSong} />

                  {/* Audio controls */}
                  <MediaProgressBar className="" />

                  <div className="relative w-full flex items-center justify-center">
                    <AudioControls size={48} className="text-white" />
                    <div className="absolute -left-2 top-0 bottom-0 flex items-center gap-2">
                      <PlayModeBottom className="text-white" />
                    </div>
                    <div className="absolute -right-2 top-0 bottom-0 flex items-center gap-2">
                      <IconContainer>
                        <AlbumLink>
                          <BiAlbum size={24} className="text-white" />
                        </AlbumLink>
                      </IconContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BottomPlayBarComponent = ({ visible, setPlayerVisible }) => {
  const { playingSong, togglePlaying, isPlaying, audioRef, setPlayingSong } =
    usePlayingSong();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-0 right-0 bottom-0 h-16 sm:h-20 bg-blue-100/70 backdrop-blur-2xl flex items-center"
          variants={bottom_play_bar_variants}
          initial="hidden"
          animate="show"
          exit="hidden"
          onPanEnd={(e, info) => {
            if (info.offset.y < 5 && Math.abs(info.offset.x) < 20) {
              setPlayerVisible(true);
            }
          }}
        >
          <div
            className="relative w-full h-full flex justify-center items-center"
          >
            {/* Middle */}
            <AudioControls size={38} className="" />

            {/* Left */}
            <div className="absolute left-6 top-0 bottom-0 w-1/3 lg:w-1/4 max-w-[18rem] overflow-hidden flex items-center gap-3">
              {playingSong && (
                <>
                  <div
                    className="group relative flex-none h-10 w-10 sm:h-12 sm:w-12 overflow-hidden cursor-pointer"
                    onClick={() => setPlayerVisible(true)}
                  >
                    <div className="absolute group-hover:bg-black/30 inset-0 rounded-full flex items-center justify-center bg-transparent z-20">
                      <HiChevronUp
                        size={28}
                        className="text-transparent group-hover:text-slate-200"
                      />
                    </div>
                    <PlayingSongSpinningImage className="h-10 sm:h-12 w-10 sm:w-12" />
                  </div>
                  <div className="min-w-[0] flex-1 hidden sm:flex flex-col justify-between">
                    <div className="w-full line-clamp-1 cursor-pointer">
                      {playingSong.trackName}
                    </div>
                    <ArtistLink
                      artist={playingSong}
                      className="w-full line-clamp-1 text-sm text-slate-500"
                    >
                      {playingSong.artistName}
                    </ArtistLink>
                  </div>
                  <div className="hidden sm:block">
                    <SongLikeButton size={24} song={playingSong} />
                  </div>
                </>
              )}
            </div>

            {/* Right */}
            <div className="absolute right-6 top-0 bottom-0 overflow-hidden flex items-center gap-4">
              <div className="hidden md:flex flex-1">
                <VolumeBar size={28} />
              </div>
              <PlayModeBottom />
            </div>

            <InteractiveMiniProgressLine className="" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function BottomPlayBar() {
  const [playerVisible, setPlayerVisible] = React.useState(false);
  const { playingSong, togglePlaying, isPlaying, audioRef, setPlayingSong } =
    usePlayingSong();

  return (
    <>
      <PlayerLayer
        visible={playerVisible}
        close={() => setPlayerVisible(false)}
      />
      <BottomPlayBarComponent
        visible={!playerVisible && playingSong != null}
        setPlayerVisible={setPlayerVisible}
      />
    </>
  );
}
