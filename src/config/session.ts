import { assertValue } from "./helpers";

export const sessionConfig = {
    url: process.env.SESSION_STORE_URL!,
    secret: process.env.SESSION_SECRET!,
}
assertValue(sessionConfig, 'sessionConfig');
