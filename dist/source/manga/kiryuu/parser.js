"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.getImage = exports.manga = exports.update = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const BASEURL = "https://kiryuu.id/";
/**
 * Get manga popular
 * @returns
 */
const update = async () => {
    let list = [];
    try {
        const base = await axios_1.default.get(BASEURL);
        const $ = cheerio_1.default.load(base.data);
        const a = $(".listupd")
            .eq(2)
            .find(".utao")
            .each((_, el) => {
            list.push({
                title: $(el).find(".luf > .series h4").text(),
                cover: $(el).find("img").attr("src"),
                slug: $(el).find("a").attr("href")?.split("/")[4],
                url: $(el).find("a").attr("href"),
            });
        });
        return list;
    }
    catch (error) {
        return error;
    }
};
exports.update = update;
/**
 * Get manga detail
 * @param slug string
 * @returns
 */
const manga = async (slug) => {
    const genres = [];
    try {
        const base = await axios_1.default.get(BASEURL + "/manga/" + slug);
        const $ = cheerio_1.default.load(base.data);
        $(".seriestugenre > a").each((idx, el) => {
            genres.push({
                title: $(el).text(),
                slug: $(el).attr("href")?.split("/")[4],
            });
        });
        let chapters = [];
        $("#chapterlist > .clstyle > li").each((_, el) => {
            chapters.push({
                chapter: parseInt($(el).attr("data-num")),
                slug: $(el).find(".eph-num > a").attr("href").split("/")[3],
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
    }
    catch (error) {
        return error;
    }
};
exports.manga = manga;
/**
 * Get image chapter
 * @param slug string
 * @returns
 */
const getImage = async (slug) => {
    try {
        const base = await axios_1.default.get(BASEURL + "/" + slug);
        const $ = cheerio_1.default.load(base.data);
        const web = $("#readerarea").html();
        const $$ = cheerio_1.default.load(web);
        const $$$ = cheerio_1.default.load($$("noscript").html());
        let images = [];
        $$$("p")
            .find("img")
            .each((_, el) => {
            images.push($(el).attr("src"));
        });
        return images;
    }
    catch (error) {
        return error;
    }
};
exports.getImage = getImage;
/**
 * Get manga by search
 * @param query string
 * @returns
 */
const search = async (query) => {
    const list = [];
    try {
        const base = await axios_1.default.get(BASEURL + "/?s=" + query);
        const $ = cheerio_1.default.load(base.data);
        $(".listupd .bs").each((_, el) => {
            list.push({
                slug: $(el).find("a").attr("href")?.split("/")[4],
                title: $(el).find(".tt").text().trim(),
                cover: $(el).find("img").attr("src"),
                url: $(el).find("a").attr("href"),
            });
        });
        return list;
    }
    catch (error) {
        return error;
    }
};
exports.search = search;
