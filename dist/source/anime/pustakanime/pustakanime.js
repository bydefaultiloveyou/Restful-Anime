"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const repository_1 = require("./repository");
const app = express_1.default.Router();
app.get("/", (req, res) => {
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
app.get("/recent", async (req, res) => {
    try {
        const data = await (0, repository_1.recent)();
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({
            message: "internal error",
            error: error,
        });
    }
});
// ===== Anime
app.get("/animes", async (req, res) => {
    const data = await (0, repository_1.getAllAnime)();
    return res.status(200).json(data);
});
app.get("/anime/:slug", async (req, res) => {
    const { slug } = req.params;
    const data = await (0, repository_1.getSpesificAnime)(slug);
    return res.status(200).json(data);
});
app.post("/anime", async (req, res) => {
    await (0, repository_1.addAnime)(req.body);
    res.status(200).json({ body: req.body });
});
// ===== episode
app.get("/anime/:slug/episode/:episode", async (req, res) => {
    const { slug, episode } = req.params;
    const data = await (0, repository_1.getUrlStreaming)(slug, parseInt(episode));
    res.status(200).json(data);
});
app.post("/anime/:slug/episode", async (req, res) => {
    const { slug } = req.params;
    await (0, repository_1.addEpisodeStreaming)(slug, req.body);
    res.status(200).json({ message: "success" });
});
exports.default = app;
