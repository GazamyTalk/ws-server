import { ChatInfo } from "shared-db";

export interface ClientToServerChatInfo {
    username: string;
    roomid: string;
    type: string;
    content: string;
}

export interface ServerToClientChatInfo {
    chatid: string;
    username: string;
    roomid: string;
    type: string;
    content: string;
    time: number;
}

export interface ServerToClientEvents {
    newChat: (chatInfo: ServerToClientChatInfo) => void;
    error: (error: string) => void;
}

export interface ClientToServerEvents {
    newChat: (chatInfo: ClientToServerChatInfo) => void;
}

export interface InterServerEvents {
    
}

export interface SocketData {

}