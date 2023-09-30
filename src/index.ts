import express from "express";
import cors from "cors";
import axios from "axios";
import kuramanime from "./source/anime/kuramanime/kuramanime";
import kiryuu from "./source/manga/kiryuu/kiryuu";
import pustakanime from "./source/anime/pustakanime/pustakanime";
import { getAllAnime } from "./source/anime/pustakanime/repository";

export const app = express();

// axios;
axios.defaults.validateStatus = () => true;
axios.defaults.headers.common["User-Agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54";

// middleware
app.use(cors());

// anime
app.use("/kuramanime", kuramanime);
app.use("/pustakanime", pustakanime);

// manga
app.use("/kiryuu", kiryuu);

// listen app
app.listen(3000, () => console.warn("Ready to the Moon 🚀"));
