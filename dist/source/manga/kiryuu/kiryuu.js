"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parser_1 = require("./parser");
const app = express_1.default.Router();
app.get("/", async (req, res) => {
    return res.status(200).send("Kiryuu Server is ready 🚀");
});
app.get("/update", async (req, res) => {
    try {
        const data = await (0, parser_1.update)();
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({
            error: "internal error",
            message: error,
        });
    }
});
app.get("/manga/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await (0, parser_1.manga)(slug);
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({
            error: "internal error",
            message: error,
        });
    }
});
app.get("/image/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await (0, parser_1.getImage)(slug);
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({
            error: "internal error",
            message: error,
        });
    }
});
app.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        const data = await (0, parser_1.search)(query);
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({
            error: "internal error",
            message: error,
        });
    }
});
exports.default = app;
