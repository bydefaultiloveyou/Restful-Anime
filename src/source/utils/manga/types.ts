export type Manga = {
  slug: string;
  title: string;
  cover: string;
  url: string;
};

export type MangaDetail = {
  title?: string;
  cover?: string;
  author?: string;
  synopsis?: string;
  genre?: Genre[];
  chapter?: Chapter[];
};

export type Chapter = {
  chapter: any;
  slug: string;
};

export type Genre = {
  title: string;
  slug: string;
};
