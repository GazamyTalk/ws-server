import { assertValue } from "./helpers"

export const serverConfig = {
    port: Number.parseInt(process.env.SERVER_PORT!),
}
assertValue(serverConfig, "serverConfig", [undefined, NaN]);