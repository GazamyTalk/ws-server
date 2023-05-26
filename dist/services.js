"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGetChat = void 0;
const shared_db_1 = __importDefault(require("shared-db"));
const database_1 = require("./config/database");
function addGetChat(username, roomid, chatInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(typeof chatInfo.content === "string" &&
            typeof chatInfo.type === "string")) {
            return new Error("chatInfo.content and chatInfo.type must be string");
        }
        const sharedDB = yield shared_db_1.default.create({ chatDB: database_1.chatDBConfig });
        // await sharedDB.chats.addChat(username, roomid, chatInfo.type!, chatInfo.content!, chatInfo.time!);
        const addChatInfo = Object.assign(Object.assign({}, chatInfo), { roomid: roomid, time: Date.now() });
        const chatid = yield sharedDB.chats.addChat(roomid, username, addChatInfo);
        const addedChatInfo = yield sharedDB.chats.getChat(roomid, chatid);
        yield sharedDB.close();
        return addedChatInfo;
    });
}
exports.addGetChat = addGetChat;
