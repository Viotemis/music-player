import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { usePlayingSong } from "../../context/playingSong";
import { process_itunes_album_result, process_itunes_tracks } from "../../util";
import { ImSpinner2 } from "react-icons/im";
import { useHeader } from "../../store";
import { get_album } from "../../api";
import Layout from "../../components/Layout";
import AlbumPageHeader from "../../components/pages/album/AlbumPageHeader";
import SongList from "../../components/ui/SongList";
import { useQuery } from "react-query";

export default function AlbumPage() {
  const router = useRouter();
  const { id } = router.query;
  const [songs, setSongs] = useState([]);
  const [alData, setAlData] = useState();
  const { setQueue, playQueue } = usePlayingSong();

  const { setDefaultHeaderClassName, setTitle, setShowSearchBar } = useHeader();

  useEffect(() => {
    setDefaultHeaderClassName("bg-white absolute");
    setShowSearchBar(false);
  }, []);

  // const { setBackground } = useHeader();

  const { data, error } = useQuery([id], () => get_album(id), {
    enabled: id != undefined,
  });

  const playAlbum = () => {
    console.log("play album");
    console.log("first song: ", songs[0]);
    playQueue(songs);
  };

  console.log("render album page", { id, data });

  useEffect(() => {
    if (data) {
      console.log("got data", data);
      setSongs(() => process_itunes_tracks(data.results.slice(1)));
      setAlData(() => process_itunes_album_result([data.results[0]])[0]);
      setTitle(data.results[0].collectionName);
      setDefaultHeaderClassName("bg-white absolute");
    }
  }, [data]);

  return (
    <>
      {!error && !data && (
        <div className="flex justify-center mt-40">
          <ImSpinner2 size={44} className="animate-spin" />
        </div>
      )}
      {alData && <AlbumPageHeader album={alData} playAlbum={playAlbum} />}
      {/* <div className="d-flex flex-wrap">{trackElemArray}</div> */}
      <div className="pb-2">
        {songs && (
          <SongList
            songs={songs}
            className=""
            showCollection={false}
            itemPadding="albumpage-songitem"
          />
        )}
      </div>
    </>
  );
}
