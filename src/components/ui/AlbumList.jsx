import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import ArtistText from "./ArtistText";

const coverVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.05 * i,
    },
  }),
  hover: {
    scale: 1.05,
  },
};

export const Container = ({ children }) => {
  return (
    <div className="pb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-6">
      {children}
    </div>
  );
};


export const Item = ({ data, i }) => {
  return (
    <motion.div
      className="cursor-pointer group"
      custom={i}
      variants={coverVariants}
      initial="hidden"
      animate="show"
      whileHover="hover"
      key={`${i} ${data.collectionId}}`}
    >
      <Link href={`/album/${data.collectionId}`}>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-200 shadow-md group-hover:shadow-lg">
          <Image src={data.imgSrcMd} alt={data.collectionName} layout="fill" />
          <div className="absolute inset-0 bg-slate-200 -z-10 animate-pulse"></div>
        </div>
      </Link>
      <Link href={`/album/${data.collectionId}`}>
        <div className="truncate text-md pt-2">{data.collectionName}</div>
      </Link>
      <div className="flex items-center gap-4">
        <ArtistText data={data} />
        {/* <span className="truncate text-sm text-slate-500">
              {item.trackCount} Tracks
            </span> */}
      </div>
    </motion.div>
  );
};

export default function AlbumList({ data }) {
  return (
    <Container>
      {data.map((item, i) => (
        <Item data={item} i={i} key={i} />
      ))}
    </Container>
  );
}
