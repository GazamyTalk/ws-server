import { assertValue } from "./helpers";

export const chatDBConfig = {
    uri: process.env.CHAT_DB_URI!
}
assertValue(chatDBConfig, 'chatDBConfig');