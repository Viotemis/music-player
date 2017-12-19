import { PlayingSongWrapper } from "./playingSong";

export const GlobalContextWrapper = ({ children }) => {
  return <PlayingSongWrapper>{children}</PlayingSongWrapper>;
};
