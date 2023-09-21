import express, { Request, Response } from "express";
import { getImage, manga, search, update } from "./parser";

const app = express.Router();

app.get("/", async (req: any, res: any) => {
  return res.status(200).send("Kiryuu Server is ready 🚀");
});

app.get("/update", async (req: Request, res: Response) => {
  try {
    const data = await update();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: "internal error",
      message: error,
    });
  }
});

app.get("/manga/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const data = await manga(slug);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: "internal error",
      message: error,
    });
  }
});

app.get("/image/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const data = await getImage(slug);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: "internal error",
      message: error,
    });
  }
});

app.get("/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const data = await search(query);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: "internal error",
      message: error,
    });
  }
});

export default app;
