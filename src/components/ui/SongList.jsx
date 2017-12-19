import Link from "next/link";
import { usePlayingSong } from "../../context/playingSong";
import { PlayButton } from "../../components/AudioControls";
import { milliseconds_to_ms } from "../../util";
import Image from "next/image";
import SongContainer from "./SongContainer";
import ArtistText from "./ArtistText";

const IndexOrPlayButton = ({ i, isPlaying }) => {
  return (
    <div
      className={"flex-none w-8 text-center flex items-center"}
    >
      {isPlaying ? (
        <div className="-translate-x-3">
        <PlayButton size={32} />
        </div>
      ) : (
        <span className={"text-slate-400"}>{i + 1}</span>
      )}
    </div>
  );
};

const SongImage = ({ song: s }) => {
  return (
    <div
      className={
        "relative h-11 w-11 hidden md:block mr-2 rounded-lg overflow-hidden"
      }
    >
      <Image src={s.imgSrcSm} alt={s.imgAlt} layout="fill" />
    </div>
  );
};

const TracknameText = ({ song: s, onClick }) => {
  return (
    <span
      className="group-hover:text-blue-600 truncate transition-all duration-300"
      onClick={onClick}
    >
      {s.trackName}
    </span>
  );
};

const DurationText = ({ song: s }) => {
  return (
    <div className="w-16 text-right text-sm">
      {milliseconds_to_ms(s.trackTimeMillis)}
    </div>
  );
};

const SongItem = ({
  song: s,
  index: i,
  isPlaying,
  handleSongNameClick,
  showIndex = true,
  showCollection = true,
  padding = "py-2 px-2",
}) => {
  return (
    <SongContainer isPlaying={isPlaying} i={i} p={padding}>
      {/* song index / play bottom */}
      {showIndex ? (
        <IndexOrPlayButton i={i} isPlaying={isPlaying} />
      ) : (
        <div className="w-0 md:w-0"></div>
      )}

      {/* song image */}
      <SongImage song={s} />

      {/* sone name and artist */}
      <div
        className="flex-1 flex flex-col truncate"
        onClick={() => handleSongNameClick(s)}
      >
        <TracknameText song={s} />
        <ArtistText data={s} />
      </div>

      {/* collection name */}
      {showCollection && (
        <Link href={`/album/${s.collectionId}`}>
          <div className="hidden md:block pl-2 w-1/3">
            <span className="text-sm hover:underline text-slate-400 line-clamp-2">
              {s.collectionName}
            </span>
          </div>
        </Link>
      )}

      {/* song duration */}
      <div className="block flex-none justify-self-end gap-8">
        {/* <span className="hidden lg:block md:w-12 flex-none text-slate-500 ">${s.trackPrice}</span> */}
        <DurationText song={s} />
      </div>
    </SongContainer>
  );
};

export default function SongList({
  songs,
  className = "",
  showIndex,
  showCollection,
  itemPadding,
}) {
  const {
    playingSong,
    setPlayingSong,
    // togglePlaying,
    // isPlaying,
    setQueue,
    audioRef,
  } = usePlayingSong();

  const handleSongNameClick = (s) => {
    if (playingSong && playingSong.id === s.id) {
      // togglePlaying();
    } else {
      setQueue(songs);
      setPlayingSong(() => s);
    }
  };

  console.log("render song list", songs);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {songs.map((s, i) => (
        <SongItem
          song={s}
          key={`${i} - ${s.trackName}`}
          index={i}
          isPlaying={playingSong && playingSong.trackId === s.trackId}
          handleSongNameClick={handleSongNameClick}
          showIndex={showIndex}
          showCollection={showCollection}
          padding={itemPadding}
        />
      ))}
    </div>
  );
}
