"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = void 0;
const helpers_1 = require("./helpers");
exports.serverConfig = {
    port: Number.parseInt(process.env.SERVER_PORT),
};
(0, helpers_1.assertValue)(exports.serverConfig, "serverConfig", [undefined, NaN]);
