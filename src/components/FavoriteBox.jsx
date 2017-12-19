import React, { useState, useEffect } from "react";
import HomeBox from "./Box";
import { FALBUMS_KEY, FARTIST_KEY, FSONGS_KEY } from "../constants";
import SongList from "./ui/SongList";
import ArtistList from "./ArtistList";
import AlbumList from "./ui/AlbumList";
import { useFSongs, useFAlbums, useFArtists } from "../store";
import Spinner from "./icons/Spinner";
import { process_api_data } from "../util";
import { useQuery } from "react-query";
import { lookup_multiple } from "../api";

const BoxTitle = ({ tab, changeTab, tabs }) => {
  return (
    <div className="px-6 flex-none flex sm:items-center flex-col items-right sm:flex-row pb-4">
      <span className="inline-block flex-1 text-xl font-bold">
        My Favorites
      </span>
      <div className="flex">
        <div className="flex gap-1 mt-2 sm:mt-0">
          {tabs.map((t, i) => (
            <div
              key={i}
              className={
                "px-5 text-center py-1.5 " +
                (tab === i ? "bg-slate-200" : "") +
                " cursor-pointer hover:bg-blue-200 rounded-lg transition-all duration-300"
              }
              onClick={() => changeTab(i)}
            >
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BoxContent = ({ data, dataType }) => {
  if (!data || data.length === 0) return <></>;
  switch (dataType) {
    case 0:
      return (
        <SongList songs={data} showIndex={false} itemPadding="py-2 px-6" />
      );
    case 1:
      return (
        <div className="px-6">
          <AlbumList data={data} />
        </div>
      );
    case 2:
      return <ArtistList data={data} />;
  }
};

const FavoriteSongList = () => {
  const { list: idList, load } = useFSongs();
  const { data, error } = useQuery(idList, () => lookup_multiple(idList), {
    enabled: idList.length > 0,
  });
  const [init, setInit] = useState(true);

  useEffect(() => {
    if (init) {
      setInit(false);
      load();
      // getTabData(tab);
    }
  }, [init]);

  return <SongList songs={data} showIndex={false} itemPadding="py-2 px-6" />;
};

const tabHookList = [useFSongs, useFAlbums, useFArtists];

export default function FavoriteBox() {
  const tabs = [
    { label: "Songs", dataLabel: FSONGS_KEY },
    { label: "Albums", dataLabel: FALBUMS_KEY },
    { label: "Artists", dataLabel: FARTIST_KEY },
  ];

  const [tab, setTab] = useState(0);
  // const [idList, setIdList] = useState([]);
  const [init, setInit] = useState(true);
  const { list: idList, load } = tabHookList[tab]();
  // const { data, error } = useLookUp(idList);
  const { data, error } = useQuery(idList, () => lookup_multiple(idList), {
    enabled: idList.length > 0,
  });

  useEffect(() => {
    if (init) {
      setInit(false);
      load();
    }
  }, [init]);

  useEffect(() => {
    load();
  }, [tab]);

  const changeTab = (i) => {
    setTab(i);
  };

  useEffect(() => {
    console.log("useEffect id list", idList);
  }, [idList]);

  console.log("render f box data", data);

  return (
    <HomeBox className="w-full max-h-[20rem] py-4 px-0 flex flex-col self-stretch ">
      <BoxTitle tabs={tabs} tab={tab} changeTab={changeTab} />
      {idList.length === 0 ? (
        <div></div>
      ) : error ? (
        <div>{error}</div>
      ) : data ? (
        <div className="min-w-[0] flex-1 overflow-y-scroll scrollbar-hide">
          <BoxContent data={process_api_data(data.results)} dataType={tab} />
        </div>
      ) : (
        <div className="w-full h-1/3 flex justify-center items-center">
          <Spinner size={38} />
        </div>
      )}
    </HomeBox>
  );
}
