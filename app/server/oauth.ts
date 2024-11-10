import { createServerFn } from "@tanstack/start";
import { atclient } from "./client-metadata";

export const startOAuth = createServerFn("POST", async (handle: string) => {
    const url = await atclient.authorize(handle, { scope: "atproto transition:generic" });
    return url.toString()
})