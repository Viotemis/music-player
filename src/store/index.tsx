import { useEffect, useState } from "react";
import create from "zustand";
import { persist } from "zustand/middleware";
import {
  FARTIST_KEY,
  FSONGS_KEY,
  FALBUMS_KEY,
  SEARCH_HISTORY_KEY,
} from "../constants";

interface ListStore<T> {
  list: T[];
  setList: (n: T[]) => void;
  getOne: (e: string) => T | undefined;
  addOne: (e: T) => void;
  addUnique: (e: T) => void;
  removeOne: (id: string) => void;
  removeAll: () => void;
  load: () => void;
}

const listStoreFactory = (key) => {
  return create<ListStore<any>>((set, get) => ({
    list: [],

    setList: (n) => {
      set({ list: n });
      window.localStorage.setItem(key, JSON.stringify(n));
    },

    getOne: (id) => {
      console.log(get().list);
      const t = get().list.filter((e1) => e1 === id);
      return t[0];
    },

    addOne: (e) => {
      console.log("add to list", e);
      if (get().getOne(e)) {
        console.log("already added", get().getOne(e));
      }
      get().setList([e, ...get().list]);
      console.log("added");
    },

    addUnique: (e) => {
      console.log("add unique", e);
      if (get().getOne(e)) {
        console.log("already added", get().getOne(e));
        return;
      }
      get().setList([e, ...get().list]);
      console.log("added");
    },

    removeOne: (id) => {
      console.log("remove by id", id);
      if (!get().getOne(id)) return;
      get().setList(get().list.filter((e) => e !== id));
    },

    removeAll: () => {
      get().setList([]);
    },

    load: () => {
      const t = localStorage.getItem(key);
      set({ list: JSON.parse(t) || [] });
    },
  }));
};

export const useFSongs = listStoreFactory(FSONGS_KEY);

export const useFAlbums = listStoreFactory(FALBUMS_KEY);

export const useFArtists = listStoreFactory(FARTIST_KEY);

export const useSearchHistory = listStoreFactory(SEARCH_HISTORY_KEY);

export const useHeader = create((set, get) => ({
  title: "Music Player",
  defaultHeaderClassName: "bg-white",
  showSearchBar: true,
  customHeader: false,

  setTitle: (t) => {
    set({ title: t });
  },

  useCustomHeader: () => {
    set({ customHeader: true });
  },

  setDefaultHeaderClassName: (c) => {
    set({ defaultHeaderClassName: c });
  },

  setShowSearchBar: (b) => {
    set({ showSearchBar: b });
  },

  setHeaderToDefault: () => {
    set({ defaultHeaderClassName: "static bg-white", title: "Music Player", showSearchBar: true });
  },

  setHeaderAbsolute: (isAbs) => {
    set({ headerAbsolute: isAbs ? "absolute top-0 left-0" : "" });
  },
}));
