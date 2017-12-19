import { useRef, useEffect } from "react";
import MediaProgressInputWrapper from "./MediaProgressInputWrapper";
import { motion } from "framer-motion";
import { usePlayingSong } from "../context/playingSong";

export const BottomMiniProgressLine = ({ className }) => {
  return <MiniProgressLine className={`bottom-0 ${className}`} />;
};

export const InteractiveMiniProgressLine = () => {
  const ref = useRef();
  const thumbRef = useRef();

  const { audioRef, duration } = usePlayingSong();

  useEffect(() => {
    if (ref.current) {
      console.log("progress ref", ref.current);
      console.log("progress ref", ref.current.offsetWidth);
    }
    if (thumbRef.current) {
      console.log("thumb ref init");
      const startDrag = (e) => {
        e.preventDefault();
        thumbRef.current.onmousemove = whileDrag;
        document.body.onmouseup = endDrag;
      };
      const whileDrag = (e) => {
        e.preventDefault();
        const p = e.pageX / ref.current.offsetWidth;
        console.log("while dragging", p);
        console.log(e);
        thumbRef.current.style.left = `${2 * p * 100}%`;
      };
      const endDrag = (e) => {
        e.preventDefault();
        console.log("end dragging");
        thumbRef.current.onmousemove = () => {};
        document.body.onmouseup = () => {};
      };
      // thumbRef.current.onmousedown = startDrag;
      thumbRef.current.addEventListener("dragstart", () => {
        console.log("drag start");
      });
    }
  }, [ref, thumbRef]);

  return (
    <MediaProgressInputWrapper>
      {({
        ref: iref,
        changeRangeInput,
        duration,
        currentProgress,
        updateAudioProgress,
      }) => {
        return (
          <>
            <div className="group absolute h-2 left-0 right-0 top-0" ref={ref}>
              <input
                ref={iref}
                type="range"
                defaultValue="0"
                step="0.05"
                onChange={changeRangeInput}
                className={`absolute h-1 top-0 left-0 right-0 bg-transparent appearance-none z-10 box-shadow-lg group-hover:box-shadow-2xl`}
              />
              <div
                className="absolute left-0 top-0 h-[3px] bg-gradient-to-r from-blue-500/70 to-blue-500 hover:from-purple-500/70 hover:to-red-500/70 pointer-events-none "
                style={{
                  width: `${(currentProgress / duration) * 100}%`,
                }}
              ></div>
            </div>
          </>
        );
      }}
    </MediaProgressInputWrapper>
  );
};

export default function MiniProgressLine({ className }) {
  return (
    <MediaProgressInputWrapper>
      {({ ref, changeRangeInput, duration, currentProgress }) => {
        return (
          <>
            <input
              ref={ref}
              type="range"
              defaultValue="0"
              step="0.05"
              onChange={changeRangeInput}
              className="hidden"
            />
            <div
              className={`absolute h-[3px] w-0 left-0 transition-all duration-300 ease-linear z-20 shadow-xl ${className}`}
              style={{
                width: `${(currentProgress / duration) * 100}%`,
              }}
            ></div>
          </>
        );
      }}
    </MediaProgressInputWrapper>
  );
}
