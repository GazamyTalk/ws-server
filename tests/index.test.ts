import { Socket, io } from "socket.io-client";
import server from "../src";
import { serverConfig } from "../src/config/server";
import { ClientToServerEvents, ServerToClientChatInfo, ServerToClientEvents } from "../src/events";
import SharedDB, { RoomId, ChatInfo } from "shared-db";
import { chatDBConfig } from "../src/config/database";
import { randomString, randomNumber, count0Required } from "./helpers";

describe("test /ws", () => {

    let clientSocket1: Socket<ServerToClientEvents, ClientToServerEvents>;
    let clientSocket2: Socket<ServerToClientEvents, ClientToServerEvents>;
    let clientSocket3: Socket<ServerToClientEvents, ClientToServerEvents>;
    let sharedDB: SharedDB;
    let chatid: string;
    const roomidString1: string = randomString(12);
    const roomidString2: string = randomString(12);
    const port = randomNumber(8000, 9000);

    beforeAll((done) => {
        server.listen(port, async () => {
            sharedDB = await SharedDB.create({ chatDB: chatDBConfig });
            clientSocket1 = io(`http://localhost:${port}/ws`, { query: { roomid: roomidString1, username: "__dev_test_username_1" }});
            clientSocket2 = io(`http://localhost:${port}/ws`, { query: { roomid: roomidString1, username: "__dev_test_username_2" }});
            clientSocket3 = io(`http://localhost:${port}/ws`, { query: { roomid: roomidString2, username: "__dev_test_username_3" }});
            // console.log('running at', port)
            done();
        });
    });

    afterAll((done) => {
        clientSocket1.disconnect();
        clientSocket2.disconnect();
        clientSocket3.disconnect();
        // console.log("try close");
        server.close(async (err) => {
            // console.log("closed. try to remove");
            // console.error(err);
            // console.log(err);
            if (err) throw err;
            // await sharedDB.chats.removeChat(new RoomId(roomidString), chatid);
            // await sharedDB.chats.client.delete({ roomid: new RoomId(roomidString) })
            // console.log(1);
            await sharedDB.chats.client.getRoomCollection(new RoomId(roomidString1)).drop();
            await sharedDB.chats.client.getRoomCollection(new RoomId(roomidString2)).drop();
            // console.log(2);
            await sharedDB.close();
            // console.log(3);
            done();
        });
    });

    test("test broadcasting", (done) => {
        clientSocket1.emit("newChat", {
            content: "__dev_test_content_1",
            type: "string",
            roomid: roomidString1,
            username: "__dev_test_username_1"
        })

        clientSocket3.emit("newChat", {
            content: "__dev_test_content_2",
            type: "string",
            roomid: roomidString2,
            username: "__dev_test_username_3"
        })

        // clientSocket1.on("error", (error) => {
        //     console.log("error:", error);
        //     expect(false).toBe(true);
        //     done();
        // })

        const counter = count0Required(3, done);

        clientSocket1.on("newChat", (chatInfo: ServerToClientChatInfo) => {
            // console.log("1");
            if ( chatid ) {
                expect(chatInfo.chatid.length).toBe(24);
            } else {
                chatid = chatInfo.chatid;
            }
            expect(chatInfo.content).toBe("__dev_test_content_1");
            expect(chatInfo.roomid).toBe(roomidString1);
            expect(chatInfo.time).toBeGreaterThan(10);
            expect(chatInfo.type).toBe("string");
            expect(chatInfo.username).toBe("__dev_test_username_1");
            counter();
        })

        clientSocket2.on("newChat", (chatInfo: ServerToClientChatInfo) => {
            if ( chatid ) {
                expect(chatInfo.chatid.length).toBe(24);
            } else {
                chatid = chatInfo.chatid;
            }
            expect(chatInfo.content).toBe("__dev_test_content_1");
            expect(chatInfo.roomid).toBe(roomidString1);
            expect(chatInfo.time).toBeGreaterThan(10);
            expect(chatInfo.type).toBe("string");
            expect(chatInfo.username).toBe("__dev_test_username_1");
            counter();
        })

        clientSocket3.on("newChat", (chatInfo: ServerToClientChatInfo) => {
            expect(chatInfo.chatid.length).toBe(24);
            expect(chatInfo.content).toBe("__dev_test_content_2");
            expect(chatInfo.roomid).toBe(roomidString2);
            expect(chatInfo.time).toBeGreaterThan(10);
            expect(chatInfo.type).toBe("string");
            expect(chatInfo.username).toBe("__dev_test_username_3");
            counter();
        })
    })

})