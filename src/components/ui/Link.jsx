import React from "react";
import { useRouter } from "next/router";

const BaseLink = ({ className, children, url }) => {
  const router = useRouter();

  const handleClick = (e) => {
    e.stopPropagation();
    router.push(url);
  };

  return (
    <span className={`inline-block ${className}`} onClick={handleClick}>
      {children}
    </span>
  );
};

export const AlbumLink = ({ className, album, children }) => {
  return (
    <BaseLink
      className={`${className}`}
      url={`/album/${album.collectionId}`}
    >
      {children}
    </BaseLink>
  );
};

export const ArtistLink = ({ className, artist, children }) => {
  return (
    <BaseLink
      className={`${className}`}
      url={`/artist/${artist.artistId}`}
    >
      {children}
    </BaseLink>
  );
};
