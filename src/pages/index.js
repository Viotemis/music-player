import React, { useState, useEffect } from "react";
import PlayBox from "../components/PlayBox";
import FavoriteBox from "../components/FavoriteBox";

export default function Home() {
  return (
    <div className="px-8 py-8 min-h-[0] flex-1 w-full flex flex-col lg:flex-row items-stretch gap-8">
      <FavoriteBox />
      {/* <PlayBox /> */}
    </div>
  );
}
