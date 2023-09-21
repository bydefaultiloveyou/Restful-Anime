import axios from "axios";
import cheerio from "cheerio";
import { Anime, ListAnime, AnimeVideo, Genre } from "../../utils/anime/types";

const BASEURL = "https://kuramanime.pro";

/**
 * Get popular anime
 * @param type string
 * @param page number
 * @returns Promise<ListAnime>
 */
export const popular = async (
  type: any = "ongoing",
  page: any = 1
): Promise<ListAnime> => {
  let list: Anime[] = [];
  try {
    const html = await axios.get(
      `${BASEURL}/anime/${type}?order_by=popular&page=${page}`
    );
    const $ = cheerio.load(html.data);
    if (!$("#animeList .product__item").html()) {
      throw new Error(
        "Anime not found,or you may request more than the maximum page"
      );
    }
    let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
      .last()
      .html()!;
    $("#animeList .product__item").each((i, el) => {
      const data = {
        slug: $(el).find("a").attr("href")?.split("/")[5]!,
        title: $(el).find(".product__item__text>h5>a").text()!,
        episode: ~~$(el)
          .find(".ep span")
          .text()
          .replace("Ep", "")
          .split("/")[0]
          .trim(),
        cover: $(el).children("a").children("div").first().attr("data-setbg")!,
        url: $(el).find("a").attr("href")!,
      };
      return list.push(data);
    });
    return { page, maxPage, list };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Get result search
 * @param page number
 * @param query string
 * @returns Promise<ListAnime>
 */
export const search = async (
  query: string,
  page: number = 1
): Promise<ListAnime> => {
  let list: Anime[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/anime?search=${query}&order_by=latest&page=${page}`
    );
    const $ = cheerio.load(base.data);
    if (!$("#animeList .product__item").html()) {
      throw new Error(
        "Anime not found,or you may request more than the maximum page"
      );
    }
    let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
      .last()
      .html()!;
    $("#animeList .product__item").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]!,
        title: $(el).find(".product__item__text>h5>a").text(),
        cover: $(el).children("a").children("div").first().attr("data-setbg")!,
        url: $(el).find("a").attr("href")!,
      });
    });
    if (list.length == 0) {
      throw new Error("Anime not found");
    }
    return {
      page: ~~page,
      maxPage: maxPage,
      list: list,
    };
  } catch (err: any) {
    throw err;
  }
};

/**
 * Get genre list
 * @param page number
 * @returns Promise<Genre[]>
 */
export const genreList = async (page: number = 1): Promise<Genre[]> => {
  let list: Genre[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/properties/genre?genre_type=all&page=${page}`
    );
    const $ = cheerio.load(base.data);
    if (!$("#animeList .kuramanime__genres li").html()) {
      throw new Error("Page not found");
    }
    $("#animeList .kuramanime__genres li").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]?.split("?")[0]!,
        title: $(el).find("a").text(),
        url: $(el).find("a").attr("href")?.trim()!,
      });
    });
    return list;
  } catch (err: any) {
    throw err;
  }
};

/**
 * Get anime by genre
 * @param genre string
 * @param page number
 * @returns Promise<ListAnime>
 */
export const genre = async (
  genre: string,
  page: number = 1
): Promise<ListAnime> => {
  let list: Anime[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/properties/genre/${genre}?order_by=latest&page=${page}`
    );
    const $ = cheerio.load(base.data);
    if (!$("#animeList .product__item").html()) {
      throw new Error(
        "Genre not found, or you may request more than the maximum page"
      );
    }
    let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
      .last()
      .html()!;
    $("#animeList .product__item").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]!,
        title: $(el).find(".product__item__text>h5>a").text(),
        cover: $(el).children("a").children("div").first().attr("data-setbg")!,
        url: $(el).find("a").attr("href")!,
      });
    });
    return {
      page: ~~page,
      maxPage: maxPage,
      list: list,
    };
  } catch (err: any) {
    throw err;
  }
};

/**
 * Get anime detail
 * @param slug string
 * @returns Promise<AnimeDetails>
 */
export const anime = async (slug: string) => {
  try {
    const html = await axios.get(`${BASEURL}/anime/${slug}`);
    const $ = cheerio.load(html.data);

    if (!$(".anime__details__widget ul").html()) {
      throw new Error("Anime not found");
    }

    let genre: string[] = [];
    $(".anime__details__widget ul")
      .find('span:contains("Genre:"),span:contains("Tema:")')
      .parent()
      .find("a")
      .each((_, el) => {
        genre.push($(el).text().replace(",", "").trim());
      });

    const HtmlonAttrData: any = $(".anime__details__btn > .d-inline > a")
      .attr("data-content")
      ?.toString();

    // const episode = [];
    const $$ = cheerio.load(HtmlonAttrData);
    const episode = $$("a.btn-secondary").last().text().trim();

    const epsOther = [];
    $$("a").each((_, el) => {
      epsOther.push(el);
    });

    return {
      slug: $('meta[property="og:url"]').attr("content")?.split("/")[5]!,
      title: $(".anime__details__title > h3").text(),
      titleAlt: $(".anime__details__title > span").text(),
      synopsis: $("#synopsisField").text(),
      episodeTotal: ~~$(".anime__details__widget ul")
        .find('span:contains("Total Eps:")')
        .next()
        .text(),
      episode: parseInt(episode.split(" ")[1]) || epsOther.length,
      season: $(".anime__details__widget ul")
        .find('span:contains("Musim:")')
        .next()
        .text(),
      genre: genre,
      cover: $(".set-bg").attr("data-setbg")!,
      url: $('meta[property="og:url"]').attr("content")!,
    };
  } catch (error) {}
};

/**
 * Get streaming url
 * @param slug string
 * @param ep number
 * @returns
 */
export const animeVideoSource = async (
  slug: string,
  ep: number
): Promise<AnimeVideo> => {
  try {
    const url = await axios.head(`${BASEURL}/anime/${slug}`);
    const actualUrl = await url.request.res.responseUrl;
    const base = await axios.get(
      actualUrl + `/episode/${ep}?activate_stream=1`
    );
    const $ = cheerio.load(base.data);
    let videoSource: { quality: string; url: string }[] = [];
    if (!$("#animeVideoPlayer video").html()) {
      throw new Error("Episode not found");
    }
    $("#animeVideoPlayer video")
      .find("source")
      .each((i, el) => {
        videoSource.push({
          quality: $(el).attr("size")! + "p",
          url: $(el).attr("src")!,
        });
      });
    return {
      episode: ~~ep,
      video: videoSource,
    };
  } catch (err: any) {
    throw err;
  }
};
