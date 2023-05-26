//debugger
import dotenv from "dotenv";
dotenv.config();

// import express, { NextFunction } from "express";
import http from "http";
import socketIo, { Server } from "socket.io";
import { serverConfig } from "./config/server";
import { ChatInfo, RoomId } from "shared-db";
import { ClientToServerChatInfo, ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./events";
import * as services from "./services";

// const app = express();
const port = serverConfig.port;

const server = http.createServer();
const ioConnect = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server);
// const io = ioConnect.of(/^\/ws\/[0-9a-f]+$/);
const io = ioConnect.of("/ws");

// const io = startSocketServer(server);
io.on("connection", (socket) => {

    const username = socket.handshake.query.username;
    const roomidString = socket.handshake.query.roomid;
    if (!(
        typeof username === "string" &&
        typeof roomidString === "string"
    )) {
        socket.disconnect();
        return;
    }

    // const nspSplit = socket.nsp.name.split('/');
    const roomid = new RoomId(roomidString);
    socket.join(roomidString);

    socket.on("newChat", async (chatInfo: ClientToServerChatInfo) => {
        const result = await services.addGetChat(username, roomid, chatInfo);
        if ( result instanceof Error ) {
            socket.emit("error", result.message);
            return;
        } else {
            io.to(roomidString).emit("newChat", { ...result, roomid: roomidString });
        }
    })

    socket.on("disconnect", () => {
        socket.leave(roomidString);
        socket.disconnect();
    })

})

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

if ( require.main === module ) {
    server.listen(port, () => console.log(`server is running ${port}`));
}

export default server;