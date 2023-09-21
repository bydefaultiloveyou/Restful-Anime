import cheerio from "cheerio";
import axios from "axios";
import { Chapter, Genre, Manga, MangaDetail } from "../../utils/manga/types";

const BASEURL = "https://kiryuu.id/";

/**
 * Get manga popular
 * @returns
 */
export const update = async (): Promise<Manga[]> => {
  let list: Manga[] = [];
  try {
    const base = await axios.get(BASEURL);
    const $ = cheerio.load(base.data);
    const a = $(".listupd")
      .eq(2)
      .find(".utao")
      .each((_, el) => {
        list.push({
          title: $(el).find(".luf > .series h4").text(),
          cover: $(el).find("img").attr("src")!,
          slug: $(el).find("a").attr("href")?.split("/")[4]!,
          url: $(el).find("a").attr("href")!,
        });
      });
    return list;
  } catch (error: any) {
    return error;
  }
};

/**
 * Get manga detail
 * @param slug string
 * @returns
 */
export const manga = async (slug: string): Promise<MangaDetail> => {
  const genres: Genre[] = [];
  try {
    const base = await axios.get(BASEURL + "/manga/" + slug);
    const $ = cheerio.load(base.data);

    $(".seriestugenre > a").each((idx, el) => {
      genres.push({
        title: $(el).text(),
        slug: $(el).attr("href")?.split("/")[4]!,
      });
    });

    let chapters: Chapter[] = [];
    $("#chapterlist > .clstyle > li").each((_, el) => {
      chapters.push({
        chapter: parseInt($(el).attr("data-num")!),
        slug: $(el).find(".eph-num > a").attr("href")!.split("/")[3],
      });
    });

    return {
      title: $(".seriestuheader").find("h1.entry-title").text(),
      cover: $(".seriestucontent").find("img").attr("src"),
      author: $(".infotable").find("tr").eq(3).find("td").eq(1).text(),
      synopsis: $("div[itemprop=description] > p").text(),
      genre: genres,
      chapter: chapters,
    };
  } catch (error: any) {
    return error;
  }
};

/**
 * Get image chapter
 * @param slug string
 * @returns
 */
export const getImage = async (slug: string) => {
  try {
    const base = await axios.get(BASEURL + "/" + slug);

    const $ = cheerio.load(base.data);

    const web: any = $("#readerarea").html();
    const $$: any = cheerio.load(web);
    const $$$ = cheerio.load($$("noscript").html());

    let images: any[] = [];

    $$$("p")
      .find("img")
      .each((_, el) => {
        images.push($(el).attr("src"));
      });

    return images;
  } catch (error: any) {
    return error;
  }
};

/**
 * Get manga by search
 * @param query string
 * @returns
 */
export const search = async (query: any): Promise<Manga[]> => {
  const list: Manga[] = [];
  try {
    const base = await axios.get(BASEURL + "/?s=" + query);
    const $ = cheerio.load(base.data);

    $(".listupd .bs").each((_, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[4]!,
        title: $(el).find(".tt").text().trim(),
        cover: $(el).find("img").attr("src")!,
        url: $(el).find("a").attr("href")!,
      });
    });
    return list;
  } catch (error: any) {
    return error;
  }
};
