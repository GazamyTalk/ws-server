import SharedDB, { ChatInfo, RoomId } from "shared-db";
import { chatDBConfig } from "./config/database";
import { ClientToServerChatInfo } from "./events";

export async function addGetChat(username: string, roomid: RoomId, chatInfo: ClientToServerChatInfo) : Promise<ChatInfo | Error> {

    if (!(
        typeof chatInfo.content === "string" &&
        typeof chatInfo.type === "string"
    )) {
        return new Error("chatInfo.content and chatInfo.type must be string");
    }

    const sharedDB = await SharedDB.create({ chatDB: chatDBConfig });
    // await sharedDB.chats.addChat(username, roomid, chatInfo.type!, chatInfo.content!, chatInfo.time!);
    const addChatInfo = {
        ...chatInfo,
        roomid: roomid,
        time: Date.now()
    }
    const chatid = await sharedDB.chats.addChat(roomid, username, addChatInfo);

    const addedChatInfo = await sharedDB.chats.getChat(roomid, chatid);
    await sharedDB.close();
    return addedChatInfo;
}