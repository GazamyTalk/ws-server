"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatDBConfig = void 0;
const helpers_1 = require("./helpers");
exports.chatDBConfig = {
    uri: process.env.CHAT_DB_URI
};
(0, helpers_1.assertValue)(exports.chatDBConfig, 'chatDBConfig');
