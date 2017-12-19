const ALBUM_QUERY_TEMPLATE =
  "https://itunes.apple.com/search?limit=125&term={searchTerm}&entity=album&attribute=allArtistTerm";

const contruct_url_query = (query) => {
  return Object.keys(query)
    .map((k) => {
      if (Array.isArray(query[k])) {
        return k + "=" + query[k].join(",");
      } else {
        return k + "=" + query[k];
      }
    })
    .join("&");
};

const fetch_json = (...params) => {
  return fetch(...params).then((res) => res.json());
};

export const search_itunes = (params) => {
  console.log('use search api, params: ', params);
  let url = "https://itunes.apple.com/search?" + contruct_url_query(params);

  console.log("url: " + url);

  return fetch_json(url);

  // return fetch(url)
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .catch((err) => err);
};

const itunes_lookup = (params) => {
  return fetch_json(
    `https://itunes.apple.com/lookup?${contruct_url_query(params)}`
  );
};

const itunes_search = (params) => {
  return fetch_json(
    `https://itunes.apple.com/lookup?${contruct_url_query(params)}`
  );
};

export const lookup_multiple = (id_list) => {
  return itunes_lookup({ id: id_list });
};

export const get_album = (id) => {
  return itunes_lookup({ id, limit: 20, entity: "song" });
};

export const get_artist = (id) => {
  return itunes_lookup({ id });
};

export const get_artist_songs = (id, limit, offset, entity = "music") => {
  return itunes_lookup({ id, limit, offset, entity });
};

export const get_artist_albums = (id, limit, offset, entity = "music") => {
  return itunes_lookup({ id, limit, offset, entity });
};

export const search = (params) => {
  return fetch_json(
    `http://${process.env.NEXT_PUBLIC_SERVER_HOST}/search?${contruct_url_query(params)}`
  );
};
