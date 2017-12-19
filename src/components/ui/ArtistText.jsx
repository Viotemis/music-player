import { ArtistLink } from "./Link";

const ArtistText = ({ data, className }) => {
  return (
    <div className="w-full flex items-center">
      <ArtistLink
        className={`max-w-[100%] truncate text-sm text-slate-500 group-hover:text-blue-400 cursor-pointer transition-all duration-300 hover:underline ${className}`}
        artist={data}
      >
        {data.artistName}
      </ArtistLink>
    </div>
  );
};

export default ArtistText;
