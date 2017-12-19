import React, { useState, useEffect, useRef } from 'react'
import { usePlayingSong } from "../context/playingSong";
import { seconds_format } from "../util";

export default function MediaProgressInputWrapper({ children }) {
  const {
    playingSong,
    togglePlaying,
    isPlaying,
    audioRef,
    getCurrentSongQueueIndex,
  } = usePlayingSong();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [haveInit, setHaveInit] = useState(false);

  const pRef = useRef(); // reference for the progress bar
  const aRef = useRef(); // reference for the animation

  const updateProgressBar = () => {
    // Update the slider of the range element and the bottom left label (the current progress text)
    // with the current value
    if (pRef.current) {
      pRef.current.value = audioRef.current.currentTime;
      pRef.current.style.setProperty(
        "--seek-before-width",
        `${(pRef.current.value / duration) * 100}%`
      );
      setCurrentProgress(pRef.current.value);
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (pRef.current) {
      if (!haveInit) {
        setHaveInit(true);
      }
      if (playingSong) {
        console.log("init playbox with playsing song", {
          duration: audioRef.current.duration,
        });
        pRef.current.max = audioRef.current.duration;
        setDuration(audioRef.current.duration);
        if (isPlaying) {
          startUpdatingProgressBar();
        } else {
          updateProgressBar();
        }
      }
      audioRef.current.addEventListener("loadedmetadata", () => {
        console.log("loadedmetadata", { duration: audioRef.current.duration });
        setDuration(() => audioRef.current.duration);
        if (pRef.current) {
          pRef.current.max = audioRef.current.duration;
        }
      });
      // start infinite updating UI when playing started
      audioRef.current.addEventListener("play", startUpdatingProgressBar);
      // stop updating when pause
      audioRef.current.addEventListener("pause", () => {
        console.log("listen to pause from progress bar");
        cancelAnimationFrame(updateProgressBarWhilePlaying);
      });
    }
  }, [pRef.current, audioRef.current]);

  const startUpdatingProgressBar = () => {
    aRef.current = requestAnimationFrame(updateProgressBarWhilePlaying);
  };

  const updateProgressBarWhilePlaying = () => {
    updateProgressBar();
    // infinite recursion to make the UI continue updating
    aRef.current = requestAnimationFrame(updateProgressBarWhilePlaying);
  };

  useEffect(() => {
    if (!haveInit) {
      return;
    }
    if (getCurrentSongQueueIndex() !== -1) {
      // if the current song is in the queue, skip the else checking
      return;
    } else if (Math.floor(currentProgress * 10) === Math.floor(duration * 10)) {
      // when reaching the end of song and the current song is not in the queue,
      // pause and set the progress to 0
      togglePlaying();
      audioRef.current.currentTime = 0;
      pRef.current.value = 0;
      setCurrentProgress(0);
    }
  }, [duration, currentProgress, haveInit]);

  const changeRangeInput = () => {
    console.log("on range change 2", {
      D: (pRef.current.value / duration) * 100,
      current: pRef.current.value,
    });
    audioRef.current.currentTime = pRef.current.value;
    updateProgressBar();
  };

  const updateAudioProgress = (percentage) => {
    audioRef.current.currentTime = percentage * duration;
    updateProgressBar(); 
  }

  const durationStr = !isNaN(duration) && seconds_format(duration);

  return children({
    currentProgress,
    durationStr,
    duration,
    ref: pRef,
    changeRangeInput,
    updateAudioProgress
  });
};
