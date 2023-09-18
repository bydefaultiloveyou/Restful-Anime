"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parser_1 = require("./parser");
const app = express_1.default.Router();
app.get("/", async (req, res) => {
    return res.status(200).send("Kuramanime Server is ready 🚀");
});
app.get("/popular", async (req, res) => {
    try {
        const { type, page } = req.query;
        const data = await (0, parser_1.popular)(type, page);
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(200).json({
            error: "internal error",
            message: error,
        });
    }
});
app.get("/search", async (req, res) => {
    try {
        const { page, query } = req.query;
        const data = await (0, parser_1.search)(query, page);
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json({
            error: "Internal Error",
            message: err.toString(),
        });
    }
});
app.get("/genre", async (req, res) => {
    try {
        const { page } = req.query;
        const data = await (0, parser_1.genreList)(page);
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json({
            error: "Internal Error",
            message: err.toString(),
        });
    }
});
app.get("/genre/:genre", async (req, res) => {
    try {
        const genreType = req.params.genre;
        const { page } = req.query;
        const data = await (0, parser_1.genre)(genreType, page);
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json({
            error: "Internal Error",
            message: err.toString(),
        });
    }
});
app.get("/anime/:animeSlug", async (req, res) => {
    try {
        const slug = req.params.animeSlug;
        const data = await (0, parser_1.anime)(slug);
        res.status(200).json(data);
    }
    catch (error) {
        return res.status(200).json({
            error: "internal error",
            message: error,
        });
    }
});
app.get("/anime/:animeId/:episodeId", async (req, res) => {
    try {
        const id = req.params.animeId;
        const ep = req.params.episodeId;
        const data = await (0, parser_1.animeVideoSource)(id, ep);
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json({
            error: "Internal Error",
            message: err.toString(),
        });
    }
});
exports.default = app;
