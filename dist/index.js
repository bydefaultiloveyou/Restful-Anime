"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const kuramanime_1 = __importDefault(require("./source/anime/kuramanime/kuramanime"));
const kiryuu_1 = __importDefault(require("./source/manga/kiryuu/kiryuu"));
const pustakanime_1 = __importDefault(require("./source/anime/pustakanime/pustakanime"));
exports.app = (0, express_1.default)();
// axios;
axios_1.default.defaults.validateStatus = () => true;
axios_1.default.defaults.headers.common["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54";
// middleware
exports.app.use((0, cors_1.default)());
exports.app.use("/kuramanime", kuramanime_1.default);
exports.app.use("/pustakanime", pustakanime_1.default);
exports.app.use("/kiryuu", kiryuu_1.default);
// listen app
exports.app.listen(3000, () => console.warn("Ready to the Moon 🚀"));
