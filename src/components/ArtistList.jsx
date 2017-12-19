import React from "react";

export default function ArtistList({ data }) {
  return (
    <div className="flex gap-8 flex-wrap">
      {data.map((item, i) => (
        <div key={i} className="w-36 h-36 rounded-full">
          {item.artistName}
        </div>
      ))}
    </div>
  );
}
