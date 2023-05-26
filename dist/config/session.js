"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
const helpers_1 = require("./helpers");
exports.sessionConfig = {
    url: process.env.SESSION_STORE_URL,
    secret: process.env.SESSION_SECRET,
};
(0, helpers_1.assertValue)(exports.sessionConfig, 'sessionConfig');
