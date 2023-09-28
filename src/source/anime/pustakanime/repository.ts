import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  limit,
} from "firebase/firestore";
import db from "./db";

const animeRef = collection(db, "anime");

/**
 * Get new update anime
 * @returns
 */
export const recent = async () => {
  try {
    const updateRef = collection(db, "/update");
    const q = query(updateRef, limit(10));
    const updateSnapshot = await getDocs(q);
    const updateDoc = updateSnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return updateDoc;
  } catch (error: any) {
    return error;
  }
};

/**
 * Get anime by slug
 * @param slug string
 * @returns
 */
export const getSpesificAnime = async (slug: string) => {
  try {
    const q = query(
      animeRef,
      where("slug", ">=", slug),
      where("slug", "<=", slug + "\uf8ff")
    );

    const animeSnapshot = await getDocs(q);
    let animes: any[] = [];

    await Promise.all(
      animeSnapshot.docs.map(async (animeDoc) => {
        const episodeRef = collection(db, `/anime/${animeDoc.id}/episode`);
        const episodeSnapshot = await getDocs(episodeRef);

        const episodes = episodeSnapshot.docs.map((episodeDoc) => ({
          episode: parseInt(episodeDoc.id.replace("EPS", "")),
          video: episodeDoc.data().video,
        }));

        animes.push({
          ...animeDoc.data(),
          episodes,
        });
      })
    );

    return animes;
  } catch (error: any) {
    return error;
  }
};

/**
 * Add new episode
 * @param slug string
 * @param body string
 * @param episode string
 * @returns
 */
export const addEpisode = async (slug: string, body: any) => {
  try {
    await setDoc(doc(db, `anime/${slug}/episode`, `EPS${body.episode}`), {
      episode: body.episode,
      video: body.video,
    });
    const data = await getSpesificAnime(slug);
    await setDoc(doc(db, "/update", `${slug}-eps${body.episode}`), {
      title: data[0].title,
      cover: data[0].cover,
      slug: data[0].slug,
      episode: body.episode,
    });
  } catch (error) {
    return error;
  }
};

/**
 * Get spesific episode
 * @param slug string
 * @param episode string
 * @returns
 */
export const getEpisode = async (slug: string, episode: number) => {
  try {
    const episodeCollection = collection(db, `/anime/${slug}/episode`);

    const que = query(
      episodeCollection,
      where("episode", "==", episode.toString())
    );

    const episodeSnapshot = await getDocs(que);

    if (!episodeSnapshot.empty) {
      const data = episodeSnapshot.docs[0].data();
      return data;
    } else {
      throw new Error("Episode not found");
    }
  } catch (error) {
    return error;
  }
};

/**
 * Add new anime
 * @param slug string
 * @param body string
 * @returns true
 */
export const addAnime = async (body: any) => {
  try {
    return await setDoc(doc(db, "anime", body.slug), {
      ...body,
    });
  } catch (error: any) {
    return error;
  }
};
