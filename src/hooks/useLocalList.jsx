import React from 'react'
import useLocalStorageState from './useLocalStorageState';

export default function useLocalList(key) {
  const [list, setList] = useLocalStorageState(key, []);

  const getById = (id) => {
    const t = list.filter((e1) => e1.id === id)
    return t[0]
  };

  const addOne = (e) => {
    console.log('add to list', e);
    if (getById(e.id)) {
      console.log('already added', getById(e.id))
    };
    setList((old) => [e, ...old]);
    console.log('added')
  };

  const removeById = (id) => {
    console.log('remove by id', id);
    if (!getById(id)) return
    setList((old) => old.filter((e) => e.id !== id));
  };

  return {list, addOne, removeById, getById}
}
