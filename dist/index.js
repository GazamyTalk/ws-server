"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
//debugger
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import express, { NextFunction } from "express";
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server_1 = require("./config/server");
const shared_db_1 = require("shared-db");
const services = __importStar(require("./services"));
// const app = express();
const port = server_1.serverConfig.port;
const server = http_1.default.createServer();
const ioConnect = new socket_io_1.Server(server);
// const io = ioConnect.of(/^\/ws\/[0-9a-f]+$/);
const io = ioConnect.of("/ws");
// const io = startSocketServer(server);
io.on("connection", (socket) => {
    const username = socket.handshake.query.username;
    const roomidString = socket.handshake.query.roomid;
    if (!(typeof username === "string" &&
        typeof roomidString === "string")) {
        socket.disconnect();
        return;
    }
    // const nspSplit = socket.nsp.name.split('/');
    const roomid = new shared_db_1.RoomId(roomidString);
    socket.join(roomidString);
    socket.on("newChat", (chatInfo) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield services.addGetChat(username, roomid, chatInfo);
        if (result instanceof Error) {
            socket.emit("error", result.message);
            return;
        }
        else {
            io.to(roomidString).emit("newChat", Object.assign(Object.assign({}, result), { roomid: roomidString }));
        }
    }));
    socket.on("disconnect", () => {
        socket.leave(roomidString);
        socket.disconnect();
    });
});
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:8002',
//         credentials: true
//     }
// }); // socket 서버 실행
// io.on("connection", (socket) => {
//     // const res: any = { headers: {} };
//     // sessionMiddleware(socket.request as any, res, () => {
//     //     console.log('클라이언트와 socket 연결되었습니다.');
//     //     try {
//     //         const test = (socket.request as any).session;
//     //         test.testdata = 1;
//     //         test.save((err: Error | undefined) => {
//     //             if (err) throw err;
//     //             socket.emit("test", "url", socket.request.url)
//     //             socket.emit("test", "method", socket.request.method)
//     //             socket.emit("test", "headers", socket.request.headers)
//     //             socket.emit("test", "statusCode", socket.request.statusCode)
//     //             socket.emit("test", "session", (socket.request as any)['session']);
//     //             socket.emit("test", "res", res);
//     //             socket.disconnect();
//     //         })
//     //         // socket.emit("test", "session.username", (socket.request as any)['session'].username);
//     //     } catch {
//     //         console.log('err');
//     //     }
//     // });
//     socket.emit("test", "query", socket.handshake.query);
//     socket.disconnect();
// });
// app.use(sessionMiddleware)
// app.use((req, res, next) => {
//     console.log('session:', req.session);
// })
if (require.main === module) {
    server.listen(port, () => console.log(`server is running ${port}`));
}
exports.default = server;
