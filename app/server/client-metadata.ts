import {
  NodeOAuthClient,
  NodeSavedSession,
  NodeSavedState,
} from "@atproto/oauth-client-node";
import { env } from "@config";

const publicUrl = "https://cleric.vielle.dev";
const url = env.DEV ? "http://127.0.0.1:3000" : publicUrl; // since I'm using ipv4, use 127.0.0.1 instead of ::1
const enc = encodeURIComponent;

// this is a temporary db object
const newDb = <T>() => {
  const db: Record<string, any> = {};

  const set = (sub: string, data: T) => {
    db[sub] = data;
  };

  const get = (sub: string) => db[sub];

  const del = (sub: string) => {
    delete db[sub];
  };

  return { get, set, del };
};

// will link to a proper database later
const stateDb = newDb<NodeSavedState>();
const sessionDb = newDb<NodeSavedSession>();

// client
export const atclient = new NodeOAuthClient({
  stateStore: {
    set(key: string, value: NodeSavedState) {
      stateDb.set(key, value);
    },

    get(key: string) {
      const sessionData = stateDb.get(key);
      if (!sessionData) return undefined;

      return sessionData;
    },

    del(key: string) {
      stateDb.del(key);
    },
  },

  sessionStore: {
    set(sub: string, sessionData: NodeSavedSession) {
      sessionDb.set(sub, sessionData);
    },

    get(sub: string) {
      const sessionData = sessionDb.get(sub);
      if (!sessionData) return undefined;

      return sessionData;
    },

    del(sub: string) {
      sessionDb.del(sub);
    },
  },

  clientMetadata: {
    client_name: "Cleric",
    client_id: !env.DEV
      ? `${publicUrl}/client-metadata.json`
      : `http://localhost?redirect_uri=${enc(`${url}/oauth/callback`)}&scope=${enc("atproto transition:generic")}`,
    client_uri: url,
    redirect_uris: [`${url}/oauth/callback`],
    scope: "atproto transition:generic",
    grant_types: ["authorization_code", "refresh_token"],
    application_type: "web",
    token_endpoint_auth_method: "none",
    dpop_bound_access_tokens: true,
  },
});