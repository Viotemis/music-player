import React from "react";

export default function IconContainer({ children, bg = 'transparent', bgHover = 'black/30', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300 bg-transparent hover:bg-black/20 rounded-full cursor-pointer`}
    >
      {children}
    </div>
  );
}
