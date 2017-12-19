import { useState, useEffect } from 'react';

export const load_local_json = (key, default_value = {}) => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : default_value;
  }
}

export const save_to_local_json = (key, value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export default function useLocalStorageState(key, initialState) {
  const [state, setState] = useState();

  const update = (argv) => {
    let value;
    if (typeof argv === 'function') {
      value = argv(state);
    } else {
      value = argv;
    }
    save_to_local_json(key, value);
    setState(argv);
  }

  const refresh = () => {
    setState(() => load_local_json(key, initialState))
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      refresh()
    }
  }, [])

  return [state, update, refresh]
}
