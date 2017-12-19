import { useEffect } from "react";
import { useRouter } from "next/router";
import { get_artist } from "../../api";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import Image from "next/image";

const ArtistHeader = ({ artist }) => {
  return (
    <div className="w-full h-36 flex flex-col justify-center items-center gap-4">
      <div className="relative w-20 h-20 rounded-full overflow-hidden">
        {/* <Image src={artist.imgSrcLg || ""} alt="Artist image" layout="fill" /> */}
      </div>
      <div className="text-lg">{artist.artistName}</div>
    </div>
  );
};

export default function ArtistPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: artistData,
    error,
    isLoading,
  } = useQuery([id], () => get_artist(id), {
    enabled: id != undefined,
  });

  console.log("render artist page", { id, artistData });

  useEffect(() => {
    if (artistData) {
      console.log("got data", artistData);
    }
  }, [artistData]);

  return (
    <>
      {error ? (
        <div>An error has occurred</div>
      ) : artistData ? (
        <ArtistHeader artist={artistData.results[0]} />
      ) : (
        <div className="flex justify-center mt-40">Loading...</div>
      )}
    </>
  );
}
