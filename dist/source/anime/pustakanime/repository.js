"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlStreaming = exports.addEpisodeStreaming = exports.getSpesificAnime = exports.addAnime = exports.getAllAnime = exports.recent = void 0;
const firestore_1 = require("firebase/firestore");
const db_1 = __importDefault(require("./db"));
const animeRef = (0, firestore_1.collection)(db_1.default, "anime");
/**
 * Get new update anime
 * @returns
 */
const recent = async () => {
    try {
        const updateRef = (0, firestore_1.collection)(db_1.default, "/update");
        const q = (0, firestore_1.query)(updateRef, (0, firestore_1.limit)(10));
        const updateSnapshot = await (0, firestore_1.getDocs)(q);
        const updateDoc = updateSnapshot.docs.map((doc) => ({
            ...doc.data(),
        }));
        return updateDoc;
    }
    catch (error) {
        return error;
    }
};
exports.recent = recent;
const getAllAnime = async () => {
    try {
        const animeSnapshot = await (0, firestore_1.getDocs)(animeRef);
        const data = animeSnapshot.docs.map((doc) => ({
            ...doc.data(),
        }));
        return data;
    }
    catch (error) {
        return error;
    }
};
exports.getAllAnime = getAllAnime;
/**
 * Add new anime
 * @param slug string
 * @param body string
 * @returns true
 */
const addAnime = async (body) => {
    try {
        return await (0, firestore_1.setDoc)((0, firestore_1.doc)(db_1.default, "anime", body.slug), {
            ...body,
        });
    }
    catch (error) {
        return error;
    }
};
exports.addAnime = addAnime;
/**
 * Get anime by slug
 * @param slug string
 * @returns
 */
const getSpesificAnime = async (slug) => {
    try {
        const q = (0, firestore_1.query)(animeRef, (0, firestore_1.where)("slug", ">=", slug), (0, firestore_1.where)("slug", "<=", slug + "\uf8ff"));
        const animeSnapshot = await (0, firestore_1.getDocs)(q);
        let animes = [];
        await Promise.all(animeSnapshot.docs.map(async (animeDoc) => {
            const episodeRef = (0, firestore_1.collection)(db_1.default, `/anime/${animeDoc.id}/episode`);
            const episodeSnapshot = await (0, firestore_1.getDocs)(episodeRef);
            const episodes = episodeSnapshot.docs.map((episodeDoc) => ({
                episode: parseInt(episodeDoc.id.replace("EPS", "")),
                video: episodeDoc.data().video,
            }));
            animes.push({
                ...animeDoc.data(),
                episodes,
            });
        }));
        return animes;
    }
    catch (error) {
        return error;
    }
};
exports.getSpesificAnime = getSpesificAnime;
/**
 * Add new episode
 * @param slug string
 * @param body string
 * @param episode string
 * @returns
 */
const addEpisodeStreaming = async (slug, body) => {
    try {
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(db_1.default, `anime/${slug}/episode`, `EPS${body.episode}`), {
            episode: body.episode,
            video: body.video,
        });
        const data = await (0, exports.getSpesificAnime)(slug);
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(db_1.default, "/update", `${slug}-eps${body.episode}`), {
            title: data[0].title,
            cover: data[0].cover,
            slug: data[0].slug,
            episode: body.episode,
        });
    }
    catch (error) {
        return error;
    }
};
exports.addEpisodeStreaming = addEpisodeStreaming;
/**
 * Get spesific episode
 * @param slug string
 * @param episode string
 * @returns
 */
const getUrlStreaming = async (slug, episode) => {
    try {
        const episodeCollection = (0, firestore_1.collection)(db_1.default, `/anime/${slug}/episode`);
        const que = (0, firestore_1.query)(episodeCollection, (0, firestore_1.where)("episode", "==", episode.toString()));
        const episodeSnapshot = await (0, firestore_1.getDocs)(que);
        if (!episodeSnapshot.empty) {
            const data = episodeSnapshot.docs[0].data();
            return data;
        }
        else {
            throw new Error("Episode not found");
        }
    }
    catch (error) {
        return error;
    }
};
exports.getUrlStreaming = getUrlStreaming;
