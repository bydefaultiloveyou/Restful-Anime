import express, { Request, Response } from "express";
import {
  addEpisode,
  addAnime,
  recent,
  getEpisode,
  getSpesificAnime,
} from "./repository";

const app = express.Router();

app.get("/", (req: Request, res: Response) => {
  return res.send("Pustakanime to the moon!!");
});

/**
 * POST /anime/:slug/episode
 * GET  /anime/:slug/episode/:episode
 * POST /anime
 * GET  /anime/:slug
 *
 */

/**
 * Get Update
 */
app.get("/recent", async (req: Request, res: Response) => {
  try {
    const data = await recent();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "internal error",
      error: error,
    });
  }
});

// ===== Anime
app.get("/anime/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await getSpesificAnime(slug);
  return res.status(200).json(data);
});

app.post("/anime", async (req: Request, res: Response) => {
  await addAnime(req.body);
  res.status(200).json({ message: "success" });
});

// ===== episode
app.get(
  "/anime/:slug/episode/:episode",
  async (req: Request, res: Response) => {
    const { slug, episode } = req.params;
    const data = await getEpisode(slug, parseInt(episode));
    res.status(200).json(data);
  }
);

app.post("/anime/:slug/episode", async (req: Request, res: Response) => {
  const { slug } = req.params;
  await addEpisode(slug, req.body);
  res.status(200).json({ message: "success" });
});

export default app;
