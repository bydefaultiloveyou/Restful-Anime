export type ListAnime = {
  list: Anime[];
  maxPage: number;
  page: number;
};

export type Anime = {
  slug: string;
  title: string;
  episode?: number;
  cover: string;
  url: string;
};

export type AnimeDetails = {
  slug: string;
  title: string;
  titleAlt?: string;
  synopsis?: string;
  episodeTotal?: episodeAnime[];
  episode: any;
  season?: string;
  genre?: string[];
  cover: string;
  url: string;
};

export type episodeAnime = {
  index: number;
  slug: string;
};

export type AnimeVideo = {
  episode: number;
  video: VideoSource[];
};

export type VideoSource = {
  quality: string;
  url: string;
};

export type Genre = {
  slug: string;
  title: string;
  url: string;
};
