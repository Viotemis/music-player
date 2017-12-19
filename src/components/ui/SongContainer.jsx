import { motion } from "framer-motion";
import { BottomMiniProgressLine } from "../MiniProgressLine";

export default function SongContainer({ isPlaying, i, p, children }) {
  return (
    <motion.div
      initial={{
        x: "-5%",
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        ease: "easeIn",
        delay: 0.05 * i,
      }}
      className={`group relative ${p} flex-1 cursor-pointer flex items-center transition-all duration-300 hover:shadow-md ${
        isPlaying
          ? "lg:border-blue-500 bg-blue-100 hover:bg-blue-300/20"
          : "lg:border-transparent bg-transparent hover:bg-blue-100/50"
      }`}
    >
      {/* bottom progress line */}
      {isPlaying && <BottomMiniProgressLine className="bg-gradient-to-r from-blue-500/70 to-blue-500 group-hover:from-purple-500/70 group-hover:to-red-500/70" />}

      {/* left border */}
      <div
        className={`absolute ${
          isPlaying
            ? "h-full w-[2px] group-hover:w-[3px]"
            : "h-0 w-[3px] group-hover:h-full"
        } top-0 left-0 bg-gradient-to-r from-blue-500/70 to-blue-500 transition-all duration-300`}
      ></div>

      {children}
    </motion.div>
  );
}
