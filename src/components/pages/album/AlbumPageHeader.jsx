import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlbumLikeButton } from "../../LikeButton";
import ArtistText from "../../ui/ArtistText";

const PlayAlbumButton = ({ album, playAlbum }) => {
  return (
    <button
      className="w-full py-2 sm:py-3 text-center bg-blue-900/80 hover:bg-blue-800/70 rounded-xl text-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
      onClick={playAlbum}
    >
      Play
    </button>
  );
};

const AlbumCoverImage = ({ src, alt }) => {
  return (
    <div className="relative w-28 h-28 sm:w-44 sm:h-44 md:w-52 md:h-52 z-10">
      <Image
        src={src}
        alt={alt}
        layout="fill"
        className="rounded-3xl cover-image"
      />
    </div>
  );
};

const AlbumCoverBackground = ({ src }) => {
  return (
    <>
      <div
        className={`absolute inset-0 opacity-20`}
        // style={{ background: `linear-gradient(0deg, ${coverColor} 0%, white 100%)`}}
      >
        <div className="relative w-full h-full">
          <Image src={src} alt="Album Cover Layer" layout="fill" />
        </div>
      </div>
      <div className="absolute inset-0 backdrop-blur-2xl z-0"></div>
    </>
  );
};

const AlbumPageHeader = ({ album, playAlbum }) => {
  const imgSrc = album.artworkUrl100.replace("100x100", "270x270");
  return (
    <div className={`w-full pt-20 pb-4 relative`}>
      <div className="px-6 sm:px-8 py-4 w-full h-full flex flex-col gap-6 bg-transparent">
        <div className="w-full h-full flex gap-6">
          {/* Album image */}
          <AlbumCoverImage src={imgSrc} alt={album.collectionName} />

          {/* Album info */}
          <div className="z-10 flex-1 self-stretch flex flex-col justify-between sm:gap-1">
            {/* Upper content */}
            <div className="sm:text-lg md:text-2xl font-medium line-clamp-1 sm:line-clamp-2">
              {album.collectionName}
            </div>
            <div className="flex mb-1">
              <ArtistText data={album} />
            </div>
            <div className="flex">
              <span className="inline-block px-3 sm:px-4 py-1 text-xs bg-blue-400/40 hover:bg-blue-400/60 rounded-full transition-all duration-300 cursor-pointer">
                {album.primaryGenreName}
              </span>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Bottom content */}
            <div className="z-10 flex gap-6 items-center">
              <div className="hidden sm:block sm:w-36">
                <PlayAlbumButton album={album} playAlbum={playAlbum} />
              </div>
              <AlbumLikeButton album={album} size={28} />
            </div>
          </div>
        </div>
        <div className="sm:hidden w-full z-10">
          <PlayAlbumButton album={album} playAlbum={playAlbum} />
        </div>
      </div>
      <AlbumCoverBackground src={album.artworkUrl100} />
    </div>
  );
};

export default AlbumPageHeader;
