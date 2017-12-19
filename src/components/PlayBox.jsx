import React, { useState, useEffect, useRef } from "react";
import { usePlayingSong } from "../context/playingSong";
import AudioControls, { VolumeBar } from "./AudioControls";
import Link from "next/link";
import HomeBox from "./Box";
import { SongLikeButton } from "./LikeButton";
import { seconds_format } from "../util";
import CloseIcon from "./icons/CloseIcon";
import MediaProgressInputWrapper from "./MediaProgressInputWrapper";


const MediaProgressBar = ({ className }) => {
  return (
    <div className="flex flex-col items-stretch">
      <MediaProgressInputWrapper>
        {({ currentProgress, durationStr, ref, changeRangeInput }) => (
          <>
            <input
              ref={ref}
              type="range"
              defaultValue="0"
              step="0.1"
              onChange={changeRangeInput}
              className={className}
            />
            <div className="flex justify-between">
              <span className="">{seconds_format(currentProgress)}</span>
              <span className="">{durationStr}</span>
            </div>
          </>
        )}
      </MediaProgressInputWrapper>
    </div>
  );
};

const TitleBlock = ({ playingSong }) => {
  return (
    <div className=" flex items-center">
      {/* Title left */}
      <div className="flex flex-col flex-1">
        <div className="line-clamp-2 text-xl font-bold">
          {playingSong.trackName}
        </div>
        <a
          href={playingSong.artistViewUrl}
          className="inline-block text-slate-500 text-base"
        >
          {playingSong.artistName}
        </a>
      </div>
      {/* Title right */}
      <div className="flex-none flex justify-center items-center">
        <SongLikeButton song={playingSong} size={28} />
      </div>
    </div>
  );
};

const PlayBox = () => {
  const ref = useRef();
  const { playingSong, togglePlaying, isPlaying, audioRef, setPlayingSong } =
    usePlayingSong();

  console.log("render play box", { playingSong, togglePlaying, isPlaying });

  useEffect(() => {
    console.log("useEffect: song");
    if (ref.current) {
      ref.current.classList.remove("animate-spin");
      setTimeout(() => {
        ref.current.classList.add("animate-spin");
      }, 100);
    }
  }, [playingSong]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (playingSong) {
      if (isPlaying) {
        ref.current.style.animationPlayState = "running";
        console.log("Playing...");
      } else {
        ref.current.style.animationPlayState = "paused";
        console.log("Pausing...");
      }
    }
  }, [isPlaying]);

  console.log("render playing box");

  if (!playingSong) {
    return <div className="fixed right-0 bottom-0"></div>;
  }

  console.log("duration", audioRef.current.duration);

  return (
    <HomeBox className="relative w-full lg:w-96 px-12">
      <CloseIcon
        size={32}
        onClick={() => setPlayingSong(null)}
        className="absolute top-8 right-8 cursor-pointer"
      />
      <div
        className="w-full lg:w-72 mx-auto my-12 relative rounded-full overflow-hidden animate-spin [animation-duration:20s]"
        ref={ref}
      >
        <img
          src={playingSong.imgSrcMd}
          className="w-full aspect-square object-contain"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>
      <div className="w-full flex flex-col items-stretch gap-4">
        <TitleBlock playingSong={playingSong} />
        <MediaProgressBar />
        <AudioControls size={44} className="-translate-y-1" />
        <VolumeBar size={28} />
        <div className="flex items-center justify-center">
          {playingSong.albumUrl && (
            <Link href={playingSong.albumUrl} passHref>
              <a className="text-slate-600 bg-slate-200 py-2 px-6 rounded-lg">
                View Album
              </a>
            </Link>
          )}
        </div>
      </div>
    </HomeBox>
  );
};

export default PlayBox;
