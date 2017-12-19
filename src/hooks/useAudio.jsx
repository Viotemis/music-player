import React from 'react'

export default function useAudio(playingSong, isPlaying, setIsPlaying) {
  const audioRef = React.useRef()
  const srcRef = React.useRef()

  React.useEffect(() => {
    audioRef.current = document.createElement('audio')
    srcRef.current = document.createElement('source')
    srcRef.current.setAttribute('src', '')
    audioRef.current.appendChild(srcRef.current)
    document.body.appendChild(audioRef.current)
  }, [])

  const togglePlay = () => {
    if (!playingSong) {
      return;
    }
    console.log("toggle audio play", { playingSong, isPlaying });
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying((old) => !old);
  };

  const play = () => {
    if (!audioRef.current) return
    audioRef.current.play();
  }

  const pause = () => {
    if (!audioRef.current) return
    audioRef.current.pause();
  }


  const playUrl = (url) => {
    console.log("playing itunes song");
    audioRef.current.querySelector("source").src = url;
    srcRef.current.setAttribute('src', url)
    console.log("set audio source", url.previewUrl);
    audioRef.current.load();
    audioRef.current.play();
  };

  return { play, pause, togglePlay, playSong: playUrl };
}
